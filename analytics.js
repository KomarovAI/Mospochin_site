(function () {
    'use strict';

    var METRIKA_ID = '109138661';
    var isEnabled = /^\d+$/.test(String(METRIKA_ID));
    var startedForms = new WeakSet();
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

    document.addEventListener('submit', function (event) {
        var form = event.target.closest && event.target.closest('form.telegram-form');
        if (!form) return;

        window.mospochinTrackGoal('form_submit_attempt', {
            form_class: form.className
        });
    }, true);

    captureAttribution();
    initMetrika();
})();
