// Модальное окно для просмотра фото

document.addEventListener('DOMContentLoaded', function() {
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

