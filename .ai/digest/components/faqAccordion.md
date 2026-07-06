# Component Digest — faqAccordion

- Name: FAQ / аккордеон вопросов
- Appears in: 114 pages
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
