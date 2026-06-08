# SITE CONVERSION APPLY — 2026-06-07

Applied changes for the MosPochin site conversion pass.

## Done

- Strengthened P0 `parokonvektomaty.html` first screen for Moscow B2B intent: restaurants, cafes, столовые, urgent repair, phone/WhatsApp/form CTA.
- Added visible quick-form detail fields in the P0 mobile hero: brand/model and symptom/error code, while preserving hidden defaults required by conversion guardrails.
- Added symptom-to-lead CTA bridge on P0 so traffic with symptoms has a direct path to phone/request.
- Added repair-bridge blocks on error pages:
  - `parokonvektomat-kod-oshibki.html`
  - `parokonvektomat-e02-e07-e10.html`
  - `parokonvektomat-rational-e9.html`
- Added light phone-first strengthen blocks on protected/winner pages without changing their URL/indexing intent:
  - `parokonvektomaty-promo.html`
  - `parokonvektomat-unox-af02-af08.html`
- Fixed broken WhatsApp encoded URLs containing `%D0%План...` in parokonvektomat cluster source sections.
- Added `ym_client_id` alias alongside existing `metrika_client_id` in `analytics.js`, `telegram-form.js`, and `server/telegram-api.mjs`.
- Kept root HTML generated from `src/pages` via `npm run build:site -- --write`.

## Checks expected

- `node --check analytics.js`
- `node --check telegram-form.js`
- `node --check server/telegram-api.mjs`
- `npm run sync:generated`
- `npm run check:core`
- `npm run check:handoff`
