# Component Digest — leadForm

- Name: Форма заявки / Telegram submit
- Appears in: 295 pages
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
- bezopasnost-sous-vide.html
- blixery-dlya-restoranov.html
- bytovaya-about.html
- bytovaya-contact.html
- bytovaya-index.html
- bytovaya-uslugi.html
- chek-list-ventilyatsii-restorana.html
- chem-otlichaetsya-pritok-ot-vytyazhki.html
- chistka-i-dezinfekciya-kuttera.html
- chistka-ventilyatsii-restoranov.html
- chto-proveryaet-inzhener-ventilyatsii.html
- contact.html
- diagnostika-holodilnogo-oborudovaniya.html
- diagnostika-kuttera.html
- diagnostika-promyshlennoy-posudomoechnoy-mashiny.html
- diagnostika-ventilyatsii-restorana.html
- dozatory-moyushchego-i-opolaskivatelya.html
- dver-holodilnogo-shkafa-ne-zakryvaetsya.html
- … ещё 275
