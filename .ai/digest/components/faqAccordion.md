# Component Digest — faqAccordion

- Name: FAQ / аккордеон вопросов
- Appears in: 502 pages
- Keywords: faq, вопрос, ответ, аккордеон, частые вопросы
- CSS selectors: .faq, [onclick*="toggleFAQ"]
- JS hooks: toggleFAQ

## Related files

- main.js
- content/faq/page-faq-registry.json
- tools/generate-faq-registry.mjs
- data/household-page-slots.json
- data/restaurant-page-slots.json

## Risks

- FAQ влияет на SEO и schema.org FAQPage.
- Не оставляй вопрос без ответа.

## Safe editing notes

- После изменений FAQ запускай generate:faq-registry, build:site -- --write, validate:data и semantic diff страницы.

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
