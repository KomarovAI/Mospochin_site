(function () {
  'use strict';

  var SITE_RELEASE = 'site-paid-tracking-v3-20260716';
  var ANALYTICS_RELEASE = 'analytics-v3-20260716';
  var SCHEMA_VERSION = 'mospochin.web.v3';
  var TRACKING_VERSION = '2026-07-15';
  var METRIKA_ID = String(window.MOSPOCHIN_METRICA_COUNTER_ID || '109138661');
  var PRODUCTION_HOSTS = ['mospochin.ru', 'www.mospochin.ru'];
  var BOT_USER_AGENT_RE = /bot\b|crawler|spider|slurp|bingpreview|phantomjs|prerender|lighthouse/i;

  var VISITOR_KEY = 'mospochin_visitor_v1';
  var SESSION_KEY = 'mospochin_session_v3';
  var TAB_KEY = 'mospochin_tab_v1';
  var ATTRIBUTION_KEY = 'mospochin_attribution_v3';
  var LEGACY_ATTRIBUTION_KEY = 'mospochin_attribution_v1';
  var METRIKA_CLIENT_KEY = 'mospochin_metrika_client_v1';

  var VISITOR_TTL_MS = 365 * 24 * 60 * 60 * 1000;
  var ATTRIBUTION_TTL_MS = 90 * 24 * 60 * 60 * 1000;
  var SESSION_IDLE_MS = 30 * 60 * 1000;
  var METRIKA_CLIENT_TTL_MS = 365 * 24 * 60 * 60 * 1000;
  var EVENT_TIMEOUT_MS = 5000;

  var ATTRIBUTION_FIELDS = [
    'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term',
    'utm_service', 'utm_geo', 'yclid', 'gclid', 'etext'
  ];

  var EVENT_DEFINITIONS = Object.freeze({
    page_view: Object.freeze({ event_class: 'visibility', is_decision_event: false }),
    cta_view: Object.freeze({ event_class: 'visibility', is_decision_event: false }),
    cta_click: Object.freeze({ event_class: 'engagement', is_decision_event: true }),
    phone_click: Object.freeze({ event_class: 'micro_conversion', is_decision_event: true }),
    whatsapp_click: Object.freeze({ event_class: 'micro_conversion', is_decision_event: true }),
    telegram_click: Object.freeze({ event_class: 'micro_conversion', is_decision_event: true }),
    email_click: Object.freeze({ event_class: 'micro_conversion', is_decision_event: true }),
    form_open: Object.freeze({ event_class: 'micro_conversion', is_decision_event: true }),
    form_start: Object.freeze({ event_class: 'micro_conversion', is_decision_event: true }),
    form_submit_attempt: Object.freeze({ event_class: 'conversion_step', is_decision_event: true }),
    form_submit_success: Object.freeze({ event_class: 'conversion', is_decision_event: true }),
    form_submit_error: Object.freeze({ event_class: 'error', is_decision_event: false }),
    form_validation_error: Object.freeze({ event_class: 'error', is_decision_event: false }),
    form_submit_blocked: Object.freeze({ event_class: 'error', is_decision_event: false })
  });

  var RESERVED_EVENT_FIELDS = new Set([
    'event', 'event_class', 'is_decision_event', 'schema_version', 'tracking_version',
    'event_id', 'client_event_ts', 'site_release', 'analytics_release'
  ]);

  var METRICA_GOALS = new Set([
    'phone_click', 'whatsapp_click', 'form_open', 'form_submit_attempt', 'form_submit_success'
  ]);

  var startedForms = new WeakSet();
  var viewedCtas = new WeakSet();
  var visibilityTimers = new WeakMap();
  var metricaClientIdPromise = null;
  var resolvedMetricaClientId = null;

  window.MOSPOCHIN_RELEASE = SITE_RELEASE;
  window.MOSPOCHIN_METRICA_COUNTER_ID = METRIKA_ID;
  window.__MOSPOCHIN_SITE_EVENTS_BRIDGE__ = ANALYTICS_RELEASE;
  window.MOSPOCHIN_TRACKING_V3 = Object.freeze({
    schemaVersion: SCHEMA_VERSION,
    trackingVersion: TRACKING_VERSION,
    siteRelease: SITE_RELEASE,
    analyticsRelease: ANALYTICS_RELEASE
  });

  function cleanString(value, maxLength) {
    if (typeof value !== 'string' && typeof value !== 'number') return null;
    var cleaned = String(value).trim().replace(/\s+/g, ' ');
    if (!cleaned || cleaned === 'undefined' || cleaned === 'null') return null;
    return cleaned.slice(0, maxLength || 2048);
  }

  function safeUuid() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }
    if (window.crypto && typeof window.crypto.getRandomValues === 'function') {
      var bytes = new Uint8Array(16);
      window.crypto.getRandomValues(bytes);
      bytes[6] = (bytes[6] & 15) | 64;
      bytes[8] = (bytes[8] & 63) | 128;
      var hex = Array.prototype.map.call(bytes, function (byte) {
        return byte.toString(16).padStart(2, '0');
      }).join('');
      return [hex.slice(0, 8), hex.slice(8, 12), hex.slice(12, 16), hex.slice(16, 20), hex.slice(20)].join('-');
    }
    return 'fallback-' + Date.now().toString(36) + '-' + Math.floor((performance.now ? performance.now() : 0) * 1000).toString(36) + '-' + Math.random().toString(36).slice(2, 12);
  }

  function getStorage(name) {
    try { return window[name] || null; } catch (error) { return null; }
  }

  function storageGet(storage, key) {
    try { return storage.getItem(key); } catch (error) { return null; }
  }

  function storageSet(storage, key, value) {
    try { storage.setItem(key, value); return true; } catch (error) { return false; }
  }

  function storageRemove(storage, key) {
    try { storage.removeItem(key); } catch (error) {}
  }

  function readJson(storage, key) {
    var raw = storageGet(storage, key);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (error) { storageRemove(storage, key); return null; }
  }

  function writeJson(storage, key, value) {
    return storageSet(storage, key, JSON.stringify(value));
  }

  function isExpired(value) {
    var expiresAt = value && Date.parse(value.expires_at);
    return !Number.isFinite(expiresAt) || Date.now() >= expiresAt;
  }

  function getOrCreateVisitor() {
    var now = new Date();
    var stored = readJson(getStorage('localStorage'), VISITOR_KEY);
    if (!stored || !cleanString(stored.visitor_id, 128) || isExpired(stored)) {
      stored = {
        schema_version: 'mospochin.visitor.v1',
        visitor_id: safeUuid(),
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        expires_at: new Date(now.getTime() + VISITOR_TTL_MS).toISOString()
      };
    } else {
      stored.updated_at = now.toISOString();
      stored.expires_at = new Date(now.getTime() + VISITOR_TTL_MS).toISOString();
    }
    writeJson(getStorage('localStorage'), VISITOR_KEY, stored);
    return stored;
  }

  function getOrRefreshSession() {
    var now = new Date();
    var stored = readJson(getStorage('localStorage'), SESSION_KEY);
    var lastActivity = stored ? Date.parse(stored.last_activity_at) : NaN;
    if (!stored || !cleanString(stored.session_id, 128) || !Number.isFinite(lastActivity) || now.getTime() - lastActivity > SESSION_IDLE_MS) {
      stored = {
        schema_version: 'mospochin.session.v3',
        session_id: safeUuid(),
        created_at: now.toISOString(),
        last_activity_at: now.toISOString()
      };
    } else {
      stored.last_activity_at = now.toISOString();
    }
    writeJson(getStorage('localStorage'), SESSION_KEY, stored);
    return stored;
  }

  function getOrCreateTab() {
    var stored = readJson(getStorage('sessionStorage'), TAB_KEY);
    if (!stored || !cleanString(stored.tab_id, 128)) {
      stored = {
        schema_version: 'mospochin.tab.v1',
        tab_id: safeUuid(),
        created_at: new Date().toISOString()
      };
      writeJson(getStorage('sessionStorage'), TAB_KEY, stored);
    }
    return stored;
  }

  function readTouchFromUrl(url) {
    var parsed = url || new URL(window.location.href);
    var touch = {
      captured_at: new Date().toISOString(),
      landing_path: cleanString(parsed.pathname, 1024) || '/',
      landing_url: cleanString(parsed.href, 4096),
      referrer: cleanString(document.referrer, 4096)
    };
    var hasAttribution = false;
    ATTRIBUTION_FIELDS.forEach(function (field) {
      var value = cleanString(parsed.searchParams.get(field), field === 'yclid' || field === 'gclid' ? 256 : 1024);
      touch[field] = value;
      if (value !== null) hasAttribution = true;
    });
    return hasAttribution ? touch : null;
  }

  function normalizeLegacyTouch(touch) {
    if (!touch || typeof touch !== 'object' || Array.isArray(touch)) return null;
    var landingPath = cleanString(touch.landing_path || touch.landing_page || touch.utm_landing, 1024);
    var result = {
      captured_at: cleanString(touch.captured_at, 80) || new Date().toISOString(),
      landing_path: landingPath,
      landing_url: cleanString(touch.landing_url || touch.page_url, 4096),
      referrer: cleanString(touch.referrer, 4096)
    };
    ATTRIBUTION_FIELDS.forEach(function (field) {
      result[field] = cleanString(touch[field], field === 'yclid' || field === 'gclid' ? 256 : 1024);
    });
    var hasKnownValue = Boolean(result.landing_path) || ATTRIBUTION_FIELDS.some(function (field) { return result[field] !== null; });
    return hasKnownValue ? result : null;
  }

  function migrateLegacyAttribution(currentTouch) {
    if (readJson(getStorage('localStorage'), ATTRIBUTION_KEY)) return null;
    var legacy = readJson(getStorage('localStorage'), LEGACY_ATTRIBUTION_KEY);
    if (!legacy) return null;
    var firstTouch = normalizeLegacyTouch(legacy.first_touch);
    var lastTouch = normalizeLegacyTouch(legacy.last_touch) || firstTouch;
    var suspiciousLegacyLanding = firstTouch && firstTouch.landing_path === '/about.html' && currentTouch && currentTouch.landing_path !== '/about.html';
    if (suspiciousLegacyLanding) return null;
    if (!firstTouch && !lastTouch) return null;
    var now = new Date();
    var migrated = {
      schema_version: 'mospochin.attribution.v3',
      first_touch: firstTouch || lastTouch,
      last_touch: lastTouch || firstTouch,
      created_at: now.toISOString(),
      updated_at: now.toISOString(),
      expires_at: new Date(now.getTime() + ATTRIBUTION_TTL_MS).toISOString(),
      migrated_from: LEGACY_ATTRIBUTION_KEY
    };
    writeJson(getStorage('localStorage'), ATTRIBUTION_KEY, migrated);
    return migrated;
  }

  function readStoredAttribution() {
    var stored = readJson(getStorage('localStorage'), ATTRIBUTION_KEY);
    if (!stored) return null;
    if (isExpired(stored)) {
      storageRemove(getStorage('localStorage'), ATTRIBUTION_KEY);
      return null;
    }
    return stored;
  }

  function initializeAttribution() {
    var now = new Date();
    var currentTouch = readTouchFromUrl();
    var stored = readStoredAttribution() || migrateLegacyAttribution(currentTouch);

    if (!stored && !currentTouch) return null;
    if (!stored && currentTouch) {
      stored = {
        schema_version: 'mospochin.attribution.v3',
        first_touch: currentTouch,
        last_touch: currentTouch,
        created_at: now.toISOString(),
        updated_at: now.toISOString(),
        expires_at: new Date(now.getTime() + ATTRIBUTION_TTL_MS).toISOString()
      };
      writeJson(getStorage('localStorage'), ATTRIBUTION_KEY, stored);
      return stored;
    }
    if (stored && currentTouch) {
      stored.last_touch = currentTouch;
      stored.updated_at = now.toISOString();
      stored.expires_at = new Date(now.getTime() + ATTRIBUTION_TTL_MS).toISOString();
      writeJson(getStorage('localStorage'), ATTRIBUTION_KEY, stored);
    }
    return stored;
  }

  function clone(value) {
    if (value == null) return value;
    try { return JSON.parse(JSON.stringify(value)); } catch (error) { return null; }
  }

  function analyticsEnabled() {
    var queryOverride = new URLSearchParams(window.location.search).get('mospochin_analytics_test') === '1';
    if (queryOverride || window.__MOSPOCHIN_ANALYTICS_TEST__ === true) return true;
    if (navigator.webdriver === true || BOT_USER_AGENT_RE.test(String(navigator.userAgent || ''))) return false;
    return PRODUCTION_HOSTS.indexOf(window.location.hostname) !== -1 && /^\d+$/.test(METRIKA_ID);
  }

  function initMetrika() {
    if (!analyticsEnabled()) return false;
    if (typeof window.ym !== 'function') {
      (function (m, e, t, r, i, k, a) {
        m[i] = m[i] || function () { (m[i].a = m[i].a || []).push(arguments); };
        m[i].l = 1 * new Date();
        for (var j = 0; j < e.scripts.length; j += 1) {
          if (e.scripts[j].src === r) return;
        }
        k = e.createElement(t);
        a = e.getElementsByTagName(t)[0];
        k.async = 1;
        k.src = r;
        a.parentNode.insertBefore(k, a);
      })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=' + METRIKA_ID, 'ym');
    }
    if (!window.__MOSPOCHIN_METRIKA_INIT__) {
      window.__MOSPOCHIN_METRIKA_INIT__ = true;
      window.ym(METRIKA_ID, 'init', {
        ssr: true,
        clickmap: true,
        trackLinks: true,
        accurateTrackBounce: true,
        webvisor: true,
        ecommerce: 'dataLayer',
        referrer: document.referrer,
        url: location.href
      });
    }
    return true;
  }

  function readCachedMetricaClientId() {
    var stored = readJson(getStorage('localStorage'), METRIKA_CLIENT_KEY);
    if (!stored || isExpired(stored)) {
      storageRemove(getStorage('localStorage'), METRIKA_CLIENT_KEY);
      return null;
    }
    return cleanString(stored.client_id, 128);
  }

  function cacheMetricaClientId(value) {
    var clientId = cleanString(value, 128);
    if (!clientId) return null;
    var now = new Date();
    writeJson(getStorage('localStorage'), METRIKA_CLIENT_KEY, {
      schema_version: 'mospochin.metrica-client.v1',
      client_id: clientId,
      updated_at: now.toISOString(),
      expires_at: new Date(now.getTime() + METRIKA_CLIENT_TTL_MS).toISOString()
    });
    resolvedMetricaClientId = clientId;
    return clientId;
  }

  function requestMetricaClientId(timeoutMs) {
    return new Promise(function (resolve) {
      var cached = readCachedMetricaClientId();
      if (cached) {
        resolvedMetricaClientId = cached;
        resolve(cached);
        return;
      }
      initMetrika();
      if (!METRIKA_ID || typeof window.ym !== 'function') {
        resolve(null);
        return;
      }
      var settled = false;
      var finish = function (value) {
        if (settled) return;
        settled = true;
        resolve(cacheMetricaClientId(value));
      };
      var timer = window.setTimeout(function () { finish(null); }, timeoutMs || 2000);
      try {
        window.ym(METRIKA_ID, 'getClientID', function (clientId) {
          window.clearTimeout(timer);
          finish(clientId);
        });
      } catch (error) {
        window.clearTimeout(timer);
        finish(null);
      }
    });
  }

  function warmMetricaClientId() {
    if (!metricaClientIdPromise) {
      metricaClientIdPromise = requestMetricaClientId(2000).then(function (value) {
        resolvedMetricaClientId = value;
        return value;
      });
    }
    return metricaClientIdPromise;
  }

  function bodyDataset() {
    var data = (document.body && document.body.dataset) || {};
    return {
      page_slug: cleanString(data.pageSlug, 256),
      page_intent: cleanString(data.pageIntent, 128),
      page_version: cleanString(data.pageVersion, 128),
      equipment: cleanString(data.equipment, 128),
      service: cleanString(data.service, 128),
      commercial_segment: cleanString(data.commercialSegment, 128),
      brand: cleanString(data.brand, 128),
      error_code: cleanString(data.errorCode, 64)
    };
  }

  function getIdentityContext() {
    var visitor = getOrCreateVisitor();
    var session = getOrRefreshSession();
    var tab = getOrCreateTab();
    return {
      visitor_id: visitor.visitor_id,
      session_id: session.session_id,
      tab_id: tab.tab_id
    };
  }

  function getAttributionContext() {
    var attribution = initializeAttribution();
    var firstTouchYclid = cleanString(attribution && attribution.first_touch && attribution.first_touch.yclid, 256);
    var lastTouchYclid = cleanString(attribution && attribution.last_touch && attribution.last_touch.yclid, 256);
    var yclidForOffline = lastTouchYclid || firstTouchYclid || null;
    return {
      first_touch: attribution ? clone(attribution.first_touch) : null,
      last_touch: attribution ? clone(attribution.last_touch) : null,
      landing_path: attribution && attribution.first_touch ? cleanString(attribution.first_touch.landing_path, 1024) : null,
      first_touch_yclid: firstTouchYclid,
      last_touch_yclid: lastTouchYclid,
      yclid_for_offline: yclidForOffline,
      yclid_source: lastTouchYclid ? 'last_touch' : firstTouchYclid ? 'first_touch' : null,
      gclid: cleanString((attribution && attribution.last_touch && attribution.last_touch.gclid) || (attribution && attribution.first_touch && attribution.first_touch.gclid), 256)
    };
  }

  function getBaseContext() {
    return Object.assign({
      page_url: window.location.href,
      page_path: window.location.pathname,
      referrer: cleanString(document.referrer, 4096),
      metrika_client_id: resolvedMetricaClientId,
      navigator_webdriver: navigator.webdriver === true,
      user_agent: cleanString(navigator.userAgent, 512)
    }, bodyDataset(), getIdentityContext(), getAttributionContext());
  }

  async function getLeadContext() {
    var clientId = await warmMetricaClientId().catch(function () { return null; });
    resolvedMetricaClientId = clientId;
    return getBaseContext();
  }

  function buildEvent(eventName, extra) {
    var normalized = cleanString(eventName, 64);
    var definition = normalized ? EVENT_DEFINITIONS[normalized] : null;
    if (!definition) {
      if (window.__MOSPOCHIN_DEBUG__) console.warn('[MosPochin analytics] skipped unknown event', eventName);
      return null;
    }
    var safeExtra = {};
    Object.keys(extra || {}).forEach(function (key) {
      if (!RESERVED_EVENT_FIELDS.has(key)) safeExtra[key] = extra[key];
    });
    return Object.assign({}, safeExtra, getBaseContext(), {
      schema_version: SCHEMA_VERSION,
      tracking_version: TRACKING_VERSION,
      site_release: SITE_RELEASE,
      analytics_release: ANALYTICS_RELEASE,
      event: normalized,
      event_id: safeUuid(),
      client_event_ts: new Date().toISOString(),
      event_class: definition.event_class,
      is_decision_event: definition.is_decision_event
    });
  }

  function createTimeoutSignal(timeoutMs) {
    if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function') {
      return AbortSignal.timeout(timeoutMs);
    }
    var controller = new AbortController();
    window.setTimeout(function () { controller.abort(); }, timeoutMs);
    return controller.signal;
  }

  function postEvent(payload, options) {
    if (!payload) return Promise.resolve(false);
    var requireResponse = options && options.requireResponse === true;
    var body = JSON.stringify(payload);
    return fetch('/api/track-event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      keepalive: true,
      signal: createTimeoutSignal(EVENT_TIMEOUT_MS),
      body: body
    }).then(function (response) {
      if (requireResponse && !response.ok) throw new Error('track_event_http_' + response.status);
      return response.ok;
    }).catch(function () {
      if (!requireResponse && navigator.sendBeacon) {
        try { return navigator.sendBeacon('/api/track-event', new Blob([body], { type: 'application/json' })); } catch (error) {}
      }
      return false;
    });
  }

  function reachMetricaGoal(goalId, goalParams) {
    if (!METRICA_GOALS.has(goalId) || typeof window.ym !== 'function' || !METRIKA_ID) return false;
    try {
      window.ym(METRIKA_ID, 'reachGoal', goalId, goalParams || {});
      return true;
    } catch (error) {
      return false;
    }
  }

  function trackEvent(eventName, extra, options) {
    var payload = buildEvent(eventName, extra || {});
    if (!payload) return null;
    postEvent(payload, options || {}).catch(function () {});
    if (METRICA_GOALS.has(eventName)) {
      reachMetricaGoal(eventName, {
        page_slug: payload.page_slug || null,
        form_id: payload.form_id || null,
        cta_id: payload.cta_id || null,
        commercial_segment: payload.commercial_segment || null
      });
    }
    return payload;
  }

  function redactContactText(value) {
    return (cleanString(value, 256) || '')
      .replace(/(?:\+?\d[\d\s().-]{7,}\d)/g, '[phone:redacted]')
      .replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi, '[email:redacted]');
  }

  function safeContactTarget(element) {
    var href = cleanString(element && element.getAttribute ? element.getAttribute('href') : null, 1024) || '';
    var lower = href.toLowerCase();
    if (lower.indexOf('tel:') === 0) return 'tel:[redacted]';
    if (lower.indexOf('mailto:') === 0) return 'mailto:[redacted]';
    if (lower.indexOf('wa.me') !== -1 || lower.indexOf('whatsapp') !== -1) return 'whatsapp:[redacted]';
    if (lower.indexOf('t.me') !== -1 || lower.indexOf('telegram') !== -1 || lower.indexOf('tg:') === 0) return 'telegram:[redacted]';
    return href ? '[non-contact-link]' : null;
  }

  function ctaPayload(element) {
    var data = (element && element.dataset) || {};
    return {
      cta_id: cleanString(data.ctaId, 256),
      cta_group: cleanString(data.ctaGroup, 128),
      block: cleanString(data.block, 128),
      cta_text: redactContactText(element ? element.textContent : ''),
      contact_target: safeContactTarget(element)
    };
  }

  function formPayload(form) {
    var data = (form && form.dataset) || {};
    return {
      form_id: cleanString(data.formId || data.formContext, 256),
      form_context: cleanString(data.formContext, 256),
      form_variant: cleanString(data.formVariant || data.formContext, 256),
      block: cleanString(data.block, 128)
    };
  }

  function detectClickEvent(element) {
    var href = (element.getAttribute('href') || '').toLowerCase();
    var group = (element.dataset.ctaGroup || '').toLowerCase();
    if (href.indexOf('tel:') === 0) return 'phone_click';
    if (group === 'whatsapp' || href.indexOf('wa.me') !== -1 || href.indexOf('whatsapp.com') !== -1) return 'whatsapp_click';
    if (group === 'telegram' || href.indexOf('t.me') !== -1 || href.indexOf('telegram') !== -1 || href.indexOf('tg:') === 0) return 'telegram_click';
    if (href.indexOf('mailto:') === 0) return 'email_click';
    if (element.hasAttribute('data-form-open') || group === 'form_open') return 'form_open';
    return 'cta_click';
  }

  function observeCtaViews() {
    var nodes = Array.prototype.slice.call(document.querySelectorAll('[data-cta-id]'));
    if (!('IntersectionObserver' in window)) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var element = entry.target;
        if (entry.intersectionRatio >= 0.5 && !viewedCtas.has(element)) {
          if (!visibilityTimers.has(element)) {
            visibilityTimers.set(element, window.setTimeout(function () {
              if (viewedCtas.has(element)) return;
              viewedCtas.add(element);
              visibilityTimers.delete(element);
              observer.unobserve(element);
              trackEvent('cta_view', ctaPayload(element));
            }, 500));
          }
        } else {
          var timer = visibilityTimers.get(element);
          if (timer) {
            window.clearTimeout(timer);
            visibilityTimers.delete(element);
          }
        }
      });
    }, { threshold: [0, 0.5, 1] });
    nodes.forEach(function (element) { observer.observe(element); });
  }

  document.addEventListener('click', function (event) {
    if (event.isTrusted === false) return;
    var declared = event.target.closest && event.target.closest('[data-site-event]');
    if (declared) {
      var declaredName = cleanString(declared.getAttribute('data-site-event'), 64);
      if (declaredName && EVENT_DEFINITIONS[declaredName]) trackEvent(declaredName, ctaPayload(declared));
    }

    var cta = event.target.closest && event.target.closest('[data-cta-id], a[href^="tel:"], a[href*="wa.me/"], a[href^="mailto:"], [data-form-open]');
    if (!cta) return;
    trackEvent(detectClickEvent(cta), ctaPayload(cta));
  }, true);

  document.addEventListener('input', function (event) {
    if (event.isTrusted === false) return;
    var form = event.target.closest && event.target.closest('form[data-contact-form], form.telegram-form');
    if (!form || startedForms.has(form)) return;
    startedForms.add(form);
    form.dataset.startedAt = form.dataset.startedAt || String(Date.now());
    trackEvent('form_start', formPayload(form));
  }, true);

  document.addEventListener('change', function (event) {
    if (event.isTrusted === false) return;
    var form = event.target.closest && event.target.closest('form[data-contact-form], form.telegram-form');
    if (!form || startedForms.has(form)) return;
    startedForms.add(form);
    form.dataset.startedAt = form.dataset.startedAt || String(Date.now());
    trackEvent('form_start', formPayload(form));
  }, true);

  document.addEventListener('invalid', function (event) {
    if (event.isTrusted === false) return;
    var field = event.target;
    var form = field && field.closest && field.closest('form[data-contact-form], form.telegram-form');
    if (!form) return;
    trackEvent('form_validation_error', Object.assign(formPayload(form), {
      field_name: cleanString(field.getAttribute('name') || field.id || field.tagName, 80),
      field_type: cleanString(field.getAttribute('type') || field.tagName, 40),
      validation_message: cleanString(field.validationMessage, 160)
    }));
  }, true);

  window.mospochinGetAttribution = function () { return clone(initializeAttribution()); };
  window.mospochinGetIdentity = function () { return clone(getIdentityContext()); };
  window.mospochinGetBaseContext = function () { return clone(getBaseContext()); };
  window.mospochinGetLeadContext = getLeadContext;
  window.mospochinGetMetricaClientId = warmMetricaClientId;
  window.mospochinGetCachedMetricaClientId = function () { return resolvedMetricaClientId; };
  window.mospochinBuildSiteEvent = buildEvent;
  window.mospochinPostSiteEvent = postEvent;
  window.mospochinTrackSiteEvent = trackEvent;
  window.mospochinTrackGoal = function (goalId, params) { return reachMetricaGoal(goalId, params); };
  window.mospochinSafeUuid = safeUuid;

  initializeAttribution();
  getIdentityContext();
  initMetrika();
  warmMetricaClientId();

  function init() {
    if (!window.__MOSPOCHIN_PAGE_VIEW_SENT__) {
      window.__MOSPOCHIN_PAGE_VIEW_SENT__ = true;
      trackEvent('page_view', { page_title: cleanString(document.title, 240) });
    }
    observeCtaViews();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
