# Component Digest — leadForm

- Name: Форма заявки / Telegram submit
- Appears in: 62 pages
- Keywords: форма, заявк, telegram, телеграм, лид, обратн, phone, телефон
- CSS selectors: .telegram-form, .form-field, [data-slot="request-form"]
- JS hooks: telegram-form, submit, /api/send-telegram

## Related files

- telegram-form.js
- server/telegram-api.mjs
- data/contact-config.json

## Risks

- Форма собирает персональные данные.
- Нельзя ломать name/phone, consent checkbox, action/method и endpoint.
- Проверь label/id/for и autocomplete.

## Safe editing notes

- Можно менять UX/тексты, но сохраняй контракт полей и fallback action="/api/send-telegram".

## Representative pages

- about.html
- bytovaya-about.html
- bytovaya-contact.html
- bytovaya-index.html
- bytovaya-uslugi.html
- contact.html
- grili-mangaly.html
- holodilniki.html
- holodilnoe-oborudovanie.html
- ice-machines.html
- index.html
- kompyutery.html
- microwaves.html
- parokonvektomat-abat.html
- parokonvektomat-convotherm.html
- parokonvektomat-e02-e07-e10.html
- parokonvektomat-electrolux.html
- parokonvektomat-kod-oshibki.html
- parokonvektomat-lainox.html
- parokonvektomat-ne-greet.html
- … ещё 42
