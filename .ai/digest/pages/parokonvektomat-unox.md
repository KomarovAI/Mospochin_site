# Page Digest — parokonvektomat-unox.html

- Branch: restaurant
- Role: branch
- Title: Ремонт пароконвектоматов Unox в Москве — диагностика и выезд | MosPochin
- Description: Ремонт пароконвектоматов Unox для ресторанов, кафе и пекарен: ошибки AF01, AF02, AF08, нет пара, не греет, выезд инженера.
- H1: Ремонт пароконвектоматов Unox
- Canonical: https://mospochin.ru/parokonvektomat-unox.html
- Builder model: src/pages/parokonvektomat-unox/page.json
- Sections: 55 (17 local, 6 shared refs, 2 raw)
- Text words inside referenced sections: 1462

## Component mix

| Component | Count |
| --- | --- |
| layout-fragment | 27 |
| proof | 6 |
| mobile-contact | 5 |
| pricing | 3 |
| breadcrumb | 2 |
| faq | 2 |
| raw | 2 |
| related-links | 2 |
| section | 2 |
| body-preamble | 1 |
| contact-cta | 1 |
| hero | 1 |
| lead-form | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Что проверяем у пароконвектомата Unox | section | 14.8 KB | 467 | no | src/pages/parokonvektomat-unox/sections/009-section-chto-proveryaem-u-parokonvektomata-unox.html |
| Мобильные контактные элементы | mobile-contact | 9.0 KB | 110 | no | src/pages/parokonvektomat-unox/sections/002-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Ремонт пароконвектоматов Unox | hero | 9.0 KB | 100 | no | src/pages/parokonvektomat-unox/sections/006-hero-remont-parokonvektomatov-unox.html |
| Частые вопросы о ремонте пароконвектоматов | faq | 6.6 KB | 240 | yes | src/components/shared/faq/faq-chastye-voprosy-o-remonte-parokonvektomatov--9302e2410efc79af.html |
| Получите понятный сценарий ремонта пароконвектомата | lead-form | 6.5 KB | 102 | no | src/components/parametric/lead-form/restaurant-parokonvektomat-b2b-e67caef46e64.template.html |
| Мобильные контактные элементы | mobile-contact | 4.8 KB | 77 | no | src/pages/parokonvektomat-unox/sections/061-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Выберите проблему — уточним сценарий | pricing | 4.7 KB | 43 | no | src/pages/parokonvektomat-unox/sections/025-pricing-vyberite-problemu-utochnim-scenariy.html |
| Пароконвектомат встал? | contact-cta | 2.6 KB | 43 | no | src/pages/parokonvektomat-unox/sections/050-contact-cta-parokonvektomat-vstal.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- parokonvektomat-unox.html
- src/site-builder.json
- src/pages/parokonvektomat-unox/page.json
- src/pages/parokonvektomat-unox/sections/

## Checks

- npm run doctor:page -- --page parokonvektomat-unox.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page parokonvektomat-unox.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
