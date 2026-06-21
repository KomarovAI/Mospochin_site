# MosPochin — Run8 Production Smoke Checklist

Дата: 2026-06-21

## Ключевые страницы

- /
- /parokonvektomaty.html
- /parokonvektomat-kod-oshibki.html
- /parokonvektomat-e02-e07-e10.html
- /parokonvektomat-convotherm.html
- /pishevarochnye-kotly.html
- /pishevarochnyj-kotel-abat-h20.html
- /remont-pishevarochnyh-kotlov-abat.html

## На каждой странице

- [ ] Открыть страницу и убедиться, что нет JS errors в console.
- [ ] Дождаться видимости hero/mobile CTA и проверить cta_view.
- [ ] Кликнуть телефон и проверить phone_click.
- [ ] Кликнуть WhatsApp и проверить whatsapp_click.
- [ ] Открыть форму через CTA и проверить form_open.
- [ ] Ввести первый символ в поле и проверить form_start.
- [ ] Отправить невалидную форму и проверить form_validation_error / form_submit_blocked.
- [ ] Отправить тестовую валидную форму и проверить form_submit_attempt + form_submit_success.

## События, которые должны появиться после ручного smoke

- [ ] `cta_view`
- [ ] `cta_click`
- [ ] `phone_click`
- [ ] `whatsapp_click`
- [ ] `telegram_click`
- [ ] `email_click`
- [ ] `form_open`
- [ ] `form_start`
- [ ] `form_submit_attempt`
- [ ] `form_submit_success`
- [ ] `form_submit_error`
- [ ] `form_validation_error`
- [ ] `form_submit_blocked`

## Минимальный успех smoke

```text
phone_click > 0
whatsapp_click > 0
form_open > 0
form_start > 0
form_submit_attempt > 0
form_validation_error > 0
form_submit_success > 0 на тестовой валидной заявке
```

## Не использовать для решений

```text
suspicious
bot_or_internal
bad_origin
unknown_event
wrong_content_type
oversized_body
rate_limited
duplicate_like
smoke
curl
internal
```
