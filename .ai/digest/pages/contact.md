# Page Digest — contact.html

- Branch: restaurant
- Role: branch
- Title: Контакты MosPochin — телефон, WhatsApp и заявка на ремонт
- Description: Контакты MosPochin по ремонту ресторанного оборудования: телефон 8 (999) 005-71-72, WhatsApp, email, Москва и Московская область.
- H1: Связаться по ремонту ресторанного оборудования
- Canonical: https://mospochin.ru/contact.html
- Builder model: src/pages/contact/page.json
- Sections: 17 (14 local, 0 shared refs, 3 raw)
- Text words inside referenced sections: 471

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 5 |
| raw | 3 |
| contact-cta | 1 |
| faq | 1 |
| hero | 1 |
| layout-fragment | 1 |
| lead-form | 1 |
| navigation | 1 |
| noscript | 1 |
| pricing | 1 |
| section | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Мобильные контактные элементы | mobile-contact | 9.0 KB | 110 | no | src/pages/contact/sections/002-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Мобильные контактные элементы | mobile-contact | 4.8 KB | 77 | no | src/pages/contact/sections/010-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Оставить контакт для ответа | lead-form | 2.7 KB | 33 | no | src/pages/contact/sections/008-lead-form-ostavit-kontakt-dlya-otveta.html |
| Частые вопросы | faq | 2.6 KB | 80 | no | src/pages/contact/sections/009-faq-chastye-voprosy.html |
| Данные для первого ответа | pricing | 2.5 KB | 78 | no | src/pages/contact/sections/006-pricing-dannye-dlya-pervogo-otveta.html |
| Телефон | mobile-contact | 2.1 KB | 19 | no | src/pages/contact/sections/005-mobile-contact-telefon.html |
| Связаться по ремонту ресторанного оборудования | hero | 1.8 KB | 34 | no | src/pages/contact/sections/004-hero-svyazat-sya-po-remontu-restorannogo-oborudovani.html |
| Сведения рекламодателя | section | 1.7 KB | 22 | no | src/pages/contact/sections/007-section-svedeniya-reklamodatelya.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- data/restaurant-page-slots.json
- contact.html
- src/site-builder.json
- src/pages/contact/page.json
- src/pages/contact/sections/

## Checks

- npm run doctor:page -- --page contact.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page contact.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
