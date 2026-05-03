(function () {
    'use strict';

    var METRIKA_ID = '109024063';
    var isEnabled = /^\d+$/.test(String(METRIKA_ID));
    var startedForms = new WeakSet();

    function cleanText(value) {
        return (value || '').replace(/\s+/g, ' ').trim().slice(0, 160);
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
            page_type: pageType()
        }, extra || {});
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
            href: href,
            text: cleanText(link.textContent),
            contact_type: link.dataset.contactLink || goal.replace('_click', '')
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

    initMetrika();
})();
