// Telegram credentials loaded from server-side proxy
// IMPORTANT: Never expose BOT_TOKEN in client-side code for production
const FORM_MIN_FILL_MS = 1500;
const FORM_RATE_LIMIT_MS = 60000;
const FORM_MAX_PROBLEM_LENGTH = 500;
let runtimeConfigPromise = null;

function getRuntimeConfigSource() {
    const endpointMeta = document.querySelector('meta[name="mospochin:telegram-endpoint"]')?.content?.trim() || '';
    const endpointWindow = window.__MOSPOCHIN_RUNTIME__?.telegramFormEndpoint?.trim() || '';
    return {
        telegramFormEndpoint: endpointWindow || endpointMeta || ''
    };
}

async function loadRuntimeConfig() {
    if (!runtimeConfigPromise) {
        runtimeConfigPromise = (async () => {
            const source = getRuntimeConfigSource();
            if (source.telegramFormEndpoint) return source;

            try {
                const response = await fetch('/data/runtime-config.json', {
                    cache: 'no-store'
                });
                if (!response.ok) {
                    throw new Error(`runtime-config ${response.status}`);
                }
                const json = await response.json();
                return {
                    telegramFormEndpoint: String(json.telegramFormEndpoint || '').trim()
                };
            } catch (error) {
                console.error('Runtime config unavailable:', error.message);
                return source;
            }
        })();
    }

    return runtimeConfigPromise;
}

async function sendToTelegram(formData) {
    const page = window.location.pathname.split('/').pop() || 'index.html';
    const source = page.includes('bytovaya') ? 'B2C (Бытовая)' : 'B2B (Рестораны)';
    const runtimeConfig = await loadRuntimeConfig();
    const endpoint = runtimeConfig.telegramFormEndpoint;

    if (!endpoint) {
        throw new Error('Telegram form endpoint is not configured');
    }

    let message = `🔔 *НОВАЯ ЗАЯВКА с сайта MosPochin*\n\n`;
    message += `📄 *Источник:* ${source} (${page})\n`;
    message += `📱 *Телефон:* ${formData.phone || 'не указан'}\n`;
    message += `👤 *Имя:* ${formData.name || 'не указано'}\n`;
    message += `🔧 *Тип техники:* ${formData.type || 'не указан'}\n`;
    message += `📝 *Проблема:* ${formData.problem || 'не указана'}\n\n`;
    message += `🕐 *Время:* ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}`;

    try {
        const resp = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        });
        if (resp.ok) return resp;
        throw new Error('Proxy returned non-OK status');
    } catch (e) {
        console.error('Telegram proxy unavailable:', e.message);
        throw e;
    }
}

function normalizePhone(value) {
    return (value || '').replace(/[^\d+]/g, '').trim();
}

function isValidPhone(value) {
    const digits = (value || '').replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 11;
}

function setTempButtonState(btn, text, removeClasses = [], addClasses = [], timeout = 2500) {
    const originalHtml = btn.innerHTML;
    const originalDisabled = btn.disabled;
    const hadClasses = new Map(removeClasses.map(cls => [cls, btn.classList.contains(cls)]));

    btn.disabled = true;
    btn.innerHTML = text;
    removeClasses.forEach(cls => btn.classList.remove(cls));
    addClasses.forEach(cls => btn.classList.add(cls));

    setTimeout(() => {
        btn.disabled = originalDisabled;
        btn.innerHTML = originalHtml;
        addClasses.forEach(cls => btn.classList.remove(cls));
        removeClasses.forEach(cls => {
            if (hadClasses.get(cls)) btn.classList.add(cls);
        });
    }, timeout);
}

function resetSubmitButton(btn, origText, hadBrandOrange, hadGreen600) {
    btn.disabled = false;
    btn.innerHTML = origText;
    btn.classList.remove('bg-green-500', 'bg-red-500');
    if (hadGreen600) btn.classList.add('bg-green-600');
    if (hadBrandOrange) btn.classList.add('bg-brand-orange');
}

function enhanceTelegramForm(form) {
    if (form.dataset.telegramEnhanced === '1') return;
    form.dataset.telegramEnhanced = '1';
    form.dataset.startedAt = String(Date.now());
    form.classList.add('telegram-form-enhanced');

    if (!form.querySelector('[name="website"]')) {
        const honeypot = document.createElement('input');
        honeypot.type = 'text';
        honeypot.name = 'website';
        honeypot.tabIndex = -1;
        honeypot.autocomplete = 'off';
        honeypot.setAttribute('aria-hidden', 'true');
        honeypot.style.position = 'absolute';
        honeypot.style.inset = '0 auto auto 0';
        honeypot.style.width = '1px';
        honeypot.style.height = '1px';
        honeypot.style.opacity = '0';
        honeypot.style.pointerEvents = 'none';
        form.prepend(honeypot);
    }

    const btn = form.querySelector('button[type="submit"]');
    if (btn && !form.querySelector('[name="consent"]')) {
        const wrap = document.createElement('label');
        wrap.className = 'telegram-consent flex items-start gap-3 text-sm text-slate-600 mb-4';
        wrap.innerHTML = `
            <input
                type="checkbox"
                name="consent"
                class="mt-1 h-4 w-4 rounded border-slate-300 text-brand-orange focus:ring-brand-orange"
                required
            >
            <span>Согласен(на) на обработку данных для связи по заявке.</span>
        `;
        btn.insertAdjacentElement('beforebegin', wrap);
    }
}

function initTelegramForms() {
    const forms = document.querySelectorAll('.telegram-form');
    forms.forEach(form => {
        enhanceTelegramForm(form);

        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            if (!btn) return;

            const origText = btn.innerHTML;
            const hadBrandOrange = btn.classList.contains('bg-brand-orange');
            const hadGreen600 = btn.classList.contains('bg-green-600');
            btn.disabled = true;
            btn.innerHTML = '<i class="ri-loader-4-line mr-2"></i>Отправляю...';

            const formData = {
                name: form.querySelector('[name="name"]')?.value.trim() || '',
                phone: normalizePhone(form.querySelector('[name="phone"]')?.value || ''),
                type: form.querySelector('[name="type"]')?.value.trim() || '',
                problem: form.querySelector('[name="problem"]')?.value.trim() || ''
            };

            const honeypotValue = form.querySelector('[name="website"]')?.value.trim() || '';
            const startedAt = Number(form.dataset.startedAt || Date.now());
            const fillMs = Date.now() - startedAt;
            const rateLimitKey = `mospochin_form_last_${window.location.pathname}`;
            const lastSubmitAt = Number(window.localStorage.getItem(rateLimitKey) || 0);

            if (honeypotValue) {
                resetSubmitButton(btn, origText, hadBrandOrange, hadGreen600);
                return;
            }

            if (fillMs < FORM_MIN_FILL_MS) {
                resetSubmitButton(btn, origText, hadBrandOrange, hadGreen600);
                setTempButtonState(
                    btn,
                    '<i class="ri-time-line mr-2"></i>Заполните чуть медленнее',
                    ['bg-brand-orange', 'bg-green-600'],
                    ['bg-red-500']
                );
                return;
            }

            const consentChecked = Boolean(form.querySelector('[name="consent"]')?.checked);
            if (!consentChecked) {
                resetSubmitButton(btn, origText, hadBrandOrange, hadGreen600);
                setTempButtonState(
                    btn,
                    '<i class="ri-shield-check-line mr-2"></i>Подтвердите согласие',
                    ['bg-brand-orange', 'bg-green-600'],
                    ['bg-red-500']
                );
                return;
            }

            if (!isValidPhone(formData.phone)) {
                resetSubmitButton(btn, origText, hadBrandOrange, hadGreen600);
                setTempButtonState(
                    btn,
                    '<i class="ri-error-warning-line mr-2"></i>Введите нормальный номер',
                    ['bg-brand-orange', 'bg-green-600'],
                    ['bg-red-500']
                );
                return;
            }

            if (formData.problem.length > FORM_MAX_PROBLEM_LENGTH) {
                resetSubmitButton(btn, origText, hadBrandOrange, hadGreen600);
                setTempButtonState(
                    btn,
                    '<i class="ri-file-warning-line mr-2"></i>Слишком длинное описание',
                    ['bg-brand-orange', 'bg-green-600'],
                    ['bg-red-500']
                );
                return;
            }

            if (lastSubmitAt && Date.now() - lastSubmitAt < FORM_RATE_LIMIT_MS) {
                resetSubmitButton(btn, origText, hadBrandOrange, hadGreen600);
                setTempButtonState(
                    btn,
                    '<i class="ri-time-line mr-2"></i>Повторите через минуту',
                    ['bg-brand-orange', 'bg-green-600'],
                    ['bg-red-500']
                );
                return;
            }

            try {
                const response = await sendToTelegram(formData);
                if (response.ok) {
                    window.localStorage.setItem(rateLimitKey, String(Date.now()));
                    btn.innerHTML = '<i class="ri-check-line mr-2"></i>Отправлено! ✓';
                    btn.classList.remove('bg-brand-orange', 'bg-green-600');
                    btn.classList.add('bg-green-500');
                    form.reset();
                    form.dataset.startedAt = String(Date.now());
                    setTimeout(() => {
                        resetSubmitButton(btn, origText, hadBrandOrange, hadGreen600);
                    }, 3000);
                } else {
                    throw new Error('Failed');
                }
            } catch (err) {
                btn.innerHTML = '<i class="ri-phone-line mr-2"></i>Позвоните нам!';
                btn.classList.remove('bg-brand-orange', 'bg-green-600');
                btn.classList.add('bg-red-500');
                setTimeout(() => {
                    resetSubmitButton(btn, origText, hadBrandOrange, hadGreen600);
                }, 3000);
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadRuntimeConfig();
    setTimeout(initTelegramForms, 200);
});
