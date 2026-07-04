# MosPochin V8 — карта целей Яндекс Метрики

Эта карта не меняет счётчик. Она фиксирует, какие JavaScript-события уже отправляет сайт через `ym(..., 'reachGoal', eventName, params)` и через `/api/track-event`.

## Обязательные цели JavaScript-события

Создать/проверить в Метрике отдельные цели с такими идентификаторами:

```text
phone_click
whatsapp_click
form_open
form_start
form_submit_click
form_validation_error
form_submit_attempt
form_submit_success
```

## Диагностические цели

```text
cta_view
cta_click
telegram_click
email_click
form_submit_error
form_submit_blocked
```

## Как читать после деплоя

```text
form_start > 0, form_submit_click = 0
=> пользователь начал форму, но не дошёл до кнопки. Нужен UX/форма/sticky WhatsApp.

form_submit_click > 0, form_validation_error > 0
=> кнопку нажимают, но HTML5 validation/consent/телефон блокирует submit.

form_submit_attempt > 0, form_submit_success = 0
=> форма дошла до submit, смотреть backend / Telegram handler / direct_leads.jsonl.

phone_click или whatsapp_click > 0 при form_submit_success = 0
=> не считать страницу мёртвой: лид может уходить в звонок/мессенджер.
```
