# MosPochin — P8 Final Deploy Handoff

Дата: **2026-06-21**  
Проект: **MosPochin / mospochin.ru**  
База: `mospochin_interlinking_run7_pack_20260621.zip`  
Base SHA256: `18cd9f793367712a2bb747d9a2e749232a49b88bd3db54d0974d14a34375aabd`  
Режим: **site-only, tracking-safe, без apply-изменений в Яндекс Директе**.

## 0. Что это за пакет

P8 не добавляет новые SEO-страницы. Это финальный handoff-пакет для выкладки текущего Run7-кода:

- tracking + CTA/forms foundation;
- главная страница;
- пароконвектоматы / error-intent;
- пищеварочные / варочные котлы;
- SEO / technical QA;
- перелинковка / анкоры;
- deploy/smoke/post-deploy инструкции.

## 1. Inventory

```text
Root HTML pages: 63
Indexable HTML pages: 58
Noindex HTML pages: 5
Sitemap URLs: 58
Pages with data-page-slug: 63
Total data-cta-id attributes: 2266
Forms total: 79
```

Intentional noindex pages:

```text
404.html
kompyutery.html
parokonvektomaty-promo.html
remont-oborudovaniya-restorana-parokonvektomat.html
routery.html
```

## 2. Главный guardrail

Не деплоить по схеме `ZIP -> overwrite production`. Нужно сохранить production tracking/logging layer.

Must preserve:

```text
analytics.js
telegram-form.js
server/telegram-api.mjs
/api/track-event
/api/send-telegram
site_events.jsonl
site_event_rejects.jsonl
data-page-*
data-cta-*
data-form-id
data-form-context
```

## 3. Pre-deploy порядок

```bash
set -e
npm ci --ignore-scripts
npm run verify:fast
npm run lint
npm run predeploy:check
npm audit --audit-level=moderate
node --check analytics.js
node --check telegram-form.js
node --check server/telegram-api.mjs
```

Optional visual audit, только там, где установлен Chromium:

```bash
npm run setup:visual
npm run audit:restaurant-screenshots
npm run audit:cooking-kettles-screenshots
```

## 4. Deploy порядок

```text
1. Сделать backup production директории и server/config слоя.
2. Сверить production analytics.js и server/telegram-api.mjs с пакетом.
3. Не удалять production logs: site_events.jsonl, site_event_rejects.jsonl.
4. Залить static/root HTML, assets, data, docs, deploy scripts.
5. Перезапустить backend только если менялся server/telegram-api.mjs.
6. Проверить HTTP 200 на ключевых страницах.
7. Выполнить smoke-test событий.
8. Запустить mosanalytics-daily-run и проверить агрегаты.
```

## 5. Ключевые страницы smoke-test

```text
/
/parokonvektomaty.html
/parokonvektomat-kod-oshibki.html
/parokonvektomat-e02-e07-e10.html
/parokonvektomat-convotherm.html
/pishevarochnye-kotly.html
/pishevarochnyj-kotel-abat-h20.html
/remont-pishevarochnyh-kotlov-abat.html
```

## 6. Ожидаемые события

```text
cta_view
cta_click
phone_click
whatsapp_click
telegram_click
email_click
form_open
form_start
form_submit_attempt
form_submit_success
form_submit_error
form_validation_error
form_submit_blocked
```

## 7. Smoke-test actions

- Открыть страницу и убедиться, что нет JS errors в console.
- Дождаться видимости hero/mobile CTA и проверить cta_view.
- Кликнуть телефон и проверить phone_click.
- Кликнуть WhatsApp и проверить whatsapp_click.
- Открыть форму через CTA и проверить form_open.
- Ввести первый символ в поле и проверить form_start.
- Отправить невалидную форму и проверить form_validation_error / form_submit_blocked.
- Отправить тестовую валидную форму и проверить form_submit_attempt + form_submit_success.

## 8. Post-deploy mosanalytics command

```bash
ssh artikk-local 'bash -lc "
set -e
/opt/mosanalytics/bin/mosanalytics-daily-run
BASE=/var/lib/mosanalytics
DAY=\$(date +%F)
ZIP=\$BASE/reports/mosanalytics_llm_brief_\$DAY.zip

echo ===== FUNNEL =====
unzip -p "\$ZIP" "llm_funnel_\$DAY.csv"

echo ===== EVENT FUNNEL =====
unzip -p "\$ZIP" "llm_event_funnel_\$DAY.csv"

echo ===== CTA PERFORMANCE =====
unzip -p "\$ZIP" "llm_cta_performance_\$DAY.csv"

echo ===== FORM FRICTION =====
unzip -p "\$ZIP" "llm_form_friction_\$DAY.csv"

echo ===== TRAFFIC QUALITY =====
unzip -p "\$ZIP" "llm_traffic_quality_\$DAY.csv"
"'
```

## 9. Rollback условия

Rollback / stop deploy если:

```text
/api/track-event не отвечает ok
/api/send-telegram не принимает форму
site_events.jsonl не пишется
site_event_rejects.jsonl резко растёт
ключевые страницы отдают не 200
canonical/sitemap сломались
формы не открываются / не отправляются
JS console содержит blocker errors
```

## 10. Что делать с Директом

Сразу после деплоя:

```text
не менять ставки;
не отключать кампании;
не минусовать error-intent пачкой;
только read-only отчёты и landing mapping.
```

Через 7–14 дней:

```text
смотреть только human_candidate / decision events;
сопоставлять Query / AdGroupId / landing / cta_click / phone_click / whatsapp_click / form_start / form_submit_success;
готовить точечные минуса и ставки только по накопленным данным.
```

## 11. Official references

- Google sitemap docs: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Google structured data policies: https://developers.google.com/search/docs/appearance/structured-data/sd-policies
- Yandex Metrica reachGoal: https://yandex.com/support/metrica/en/objects/reachgoal
- Yandex Direct report type: https://yandex.ru/dev/direct/doc/en/type
