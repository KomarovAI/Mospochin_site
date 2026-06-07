(function () {
// Telegram credentials loaded from server-side proxy
// IMPORTANT: Never expose BOT_TOKEN in client-side code for production
const FORM_MIN_FILL_MS = 1500;
const FORM_RATE_LIMIT_MS = 60000;
const FORM_MAX_PROBLEM_LENGTH = 500;
const TELEGRAM_PAGE_METADATA_PATH = '/data/page-metadata.json';
const ATTRIBUTION_FIELD_NAMES = [
    'page_url',
    'page_path',
    'page_title',
    'referrer',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
    'utm_service',
    'utm_landing',
    'yclid',
    'gclid',
    'metrika_client_id',
    'ym_client_id'
];
const FORM_BASE_FIELDS = new Set(['name', 'phone', 'type', 'problem', 'website', 'consent', ...ATTRIBUTION_FIELD_NAMES]);
const LEAD_DRAFT_STORAGE_KEY = 'mospochin_last_lead_draft_v2';
const PAROKONVEKTOMAT_PAGE_INTENTS = {
    'parokonvektomaty.html': {
        cluster: 'parokonvektomaty',
        intent: 'hub_b2b',
        label: 'Hub / B2B пароконвектоматы',
        defaultBrand: '',
        defaultProblem: 'ремонт пароконвектомата',
        whatsappText: 'Здравствуйте! Нужен ремонт пароконвектомата в Москве. Отправлю бренд, модель, симптом и адрес объекта.',
        fallbackCta: 'Отправить проблему в WhatsApp'
    },
    'parokonvektomaty-promo.html': {
        cluster: 'parokonvektomaty',
        intent: 'urgent_direct',
        label: 'Срочный Direct / ошибка пароконвектомата',
        defaultBrand: '',
        defaultProblem: 'срочная ошибка / простой кухни',
        whatsappText: 'Здравствуйте! У пароконвектомата ошибка, кухня стоит. Хочу согласовать срочный выезд. Отправлю фото дисплея, шильдика и адрес объекта.',
        fallbackCta: 'Срочно написать в WhatsApp'
    },
    'parokonvektomat-unox-af02-af08.html': {
        cluster: 'parokonvektomaty',
        intent: 'error_brand',
        label: 'Unox AF02/AF08',
        defaultBrand: 'Unox',
        defaultProblem: 'ошибка AF02/AF08',
        whatsappText: 'Здравствуйте! У пароконвектомата Unox ошибка AF02/AF08. Отправлю фото дисплея, шильдика, модель и адрес объекта.',
        fallbackCta: 'Отправить AF02/AF08 в WhatsApp'
    },
    'parokonvektomat-rational-e9.html': {
        cluster: 'parokonvektomaty',
        intent: 'error_brand',
        label: 'Rational E9',
        defaultBrand: 'Rational',
        defaultProblem: 'ошибка E9',
        whatsappText: 'Здравствуйте! У пароконвектомата Rational ошибка E9. Отправлю фото дисплея, шильдика, модель и адрес объекта.',
        fallbackCta: 'Отправить E9 в WhatsApp'
    },
    'parokonvektomat-e02-e07-e10.html': {
        cluster: 'parokonvektomaty',
        intent: 'error_code',
        label: 'E02/E07/E10',
        defaultBrand: 'Abat / Fagor',
        defaultProblem: 'ошибка E02/E07/E10',
        whatsappText: 'Здравствуйте! У пароконвектомата ошибка E02/E07/E10. Отправлю фото дисплея, шильдика, модель и адрес объекта.',
        fallbackCta: 'Отправить код ошибки в WhatsApp'
    },
    'parokonvektomat-kod-oshibki.html': {
        cluster: 'parokonvektomaty',
        intent: 'error_hub',
        label: 'Хаб кодов ошибок',
        defaultBrand: '',
        defaultProblem: 'код ошибки пароконвектомата',
        whatsappText: 'Здравствуйте! Нужно разобрать код ошибки пароконвектомата. Отправлю фото дисплея, шильдика, модель и адрес объекта.',
        fallbackCta: 'Отправить код ошибки в WhatsApp'
    },
    'parokonvektomat-rational.html': {
        cluster: 'parokonvektomaty',
        intent: 'brand',
        label: 'Rational brand',
        defaultBrand: 'Rational',
        defaultProblem: 'ремонт Rational',
        whatsappText: 'Здравствуйте! Нужен ремонт пароконвектомата Rational. Отправлю фото дисплея, шильдика, модель и адрес объекта.',
        fallbackCta: 'Написать мастеру по Rational'
    },
    'parokonvektomat-unox.html': {
        cluster: 'parokonvektomaty',
        intent: 'brand',
        label: 'Unox brand',
        defaultBrand: 'Unox',
        defaultProblem: 'ремонт Unox',
        whatsappText: 'Здравствуйте! Нужен ремонт пароконвектомата Unox. Отправлю фото дисплея, шильдика, модель и адрес объекта.',
        fallbackCta: 'Написать мастеру по Unox'
    },
    'parokonvektomat-ne-greet.html': {
        cluster: 'parokonvektomaty',
        intent: 'symptom',
        label: 'Не греет',
        defaultBrand: '',
        defaultProblem: 'не греет / не набирает температуру',
        whatsappText: 'Здравствуйте! Пароконвектомат не греет или не набирает температуру. Отправлю модель, фото шильдика и адрес объекта.',
        fallbackCta: 'Отправить симптом в WhatsApp'
    },
    'parokonvektomat-net-para.html': {
        cluster: 'parokonvektomaty',
        intent: 'symptom',
        label: 'Нет пара',
        defaultBrand: '',
        defaultProblem: 'нет пара / не держит влажность',
        whatsappText: 'Здравствуйте! В пароконвектомате нет пара или не держится влажность. Отправлю модель, фото шильдика и адрес объекта.',
        fallbackCta: 'Отправить симптом в WhatsApp'
    },
    'remont-oborudovaniya-restorana-parokonvektomat.html': {
        cluster: 'parokonvektomaty',
        intent: 'b2b_restaurant_direct',
        label: 'B2B кухня ресторана',
        defaultBrand: '',
        defaultProblem: 'ремонт оборудования кухни ресторана / пароконвектомат',
        whatsappText: 'Здравствуйте! Нужен ремонт оборудования кухни ресторана, пароконвектомат. Отправлю модель, проблему, адрес и реквизиты для договора.',
        fallbackCta: 'Отправить заявку по кухне ресторана'
    }
};
const PAROKONVEKTOMAT_BRAND_PAGES = {
    'parokonvektomat-abat.html': 'Abat',
    'parokonvektomat-convotherm.html': 'Convotherm',
    'parokonvektomat-electrolux.html': 'Electrolux Professional',
    'parokonvektomat-lainox.html': 'Lainox'
};

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

function cleanAttributionValue(value, maxLength = 500) {
    return String(value || '').replace(/\s+/g, ' ').trim().slice(0, maxLength);
}

function getPageIntent(pageFile = getCurrentPageFile()) {
    if (PAROKONVEKTOMAT_PAGE_INTENTS[pageFile]) return PAROKONVEKTOMAT_PAGE_INTENTS[pageFile];
    if (PAROKONVEKTOMAT_BRAND_PAGES[pageFile]) {
        const brand = PAROKONVEKTOMAT_BRAND_PAGES[pageFile];
        return {
            cluster: 'parokonvektomaty',
            intent: 'brand',
            label: `${brand} brand`,
            defaultBrand: brand,
            defaultProblem: `ремонт ${brand}`,
            whatsappText: `Здравствуйте! Нужен ремонт пароконвектомата ${brand}. Отправлю фото дисплея, шильдика, модель и адрес объекта.`,
            fallbackCta: `Написать мастеру по ${brand}`
        };
    }

    return {
        cluster: '',
        intent: normalizeBranch(document.body?.classList?.contains('branch-household') ? 'household' : 'restaurant'),
        label: 'Общая заявка',
        defaultBrand: '',
        defaultProblem: '',
        whatsappText: 'Здравствуйте! Нужен ремонт. Отправлю проблему, адрес и фото техники. Сайт MosPochin',
        fallbackCta: 'Написать в WhatsApp'
    };
}

function buildWhatsappHref(message) {
    const text = String(message || '').trim() || getPageIntent().whatsappText;
    return `https://wa.me/79990057172?text=${encodeURIComponent(text)}`;
}

function appendPageContextToMessage(message, formData = null) {
    const parts = [String(message || getPageIntent().whatsappText).trim()];
    if (formData?.phone) parts.push(`Телефон: ${formData.phone}`);
    if (formData?.type) parts.push(`Техника/бренд: ${formData.type}`);
    if (formData?.problem) parts.push(`Проблема: ${formData.problem}`);
    parts.push(`Страница: ${window.location.href}`);
    return parts.filter(Boolean).join('\n');
}

function getDeviceSnapshot() {
    const width = Number(window.innerWidth || document.documentElement.clientWidth || 0);
    const height = Number(window.innerHeight || document.documentElement.clientHeight || 0);
    return {
        viewport: width && height ? `${width}x${height}` : '',
        device_type: width && width < 768 ? 'mobile' : 'desktop',
        user_agent: String(navigator.userAgent || '').slice(0, 240)
    };
}

function getQueryParam(name) {
    try {
        return new URLSearchParams(window.location.search).get(name) || '';
    } catch {
        return '';
    }
}

function getCurrentAttributionFields() {
    const storedTouch = window.mospochinGetAttribution?.()?.last_touch || window.mospochinGetAttribution?.()?.first_touch || {};
    const fields = {
        page_url: window.location.href,
        page_path: window.location.pathname,
        page_title: document.title,
        referrer: document.referrer || ''
    };

    for (const name of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_service', 'utm_landing', 'yclid', 'gclid']) {
        fields[name] = getQueryParam(name) || storedTouch[name] || '';
    }

    fields.metrika_client_id = storedTouch.metrika_client_id || storedTouch.ym_client_id || '';
    fields.ym_client_id = storedTouch.ym_client_id || storedTouch.metrika_client_id || '';

    return Object.fromEntries(
        ATTRIBUTION_FIELD_NAMES.map(name => [name, cleanAttributionValue(fields[name], name === 'page_url' || name === 'referrer' ? 800 : 240)])
    );
}

function ensureAttributionFields(form) {
    for (const name of ATTRIBUTION_FIELD_NAMES) {
        if (form.querySelector(`[name="${name}"]`)) continue;
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.dataset.autoAttribution = '1';
        form.append(input);
    }
}

function fillAttributionFields(form) {
    const fields = getCurrentAttributionFields();
    for (const [name, value] of Object.entries(fields)) {
        const field = form.querySelector(`[name="${name}"]`);
        if (field) field.value = value;
    }
    return fields;
}

function trackFormGoal(goalName, form, extra = {}) {
    window.mospochinTrackGoal?.(goalName, {
        form_context: form.dataset.formContext?.trim() || '',
        page: window.location.pathname,
        ...extra
    });
}

function getAttributionSnapshot(currentFields = null) {
    const attribution = window.mospochinGetAttribution?.();
    const snapshot = attribution && typeof attribution === 'object' ? JSON.parse(JSON.stringify(attribution)) : {};
    const touch = currentFields || getCurrentAttributionFields();

    if (!snapshot.first_touch) snapshot.first_touch = touch;
    snapshot.last_touch = {
        ...(snapshot.last_touch || snapshot.first_touch || {}),
        ...touch
    };

    return snapshot;
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


function getPreferredFieldValue(form, name) {
    const fields = Array.from(form.querySelectorAll(`[name="${name}"]`));
    const visibleWithValue = fields.find(field => field.type !== 'hidden' && String(field.value || '').trim());
    const anyWithValue = fields.find(field => String(field.value || '').trim());
    return String((visibleWithValue || anyWithValue)?.value || '').trim();
}

function buildProblemValue(form, extraFields) {
    const explicitProblem = getPreferredFieldValue(form, 'problem');
    const diagnosticParts = [];
    if (extraFields.problem_type) diagnosticParts.push(extraFields.problem_type);
    if (extraFields.error_code) diagnosticParts.push(`код ${extraFields.error_code}`);
    if (extraFields.equipment_brand) diagnosticParts.push(`бренд ${extraFields.equipment_brand}`);

    const detailProblem = cleanAttributionValue(extraFields.problem_detail || '', 200);
    if (explicitProblem && detailProblem && explicitProblem !== detailProblem) return `${explicitProblem}: ${detailProblem}`;
    if (explicitProblem && diagnosticParts.length) return `${explicitProblem} (${diagnosticParts.join('; ')})`;
    if (explicitProblem) return explicitProblem;
    if (diagnosticParts.length) return diagnosticParts.join('; ');

    const labels = {
        quantity: 'количество',
        address: 'адрес/район',
        business_type: 'формат кухни',
        equipment_model: 'модель оборудования',
        equipment_brand: 'бренд',
        problem_type: 'тип проблемы',
        error_code: 'код ошибки',
        problem_detail: 'симптом/код'
    };

    const details = Object.entries(labels)
        .filter(([name]) => extraFields[name])
        .map(([name, label]) => `${label}: ${extraFields[name]}`);

    if (details.length === 0) return '';
    return `Заявка на техническое обслуживание (${details.join('; ')})`;
}

function calculateLeadQuality(formData) {
    const pageIntent = formData.pageIntent || getPageIntent();
    const text = [formData.problem, formData.type, JSON.stringify(formData.extraFields || {})].join(' ').toLowerCase();
    const reasons = [];
    let score = 0;

    if (pageIntent.cluster === 'parokonvektomaty') {
        score += 2;
        reasons.push('parokonvektomaty_cluster');
    }
    if (/urgent|direct|error|b2b/.test(pageIntent.intent || '')) {
        score += 2;
        reasons.push(`intent_${pageIntent.intent}`);
    }
    if (/(rational|unox|abat|convotherm|electrolux|lainox|фагор|fagor|пароконвектомат)/i.test(text)) {
        score += 2;
        reasons.push('brand_or_equipment');
    }
    if (/(e\d{1,3}|af\d{2}|ошибк|код|не греет|нет пара|теч|не включ|выбивает)/i.test(text)) {
        score += 2;
        reasons.push('problem_or_error');
    }
    if (/(ресторан|кафе|столов|пищеблок|кухн|адрес|юрлиц|безнал|объект)/i.test(text)) {
        score += 1;
        reasons.push('b2b_words');
    }
    if (formData.phone) {
        score += 1;
        reasons.push('phone_present');
    }

    const level = score >= 7 ? 'HIGH' : score >= 4 ? 'MEDIUM' : 'LOW';
    return { level, score, reasons };
}

function saveLeadDraft(formData) {
    const draft = {
        saved_at: new Date().toISOString(),
        page: getCurrentPageFile(),
        page_url: window.location.href,
        phone: formData.phone || '',
        type: formData.type || '',
        problem: formData.problem || '',
        formContext: formData.formContext || '',
        pageIntent: formData.pageIntent || getPageIntent(),
        leadQuality: formData.leadQuality || null,
        extraFields: formData.extraFields || {},
        attribution: formData.attribution || null
    };
    safeSetLocalStorage(LEAD_DRAFT_STORAGE_KEY, JSON.stringify(draft));
    return draft;
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
        branch,
        sourceLabel: getSourceLabel(branch),
        formContext: formData.formContext,
        pageIntent: formData.pageIntent,
        leadQuality: formData.leadQuality,
        timeToSubmitMs: formData.timeToSubmitMs,
        device: formData.device,
        extraFields: formData.extraFields,
        attribution: formData.attribution,
        website: formData.website,
        consent: true
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

function findInsertBeforeNode(form) {
    const problemField = form.querySelector('[name="problem"]:not([type="hidden"]), textarea[name="problem"]');
    const typeField = form.querySelector('[name="type"]:not([type="hidden"]), textarea[name="type"]');
    const target = problemField || typeField || form.querySelector('button[type="submit"]');
    return target?.closest('label, .space-y-2, div') || target || null;
}

function maybeAddDiagnosticFields(form) {
    const pageIntent = getPageIntent();
    if (pageIntent.cluster !== 'parokonvektomaty') return;
    if (form.querySelector('[data-lead-diagnostic="1"]')) return;
    const submitButton = form.querySelector('button[type="submit"]');
    if (!submitButton) return;

    const wrapper = document.createElement('div');
    wrapper.dataset.leadDiagnostic = '1';
    wrapper.className = 'lead-diagnostic rounded-2xl border border-orange-100 bg-orange-50/80 p-4 mb-4 space-y-3';
    wrapper.innerHTML = `
        <div class="flex items-start gap-2">
            <i class="ri-stethoscope-line text-brand-orange text-xl mt-0.5"></i>
            <div>
                <p class="font-bold text-slate-900">Быстрая диагностика для мастера</p>
                <p class="text-xs text-slate-600">Можно выбрать за 10 секунд — эти данные уйдут в Telegram и WhatsApp-fallback.</p>
            </div>
        </div>
        <div class="grid gap-3 sm:grid-cols-3">
            <label class="text-xs font-semibold text-slate-600 uppercase tracking-wide">Бренд
                <select name="equipment_brand" class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm normal-case tracking-normal focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20">
                    <option value="">Не выбран</option>
                    <option>Rational</option>
                    <option>Unox</option>
                    <option>Abat</option>
                    <option>Convotherm</option>
                    <option>Electrolux Professional</option>
                    <option>Lainox</option>
                    <option>Fagor</option>
                    <option>Другой бренд</option>
                </select>
            </label>
            <label class="text-xs font-semibold text-slate-600 uppercase tracking-wide">Симптом
                <select name="problem_type" class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm normal-case tracking-normal focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20">
                    <option value="">Не выбран</option>
                    <option>Ошибка на дисплее</option>
                    <option>Не греет</option>
                    <option>Нет пара</option>
                    <option>Течёт</option>
                    <option>Не включается</option>
                    <option>Выбивает автомат</option>
                    <option>Нужно ТО</option>
                </select>
            </label>
            <label class="text-xs font-semibold text-slate-600 uppercase tracking-wide">Код ошибки
                <input name="error_code" type="text" inputmode="text" placeholder="E9 / AF02 / E07" class="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm normal-case tracking-normal focus:border-brand-orange focus:ring-2 focus:ring-brand-orange/20">
            </label>
        </div>
    `;

    const brandSelect = wrapper.querySelector('[name="equipment_brand"]');
    const problemSelect = wrapper.querySelector('[name="problem_type"]');
    const codeInput = wrapper.querySelector('[name="error_code"]');
    if (brandSelect && pageIntent.defaultBrand) brandSelect.value = pageIntent.defaultBrand;
    if (problemSelect && pageIntent.defaultProblem) {
        const normalizedDefault = pageIntent.defaultProblem.toLowerCase();
        for (const option of problemSelect.options) {
            if (normalizedDefault.includes(option.value.toLowerCase()) || option.value.toLowerCase().includes(normalizedDefault)) {
                problemSelect.value = option.value;
                break;
            }
        }
    }
    if (codeInput && /(?:e\d|af\d)/i.test(pageIntent.defaultProblem)) {
        codeInput.value = pageIntent.defaultProblem.replace(/^.*?(e\d{1,3}|af\d{2}).*$/i, '$1').toUpperCase();
    }

    const insertBefore = findInsertBeforeNode(form);
    if (insertBefore && insertBefore.parentNode === form) {
        form.insertBefore(wrapper, insertBefore);
    } else {
        submitButton.insertAdjacentElement('beforebegin', wrapper);
    }
}

function getFormFeedbackContainer(form) {
    let container = form.querySelector('[data-form-runtime-feedback="1"]');
    if (container) return container;
    container = document.createElement('div');
    container.dataset.formRuntimeFeedback = '1';
    container.className = 'form-runtime-feedback mt-4';
    form.append(container);
    return container;
}

function renderFormFeedback(form, html) {
    const container = getFormFeedbackContainer(form);
    container.innerHTML = html;
    return container;
}

function renderErrorFallback(form, formData) {
    const pageIntent = formData.pageIntent || getPageIntent();
    const message = appendPageContextToMessage(pageIntent.whatsappText, formData);
    const whatsappHref = buildWhatsappHref(message);
    const html = `
        <div class="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-slate-700">
            <p class="font-bold text-red-700 mb-1">Заявка не ушла через форму.</p>
            <p class="mb-3">Чтобы не потерять срочный запрос, отправьте уже собранный текст в WhatsApp или позвоните мастеру.</p>
            <div class="flex flex-col sm:flex-row gap-2">
                <a href="${whatsappHref}" data-form-fallback-whatsapp="1" data-contact-link="whatsapp" target="_blank" rel="noopener" class="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 font-bold text-white hover:bg-green-700">
                    <i class="ri-whatsapp-line"></i>${pageIntent.fallbackCta || 'Отправить в WhatsApp'}
                </a>
                <a href="tel:+79990057172" data-contact-link="phone" class="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 font-bold text-white hover:bg-slate-800">
                    <i class="ri-phone-line"></i>Позвонить
                </a>
            </div>
        </div>
    `;
    const container = renderFormFeedback(form, html);
    container.querySelector('[data-form-fallback-whatsapp]')?.addEventListener('click', () => {
        trackFormGoal('form_error_whatsapp_fallback_click', form, {
            lead_quality: formData.leadQuality?.level || '',
            intent: pageIntent.intent || ''
        });
    }, { once: true });
}

function renderSuccessNextStep(form, formData) {
    const pageIntent = formData.pageIntent || getPageIntent();
    const message = appendPageContextToMessage(`${pageIntent.whatsappText}

Заявку уже отправил(а) через сайт. Сейчас отправлю фото ошибки/шильдика для ускорения диагностики.`, formData);
    const html = `
        <div class="rounded-2xl border border-green-100 bg-green-50 p-4 text-sm text-slate-700">
            <p class="font-bold text-green-700 mb-1">Заявка отправлена.</p>
            <p class="mb-3">Чтобы мастер быстрее понял причину, можно сразу отправить фото ошибки, шильдика или панели управления.</p>
            <a href="${buildWhatsappHref(message)}" data-post-submit-whatsapp="1" data-contact-link="whatsapp" target="_blank" rel="noopener" class="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 font-bold text-white hover:bg-green-700">
                <i class="ri-whatsapp-line"></i>Отправить фото в WhatsApp
            </a>
        </div>
    `;
    const container = renderFormFeedback(form, html);
    container.querySelector('[data-post-submit-whatsapp]')?.addEventListener('click', () => {
        trackFormGoal('form_success_whatsapp_photo_click', form, {
            lead_quality: formData.leadQuality?.level || '',
            intent: pageIntent.intent || ''
        });
    }, { once: true });
}

function enhanceTelegramForm(form) {
    if (form.dataset.telegramEnhanced === '1') return;
    form.dataset.telegramEnhanced = '1';
    form.dataset.startedAt = String(Date.now());
    form.classList.add('telegram-form-enhanced');
    ensureAttributionFields(form);
    fillAttributionFields(form);
    maybeAddDiagnosticFields(form);

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

            const currentAttributionFields = fillAttributionFields(form);
            const honeypotValue = form.querySelector('[name="website"]')?.value.trim() || '';
            const consentChecked = Boolean(form.querySelector('[name="consent"]')?.checked);
            const extraFields = collectExtraFields(form);
            const startedAt = Number(form.dataset.startedAt || Date.now());
            const fillMs = Date.now() - startedAt;
            const pageIntent = getPageIntent();
            const formData = {
                name: form.querySelector('[name="name"]')?.value.trim() || '',
                phone: normalizePhone(form.querySelector('[name="phone"]')?.value || ''),
                type: getPreferredFieldValue(form, 'type') || pageIntent.defaultBrand || '',
                problem: buildProblemValue(form, extraFields) || pageIntent.defaultProblem || '',
                formContext: form.dataset.formContext?.trim() || '',
                pageIntent,
                timeToSubmitMs: fillMs,
                device: getDeviceSnapshot(),
                extraFields,
                attribution: getAttributionSnapshot(currentAttributionFields),
                website: honeypotValue
            };
            formData.leadQuality = calculateLeadQuality(formData);
            saveLeadDraft(formData);

            const rateLimitKey = `mospochin_form_last_${window.location.pathname}`;
            const lastSubmitAt = Number(safeGetLocalStorage(rateLimitKey) || 0);

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
                    trackFormGoal('form_submit_success', form, {
                        form_type: formData.type || '',
                        lead_quality: formData.leadQuality?.level || '',
                        intent: formData.pageIntent?.intent || ''
                    });
                    safeSetLocalStorage(rateLimitKey, String(Date.now()));
                    saveLeadDraft({ ...formData, delivered: true });
                    btn.innerHTML = '<i class="ri-check-line mr-2"></i>Отправлено! ✓';
                    btn.classList.remove('bg-brand-orange', 'bg-green-600');
                    btn.classList.add('bg-green-500');
                    renderSuccessNextStep(form, formData);
                    form.reset();
                    form.dataset.startedAt = String(Date.now());
                    setTimeout(() => {
                        resetSubmitButton(btn, origText, hadBrandOrange, hadGreen600);
                    }, 3000);
                } else {
                    throw new Error('Failed');
                }
            } catch (error) {
                trackFormGoal('form_submit_error', form, {
                    error: 'submit_failed',
                    lead_quality: formData.leadQuality?.level || '',
                    intent: formData.pageIntent?.intent || ''
                });
                saveLeadDraft({ ...formData, delivery_error: String(error?.message || 'submit_failed').slice(0, 120) });
                renderErrorFallback(form, formData);
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
    void loadRuntimeConfig();
    void loadCurrentPageMetadata();
    setTimeout(initTelegramForms, 200);
});
})();
