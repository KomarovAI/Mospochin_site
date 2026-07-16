(function () {
  'use strict';

  var FORM_RELEASE = 'telegram-form-v3-20260716';
  var LEAD_SCHEMA_VERSION = 'mospochin.lead.v3';
  var TRACKING_VERSION = '2026-07-15';
  var LEAD_TIMEOUT_MS = 15000;
  var FORM_MIN_FILL_MS = 1500;
  var FORM_RATE_LIMIT_MS = 60000;
  var MAX_PROBLEM_LENGTH = 4000;
  var TELEGRAM_PAGE_METADATA_PATH = '/data/page-metadata.json';
  var FALLBACK_PHONE = '+79990057172';
  var FALLBACK_WHATSAPP = 'https://wa.me/79990057172';
  var BASE_FIELD_NAMES = new Set(['name', 'phone', 'type', 'problem', 'website', 'consent']);

  var runtimeConfigPromise = null;
  var pageMetadataPromise = null;

  window.MOSPOCHIN_FORM_RELEASE = FORM_RELEASE;

  function cleanString(value, maxLength) {
    if (typeof value !== 'string' && typeof value !== 'number') return null;
    var cleaned = String(value).trim().replace(/\s+/g, ' ');
    if (!cleaned || cleaned === 'undefined' || cleaned === 'null') return null;
    return cleaned.slice(0, maxLength || 2048);
  }

  function safeUuid() {
    if (typeof window.mospochinSafeUuid === 'function') return window.mospochinSafeUuid();
    if (window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
    if (window.crypto && typeof window.crypto.getRandomValues === 'function') {
      var bytes = new Uint8Array(16);
      window.crypto.getRandomValues(bytes);
      bytes[6] = (bytes[6] & 15) | 64;
      bytes[8] = (bytes[8] & 63) | 128;
      var hex = Array.prototype.map.call(bytes, function (byte) { return byte.toString(16).padStart(2, '0'); }).join('');
      return [hex.slice(0, 8), hex.slice(8, 12), hex.slice(12, 16), hex.slice(16, 20), hex.slice(20)].join('-');
    }
    return 'fallback-' + Date.now().toString(36) + '-' + Math.floor((performance.now ? performance.now() : 0) * 1000).toString(36) + '-' + Math.random().toString(36).slice(2, 12);
  }

  function getCurrentPageFile() {
    var runtimePageFile = cleanString(window.__MOSPOCHIN_RUNTIME__ && window.__MOSPOCHIN_RUNTIME__.pageFile, 128);
    return runtimePageFile || window.location.pathname.split('/').pop() || 'index.html';
  }

  function loadSharedJson(path) {
    if (!(window.__MOSPOCHIN_JSON_PROMISES__ instanceof Map)) {
      window.__MOSPOCHIN_JSON_PROMISES__ = new Map();
    }
    var registry = window.__MOSPOCHIN_JSON_PROMISES__;
    if (!registry.has(path)) {
      var request = fetch(path, { cache: 'default', credentials: 'same-origin' })
        .then(function (response) {
          if (!response.ok) throw new Error('json_http_' + response.status + ':' + path);
          return response.json();
        })
        .catch(function (error) {
          registry.delete(path);
          throw error;
        });
      registry.set(path, request);
    }
    return registry.get(path);
  }

  function getRuntimeConfigSource() {
    return {
      telegramFormEndpoint: cleanString(
        (window.__MOSPOCHIN_RUNTIME__ && window.__MOSPOCHIN_RUNTIME__.telegramFormEndpoint) ||
        (document.querySelector('meta[name="mospochin:telegram-endpoint"]') || {}).content,
        256
      )
    };
  }

  function loadRuntimeConfig() {
    if (!runtimeConfigPromise) {
      runtimeConfigPromise = (async function () {
        var source = getRuntimeConfigSource();
        if (source.telegramFormEndpoint) return source;
        try {
          var response = await fetch('/data/runtime-config.json', { cache: 'no-store' });
          if (!response.ok) throw new Error('runtime_config_http_' + response.status);
          var json = await response.json();
          return { telegramFormEndpoint: cleanString(json.telegramFormEndpoint, 256) };
        } catch (error) {
          console.error('[MosPochin form] runtime config unavailable:', error.message);
          return source;
        }
      })();
    }
    return runtimeConfigPromise;
  }

  function loadCurrentPageMetadata() {
    if (!pageMetadataPromise) {
      pageMetadataPromise = (async function () {
        try {
          var json = await loadSharedJson(TELEGRAM_PAGE_METADATA_PATH);
          return json.pages && json.pages[getCurrentPageFile()] ? json.pages[getCurrentPageFile()] : null;
        } catch (error) {
          console.error('[MosPochin form] page metadata unavailable:', error.message);
          return null;
        }
      })();
    }
    return pageMetadataPromise;
  }


  function safeStorageGet(key) {
    try { return window.localStorage.getItem(key); } catch (error) { return null; }
  }

  function safeStorageSet(key, value) {
    try { window.localStorage.setItem(key, String(value)); return true; } catch (error) { return false; }
  }

  function rateLimitKey(form) {
    return 'mospochin_form_last_success_v3:' + getFormId(form);
  }

  function normalizePhone(value) {
    return String(value || '').replace(/[^\d+]/g, '').trim().slice(0, 64);
  }

  function isValidPhone(value) {
    var digits = String(value || '').replace(/\D/g, '');
    return digits.length >= 10 && digits.length <= 11;
  }

  function normalizeBranch(branch) {
    return branch === 'household' ? 'household' : branch === 'restaurant' ? 'restaurant' : 'neutral';
  }

  function sourceLabel(branch) {
    if (branch === 'household') return 'B2C (Бытовая)';
    if (branch === 'restaurant') return 'B2B (Рестораны)';
    return 'Общий сайт';
  }

  function getFormId(form) {
    return cleanString(form.dataset.formId || form.dataset.formContext, 256) || 'generic_form';
  }

  function getFormVariant(form) {
    return cleanString(form.dataset.formVariant || form.dataset.formContext || (document.body && document.body.dataset.pageIntent), 256) || 'generic';
  }

  function getIdempotencyKey(form) {
    if (!cleanString(form.dataset.idempotencyKey, 160)) form.dataset.idempotencyKey = safeUuid();
    return form.dataset.idempotencyKey;
  }

  function createTimeoutSignal(timeoutMs) {
    if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') return AbortSignal.timeout(timeoutMs);
    var controller = new AbortController();
    window.setTimeout(function () { controller.abort(); }, timeoutMs);
    return controller.signal;
  }

  function collectExtraFields(form) {
    var formData = new FormData(form);
    var extra = {};
    formData.forEach(function (rawValue, name) {
      if (BASE_FIELD_NAMES.has(name)) return;
      var value = cleanString(rawValue, 200);
      if (value) extra[cleanString(name, 40)] = value;
    });
    return extra;
  }

  function buildProblem(form, extraFields) {
    var explicit = cleanString((form.querySelector('[name="problem"]') || {}).value, MAX_PROBLEM_LENGTH);
    if (explicit) return explicit;
    var details = Object.keys(extraFields).slice(0, 6).map(function (key) { return key + ': ' + extraFields[key]; });
    return details.length ? 'Дополнительные данные: ' + details.join('; ') : null;
  }

  function stablePayloadFingerprint(payload) {
    var source = [
      payload.phone || '', payload.name || '', payload.type || '', payload.problem || '',
      payload.page_path || '', payload.form_id || '', JSON.stringify(payload.extra_fields || {})
    ].join('|');
    var hash = 2166136261;
    for (var index = 0; index < source.length; index += 1) {
      hash ^= source.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0).toString(16);
  }

  function formEventContext(form, extra) {
    return Object.assign({
      form_id: getFormId(form),
      form_context: cleanString(form.dataset.formContext, 256),
      form_variant: getFormVariant(form),
      block: cleanString(form.dataset.block, 128)
    }, extra || {});
  }

  function track(eventName, form, extra) {
    if (typeof window.mospochinTrackSiteEvent !== 'function') return null;
    return window.mospochinTrackSiteEvent(eventName, formEventContext(form, extra || {}));
  }

  function ensureStatusNode(form) {
    var node = form.querySelector('[data-form-status]');
    if (!node) {
      node = document.createElement('p');
      node.dataset.formStatus = '';
      node.setAttribute('aria-live', 'polite');
      node.className = 'mt-3 text-sm';
      form.appendChild(node);
    }
    return node;
  }

  function setFormStatus(form, status, message) {
    var node = ensureStatusNode(form);
    node.textContent = message || '';
    node.dataset.status = status || '';
    node.classList.remove('text-red-600', 'text-green-700', 'text-slate-600');
    node.classList.add(status === 'success' ? 'text-green-700' : status === 'error' ? 'text-red-600' : 'text-slate-600');
  }

  function clearFieldErrors(form) {
    form.querySelectorAll('[aria-invalid="true"]').forEach(function (field) { field.removeAttribute('aria-invalid'); });
    form.querySelectorAll('[data-field-error]').forEach(function (node) { node.textContent = ''; });
  }

  function markFieldError(form, fieldName, message) {
    var field = form.querySelector('[name="' + fieldName + '"]');
    if (field) {
      field.setAttribute('aria-invalid', 'true');
      field.focus({ preventScroll: false });
    }
    var errorNode = form.querySelector('[data-field-error="' + fieldName + '"]');
    if (errorNode) errorNode.textContent = message;
    setFormStatus(form, 'error', message);
  }

  function ensureConsent(form) {
    var existing = form.querySelector('[name="consent"]');
    if (existing) {
      if (existing.type === 'hidden') {
        existing.remove();
      } else {
        existing.required = true;
        return;
      }
    }
    var submit = form.querySelector('[type="submit"]');
    if (!submit) return;
    var label = document.createElement('label');
    label.className = 'telegram-consent flex items-start gap-3 text-sm text-slate-600 mb-4';
    label.innerHTML = '<input type="checkbox" name="consent" required class="mt-0.5 h-6 w-6 shrink-0 rounded border-slate-300 text-brand-orange focus:ring-brand-orange" style="width:1.5rem;height:1.5rem;min-width:1.5rem;min-height:1.5rem;flex:0 0 1.5rem"><span>Согласен(на) на обработку данных для связи по заявке.</span>';
    submit.insertAdjacentElement('beforebegin', label);
  }

  function ensureHoneypot(form) {
    if (form.querySelector('[name="website"]')) return;
    var input = document.createElement('input');
    input.type = 'text';
    input.name = 'website';
    input.tabIndex = -1;
    input.autocomplete = 'off';
    input.setAttribute('aria-hidden', 'true');
    input.className = 'hidden';
    form.prepend(input);
  }

  function enhanceForm(form) {
    form.setAttribute('data-contact-form', '');
    form.setAttribute('data-telegram-enhanced', '1');
    form.setAttribute('novalidate', '');
    form.dataset.formId = getFormId(form);
    form.dataset.formVariant = getFormVariant(form);
    form.dataset.idempotencyKey = getIdempotencyKey(form);
    form.dataset.startedAt = form.dataset.startedAt || String(Date.now());
    ensureConsent(form);
    ensureHoneypot(form);
    ensureStatusNode(form);
    var phone = form.querySelector('[name="phone"]');
    if (phone) {
      phone.required = true;
      phone.autocomplete = 'tel';
      phone.inputMode = 'tel';
    }
  }

  async function buildLeadPayload(form, attemptEvent) {
    var metadata = await loadCurrentPageMetadata();
    var context = typeof window.mospochinGetLeadContext === 'function'
      ? await window.mospochinGetLeadContext()
      : {};
    var extraFields = collectExtraFields(form);
    var phone = normalizePhone((form.querySelector('[name="phone"]') || {}).value || '');
    var name = cleanString((form.querySelector('[name="name"]') || {}).value, 200);
    var type = cleanString((form.querySelector('[name="type"]') || {}).value, 200);
    var problem = buildProblem(form, extraFields);
    var attribution = typeof window.mospochinGetAttribution === 'function' ? window.mospochinGetAttribution() : null;
    var traceId = cleanString(form.dataset.traceId, 128) || safeUuid();
    form.dataset.traceId = traceId;

    return {
      schema_version: LEAD_SCHEMA_VERSION,
      tracking_version: TRACKING_VERSION,
      site_release: window.MOSPOCHIN_RELEASE || 'unknown',
      analytics_release: window.MOSPOCHIN_TRACKING_V3 && window.MOSPOCHIN_TRACKING_V3.analyticsRelease,
      form_release: FORM_RELEASE,

      name: name,
      phone: phone,
      type: type,
      problem: problem,
      consent: Boolean(form.querySelector('[name="consent"]:checked')),
      website: cleanString((form.querySelector('[name="website"]') || {}).value, 80),

      page: getCurrentPageFile(),
      page_url: window.location.href,
      page_path: window.location.pathname,
      page_slug: context.page_slug || cleanString(document.body && document.body.dataset.pageSlug, 256),
      page_intent: context.page_intent || cleanString(document.body && document.body.dataset.pageIntent, 128),
      page_version: context.page_version || cleanString(document.body && document.body.dataset.pageVersion, 128),
      pageVersion: context.page_version || cleanString(document.body && document.body.dataset.pageVersion, 128),
      branch: normalizeBranch(metadata && metadata.branch),
      sourceLabel: sourceLabel(normalizeBranch(metadata && metadata.branch)),

      form_id: getFormId(form),
      form_context: cleanString(form.dataset.formContext, 256),
      form_variant: getFormVariant(form),
      formContext: cleanString(form.dataset.formContext, 256),
      formVariant: getFormVariant(form),
      extra_fields: extraFields,
      extraFields: extraFields,

      visitor_id: context.visitor_id || null,
      session_id: context.session_id || null,
      tab_id: context.tab_id || null,
      metrika_client_id: context.metrika_client_id || null,
      referrer: cleanString(document.referrer, 4096),

      first_touch: attribution && attribution.first_touch ? attribution.first_touch : null,
      last_touch: attribution && attribution.last_touch ? attribution.last_touch : null,
      attribution: attribution,
      landing_path: context.landing_path || null,
      first_touch_yclid: context.first_touch_yclid || null,
      last_touch_yclid: context.last_touch_yclid || null,
      yclid_for_offline: context.yclid_for_offline || null,
      yclid_source: context.yclid_source || null,
      yclid: context.yclid_for_offline || null,
      gclid: context.gclid || null,

      idempotency_key: getIdempotencyKey(form),
      idempotencyKey: getIdempotencyKey(form),
      trace_id: traceId,
      submit_attempt_event_id: attemptEvent && attemptEvent.event_id ? attemptEvent.event_id : null
    };
  }

  async function sendLead(payload) {
    var config = await loadRuntimeConfig();
    if (!config.telegramFormEndpoint) throw Object.assign(new Error('endpoint_not_configured'), { code: 'endpoint_not_configured' });
    var response;
    try {
      response = await fetch(config.telegramFormEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        signal: createTimeoutSignal(LEAD_TIMEOUT_MS),
        body: JSON.stringify(payload)
      });
    } catch (error) {
      if (error && error.name === 'TimeoutError') throw Object.assign(new Error('lead_timeout'), { code: 'lead_timeout' });
      if (error && error.name === 'AbortError') throw Object.assign(new Error('lead_timeout'), { code: 'lead_timeout' });
      throw Object.assign(new Error('network_error'), { code: 'network_error' });
    }

    var result = null;
    try { result = await response.json(); } catch (error) {
      throw Object.assign(new Error('invalid_json'), { code: 'invalid_json', status: response.status });
    }
    if (!response.ok || !result || result.ok !== true) {
      throw Object.assign(new Error((result && result.error) || ('lead_http_' + response.status)), {
        code: (result && result.error) || ('lead_http_' + response.status),
        status: response.status,
        result: result
      });
    }
    return result;
  }

  function setSubmitting(form, submitting) {
    form.dataset.submitting = submitting ? 'true' : 'false';
    var button = form.querySelector('[type="submit"]');
    if (!button) return;
    if (!button.dataset.originalHtml) button.dataset.originalHtml = button.innerHTML;
    button.disabled = submitting;
    if (submitting) {
      button.setAttribute('aria-busy', 'true');
      button.innerHTML = '<i class="ri-loader-4-line mr-2"></i>Отправляю...';
    } else {
      button.removeAttribute('aria-busy');
      button.innerHTML = button.dataset.originalHtml;
    }
  }

  function showSuccess(form, result) {
    setFormStatus(form, 'success', 'Заявка принята и создана. Чтобы инженер быстрее понял задачу, отправьте фото ошибки или шильдика в WhatsApp.');
    var button = form.querySelector('[type="submit"]');
    if (button) button.innerHTML = '<i class="ri-check-line mr-2"></i>Заявка создана';
    var followup = form.querySelector('[data-form-followup]');
    if (!followup) {
      followup = document.createElement('div');
      followup.dataset.formFollowup = '';
      followup.className = 'mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-900';
      followup.innerHTML = '<p class="font-bold">Следующий необязательный шаг</p><p class="mt-1">Пришлите фото ошибки, бренда, модели или шильдика.</p><a class="mt-3 inline-flex font-bold text-green-800 underline" data-cta-id="' + getFormId(form) + '_success_whatsapp_1" data-cta-group="whatsapp" data-block="form_success" href="' + FALLBACK_WHATSAPP + '" target="_blank" rel="noopener noreferrer">Отправить фото в WhatsApp</a>';
      form.appendChild(followup);
    }
    if (result && result.lead_id) form.dataset.leadId = result.lead_id;
  }

  function showError(form, code) {
    var message = 'Не удалось отправить заявку. Проверьте соединение и повторите отправку.';
    if (code === 'lead_timeout') message = 'Сервер не ответил вовремя. Данные сохранены в форме — повторите отправку.';
    if (code === 'idempotency_conflict') message = 'Данные заявки изменились после первой попытки. Повторите отправку ещё раз.';
    if (code === 'consent_required') message = 'Подтвердите согласие на обработку данных.';
    if (code === 'invalid_phone') message = 'Проверьте номер телефона.';
    setFormStatus(form, 'error', message + ' Также можно позвонить: ' + FALLBACK_PHONE + ' или написать: ' + FALLBACK_WHATSAPP + '.');
  }

  async function submitForm(form) {
    if (form.dataset.submitting === 'true') {
      track('form_submit_blocked', form, { block_reason: 'duplicate_in_flight' });
      return;
    }

    clearFieldErrors(form);
    if (!form.reportValidity()) {
      var invalid = form.querySelector(':invalid');
      track('form_validation_error', form, {
        reason: 'browser_validation',
        field_name: invalid && invalid.name ? invalid.name : null
      });
      if (invalid && invalid.name === 'consent') {
        markFieldError(form, 'consent', 'Подтвердите согласие на обработку данных.');
      } else if (invalid && invalid.name === 'phone') {
        markFieldError(form, 'phone', 'Введите корректный номер телефона.');
      } else {
        setFormStatus(form, 'error', 'Проверьте обязательные поля формы.');
      }
      return;
    }

    var consentGranted = Boolean(form.querySelector('[name="consent"]:checked'));
    if (!consentGranted) {
      track('form_submit_blocked', form, { block_reason: 'consent_required' });
      markFieldError(form, 'consent', 'Подтвердите согласие на обработку данных.');
      return;
    }

    var phone = normalizePhone((form.querySelector('[name="phone"]') || {}).value || '');
    if (!isValidPhone(phone)) {
      track('form_validation_error', form, { reason: 'invalid_phone', field_name: 'phone' });
      markFieldError(form, 'phone', 'Введите корректный номер телефона.');
      return;
    }

    if (cleanString((form.querySelector('[name="website"]') || {}).value, 80)) {
      track('form_submit_blocked', form, { block_reason: 'honeypot' });
      showError(form, 'spam_detected');
      return;
    }

    var fillMs = Date.now() - Number(form.dataset.startedAt || Date.now());
    if (fillMs < FORM_MIN_FILL_MS) {
      track('form_submit_blocked', form, { block_reason: 'too_fast', fill_ms: fillMs });
      setFormStatus(form, 'error', 'Заполните форму чуть медленнее и повторите отправку.');
      return;
    }

    var lastSuccessAt = Number(safeStorageGet(rateLimitKey(form)) || 0);
    if (lastSuccessAt && Date.now() - lastSuccessAt < FORM_RATE_LIMIT_MS) {
      track('form_submit_blocked', form, { block_reason: 'client_rate_limit' });
      setFormStatus(form, 'error', 'Повторите отправку через минуту.');
      return;
    }

    setSubmitting(form, true);
    var attemptEvent = track('form_submit_attempt', form, { form_variant: getFormVariant(form) });

    try {
      var payload = await buildLeadPayload(form, attemptEvent);
      var fingerprint = stablePayloadFingerprint(payload);
      if (form.dataset.idempotencyFingerprint && form.dataset.idempotencyFingerprint !== fingerprint) {
        form.dataset.idempotencyKey = safeUuid();
        payload.idempotency_key = form.dataset.idempotencyKey;
        payload.idempotencyKey = form.dataset.idempotencyKey;
      }
      form.dataset.idempotencyFingerprint = fingerprint;

      var result = await sendLead(payload);
      track('form_submit_success', form, {
        lead_id: cleanString(result.lead_id, 256),
        request_id: cleanString(result.request_id, 256),
        trace_id: payload.trace_id,
        submit_attempt_event_id: payload.submit_attempt_event_id,
        deduplicated: result.deduplicated === true
      });
      safeStorageSet(rateLimitKey(form), Date.now());
      form.reset();
      clearFieldErrors(form);
      delete form.dataset.idempotencyKey;
      delete form.dataset.idempotencyFingerprint;
      delete form.dataset.traceId;
      form.dataset.idempotencyKey = safeUuid();
      showSuccess(form, result);
    } catch (error) {
      track('form_submit_error', form, {
        error_code: cleanString(error && (error.code || error.message), 256) || 'unknown_error',
        http_status: error && error.status ? error.status : null,
        trace_id: cleanString(form.dataset.traceId, 128)
      });
      if (error && error.code === 'idempotency_conflict') {
        form.dataset.idempotencyKey = safeUuid();
        delete form.dataset.idempotencyFingerprint;
      }
      showError(form, error && (error.code || error.message));
    } finally {
      setSubmitting(form, false);
    }
  }

  function initForms() {
    document.querySelectorAll('form.telegram-form, form[data-contact-form]').forEach(function (form) {
      if (form.dataset.mospochinFormInitialized === FORM_RELEASE) return;
      form.dataset.mospochinFormInitialized = FORM_RELEASE;
      enhanceForm(form);
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        submitForm(form);
      });
    });
  }

  window.mospochinBuildLeadPayload = buildLeadPayload;
  window.mospochinSubmitLeadForm = submitForm;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      loadRuntimeConfig();
      loadCurrentPageMetadata();
      initForms();
    }, { once: true });
  } else {
    loadRuntimeConfig();
    loadCurrentPageMetadata();
    initForms();
  }
})();
