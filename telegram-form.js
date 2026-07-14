(function () {
// Telegram credentials loaded from server-side proxy
// IMPORTANT: Never expose BOT_TOKEN in client-side code for production
const FORM_MIN_FILL_MS = 1500;
const FORM_RATE_LIMIT_MS = 60000;
const FORM_MAX_PROBLEM_LENGTH = 500;
const TELEGRAM_PAGE_METADATA_PATH = '/data/page-metadata.json';
const FORM_BASE_FIELDS = new Set(['name', 'phone', 'type', 'problem', 'website', 'consent']);
const FALLBACK_PHONE = '+79990057172';
const FALLBACK_WHATSAPP = 'https://wa.me/79990057172';
const FORM_ATTRIBUTION_FIELDS = [
    'page_url', 'page_path', 'page_title', 'referrer',
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
    'utm_service', 'utm_landing', 'yclid', 'gclid', 'metrika_client_id', 'ym_client_id'
];
const currentAttributionFields = FORM_ATTRIBUTION_FIELDS;

let runtimeConfigPromise = null;
let pageMetadataPromise = null;

function getCurrentPageFile() {
    return window.location.pathname.split('/').pop() || 'index.html';
}

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

async function loadCurrentPageMetadata() {
    if (!pageMetadataPromise) {
        pageMetadataPromise = (async () => {
            try {
                const response = await fetch(TELEGRAM_PAGE_METADATA_PATH, {
                    cache: 'no-store'
                });
                if (!response.ok) {
                    throw new Error(`page-metadata ${response.status}`);
                }

                const json = await response.json();
                return json.pages?.[getCurrentPageFile()] ?? null;
            } catch (error) {
                console.error('Page metadata unavailable:', error.message);
                return null;
            }
        })();
    }

    return pageMetadataPromise;
}

function normalizePhone(value) {
    return (value || '').replace(/[^\d+]/g, '').trim();
}

function isValidPhone(value) {
    const digits = (value || '').replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 11;
}

function normalizeBranch(branch) {
    return branch === 'household' ? 'household' : branch === 'restaurant' ? 'restaurant' : 'neutral';
}

function getSourceLabel(branch) {
    if (branch === 'household') return 'B2C (Бытовая)';
    if (branch === 'restaurant') return 'B2B (Рестораны)';
    return 'Общий сайт';
}

function getFormVariant(form) {
    return form.dataset.formVariant?.trim()
        || form.dataset.formContext?.trim()
        || document.body?.dataset?.pageIntent?.trim()
        || 'generic';
}

function makeIdempotencyKey() {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    return `lead_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
}

function trackFormGoal(goalName, form, extra = {}) {
    window.mospochinTrackGoal?.(goalName, {
        form_context: form.dataset.formContext?.trim() || '',
        page: window.location.pathname,
        ...extra
    });
}

function trackSiteEventBridge(eventName, form, extra = {}) {
    window.mospochinTrackSiteEvent?.(eventName, {
        form_id: form.dataset.formId?.trim() || form.dataset.formContext?.trim() || '',
        form_context: form.dataset.formContext?.trim() || '',
        block: form.dataset.block?.trim() || '',
        ...extra
    });
}

function getAttributionSnapshot(fields = currentAttributionFields) {
    const attribution = window.mospochinGetAttribution?.();
    if (!attribution || typeof attribution !== 'object') return null;
    if (!Array.isArray(fields) || fields.length === 0) return attribution;
    return attribution;
}

function getStoredAttributionTouch() {
    const attribution = getAttributionSnapshot();
    return attribution?.last_touch || attribution?.first_touch || {};
}

function buildAttributionHiddenFields() {
    const params = new URLSearchParams(window.location.search);
    const touch = getStoredAttributionTouch();
    const fields = {
        page_url: window.location.href,
        page_path: window.location.pathname,
        page_title: document.title || '',
        utm_source: params.get('utm_source') || touch.utm_source || '',
        utm_medium: params.get('utm_medium') || touch.utm_medium || '',
        utm_campaign: params.get('utm_campaign') || touch.utm_campaign || '',
        utm_content: params.get('utm_content') || touch.utm_content || '',
        utm_term: params.get('utm_term') || touch.utm_term || '',
        utm_service: params.get('utm_service') || touch.utm_service || '',
        utm_landing: params.get('utm_landing') || touch.utm_landing || '',
        yclid: params.get('yclid') || touch.yclid || '',
        gclid: params.get('gclid') || touch.gclid || '',
        metrika_client_id: touch.metrika_client_id || '',
        ym_client_id: touch.ym_client_id || touch.metrika_client_id || '',
        referrer: document.referrer || touch.referrer_host || ''
    };

    for (const name of FORM_ATTRIBUTION_FIELDS) {
        fields[name] = String(fields[name] || '').slice(0, 200);
    }

    return fields;
}

function ensureHiddenField(form, name, value) {
    let input = form.querySelector(`input[type="hidden"][name="${name}"]`);
    if (!input) {
        input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        form.prepend(input);
    }
    input.value = value || '';
}

function populateAttributionHiddenFields(form) {
    const fields = buildAttributionHiddenFields();
    Object.entries(fields).forEach(([name, value]) => ensureHiddenField(form, name, value));
}

function ensureAttributionFields(form) {
    populateAttributionHiddenFields(form);
}

function fillAttributionFields(form) {
    populateAttributionHiddenFields(form);
}

function collectExtraFields(form) {
    const formData = new FormData(form);
    const extraFields = {};

    for (const [name, rawValue] of formData.entries()) {
        if (FORM_BASE_FIELDS.has(name)) continue;

        const value = String(rawValue || '').trim();
        if (!value) continue;

        extraFields[name] = value.slice(0, 200);
    }

    return extraFields;
}

function safeGetLocalStorage(key) {
    try {
        return window.localStorage.getItem(key);
    } catch {
        return null;
    }
}

function safeSetLocalStorage(key, value) {
    try {
        window.localStorage.setItem(key, value);
    } catch {
        // Storage can be unavailable in private/restricted browser modes.
    }
}

function buildProblemValue(form, extraFields) {
    const explicitProblem = form.querySelector('[name="problem"]')?.value.trim() || '';
    if (explicitProblem) return explicitProblem;

    const labels = {
        quantity: 'количество',
        address: 'адрес/район',
        business_type: 'формат кухни'
    };

    const details = Object.entries(labels)
        .filter(([name]) => extraFields[name])
        .map(([name, label]) => `${label}: ${extraFields[name]}`);

    if (details.length === 0) return '';
    return `Заявка на техническое обслуживание (${details.join('; ')})`;
}

async function sendToTelegram(formData) {
    const runtimeConfig = await loadRuntimeConfig();
    const endpoint = runtimeConfig.telegramFormEndpoint;
    const pageMetadata = await loadCurrentPageMetadata();

    if (!endpoint) {
        throw new Error('Telegram form endpoint is not configured');
    }

    const branch = normalizeBranch(pageMetadata?.branch);
    const payload = {
        name: formData.name,
        phone: formData.phone,
        type: formData.type,
        problem: formData.problem,
        page: getCurrentPageFile(),
        pageVersion: document.body?.dataset?.pageVersion || '',
        branch,
        sourceLabel: getSourceLabel(branch),
        formContext: formData.formContext,
        formVariant: formData.formVariant,
        extraFields: formData.extraFields,
        attribution: getAttributionSnapshot(currentAttributionFields),
        leadQuality: formData.leadQuality,
        pageIntent: formData.pageIntent,
        idempotencyKey: formData.idempotencyKey,
        website: formData.website,
        consent: formData.consent
    };

    try {
        const resp = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if (resp.ok) return resp;
        throw new Error('Proxy returned non-OK status');
    } catch (error) {
        console.error('Telegram proxy unavailable:', error.message);
        throw error;
    }
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

function setFormStatus(form, kind, message) {
    let status = form.querySelector('[data-form-status]');
    if (!status) {
        status = document.createElement('p');
        status.dataset.formStatus = '1';
        status.className = 'mt-3 text-sm';
        status.setAttribute('aria-live', 'polite');
        form.append(status);
    }
    status.className = `mt-3 text-sm ${kind === 'success' ? 'text-green-700' : 'text-red-700'}`;
    status.textContent = message;
}

function setFormFallback(form) {
    setFormStatus(
        form,
        'error',
        `Не удалось отправить форму. Позвоните инженеру: ${FALLBACK_PHONE} или отправьте фото в WhatsApp: ${FALLBACK_WHATSAPP}`
    );
}

function enhanceTelegramForm(form) {
    if (form.dataset.telegramEnhanced === '1') return;
    form.dataset.telegramEnhanced = '1';
    form.dataset.startedAt = String(Date.now());
    form.dataset.idempotencyKey = form.dataset.idempotencyKey || makeIdempotencyKey();
    form.noValidate = true;
    form.classList.add('telegram-form-enhanced');
    ensureAttributionFields(form);

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

            fillAttributionFields(form);
            const honeypotValue = form.querySelector('[name="website"]')?.value.trim() || '';
            const consentChecked = Boolean(form.querySelector('[name="consent"]')?.checked);
            const extraFields = collectExtraFields(form);
            const formData = {
                name: form.querySelector('[name="name"]')?.value.trim() || '',
                phone: normalizePhone(form.querySelector('[name="phone"]')?.value || ''),
                type: form.querySelector('[name="type"]')?.value.trim() || '',
                problem: buildProblemValue(form, extraFields),
                formContext: form.dataset.formContext?.trim() || '',
                formVariant: getFormVariant(form),
                extraFields,
                attribution: getAttributionSnapshot(currentAttributionFields),
                leadQuality: form.dataset.leadQuality?.trim() || 'human_candidate',
                pageIntent: document.body?.dataset?.pageIntent || '',
                pageVersion: document.body?.dataset?.pageVersion || '',
                website: honeypotValue,
                consent: consentChecked,
                idempotencyKey: form.dataset.idempotencyKey || makeIdempotencyKey()
            };

            const startedAt = Number(form.dataset.startedAt || Date.now());
            const fillMs = Date.now() - startedAt;
            const rateLimitKey = `mospochin_form_last_${window.location.pathname}`;
            const lastSubmitAt = Number(safeGetLocalStorage(rateLimitKey) || 0);

            if (honeypotValue) {
                trackSiteEventBridge('form_submit_blocked', form, { reason: 'honeypot' });
                resetSubmitButton(btn, origText, hadBrandOrange, hadGreen600);
                setFormStatus(form, 'error', 'Не удалось отправить форму.');
                return;
            }

            if (fillMs < FORM_MIN_FILL_MS) {
                trackSiteEventBridge('form_submit_blocked', form, { reason: 'too_fast', fill_ms: fillMs });
                resetSubmitButton(btn, origText, hadBrandOrange, hadGreen600);
                setTempButtonState(
                    btn,
                    '<i class="ri-time-line mr-2"></i>Заполните чуть медленнее',
                    ['bg-brand-orange', 'bg-green-600'],
                    ['bg-red-500']
                );
                setFormStatus(form, 'error', 'Пожалуйста, заполните форму чуть медленнее.');
                return;
            }

            if (!consentChecked) {
                trackSiteEventBridge('form_validation_error', form, { reason: 'missing_consent', field_name: 'consent' });
                resetSubmitButton(btn, origText, hadBrandOrange, hadGreen600);
                setTempButtonState(
                    btn,
                    '<i class="ri-shield-check-line mr-2"></i>Подтвердите согласие',
                    ['bg-brand-orange', 'bg-green-600'],
                    ['bg-red-500']
                );
                setFormStatus(form, 'error', 'Подтвердите согласие на связь по заявке.');
                return;
            }

            if (!isValidPhone(formData.phone)) {
                trackSiteEventBridge('form_validation_error', form, { reason: 'invalid_phone', field_name: 'phone' });
                resetSubmitButton(btn, origText, hadBrandOrange, hadGreen600);
                setTempButtonState(
                    btn,
                    '<i class="ri-error-warning-line mr-2"></i>Введите нормальный номер',
                    ['bg-brand-orange', 'bg-green-600'],
                    ['bg-red-500']
                );
                setFormStatus(form, 'error', 'Введите корректный номер телефона.');
                return;
            }

            if (formData.problem.length > FORM_MAX_PROBLEM_LENGTH) {
                trackSiteEventBridge('form_validation_error', form, { reason: 'problem_too_long', field_name: 'problem' });
                resetSubmitButton(btn, origText, hadBrandOrange, hadGreen600);
                setTempButtonState(
                    btn,
                    '<i class="ri-file-warning-line mr-2"></i>Слишком длинное описание',
                    ['bg-brand-orange', 'bg-green-600'],
                    ['bg-red-500']
                );
                setFormStatus(form, 'error', 'Сократите описание проблемы.');
                return;
            }

            if (lastSubmitAt && Date.now() - lastSubmitAt < FORM_RATE_LIMIT_MS) {
                trackSiteEventBridge('form_submit_blocked', form, { reason: 'rate_limited' });
                resetSubmitButton(btn, origText, hadBrandOrange, hadGreen600);
                setTempButtonState(
                    btn,
                    '<i class="ri-time-line mr-2"></i>Повторите через минуту',
                    ['bg-brand-orange', 'bg-green-600'],
                    ['bg-red-500']
                );
                setFormStatus(form, 'error', 'Повторная отправка будет доступна через минуту.');
                return;
            }

            trackSiteEventBridge('form_submit_attempt', form, {
                form_type: formData.type || '',
                form_variant: formData.formVariant
            });

            try {
                const response = await sendToTelegram(formData);
                if (response.ok) {
                    trackSiteEventBridge('form_submit_success', form, {
                        form_type: formData.type || '',
                        form_variant: formData.formVariant
                    });
                    safeSetLocalStorage(rateLimitKey, String(Date.now()));
                    btn.innerHTML = '<i class="ri-check-line mr-2"></i>Отправлено! ✓';
                    btn.classList.remove('bg-brand-orange', 'bg-green-600');
                    btn.classList.add('bg-green-500');
                    form.reset();
                    form.dataset.startedAt = String(Date.now());
                    form.dataset.idempotencyKey = makeIdempotencyKey();
                    setFormStatus(form, 'success', 'Заявка принята. Инженер свяжется с вами по указанному номеру.');
                    setTimeout(() => {
                        resetSubmitButton(btn, origText, hadBrandOrange, hadGreen600);
                    }, 3000);
                } else {
                    throw new Error('Failed');
                }
            } catch (error) {
                trackSiteEventBridge('form_submit_error', form, {
                    error: error?.code || 'submit_failed',
                    form_variant: formData.formVariant
                });
                btn.innerHTML = '<i class="ri-phone-line mr-2"></i>Позвоните нам!';
                btn.classList.remove('bg-brand-orange', 'bg-green-600');
                btn.classList.add('bg-red-500');
                setFormFallback(form);
                setTimeout(() => {
                    resetSubmitButton(btn, origText, hadBrandOrange, hadGreen600);
                }, 3000);
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    void loadRuntimeConfig();
    void loadCurrentPageMetadata();
    initTelegramForms();
});
})();
