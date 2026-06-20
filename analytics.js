(function () {
    'use strict';

    var METRIKA_ID = '109138661';
    var ATTRIBUTION_STORAGE_KEY = 'mospochin_attribution_v1';
    var SESSION_STORAGE_KEY = 'mospochin_session_v1';
    var ATTR_COOKIE_NAME = 'mospochin_attr_present';
    var ATTRIBUTION_TTL_MS = 30 * 24 * 60 * 60 * 1000;
    var SESSION_TTL_MS = 30 * 60 * 1000;
    var CTA_VIEW_RATIO = 0.5;
    var CTA_VIEW_DELAY_MS = 900;
    var EVENT_ENDPOINT = '/api/track-event';
    var CLEAN_TEXT_LIMIT = 160;

    var PROD_HOSTS = ['mospochin.ru', 'www.mospochin.ru'];
    var BLOCKED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0'];
    var TRACKING_KEYS = [
        'yclid',
        'utm_source',
        'utm_medium',
        'utm_campaign',
        'utm_content',
        'utm_term',
        'utm_service',
        'utm_landing',
        'utm_geo',
        'metrika_client_id'
    ];
    var ALLOWED_GOALS = [
        'phone_click',
        'whatsapp_click',
        'telegram_click',
        'email_click',
        'form_open',
        'form_start',
        'form_submit_attempt',
        'form_submit_success',
        'form_submit_error',
        'form_validation_error',
        'form_submit_blocked',
        'cta_view',
        'cta_click'
    ];

    var startedForms = new WeakSet();
    var openedForms = new WeakSet();
    var viewedCtas = new WeakSet();
    var ctaTimers = new WeakMap();
    var lastEventSentAt = new Map();

    function nowIso() {
        return new Date().toISOString();
    }

    function cleanText(value, limit) {
        return String(value || '')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, limit || CLEAN_TEXT_LIMIT);
    }

    function cleanParam(value, limit) {
        return cleanText(value, limit || 200);
    }

    function safeJsonParse(value, fallback) {
        try {
            return JSON.parse(value);
        } catch (error) {
            return fallback;
        }
    }

    function safeGetStorage(key) {
        try {
            return window.localStorage.getItem(key);
        } catch (error) {
            return null;
        }
    }

    function safeSetStorage(key, value) {
        try {
            window.localStorage.setItem(key, value);
        } catch (error) {
            // Ignore storage limits or restricted/private browsing modes.
        }
    }

    function safeRemoveStorage(key) {
        try {
            window.localStorage.removeItem(key);
        } catch (error) {
            // Ignore storage limits or restricted/private browsing modes.
        }
    }

    function isProductionHost() {
        return PROD_HOSTS.indexOf(window.location.hostname) !== -1;
    }

    function isBlockedHost() {
        var host = window.location.hostname;
        if (BLOCKED_HOSTS.indexOf(host) !== -1) return true;
        return /(?:^|[.-])(localhost|staging|preview|test|dev)(?:[.-]|$)/i.test(host) || host.indexOf('iframe-tasks') !== -1;
    }

    function isMetrikaIdEnabled() {
        return /^\d+$/.test(String(METRIKA_ID));
    }

    function looksLikeAutomation() {
        var ua = navigator.userAgent || '';
        return navigator.webdriver === true || /HeadlessChrome|PhantomJS|SlimerJS|Selenium|Playwright|Puppeteer|curl|wget|python-requests|bot|spider|crawler/i.test(ua);
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

    function inferPageType(path) {
        if (path.indexOf('bytovaya') !== -1 || /holodilniki|stiralnye|posudomoyki|plity|microwaves|water-heaters|kompyutery|routery/.test(path)) {
            return 'b2c';
        }
        return 'b2b';
    }

    function inferEquipment(path) {
        if (/pishevarochnyj|pishevarochnye|kotl/i.test(path)) return 'pishevarochnyj_kotel';
        if (/parokonvektomat/i.test(path)) return 'parokonvektomat';
        if (/microwaves|svch/i.test(path)) return 'svch';
        if (/holodil/i.test(path)) return 'holodilnoe_oborudovanie';
        if (/posudom/i.test(path)) return 'posudomoechnaya_mashina';
        if (/plity|pechi/i.test(path)) return 'plity_pechi';
        return '';
    }

    function inferBrand(path) {
        var brands = ['rational', 'unox', 'abat', 'kpem', 'apach', 'atesy', 'iterma', 'mkn', 'alphatech', 'convotherm', 'electrolux', 'lainox'];
        for (var i = 0; i < brands.length; i += 1) {
            if (path.toLowerCase().indexOf(brands[i]) !== -1) return brands[i];
        }
        return '';
    }

    function inferPageIntent(path) {
        var lower = path.toLowerCase();
        if (/kod-oshibki|e\d{2}|af\d{2}|h20|rational-e9|unox-af/i.test(lower)) return 'error_code';
        if (/ne-greet|dolgo-greet|techet|vybivaet|ne-vklyuchaetsya|net-para|suhoy-hod/i.test(lower)) return 'symptom';
        if (/rational|unox|abat|kpem|apach|atesy|iterma|convotherm|electrolux|lainox/i.test(lower)) return 'brand';
        if (/promo|srochn/i.test(lower)) return 'urgent';
        if (/restorana|stolov|b2b/i.test(lower)) return 'b2b';
        if (/pishevarochnye-kotly|parokonvektomaty\.html|uslugi|index/i.test(lower)) return 'hub';
        return 'service';
    }

    function getPageContext() {
        var body = document.body || document.documentElement;
        var path = window.location.pathname;
        return {
            page: path,
            page_path: path,
            page_slug: pageSlug(),
            page_type: body?.dataset?.pageType || inferPageType(path),
            page_intent: body?.dataset?.pageIntent || inferPageIntent(path),
            equipment: body?.dataset?.equipment || inferEquipment(path),
            brand: body?.dataset?.brand || inferBrand(path),
            service: body?.dataset?.service || 'repair',
            commercial_segment: body?.dataset?.commercialSegment || (inferPageType(path) === 'b2b' ? 'b2b_kitchen' : 'b2c_home')
        };
    }

    function randomId(prefix) {
        var bytes = new Uint8Array(16);
        if (window.crypto && window.crypto.getRandomValues) {
            window.crypto.getRandomValues(bytes);
        } else {
            for (var i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
        }
        var id = Array.from(bytes).map(function (byte) {
            return byte.toString(16).padStart(2, '0');
        }).join('');
        return prefix + '_' + id;
    }

    function readStoredAttribution() {
        var data = safeJsonParse(safeGetStorage(ATTRIBUTION_STORAGE_KEY), null);
        if (!data || typeof data !== 'object') return null;
        var updatedAt = Date.parse(data.updated_at || data.last_seen_at || data.last_touch?.captured_at || '');
        if (Number.isFinite(updatedAt) && Date.now() - updatedAt > ATTRIBUTION_TTL_MS) {
            safeRemoveStorage(ATTRIBUTION_STORAGE_KEY);
            return null;
        }
        return data;
    }

    function collectTrackingFromUrl() {
        var url = new URL(window.location.href);
        var out = {};
        TRACKING_KEYS.forEach(function (key) {
            var value = cleanParam(url.searchParams.get(key) || '', 240);
            if (value) out[key] = value;
        });
        return out;
    }

    function saveAttribution() {
        var existing = readStoredAttribution() || {};
        var fromUrl = collectTrackingFromUrl();
        var hasNewTracking = Object.keys(fromUrl).length > 0;
        var refHost = isExternalReferrer(document.referrer) ? referrerHost(document.referrer) : '';
        var firstLanding = existing.first_landing_page || existing.first_touch?.landing_page || window.location.pathname;
        var currentTouch = Object.assign({
            landing_page: window.location.pathname,
            page_url: window.location.href,
            referrer_host: refHost || existing.last_referrer_host || '',
            captured_at: nowIso()
        }, fromUrl);

        var next = Object.assign({}, existing, fromUrl, {
            first_landing_page: firstLanding,
            current_page: window.location.href,
            current_path: window.location.pathname,
            first_referrer: existing.first_referrer || document.referrer || '',
            last_referrer: document.referrer || existing.last_referrer || '',
            first_referrer_host: existing.first_referrer_host || refHost || '',
            last_referrer_host: refHost || existing.last_referrer_host || '',
            first_seen_at: existing.first_seen_at || nowIso(),
            updated_at: nowIso(),
            last_seen_at: nowIso(),
            first_touch: existing.first_touch || currentTouch,
            last_touch: hasNewTracking || refHost ? currentTouch : (existing.last_touch || currentTouch)
        });

        safeSetStorage(ATTRIBUTION_STORAGE_KEY, JSON.stringify(next));
        try {
            document.cookie = ATTR_COOKIE_NAME + '=1; path=/; max-age=' + String(30 * 24 * 60 * 60) + '; SameSite=Lax';
        } catch (error) {
            // Ignore cookie restrictions.
        }
        return next;
    }

    function getAttribution() {
        return readStoredAttribution() || saveAttribution() || {};
    }

    function setMetrikaClientId(clientId) {
        var safeClientId = cleanParam(clientId || '', 120);
        if (!safeClientId) return;
        var attribution = getAttribution();
        attribution.metrika_client_id = safeClientId;
        if (attribution.first_touch) attribution.first_touch.metrika_client_id = safeClientId;
        if (attribution.last_touch) attribution.last_touch.metrika_client_id = safeClientId;
        attribution.updated_at = nowIso();
        safeSetStorage(ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution));
    }

    function readSession() {
        var session = safeJsonParse(safeGetStorage(SESSION_STORAGE_KEY), null);
        var now = Date.now();
        if (!session || typeof session !== 'object' || !session.session_id) return null;
        var lastSeen = Date.parse(session.last_seen_at || '');
        if (!Number.isFinite(lastSeen) || now - lastSeen > SESSION_TTL_MS) return null;
        return session;
    }

    function getSession() {
        var session = readSession();
        if (!session) {
            session = {
                session_id: randomId('mos_session'),
                started_at: nowIso(),
                last_seen_at: nowIso(),
                landing_path: window.location.pathname,
                page_count: 0
            };
        }
        session.last_seen_at = nowIso();
        session.current_path = window.location.pathname;
        session.page_count = Number(session.page_count || 0) + 1;
        safeSetStorage(SESSION_STORAGE_KEY, JSON.stringify(session));
        return session;
    }

    function attributionEventParams() {
        var attribution = getAttribution();
        var touch = attribution.last_touch || attribution.first_touch || {};
        var params = {
            landing_page: attribution.first_landing_page || touch.landing_page || '',
            referrer_host: touch.referrer_host || attribution.last_referrer_host || '',
            has_yclid: touch.yclid || attribution.yclid ? 'yes' : 'no'
        };

        TRACKING_KEYS.forEach(function (key) {
            var value = touch[key] || attribution[key] || '';
            if (value) params[key] = cleanParam(value, 240);
        });
        return params;
    }

    function shouldTrackDomEvent(domEvent) {
        if (!window.MOSPOCHIN_ANALYTICS_ENABLED) return false;
        if (looksLikeAutomation()) return false;
        if (domEvent && domEvent.isTrusted === false) return false;
        return true;
    }

    function normalizeEventPayload(eventName, extra) {
        var session = getSession();
        return Object.assign({}, getPageContext(), attributionEventParams(), {
            event: eventName,
            goal: eventName,
            page_url: window.location.href,
            title: document.title,
            session_id: session.session_id,
            session_landing_path: session.landing_path,
            session_started_at: session.started_at,
            quality: looksLikeAutomation() ? 'suspicious' : 'human_candidate'
        }, extra || {});
    }

    function eventDedupKey(eventName, payload) {
        return [
            eventName,
            payload.page_path || '',
            payload.href || '',
            payload.cta_id || '',
            payload.form_id || '',
            payload.reason || ''
        ].join('|');
    }

    function shouldRateLimit(eventName, payload) {
        var windowMs = eventName === 'cta_view' ? 15 * 60 * 1000 : 500;
        if (/^(phone_click|whatsapp_click|telegram_click|email_click)$/.test(eventName)) windowMs = 30 * 1000;
        if (/^(form_open|form_start)$/.test(eventName)) windowMs = 15 * 60 * 1000;
        var key = eventDedupKey(eventName, payload);
        var now = Date.now();
        var previous = lastEventSentAt.get(key) || 0;
        if (now - previous < windowMs) return true;
        lastEventSentAt.set(key, now);
        return false;
    }

    function sendLocalEvent(payload) {
        if (!window.MOSPOCHIN_ANALYTICS_ENABLED) return;
        var body = JSON.stringify(payload);
        try {
            if (navigator.sendBeacon) {
                var blob = new Blob([body], { type: 'application/json' });
                if (navigator.sendBeacon(EVENT_ENDPOINT, blob)) return;
            }
        } catch (error) {
            // Fallback to fetch below.
        }

        try {
            fetch(EVENT_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: body,
                keepalive: true,
                credentials: 'same-origin'
            }).catch(function () {});
        } catch (error) {
            // Ignore analytics transport errors.
        }
    }

    function reachGoal(eventName, extra, domEvent) {
        if (ALLOWED_GOALS.indexOf(eventName) === -1) return;
        if (!shouldTrackDomEvent(domEvent)) return;
        var payload = normalizeEventPayload(eventName, extra || {});
        if (shouldRateLimit(eventName, payload)) return;

        try {
            if (isMetrikaIdEnabled() && typeof window.ym === 'function') {
                window.ym(METRIKA_ID, 'reachGoal', eventName, payload);
            }
        } catch (error) {
            // Ignore Metrika transport errors.
        }

        sendLocalEvent(payload);
        try {
            window.dispatchEvent(new CustomEvent('mospochin:analytics-event', { detail: payload }));
        } catch (error) {
            // CustomEvent may be unavailable in very old browsers.
        }
    }

    function initMetrika() {
        if (!window.MOSPOCHIN_ANALYTICS_ENABLED || !isMetrikaIdEnabled()) return;

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

    function getLinkType(link) {
        var href = String(link.getAttribute('href') || '').toLowerCase();
        var dataContact = String(link.dataset.contactLink || '').toLowerCase();
        if (href.indexOf('tel:') === 0 || dataContact === 'phone') return 'phone_click';
        if (href.indexOf('wa.me') !== -1 || href.indexOf('whatsapp') !== -1 || dataContact === 'whatsapp') return 'whatsapp_click';
        if (href.indexOf('tg://') === 0 || href.indexOf('t.me') !== -1 || href.indexOf('telegram') !== -1 || dataContact === 'telegram') return 'telegram_click';
        if (href.indexOf('mailto:') === 0 || dataContact === 'email') return 'email_click';
        return '';
    }

    function closestBlock(el) {
        var block = el.closest && el.closest('[data-block], [data-slot], section, header, footer');
        if (!block) return '';
        return block.dataset.block || block.dataset.slot || block.id || block.getAttribute('aria-label') || block.tagName.toLowerCase();
    }

    function safeContactHref(rawHref) {
        var href = cleanText(rawHref || '', 300);
        if (!href) return '';
        if (/^tel:/i.test(href)) return 'tel:[redacted]';
        if (/^mailto:/i.test(href)) return 'mailto:[redacted]';
        try {
            var parsed = new URL(href, window.location.origin);
            var host = parsed.hostname.toLowerCase();
            var path = parsed.pathname.replace(/\d{5,}/g, '[id_redacted]');
            return (parsed.protocol + '//' + host + path).slice(0, 180);
        } catch (error) {
            return '';
        }
    }

    function redactContactText(value) {
        return cleanText(value || '', 160)
            .replace(/(?:\+?7|8)?[\s()\-.]*\d{3}[\s()\-.]*\d{3}[\s()\-.]*\d{2}[\s()\-.]*\d{2}/g, '[phone_redacted]')
            .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[email_redacted]');
    }

    function contactPayload(link) {
        var text = redactContactText(link.textContent || '');
        return {
            href: safeContactHref(link.getAttribute('href') || ''),
            contact_type: link.dataset.contactLink || getLinkType(link).replace('_click', ''),
            text: text.slice(0, 120),
            text_length: text.length,
            cta_id: link.dataset.ctaId || link.id || '',
            cta_group: link.dataset.ctaGroup || '',
            block: closestBlock(link)
        };
    }

    function trackContactClick(link, domEvent) {
        var goal = getLinkType(link);
        if (!goal) return;
        var payload = contactPayload(link);
        reachGoal('cta_click', Object.assign({}, payload, { contact_goal: goal }), domEvent);
        reachGoal(goal, payload, domEvent);
    }

    function formPayload(form, extra) {
        return Object.assign({
            form_id: form.id || form.dataset.formContext || '',
            form_context: form.dataset.formContext || '',
            form_class: cleanText(form.className || '', 120),
            cta_id: form.dataset.ctaId || form.id || form.dataset.formContext || '',
            cta_group: form.dataset.ctaGroup || 'lead_form',
            block: form.dataset.block || closestBlock(form)
        }, extra || {});
    }

    function trackFormOpen(form, domEvent) {
        if (openedForms.has(form)) return;
        openedForms.add(form);
        reachGoal('form_open', formPayload(form), domEvent);
    }

    function trackFormStart(form, domEvent) {
        if (startedForms.has(form)) return;
        startedForms.add(form);
        reachGoal('form_start', formPayload(form), domEvent);
    }

    function initCtaVisibility() {
        if (!window.IntersectionObserver || !window.MOSPOCHIN_ANALYTICS_ENABLED) return;
        var elements = Array.prototype.slice.call(document.querySelectorAll('a[href^="tel:"], a[href*="wa.me"], a[href*="telegram"], a[href*="t.me"], a[data-contact-link], button[data-contact-link], form.telegram-form'));
        if (!elements.length) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                var el = entry.target;
                if (viewedCtas.has(el)) return;
                if (!entry.isIntersecting || entry.intersectionRatio < CTA_VIEW_RATIO) {
                    var timer = ctaTimers.get(el);
                    if (timer) window.clearTimeout(timer);
                    ctaTimers.delete(el);
                    return;
                }
                if (ctaTimers.has(el)) return;
                var timerId = window.setTimeout(function () {
                    if (viewedCtas.has(el)) return;
                    viewedCtas.add(el);
                    var isForm = el.matches && el.matches('form.telegram-form');
                    var payload = isForm ? formPayload(el) : contactPayload(el);
                    payload.cta_type = isForm ? 'form' : (getLinkType(el).replace('_click', '') || 'contact');
                    reachGoal('cta_view', payload);
                }, CTA_VIEW_DELAY_MS);
                ctaTimers.set(el, timerId);
            });
        }, {
            threshold: [0, CTA_VIEW_RATIO, 0.75]
        });

        elements.forEach(function (el) { observer.observe(el); });
    }

    window.MOSPOCHIN_ANALYTICS_ENABLED = isProductionHost() && !isBlockedHost();
    window.MOSPOCHIN_METRIKA_COUNTER_ID = METRIKA_ID;
    window.MospochinAnalytics = Object.assign(window.MospochinAnalytics || {}, {
        isEnabled: function () { return Boolean(window.MOSPOCHIN_ANALYTICS_ENABLED); },
        getAttribution: getAttribution,
        saveAttribution: saveAttribution,
        getSession: getSession,
        reachGoal: reachGoal,
        trackEvent: reachGoal,
        shouldTrackDomEvent: shouldTrackDomEvent,
        pageContext: getPageContext
    });

    window.mospochinGetAttribution = function () {
        var attribution = getAttribution();
        return JSON.parse(JSON.stringify(attribution));
    };

    window.mospochinGetSession = function () {
        var session = getSession();
        return JSON.parse(JSON.stringify(session));
    };

    window.mospochinTrackGoal = function (goalName, goalParams, domEvent) {
        reachGoal(goalName, goalParams || {}, domEvent);
    };

    document.addEventListener('click', function (event) {
        var link = event.target.closest && event.target.closest('a[href], button[data-contact-link]');
        if (link) trackContactClick(link, event);
    }, true);

    document.addEventListener('focusin', function (event) {
        var form = event.target.closest && event.target.closest('form.telegram-form, form[data-telegram-form], form[data-contact-form]');
        if (!form) return;
        trackFormOpen(form, event);
        trackFormStart(form, event);
    });

    document.addEventListener('submit', function (event) {
        var form = event.target.closest && event.target.closest('form.telegram-form, form[data-telegram-form], form[data-contact-form]');
        if (!form) return;
        reachGoal('form_submit_attempt', formPayload(form), event);
    }, true);

    saveAttribution();
    getSession();
    initMetrika();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCtaVisibility);
    } else {
        initCtaVisibility();
    }
})();
