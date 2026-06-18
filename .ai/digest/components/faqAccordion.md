# Component Digest — faqAccordion

- Name: FAQ / аккордеон вопросов
- Appears in: 38 pages
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
- … ещё 18
