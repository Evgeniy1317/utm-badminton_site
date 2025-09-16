// Fallback для статического сервера - отправка через EmailJS
// Замените эти значения на ваши из EmailJS
const EMAILJS_SERVICE_ID = 'your_service_id';
const EMAILJS_TEMPLATE_ID = 'your_template_id';
const EMAILJS_PUBLIC_KEY = 'your_public_key';

// Функция отправки через EmailJS
function sendFormViaEmailJS(formData) {
    return new Promise((resolve, reject) => {
        // Проверяем, загружен ли EmailJS
        if (typeof emailjs === 'undefined') {
            reject(new Error('EmailJS не загружен'));
            return;
        }

        // Подготавливаем данные для EmailJS
        const templateParams = {
            from_name: formData.get('name'),
            from_phone: formData.get('phone'),
            from_email: formData.get('email'),
            level: formData.get('level'),
            hall: formData.get('hall'),
            day: formData.get('day'),
            message: formData.get('message'),
            to_email: 'evgenijurin998@gmail.com'
        };

        // Отправляем через EmailJS
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY)
            .then(function(response) {
                console.log('EmailJS отправлен успешно:', response);
                resolve({ success: true, message: 'Заявка успешно отправлена!' });
            })
            .catch(function(error) {
                console.error('Ошибка EmailJS:', error);
                reject(new Error('Ошибка отправки через EmailJS'));
            });
    });
}

// Функция отправки через Telegram Bot API (альтернатива)
function sendFormViaTelegram(formData) {
    const botToken = 'YOUR_BOT_TOKEN'; // Замените на ваш токен
    const chatId = 'YOUR_CHAT_ID'; // Замените на ваш chat ID
    
    const message = `🎾 Новая заявка на тренировку:

👤 Имя: ${formData.get('name')}
📞 Телефон: ${formData.get('phone')}
📧 Email: ${formData.get('email') || 'Не указан'}
🏸 Уровень: ${formData.get('level')}
🏟️ Зал: ${formData.get('hall')}
📅 День: ${formData.get('day')}
💬 Сообщение: ${formData.get('message') || 'Не указано'}

⏰ Дата: ${new Date().toLocaleString('ru-RU')}`;

    return fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.ok) {
            return { success: true, message: 'Заявка отправлена в Telegram!' };
        } else {
            throw new Error('Ошибка отправки в Telegram');
        }
    });
}

// Экспортируем функции для использования в основном скрипте
window.formFallback = {
    sendViaEmailJS: sendFormViaEmailJS,
    sendViaTelegram: sendFormViaTelegram
};
