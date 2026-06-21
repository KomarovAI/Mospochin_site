(function () {
    'use strict';

    var METRIKA_ID = '109138661';
    var isMetrikaEnabled = /^\d+$/.test(String(METRIKA_ID));
    var TRACK_ENDPOINT = '/api/track-event';
    var ATTRIBUTION_STORAGE_KEY = 'mospochin_attribution_v1';
    var ATTRIBUTION_PARAMS = [
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_content',
        'utm_term',
        'metrika_client_id',
        'yclid'
    ];
    var CONTACT_EVENTS = {
        phone: 'phone_click',
        whatsapp: 'whatsapp_click',
        telegram: 'telegram_click',
        email: 'email_click'
    };
    var startedForms = new WeakSet();
    var openedForms = new WeakSet();
    var viewedCtas = new WeakSet();
    var fallbackCtaIndex = 0;

    function cleanText(value, limit) {
        return String(value || '').replace(/\s+/g, ' ').trim().slice(0, limit || 160);
    }

    function cleanParam(value) {
        return cleanText(value, 200);
    }

    function safeDataset(element) {
        var result = {};
        if (!element || !element.dataset) return result;
        Object.keys(element.dataset).forEach(function (key) {
            var value = cleanParam(element.dataset[key]);
            if (value) result[key] = value;
        });
        return result;
    }

    function pageSlug() {
        var fromBody = document.body && document.body.dataset && document.body.dataset.pageSlug;
        if (fromBody) return cleanParam(fromBody);
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
        var segment = document.body && document.body.dataset && document.body.dataset.commercialSegment;
        if (segment === 'b2c_household') return 'b2c';
        if (segment === 'b2b_kitchen') return 'b2b';
        var path = window.location.pathname;
        if (path.indexOf('bytovaya') !== -1 || /holodilniki|stiralnye|posudomoyki|plity|microwaves|water-heaters|kompyutery|routery/.test(path)) {
            return 'b2c';
        }
        return 'b2b';
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

        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'metrika_client_id', 'yclid'].forEach(function (name) {
            if (touch[name]) result[name] = touch[name];
        });

        return result;
    }

    function pageParams() {
        return Object.assign({
            page: window.location.pathname,
            page_type: pageType(),
            page_slug: pageSlug()
        }, safeDataset(document.body), attributionGoalParams());
    }

    function uuid() {
        if (window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
        return String(Date.now()) + '-' + Math.random().toString(16).slice(2);
    }

    function sessionId() {
        var key = 'mospochin_session_id_v1';
        try {
            var existing = window.sessionStorage.getItem(key);
            if (existing) return existing;
            var created = uuid();
            window.sessionStorage.setItem(key, created);
            return created;
        } catch (error) {
            return '';
        }
    }

    function normalizeEventName(name) {
        return cleanText(name, 80).replace(/[^a-z0-9_:-]/gi, '_').toLowerCase();
    }

    function sanitizePayload(value, depth) {
        if (depth > 4) return undefined;
        if (value == null) return '';
        if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
            return cleanParam(value);
        }
        if (Array.isArray(value)) {
            return value.slice(0, 20).map(function (item) { return sanitizePayload(item, depth + 1); });
        }
        if (typeof value === 'object') {
            var result = {};
            Object.keys(value).slice(0, 40).forEach(function (key) {
                var cleanKey = cleanText(key, 60).replace(/[^a-z0-9_:-]/gi, '_');
                if (!cleanKey) return;
                var cleanValue = sanitizePayload(value[key], depth + 1);
                if (cleanValue !== undefined) result[cleanKey] = cleanValue;
            });
            return result;
        }
        return '';
    }

    function sendEventToBackend(eventName, details) {
        var payload = {
            event_name: normalizeEventName(eventName),
            event_id: uuid(),
            occurred_at: new Date().toISOString(),
            session_id: sessionId(),
            page_url: window.location.href,
            page_path: window.location.pathname,
            page_referrer: document.referrer || '',
            page: pageParams(),
            details: sanitizePayload(details || {}, 0)
        };
        var body = JSON.stringify(payload);

        try {
            if (navigator.sendBeacon) {
                var blob = new Blob([body], { type: 'application/json' });
                if (navigator.sendBeacon(TRACK_ENDPOINT, blob)) return;
            }
        } catch (error) {
            // Fall back to fetch.
        }

        try {
            fetch(TRACK_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: body,
                keepalive: true,
                credentials: 'same-origin'
            }).catch(function () {});
        } catch (error) {
            // Analytics must never block UX.
        }
    }

    function trackMetrikaGoal(goalName, goalParams) {
        if (!goalName || !isMetrikaEnabled || typeof window.ym !== 'function') return;
        window.ym(METRIKA_ID, 'reachGoal', normalizeEventName(goalName), Object.assign(pageParams(), goalParams || {}));
    }

    window.mospochinGetAttribution = function () {
        var attribution = readAttribution();
        return JSON.parse(JSON.stringify(attribution));
    };

    window.mospochinTrackEvent = function (eventName, eventParams) {
        var normalized = normalizeEventName(eventName);
        if (!normalized) return;
        sendEventToBackend(normalized, eventParams || {});
    };

    window.mospochinTrackGoal = function (goalName, goalParams) {
        var normalized = normalizeEventName(goalName);
        if (!normalized) return;
        var params = goalParams || {};
        sendEventToBackend(normalized, params);
        trackMetrikaGoal(normalized, params);
    };

    function initMetrika() {
        if (!isMetrikaEnabled) return;

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

    function hrefGroup(link) {
        var href = String(link.getAttribute('href') || '').toLowerCase();
        if (href.indexOf('tel:') === 0) return 'phone';
        if (href.indexOf('https://wa.me/') === 0 || href.indexOf('http://wa.me/') === 0 || href.indexOf('whatsapp') !== -1) return 'whatsapp';
        if (href.indexOf('tg://') === 0 || href.indexOf('telegram') !== -1) return 'telegram';
        if (href.indexOf('mailto:') === 0) return 'email';
        if (href.indexOf('#') === 0) return 'anchor';
        if (href.indexOf('/') === 0 || href.indexOf('.html') !== -1) return 'internal_link';
        return '';
    }

    function ensureCtaMetadata(element, fallbackGroup) {
        if (!element || !element.dataset) return;
        var group = element.dataset.ctaGroup || fallbackGroup || '';
        if (!group && element.matches && element.matches('button[type="submit"]')) group = 'form_submit';
        if (!group && element.matches && element.matches('a[href]')) group = hrefGroup(element);
        if (!group) return;
        if (!element.dataset.ctaGroup) element.dataset.ctaGroup = group;
        if (!element.dataset.ctaId) {
            fallbackCtaIndex += 1;
            element.dataset.ctaId = [pageSlug(), group, fallbackCtaIndex].join('_').replace(/[^a-z0-9_-]/gi, '_').toLowerCase();
        }
        if (!element.dataset.block) element.dataset.block = 'runtime_auto';
    }

    function ctaDetails(element, extra) {
        ensureCtaMetadata(element);
        return Object.assign({
            cta_id: element.dataset.ctaId || '',
            cta_group: element.dataset.ctaGroup || '',
            block: element.dataset.block || '',
            href: cleanText(element.getAttribute('href') || '', 220),
            text: cleanText(element.textContent || '', 120)
        }, extra || {});
    }

    function formDetails(form, extra) {
        return Object.assign({
            form_id: form.dataset.formId || '',
            form_context: form.dataset.formContext || '',
            form_class: cleanText(form.className || '', 160),
            action: cleanText(form.getAttribute('action') || '', 160),
            method: cleanText(form.getAttribute('method') || '', 20)
        }, extra || {});
    }

    function inferFormFromTarget(target) {
        if (!target || !target.closest) return null;
        return target.closest('form.telegram-form, form[data-form-id], form');
    }

    function trackFormOpen(form, extra) {
        if (!form || openedForms.has(form)) return;
        openedForms.add(form);
        window.mospochinTrackGoal('form_open', formDetails(form, extra));
    }

    function trackFormStart(form) {
        if (!form || startedForms.has(form)) return;
        startedForms.add(form);
        trackFormOpen(form, { reason: 'form_start' });
        window.mospochinTrackGoal('form_start', formDetails(form));
    }

    function initCtaViews() {
        var elements = Array.prototype.slice.call(document.querySelectorAll('[data-cta-id], a[href^="tel:"], a[href*="wa.me/"], a[href*="telegram"], a[href^="mailto:"], button[type="submit"]'));
        elements.forEach(function (element) {
            ensureCtaMetadata(element);
        });

        if (!('IntersectionObserver' in window)) {
            elements.slice(0, 80).forEach(function (element) {
                if (viewedCtas.has(element)) return;
                viewedCtas.add(element);
                window.mospochinTrackGoal('cta_view', ctaDetails(element, { observer: 'fallback' }));
            });
            return;
        }

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting || entry.intersectionRatio < 0.2) return;
                var element = entry.target;
                if (viewedCtas.has(element)) return;
                viewedCtas.add(element);
                window.mospochinTrackGoal('cta_view', ctaDetails(element, { intersection_ratio: String(entry.intersectionRatio) }));
                observer.unobserve(element);
            });
        }, { threshold: [0.2, 0.5, 0.8] });

        elements.forEach(function (element) { observer.observe(element); });
    }

    function initEventListeners() {
        document.addEventListener('click', function (event) {
            var cta = event.target.closest && event.target.closest('[data-cta-id], a[href], button[data-form-open], button[type="submit"]');
            if (!cta) return;
            ensureCtaMetadata(cta);
            window.mospochinTrackGoal('cta_click', ctaDetails(cta));

            var group = cta.dataset.ctaGroup || (cta.matches('a[href]') ? hrefGroup(cta) : '');
            var contactEvent = CONTACT_EVENTS[group];
            if (contactEvent) {
                window.mospochinTrackGoal(contactEvent, ctaDetails(cta, {
                    contact_type: group,
                    cta_text_length: cleanText(cta.textContent).length
                }));
            }

            if (cta.dataset && cta.dataset.formOpen) {
                window.mospochinTrackGoal('form_open', ctaDetails(cta, {
                    form_id: cta.dataset.formOpen,
                    reason: 'form_open_cta'
                }));
            }
        }, true);

        document.addEventListener('focusin', function (event) {
            var form = inferFormFromTarget(event.target);
            if (!form) return;
            trackFormStart(form);
        });

        document.addEventListener('input', function (event) {
            var form = inferFormFromTarget(event.target);
            if (!form) return;
            trackFormStart(form);
        }, true);

        document.addEventListener('invalid', function (event) {
            var form = inferFormFromTarget(event.target);
            if (!form) return;
            window.mospochinTrackGoal('form_validation_error', formDetails(form, {
                field: cleanText(event.target.name || event.target.id || event.target.tagName || '', 80),
                reason: 'browser_invalid'
            }));
        }, true);

        document.addEventListener('submit', function (event) {
            var form = inferFormFromTarget(event.target);
            if (!form) return;
            trackFormOpen(form, { reason: 'submit' });
            window.mospochinTrackGoal('form_submit_attempt', formDetails(form, {
                browser_valid: typeof form.checkValidity === 'function' ? String(form.checkValidity()) : 'unknown'
            }));
        }, true);
    }

    captureAttribution();
    initMetrika();

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function () {
            initEventListeners();
            initCtaViews();
        });
    } else {
        initEventListeners();
        initCtaViews();
    }
})();
