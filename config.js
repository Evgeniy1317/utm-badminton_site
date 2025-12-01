/**
 * Конфигурация для работы формы
 * Автоматически определяет, где запущен сайт
 */

// Определяем окружение
const isLocalhost = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1';

const isGitHubPages = window.location.hostname.includes('github.io') ||
                      window.location.hostname.includes('github.com');

// Конфигурация API
const API_CONFIG = {
    // Для локальной разработки используем локальный сервер
    local: {
        apiUrl: '/api/submit_booking',
        getBookingsUrl: '/api/get_bookings'
    },
    
    // Для GitHub Pages используем внешний API
    production: {
        // ЗАМЕНИТЕ НА ВАШ РЕАЛЬНЫЙ API URL
        // Например: https://your-api.herokuapp.com/api/submit_booking
        // Или: https://your-api.vercel.app/api/submit_booking
        apiUrl: 'https://your-api-url.com/api/submit_booking',
        getBookingsUrl: 'https://your-api-url.com/api/get_bookings'
    }
};

// Экспортируем конфигурацию
const getApiUrl = () => {
    if (isLocalhost) {
        return API_CONFIG.local.apiUrl;
    } else {
        return API_CONFIG.production.apiUrl;
    }
};

const getBookingsUrl = () => {
    if (isLocalhost) {
        return API_CONFIG.local.getBookingsUrl;
    } else {
        return API_CONFIG.production.getBookingsUrl;
    }
};

// Для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { getApiUrl, getBookingsUrl, isLocalhost, isGitHubPages };
}



