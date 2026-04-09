
function sendToTelegram(formData) {
    const BOT_TOKEN = '8577579636:AAF6ZZvJvr1GCcgZw_10IQLfFEFzJLh8aL8';
    const CHAT_ID = '6145257749';
    
    const page = window.location.pathname.split('/').pop() || 'index.html';
    const source = page.includes('bytovaya') ? 'B2C (Бытовая)' : 'B2B (Рестораны)';
    
    let message = `🔔 *НОВАЯ ЗАЯВКА с сайта MosPochin*\n\n`;
    message += `📄 *Источник:* ${source} (${page})\n`;
    message += `📱 *Телефон:* ${formData.phone || 'не указан'}\n`;
    message += `👤 *Имя:* ${formData.name || 'не указано'}\n`;
    message += `🔧 *Тип техники:* ${formData.type || 'не указан'}\n`;
    message += `📝 *Проблема:* ${formData.problem || 'не указана'}\n\n`;
    message += `🕐 *Время:* ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}`;
    
    return fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            chat_id: CHAT_ID,
            text: message,
            parse_mode: 'Markdown'
        })
    });
}

function initTelegramForms() {
    const forms = document.querySelectorAll('.telegram-form');
    forms.forEach(form => {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const origText = btn.innerHTML;
            btn.disabled = true;
            btn.innerHTML = '<i class="ri-loader-4-line mr-2"></i>Отправляю...';
            
            const formData = {
                name: form.querySelector('[name="name"]')?.value || '',
                phone: form.querySelector('[name="phone"]')?.value || '',
                type: form.querySelector('[name="type"]')?.value || '',
                problem: form.querySelector('[name="problem"]')?.value || ''
            };
            
            try {
                const response = await sendToTelegram(formData);
                if (response.ok) {
                    btn.innerHTML = '<i class="ri-check-line mr-2"></i>Отправлено! ✓';
                    btn.classList.remove('bg-brand-orange', 'bg-green-600');
                    btn.classList.add('bg-green-500');
                    form.reset();
                    setTimeout(() => {
                        btn.disabled = false;
                        btn.innerHTML = origText;
                        btn.classList.remove('bg-green-500');
                        if (btn.classList.contains('bg-green-600')) {
                            btn.classList.add('bg-green-600');
                        } else {
                            btn.classList.add('bg-brand-orange');
                        }
                    }, 3000);
                } else {
                    throw new Error('Failed');
                }
            } catch (err) {
                btn.innerHTML = '<i class="ri-phone-line mr-2"></i>Позвоните нам!';
                btn.classList.remove('bg-brand-orange');
                btn.classList.add('bg-red-500');
                setTimeout(() => {
                    btn.disabled = false;
                    btn.innerHTML = origText;
                    btn.classList.remove('bg-red-500');
                    btn.classList.add('bg-brand-orange');
                }, 3000);
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initTelegramForms, 200);
});
