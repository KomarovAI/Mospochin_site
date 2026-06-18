# Page Digest — contact.html

- Branch: restaurant
- Role: branch
- Title: Контакты MosPochin — телефон, WhatsApp, Telegram, адрес в Москве
- Description: Телефон, WhatsApp, Telegram и адрес MosPochin в Москве. Принимаем заявки на ремонт ресторанного оборудования 24/7.
- H1: Связаться с MosPochin и быстро решить вопрос с ремонтом
- Canonical: https://mospochin.ru/contact.html
- Builder model: src/pages/contact/page.json
- Sections: 39 (25 local, 0 shared refs, 9 raw)
- Text words inside referenced sections: 661

## Component mix

| Component | Count |
| --- | --- |
| raw | 9 |
| layout-fragment | 8 |
| mobile-contact | 4 |
| contact-cta | 3 |
| proof | 3 |
| breadcrumb | 2 |
| faq | 2 |
| noscript | 2 |
| footer-anchor | 1 |
| hero | 1 |
| lead-form | 1 |
| pricing | 1 |
| runtime-partials | 1 |
| section | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Зона обслуживания | section | 7.0 KB | 92 | no | src/pages/contact/sections/017-section-zona-obsluzhivaniya.html |
| Все способы связи | mobile-contact | 6.7 KB | 69 | no | src/pages/contact/sections/011-mobile-contact-vse-sposoby-svyazi.html |
| Связаться с MosPochin и быстро решить вопрос с ремонтом | hero | 6.1 KB | 70 | no | src/pages/contact/sections/007-hero-svyazat-sya-s-mospochin-i-bystro-reshit-vopros-.html |
| Режим работы | pricing | 5.3 KB | 43 | no | src/pages/contact/sections/013-pricing-rezhim-raboty.html |
| Кто приедет к вам | proof | 3.9 KB | 52 | no | src/pages/contact/sections/015-proof-kto-priedet-k-vam.html |
| Частые вопросы | faq | 3.7 KB | 97 | no | src/pages/contact/sections/023-faq-chastye-voprosy.html |
| Схема работы | contact-cta | 3.6 KB | 87 | no | src/pages/contact/sections/021-contact-cta-shema-raboty.html |
| Оставьте заявку, и мы свяжемся по ремонту | lead-form | 3.4 KB | 41 | no | src/pages/contact/sections/027-lead-form-ostav-te-zayavku-i-my-svyazhemsya-po-remon.html |


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
