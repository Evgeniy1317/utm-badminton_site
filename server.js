/**
 * Node.js сервер для работы с формой и MySQL
 * Запуск: node server.js
 * Сайт будет доступен на http://localhost:3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const mysql = require('mysql2/promise');

// Конфигурация базы данных
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'utm13102005',
    database: 'badminton_club',
    charset: 'utf8mb4'
};

// Создание пула подключений к MySQL
let pool = null;

async function initDatabase() {
    try {
        // Сначала подключаемся без указания базы данных
        const tempConnection = await mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password
        });

        // Создаем базу данных, если её нет
        await tempConnection.query(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
        await tempConnection.end();

        // Создаем пул подключений
        pool = mysql.createPool({
            ...dbConfig,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        // Создаем таблицу, если её нет
        const createTableSql = `
            CREATE TABLE IF NOT EXISTS bookings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100) NOT NULL COMMENT 'Имя и фамилия',
                phone VARCHAR(20) NOT NULL COMMENT 'Номер телефона',
                email VARCHAR(100) DEFAULT NULL COMMENT 'Email адрес',
                level ENUM('beginner', 'intermediate', 'advanced', 'professional') NOT NULL DEFAULT 'beginner' COMMENT 'Уровень подготовки',
                hall ENUM('hall1', 'hall2') NOT NULL DEFAULT 'hall1' COMMENT 'Выбранный зал',
                day ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday') NOT NULL COMMENT 'День недели',
                message TEXT DEFAULT NULL COMMENT 'Дополнительное сообщение',
                status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending' COMMENT 'Статус записи',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT 'Дата создания записи',
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'Дата последнего обновления',
                INDEX idx_phone (phone),
                INDEX idx_email (email),
                INDEX idx_status (status),
                INDEX idx_created_at (created_at)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='Таблица записей на тренировки'
        `;

        const connection = await pool.getConnection();
        await connection.query(createTableSql);
        connection.release();

        console.log('✓ База данных инициализирована');
    } catch (error) {
        console.error('Ошибка инициализации базы данных:', error.message);
    }
}

// MIME типы для разных файлов
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon'
};

// Функция для получения MIME типа
function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return mimeTypes[ext] || 'application/octet-stream';
}

// Функция для обработки статических файлов
function serveStaticFile(filePath, res) {
    // Декодируем URL (для обработки пробелов и спецсимволов)
    try {
        filePath = decodeURIComponent(filePath);
    } catch (e) {
        // Если декодирование не удалось, используем исходный путь
    }
    
    const fullPath = path.join(__dirname, filePath);
    
    // Проверка безопасности (предотвращение выхода за пределы директории)
    const normalizedFullPath = path.normalize(fullPath);
    const normalizedDir = path.normalize(__dirname);
    
    if (!normalizedFullPath.startsWith(normalizedDir)) {
        res.writeHead(403);
        res.end('Forbidden');
        return;
    }

    fs.readFile(normalizedFullPath, (err, data) => {
        if (err) {
            console.error('Ошибка чтения файла:', normalizedFullPath, err.message);
            res.writeHead(404);
            res.end('File not found: ' + filePath);
        } else {
            res.writeHead(200, { 'Content-Type': getMimeType(filePath) });
            res.end(data);
        }
    });
}

// Функция для обработки POST запроса формы
async function handleBookingSubmit(req, res) {
    let body = '';
    
    req.on('data', chunk => {
        body += chunk.toString();
    });
    
    req.on('end', async () => {
        try {
            const formData = JSON.parse(body);
            
            // Валидация данных
            const errors = {};
            
            if (!formData.name || formData.name.trim().length < 2) {
                errors.name = 'Имя обязательно для заполнения (минимум 2 символа)';
            }
            
            if (!formData.phone || !/^\+?[0-9\s\-\(\)]{10,20}$/.test(formData.phone)) {
                errors.phone = 'Неверный формат телефона';
            }
            
            if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
                errors.email = 'Неверный формат email';
            }
            
            const allowedLevels = ['beginner', 'intermediate', 'advanced', 'professional'];
            if (!allowedLevels.includes(formData.level)) {
                errors.level = 'Неверный уровень подготовки';
            }
            
            const allowedHalls = ['hall1', 'hall2'];
            if (!allowedHalls.includes(formData.hall)) {
                errors.hall = 'Неверный зал';
            }
            
            const allowedDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
            if (!allowedDays.includes(formData.day)) {
                errors.day = 'Неверный день недели';
            }
            
            if (Object.keys(errors).length > 0) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    message: 'Ошибки валидации',
                    errors: errors
                }));
                return;
            }
            
            // Сохранение в базу данных
            if (!pool) {
                throw new Error('База данных не инициализирована');
            }
            
            const connection = await pool.getConnection();
            const [result] = await connection.query(
                `INSERT INTO bookings (name, phone, email, level, hall, day, message, status) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
                [
                    formData.name.trim(),
                    formData.phone.trim(),
                    formData.email ? formData.email.trim() : null,
                    formData.level,
                    formData.hall,
                    formData.day,
                    formData.message ? formData.message.trim() : null
                ]
            );
            connection.release();
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                message: 'Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.',
                booking_id: result.insertId
            }));
            
        } catch (error) {
            console.error('Ошибка обработки формы:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                message: 'Произошла ошибка при сохранении данных. Пожалуйста, попробуйте позже.',
                error: process.env.NODE_ENV === 'development' ? error.message : undefined
            }));
        }
    });
}

// Функция для получения всех записей
async function handleGetBookings(req, res) {
    try {
        if (!pool) {
            throw new Error('База данных не инициализирована');
        }
        
        const connection = await pool.getConnection();
        const [rows] = await connection.query(
            'SELECT * FROM bookings ORDER BY created_at DESC'
        );
        connection.release();
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            bookings: rows
        }));
    } catch (error) {
        console.error('Ошибка получения записей:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: false,
            message: 'Ошибка при получении данных'
        }));
    }
}

// Функция для обновления статуса записи
async function handleUpdateStatus(req, res) {
    let body = '';
    
    req.on('data', chunk => {
        body += chunk.toString();
    });
    
    req.on('end', async () => {
        try {
            const { id, status } = JSON.parse(body);
            
            if (!id || !status) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    message: 'Не указаны ID или статус'
                }));
                return;
            }
            
            const allowedStatuses = ['pending', 'confirmed', 'cancelled'];
            if (!allowedStatuses.includes(status)) {
                res.writeHead(400, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({
                    success: false,
                    message: 'Неверный статус'
                }));
                return;
            }
            
            if (!pool) {
                throw new Error('База данных не инициализирована');
            }
            
            const connection = await pool.getConnection();
            await connection.query(
                'UPDATE bookings SET status = ? WHERE id = ?',
                [status, id]
            );
            connection.release();
            
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: true,
                message: 'Статус обновлен'
            }));
        } catch (error) {
            console.error('Ошибка обновления статуса:', error);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                success: false,
                message: 'Ошибка при обновлении статуса'
            }));
        }
    });
}

// Функция для удаления всех записей
async function handleDeleteAll(req, res) {
    try {
        if (!pool) {
            throw new Error('База данных не инициализирована');
        }
        
        const connection = await pool.getConnection();
        await connection.query('DELETE FROM bookings');
        connection.release();
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: true,
            message: 'Все записи удалены'
        }));
    } catch (error) {
        console.error('Ошибка удаления записей:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            success: false,
            message: 'Ошибка при удалении записей'
        }));
    }
}

// Создание HTTP сервера
const server = http.createServer(async (req, res) => {
    // CORS заголовки
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    
    // API маршруты
    if (pathname === '/api/submit_booking' && req.method === 'POST') {
        await handleBookingSubmit(req, res);
        return;
    }
    
    if (pathname === '/api/get_bookings' && req.method === 'GET') {
        await handleGetBookings(req, res);
        return;
    }
    
    if (pathname === '/api/update_status' && req.method === 'POST') {
        await handleUpdateStatus(req, res);
        return;
    }
    
    if (pathname === '/api/delete_all' && req.method === 'POST') {
        await handleDeleteAll(req, res);
        return;
    }
    
    // Статические файлы
    let filePath = pathname === '/' ? '/index.html' : pathname;
    
    // Если файл не найден, пробуем index.html
    serveStaticFile(filePath, res);
});

// Инициализация и запуск сервера
const PORT = 3000;

async function startServer() {
    await initDatabase();
    
    server.listen(PORT, () => {
        console.log(`\n🚀 Сервер запущен на http://localhost:${PORT}`);
        console.log(`📝 Форма записи: http://localhost:${PORT}/index.html`);
        console.log(`📊 Просмотр записей: http://localhost:${PORT}/admin/view_bookings.html\n`);
    });
}

startServer().catch(console.error);

