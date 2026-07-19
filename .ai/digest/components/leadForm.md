# Component Digest — leadForm

- Name: Форма заявки / Telegram submit
- Appears in: 502 pages
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
- belyy-nalet-posle-posudomoechnoy-mashiny.html
- bezopasnost-sous-vide.html
- blixery-dlya-restoranov.html
- bytovaya-about.html
- bytovaya-contact.html
- bytovaya-index.html
- bytovaya-uslugi.html
- case-chistka-boylera-s-silnoy-nakipyu.html
- case-remont-boylera-v-tesnoy-nishe.html
- case-remont-dvuhbakovogo-vodonagrevatelya.html
- case-trehfaznaya-sistema-gvs-chastnogo-doma.html
- chek-list-ventilyatsii-restorana.html
- chem-otlichaetsya-pritok-ot-vytyazhki.html
- chistka-i-dezinfekciya-kuttera.html
- chistka-teploobmennika-i-vozdushnogo-trakta-sushilnoy-mashiny.html
- chistka-ventilyatsii-restoranov.html
- chistka-vodonagrevatelya-ot-nakipi.html
- chto-proveryaet-inzhener-ventilyatsii.html
- … ещё 482
