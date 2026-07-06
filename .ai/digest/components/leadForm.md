# Component Digest — leadForm

- Name: Форма заявки / Telegram submit
- Appears in: 114 pages
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
- avtomatika-ventilyatsii-restorana.html
- bytovaya-about.html
- bytovaya-contact.html
- bytovaya-index.html
- bytovaya-uslugi.html
- chek-list-ventilyatsii-restorana.html
- chem-otlichaetsya-pritok-ot-vytyazhki.html
- chistka-ventilyatsii-restoranov.html
- chto-proveryaet-inzhener-ventilyatsii.html
- contact.html
- diagnostika-ventilyatsii-restorana.html
- dym-na-kuhne-restorana.html
- grili-mangaly.html
- holodilniki.html
- holodilnoe-oborudovanie.html
- ice-machines.html
- index.html
- kak-podgotovitsya-k-vyezdu-mastera-po-ventilyatsii.html
- kak-ponyat-chto-nuzhna-chistka-ventilyatsii.html
- … ещё 94
