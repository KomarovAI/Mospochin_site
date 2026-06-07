# Unified diff — conversion P0 runtime attribution patch

```diff
--- /tmp/analytics.js.before	2026-06-07 09:14:34.848652335 +0000
+++ analytics.js	2026-06-07 09:14:36.725935277 +0000
@@ -2,6 +2,7 @@
     'use strict';

     var METRIKA_ID = '109138661';
+    var PRODUCTION_HOSTS = ['mospochin.ru', 'www.mospochin.ru'];
     var isEnabled = /^\d+$/.test(String(METRIKA_ID));
     var startedForms = new WeakSet();
     var ATTRIBUTION_STORAGE_KEY = 'mospochin_attribution_v1';
@@ -11,10 +12,32 @@
         'utm_campaign',
         'utm_content',
         'utm_term',
+        'utm_service',
+        'utm_landing',
         'metrika_client_id',
-        'yclid'
+        'yclid',
+        'gclid'
     ];

+    function isProductionHost() {
+        return PRODUCTION_HOSTS.indexOf(window.location.hostname) !== -1;
+    }
+
+    function analyticsEnabled() {
+        return isEnabled && isProductionHost();
+    }
+
+    function configureRuntimeFlags() {
+        var isProduction = isProductionHost();
+        window.MOSPOCHIN_RUNTIME = window.MOSPOCHIN_RUNTIME || {};
+        window.__MOSPOCHIN_RUNTIME__ = window.__MOSPOCHIN_RUNTIME__ || {};
+
+        window.MOSPOCHIN_RUNTIME.isProduction = isProduction;
+        window.MOSPOCHIN_RUNTIME.analyticsEnabled = isProduction && isEnabled;
+        window.__MOSPOCHIN_RUNTIME__.isProduction = isProduction;
+        window.__MOSPOCHIN_RUNTIME__.analyticsEnabled = isProduction && isEnabled;
+    }
+
     function cleanText(value) {
         return (value || '').replace(/\s+/g, ' ').trim().slice(0, 160);
     }
@@ -63,6 +86,10 @@
         var search = new URLSearchParams(window.location.search);
         var touch = {
             landing_page: window.location.pathname,
+            page_url: window.location.href,
+            page_path: window.location.pathname,
+            page_title: cleanText(document.title),
+            referrer: cleanText(document.referrer || ''),
             referrer_host: isExternalReferrer(document.referrer) ? referrerHost(document.referrer) : ''
         };
         var hasTracking = false;
@@ -131,11 +158,13 @@
         var touch = attribution.last_touch || attribution.first_touch || {};
         var result = {
             landing_page: touch.landing_page || '',
+            page_path: touch.page_path || touch.landing_page || '',
             referrer_host: touch.referrer_host || '',
-            has_yclid: touch.yclid ? 'yes' : 'no'
+            has_yclid: touch.yclid ? 'yes' : 'no',
+            has_gclid: touch.gclid ? 'yes' : 'no'
         };

-        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'metrika_client_id'].forEach(function (name) {
+        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_service', 'utm_landing', 'metrika_client_id'].forEach(function (name) {
             if (touch[name]) result[name] = touch[name];
         });

@@ -145,10 +174,17 @@
     window.mospochinGetAttribution = function () {
         var attribution = readAttribution();
         return JSON.parse(JSON.stringify(attribution));
-    }
+    };
+
+    window.mospochinIsProductionHost = isProductionHost;

     function initMetrika() {
-        if (!isEnabled) return;
+        if (!analyticsEnabled()) {
+            if (isEnabled && window.console && console.info) {
+                console.info('[analytics] disabled on non-production host:', window.location.hostname);
+            }
+            return;
+        }

         (function (m, e, t, r, i, k, a) {
             m[i] = m[i] || function () {
@@ -182,7 +218,7 @@
     }

     window.mospochinTrackGoal = function (goalName, goalParams) {
-        if (!goalName || !isEnabled || typeof window.ym !== 'function') return;
+        if (!goalName || !analyticsEnabled() || typeof window.ym !== 'function') return;
         window.ym(METRIKA_ID, 'reachGoal', goalName, params(goalParams));
     };

@@ -230,6 +266,7 @@
         });
     }, true);

+    configureRuntimeFlags();
     captureAttribution();
     initMetrika();
 })();
--- /tmp/telegram-form.js.before	2026-06-07 09:14:34.863560535 +0000
+++ telegram-form.js	2026-06-07 09:14:36.726589267 +0000
@@ -5,7 +5,23 @@
 const FORM_RATE_LIMIT_MS = 60000;
 const FORM_MAX_PROBLEM_LENGTH = 500;
 const TELEGRAM_PAGE_METADATA_PATH = '/data/page-metadata.json';
-const FORM_BASE_FIELDS = new Set(['name', 'phone', 'type', 'problem', 'website', 'consent']);
+const ATTRIBUTION_FIELD_NAMES = [
+    'page_url',
+    'page_path',
+    'page_title',
+    'referrer',
+    'utm_source',
+    'utm_medium',
+    'utm_campaign',
+    'utm_content',
+    'utm_term',
+    'utm_service',
+    'utm_landing',
+    'yclid',
+    'gclid',
+    'metrika_client_id'
+];
+const FORM_BASE_FIELDS = new Set(['name', 'phone', 'type', 'problem', 'website', 'consent', ...ATTRIBUTION_FIELD_NAMES]);

 let runtimeConfigPromise = null;
 let pageMetadataPromise = null;
@@ -91,6 +107,58 @@
     return 'Общий сайт';
 }

+function cleanAttributionValue(value, maxLength = 500) {
+    return String(value || '').replace(/\s+/g, ' ').trim().slice(0, maxLength);
+}
+
+function getQueryParam(name) {
+    try {
+        return new URLSearchParams(window.location.search).get(name) || '';
+    } catch {
+        return '';
+    }
+}
+
+function getCurrentAttributionFields() {
+    const storedTouch = window.mospochinGetAttribution?.()?.last_touch || window.mospochinGetAttribution?.()?.first_touch || {};
+    const fields = {
+        page_url: window.location.href,
+        page_path: window.location.pathname,
+        page_title: document.title,
+        referrer: document.referrer || ''
+    };
+
+    for (const name of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_service', 'utm_landing', 'yclid', 'gclid']) {
+        fields[name] = getQueryParam(name) || storedTouch[name] || '';
+    }
+
+    fields.metrika_client_id = storedTouch.metrika_client_id || '';
+
+    return Object.fromEntries(
+        ATTRIBUTION_FIELD_NAMES.map(name => [name, cleanAttributionValue(fields[name], name === 'page_url' || name === 'referrer' ? 800 : 240)])
+    );
+}
+
+function ensureAttributionFields(form) {
+    for (const name of ATTRIBUTION_FIELD_NAMES) {
+        if (form.querySelector(`[name="${name}"]`)) continue;
+        const input = document.createElement('input');
+        input.type = 'hidden';
+        input.name = name;
+        input.dataset.autoAttribution = '1';
+        form.append(input);
+    }
+}
+
+function fillAttributionFields(form) {
+    const fields = getCurrentAttributionFields();
+    for (const [name, value] of Object.entries(fields)) {
+        const field = form.querySelector(`[name="${name}"]`);
+        if (field) field.value = value;
+    }
+    return fields;
+}
+
 function trackFormGoal(goalName, form, extra = {}) {
     window.mospochinTrackGoal?.(goalName, {
         form_context: form.dataset.formContext?.trim() || '',
@@ -99,10 +167,18 @@
     });
 }

-function getAttributionSnapshot() {
+function getAttributionSnapshot(currentFields = null) {
     const attribution = window.mospochinGetAttribution?.();
-    if (!attribution || typeof attribution !== 'object') return null;
-    return attribution;
+    const snapshot = attribution && typeof attribution === 'object' ? JSON.parse(JSON.stringify(attribution)) : {};
+    const touch = currentFields || getCurrentAttributionFields();
+
+    if (!snapshot.first_touch) snapshot.first_touch = touch;
+    snapshot.last_touch = {
+        ...(snapshot.last_touch || snapshot.first_touch || {}),
+        ...touch
+    };
+
+    return snapshot;
 }

 function collectExtraFields(form) {
@@ -227,6 +303,8 @@
     form.dataset.telegramEnhanced = '1';
     form.dataset.startedAt = String(Date.now());
     form.classList.add('telegram-form-enhanced');
+    ensureAttributionFields(form);
+    fillAttributionFields(form);

     if (!form.querySelector('[name="website"]')) {
         const honeypot = document.createElement('input');
@@ -277,6 +355,7 @@
             btn.disabled = true;
             btn.innerHTML = '<i class="ri-loader-4-line mr-2"></i>Отправляю...';

+            const currentAttributionFields = fillAttributionFields(form);
             const honeypotValue = form.querySelector('[name="website"]')?.value.trim() || '';
             const consentChecked = Boolean(form.querySelector('[name="consent"]')?.checked);
             const extraFields = collectExtraFields(form);
@@ -287,7 +366,7 @@
                 problem: buildProblemValue(form, extraFields),
                 formContext: form.dataset.formContext?.trim() || '',
                 extraFields,
-                attribution: getAttributionSnapshot(),
+                attribution: getAttributionSnapshot(currentAttributionFields),
                 website: honeypotValue
             };

--- /tmp/telegram-api.mjs.before	2026-06-07 09:14:34.878224907 +0000
+++ server/telegram-api.mjs	2026-06-07 09:14:36.727525769 +0000
@@ -31,7 +31,7 @@
 const MAX_NAME_LENGTH = 120;
 const MAX_TYPE_LENGTH = 200;
 const MAX_CONTEXT_LENGTH = 120;
-const MAX_EXTRA_FIELDS = 6;
+const MAX_EXTRA_FIELDS = 10;
 const MAX_EXTRA_FIELD_LENGTH = 200;

 const ipRateLimit = new Map();
@@ -375,14 +375,21 @@
     if (!touch || typeof touch !== 'object' || Array.isArray(touch)) return null;
     const allowed = [
       'landing_page',
+      'page_url',
+      'page_path',
+      'page_title',
+      'referrer',
       'referrer_host',
       'utm_source',
       'utm_medium',
       'utm_campaign',
       'utm_content',
       'utm_term',
+      'utm_service',
+      'utm_landing',
       'metrika_client_id',
       'yclid',
+      'gclid',
       'captured_at',
     ];
     const result = {};
@@ -411,7 +418,11 @@

 function formatExtraFieldLabel(name) {
   const labels = {
+    address: 'Адрес/район',
+    business_type: 'Формат кухни',
     district: 'Район',
+    quantity: 'Количество',
+    equipment_model: 'Модель оборудования',
   };

   return labels[name] || name.replace(/[_-]+/g, ' ');
@@ -435,16 +446,25 @@
   if (submission.attribution?.last_touch) {
     const touch = submission.attribution.last_touch;
     lines.push('');
+    lines.push('Источник заявки:');
+    if (touch.page_path || touch.landing_page) lines.push(`page: ${touch.page_path || touch.landing_page}`);
+    if (touch.page_url) lines.push(`url: ${touch.page_url}`);
+    if (touch.page_title) lines.push(`title: ${touch.page_title}`);
+    if (touch.referrer) lines.push(`referrer: ${touch.referrer}`);
+    if (touch.referrer_host) lines.push(`referrer_host: ${touch.referrer_host}`);
+
+    lines.push('');
     lines.push('Рекламная атрибуция:');
     if (touch.utm_source) lines.push(`utm_source: ${touch.utm_source}`);
     if (touch.utm_medium) lines.push(`utm_medium: ${touch.utm_medium}`);
     if (touch.utm_campaign) lines.push(`utm_campaign: ${touch.utm_campaign}`);
     if (touch.utm_content) lines.push(`utm_content: ${touch.utm_content}`);
     if (touch.utm_term) lines.push(`utm_term: ${touch.utm_term}`);
+    if (touch.utm_service) lines.push(`utm_service: ${touch.utm_service}`);
+    if (touch.utm_landing) lines.push(`utm_landing: ${touch.utm_landing}`);
     if (touch.yclid) lines.push(`yclid: ${touch.yclid}`);
+    if (touch.gclid) lines.push(`gclid: ${touch.gclid}`);
     if (touch.metrika_client_id) lines.push(`metrika_client_id: ${touch.metrika_client_id}`);
-    if (touch.landing_page) lines.push(`Вход: ${touch.landing_page}`);
-    if (touch.referrer_host) lines.push(`Реферер: ${touch.referrer_host}`);
   }

   for (const [name, value] of Object.entries(submission.extraFields)) {
```
