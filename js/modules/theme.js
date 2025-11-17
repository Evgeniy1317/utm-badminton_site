// Переключатель темы

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
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');
    
    if (themeToggle) {
        themeToggle.checked = (theme === 'dark');
    }
    
    if (mobileThemeToggle) {
        mobileThemeToggle.checked = (theme === 'dark');
    }
    
    console.log(`Тема изменена на: ${theme}`);
}

// Переключатели темы (десктопный и мобильный)
document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('themeToggle');
    const mobileThemeToggle = document.getElementById('mobileThemeToggle');
    let isDarkTheme = localStorage.getItem('theme') === 'dark';

    // Обработчик десктопного переключателя
    if (themeToggle) {
        themeToggle.addEventListener('change', function() {
            isDarkTheme = this.checked;
            const newTheme = isDarkTheme ? 'dark' : 'light';
            
            localStorage.setItem('theme', newTheme);
            setTheme(newTheme);
            
            if (mobileThemeToggle) {
                mobileThemeToggle.checked = this.checked;
            }
        });
    }

    // Обработчик мобильного переключателя
    if (mobileThemeToggle) {
        let isProcessing = false;
        
        mobileThemeToggle.addEventListener('change', function() {
            if (isProcessing) return;
            isProcessing = true;
            
            requestAnimationFrame(() => {
                isDarkTheme = this.checked;
                const newTheme = isDarkTheme ? 'dark' : 'light';
                
                localStorage.setItem('theme', newTheme);
                setTheme(newTheme);
                
                if (themeToggle) {
                    themeToggle.checked = this.checked;
                }
                
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

    // Инициализация темы
    initializeTheme();
});

