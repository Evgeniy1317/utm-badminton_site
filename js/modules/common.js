// Общие функции и утилиты

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




