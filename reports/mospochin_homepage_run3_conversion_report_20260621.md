# MosPochin — Homepage Conversion Run 3 Report

Date: 2026-06-21
Base package: `mospochin_tracking_cta_patch_20260621.zip`
Output: `mospochin_homepage_run3_conversion_pack_20260621.zip`
Mode: site-only, tracking-safe, no Yandex Direct apply changes

## Scope

Completed the next run after the tracking/CTA infrastructure patch: homepage conversion update.

Main target file:

- `index.html`
- `src/pages/index/sections/004-hero-remont-restorannogo-oborudovaniya-v-moskve-bez-.html`
- `src/pages/index/sections/005-section-esli-uzhe-znaete-simptom-perehodite-srazu.html`
- `src/pages/index/sections/019-lead-form-ostav-te-zayavku-na-remont.html`
- `src/pages/index/sections/021-mobile-contact-mobil-nye-kontaktnye-elementy.html`
- `src/pages/index/head.html`
- `src/pages/index/page.json`
- `data/page-metadata.json`
- generated registry/map/digest files

## What changed

### Hero / first screen

- Replaced the main H1 with: `Ремонт оборудования для ресторанов, кафе и столовых в Москве и области`.
- Rewrote the subhead around professional kitchen equipment for restaurants, cafes, canteens, and food-service facilities.
- Added three above-the-fold CTA paths:
  - phone: `index_phone_hero`
  - WhatsApp: `index_whatsapp_hero`
  - form/open repair description: `index_form_hero`
- Linked hero form CTA to `#request` and `data-form-open="index_quick_repair_form"`.
- Removed/softened overly aggressive unverified hero claims and shifted the copy toward diagnostic clarity.

### Service cards / directions

Replaced the short route-strip with a full `Что ремонтируем` conversion block:

- Пароконвектоматы → `parokonvektomaty.html`
- Пищеварочные / варочные котлы → `pishevarochnye-kotly.html`
- Плиты и печи → `plity-pechi.html`
- Посудомоечные машины → `posudomoechnye-mashiny.html`
- Холодильное оборудование → `holodilnoe-oborudovanie.html`
- СВЧ / микроволновые печи → `microwaves.html`

All service tiles have stable `data-cta-id`, `data-cta-group="internal_link"`, and `data-block="service_cards"`.

### WhatsApp photo bridge

Added dedicated `whatsapp-diagnostic-bridge` block with:

- panel/error photo request;
- nameplate/model photo request;
- short behavior video request;
- address and kitchen restart urgency request;
- WhatsApp CTA `index_whatsapp_photo_bridge` with `data-block="whatsapp_diagnostic_bridge"`.

### Form and mobile sticky

- Updated homepage form ID to `index_quick_repair_form`.
- Updated form context to `index_quick_repair`.
- Added `Пищеварочный / варочный котёл` to the homepage equipment select.
- Added `mobile-sticky-cta` class to the mobile sticky block.
- Marked mobile phone/WhatsApp CTA with `data-block="mobile_sticky"`.

### Metadata and generated files

- Updated index title and description in `src/pages/index/head.html`.
- Updated `data/page-metadata.json` for `index.html`.
- Rebuilt root HTML from source snippets.
- Regenerated FAQ registry, AI/project maps, AI component map, source complexity, AI digest, and deploy manifest.

## Structural checks

- Root HTML pages: 63
- `index.html` H1 count: 1
- `index.html` `data-cta-id` count: 29
- `index.html` has `data-page-slug="index"`: yes
- `index_phone_hero`: present
- `index_whatsapp_hero`: present
- `index_form_hero`: present
- `index_service_cooking_kettles`: present
- `index_whatsapp_photo_bridge`: present
- `mobile-sticky-cta`: present
- `index_quick_repair_form`: present

## Validation results

Passed:

```text
npm run verify:fast
npm run lint
npm run predeploy:check
npm audit --audit-level=moderate
node --check analytics.js
node --check telegram-form.js
node --check server/telegram-api.mjs
local /api/track-event smoke
```

`npm audit`: 0 vulnerabilities.

`predeploy:check`: PASS.

Warnings remaining from previous package:

```text
[data/page-metadata.json] remont-pishevarochnyh-kotlov-apach.html: title longer than 75 chars
[data/page-metadata.json] remont-pishevarochnyh-kotlov-atesy.html: title longer than 75 chars
[data/page-metadata.json] remont-pishevarochnyh-kotlov-iterma.html: title longer than 75 chars
```

These are non-blocking metadata warnings on existing kettle brand pages, not introduced by this homepage run.

## Local smoke note

`POST /api/track-event` returned `{"ok":true}` for a homepage CTA click payload. Because the smoke test used localhost with `Origin: https://mospochin.ru`, the logged event had `origin_status="cross_origin"` and `is_decision_event=false`. This is expected for local smoke and must not be interpreted as production decision data.

## Not done in this run

- No Yandex Direct apply changes.
- No bid changes.
- No mass negative-keyword changes.
- No parokonvektomat content run yet.
- No full visual screenshot audit; Playwright Chromium is still required in the execution environment.

## Next recommended run

Run 4: parokonvektomat/error-intent UX and content reinforcement:

- `parokonvektomaty.html`
- `parokonvektomat-kod-oshibki.html`
- `parokonvektomat-e02-e07-e10.html`
- `parokonvektomat-convotherm.html`
- brand/symptom/error CTA and form consistency
