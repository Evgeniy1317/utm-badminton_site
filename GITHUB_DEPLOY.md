# 🚀 Деплой на GitHub Pages

## 📋 Пошаговая инструкция:

### 1. **Создание репозитория на GitHub**
1. Зайдите на [github.com](https://github.com)
2. Нажмите "New repository"
3. Название: `utm-badminton` (или любое другое)
4. Сделайте репозиторий **публичным** (для бесплатного GitHub Pages)
5. НЕ добавляйте README, .gitignore, лицензию
6. Нажмите "Create repository"

### 2. **Загрузка файлов**
```bash
# В папке проекта выполните:
git init
git add .
git commit -m "Initial commit: Badminton club website"
git branch -M main
git remote add origin https://github.com/ВАШ_USERNAME/utm-badminton.git
git push -u origin main
```

### 3. **Настройка GitHub Pages**
1. Зайдите в настройки репозитория (Settings)
2. Найдите раздел "Pages" в левом меню
3. В "Source" выберите "Deploy from a branch"
4. Выберите ветку "main" и папку "/ (root)"
5. Нажмите "Save"
6. Сайт будет доступен по адресу: `https://ВАШ_USERNAME.github.io/utm-badminton`

## 📧 Настройка формы для GitHub Pages:

### **Вариант A: Netlify (рекомендуется)**
1. Зайдите на [netlify.com](https://netlify.com)
2. Подключите ваш GitHub репозиторий
3. Netlify автоматически обработает форму с `data-netlify="true"`
4. Заявки будут приходить в панель Netlify

### **Вариант B: EmailJS**
1. Откройте `emailjs-setup.html` в браузере
2. Следуйте инструкциям по настройке
3. Обновите `form-fallback.js` с вашими ключами
4. Подключите EmailJS к `index.html`

### **Вариант C: Formspree**
1. Зайдите на [formspree.io](https://formspree.io)
2. Создайте новую форму
3. Получите endpoint URL
4. Обновите JavaScript для отправки на Formspree

## 🔧 Файлы для GitHub Pages:

### ✅ **Уже готово:**
- `index.html` - главная страница
- `css/style.css` - стили
- `script.js` - JavaScript
- `netlify.toml` - конфигурация для Netlify
- `form-fallback.js` - альтернативная обработка формы

### ❌ **Удалить перед деплоем:**
- `form-handler.php` - не работает на GitHub Pages
- `test-php.php` - тестовый файл
- `emailjs-setup.html` - инструкция (можно оставить)

## 🎯 Рекомендуемый план:

1. **Создайте репозиторий** на GitHub
2. **Загрузите файлы** через git
3. **Настройте GitHub Pages**
4. **Подключите Netlify** для обработки формы
5. **Протестируйте** форму записи

## 📱 Дополнительные возможности:

### **Кастомный домен:**
- Купите домен (например, `dtm-badminton.com`)
- Настройте DNS записи
- Добавьте домен в настройки GitHub Pages

### **SSL сертификат:**
- GitHub Pages автоматически предоставляет SSL
- Ваш сайт будет доступен по HTTPS

### **CDN:**
- GitHub Pages использует CDN
- Сайт будет быстро загружаться по всему миру

## 🚀 Готово к деплою!

Ваш сайт готов для загрузки на GitHub Pages. Выберите один из вариантов обработки формы и следуйте инструкциям выше.
