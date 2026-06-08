# MosPochin — Stage 5 Direct conversion ready archive

Дата: 2026-06-08
Пакет: `mospochin-site-direct-conversion-stage5-ready-20260608.zip`
База: `mospochin_site_visual_ui_stage4_2026-06-07(5).zip`

## Что доведено в этом архиве

1. Серверная атрибуция Telegram-заявок усилена:
   - `page_url` и `referrer` теперь сохраняются до 800 символов;
   - длинные `utm_campaign`, `utm_content`, `utm_term`, `yclid`, `gclid` не режутся слишком рано;
   - блоки `Источник заявки` и `Рекламная атрибуция` остаются в Telegram-сообщении.

2. Добавлен guard `tools/check-conversion-runtime.mjs`:
   - проверяет production whitelist Метрики;
   - проверяет наличие safe `mospochinTrackGoal` wrapper;
   - проверяет hidden attribution fields в `telegram-form.js`;
   - проверяет payload `pageIntent`, `leadQuality`, `attribution`;
   - проверяет отсутствие noscript-пикселя Метрики в root HTML;
   - проверяет, что критичные Direct-страницы имеют stage4 CTA rail, форму, phone/WhatsApp markers.

3. `check:core` расширен новым runtime guard, чтобы будущая нейронка не сломала связку:

```bash
npm run check:conversion-runtime
npm run check:core
```

## Что уже было в базовом stage4 и сохранено

- Метрика включается только на `mospochin.ru` / `www.mospochin.ru`.
- Localhost / `127.0.0.1` не должен загрязнять боевой счётчик.
- Все `.telegram-form` автоматически получают hidden-поля: page, referrer, UTM, `yclid`, `gclid`, `ym_client_id`.
- Direct-посадочные по пароконвектоматам имеют stage4 visual CTA rail.
- Хаб, Rational, Unox и error-страницы уже усилены под B2B/Direct/repair bridge.

## Проверки в этом архиве

Выполнено локально в распакованном проекте:

```bash
node --check analytics.js
node --check telegram-form.js
node --check server/telegram-api.mjs
node --check tools/check-conversion-runtime.mjs
npm run check:conversion-runtime
npm run sync:generated
npm run check:core
npm run check:handoff
```

Итог: все перечисленные проверки прошли.

## После деплоя обязательно проверить руками

1. На `http://127.0.0.1:9999/parokonvektomaty.html` в DevTools Network не должно быть запросов к `mc.yandex.ru`.
2. На `https://mospochin.ru/parokonvektomaty.html` Метрика должна грузиться.
3. Тестовая заявка с UTM/yclid должна прийти в Telegram с блоками:
   - `Источник заявки`;
   - `Рекламная атрибуция`;
   - `page`, `url`, `utm_*`, `yclid`, `ym_client_id` при наличии.
