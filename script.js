// UTM Badminton Club - JavaScript функциональность

document.addEventListener('DOMContentLoaded', function() {
    
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
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
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
        
        field.classList.add('error');
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }

    // Функция скрытия ошибки
    function hideError(fieldId) {
        const field = document.getElementById(fieldId);
        const errorElement = document.getElementById(fieldId + 'Error');
        
        field.classList.remove('error');
        errorElement.classList.remove('show');
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
            const formData = new FormData();
            formData.append('name', name);
            formData.append('phone', phone);
            formData.append('email', email);
            formData.append('level', level);
            formData.append('hall', hall);
            formData.append('day', day);
            formData.append('message', message);
            
            // Для GitHub Pages используем встроенную обработку Netlify
            // или показываем контактную информацию
            console.log('Данные формы:', {
                name, phone, email, level, hall, day, message
            });
            
            // Показываем сообщение об успехе
            bookingForm.style.display = 'none';
            successMessage.classList.add('show');
            
            // Прокручиваем к сообщению об успехе
            successMessage.scrollIntoView({ behavior: 'smooth' });
            
            // Показываем контактную информацию для связи
            setTimeout(() => {
                const contactInfo = `
📞 Спасибо за заявку! Свяжитесь с нами для подтверждения:

📧 Email: evgenijurin998@gmail.com
📱 Телефон: +373 XX XXX XXX
💬 Telegram: @your_telegram

Мы свяжемся с вами в ближайшее время!
                `;
                alert(contactInfo);
            }, 2000);
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
    const currentLang = localStorage.getItem('selectedLanguage') || 'ru';
    
    // Устанавливаем активный язык при загрузке
    setActiveLanguage(currentLang);
    
    // Обработчик для открытия/закрытия выпадающего меню
    langTrigger.addEventListener('click', function(e) {
        e.stopPropagation();
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
            
            // Сохраняем выбранный язык
            localStorage.setItem('selectedLanguage', selectedLang);
            
            // Обновляем отображение
            setActiveLanguage(selectedLang);
            
            // Переключаем язык
            switchLanguage(selectedLang);
            
            // Закрываем выпадающее меню
            langDropdown.classList.remove('show');
            langTrigger.classList.remove('active');
        });
    });
    
    // Закрытие выпадающего меню при клике вне его
    document.addEventListener('click', function(e) {
        if (!langTrigger.contains(e.target) && !langDropdown.contains(e.target)) {
            langDropdown.classList.remove('show');
            langTrigger.classList.remove('active');
        }
    });
    
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
                'trainer-name': 'Alexandru Petrov',
                'trainer-text1': 'Maestru în sport la badminton cu 15 ani de experiență în antrenament. Campion al republicii, participant la turnee internaționale. Se specializează în lucrul cu jucători de toate nivelurile — de la începători la profesioniști.',
                'trainer-text2': 'Alexandru folosește metode moderne de învățare, abordare individuală pentru fiecare elev și creează o atmosferă motivațională pentru atingerea celor mai bune rezultate.',
                'stat1-label': 'Ani experiență',
                'stat2-label': 'Elevi',
                'stat3-label': 'Victorii',
                
                // Залы
                'halls-title': 'Sălile noastre',
                'hall1-title': 'Sala №1',
                'hall1-status': 'Disponibilă',
                'hall1-text': 'Sală modernă cu acoperire profesională, iluminat de calitate și toate echipamentele necesare. Dimensiuni: 13.4 x 6.1 m. Înălțimea tavanului: 9 m. Aer condiționat.',
                'hall1-location': 'Vezi pe hartă',
                'hall2-title': 'Sala №2',
                'hall2-status': 'În curând',
                'hall2-text': 'Sală nouă modernă cu acoperire îmbunătățită și posibilități extinse. Dimensiuni planificate: 15 x 7 m. Înălțimea tavanului: 10 m. Sistem de ventilație și încălzire.',
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
                'rating-rule-1': 'Pentru victoria în turneu: +50 puncte',
                'rating-rule-2': 'Pentru locul 2: +30 puncte',
                'rating-rule-3': 'Pentru locul 3: +20 puncte',
                'rating-rule-4': 'Pentru participarea la turneu: +10 puncte',
                'rating-rule-5': 'Pentru antrenamentele regulate: +5 puncte pe săptămână',
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
                'trainer-name': 'Alexander Petrov',
                'trainer-text1': 'Master of Sports in badminton with 15 years of coaching experience. Republic champion, participant in international tournaments. Specializes in working with players of all levels — from beginners to professionals.',
                'trainer-text2': 'Alexander uses modern teaching methods, individual approach to each student and creates a motivating atmosphere for achieving the best results.',
                'stat1-label': 'Years experience',
                'stat2-label': 'Students',
                'stat3-label': 'Wins',
                
                // Залы
                'halls-title': 'Our halls',
                'hall1-title': 'Hall №1',
                'hall1-status': 'Available',
                'hall1-text': 'Modern hall with professional flooring, quality lighting and all necessary equipment. Dimensions: 13.4 x 6.1 m. Ceiling height: 9 m. Air conditioning.',
                'hall1-location': 'View on map',
                'hall2-title': 'Hall №2',
                'hall2-status': 'Coming soon',
                'hall2-text': 'New modern hall with improved flooring and expanded capabilities. Planned dimensions: 15 x 7 m. Ceiling height: 10 m. Ventilation and heating system.',
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
                
                // Переключатель темы
                'theme-toggle-light': 'Switch to dark theme',
                'theme-toggle-dark': 'Switch to light theme'
            }
        };
        
        const currentTranslations = translations[lang];
        
        // Обновляем навигацию
        document.querySelector('a[href="#about"]').innerHTML = currentTranslations['nav-about'];
        document.querySelector('a[href="#trainer"]').innerHTML = currentTranslations['nav-trainer'];
        document.querySelector('a[href="#halls"]').innerHTML = currentTranslations['nav-halls'];
        document.querySelector('a[href="#schedule"]').innerHTML = currentTranslations['nav-schedule'];
        document.querySelector('a[href="#booking"]').innerHTML = currentTranslations['nav-booking'];
        document.querySelector('a[href="#rating"]').innerHTML = currentTranslations['nav-rating'];
        document.querySelector('a[href="#gallery"]').innerHTML = currentTranslations['nav-gallery'];
        document.querySelector('a[href="#history"]').innerHTML = currentTranslations['nav-history'];
        document.querySelector('a[href="#contact"]').innerHTML = currentTranslations['nav-contact'];
        
        // Обновляем турниры с сохранением бейджа
        const tournamentLink = document.querySelector('a[href="#tournaments"]');
        if (tournamentLink) {
            const badge = tournamentLink.querySelector('.notification-badge');
            const badgeText = badge ? badge.textContent : '';
            tournamentLink.innerHTML = currentTranslations['nav-tournaments'] + 
                (badgeText ? `<span class="notification-badge" id="tournamentBadge">${badgeText}</span>` : '');
        }
        
        // Обновляем FAQ в навигации
        document.querySelector('a[href="#faq"]').textContent = currentTranslations['nav-faq'];
        
        // Обновляем мобильную навигацию
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === '#about') link.innerHTML = currentTranslations['nav-about'];
            if (href === '#trainer') link.innerHTML = currentTranslations['nav-trainer'];
            if (href === '#halls') link.innerHTML = currentTranslations['nav-halls'];
            if (href === '#schedule') link.innerHTML = currentTranslations['nav-schedule'];
            if (href === '#booking') link.innerHTML = currentTranslations['nav-booking'];
            if (href === '#rating') link.innerHTML = currentTranslations['nav-rating'];
            if (href === '#gallery') link.innerHTML = currentTranslations['nav-gallery'];
            if (href === '#history') link.innerHTML = currentTranslations['nav-history'];
            if (href === '#contact') link.innerHTML = currentTranslations['nav-contact'];
            if (href === '#faq') link.innerHTML = currentTranslations['nav-faq'];
            if (href === '#tournaments') {
                const badge = link.querySelector('.notification-badge');
                const badgeText = badge ? badge.textContent : '';
                link.innerHTML = currentTranslations['nav-tournaments'] + 
                    (badgeText ? `<span class="notification-badge mobile-notification">${badgeText}</span>` : '');
            }
        });
        
        // Обновляем hero секцию
        document.getElementById('hero-title').textContent = currentTranslations['hero-title'];
        document.getElementById('hero-subtitle').innerHTML = currentTranslations['hero-subtitle'];
        document.getElementById('hero-btn').textContent = currentTranslations['hero-btn'];
        
        // Обновляем секцию "О нас"
        document.querySelector('#about .section-title').textContent = currentTranslations['about-title'];
        const aboutTexts = document.querySelectorAll('#about .about-text p');
        aboutTexts[0].textContent = currentTranslations['about-text1'];
        aboutTexts[1].textContent = currentTranslations['about-text2'];
        
        // Обновляем карточки преимуществ
        const benefitCards = document.querySelectorAll('.benefit-card');
        benefitCards[0].querySelector('h3').textContent = currentTranslations['benefit1-title'];
        benefitCards[0].querySelector('p').textContent = currentTranslations['benefit1-text'];
        benefitCards[1].querySelector('h3').textContent = currentTranslations['benefit2-title'];
        benefitCards[1].querySelector('p').textContent = currentTranslations['benefit2-text'];
        benefitCards[2].querySelector('h3').textContent = currentTranslations['benefit3-title'];
        benefitCards[2].querySelector('p').textContent = currentTranslations['benefit3-text'];
        benefitCards[3].querySelector('h3').textContent = currentTranslations['benefit4-title'];
        benefitCards[3].querySelector('p').textContent = currentTranslations['benefit4-text'];
        
        // Обновляем секцию тренера
        document.querySelector('#trainer .section-title').textContent = currentTranslations['trainer-title'];
        document.querySelector('.trainer-info h3').textContent = currentTranslations['trainer-name'];
        const trainerTexts = document.querySelectorAll('.trainer-info p');
        trainerTexts[0].textContent = currentTranslations['trainer-text1'];
        trainerTexts[1].textContent = currentTranslations['trainer-text2'];
        
        // Обновляем статистику тренера
        const statLabels = document.querySelectorAll('.stat-label');
        if (statLabels.length >= 4) {
            statLabels[0].textContent = currentTranslations['stat1-label'];
            statLabels[1].textContent = currentTranslations['stat2-label'];
            statLabels[2].textContent = currentTranslations['stat3-label'];
            statLabels[3].textContent = currentTranslations['stat4-label'];
        }
        
        // Обновляем секцию залов
        document.querySelector('#halls .section-title').textContent = currentTranslations['halls-title'];
        const hallCards = document.querySelectorAll('.hall-card');
        hallCards[0].querySelector('.hall-title').textContent = currentTranslations['hall1-title'];
        hallCards[0].querySelector('.hall-status').textContent = currentTranslations['hall1-status'];
        hallCards[0].querySelector('.hall-info p').textContent = currentTranslations['hall1-text'];
        hallCards[0].querySelector('.location-btn').textContent = currentTranslations['hall1-location'];
        hallCards[1].querySelector('.hall-title').textContent = currentTranslations['hall2-title'];
        hallCards[1].querySelector('.hall-status').textContent = currentTranslations['hall2-status'];
        hallCards[1].querySelector('.hall-info p').textContent = currentTranslations['hall2-text'];
        hallCards[1].querySelector('.location-btn').textContent = currentTranslations['hall2-location'];
        
        // Обновляем расписание
        document.querySelector('#schedule .section-title').textContent = currentTranslations['schedule-title'];
        const scheduleCards = document.querySelectorAll('.schedule-card');
        const dayNames = [currentTranslations['monday'], currentTranslations['tuesday'], currentTranslations['wednesday'], 
                         currentTranslations['saturday'], currentTranslations['sunday']];
        scheduleCards.forEach((card, index) => {
            if (dayNames[index]) {
                card.querySelector('.day-name').textContent = dayNames[index];
            }
        });
        
        // Обновляем форму записи
        document.querySelector('#booking .section-title').textContent = currentTranslations['booking-title'];
        document.querySelector('#successMessage').textContent = currentTranslations['success-message'];
        
        // Обновляем поля формы (пропускаем скрытое поле для ботов)
        const formLabels = document.querySelectorAll('#bookingForm .form-group label');
        formLabels[0].textContent = currentTranslations['form-name'];
        formLabels[1].textContent = currentTranslations['form-phone'];
        formLabels[2].textContent = currentTranslations['form-email'];
        formLabels[3].textContent = currentTranslations['form-level'];
        formLabels[4].textContent = currentTranslations['form-hall'];
        formLabels[5].textContent = currentTranslations['form-day'];
        formLabels[6].textContent = currentTranslations['form-message'];
        
        // Обновляем опции формы
        const levelOptions = document.querySelectorAll('#level option');
        levelOptions[0].textContent = currentTranslations['level-beginner'];
        levelOptions[1].textContent = currentTranslations['level-intermediate'];
        levelOptions[2].textContent = currentTranslations['level-advanced'];
        levelOptions[3].textContent = currentTranslations['level-professional'];
        
        const hallOptions = document.querySelectorAll('#hall option');
        hallOptions[0].textContent = currentTranslations['hall1-option'];
        hallOptions[1].textContent = currentTranslations['hall2-option'];
        
        const dayOptions = document.querySelectorAll('#day option');
        dayOptions.forEach((option, index) => {
            option.textContent = dayNames[index];
        });
        
        document.querySelector('#message').placeholder = currentTranslations['message-placeholder'];
        document.querySelector('#bookingForm button[type="submit"]').textContent = currentTranslations['form-submit'];
        
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
        document.querySelector('#contact .section-title').textContent = currentTranslations['contact-title'];
        const contactItems = document.querySelectorAll('.contact-item');
        contactItems[0].querySelector('h4').textContent = currentTranslations['contact-phone'];
        contactItems[1].querySelector('h4').textContent = currentTranslations['contact-email'];
        contactItems[2].querySelector('h4').textContent = currentTranslations['contact-address'];
        contactItems[3].querySelector('h4').textContent = currentTranslations['contact-hours'];
        
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
        
        const contactInfo = document.querySelector('.contact-info h3');
        if (contactInfo) contactInfo.textContent = currentTranslations['contact-trainer'];
        const contactText = document.querySelector('.contact-info:last-child p');
        if (contactText) contactText.textContent = currentTranslations['contact-trainer-text'];
        
        // Обновляем социальные кнопки
        const telegramLink = document.querySelector('.telegram-link');
        if (telegramLink) telegramLink.textContent = currentTranslations['contact-telegram'];
        
        const instagramLink = document.querySelector('.instagram-link');
        if (instagramLink) instagramLink.textContent = currentTranslations['contact-instagram'];
        
        const viberLink = document.querySelector('.viber-link');
        if (viberLink) viberLink.textContent = currentTranslations['contact-viber'];
        
        
        // Обновляем подвал
        const footerTexts = document.querySelectorAll('.footer-text p');
        if (footerTexts[0]) footerTexts[0].textContent = currentTranslations['footer-copyright'];
        if (footerTexts[1]) footerTexts[1].textContent = currentTranslations['footer-university'];
        
        // Обновляем описание клуба
        const footerDescription = document.querySelector('.footer-description');
        if (footerDescription) footerDescription.textContent = currentTranslations['footer-description'];
        
        // Обновляем заголовки секций футера
        const footerHallsTitle = document.querySelector('.footer-halls h4');
        if (footerHallsTitle) footerHallsTitle.textContent = currentTranslations['footer-halls-title'];
        
        const footerContactTitle = document.querySelector('.footer-contact h4');
        if (footerContactTitle) footerContactTitle.textContent = currentTranslations['footer-contact-title'];
        
        const footerLinksTitle = document.querySelector('.footer-links h4');
        if (footerLinksTitle) footerLinksTitle.textContent = currentTranslations['footer-links-title'];
        
        // Обновляем названия залов
        const hallTitles = document.querySelectorAll('.hall-details h5');
        if (hallTitles[0]) hallTitles[0].textContent = currentTranslations['footer-hall1-title'];
        if (hallTitles[1]) hallTitles[1].textContent = currentTranslations['footer-hall2-title'];
        
        // Обновляем нижнюю часть футера
        const footerBottomTexts = document.querySelectorAll('.footer-bottom p');
        if (footerBottomTexts[0]) footerBottomTexts[0].textContent = currentTranslations['footer-copyright'];
        if (footerBottomTexts[1]) footerBottomTexts[1].textContent = currentTranslations['footer-university'];
        if (footerBottomTexts[2]) footerBottomTexts[2].textContent = currentTranslations['footer-made-with'];
        
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

    // Мобильное меню
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuOverlay = document.getElementById('mobileMenuOverlay');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    function toggleMobileMenu() {
        const isActive = mobileMenu.classList.contains('active');
        
        if (isActive) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    function openMobileMenu() {
        mobileMenuToggle.classList.add('active');
        mobileMenu.classList.add('active');
        mobileMenuOverlay.classList.add('active');
        document.body.classList.add('mobile-menu-open');
    }

    function closeMobileMenu() {
        mobileMenuToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        mobileMenuOverlay.classList.remove('active');
        document.body.classList.remove('mobile-menu-open');
    }

    // Обработчики событий для мобильного меню
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    }

    if (mobileMenuOverlay) {
        mobileMenuOverlay.addEventListener('click', closeMobileMenu);
    }

    // Закрытие меню при клике на ссылку
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });

    // Закрытие меню при изменении размера экрана
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobileMenu();
        }
    });

    // Закрытие меню при нажатии Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMobileMenu();
        }
    });

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

    console.log('UTM Badminton Club - сайт загружен успешно! 🏸');
});

// Функция инициализации темы
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
}

// Функция установки темы
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Обновляем иконку переключателя
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    if (theme === 'dark') {
        themeIcon.textContent = '☀️';
        themeToggle.title = getCurrentTranslation('theme-toggle-dark');
    } else {
        themeIcon.textContent = '🌙';
        themeToggle.title = getCurrentTranslation('theme-toggle-light');
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

// Обработчик переключения темы
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }

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
});
