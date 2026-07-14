(function () {
    'use strict';

    var METRIKA_ID = '109138661';
    var MOSPOCHIN_ANALYTICS_ENABLED = true;
    var PRODUCTION_HOSTS = ['mospochin.ru', 'www.mospochin.ru'];
    var SESSION_STORAGE_KEY = 'mospochin_session_v1';
    var BOT_USER_AGENT_RE = /bot\b|crawler|spider|slurp|bingpreview|headlesschrome|phantomjs|prerender|lighthouse/i;

    function analyticsEnabled() {
        if (!MOSPOCHIN_ANALYTICS_ENABLED) return false;
        if (navigator.webdriver === true) return false;
        if (BOT_USER_AGENT_RE.test(String(navigator.userAgent || ''))) return false;
        return PRODUCTION_HOSTS.indexOf(window.location.hostname) !== -1 && /^\d+$/.test(String(METRIKA_ID));
    }

    var isEnabled = analyticsEnabled();
    window.MOSPOCHIN_RUNTIME = window.MOSPOCHIN_RUNTIME || {};
    window.MOSPOCHIN_RUNTIME.analyticsEnabled = isEnabled;
    window.__MOSPOCHIN_RUNTIME__ = window.__MOSPOCHIN_RUNTIME__ || {};
    window.__MOSPOCHIN_RUNTIME__.analyticsEnabled = isEnabled;
    window.MOSPOCHIN_ANALYTICS_ENABLED = isEnabled;
    var startedForms = new WeakSet();
    var ATTRIBUTION_STORAGE_KEY = 'mospochin_attribution_v1';
    var ATTRIBUTION_PARAMS = [
        'utm_source',
        'utm_medium',
      'utm_campaign',
      'utm_content',
      'utm_term',
        'utm_service',
        'utm_landing',
        'metrika_client_id',
        'yclid',
        'gclid'
    ];
    var SITE_EVENT_NAMES = [
        'phone_click', 'whatsapp_click', 'telegram_click', 'email_click',
        'form_open', 'form_start', 'form_submit_attempt', 'form_submit_success',
        'form_submit_error', 'form_validation_error', 'form_submit_blocked',
        'cta_view', 'cta_click', 'form_submit_click'
    ];

    function cleanText(value) {
        return (value || '').replace(/\s+/g, ' ').trim().slice(0, 160);
    }

    function cleanParam(value) {
        return cleanText(value).slice(0, 120);
    }

    function pageSlug() {
        var file = window.location.pathname.split('/').pop() || 'index.html';
        return file.replace(/\.html$/, '') || 'index';
    }

    function referrerHost(referrer) {
        if (!referrer) return '';
        try {
            return new URL(referrer).hostname.slice(0, 120);
        } catch (error) {
            return '';
        }
    }

    function isExternalReferrer(referrer) {
        var host = referrerHost(referrer);
        return Boolean(host && host !== window.location.hostname);
    }

    function pageType() {
        var path = window.location.pathname;
        if (path.indexOf('bytovaya') !== -1 ||
            /holodilniki|stiralnye|posudomoyki|plity|microwaves|water-heaters|kompyutery|routery/.test(path)) {
            return 'b2c';
        }
        return 'b2b';
    }

    function params(extra) {
        return Object.assign({
            page: window.location.pathname,
            page_type: pageType(),
            page_slug: pageSlug()
        }, attributionGoalParams(), extra || {});
    }

    function getCurrentTouch() {
        var search = new URLSearchParams(window.location.search);
        var touch = {
            landing_page: window.location.pathname,
            referrer_host: isExternalReferrer(document.referrer) ? referrerHost(document.referrer) : ''
        };
        var hasTracking = false;

        ATTRIBUTION_PARAMS.forEach(function (name) {
            var value = cleanParam(search.get(name) || '');
            if (!value) return;
            touch[name] = value;
            hasTracking = true;
        });

        if (!hasTracking && !touch.referrer_host) return null;
        touch.captured_at = new Date().toISOString();
        return touch;
    }

    function readAttribution() {
        try {
            return JSON.parse(window.localStorage.getItem(ATTRIBUTION_STORAGE_KEY) || '{}') || {};
        } catch (error) {
            return {};
        }
    }

    function writeAttribution(attribution) {
        try {
            window.localStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution));
        } catch (error) {
            // Ignore storage limits or private browsing restrictions.
        }
    }

    function captureAttribution() {
        var currentTouch = getCurrentTouch();
        var attribution = readAttribution();
        if (!currentTouch) return attribution;

        if (!attribution.first_touch) attribution.first_touch = currentTouch;
        attribution.last_touch = currentTouch;
        writeAttribution(attribution);
        return attribution;
    }

    function setMetrikaClientId(clientId) {
        var safeClientId = cleanParam(clientId || '');
        if (!safeClientId) return;

        var attribution = readAttribution();
        var touch = attribution.last_touch || attribution.first_touch || {
            landing_page: window.location.pathname,
            referrer_host: ''
        };

        touch.metrika_client_id = safeClientId;
        touch.captured_at = touch.captured_at || new Date().toISOString();
        if (!attribution.first_touch) attribution.first_touch = touch;
        if (attribution.first_touch) attribution.first_touch.metrika_client_id = safeClientId;
        attribution.last_touch = Object.assign({}, touch, {
            metrika_client_id: safeClientId
        });
        writeAttribution(attribution);
    }

    function attributionGoalParams() {
        var attribution = readAttribution();
        var touch = attribution.last_touch || attribution.first_touch || {};
        var result = {
            landing_page: touch.landing_page || '',
            referrer_host: touch.referrer_host || '',
            has_yclid: touch.yclid ? 'yes' : 'no'
        };

        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'metrika_client_id'].forEach(function (name) {
            if (touch[name]) result[name] = touch[name];
        });

        return result;
    }

    window.mospochinGetAttribution = function () {
        var attribution = readAttribution();
        return JSON.parse(JSON.stringify(attribution));
    }

    function initMetrika() {
        if (!isEnabled) return;

        (function (m, e, t, r, i, k, a) {
            m[i] = m[i] || function () {
                (m[i].a = m[i].a || []).push(arguments);
            };
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

        window.ym(METRIKA_ID, 'getClientID', function (clientId) {
            setMetrikaClientId(clientId);
        });
    }

    window.mospochinTrackGoal = function (goalName, goalParams) {
        if (!goalName || !isEnabled || typeof window.ym !== 'function') return;
        window.ym(METRIKA_ID, 'reachGoal', goalName, params(goalParams));
    };

    function trackContactClick(link) {
        var href = link.getAttribute('href') || '';
        var goal = '';

        if (href.indexOf('tel:') === 0) goal = 'phone_click';
        if (href.indexOf('https://wa.me/') === 0 || href.indexOf('http://wa.me/') === 0) goal = 'whatsapp_click';
        if (href.indexOf('tg://') === 0 || href.indexOf('telegram') !== -1) goal = 'telegram_click';
        if (href.indexOf('mailto:') === 0) goal = 'email_click';

        if (!goal) return;

        window.mospochinTrackGoal(goal, {
            contact_type: link.dataset.contactLink || goal.replace('_click', ''),
            cta_text_length: cleanText(link.textContent).length
        });
    }

    function trackFormStart(form) {
        if (startedForms.has(form)) return;
        startedForms.add(form);
        window.mospochinTrackGoal('form_start', {
            form_class: form.className
        });
    }

    document.addEventListener('click', function (event) {
        var link = event.target.closest && event.target.closest('a[href]');
        if (link) trackContactClick(link);
    }, true);

    document.addEventListener('focusin', function (event) {
        var form = event.target.closest && event.target.closest('form.telegram-form');
        if (form) trackFormStart(form);
    });

    captureAttribution();
    initMetrika();
})();

/* MosPochin production site-events bridge — added 2026-07-04.
   Sends decision events to /api/track-event and keeps Yandex Metrica reachGoal in parallel. */
(function () {
  'use strict';
  if (window.__MOSPOCHIN_SITE_EVENTS_BRIDGE__) return;
  window.__MOSPOCHIN_SITE_EVENTS_BRIDGE__ = '2026-07-04-run1';

  var seenViews = new WeakSet();
  var viewTimers = new WeakMap();
  var startedForms = new WeakSet();
  var SESSION_KEY = 'mospochin_session_v1';
  var eventTimestamps = [];
  var BOT_USER_AGENT_RE = /bot\b|crawler|spider|slurp|bingpreview|headlesschrome|phantomjs|prerender|lighthouse/i;
  var SITE_EVENT_NAMES = [
    'page_view',
    'phone_click', 'whatsapp_click', 'telegram_click', 'email_click',
    'form_open', 'form_start', 'form_submit_attempt', 'form_submit_success',
    'form_submit_error', 'form_validation_error', 'form_submit_blocked',
    'cta_view', 'cta_click', 'form_submit_click'
  ];
  var HUMAN_DECISION_EVENTS = [
    'cta_click', 'phone_click', 'whatsapp_click', 'telegram_click', 'email_click',
    'form_open', 'form_start', 'form_submit_attempt', 'form_submit_success'
  ];

  function bridgeAnalyticsEnabled() {
    return window.MOSPOCHIN_RUNTIME?.analyticsEnabled === true;
  }
  function isBotLikeClient() {
    return navigator.webdriver === true || BOT_USER_AGENT_RE.test(String(navigator.userAgent || ''));
  }

  function safeText(value, max) {
    return String(value || '').replace(/\s+/g, ' ').trim().slice(0, max || 180);
  }
  function safeContactHref(value) {
    var href = String(value || '').trim().toLowerCase();
    if (href.indexOf('tel:') === 0) return 'tel:[redacted]';
    if (href.indexOf('mailto:') === 0) return 'mailto:[redacted]';
    if (href.indexOf('wa.me') !== -1 || href.indexOf('whatsapp') !== -1) return 'whatsapp:[redacted]';
    if (href.indexOf('telegram') !== -1 || href.indexOf('tg:') === 0) return 'telegram:[redacted]';
    return href ? '[non-contact-link]' : '';
  }
  function redactContactText(value) {
    return safeText(value, 120)
      .replace(/(?:\+?\d[\d\s().-]{7,}\d)/g, '[phone:redacted]')
      .replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/ig, '[email:redacted]');
  }
  function clientRateLimit() {
    var now = Date.now();
    eventTimestamps = eventTimestamps.filter(function (timestamp) { return now - timestamp < 60000; });
    if (eventTimestamps.length >= 30) return false;
    eventTimestamps.push(now);
    return true;
  }
  function getSessionId() {
    try {
      var id = window.sessionStorage.getItem(SESSION_KEY);
      if (!id) {
        id = 's_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
        window.sessionStorage.setItem(SESSION_KEY, id);
      }
      return id;
    } catch (e) {
      return 's_no_storage_' + Date.now().toString(36);
    }
  }
  function bodyDataset() {
    var b = document.body || {};
    var d = b.dataset || {};
    return {
      page_slug: d.pageSlug || '',
      page_intent: document.body?.dataset?.pageIntent || '',
      equipment: document.body?.dataset?.equipment || '',
      brand: document.body?.dataset?.brand || '',
      error_code: d.errorCode || '',
      service: d.service || '',
      commercial_segment: document.body?.dataset?.commercialSegment || '',
      page_version: document.body?.dataset?.pageVersion || ''
    };
  }
  function attribution() {
    var result = {};
    try {
      var url = new URL(window.location.href);
      ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_service','utm_landing','yclid','gclid'].forEach(function (k) {
        var v = url.searchParams.get(k);
        if (v) result[k] = safeText(v, 160);
      });
    } catch (e) {}
    try {
      var stored = JSON.parse(window.localStorage.getItem('mospochin_attribution_v1') || '{}') || {};
      var touch = stored.last_touch || stored.first_touch || {};
      ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_service','utm_landing','yclid','gclid','metrika_client_id'].forEach(function (k) {
        if (!result[k] && touch[k]) result[k] = safeText(touch[k], 160);
      });
    } catch (e) {}
    return result;
  }
  function ctaPayload(el) {
    var d = (el && el.dataset) || {};
    return {
      cta_id: d.ctaId || '',
      cta_group: d.ctaGroup || '',
      block: d.block || '',
      cta_text: redactContactText(el ? el.textContent : ''),
      href: safeContactHref(el && el.getAttribute ? el.getAttribute('href') : '')
    };
  }
  function formPayload(form) {
    var d = (form && form.dataset) || {};
    return {
      form_id: d.formId || d.formContext || '',
      form_context: d.formContext || '',
      form_variant: d.formVariant || d.formContext || '',
      block: d.block || '',
      form_class: safeText(form ? form.className : '', 160)
    };
  }
  function sendEvent(eventName, extra) {
    if (!eventName || SITE_EVENT_NAMES.indexOf(eventName) === -1 || !bridgeAnalyticsEnabled() || isBotLikeClient() || !clientRateLimit()) return;
    var payload = Object.assign({
      event: eventName,
      event_id: 'evt_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10),
      client_event_ts: new Date().toISOString(),
      event_class: eventName === 'page_view' || eventName === 'cta_view' ? 'visibility' : eventName.indexOf('form_') === 0 ? 'form_outcome' : 'micro_conversion',
      is_decision_event: HUMAN_DECISION_EVENTS.indexOf(eventName) !== -1,
      session_id: getSessionId(),
      page_url: window.location.href,
      page_path: window.location.pathname,
      referrer: document.referrer || '',
      user_agent: navigator.userAgent || '',
      ts: new Date().toISOString()
    }, bodyDataset(), attribution(), extra || {});

    try {
      if (eventName !== 'page_view' && typeof window.mospochinTrackGoal === 'function') {
        window.mospochinTrackGoal(eventName, payload);
      }
    } catch (e) {}

    try {
      var body = JSON.stringify(payload);
      if (navigator.sendBeacon) {
        var ok = navigator.sendBeacon('/api/track-event', new Blob([body], {type: 'application/json'}));
        if (ok) return;
      }
      fetch('/api/track-event', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: body,
        keepalive: true,
        credentials: 'same-origin'
      }).catch(function () {});
    } catch (e) {}
  }
  window.mospochinTrackSiteEvent = sendEvent;

  function sendPageView() {
    if (window.__MOSPOCHIN_PAGE_VIEW_SENT__) return;
    window.__MOSPOCHIN_PAGE_VIEW_SENT__ = true;
    sendEvent('page_view', {page_title: safeText(document.title || '', 240)});
  }

  function inferContactEvent(link) {
    var href = (link.getAttribute('href') || '').toLowerCase();
    if (href.indexOf('tel:') === 0) return 'phone_click';
    if (href.indexOf('wa.me/') !== -1 || href.indexOf('whatsapp') !== -1) return 'whatsapp_click';
    if (href.indexOf('telegram') !== -1 || href.indexOf('tg:') === 0) return 'telegram_click';
    if (href.indexOf('mailto:') === 0) return 'email_click';
    return 'cta_click';
  }

  document.addEventListener('click', function (event) {
    if (event.isTrusted === false) return;
    var submit = event.target.closest && event.target.closest('button[type="submit"], input[type="submit"]');
    if (submit) {
      var form = submit.closest('form');
      sendEvent('form_submit_click', Object.assign(ctaPayload(submit), formPayload(form)));
      return;
    }
    var cta = event.target.closest && event.target.closest('[data-cta-id], a[href^="tel:"], a[href*="wa.me/"], a[href^="mailto:"], [data-form-open]');
    if (!cta) return;
    var eventName = cta.hasAttribute('data-form-open') ? 'form_open' : inferContactEvent(cta);
    sendEvent(eventName, ctaPayload(cta));
  }, true);

  document.addEventListener('focusin', function (event) {
    if (event.isTrusted === false) return;
    var form = event.target.closest && event.target.closest('form[data-contact-form], form.telegram-form');
    if (!form || startedForms.has(form)) return;
    startedForms.add(form);
    form.dataset.startedAt = form.dataset.startedAt || String(Date.now());
    sendEvent('form_start', formPayload(form));
  }, true);

  document.addEventListener('invalid', function (event) {
    if (event.isTrusted === false) return;
    var field = event.target;
    var form = field && field.closest && field.closest('form[data-contact-form], form.telegram-form');
    if (!form) return;
    sendEvent('form_validation_error', Object.assign(formPayload(form), {
      field_name: safeText(field.getAttribute('name') || field.id || field.tagName, 80),
      field_type: safeText(field.getAttribute('type') || field.tagName, 40),
      validation_message: safeText(field.validationMessage || '', 160)
    }));
  }, true);

  function observeCtaViews() {
    var nodes = Array.prototype.slice.call(document.querySelectorAll('[data-cta-id]'));
    if (!('IntersectionObserver' in window)) {
      nodes.slice(0, 20).forEach(function (el) {
        if (!seenViews.has(el)) { seenViews.add(el); sendEvent('cta_view', ctaPayload(el)); }
      });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting || seenViews.has(entry.target)) {
          if (!entry.isIntersecting && viewTimers.has(entry.target)) {
            clearTimeout(viewTimers.get(entry.target));
            viewTimers.delete(entry.target);
          }
          return;
        }
        if (viewTimers.has(entry.target)) return;
        viewTimers.set(entry.target, setTimeout(function () {
          if (seenViews.has(entry.target)) return;
          seenViews.add(entry.target);
          viewTimers.delete(entry.target);
          sendEvent('cta_view', ctaPayload(entry.target));
          io.unobserve(entry.target);
        }, 900));
      });
    }, {threshold: 0.5});
    nodes.forEach(function (el) { io.observe(el); });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      sendPageView();
      observeCtaViews();
    });
  } else {
    sendPageView();
    observeCtaViews();
  }
})();
