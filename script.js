// UTM Badminton Club - JavaScript функциональность

document.addEventListener('DOMContentLoaded', function() {
    // Определяем мобильное устройство для изоляции стилей
    function detectMobileDevice() {
        const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        if (isMobile) {
            document.body.classList.add('mobile-device');
        } else {
            document.body.classList.remove('mobile-device');
        }
    }
    
    // Определяем устройство при загрузке
    detectMobileDevice();
    
    // Определяем устройство при изменении размера окна
    window.addEventListener('resize', detectMobileDevice);
    
    // Скрытие/показ шапки при скролле (только на мобильных)
    let lastScrollTop = 0;
    let isScrolling = false;
    
    function handleHeaderScroll() {
        if (window.innerWidth > 768) return; // Только для мобильных
        
        const header = document.querySelector('.header');
        const currentScrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (currentScrollTop > lastScrollTop && currentScrollTop > 100) {
            // Скролл вниз - скрываем шапку
            header.classList.add('hidden');
        } else {
            // Скролл вверх - показываем шапку
            header.classList.remove('hidden');
        }
        
        lastScrollTop = currentScrollTop;
    }
    
    // Оптимизированный обработчик скролла
    function throttledScroll() {
        if (!isScrolling) {
            requestAnimationFrame(() => {
                handleHeaderScroll();
                isScrolling = false;
            });
            isScrolling = true;
        }
    }
    
    window.addEventListener('scroll', throttledScroll);
    
// Переключатели темы (десктопный и мобильный)
const themeToggle = document.getElementById('themeToggle');
const mobileThemeToggle = document.getElementById('mobileThemeToggle');
let isDarkTheme = localStorage.getItem('theme') === 'dark';

// Обработчик десктопного переключателя
if (themeToggle) {
    themeToggle.addEventListener('change', function() {
        isDarkTheme = this.checked;
        const newTheme = isDarkTheme ? 'dark' : 'light';
        
        // Сохраняем в localStorage
        localStorage.setItem('theme', newTheme);
        
        // Применяем тему
        setTheme(newTheme);
        
        // Синхронизируем мобильный переключатель
        if (mobileThemeToggle) {
            mobileThemeToggle.checked = this.checked;
        }
    });
}

// Обработчик мобильного переключателя с оптимизацией
if (mobileThemeToggle) {
    let isProcessing = false;
    
    mobileThemeToggle.addEventListener('change', function() {
        // Предотвращаем множественные клики
        if (isProcessing) return;
        isProcessing = true;
        
        // Используем requestAnimationFrame для плавности
        requestAnimationFrame(() => {
            isDarkTheme = this.checked;
            const newTheme = isDarkTheme ? 'dark' : 'light';
            
            // Сохраняем в localStorage
            localStorage.setItem('theme', newTheme);
            
            // Применяем тему
            setTheme(newTheme);
            
            // Синхронизируем десктопный переключатель
            if (themeToggle) {
                themeToggle.checked = this.checked;
            }
            
            // Разрешаем следующий клик через небольшую задержку
            setTimeout(() => {
                isProcessing = false;
            }, 100);
        });
    });
}

// Синхронизация при загрузке
if (themeToggle && mobileThemeToggle) {
    mobileThemeToggle.checked = themeToggle.checked;
}

// Мобильное гамбургер-меню
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileMenuClose = document.getElementById('mobileMenuClose');
const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

// Функция открытия/закрытия меню
function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');
}

// Функция закрытия меню
function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    mobileMenuToggle.classList.remove('active');
    document.body.style.overflow = '';
}

// Обработчики событий
if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
}

if (mobileMenuClose) {
    mobileMenuClose.addEventListener('click', closeMobileMenu);
}

// Закрытие меню при клике на ссылку
mobileNavLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetSection = this.getAttribute('data-section');
        const targetElement = document.getElementById(targetSection);
        
        if (targetElement) {
            // Плавная прокрутка к секции
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        
        // Закрываем меню
        closeMobileMenu();
    });
});

// Закрытие меню при клике вне его
document.addEventListener('click', function(e) {
    if (mobileMenu.classList.contains('active') && 
        !mobileMenu.contains(e.target) && 
        !mobileMenuToggle.contains(e.target)) {
        closeMobileMenu();
    }
});

// Закрытие меню при нажатии Escape
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
    }
});
    
    // Проверка загрузки видео и автовоспроизведения
    const heroVideo = document.querySelector('.hero-video');
    const videoPlayBtn = document.getElementById('videoPlayBtn');
    const heroFallback = document.querySelector('.hero-fallback');
    
    if (heroVideo) {
        // Определяем Яндекс браузер
        const isYandexBrowser = navigator.userAgent.includes('YaBrowser') || 
                               navigator.userAgent.includes('Yandex');
        
        // Устанавливаем атрибуты для Яндекс Браузера
        heroVideo.setAttribute('webkit-playsinline', 'true');
        heroVideo.setAttribute('x5-video-player-type', 'h5');
        heroVideo.setAttribute('x5-video-player-fullscreen', 'true');
        heroVideo.setAttribute('x5-video-orientation', 'portrait');
        
        // Принудительно скрываем все контролы
        heroVideo.controls = false;
        heroVideo.removeAttribute('controls');
        heroVideo.setAttribute('controlslist', 'nodownload nofullscreen noremoteplayback');
        heroVideo.setAttribute('disableRemotePlayback', '');
        
        // Дополнительные настройки для скрытия контролов
        heroVideo.style.pointerEvents = 'none';
        heroVideo.style.outline = 'none';
        heroVideo.style.border = 'none';
        heroVideo.style.display = 'block';
        heroVideo.style.zIndex = '1';
        heroVideo.style.position = 'absolute';
        heroVideo.style.top = '0';
        heroVideo.style.left = '0';
        heroVideo.style.width = '100%';
        heroVideo.style.height = '100%';
        heroVideo.style.objectFit = 'cover';
        
        // Для Яндекс браузера устанавливаем дополнительные атрибуты
        if (isYandexBrowser) {
            heroVideo.setAttribute('x5-video-player-type', 'h5-page');
            heroVideo.setAttribute('x5-video-player-fullscreen', 'false');
            heroVideo.setAttribute('x5-video-orientation', 'portrait');
            heroVideo.setAttribute('x5-video-player', 'true');
        }
        
        // Попытка автовоспроизведения с задержкой
        setTimeout(() => {
            // Устанавливаем атрибуты для лучшей совместимости
            heroVideo.muted = true;
            heroVideo.playsInline = true;
            heroVideo.preload = 'auto';
            
            // Принудительно загружаем видео
            heroVideo.load();
            
            const playPromise = heroVideo.play();
            
            if (playPromise !== undefined) {
                playPromise.then(() => {
                    console.log('Видео автовоспроизведение запущено');
                    if (videoPlayBtn) videoPlayBtn.style.display = 'none';
                    if (heroFallback) heroFallback.style.display = 'none';
                }).catch((error) => {
                    console.log('Автовоспроизведение заблокировано:', error);
                    // Показываем кнопку воспроизведения
                    if (videoPlayBtn) videoPlayBtn.style.display = 'flex';
                    
                    // Для Яндекс браузера показываем fallback
                    if (isYandexBrowser && heroFallback) {
                        heroFallback.style.display = 'block';
                    }
                    
                    // Дополнительная попытка через взаимодействие пользователя
                    document.addEventListener('click', function tryPlayOnce() {
                        heroVideo.play().then(() => {
                            if (videoPlayBtn) videoPlayBtn.style.display = 'none';
                            if (heroFallback) heroFallback.style.display = 'none';
                            document.removeEventListener('click', tryPlayOnce);
                        }).catch(() => {});
                    }, { once: true });
                });
            }
        }, isYandexBrowser ? 2000 : 1000);
        
        heroVideo.addEventListener('loadstart', function() {
            console.log('Видео начало загружаться');
        });
        
        heroVideo.addEventListener('canplay', function() {
            console.log('Видео готово к воспроизведению');
        });
        
        
        heroVideo.addEventListener('loadeddata', function() {
            console.log('Видео загружено успешно');
            
            // Принудительно устанавливаем стили для overlay
            const heroOverlay = document.querySelector('.hero-overlay');
            if (heroOverlay) {
                heroOverlay.style.zIndex = '0';
                heroOverlay.style.position = 'absolute';
                heroOverlay.style.top = '0';
                heroOverlay.style.left = '0';
                heroOverlay.style.width = '100%';
                heroOverlay.style.height = '100%';
            }
            
            // Дополнительная попытка воспроизведения для Яндекс Браузера
            if (heroVideo.paused) {
                setTimeout(() => {
                    heroVideo.play().catch(() => {
                        if (videoPlayBtn) videoPlayBtn.style.display = 'flex';
                    });
                }, 500);
            }
        });
        
        // Обработка для Яндекс Браузера
        heroVideo.addEventListener('canplaythrough', function() {
            console.log('Видео готово к воспроизведению полностью');
            if (heroVideo.paused && !videoPlayBtn.style.display || videoPlayBtn.style.display === 'none') {
                heroVideo.play().catch(() => {
                    if (videoPlayBtn) videoPlayBtn.style.display = 'flex';
                });
            }
        });
        
        // Обработка клика по кнопке воспроизведения
        if (videoPlayBtn) {
            videoPlayBtn.addEventListener('click', function() {
                // Принудительно загружаем видео перед воспроизведением
                heroVideo.load();
                
                heroVideo.play().then(() => {
                    videoPlayBtn.style.display = 'none';
                    if (heroFallback) heroFallback.style.display = 'none';
                    console.log('Видео запущено по клику');
                }).catch((error) => {
                    console.error('Ошибка воспроизведения:', error);
                    // Для Яндекс браузера показываем fallback
                    if (isYandexBrowser && heroFallback) {
                        heroFallback.style.display = 'block';
                    }
                });
            });
        }
        
        // Дополнительная функция для принудительного воспроизведения в Яндекс браузере
        function forcePlayVideo() {
            if (isYandexBrowser && heroVideo.paused) {
                heroVideo.load();
                heroVideo.play().then(() => {
                    console.log('Принудительное воспроизведение в Яндекс браузере успешно');
                    if (videoPlayBtn) videoPlayBtn.style.display = 'none';
                    if (heroFallback) heroFallback.style.display = 'none';
                }).catch((error) => {
                    console.log('Принудительное воспроизведение не удалось:', error);
                });
            }
        }
        
        // Попытка принудительного воспроизведения через 3 секунды для Яндекс браузера
        if (isYandexBrowser) {
            setTimeout(forcePlayVideo, 3000);
        }
    }
    
    // Плавная прокрутка для навигации
    const navLinks = document.querySelectorAll('.nav a[href^="#"]');
    const logoLink = document.querySelector('.logo-link');
    
    // Обработка клика по логотипу
    if (logoLink) {
        logoLink.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            // Если ссылка ведет на другую страницу, не предотвращаем стандартное поведение
            if (href && href.includes('index.html')) {
                // Это переход на другую страницу, разрешаем стандартное поведение
                return;
            }
            // Если это якорь на той же странице, прокручиваем
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Обработка якорей при загрузке страницы (для переходов с других страниц)
    function handleAnchorOnLoad() {
        if (window.location.hash) {
            const hash = window.location.hash;
            const targetSection = document.querySelector(hash);
            
            if (targetSection) {
                // Небольшая задержка для полной загрузки страницы
                setTimeout(() => {
                    const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                    const targetPosition = targetSection.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }, 100);
            }
        }
    }
    
    // Вызываем обработку якорей при загрузке
    handleAnchorOnLoad();
    
    // Также обрабатываем изменение hash (если пользователь кликает на якорь после загрузки)
    window.addEventListener('hashchange', handleAnchorOnLoad);
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Анимации при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Наблюдаем за элементами с анимацией
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));

    // Валидация формы записи
    const bookingForm = document.getElementById('bookingForm');
    const successMessage = document.getElementById('successMessage');

    // Функция валидации имени
    function validateName(name) {
        // Разрешаем любые буквы, пробелы, дефисы и апострофы (2-50 символов)
        const nameRegex = /^[\p{L}\s\-']{2,50}$/u;
        return nameRegex.test(name.trim());
    }

    // Функция валидации телефона
    function validatePhone(phone) {
        const phoneRegex = /^(\+373|0)[0-9]{8}$/;
        return phoneRegex.test(phone.replace(/\s/g, ''));
    }

    // Функция валидации email
    function validateEmail(email) {
        if (!email) return true; // email не обязателен
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Функция показа ошибки
    function showError(fieldId, message) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');
        
        if (field) {
            field.classList.add('error');
        }
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    // Функция скрытия ошибки
    function hideError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');
        
        if (field) {
            field.classList.remove('error');
        }
        if (errorElement) {
            errorElement.classList.remove('show');
        }
    }

    // Обработка отправки формы
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        
        // Получаем значения полей
        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const level = document.getElementById('level').value;
        const hall = document.getElementById('hall').value;
        const day = document.getElementById('day').value;
        const message = document.getElementById('message').value.trim();

        // Валидация имени
        if (!name) {
            showError('name', 'Пожалуйста, введите ваше имя и фамилию');
            isValid = false;
        } else if (!validateName(name)) {
            showError('name', 'Имя должно содержать только буквы, пробелы, дефисы и апострофы (2-50 символов)');
            isValid = false;
        } else {
            hideError('name');
        }

        // Валидация телефона
        if (!phone) {
            showError('phone', 'Пожалуйста, введите номер телефона');
            isValid = false;
        } else if (!validatePhone(phone)) {
            showError('phone', 'Введите корректный номер телефона (например: +373 XX XXX XXX)');
            isValid = false;
        } else {
            hideError('phone');
        }

        // Валидация email
        if (email && !validateEmail(email)) {
            showError('email', 'Введите корректный email адрес');
            isValid = false;
        } else {
            hideError('email');
        }

        // Если форма валидна, отправляем данные
        if (isValid) {
            // Показываем индикатор загрузки
            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Отправка...';
            submitBtn.disabled = true;
            
            // Подготавливаем данные для отправки
            const formData = {
                name: name,
                phone: phone,
                email: email || '',
                level: level,
                hall: hall,
                day: day,
                message: message || ''
            };
            
            // Проверка: если сайт открыт через file://, показываем сообщение без сохранения в БД
            if (window.location.protocol === 'file:') {
                // Показываем сообщение об успехе (но данные не сохранятся в БД)
                bookingForm.style.display = 'none';
                successMessage.textContent = 'Спасибо за заявку! Для сохранения данных в базу откройте сайт через http://localhost:3000/index.html';
                successMessage.classList.add('show');
                successMessage.scrollIntoView({ behavior: 'smooth' });
                
                // Показываем контактную информацию
                setTimeout(() => {
                    const contactInfo = `
📞 Спасибо за заявку! Свяжитесь с нами для подтверждения:

📧 Email: evgenijurin998@gmail.com
📱 Телефон: +373 XX XXX XXX

⚠️ Внимание: Данные не сохранены в базу данных.
Для полной функциональности откройте сайт через:
http://localhost:3000/index.html
                    `;
                    alert(contactInfo);
                    
                    // Восстанавливаем форму через 5 секунд
                    setTimeout(() => {
                        successMessage.classList.remove('show');
                        bookingForm.style.display = 'block';
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }, 5000);
                }, 1000);
                return;
            }
            
            // Определяем URL API в зависимости от окружения
            const isLocalhost = window.location.hostname === 'localhost' || 
                               window.location.hostname === '127.0.0.1';
            
            // Для GitHub Pages используйте один из вариантов:
            // 1. Formspree: https://formspree.io/f/YOUR_FORM_ID (замените YOUR_FORM_ID)
            // 2. Ваш API: https://your-api.vercel.app/api/submit_booking
            // 3. Или другой сервис
            const apiUrl = isLocalhost 
                ? '/api/submit_booking'  // Локальный сервер
                : 'https://formspree.io/f/YOUR_FORM_ID'; // ЗАМЕНИТЕ НА ВАШ ENDPOINT
            
            const isFormspree = apiUrl.includes('formspree.io');
            
            // Формируем данные в зависимости от сервиса
            let requestBody;
            let requestHeaders;
            
            if (isFormspree) {
                // Formspree требует FormData или application/x-www-form-urlencoded
                requestBody = new URLSearchParams({
                    name: formData.name,
                    phone: formData.phone,
                    email: formData.email || '',
                    level: formData.level,
                    hall: formData.hall,
                    day: formData.day,
                    message: formData.message || '',
                    _subject: 'Новая заявка на тренировку - Badminton Club'
                });
                requestHeaders = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                };
            } else {
                // Наш API использует JSON
                requestBody = JSON.stringify(formData);
                requestHeaders = {
                    'Content-Type': 'application/json',
                };
            }
            
            // Отправка данных на сервер
            fetch(apiUrl, {
                method: 'POST',
                headers: requestHeaders,
                body: requestBody
            })
            .then(response => {
                // Formspree возвращает 200 даже при ошибках, проверяем ok
                if (!response.ok && !isFormspree) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Formspree возвращает { ok: true } при успехе
                const isSuccess = isFormspree ? (data.ok === true || data.next) : data.success;
                
                if (isSuccess) {
                    // Показываем сообщение об успехе
                    bookingForm.style.display = 'none';
                    successMessage.textContent = isFormspree 
                        ? 'Ваша заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.'
                        : data.message;
                    successMessage.classList.add('show');
                    
                    // Прокручиваем к сообщению об успехе
                    successMessage.scrollIntoView({ behavior: 'smooth' });
                    
                    // Очищаем форму
                    bookingForm.reset();
                    
                    // Скрываем сообщение через 5 секунд и показываем форму снова
                    setTimeout(() => {
                        successMessage.classList.remove('show');
                        bookingForm.style.display = 'block';
                    }, 5000);
                } else {
                    // Показываем ошибки валидации с сервера
                    if (data.errors) {
                        Object.keys(data.errors).forEach(field => {
                            showError(field, data.errors[field]);
                        });
                    } else {
                        alert('Ошибка: ' + (data.message || 'Не удалось отправить заявку'));
                    }
                    
                    // Восстанавливаем кнопку
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            })
            .catch(error => {
                console.error('Ошибка:', error);
                const errorMessage = isLocalhost
                    ? 'Произошла ошибка при отправке формы. Убедитесь, что сервер запущен (node server.js)'
                    : 'Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже или свяжитесь с нами напрямую.';
                alert(errorMessage);
                
                // Восстанавливаем кнопку
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            });
        } else {
            // Прокручиваем к первой ошибке
            const firstError = document.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                firstError.focus();
            }
        }
    });

    // Автоматическое форматирование телефона
    const phoneInput = document.getElementById('phone');
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.startsWith('373')) {
            value = '+' + value;
        } else if (value.startsWith('0')) {
            value = value;
        } else if (value.length > 0) {
            value = '+373' + value;
        }
        
        // Форматирование с пробелами
        if (value.length > 4) {
            value = value.slice(0, 4) + ' ' + value.slice(4);
        }
        if (value.length > 7) {
            value = value.slice(0, 7) + ' ' + value.slice(7);
        }
        if (value.length > 10) {
            value = value.slice(0, 10) + ' ' + value.slice(10);
        }
        
        e.target.value = value;
    });

    // Очистка ошибок при вводе
    const formInputs = document.querySelectorAll('#bookingForm input, #bookingForm select, #bookingForm textarea');
    formInputs.forEach(input => {
        input.addEventListener('input', function() {
            const fieldId = this.id;
            hideError(fieldId);
        });
    });

    // Анимация счетчиков в секции тренера
    function animateCounters() {
        const counters = document.querySelectorAll('.stat-number');
        counters.forEach(counter => {
            // Пропускаем эмодзи, анимируем только числа
            if (counter.textContent.match(/^\d/)) {
                const target = parseInt(counter.textContent.replace(/\D/g, ''));
                const suffix = counter.textContent.replace(/\d/g, '');
                let current = 0;
                const increment = target / 50;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        counter.textContent = target + suffix;
                        clearInterval(timer);
                    } else {
                        counter.textContent = Math.floor(current) + suffix;
                    }
                }, 30);
            }
        });
    }

    // Запуск анимации счетчиков при появлении секции тренера
    const trainerSection = document.querySelector('.trainer');
    const trainerObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                trainerObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (trainerSection) {
        trainerObserver.observe(trainerSection);
    }

    // Эффект параллакса для hero секции
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Добавление активного класса к навигации при скролле
    const sections = document.querySelectorAll('section[id]');
    const navItems = document.querySelectorAll('.nav a');

    window.addEventListener('scroll', function() {
        let current = '';
        const headerHeight = document.querySelector('.header').offsetHeight;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            if (window.pageYOffset >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === '#' + current) {
                item.classList.add('active');
            }
        });
    });

    // Анимация появления карточек залов
    const hallCards = document.querySelectorAll('.hall-card');
    hallCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });

    // Добавление эффекта hover для кнопок
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Обработка клика по ссылкам на карты
    const locationButtons = document.querySelectorAll('.location-btn');
    locationButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // В реальном приложении здесь можно добавить аналитику
            console.log('Пользователь кликнул на геолокацию');
        });
    });

    // Обработка клика по Telegram ссылке
    const telegramLink = document.querySelector('.telegram-link');
    if (telegramLink) {
        telegramLink.addEventListener('click', function(e) {
            console.log('Пользователь переходит в Telegram');
        });
    }

    // Добавление эффекта печатания для заголовка hero секции
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        setTimeout(typeWriter, 500);
    }

    // Инициализация tooltip'ов для элементов с дополнительной информацией
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.getAttribute('data-tooltip');
            tooltip.style.cssText = `
                position: absolute;
                background: #333;
                color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 14px;
                z-index: 1000;
                pointer-events: none;
                opacity: 0;
                transition: opacity 0.3s;
            `;
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            
            setTimeout(() => tooltip.style.opacity = '1', 10);
            
            this.addEventListener('mouseleave', function() {
                tooltip.style.opacity = '0';
                setTimeout(() => document.body.removeChild(tooltip), 300);
            });
        });
    });

    // Переключение языков
    const langTrigger = document.getElementById('langTrigger');
    const langDropdown = document.getElementById('langDropdown');
    const langOptions = document.querySelectorAll('.lang-option');
    const pageLangTrigger = document.querySelector('.page-lang-trigger');
    const pageLangDropdown = document.querySelector('.page-lang-dropdown');
    const pageLangOptions = document.querySelectorAll('.page-lang-option');
    const pageLangLabel = document.querySelector('.page-lang-label');
    const currentLang = localStorage.getItem('selectedLanguage') || 'ru';
    
    // Устанавливаем активный язык при загрузке
    setActiveLanguage(currentLang);
    updatePageLanguageUI(currentLang);
    
    function adjustLanguageDropdownPosition() {
        if (!langDropdown || !langTrigger) return;
        
        // Снимаем предыдущие классы позиционирования
        langDropdown.classList.remove('dropdown-below');
        
        // Временно показываем dropdown, чтобы измерить высоту
        const prevVisibility = langDropdown.style.visibility;
        const prevDisplay = langDropdown.style.display;
        const prevOpacity = langDropdown.style.opacity;
        const wasHidden = getComputedStyle(langDropdown).visibility === 'hidden';
        
        if (wasHidden) {
            langDropdown.style.visibility = 'hidden';
            langDropdown.style.display = 'block';
            langDropdown.style.opacity = '0';
        }
        
        const dropdownHeight = langDropdown.offsetHeight;
        
        if (wasHidden) {
            langDropdown.style.visibility = prevVisibility;
            langDropdown.style.display = prevDisplay;
            langDropdown.style.opacity = prevOpacity;
        }
        
        const triggerRect = langTrigger.getBoundingClientRect();
        const spaceAbove = triggerRect.top;
        
        if (spaceAbove < dropdownHeight + 20) {
            langDropdown.classList.add('dropdown-below');
        }
    }
    
    // Обработчик для открытия/закрытия выпадающего меню
    langTrigger.addEventListener('click', function(e) {
        e.stopPropagation();
        adjustLanguageDropdownPosition();
        langDropdown.classList.toggle('show');
        langTrigger.classList.toggle('active');
    });
    
    // Обработчики для выбора языка
    langOptions.forEach(option => {
        option.addEventListener('click', function() {
            const selectedLang = this.dataset.lang;
            
            // Убираем активный класс со всех опций
            langOptions.forEach(opt => opt.classList.remove('active'));
            // Добавляем активный класс к выбранной опции
            this.classList.add('active');
            
            applyLanguage(selectedLang);
            
            // Закрываем выпадающее меню
            langDropdown.classList.remove('show');
            langTrigger.classList.remove('active');
        });
    });
    
    // Локальный переключатель языков на отдельных страницах
    if (pageLangTrigger && pageLangDropdown) {
        pageLangTrigger.addEventListener('click', function(e) {
            e.stopPropagation();
            pageLangDropdown.classList.toggle('show');
            pageLangTrigger.classList.toggle('active');
        });
    }
    
    pageLangOptions.forEach(option => {
        option.addEventListener('click', function() {
            const selectedLang = this.dataset.lang;
            
            applyLanguage(selectedLang);
            
            if (langOptions.length) {
                langOptions.forEach(opt => opt.classList.remove('active'));
            }
            
            pageLangDropdown.classList.remove('show');
            if (pageLangTrigger) {
                pageLangTrigger.classList.remove('active');
            }
        });
    });
    
    // Закрытие выпадающего меню при клике вне его
    document.addEventListener('click', function(e) {
        if (langTrigger && langDropdown && !langTrigger.contains(e.target) && !langDropdown.contains(e.target)) {
            langDropdown.classList.remove('show');
            langTrigger.classList.remove('active');
        }
        
        if (pageLangTrigger && pageLangDropdown && !pageLangTrigger.contains(e.target) && !pageLangDropdown.contains(e.target)) {
            pageLangDropdown.classList.remove('show');
            pageLangTrigger.classList.remove('active');
        }
    });
    
    function updatePageLanguageUI(lang) {
        if (!pageLangLabel) return;
        pageLangLabel.textContent = lang.toUpperCase();
        pageLangOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.lang === lang);
        });
    }
    
    function applyLanguage(lang) {
        localStorage.setItem('selectedLanguage', lang);
        setActiveLanguage(lang);
        switchLanguage(lang);
        updatePageLanguageUI(lang);
    }
    
    // Функция установки активного языка
    function setActiveLanguage(lang) {
        const flagImages = {
            'ru': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAyNCAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjI0IiBoZWlnaHQ9IjYiIGZpbGw9IiNmZmZmZmYiLz4KPHJlY3QgeT0iNiIgd2lkdGg9IjI0IiBoZWlnaHQ9IjYiIGZpbGw9IiMwMDUyQjQiLz4KPHJlY3QgeT0iMTIiIHdpZHRoPSIyNCIgaGVpZ2h0PSI2IiBmaWxsPSIjRkYwMDAwIi8+Cjwvc3ZnPgo=',
            'ro': 'css/img/321210.png',
            'en': 'css/img/Flag_of_the_United_Kingdom.png'
        };
        
        // Обновляем флаг в триггере
        const currentFlag = document.querySelector('.current-flag');
        currentFlag.src = flagImages[lang];
        currentFlag.alt = lang.toUpperCase();
        
        // Скрываем активный язык из выпадающего меню
        langOptions.forEach(option => {
            if (option.dataset.lang === lang) {
                option.style.display = 'none';
            } else {
                option.style.display = 'flex';
            }
        });
    }
    
    // Функция переключения языка
    function switchLanguage(lang) {
        const translations = {
            ru: {
                // Навигация
                'nav-about': 'О нас',
                'nav-trainer': 'Тренер',
                'nav-halls': 'Залы',
                'nav-schedule': 'Расписание',
                'nav-booking': 'Запись',
                'nav-tournaments': 'Турниры',
                'nav-rating': 'Рейтинг',
                'nav-gallery': 'Галерея',
                'nav-history': 'История',
                'nav-contact': 'Контакты',
                'nav-faq': 'FAQ',
                
                // Hero секция
                'hero-title': 'DTM BADMINTON CLUB',
                'hero-subtitle': 'Стань частью команды! Первое занятие — твой шаг к победам, здоровью и новым друзьям 🏸',
                'hero-btn': 'Записаться на тренировку',
                
                // О нас
                'about-title': 'О нас',
                'about-text1': 'DTM Badminton Club — это место, где страсть к бадминтону встречается с профессиональным подходом к обучению. Мы создали уникальную атмосферу для развития ваших навыков и достижения новых высот в этом удивительном виде спорта.',
                'about-text2': 'Наша миссия — сделать бадминтон доступным для всех, независимо от возраста и уровня подготовки. Мы верим, что каждый может найти в этом спорте что-то особенное для себя.',
                'benefit1-title': 'Физическое развитие',
                'benefit1-text': 'Улучшение координации, выносливости и силы',
                'benefit2-title': 'Ментальная тренировка',
                'benefit2-text': 'Развитие стратегического мышления и концентрации',
                'benefit3-title': 'Социализация',
                'benefit3-text': 'Новые знакомства и дружеская атмосфера',
                'benefit4-title': 'Достижения',
                'benefit4-text': 'Возможность участвовать в турнирах и соревнованиях',
                
                // Тренер
                'trainer-title': 'Наш тренер',
                'trainer-name': 'Sturza Anzor',
                'trainer-text1': 'Sturza Anzor — активный игрок на профессиональном уровне, который делится своим опытом и любовью к бадминтону. Он хорошо понимает, с чего начать и как быстро прогрессировать, ведь сам прошёл этот путь.',
                'trainer-text2': 'Anzor создаёт дружескую атмосферу на тренировках, помогает каждому участнику освоить технику и почувствовать уверенность на корте. Его цель — чтобы бадминтон приносил радость, энергию и новые знакомства.',
                'stat1-label': 'Индивидуальный подход',
                'stat2-label': 'Современные техники и практика',
                'stat3-label': 'Дружеская атмосфера',
                'stat4-label': 'Тренировки для всех уровней',
                
                // Залы
                'halls-title': 'Наши залы',
                'hall1-title': 'Зал №1',
                'hall1-status': 'Доступен',
                'hall1-text': 'Современный спортивный комплекс с двумя профессиональными площадками для бадминтона. Качественное покрытие, отличное освещение и комфортные условия для тренировок.',
                'hall1-location': 'Посмотреть на карте',
                'hall2-title': 'Зал №2',
                'hall2-status': 'Скоро откроется',
                'hall2-text': 'Современный зал с новым ремонтом и покрытием. 4 профессиональные площадки для бадминтона. Увеличенные размеры, улучшенное освещение и комфортные условия для тренировок.',
                'hall2-location': 'Посмотреть на карте',
                
                // Расписание
                'schedule-title': 'Расписание тренировок',
                'monday': 'Понедельник',
                'tuesday': 'Вторник',
                'wednesday': 'Среда',
                'thursday': 'Четверг',
                'friday': 'Пятница',
                'saturday': 'Суббота',
                'sunday': 'Воскресенье',
                'time1': '18:00 - 19:30',
                'time2': '20:00 - 21:30',
                'time3': '10:00 - 11:30',
                'time4': '12:00 - 13:30',
                'time5': '16:00 - 17:30',
                
                // Форма записи
                'booking-title': 'Записаться на тренировку',
                'success-message': '✅ Спасибо! Ваша заявка принята. Мы свяжемся с вами в ближайшее время.',
                'form-name': 'Имя и фамилия *',
                'form-phone': 'Телефон *',
                'form-email': 'Email',
                'form-level': 'Уровень игры',
                'form-hall': 'Выберите зал',
                'form-day': 'Предпочтительный день',
                'form-message': 'Дополнительная информация',
                'form-submit': 'Отправить заявку',
                'level-beginner': 'Новичок',
                'level-intermediate': 'Средний',
                'level-advanced': 'Продвинутый',
                'level-professional': 'Профессионал',
                'hall1-option': 'Зал №1 (Доступен)',
                'hall2-option': 'Зал №2 (Скоро откроется)',
                'message-placeholder': 'Расскажите о ваших целях, опыте или особых пожеланиях...',
                'phone-placeholder': '+373 XX XXX XXX',
                'email-placeholder': 'example@email.com',
                
                // Контакты
                'contact-title': 'Контакты',
                'contact-phone': 'Телефон',
                'contact-email': 'Email',
                'contact-address': 'Адрес',
                'contact-hours': 'Время работы',
                'contact-hours-text': 'Пн-Ср: 18:30-21:00<br>Сб-Вс: 10:00-12:00',
                'contact-trainer': 'Свяжитесь с тренером',
                'contact-trainer-text': 'Для быстрой связи и получения консультации по тренировкам, свяжитесь с нашим тренером через Telegram:',
                'contact-telegram': 'Написать в Telegram',
                'contact-instagram': 'Instagram',
                'contact-viber': 'Написать в Viber',
                
                // Рейтинг
                'rating-title': 'Рейтинг игроков',
                'rating-description': 'Текущий рейтинг игроков DTM Badminton Club. Рейтинг обновляется после каждого турнира и тренировки.',
                'rating-rank': '#',
                'rating-player': 'Игрок',
                'rating-points': 'Очки',
                'rating-matches': 'Матчи',
                'rating-wins': 'Победы',
                'rating-winrate': '% побед',
                'rating-trend': 'Тренд',
                'rating-rules-title': 'Правила рейтинга',
                'rating-rule-1': '🏆 Категория Open (мастера): 1-е место +100, 2-е +70, 3-е +50, участие +20',
                'rating-rule-2': '🥇 Категория A: 1-е место +50, 2-е +40, 3-е +30',
                'rating-rule-3': '🥈 Категория B: 1-е место +40, 2-е +30, 3-е +20',
                'rating-rule-4': '🏸 Категория C (новички): 1-е место +30, 2-е +20, 3-е +10',
                'rating-rule-5': '',
                'rating-last-update': 'Последнее обновление:',
                'rating-next-update': 'Следующее обновление:',
                
                // История бадминтона
                'history-title': 'История бадминтона',
                'history-origin-title': '🏸 Происхождение игры',
                'history-origin-text1': 'Бадминтон - одна из самых древних игр с ракеткой. Его история насчитывает более 2000 лет! Игра зародилась в Древней Греции, где называлась "баттлдор и шаттлкок", а затем распространилась по всему миру.',
                'history-origin-text2': 'Современный бадминтон получил свое название от английского поместья Бадминтон-хаус, где в 1873 году герцог Бофорт организовал первую демонстрацию игры.',
                'history-facts-title': '🎯 Интересные факты',
                'history-fact1-title': 'Самый быстрый спорт',
                'history-fact1-text': 'Воланы в бадминтоне могут развивать скорость до 493 км/ч - это быстрее, чем в любом другом виде спорта!',
                'history-fact2-title': 'Олимпийский статус',
                'history-fact2-text': 'Бадминтон стал олимпийским видом спорта в 1992 году в Барселоне. С тех пор он завоевал сердца миллионов зрителей.',
                'history-fact3-title': 'Популярность в мире',
                'history-fact3-text': 'Бадминтон занимает второе место по популярности в мире после футбола, в него играют более 220 миллионов человек!',
                'history-fact4-title': 'Польза для здоровья',
                'history-fact4-text': 'Игра в бадминтон сжигает до 450 калорий в час и улучшает координацию, реакцию и выносливость.',
                'history-rules-title': '📋 Что нужно знать о бадминтоне',
                'history-rules-subtitle': '🎾 Основные правила:',
                'history-rule1': 'Цель игры: Перебросить волан через сетку так, чтобы соперник не смог его отбить',
                'history-rule2': 'Счет: Игра ведется до 21 очка, разница должна быть минимум 2 очка',
                'history-rule3': 'Подача: Должна выполняться снизу, волан должен попасть в диагональное поле соперника',
                'history-rule4': 'Очки: Засчитываются при ошибке соперника или когда волан падает на его половине',
                'history-equipment-subtitle': '🏸 Экипировка:',
                'history-equipment1': 'Ракетка: Вес 80-100 грамм, длина до 68 см',
                'history-equipment2': 'Волан: 16 перьев или синтетический, вес 4.74-5.50 грамм',
                'history-equipment3': 'Сетка: Высота 1.55 м, ширина 6.1 м',
                'history-equipment4': 'Корт: 13.4×6.1 м для одиночной игры, 13.4×5.18 м для парной',
                
                // Подвал
                'footer-copyright': '© 2025 DTM Badminton Club. Все права защищены.',
                'footer-university': 'Технический университет Молдовы',
                'footer-official': 'Официальный клуб при UTM',
                'footer-mission': 'Профессиональные тренировки и развитие спорта',
                'footer-description': 'Профессиональные тренировки по бадминтону в современных залах Технического университета Молдовы. Развитие спорта и здорового образа жизни для студентов и всех желающих.',
                'footer-halls-title': 'Наши залы при UTM',
                'footer-hall1-title': 'Зал №1 - Ботаника',
                'footer-hall2-title': 'Зал №2 - Рышканы',
                'footer-contact-title': 'Контакты',
                'footer-links-title': 'Быстрые ссылки',
                'footer-made-with': 'Сделано с ❤️ для любителей бадминтона',
                
                // FAQ
                'faq-title': 'Часто задаваемые вопросы',
                'faq-q1': '🏸 С какого возраста можно заниматься бадминтоном?',
                'faq-a1': 'Бадминтон подходит для всех возрастов! Мы принимаем детей от 8 лет и взрослых любого возраста. Для детей младше 8 лет предлагаем специальные программы развития координации.',
                'faq-q2': '💰 Сколько стоит тренировка?',
                'faq-a2': 'Стоимость одной тренировки составляет 50 лей. При покупке абонемента на месяц стоимость снижается до 35 лей за тренировку. Первое занятие - бесплатно!',
                'faq-q3': '🎒 Что нужно принести на первую тренировку?',
                'faq-a3': 'Для первой тренировки достаточно спортивной одежды и кроссовок. Ракетки и воланы мы предоставляем бесплатно. Рекомендуем взять с собой воду.',
                'faq-q4': '👥 Сколько человек в группе?',
                'faq-a4': 'В группах для начинающих максимум 8 человек, для продвинутых - до 6 человек. Это позволяет тренеру уделить внимание каждому ученику и обеспечить качественное обучение.',
                'faq-q5': '📍 Где проходят тренировки?',
                'faq-a5': 'Тренировки проходят в современных залах UTM: Зал №1 в Ботанике (CS UTM, sect. BOTANICA, str. DACIA 41/1) и Зал №2 в Рышканах (скоро откроется).',
                'faq-q6': '🏆 Можно ли участвовать в турнирах?',
                'faq-a6': 'Да! Мы регулярно организуем внутренние турниры для наших учеников и участвуем в городских соревнованиях. Турниры помогают проверить навыки и получить опыт игры.',
                'faq-q7': '⏰ Можно ли изменить время тренировки?',
                'faq-a7': 'Да, мы стараемся подстроиться под ваше расписание. При наличии свободных мест в других группах можно перейти на удобное время. Свяжитесь с тренером для уточнения.',
                'faq-q8': '🏥 Нужна ли справка от врача?',
                'faq-a8': 'Для занятий бадминтоном справка от врача не требуется. Однако рекомендуем проконсультироваться с врачом, если у вас есть хронические заболевания или травмы.',
                'faq-cta-title': 'Не нашли ответ на свой вопрос?',
                'faq-cta-text': 'Свяжитесь с нашим тренером, и мы с радостью ответим на все ваши вопросы!',
                'faq-cta-telegram': '💬 Написать в Telegram',
                'faq-cta-phone': '📞 Позвонить',
                
                // Турниры
                'tournaments-title': 'Предстоящие турниры',
                'tournament-card-title': '🏆 Турнир по бадминтону',
                'tournament-card-text': 'Надо готовиться и участвоваться в турнире',
                
                // Галерея
                'gallery-title': 'Галерея',
                'gallery-placeholder-title': 'Фотографии с тренировок',
                'gallery-placeholder-text': 'Скоро здесь появятся фото с наших тренировок и турниров',
                
                // Alt атрибуты изображений
                'trainer-img-alt': 'Sturza Anzor - тренер по бадминтону',
                'hall1-img-alt': 'Зал №1 - Спортивный комплекс UTM',
                'hall2-img-alt': 'Зал №2 - Новый комплекс',
                'tournament-img-alt': 'Афиша турнира',
                
                // Переключатель темы
                'theme-toggle-light': 'Переключить на темную тему',
                'theme-toggle-dark': 'Переключить на светлую тему'
            },
            ro: {
                // Навигация
                'nav-about': 'Despre noi',
                'nav-trainer': 'Antrenor',
                'nav-halls': 'Săli',
                'nav-schedule': 'Program',
                'nav-booking': 'Înregistrare',
                'nav-tournaments': 'Turnee',
                'nav-rating': 'Clasament',
                'nav-gallery': 'Galerie',
                'nav-history': 'Istorie',
                'nav-contact': 'Contacte',
                'nav-faq': 'Întrebări frecvente',
                
                // Hero секция
                'hero-title': 'DTM BADMINTON CLUB',
                'hero-subtitle': 'Devino parte din echipă! Prima lecție — primul tău pas către victorii, sănătate și prieteni noi 🏸',
                'hero-btn': 'Înregistrează-te la antrenament',
                
                // О нас
                'about-title': 'Despre noi',
                'about-text1': 'DTM Badminton Club — este locul unde pasiunea pentru badminton se întâlnește cu abordarea profesională a învățării. Am creat o atmosferă unică pentru dezvoltarea abilităților voastre și atingerea unor noi înălțimi în acest sport uimitor.',
                'about-text2': 'Misiunea noastră este să facem badmintonul accesibil pentru toți, indiferent de vârstă și nivelul de pregătire. Credem că fiecare poate găsi ceva special în acest sport.',
                'benefit1-title': 'Dezvoltare fizică',
                'benefit1-text': 'Îmbunătățirea coordonării, rezistenței și forței',
                'benefit2-title': 'Antrenament mental',
                'benefit2-text': 'Dezvoltarea gândirii strategice și concentrării',
                'benefit3-title': 'Socializare',
                'benefit3-text': 'Cunoștințe noi și atmosferă prietenoasă',
                'benefit4-title': 'Realizări',
                'benefit4-text': 'Posibilitatea de a participa la turnee și competiții',
                
                // Тренер
                'trainer-title': 'Antrenorul nostru',
                'trainer-name': 'Sturza Anzor',
                'trainer-text1': 'Sturza Anzor — jucător activ la nivel profesional, care împărtășește experiența și dragostea pentru badminton. El înțelege foarte bine de unde să înceapă și cum să progreseze rapid, pentru că a parcurs el însuși acest drum.',
                'trainer-text2': 'Anzor creează o atmosferă prietenoasă la antrenamente, ajută fiecare participant să stăpânească tehnica și să se simtă încrezător pe teren. Scopul său este ca badmintonul să aducă bucurie, energie și cunoștințe noi.',
                'stat1-label': 'Abordare individuală',
                'stat2-label': 'Tehnici moderne și practică',
                'stat3-label': 'Atmosferă prietenoasă',
                'stat4-label': 'Antrenamente pentru toate nivelurile',
                
                // Залы
                'halls-title': 'Sălile noastre',
                'hall1-title': 'Sala №1',
                'hall1-status': 'Disponibilă',
                'hall1-text': 'Complex sportiv modern cu două terenuri profesionale pentru badminton. Acoperire de calitate, iluminat excelent și condiții confortabile pentru antrenamente.',
                'hall1-location': 'Vezi pe hartă',
                'hall2-title': 'Sala №2',
                'hall2-status': 'În curând',
                'hall2-text': 'Sală modernă cu reparații noi și acoperire. 4 terenuri profesionale pentru badminton. Dimensiuni mărite, iluminat îmbunătățit și condiții confortabile pentru antrenamente.',
                'hall2-location': 'Vezi pe hartă',
                
                // Расписание
                'schedule-title': 'Programul antrenamentelor',
                'monday': 'Luni',
                'tuesday': 'Marți',
                'wednesday': 'Miercuri',
                'thursday': 'Joi',
                'friday': 'Vineri',
                'saturday': 'Sâmbătă',
                'sunday': 'Duminică',
                'time1': '18:00 - 19:30',
                'time2': '20:00 - 21:30',
                'time3': '10:00 - 11:30',
                'time4': '12:00 - 13:30',
                'time5': '16:00 - 17:30',
                
                // Форма записи
                'booking-title': 'Înregistrează-te la antrenament',
                'success-message': '✅ Mulțumim! Cererea dvs. a fost acceptată. Vă vom contacta în cel mai scurt timp.',
                'form-name': 'Numele și prenumele *',
                'form-phone': 'Telefon *',
                'form-email': 'Email',
                'form-level': 'Nivelul de joc',
                'form-hall': 'Alege sala',
                'form-day': 'Ziua preferată',
                'form-message': 'Informații suplimentare',
                'form-submit': 'Trimite cererea',
                'level-beginner': 'Începător',
                'level-intermediate': 'Mediu',
                'level-advanced': 'Avansat',
                'level-professional': 'Profesionist',
                'hall1-option': 'Sala №1 (Disponibilă)',
                'hall2-option': 'Sala №2 (În curând)',
                'message-placeholder': 'Spuneți-ne despre obiectivele, experiența sau dorințele speciale...',
                'phone-placeholder': '+373 XX XXX XXX',
                'email-placeholder': 'example@email.com',
                
                // Контакты
                'contact-title': 'Contacte',
                'contact-phone': 'Telefon',
                'contact-email': 'Email',
                'contact-address': 'Adresa',
                'contact-hours': 'Orele de lucru',
                'contact-hours-text': 'Lun-Mie: 18:30-21:00<br>Sâm-Dum: 10:00-12:00',
                'contact-trainer': 'Contactează antrenorul',
                'contact-trainer-text': 'Pentru comunicare rapidă și consultații despre antrenamente, contactați antrenorul nostru prin Telegram:',
                'contact-telegram': 'Scrie în Telegram',
                'contact-instagram': 'Instagram',
                'contact-viber': 'Scrie în Viber',
                
                // Рейтинг
                'rating-title': 'Clasamentul jucătorilor',
                'rating-description': 'Clasamentul actual al jucătorilor DTM Badminton Club. Clasamentul se actualizează după fiecare turneu și antrenament.',
                'rating-rank': '#',
                'rating-player': 'Jucător',
                'rating-points': 'Puncte',
                'rating-matches': 'Meciuri',
                'rating-wins': 'Victorii',
                'rating-winrate': '% victorii',
                'rating-trend': 'Tendință',
                'rating-rules-title': 'Regulile clasamentului',
                'rating-rule-1': '🏆 Categoria Open (maeștri): locul 1 +100, locul 2 +70, locul 3 +50, participare +20',
                'rating-rule-2': '🥇 Categoria A: locul 1 +50, locul 2 +40, locul 3 +30',
                'rating-rule-3': '🥈 Categoria B: locul 1 +40, locul 2 +30, locul 3 +20',
                'rating-rule-4': '🏸 Categoria C (începători): locul 1 +30, locul 2 +20, locul 3 +10',
                'rating-rule-5': '',
                'rating-last-update': 'Ultima actualizare:',
                'rating-next-update': 'Următoarea actualizare:',
                
                // Istoria badmintonului
                'history-title': 'Istoria badmintonului',
                'history-origin-title': '🏸 Originea jocului',
                'history-origin-text1': 'Badmintonul este unul dintre cele mai vechi jocuri cu rachetă. Istoria sa se întinde pe mai mult de 2000 de ani! Jocul a apărut în Grecia Antică, unde se numea "battledore și shuttlecock", apoi s-a răspândit în întreaga lume.',
                'history-origin-text2': 'Badmintonul modern și-a primit numele de la conacul englez Badminton House, unde în 1873 ducele de Beaufort a organizat prima demonstrație a jocului.',
                'history-facts-title': '🎯 Fapte interesante',
                'history-fact1-title': 'Cel mai rapid sport',
                'history-fact1-text': 'Shuttlecock-urile în badminton pot atinge viteze de până la 493 km/h - mai rapid decât în orice alt sport!',
                'history-fact2-title': 'Statut olimpic',
                'history-fact2-text': 'Badmintonul a devenit sport olimpic în 1992 la Barcelona. De atunci a cucerit inima milioanelor de spectatori.',
                'history-fact3-title': 'Popularitate mondială',
                'history-fact3-text': 'Badmintonul ocupă locul al doilea în popularitate în lume după fotbal, fiind practicat de peste 220 de milioane de oameni!',
                'history-fact4-title': 'Beneficii pentru sănătate',
                'history-fact4-text': 'Jocul de badminton arde până la 450 de calorii pe oră și îmbunătățește coordonarea, reacția și rezistența.',
                'history-rules-title': '📋 Ce trebuie să știi despre badminton',
                'history-rules-subtitle': '🎾 Reguli de bază:',
                'history-rule1': 'Scopul jocului: Să arunci shuttlecock-ul peste plasă astfel încât adversarul să nu-l poată returna',
                'history-rule2': 'Scorul: Jocul se joacă până la 21 de puncte, diferența trebuie să fie de minimum 2 puncte',
                'history-rule3': 'Serviciul: Trebuie executat de jos, shuttlecock-ul trebuie să cadă în câmpul diagonal al adversarului',
                'history-rule4': 'Punctele: Se acordă la greșeala adversarului sau când shuttlecock-ul cade pe jumătatea sa',
                'history-equipment-subtitle': '🏸 Echipament:',
                'history-equipment1': 'Racheta: Greutate 80-100 grame, lungime până la 68 cm',
                'history-equipment2': 'Shuttlecock: 16 pene sau sintetic, greutate 4.74-5.50 grame',
                'history-equipment3': 'Plasa: Înălțime 1.55 m, lățime 6.1 m',
                'history-equipment4': 'Terenul: 13.4×6.1 m pentru jocul individual, 13.4×5.18 m pentru dublu',
                
                // Подвал
                'footer-copyright': '© 2025 DTM Badminton Club. Toate drepturile rezervate.',
                'footer-university': 'Universitatea Tehnică a Moldovei',
                'footer-official': 'Club oficial la UTM',
                'footer-mission': 'Antrenamente profesionale și dezvoltarea sportului',
                'footer-description': 'Antrenamente profesionale de badminton în săli moderne ale Universității Tehnice a Moldovei. Dezvoltarea sportului și a stilului de viață sănătos pentru studenți și toți cei interesați.',
                'footer-halls-title': 'Sălile noastre la UTM',
                'footer-hall1-title': 'Sala №1 - Botanica',
                'footer-hall2-title': 'Sala №2 - Rîșcani',
                'footer-contact-title': 'Contacte',
                'footer-links-title': 'Link-uri rapide',
                'footer-made-with': 'Făcut cu ❤️ pentru iubitorii badmintonului',
                
                // FAQ
                'faq-title': 'Întrebări frecvente',
                'faq-q1': '🏸 De la ce vârstă se poate practica badmintonul?',
                'faq-a1': 'Badmintonul este potrivit pentru toate vârstele! Acceptăm copii de la 8 ani și adulți de orice vârstă. Pentru copii sub 8 ani oferim programe speciale de dezvoltare a coordonării.',
                'faq-q2': '💰 Cât costă un antrenament?',
                'faq-a2': 'Costul unui antrenament este de 50 lei. La cumpărarea unui abonament lunar costul scade la 35 lei per antrenament. Prima lecție este gratuită!',
                'faq-q3': '🎒 Ce trebuie să aduceți la primul antrenament?',
                'faq-a3': 'Pentru primul antrenament este suficientă haina sportivă și încălțămintea de sport. Rachetele și volanurile le oferim gratuit. Recomandăm să luați cu voi apă.',
                'faq-q4': '👥 Câte persoane sunt în grup?',
                'faq-a4': 'În grupurile pentru începători maxim 8 persoane, pentru avansați - până la 6 persoane. Acest lucru permite antrenorului să acorde atenție fiecărui elev și să asigure o învățare de calitate.',
                'faq-q5': '📍 Unde au loc antrenamentele?',
                'faq-a5': 'Antrenamentele au loc în sălile moderne UTM: Sala №1 în Botanica (CS UTM, sect. BOTANICA, str. DACIA 41/1) și Sala №2 în Rîșcani (în curând).',
                'faq-q6': '🏆 Se poate participa la turnee?',
                'faq-a6': 'Da! Organizăm regulat turnee interne pentru elevii noștri și participăm la competiții municipale. Turneele ajută la verificarea abilităților și la obținerea experienței de joc.',
                'faq-q7': '⏰ Se poate schimba ora antrenamentului?',
                'faq-a7': 'Da, încercăm să ne adaptăm la programul dumneavoastră. Dacă există locuri libere în alte grupuri, puteți trece la o oră convenabilă. Contactați antrenorul pentru clarificări.',
                'faq-q8': '🏥 Este necesară o adeverință medicală?',
                'faq-a8': 'Pentru practicarea badmintonului nu este necesară o adeverință medicală. Cu toate acestea, recomandăm să consultați un medic dacă aveți boli cronice sau accidentări.',
                'faq-cta-title': 'Nu ați găsit răspunsul la întrebarea dumneavoastră?',
                'faq-cta-text': 'Contactați antrenorul nostru, și vom răspunde cu plăcere la toate întrebările dumneavoastră!',
                'faq-cta-telegram': '💬 Scrie în Telegram',
                'faq-cta-phone': '📞 Sună',
                
                // Турниры
                'tournaments-title': 'Turnee viitoare',
                'tournament-card-title': '🏆 Turneu de badminton',
                'tournament-card-text': 'Trebuie să ne pregătim și să participăm la turneu',
                
                // Галерея
                'gallery-title': 'Galerie',
                'gallery-placeholder-title': 'Fotografii de la antrenamente',
                'gallery-placeholder-text': 'În curând vor apărea aici fotografii de la antrenamentele și turneele noastre',
                
                // Alt атрибуты изображений
                'trainer-img-alt': 'Sturza Anzor - antrenor de badminton',
                'hall1-img-alt': 'Sala №1 - Complexul sportiv UTM',
                'hall2-img-alt': 'Sala №2 - Complex nou',
                'tournament-img-alt': 'Poster turneu',
                
                // Переключатель темы
                'theme-toggle-light': 'Comută la tema întunecată',
                'theme-toggle-dark': 'Comută la tema luminoasă'
            },
            en: {
                // Навигация
                'nav-about': 'About us',
                'nav-trainer': 'Trainer',
                'nav-halls': 'Halls',
                'nav-schedule': 'Schedule',
                'nav-booking': 'Booking',
                'nav-tournaments': 'Tournaments',
                'nav-rating': 'Rankings',
                'nav-gallery': 'Gallery',
                'nav-history': 'History',
                'nav-contact': 'Contacts',
                'nav-faq': 'FAQ',
                
                // Hero секция
                'hero-title': 'DTM BADMINTON CLUB',
                'hero-subtitle': 'Become part of the team! Your first lesson — your step to victories, health and new friends 🏸',
                'hero-btn': 'Book a training session',
                
                // О нас
                'about-title': 'About us',
                'about-text1': 'DTM Badminton Club is a place where passion for badminton meets professional approach to learning. We have created a unique atmosphere for developing your skills and reaching new heights in this amazing sport.',
                'about-text2': 'Our mission is to make badminton accessible to everyone, regardless of age and skill level. We believe that everyone can find something special in this sport.',
                'benefit1-title': 'Physical development',
                'benefit1-text': 'Improving coordination, endurance and strength',
                'benefit2-title': 'Mental training',
                'benefit2-text': 'Developing strategic thinking and concentration',
                'benefit3-title': 'Socialization',
                'benefit3-text': 'New acquaintances and friendly atmosphere',
                'benefit4-title': 'Achievements',
                'benefit4-text': 'Opportunity to participate in tournaments and competitions',
                
                // Тренер
                'trainer-title': 'Our trainer',
                'trainer-name': 'Sturza Anzor',
                'trainer-text1': 'Sturza Anzor — an active professional-level player who shares his experience and love for badminton. He understands very well where to start and how to progress quickly, as he has walked this path himself.',
                'trainer-text2': 'Anzor creates a friendly atmosphere during training, helps each participant master the technique and feel confident on the court. His goal is for badminton to bring joy, energy and new acquaintances.',
                'stat1-label': 'Individual approach',
                'stat2-label': 'Modern techniques and practice',
                'stat3-label': 'Friendly atmosphere',
                'stat4-label': 'Training for all levels',
                
                // Залы
                'halls-title': 'Our halls',
                'hall1-title': 'Hall №1',
                'hall1-status': 'Available',
                'hall1-text': 'Modern sports complex with two professional badminton courts. Quality flooring, excellent lighting and comfortable conditions for training.',
                'hall1-location': 'View on map',
                'hall2-title': 'Hall №2',
                'hall2-status': 'Coming soon',
                'hall2-text': 'Modern hall with new renovation and flooring. 4 professional badminton courts. Increased dimensions, improved lighting and comfortable conditions for training.',
                'hall2-location': 'View on map',
                
                // Расписание
                'schedule-title': 'Training schedule',
                'monday': 'Monday',
                'tuesday': 'Tuesday',
                'wednesday': 'Wednesday',
                'thursday': 'Thursday',
                'friday': 'Friday',
                'saturday': 'Saturday',
                'sunday': 'Sunday',
                'time1': '18:00 - 19:30',
                'time2': '20:00 - 21:30',
                'time3': '10:00 - 11:30',
                'time4': '12:00 - 13:30',
                'time5': '16:00 - 17:30',
                
                // Форма записи
                'booking-title': 'Book a training session',
                'success-message': '✅ Thank you! Your application has been accepted. We will contact you shortly.',
                'form-name': 'Full name *',
                'form-phone': 'Phone *',
                'form-email': 'Email',
                'form-level': 'Skill level',
                'form-hall': 'Choose hall',
                'form-day': 'Preferred day',
                'form-message': 'Additional information',
                'form-submit': 'Submit application',
                'level-beginner': 'Beginner',
                'level-intermediate': 'Intermediate',
                'level-advanced': 'Advanced',
                'level-professional': 'Professional',
                'hall1-option': 'Hall №1 (Available)',
                'hall2-option': 'Hall №2 (Coming soon)',
                'message-placeholder': 'Tell us about your goals, experience or special wishes...',
                'phone-placeholder': '+373 XX XXX XXX',
                'email-placeholder': 'example@email.com',
                
                // Контакты
                'contact-title': 'Contacts',
                'contact-phone': 'Phone',
                'contact-email': 'Email',
                'contact-address': 'Address',
                'contact-hours': 'Working hours',
                'contact-hours-text': 'Mon-Wed: 18:30-21:00<br>Sat-Sun: 10:00-12:00',
                'contact-trainer': 'Contact trainer',
                'contact-trainer-text': 'For quick communication and training consultations, contact our trainer via Telegram:',
                'contact-telegram': 'Write in Telegram',
                'contact-instagram': 'Instagram',
                'contact-viber': 'Write in Viber',
                
                // Рейтинг
                'rating-title': 'Player Rankings',
                'rating-description': 'Current player rankings of DTM Badminton Club. Rankings are updated after each tournament and training session.',
                'rating-rank': '#',
                'rating-player': 'Player',
                'rating-points': 'Points',
                'rating-matches': 'Matches',
                'rating-wins': 'Wins',
                'rating-winrate': 'Win %',
                'rating-trend': 'Trend',
                'rating-rules-title': 'Ranking Rules',
                'rating-rule-1': '🏆 Open Category (masters): 1st +100, 2nd +70, 3rd +50, participation +20',
                'rating-rule-2': '🥇 Category A: 1st +50, 2nd +40, 3rd +30',
                'rating-rule-3': '🥈 Category B: 1st +40, 2nd +30, 3rd +20',
                'rating-rule-4': '🏸 Category C (beginners): 1st +30, 2nd +20, 3rd +10',
                'rating-rule-5': '',
                'rating-last-update': 'Last update:',
                'rating-next-update': 'Next update:',
                
                // Badminton History
                'history-title': 'Badminton History',
                'history-origin-title': '🏸 Origin of the Game',
                'history-origin-text1': 'Badminton is one of the oldest racket sports. Its history spans more than 2000 years! The game originated in Ancient Greece, where it was called "battledore and shuttlecock", then spread throughout the world.',
                'history-origin-text2': 'Modern badminton got its name from the English estate Badminton House, where in 1873 the Duke of Beaufort organized the first demonstration of the game.',
                'history-facts-title': '🎯 Interesting Facts',
                'history-fact1-title': 'Fastest Sport',
                'history-fact1-text': 'Shuttlecocks in badminton can reach speeds of up to 493 km/h - faster than any other sport!',
                'history-fact2-title': 'Olympic Status',
                'history-fact2-text': 'Badminton became an Olympic sport in 1992 in Barcelona. Since then it has won the hearts of millions of spectators.',
                'history-fact3-title': 'World Popularity',
                'history-fact3-text': 'Badminton ranks second in popularity worldwide after football, played by more than 220 million people!',
                'history-fact4-title': 'Health Benefits',
                'history-fact4-text': 'Playing badminton burns up to 450 calories per hour and improves coordination, reaction and endurance.',
                'history-rules-title': '📋 What You Need to Know About Badminton',
                'history-rules-subtitle': '🎾 Basic Rules:',
                'history-rule1': 'Game Objective: Hit the shuttlecock over the net so the opponent cannot return it',
                'history-rule2': 'Scoring: Game is played to 21 points, difference must be at least 2 points',
                'history-rule3': 'Serve: Must be executed from below, shuttlecock must land in opponent\'s diagonal court',
                'history-rule4': 'Points: Awarded on opponent\'s error or when shuttlecock lands on their side',
                'history-equipment-subtitle': '🏸 Equipment:',
                'history-equipment1': 'Racket: Weight 80-100 grams, length up to 68 cm',
                'history-equipment2': 'Shuttlecock: 16 feathers or synthetic, weight 4.74-5.50 grams',
                'history-equipment3': 'Net: Height 1.55 m, width 6.1 m',
                'history-equipment4': 'Court: 13.4×6.1 m for singles, 13.4×5.18 m for doubles',
                
                // Подвал
                'footer-copyright': '© 2025 DTM Badminton Club. All rights reserved.',
                'footer-university': 'Technical University of Moldova',
                'footer-official': 'Official club at UTM',
                'footer-mission': 'Professional training and sports development',
                'footer-description': 'Professional badminton training in modern halls of the Technical University of Moldova. Development of sports and healthy lifestyle for students and all interested.',
                'footer-halls-title': 'Our halls at UTM',
                'footer-hall1-title': 'Hall №1 - Botanica',
                'footer-hall2-title': 'Hall №2 - Riscani',
                'footer-contact-title': 'Contacts',
                'footer-links-title': 'Quick links',
                'footer-made-with': 'Made with ❤️ for badminton lovers',
                
                // FAQ
                'faq-title': 'Frequently Asked Questions',
                'faq-q1': '🏸 What age can you start playing badminton?',
                'faq-a1': 'Badminton is suitable for all ages! We accept children from 8 years old and adults of any age. For children under 8 years old, we offer special coordination development programs.',
                'faq-q2': '💰 How much does a training session cost?',
                'faq-a2': 'The cost of one training session is 50 lei. When purchasing a monthly subscription, the cost is reduced to 35 lei per session. The first lesson is free!',
                'faq-q3': '🎒 What should I bring to the first training?',
                'faq-a3': 'For the first training, sports clothes and sneakers are enough. We provide rackets and shuttlecocks for free. We recommend bringing water with you.',
                'faq-q4': '👥 How many people are in a group?',
                'faq-a4': 'In beginner groups, maximum 8 people, for advanced - up to 6 people. This allows the coach to pay attention to each student and ensure quality learning.',
                'faq-q5': '📍 Where do the trainings take place?',
                'faq-a5': 'Trainings take place in modern UTM halls: Hall №1 in Botanica (CS UTM, sect. BOTANICA, str. DACIA 41/1) and Hall №2 in Riscani (coming soon).',
                'faq-q6': '🏆 Can I participate in tournaments?',
                'faq-a6': 'Yes! We regularly organize internal tournaments for our students and participate in city competitions. Tournaments help test skills and gain playing experience.',
                'faq-q7': '⏰ Can I change the training time?',
                'faq-a7': 'Yes, we try to adapt to your schedule. If there are free places in other groups, you can switch to a convenient time. Contact the coach for clarification.',
                'faq-q8': '🏥 Do I need a medical certificate?',
                'faq-a8': 'A medical certificate is not required for badminton classes. However, we recommend consulting a doctor if you have chronic diseases or injuries.',
                'faq-cta-title': 'Didn\'t find the answer to your question?',
                'faq-cta-text': 'Contact our coach, and we will be happy to answer all your questions!',
                'faq-cta-telegram': '💬 Write in Telegram',
                'faq-cta-phone': '📞 Call',
                
                // Турниры
                'tournaments-title': 'Upcoming Tournaments',
                'tournament-card-title': '🏆 Badminton Tournament',
                'tournament-card-text': 'We need to prepare and participate in the tournament',
                
                // Галерея
                'gallery-title': 'Gallery',
                'gallery-placeholder-title': 'Training Photos',
                'gallery-placeholder-text': 'Photos from our training sessions and tournaments will appear here soon',
                
                // Alt атрибуты изображений
                'trainer-img-alt': 'Sturza Anzor - badminton trainer',
                'hall1-img-alt': 'Hall №1 - UTM Sports Complex',
                'hall2-img-alt': 'Hall №2 - New Complex',
                'tournament-img-alt': 'Tournament poster',
                
                // Переключатель темы
                'theme-toggle-light': 'Switch to dark theme',
                'theme-toggle-dark': 'Switch to light theme'
            }
        };
        
        const currentTranslations = translations[lang];
        
        const sectionSelector = (hash) => `a[href="${hash}"], a[href="index.html${hash}"]`;
        const linkMatches = (href, options) => {
            if (!href) return false;
            const normalized = href.replace('index.html', '');
            return options.includes(href) || options.includes(normalized);
        };
        
        // Обновляем навигацию
        const aboutLink = document.querySelector(sectionSelector('#about'));
        if (aboutLink) aboutLink.innerHTML = currentTranslations['nav-about'];
        const trainerLink = document.querySelector(sectionSelector('#trainer'));
        if (trainerLink) trainerLink.innerHTML = currentTranslations['nav-trainer'];
        const hallsLink = document.querySelector(sectionSelector('#halls'));
        if (hallsLink) hallsLink.innerHTML = currentTranslations['nav-halls'];
        const scheduleLink = document.querySelector(sectionSelector('#schedule'));
        if (scheduleLink) scheduleLink.innerHTML = currentTranslations['nav-schedule'];
        const bookingLink = document.querySelector(sectionSelector('#booking'));
        if (bookingLink) bookingLink.innerHTML = currentTranslations['nav-booking'];
        const contactLink = document.querySelector(sectionSelector('#contact'));
        if (contactLink) contactLink.innerHTML = currentTranslations['nav-contact'];
        const ratingLink = document.querySelector('a[href="#rating"], a[href="rating.html"]');
        if (ratingLink) ratingLink.innerHTML = currentTranslations['nav-rating'];
        const galleryLink = document.querySelector('a[href="#gallery"], a[href="gallery.html"]');
        if (galleryLink) galleryLink.innerHTML = currentTranslations['nav-gallery'];
        const historyLink = document.querySelector('a[href="#history"], a[href="history.html"]');
        if (historyLink) historyLink.innerHTML = currentTranslations['nav-history'];
        const faqLink = document.querySelector(sectionSelector('#faq'));
        if (faqLink) faqLink.textContent = currentTranslations['nav-faq'];
        
        // Обновляем турниры с сохранением бейджа (если ссылка существует)
        const tournamentLink = document.querySelector('a[href="#tournaments"], a[href="tournaments.html"]');
        if (tournamentLink) {
            const badge = tournamentLink.querySelector('.notification-badge');
            const badgeText = badge ? badge.textContent : '';
            tournamentLink.innerHTML = currentTranslations['nav-tournaments'] + 
                (badgeText ? `<span class="notification-badge" id="tournamentBadge">${badgeText}</span>` : '');
        }
        
        // Обновляем мобильную навигацию
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            const href = link.getAttribute('href') || '';
            if (linkMatches(href, ['#about'])) link.innerHTML = currentTranslations['nav-about'];
            if (linkMatches(href, ['#trainer'])) link.innerHTML = currentTranslations['nav-trainer'];
            if (linkMatches(href, ['#halls'])) link.innerHTML = currentTranslations['nav-halls'];
            if (linkMatches(href, ['#schedule'])) link.innerHTML = currentTranslations['nav-schedule'];
            if (linkMatches(href, ['#booking'])) link.innerHTML = currentTranslations['nav-booking'];
            if (linkMatches(href, ['#contact'])) link.innerHTML = currentTranslations['nav-contact'];
            if (linkMatches(href, ['#faq'])) link.innerHTML = currentTranslations['nav-faq'];
            if (href === '#tournaments' || href === 'tournaments.html') {
                const badge = link.querySelector('.notification-badge');
                const badgeText = badge ? badge.textContent : '';
                link.innerHTML = currentTranslations['nav-tournaments'] + 
                    (badgeText ? `<span class="notification-badge mobile-notification">${badgeText}</span>` : '');
            }
            if (href === 'rating.html' || href === '#rating') link.innerHTML = currentTranslations['nav-rating'];
            if (href === 'gallery.html' || href === '#gallery') link.innerHTML = currentTranslations['nav-gallery'];
            if (href === 'history.html' || href === '#history') link.innerHTML = currentTranslations['nav-history'];
        });
        
        // Обновляем hero секцию
        const heroTitle = document.getElementById('hero-title');
        if (heroTitle) heroTitle.textContent = currentTranslations['hero-title'];
        const heroSubtitle = document.getElementById('hero-subtitle');
        if (heroSubtitle) heroSubtitle.innerHTML = currentTranslations['hero-subtitle'];
        const heroBtn = document.getElementById('hero-btn');
        if (heroBtn) heroBtn.textContent = currentTranslations['hero-btn'];
        
        // Обновляем секцию "О нас"
        const aboutSection = document.querySelector('#about');
        if (aboutSection) {
            const aboutTitle = aboutSection.querySelector('.section-title');
            if (aboutTitle) aboutTitle.textContent = currentTranslations['about-title'];
            const aboutTexts = aboutSection.querySelectorAll('.about-text p');
            if (aboutTexts[0]) aboutTexts[0].textContent = currentTranslations['about-text1'];
            if (aboutTexts[1]) aboutTexts[1].textContent = currentTranslations['about-text2'];
        }
        
        // Обновляем карточки преимуществ
        const benefitCards = document.querySelectorAll('.benefit-card');
        if (benefitCards.length >= 4) {
            if (benefitCards[0].querySelector('h3')) benefitCards[0].querySelector('h3').textContent = currentTranslations['benefit1-title'];
            if (benefitCards[0].querySelector('p')) benefitCards[0].querySelector('p').textContent = currentTranslations['benefit1-text'];
            if (benefitCards[1].querySelector('h3')) benefitCards[1].querySelector('h3').textContent = currentTranslations['benefit2-title'];
            if (benefitCards[1].querySelector('p')) benefitCards[1].querySelector('p').textContent = currentTranslations['benefit2-text'];
            if (benefitCards[2].querySelector('h3')) benefitCards[2].querySelector('h3').textContent = currentTranslations['benefit3-title'];
            if (benefitCards[2].querySelector('p')) benefitCards[2].querySelector('p').textContent = currentTranslations['benefit3-text'];
            if (benefitCards[3].querySelector('h3')) benefitCards[3].querySelector('h3').textContent = currentTranslations['benefit4-title'];
            if (benefitCards[3].querySelector('p')) benefitCards[3].querySelector('p').textContent = currentTranslations['benefit4-text'];
        }
        
        // Обновляем секцию тренера
        const trainerSection = document.querySelector('#trainer');
        if (trainerSection) {
            const trainerTitle = trainerSection.querySelector('.section-title');
            if (trainerTitle) trainerTitle.textContent = currentTranslations['trainer-title'];
            const trainerName = trainerSection.querySelector('.trainer-info h3');
            if (trainerName) trainerName.textContent = currentTranslations['trainer-name'];
            const trainerTexts = trainerSection.querySelectorAll('.trainer-info p');
            if (trainerTexts[0]) trainerTexts[0].textContent = currentTranslations['trainer-text1'];
            if (trainerTexts[1]) trainerTexts[1].textContent = currentTranslations['trainer-text2'];
        }
        
        // Обновляем статистику тренера
        const statLabels = document.querySelectorAll('.stat-label');
        if (statLabels.length >= 4) {
            statLabels[0].textContent = currentTranslations['stat1-label'];
            statLabels[1].textContent = currentTranslations['stat2-label'];
            statLabels[2].textContent = currentTranslations['stat3-label'];
            statLabels[3].textContent = currentTranslations['stat4-label'];
        }
        
        // Обновляем секцию залов
        const hallsSection = document.querySelector('#halls');
        if (hallsSection) {
            const hallsTitle = hallsSection.querySelector('.section-title');
            if (hallsTitle) hallsTitle.textContent = currentTranslations['halls-title'];
            const hallCards = hallsSection.querySelectorAll('.hall-card');
            if (hallCards[0]) {
                const hall1Title = hallCards[0].querySelector('.hall-title');
                if (hall1Title) hall1Title.textContent = currentTranslations['hall1-title'];
                const hall1Status = hallCards[0].querySelector('.hall-status');
                if (hall1Status) hall1Status.textContent = currentTranslations['hall1-status'];
                const hall1Text = hallCards[0].querySelector('.hall-info p');
                if (hall1Text) hall1Text.textContent = currentTranslations['hall1-text'];
                const hall1Location = hallCards[0].querySelector('.location-btn');
                if (hall1Location) hall1Location.textContent = currentTranslations['hall1-location'];
            }
            if (hallCards[1]) {
                const hall2Title = hallCards[1].querySelector('.hall-title');
                if (hall2Title) hall2Title.textContent = currentTranslations['hall2-title'];
                const hall2Status = hallCards[1].querySelector('.hall-status');
                if (hall2Status) hall2Status.textContent = currentTranslations['hall2-status'];
                const hall2Text = hallCards[1].querySelector('.hall-info p');
                if (hall2Text) hall2Text.textContent = currentTranslations['hall2-text'];
                const hall2Location = hallCards[1].querySelector('.location-btn');
                if (hall2Location) hall2Location.textContent = currentTranslations['hall2-location'];
            }
        }
        
        // Обновляем расписание
        const scheduleSection = document.querySelector('#schedule');
        if (scheduleSection) {
            const scheduleTitle = scheduleSection.querySelector('.section-title');
            if (scheduleTitle) scheduleTitle.textContent = currentTranslations['schedule-title'];
            const scheduleCards = scheduleSection.querySelectorAll('.schedule-card');
            const dayNames = [currentTranslations['monday'], currentTranslations['tuesday'], currentTranslations['wednesday'], 
                             currentTranslations['saturday'], currentTranslations['sunday']];
            scheduleCards.forEach((card, index) => {
                if (dayNames[index]) {
                    const dayName = card.querySelector('.day-name');
                    if (dayName) dayName.textContent = dayNames[index];
                }
            });
        }
        
        // Обновляем форму записи
        const bookingSection = document.querySelector('#booking');
        if (bookingSection) {
            const bookingTitle = bookingSection.querySelector('.section-title');
            if (bookingTitle) bookingTitle.textContent = currentTranslations['booking-title'];
            const successMessage = bookingSection.querySelector('#successMessage');
            if (successMessage) successMessage.textContent = currentTranslations['success-message'];
            
            // Обновляем поля формы (пропускаем скрытое поле для ботов)
            const formLabels = bookingSection.querySelectorAll('#bookingForm .form-group label');
            if (formLabels.length >= 7) {
                formLabels[0].textContent = currentTranslations['form-name'];
                formLabels[1].textContent = currentTranslations['form-phone'];
                formLabels[2].textContent = currentTranslations['form-email'];
                formLabels[3].textContent = currentTranslations['form-level'];
                formLabels[4].textContent = currentTranslations['form-hall'];
                formLabels[5].textContent = currentTranslations['form-day'];
                formLabels[6].textContent = currentTranslations['form-message'];
            }
            
            // Обновляем опции формы
            const levelOptions = bookingSection.querySelectorAll('#level option');
            if (levelOptions.length >= 4) {
                levelOptions[0].textContent = currentTranslations['level-beginner'];
                levelOptions[1].textContent = currentTranslations['level-intermediate'];
                levelOptions[2].textContent = currentTranslations['level-advanced'];
                levelOptions[3].textContent = currentTranslations['level-professional'];
            }
            
            const hallOptions = bookingSection.querySelectorAll('#hall option');
            if (hallOptions.length >= 2) {
                hallOptions[0].textContent = currentTranslations['hall1-option'];
                hallOptions[1].textContent = currentTranslations['hall2-option'];
            }
            
            const dayOptions = bookingSection.querySelectorAll('#day option');
            const dayNames = [currentTranslations['monday'], currentTranslations['tuesday'], currentTranslations['wednesday'], 
                            currentTranslations['saturday'], currentTranslations['sunday']];
            dayOptions.forEach((option, index) => {
                if (dayNames[index]) option.textContent = dayNames[index];
            });
            
            const messageField = bookingSection.querySelector('#message');
            if (messageField) messageField.placeholder = currentTranslations['message-placeholder'];
            const phoneField = bookingSection.querySelector('#phone');
            if (phoneField) phoneField.placeholder = currentTranslations['phone-placeholder'];
            const emailField = bookingSection.querySelector('#email');
            if (emailField) emailField.placeholder = currentTranslations['email-placeholder'];
            const submitBtn = bookingSection.querySelector('#bookingForm button[type="submit"]');
            if (submitBtn) submitBtn.textContent = currentTranslations['form-submit'];
        }
        
        // Обновляем рейтинг
        const ratingSection = document.querySelector('#rating');
        if (ratingSection) {
            const ratingTitle = ratingSection.querySelector('.section-title');
            if (ratingTitle) ratingTitle.textContent = currentTranslations['rating-title'];
            
            const ratingDescription = ratingSection.querySelector('.rating-description p');
            if (ratingDescription) ratingDescription.textContent = currentTranslations['rating-description'];
            
            // Обновляем заголовки таблицы
            const tableHeaders = ratingSection.querySelectorAll('.rating-table th');
            if (tableHeaders.length >= 7) {
                tableHeaders[0].textContent = currentTranslations['rating-rank'];
                tableHeaders[1].textContent = currentTranslations['rating-player'];
                tableHeaders[2].textContent = currentTranslations['rating-points'];
                tableHeaders[3].textContent = currentTranslations['rating-matches'];
                tableHeaders[4].textContent = currentTranslations['rating-wins'];
                tableHeaders[5].textContent = currentTranslations['rating-winrate'];
                tableHeaders[6].textContent = currentTranslations['rating-trend'];
            }
            
            // Обновляем правила рейтинга
            const ratingRulesTitle = ratingSection.querySelector('.rating-rules h3');
            if (ratingRulesTitle) ratingRulesTitle.textContent = currentTranslations['rating-rules-title'];
            
            // Отключено - теперь используются новые категории в HTML
            // const ratingRules = ratingSection.querySelectorAll('.rating-rules li');
            // const rules = [
            //     currentTranslations['rating-rule-1'],
            //     currentTranslations['rating-rule-2'],
            //     currentTranslations['rating-rule-3'],
            //     currentTranslations['rating-rule-4'],
            //     currentTranslations['rating-rule-5']
            // ];
            // 
            // ratingRules.forEach((rule, index) => {
            //     if (rules[index]) rule.textContent = rules[index];
            // });
            
            // Обновляем информацию об обновлениях
            const updateTexts = ratingSection.querySelectorAll('.rating-update p');
            if (updateTexts.length >= 2) {
                updateTexts[0].innerHTML = `<strong>${currentTranslations['rating-last-update']}</strong> 15 января 2025`;
                updateTexts[1].innerHTML = `<strong>${currentTranslations['rating-next-update']}</strong> После турнира 19 октября`;
            }
        }
        
        // Обновляем историю бадминтона
        const historySection = document.querySelector('#history');
        if (historySection) {
            const historyTitle = historySection.querySelector('.section-title');
            if (historyTitle) historyTitle.textContent = currentTranslations['history-title'];
            
            // Обновляем происхождение игры
            const originTitle = historySection.querySelector('.history-text h3');
            if (originTitle) originTitle.textContent = currentTranslations['history-origin-title'];
            
            const originTexts = historySection.querySelectorAll('.history-text p');
            if (originTexts.length >= 2) {
                originTexts[0].textContent = currentTranslations['history-origin-text1'];
                originTexts[1].textContent = currentTranslations['history-origin-text2'];
            }
            
            // Обновляем интересные факты
            const factsTitle = historySection.querySelector('.facts-section h3');
            if (factsTitle) factsTitle.textContent = currentTranslations['history-facts-title'];
            
            const factCards = historySection.querySelectorAll('.fact-card');
            if (factCards.length >= 4) {
                factCards[0].querySelector('h4').textContent = currentTranslations['history-fact1-title'];
                factCards[0].querySelector('p').textContent = currentTranslations['history-fact1-text'];
                factCards[1].querySelector('h4').textContent = currentTranslations['history-fact2-title'];
                factCards[1].querySelector('p').textContent = currentTranslations['history-fact2-text'];
                factCards[2].querySelector('h4').textContent = currentTranslations['history-fact3-title'];
                factCards[2].querySelector('p').textContent = currentTranslations['history-fact3-text'];
                factCards[3].querySelector('h4').textContent = currentTranslations['history-fact4-title'];
                factCards[3].querySelector('p').textContent = currentTranslations['history-fact4-text'];
            }
            
            // Обновляем правила
            const rulesTitle = historySection.querySelector('.rules-section h3');
            if (rulesTitle) rulesTitle.textContent = currentTranslations['history-rules-title'];
            
            const rulesSubtitles = historySection.querySelectorAll('.rules-text h4');
            if (rulesSubtitles.length >= 2) {
                rulesSubtitles[0].textContent = currentTranslations['history-rules-subtitle'];
                rulesSubtitles[1].textContent = currentTranslations['history-equipment-subtitle'];
            }
            
            const rulesList = historySection.querySelectorAll('.rules-text li');
            if (rulesList.length >= 8) {
                rulesList[0].textContent = currentTranslations['history-rule1'];
                rulesList[1].textContent = currentTranslations['history-rule2'];
                rulesList[2].textContent = currentTranslations['history-rule3'];
                rulesList[3].textContent = currentTranslations['history-rule4'];
                rulesList[4].textContent = currentTranslations['history-equipment1'];
                rulesList[5].textContent = currentTranslations['history-equipment2'];
                rulesList[6].textContent = currentTranslations['history-equipment3'];
                rulesList[7].textContent = currentTranslations['history-equipment4'];
            }
            
        }
        
        // Обновляем контакты
        const contactSection = document.querySelector('#contact');
        if (contactSection) {
            const contactTitle = contactSection.querySelector('.section-title');
            if (contactTitle) contactTitle.textContent = currentTranslations['contact-title'];
            const contactItems = contactSection.querySelectorAll('.contact-item');
            if (contactItems.length >= 4) {
                const contactPhone = contactItems[0].querySelector('h4');
                if (contactPhone) contactPhone.textContent = currentTranslations['contact-phone'];
                const contactEmail = contactItems[1].querySelector('h4');
                if (contactEmail) contactEmail.textContent = currentTranslations['contact-email'];
                const contactAddress = contactItems[2].querySelector('h4');
                if (contactAddress) contactAddress.textContent = currentTranslations['contact-address'];
                const contactHours = contactItems[3].querySelector('h4');
                if (contactHours) contactHours.textContent = currentTranslations['contact-hours'];
                
                // Сохраняем номер телефона (не перезаписываем)
                const phoneLink = contactItems[0].querySelector('.phone-link');
                if (phoneLink && !phoneLink.textContent.trim()) {
                    phoneLink.textContent = '+373 68 851 307';
                }
                
                // Сохраняем email адрес (не перезаписываем)
                const emailLink = contactItems[1].querySelector('.email-link');
                if (emailLink && !emailLink.textContent.trim()) {
                    emailLink.textContent = 'evgenijurin998@gmail.com';
                }
                
                // Сохраняем адрес (не перезаписываем)
                const addressLink = contactItems[2].querySelector('.address-link');
                if (addressLink && !addressLink.textContent.trim()) {
                    addressLink.textContent = 'CS UTM, sect. BOTANICA, str. DACIA 41/1';
                }
                
                // Обновляем время работы
                const hoursText = contactItems[3].querySelector('.hours-text');
                if (hoursText) {
                    hoursText.innerHTML = currentTranslations['contact-hours-text'];
                }
            }
            
            // Сохраняем номер телефона (не перезаписываем)
            const contactInfo = contactSection.querySelector('.contact-info h3');
            if (contactInfo) contactInfo.textContent = currentTranslations['contact-trainer'];
            const contactText = contactSection.querySelector('.contact-info:last-child p');
            if (contactText) contactText.textContent = currentTranslations['contact-trainer-text'];
            
            // Обновляем социальные кнопки
            const telegramLink = contactSection.querySelector('.telegram-link');
            if (telegramLink) telegramLink.textContent = currentTranslations['contact-telegram'];
            
            const instagramLink = contactSection.querySelector('.instagram-link');
            if (instagramLink) instagramLink.textContent = currentTranslations['contact-instagram'];
            
            const viberLink = contactSection.querySelector('.viber-link');
            if (viberLink) viberLink.textContent = currentTranslations['contact-viber'];
        }
        
        // Обновляем навигацию в футере
        const footerNavLinks = document.querySelectorAll('.footer-nav a');
        footerNavLinks.forEach(link => {
            const href = link.getAttribute('href') || '';
            if (linkMatches(href, ['#about'])) link.textContent = currentTranslations['nav-about'];
            if (linkMatches(href, ['#trainer'])) link.textContent = currentTranslations['nav-trainer'];
            if (linkMatches(href, ['#halls'])) link.textContent = currentTranslations['nav-halls'];
            if (linkMatches(href, ['#schedule'])) link.textContent = currentTranslations['nav-schedule'];
            if (linkMatches(href, ['#booking'])) link.textContent = currentTranslations['nav-booking'];
            if (linkMatches(href, ['#contact'])) link.textContent = currentTranslations['nav-contact'];
            if (linkMatches(href, ['#faq'])) link.textContent = currentTranslations['nav-faq'];
            if (href === 'tournaments.html' || linkMatches(href, ['#tournaments'])) link.textContent = currentTranslations['nav-tournaments'];
            if (href === 'rating.html' || linkMatches(href, ['#rating'])) link.textContent = currentTranslations['nav-rating'];
            if (href === 'gallery.html' || linkMatches(href, ['#gallery'])) link.textContent = currentTranslations['nav-gallery'];
            if (href === 'history.html' || linkMatches(href, ['#history'])) link.textContent = currentTranslations['nav-history'];
        });
        
        // Обновляем FAQ секцию
        const faqSection = document.querySelector('#faq');
        if (faqSection) {
            // Обновляем заголовок
            const faqTitle = faqSection.querySelector('.section-title');
            if (faqTitle) faqTitle.textContent = currentTranslations['faq-title'];
            
            // Обновляем вопросы и ответы
            const faqQuestions = faqSection.querySelectorAll('.faq-question h3');
            const faqAnswers = faqSection.querySelectorAll('.faq-answer p');
            
            const questions = [
                currentTranslations['faq-q1'], currentTranslations['faq-q2'],
                currentTranslations['faq-q3'], currentTranslations['faq-q4'],
                currentTranslations['faq-q5'], currentTranslations['faq-q6'],
                currentTranslations['faq-q7'], currentTranslations['faq-q8']
            ];
            
            const answers = [
                currentTranslations['faq-a1'], currentTranslations['faq-a2'],
                currentTranslations['faq-a3'], currentTranslations['faq-a4'],
                currentTranslations['faq-a5'], currentTranslations['faq-a6'],
                currentTranslations['faq-a7'], currentTranslations['faq-a8']
            ];
            
            faqQuestions.forEach((question, index) => {
                if (questions[index]) question.textContent = questions[index];
            });
            
            faqAnswers.forEach((answer, index) => {
                if (answers[index]) answer.textContent = answers[index];
            });
            
            // Обновляем CTA секцию
            const faqCtaTitle = faqSection.querySelector('.faq-cta h3');
            if (faqCtaTitle) faqCtaTitle.textContent = currentTranslations['faq-cta-title'];
            
            const faqCtaText = faqSection.querySelector('.faq-cta p');
            if (faqCtaText) faqCtaText.textContent = currentTranslations['faq-cta-text'];
            
            const faqCtaTelegram = faqSection.querySelector('.faq-contact-btn.telegram');
            if (faqCtaTelegram) faqCtaTelegram.textContent = currentTranslations['faq-cta-telegram'];
            
            const faqCtaPhone = faqSection.querySelector('.faq-contact-btn.phone');
            if (faqCtaPhone) faqCtaPhone.textContent = currentTranslations['faq-cta-phone'];
        }
        
        // Обновляем турниры
        const tournamentsSection = document.querySelector('#tournaments');
        if (tournamentsSection) {
            const tournamentsTitle = tournamentsSection.querySelector('.section-title');
            if (tournamentsTitle) tournamentsTitle.textContent = currentTranslations['tournaments-title'];
            
            const tournamentCard = tournamentsSection.querySelector('.tournament-card');
            if (tournamentCard) {
                const tournamentCardTitle = tournamentCard.querySelector('h3');
                const tournamentCardText = tournamentCard.querySelector('p');
                if (tournamentCardTitle) tournamentCardTitle.textContent = currentTranslations['tournament-card-title'];
                if (tournamentCardText) tournamentCardText.textContent = currentTranslations['tournament-card-text'];
            }
        }
        
        // Обновляем галерею
        const gallerySection = document.querySelector('#gallery');
        if (gallerySection) {
            const galleryTitle = gallerySection.querySelector('.section-title');
            if (galleryTitle) galleryTitle.textContent = currentTranslations['gallery-title'];
            
            const galleryPlaceholder = gallerySection.querySelector('.gallery-placeholder');
            if (galleryPlaceholder) {
                const placeholderTitle = galleryPlaceholder.querySelector('h3');
                const placeholderText = galleryPlaceholder.querySelector('p');
                if (placeholderTitle) placeholderTitle.textContent = currentTranslations['gallery-placeholder-title'];
                if (placeholderText) placeholderText.textContent = currentTranslations['gallery-placeholder-text'];
            }
        }
        
        // Обновляем alt атрибуты изображений
        const trainerImg = document.querySelector('.trainer-img');
        if (trainerImg) trainerImg.alt = currentTranslations['trainer-img-alt'];
        
        const hall1Img = document.querySelector('.hall-img');
        if (hall1Img) hall1Img.alt = currentTranslations['hall1-img-alt'];
        
        const hall2Img = document.querySelectorAll('.hall-img')[1];
        if (hall2Img) hall2Img.alt = currentTranslations['hall2-img-alt'];
        
        const tournamentImg = document.querySelector('.tournament-image');
        if (tournamentImg) tournamentImg.alt = currentTranslations['tournament-img-alt'];
        
        // Обновляем атрибут lang у html
        document.documentElement.lang = lang;
        
        // Обновляем tooltip переключателя темы
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            if (currentTheme === 'dark') {
                themeToggle.title = currentTranslations['theme-toggle-dark'];
            } else {
                themeToggle.title = currentTranslations['theme-toggle-light'];
            }
        }
        
        console.log(`Язык переключен на: ${lang}`);
    }
    
    // Инициализируем язык при загрузке
    switchLanguage(currentLang);

    // Мобильное меню будет добавлено позже

    // Обработчики клавиатуры будут добавлены позже

    // Система уведомлений для турниров
    function updateTournamentNotifications() {
        // Подсчитываем количество активных турниров
        const tournamentCards = document.querySelectorAll('.tournament-card');
        const activeTournaments = tournamentCards.length;
        
        // Обновляем бейджи в навигации
        const desktopBadge = document.getElementById('tournamentBadge');
        const mobileBadge = document.getElementById('mobileTournamentBadge');
        
        if (activeTournaments > 0) {
            if (desktopBadge) {
                desktopBadge.textContent = activeTournaments;
                desktopBadge.classList.remove('hidden');
            }
            if (mobileBadge) {
                mobileBadge.textContent = activeTournaments;
                mobileBadge.classList.remove('hidden');
            }
        } else {
            if (desktopBadge) {
                desktopBadge.classList.add('hidden');
            }
            if (mobileBadge) {
                mobileBadge.classList.add('hidden');
            }
        }
        
        console.log(`Найдено активных турниров: ${activeTournaments}`);
    }
    
    // Запускаем обновление уведомлений при загрузке
    updateTournamentNotifications();
    
    // Добавляем функцию для программного добавления/удаления турниров
    window.addTournament = function() {
        // В реальном приложении здесь будет логика добавления нового турнира
        console.log('Добавлен новый турнир');
        updateTournamentNotifications();
    };
    
    window.removeTournament = function() {
        // В реальном приложении здесь будет логика удаления турнира
        console.log('Удален турнир');
        updateTournamentNotifications();
    };
    
    // Скрываем уведомления при клике на ссылку турниров
    const tournamentLinks = document.querySelectorAll('a[href="#tournaments"]');
    tournamentLinks.forEach(link => {
        link.addEventListener('click', function() {
            // В реальном приложении можно добавить логику "прочитано"
            console.log('Пользователь перешел к турнирам');
        });
    });

    // FAQ функциональность
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item) => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', function() {
            const isActive = item.classList.contains('active');
            
            // Закрываем все остальные FAQ
            faqItems.forEach((otherItem) => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Переключаем текущий FAQ
            if (isActive) {
                item.classList.remove('active');
            } else {
                item.classList.add('active');
            }
        });
    });

    // Инициализация темы
    initializeTheme();

    // Инициализация блоков категорий турнира (до 3 категорий)
    initializeTournamentCategoryBlocks();
    
    // Обработчик формы регистрации на турнир
    const tournamentForm = document.getElementById('tournamentRegistrationForm');
    
    if (tournamentForm) {
        tournamentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            
            // Получаем значения полей
            const name = document.getElementById('tournamentName').value.trim();
            const categoryBlocks = Array.from(document.querySelectorAll('.category-block'));
            const selectedCategories = categoryBlocks
                .map(block => {
                    const select = block.querySelector('select');
                    const partnerCheckbox = block.querySelector('.partner-checkbox-label input[type="checkbox"]');
                    const partnerNameInput = block.querySelector('.partner-name-group input');
                    
                    return {
                        category: select ? select.value : '',
                        lookingForPartner: partnerCheckbox ? partnerCheckbox.checked : false,
                        partnerName: partnerNameInput ? partnerNameInput.value.trim() : ''
                    };
                })
                .filter(item => item.category);
            
            // Валидация имени
            if (!name || name.length < 2) {
                showError('tournamentName', 'Введите ваше имя и фамилию (минимум 2 символа)');
                isValid = false;
            } else {
                hideError('tournamentName');
            }
            
            const firstCategorySelect = document.getElementById('tournamentCategory1');
            
            // Валидация категории
            if (selectedCategories.length === 0) {
                if (firstCategorySelect) {
                    firstCategorySelect.classList.add('field-error');
                }
                isValid = false;
            } else {
                if (firstCategorySelect) {
                    firstCategorySelect.classList.remove('field-error');
                }
            }
            
            // Если форма валидна, отправляем данные
            if (isValid) {
                const submitBtn = tournamentForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = 'Отправка...';
                submitBtn.disabled = true;
                
                // Подготавливаем данные для отправки
                const formData = {
                    name: name,
                    categories: selectedCategories
                };
                
                // Проверка: если сайт открыт через file://, показываем сообщение
                if (window.location.protocol === 'file:') {
                    const successMessage = document.getElementById('tournamentSuccessMessage');
                    tournamentForm.style.display = 'none';
                    successMessage.textContent = 'Спасибо за регистрацию! Для сохранения данных откройте сайт через http://localhost:3000/tournaments.html';
                    successMessage.style.display = 'block';
                    successMessage.classList.add('show');
                    successMessage.scrollIntoView({ behavior: 'smooth' });
                    
                    setTimeout(() => {
                        alert('📞 Спасибо за регистрацию на турнир!\n\n⚠️ Для полной функциональности откройте сайт через:\nhttp://localhost:3000/tournaments.html');
                        setTimeout(() => {
                            successMessage.classList.remove('show');
                            successMessage.style.display = 'none';
                            tournamentForm.style.display = 'block';
                            submitBtn.textContent = originalText;
                            submitBtn.disabled = false;
                            tournamentForm.reset();
                        }, 5000);
                    }, 1000);
                    return;
                }
                
                // Определяем URL API
                const isLocalhost = window.location.hostname === 'localhost' || 
                                   window.location.hostname === '127.0.0.1';
                
                const apiUrl = isLocalhost 
                    ? '/api/submit_tournament_registration'
                    : 'https://formspree.io/f/YOUR_FORM_ID'; // ЗАМЕНИТЕ НА ВАШ ENDPOINT
                
                const isFormspree = apiUrl.includes('formspree.io');
                
                // Формируем данные
                let requestBody;
                let requestHeaders;
                
                if (isFormspree) {
                    const categoriesPayload = formData.categories
                        .map((item, index) => {
                            const label = `Категория ${index + 1}`;
                            const partnerInfo = item.lookingForPartner
                                ? 'ищу партнера'
                                : (item.partnerName ? `с партнером: ${item.partnerName}` : 'одиночно');
                            return `${label}: ${item.category || 'не выбрана'} (${partnerInfo})`;
                        })
                        .join('; ');
                    
                    requestBody = new URLSearchParams({
                        name: formData.name,
                        categories: categoriesPayload,
                        _subject: 'Регистрация на турнир - Badminton Club'
                    });
                    requestHeaders = {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    };
                } else {
                    requestBody = JSON.stringify(formData);
                    requestHeaders = {
                        'Content-Type': 'application/json',
                    };
                }
                
                // Отправка данных на сервер
                fetch(apiUrl, {
                    method: 'POST',
                    headers: requestHeaders,
                    body: requestBody
                })
                .then(response => {
                    if (isFormspree) {
                        return response.json();
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success || data.ok) {
                        const successMessage = document.getElementById('tournamentSuccessMessage');
                        if (successMessage) {
                            successMessage.textContent = 'Спасибо за регистрацию на турнир! Мы свяжемся с вами в ближайшее время.';
                            successMessage.style.display = 'block';
                            successMessage.classList.add('show');
                            successMessage.scrollIntoView({ behavior: 'smooth' });
                        }
                        
                        // Сбрасываем форму
                        tournamentForm.reset();
                        initializeTournamentCategoryBlocks();
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                        if (window.location.search) {
                            history.replaceState(null, '', window.location.pathname);
                        }
                        
                        setTimeout(() => {
                            if (successMessage) {
                                successMessage.classList.remove('show');
                                successMessage.style.display = 'none';
                            }
                        }, 4000);
                    } else {
                        alert('Ошибка: ' + (data.message || 'Не удалось отправить регистрацию'));
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    }
                })
                .catch(error => {
                    console.error('Ошибка:', error);
                    const errorMessage = isLocalhost
                        ? 'Произошла ошибка при отправке формы. Убедитесь, что сервер запущен (node server.js)'
                        : 'Произошла ошибка при отправке формы. Пожалуйста, попробуйте позже или свяжитесь с нами напрямую.';
                    alert(errorMessage);
                    
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                });
            } else {
                // Прокручиваем к первой ошибке
                const firstError = document.querySelector('.error-message.show');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            }
        });
    }

    prefillTournamentFormFromQuery();

    console.log('UTM Badminton Club - сайт загружен успешно! 🏸');
});

function initializeTournamentCategoryBlocks() {
    const categoryBlocks = document.querySelectorAll('.category-block');
    if (!categoryBlocks.length) {
        return;
    }
    
    categoryBlocks.forEach(block => {
        const partnerCheckbox = block.querySelector('.partner-checkbox-label input[type="checkbox"]');
        const partnerNameGroup = block.querySelector('.partner-name-group');
        const partnerNameInput = partnerNameGroup ? partnerNameGroup.querySelector('input') : null;
        
        if (!partnerCheckbox || !partnerNameGroup || !partnerNameInput) {
            return;
        }
        
        const updateVisibility = () => {
            if (partnerCheckbox.checked) {
                partnerNameGroup.style.display = 'none';
                partnerNameInput.value = '';
            } else {
                partnerNameGroup.style.display = '';
            }
        };
        
        if (!partnerCheckbox.dataset.partnerHandlerAttached) {
            partnerCheckbox.addEventListener('change', updateVisibility);
            partnerCheckbox.dataset.partnerHandlerAttached = 'true';
        }
        
        updateVisibility();
    });
}

function prefillTournamentFormFromQuery() {
    const tournamentForm = document.getElementById('tournamentRegistrationForm');
    if (!tournamentForm) return;
    
    const params = new URLSearchParams(window.location.search);
    if (!params.toString()) return;
    
    let hasPrefill = false;
    
    const nameParam = params.get('name');
    if (nameParam) {
        const nameInput = document.getElementById('tournamentName');
        if (nameInput) {
            nameInput.value = decodeURIComponent(nameParam.replace(/\+/g, ' '));
            hasPrefill = true;
        }
    }
    
    ['1', '2', '3'].forEach(index => {
        const categoryValue = params.get(`category${index}`);
        const select = document.getElementById(`tournamentCategory${index}`);
        if (select && categoryValue) {
            const optionExists = Array.from(select.options).some(opt => opt.value === categoryValue);
            if (optionExists) {
                select.value = categoryValue;
                hasPrefill = true;
            }
        }
        
        const partnerCheckbox = document.getElementById(`lookingForPartner${index}`);
        const partnerCheckboxParam = params.get(`lookingForPartner${index}`);
        if (partnerCheckbox && partnerCheckboxParam !== null) {
            partnerCheckbox.checked = partnerCheckboxParam === 'on' || partnerCheckboxParam === 'true' || partnerCheckboxParam === '1' || partnerCheckboxParam === 'yes';
            hasPrefill = true;
        }
        
        const partnerNameInput = document.getElementById(`partnerName${index}`);
        const partnerNameParam = params.get(`partnerName${index}`);
        if (partnerNameInput && partnerNameParam) {
            partnerNameInput.value = decodeURIComponent(partnerNameParam.replace(/\+/g, ' '));
            hasPrefill = true;
        }
    });
    
    if (!hasPrefill) return;
    
    initializeTournamentCategoryBlocks();
    
    const autoSubmit = params.get('autoSubmit');
    if (autoSubmit !== '0') {
        setTimeout(() => {
            tournamentForm.dispatchEvent(new Event('submit', { cancelable: true }));
        }, 300);
        history.replaceState(null, '', window.location.pathname);
    }
}

// Функция инициализации темы
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
}

// Функция установки темы
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Обновляем состояние переключателя темы
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        // Устанавливаем состояние checkbox
        themeToggle.checked = (theme === 'dark');
        
        // Обновляем title
        if (theme === 'dark') {
            themeToggle.title = getCurrentTranslation('theme-toggle-dark');
        } else {
            themeToggle.title = getCurrentTranslation('theme-toggle-light');
        }
    }
    
    console.log(`Тема изменена на: ${theme}`);
}

// Функция получения текущего перевода
function getCurrentTranslation(key) {
    const currentLang = localStorage.getItem('language') || 'ru';
    const translations = {
        ru: {
            'theme-toggle-light': 'Переключить на темную тему',
            'theme-toggle-dark': 'Переключить на светлую тему'
        },
        ro: {
            'theme-toggle-light': 'Comută la tema întunecată',
            'theme-toggle-dark': 'Comută la tema luminoasă'
        },
        en: {
            'theme-toggle-light': 'Switch to dark theme',
            'theme-toggle-dark': 'Switch to light theme'
        }
    };
    
    return translations[currentLang]?.[key] || key;
}

// Обработчик переключения темы (устаревший - заменен на новый выше)
document.addEventListener('DOMContentLoaded', function() {
    // Старый обработчик удален - используется новый универсальный

    // Обработчик скролла для адаптивной шапки
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    let ticking = false;
    let scrollDirection = 'down';

    function updateHeader() {
        // Header теперь статичный на десктопе - не изменяется при скролле
        // Эта функциональность отключена для десктопной версии
        // Оставляем только для мобильных устройств
        if (window.innerWidth > 768) {
            ticking = false;
            return;
        }
        
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollDelta = scrollTop - lastScrollTop;
        
        // Определяем направление скролла
        if (Math.abs(scrollDelta) > 5) { // Минимальный порог для избежания дрожания
            scrollDirection = scrollDelta > 0 ? 'down' : 'up';
        }
        
        // Удаляем все классы скролла
        header.classList.remove('scrolled', 'scrolled-down', 'scrolled-up');
        
        if (scrollTop <= 50) {
            // При возвращении на самый верх - меню большое (обычное состояние)
            // Никаких дополнительных классов не добавляем
        } else if (scrollTop > 200) {
            // При скролле вниз - делаем шапку очень маленькой
            if (scrollDirection === 'down') {
                header.classList.add('scrolled-down');
            }
            // При скролле вверх - делаем шапку увеличенной до среднего размера
            else if (scrollDirection === 'up') {
                header.classList.add('scrolled-up');
            }
        } else if (scrollTop > 100) {
            // Средний размер при скролле
            header.classList.add('scrolled');
        }
        
        lastScrollTop = scrollTop;
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick, { passive: true });

    // Функциональность для просмотра фото в модальном окне
    const courtPhoto = document.querySelector('.badminton-court-photo');
    const photoModal = document.getElementById('photoModal');
    const modalPhoto = document.getElementById('modalPhoto');
    const closePhotoModal = document.getElementById('closePhotoModal');

    if (courtPhoto && photoModal && modalPhoto) {
        // Открытие модального окна при клике на фото
        courtPhoto.addEventListener('click', function(e) {
            e.stopPropagation();
            const originalSrc = this.src;
            modalPhoto.src = originalSrc;
            photoModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        // Закрытие модального окна
        function closeModal() {
            photoModal.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Закрытие по клику на кнопку
        if (closePhotoModal) {
            closePhotoModal.addEventListener('click', closeModal);
        }

        // Закрытие по клику на фон
        photoModal.addEventListener('click', function(e) {
            if (e.target === photoModal) {
                closeModal();
            }
        });

        // Закрытие по клавише Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && photoModal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // Сортировка таблицы рейтинга
    const ratingTable = document.querySelector('.rating-table');
    if (ratingTable) {
        const tbody = ratingTable.querySelector('tbody');
        const sortableHeaders = ratingTable.querySelectorAll('th.points-col, th.matches-col, th.wins-col, th.winrate-col, th.trend-col');
        
        let currentSort = {
            column: null,
            direction: 'asc'
        };

        function parseValue(cell) {
            const text = cell.textContent.trim();
            // Для процентов убираем символ %
            if (text.includes('%')) {
                return parseFloat(text.replace('%', ''));
            }
            // Для тренда извлекаем число (может быть +15, -3 и т.д.)
            if (text.includes('↗') || text.includes('↘') || text.includes('→')) {
                const match = text.match(/[+-]?\d+/);
                return match ? parseFloat(match[0]) : 0;
            }
            // Для чисел
            const num = parseFloat(text);
            return isNaN(num) ? 0 : num;
        }

        function getColumnType(columnIndex) {
            const header = ratingTable.querySelectorAll('thead th')[columnIndex];
            if (!header) return 'insertion';
            
            const className = header.className;
            if (className.includes('winrate-col')) return 'merge';
            if (className.includes('trend-col')) return 'counting';
            if (className.includes('points-col') || className.includes('matches-col') || className.includes('wins-col')) {
                return 'insertion';
            }
            return 'insertion';
        }

        // Insertion Sort для Очков, Матчей, Побед
        function insertionSort(rows, columnIndex, direction) {
            for (let i = 1; i < rows.length; i++) {
                const keyRow = rows[i];
                const keyValue = parseValue(keyRow.cells[columnIndex]);
                let j = i - 1;
                
                while (j >= 0) {
                    const compareValue = parseValue(rows[j].cells[columnIndex]);
                    const shouldSwap = direction === 'asc' 
                        ? compareValue < keyValue 
                        : compareValue > keyValue;
                    
                    if (shouldSwap) {
                        rows[j + 1] = rows[j];
                        j--;
                    } else {
                        break;
                    }
                }
                rows[j + 1] = keyRow;
            }
            return rows;
        }

        // Merge Sort для % побед
        function mergeSort(rows, columnIndex, direction) {
            if (rows.length <= 1) {
                return rows;
            }

            const mid = Math.floor(rows.length / 2);
            const left = mergeSort(rows.slice(0, mid), columnIndex, direction);
            const right = mergeSort(rows.slice(mid), columnIndex, direction);

            return merge(left, right, columnIndex, direction);
        }

        function merge(left, right, columnIndex, direction) {
            const result = [];
            let leftIndex = 0;
            let rightIndex = 0;

            while (leftIndex < left.length && rightIndex < right.length) {
                const leftValue = parseValue(left[leftIndex].cells[columnIndex]);
                const rightValue = parseValue(right[rightIndex].cells[columnIndex]);
                
                const shouldTakeLeft = direction === 'asc' 
                    ? leftValue >= rightValue 
                    : leftValue <= rightValue;

                if (shouldTakeLeft) {
                    result.push(left[leftIndex]);
                    leftIndex++;
                } else {
                    result.push(right[rightIndex]);
                    rightIndex++;
                }
            }

            return result.concat(left.slice(leftIndex)).concat(right.slice(rightIndex));
        }

        // Counting Sort для Тренд
        function countingSort(rows, columnIndex, direction) {
            // Находим минимальное и максимальное значение
            let min = Infinity;
            let max = -Infinity;
            
            rows.forEach(row => {
                const value = parseValue(row.cells[columnIndex]);
                if (value < min) min = value;
                if (value > max) max = value;
            });

            // Создаем массив для подсчета
            const range = max - min + 1;
            const count = new Array(range).fill(0);
            
            // Подсчитываем частоту каждого значения
            rows.forEach(row => {
                const value = parseValue(row.cells[columnIndex]);
                count[value - min]++;
            });

            // Создаем массив строк, сгруппированных по значениям
            const buckets = new Array(range).fill(null).map(() => []);
            rows.forEach(row => {
                const value = parseValue(row.cells[columnIndex]);
                buckets[value - min].push(row);
            });

            // Собираем результат
            const result = [];
            if (direction === 'asc') {
                // По убыванию (больше = выше)
                for (let i = buckets.length - 1; i >= 0; i--) {
                    result.push(...buckets[i]);
                }
            } else {
                // По возрастанию (меньше = выше)
                for (let i = 0; i < buckets.length; i++) {
                    result.push(...buckets[i]);
                }
            }

            return result;
        }

        function sortTable(columnIndex, direction) {
            const rows = Array.from(tbody.querySelectorAll('tr'));
            const columnType = getColumnType(columnIndex);
            
            let sortedRows;
            
            switch (columnType) {
                case 'merge':
                    sortedRows = mergeSort(rows, columnIndex, direction);
                    break;
                case 'counting':
                    sortedRows = countingSort(rows, columnIndex, direction);
                    break;
                case 'insertion':
                default:
                    sortedRows = insertionSort(rows, columnIndex, direction);
                    break;
            }

            // Удаляем все строки
            rows.forEach(row => tbody.removeChild(row));
            
            // Добавляем отсортированные строки
            sortedRows.forEach(row => tbody.appendChild(row));
            
            // Обновляем ранги
            const updatedRows = tbody.querySelectorAll('tr');
            updatedRows.forEach((row, index) => {
                const rankCell = row.querySelector('.rank');
                if (rankCell) {
                    rankCell.textContent = index + 1;
                }
            });
        }

        sortableHeaders.forEach((header, index) => {
            // Получаем реальный индекс колонки
            const columnIndex = Array.from(header.parentElement.children).indexOf(header);
            
            header.addEventListener('click', function() {
                // Убираем классы сортировки со всех заголовков
                sortableHeaders.forEach(h => {
                    h.classList.remove('sort-asc', 'sort-desc');
                });

                // Определяем направление сортировки
                if (currentSort.column === columnIndex) {
                    // Если кликнули по той же колонке, меняем направление
                    currentSort.direction = currentSort.direction === 'asc' ? 'desc' : 'asc';
                } else {
                    // Если кликнули по другой колонке, сортируем по убыванию
                    currentSort.column = columnIndex;
                    currentSort.direction = 'asc';
                }

                // Добавляем класс для визуального индикатора
                header.classList.add(currentSort.direction === 'asc' ? 'sort-asc' : 'sort-desc');

                // Сортируем таблицу
                sortTable(columnIndex, currentSort.direction);
            });
        });
    }
});

