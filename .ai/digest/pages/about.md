# Page Digest — about.html

- Branch: restaurant
- Role: branch
- Title: О компании MosPochin — с 2010 года ремонта техники в Москве
- Description: MosPochin — ремонт ресторанного оборудования в Москве с 2010 года. Диагностика причины, согласование стоимости до работ, договор и гарантия по условиям ремонта.
- H1: О компании MosPochin
- Canonical: https://mospochin.ru/about.html
- Builder model: src/pages/about/page.json
- Sections: 24 (18 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 778

## Component mix

| Component | Count |
| --- | --- |
| proof | 7 |
| mobile-contact | 4 |
| layout-fragment | 2 |
| pricing | 2 |
| section | 2 |
| body-preamble | 1 |
| breadcrumb | 1 |
| faq | 1 |
| footer-anchor | 1 |
| hero | 1 |
| lead-form | 1 |
| runtime-partials | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| О компании MosPochin | hero | 8.4 KB | 97 | no | src/pages/about/sections/004-hero-o-kompanii-mospochin.html |
| Почему нам доверяют | pricing | 5.0 KB | 110 | no | src/pages/about/sections/007-pricing-pochemu-nam-doveryayut.html |
| Как формировалась команда специалистов | proof | 4.9 KB | 102 | no | src/pages/about/sections/011-proof-kak-formirovalas-komanda-specialistov.html |
| Ресторанное оборудование | section | 4.7 KB | 20 | no | src/pages/about/sections/015-section-restorannoe-oborudovanie.html |
| Наши мастера | proof | 4.6 KB | 71 | no | src/pages/about/sections/010-proof-nashi-mastera.html |
| Оригинальные запчасти всегда в наличии | proof | 3.7 KB | 64 | no | src/pages/about/sections/008-proof-original-nye-zapchasti-vsegda-v-nalichii.html |
| Наши клиенты | proof | 3.3 KB | 23 | no | src/pages/about/sections/013-proof-nashi-klienty.html |
| Нужен ремонт? Оставьте заявку на ремонт | lead-form | 3.1 KB | 25 | no | src/pages/about/sections/016-lead-form-nuzhen-remont-ostav-te-zayavku-na-remont.html |


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
