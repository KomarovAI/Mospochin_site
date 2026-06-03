# Page Digest — about.html

- Branch: restaurant
- Role: branch
- Title: О компании MosPochin — с 2010 года ремонта техники в Москве
- Description: MosPochin — профессиональный ремонт техники с 2010 года. 500+ клиентов, 15 мастеров. Оригинальные запчасти. Гарантия до 24 месяцев.
- H1: О компании MosPochin
- Canonical: https://mospochin.ru/about.html
- Builder model: src/pages/about/page.json
- Sections: 25 (18 local, 0 shared refs, 1 raw)
- Text words inside referenced sections: 755

## Component mix

| Component | Count |
| --- | --- |
| proof | 9 |
| mobile-contact | 4 |
| layout-fragment | 2 |
| breadcrumb | 1 |
| faq | 1 |
| footer-anchor | 1 |
| hero | 1 |
| lead-form | 1 |
| noscript | 1 |
| pricing | 1 |
| raw | 1 |
| runtime-partials | 1 |
| section | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| О компании MosPochin | hero | 8.2 KB | 84 | no | src/pages/about/sections/005-hero-o-kompanii-mospochin.html |
| Почему нам доверяют | pricing | 4.9 KB | 108 | no | src/pages/about/sections/008-pricing-pochemu-nam-doveryayut.html |
| От 2 мастеров до 15 специалистов | proof | 4.8 KB | 101 | no | src/pages/about/sections/012-proof-ot-2-masterov-do-15-specialistov.html |
| Наши мастера | proof | 4.6 KB | 71 | no | src/pages/about/sections/011-proof-nashi-mastera.html |
| Ресторанное оборудование | section | 3.9 KB | 20 | no | src/pages/about/sections/016-section-restorannoe-oborudovanie.html |
| Оригинальные запчасти всегда в наличии | proof | 3.7 KB | 60 | no | src/pages/about/sections/009-proof-original-nye-zapchasti-vsegda-v-nalichii.html |
| Наши клиенты | proof | 3.3 KB | 23 | no | src/pages/about/sections/014-proof-nashi-klienty.html |
| Работаем по всей Москве и МО | proof | 2.9 KB | 90 | no | src/pages/about/sections/013-proof-rabotaem-po-vsey-moskve-i-mo.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- data/restaurant-page-slots.json
- about.html
- src/site-builder.json
- src/pages/about/page.json
- src/pages/about/sections/

## Checks

- npm run doctor:page -- --page about.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page about.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
