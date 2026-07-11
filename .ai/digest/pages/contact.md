# Page Digest — contact.html

- Branch: restaurant
- Role: branch
- Title: Контакты MosPochin — телефон, WhatsApp, Telegram, адрес в Москве
- Description: Телефон, WhatsApp, Telegram и адрес MosPochin в Москве. Принимаем заявки на ремонт ресторанного оборудования 24/7.
- H1: Связаться с MosPochin и быстро решить вопрос с ремонтом
- Canonical: https://mospochin.ru/contact.html
- Builder model: src/pages/contact/page.json
- Sections: 41 (26 local, 0 shared refs, 9 raw)
- Text words inside referenced sections: 732

## Component mix

| Component | Count |
| --- | --- |
| layout-fragment | 10 |
| raw | 9 |
| contact-cta | 4 |
| mobile-contact | 4 |
| proof | 3 |
| breadcrumb | 2 |
| faq | 2 |
| footer-anchor | 1 |
| hero | 1 |
| lead-form | 1 |
| noscript | 1 |
| pricing | 1 |
| runtime-partials | 1 |
| section | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Все способы связи | mobile-contact | 7.3 KB | 69 | no | src/pages/contact/sections/010-mobile-contact-vse-sposoby-svyazi.html |
| Зона обслуживания | section | 7.0 KB | 92 | no | src/pages/contact/sections/016-section-zona-obsluzhivaniya.html |
| Связаться с MosPochin и быстро решить вопрос с ремонтом | hero | 6.3 KB | 69 | no | src/pages/contact/sections/006-hero-svyazat-sya-s-mospochin-i-bystro-reshit-vopros-.html |
| Режим работы | pricing | 5.3 KB | 43 | no | src/pages/contact/sections/012-pricing-rezhim-raboty.html |
| Новое направление: вентиляция ресторанов | contact-cta | 4.1 KB | 72 | no | src/pages/contact/sections/028-contact-cta-novoe-napravlenie-ventilyaciya-restorano.html |
| Кто приедет к вам | proof | 3.9 KB | 52 | no | src/pages/contact/sections/014-proof-kto-priedet-k-vam.html |
| Частые вопросы | faq | 3.7 KB | 97 | no | src/pages/contact/sections/022-faq-chastye-voprosy.html |
| Схема работы | contact-cta | 3.7 KB | 87 | no | src/pages/contact/sections/020-contact-cta-shema-raboty.html |


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
