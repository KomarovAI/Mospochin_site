# MosPochin tracking + CTA patch report

Дата: 2026-06-21
База: mospochin_cooking_kettles_run4_final_polish_pack_20260618(9).zip
Режим: site-only, Direct не менялся.

## Что изменено

- Добавлен backend event endpoint `/api/track-event` в `server/telegram-api.mjs`.
- `analytics.js` теперь пишет события в `/api/track-event` и параллельно вызывает `ym(..., 'reachGoal', ...)`.
- Добавлены/сохранены события: `cta_view`, `cta_click`, `phone_click`, `whatsapp_click`, `telegram_click`, `email_click`, `form_open`, `form_start`, `form_submit_attempt`, `form_submit_success`, `form_submit_error`, `form_validation_error`, `form_submit_blocked`.
- `telegram-form.js` дополнен блокировочными событиями формы: honeypot, too_fast, consent_required, invalid_phone, problem_too_long, client_rate_limited.
- HTML и source builder model размечены `data-page-*`, `data-cta-*`, `data-form-*`.
- Source model синхронизирована с root HTML через site-builder bootstrap, shared extraction, parametric migration и generated maps.

## Покрытие разметкой

- Root HTML pages: 63
- Pages with `data-page-slug`: 63
- Root `data-cta-id` attributes: 1525
- Root `data-form-id` attributes: 79

## Контрольные страницы

| Page | data-page | CTA attrs | form attrs | scripts |
|---|---:|---:|---:|---:|
| `index.html` | yes | 25 | 1 | yes |
| `parokonvektomaty.html` | yes | 42 | 3 | yes |
| `parokonvektomat-kod-oshibki.html` | yes | 33 | 2 | yes |
| `parokonvektomat-convotherm.html` | yes | 30 | 2 | yes |
| `pishevarochnye-kotly.html` | yes | 42 | 1 | yes |
| `pishevarochnyj-kotel-abat-h20.html` | yes | 22 | 1 | yes |
| `remont-pishevarochnyh-kotlov-abat.html` | yes | 18 | 1 | yes |

## Проверки

PASS:

```text
npm ci --ignore-scripts
npm run verify:fast
npm run lint
npm run predeploy:check
npm audit --audit-level=moderate
node --check analytics.js
node --check telegram-form.js
node --check server/telegram-api.mjs
/api/track-event local smoke: valid event -> site_events.jsonl, invalid event -> site_event_rejects.jsonl
```

Warnings left intentionally:

```text
data/page-metadata.json:
- remont-pishevarochnyh-kotlov-apach.html title length 84
- remont-pishevarochnyh-kotlov-atesy.html title length 79
- remont-pishevarochnyh-kotlov-iterma.html title length 83
```

Not completed in this sandbox:

```text
npm run audit:cooking-kettles-screenshots
```

Reason: Playwright Chromium is not installed in this environment; `npx playwright install chromium` failed with DNS `EAI_AGAIN cdn.playwright.dev`. Run this visual audit in CI or on a machine with browser cache/network access.

## Deployment notes

- Do not deploy as blind overwrite over production if production has newer server/process manager config.
- Preserve `/api/send-telegram` credentials and runtime environment variables.
- Confirm production writes `site_events.jsonl` and `site_event_rejects.jsonl` after deploy.
- After deploy, run manual smoke: phone, WhatsApp, form focus, invalid submit, valid test submit.
