# Page Digest — ice-machines.html

- Branch: restaurant
- Role: service
- Title: Ремонт льдогенераторов в Москве — MosPochin | от 800₽
- Description: Ремонт льдогенераторов Scotsman, Manitowoc, Hoshizaki. Кусковые, гранулярные, Gourmet. Выезд за 45 мин. Гарантия 24 мес. Диагностика при ремонте.
- H1: Льдогенератор встал? Починим за 1-3 часа
- Canonical: https://mospochin.ru/ice-machines.html
- Builder model: src/pages/ice-machines/page.json
- Sections: 64 (43 local, 3 shared refs, 14 raw)
- Text words inside referenced sections: 2068

## Component mix

| Component | Count |
| --- | --- |
| raw | 14 |
| layout-fragment | 12 |
| proof | 11 |
| pricing | 10 |
| mobile-contact | 3 |
| breadcrumb | 2 |
| faq | 2 |
| related-links | 2 |
| section | 2 |
| contact-cta | 1 |
| footer-anchor | 1 |
| hero | 1 |
| lead-form | 1 |
| noscript | 1 |
| runtime-partials | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Ремонтируем все типы льдогенераторов | pricing | 15.3 KB | 320 | no | src/pages/ice-machines/sections/013-pricing-remontiruem-vse-tipy-l-dogeneratorov.html |
| Ремонтируем все марки льдогенераторов | section | 13.0 KB | 72 | no | src/pages/ice-machines/sections/027-section-remontiruem-vse-marki-l-dogeneratorov.html |
| Льдогенератор встал? Починим за 1-3 часа | hero | 7.4 KB | 78 | no | src/pages/ice-machines/sections/007-hero-l-dogenerator-vstal-pochinim-za-1-3-chasa.html |
| Что фиксируем до начала работ на объекте | pricing | 6.7 KB | 180 | no | src/pages/ice-machines/sections/049-pricing-chto-fiksiruem-do-nachala-rabot-na-ob-ekte.html |
| Частые вопросы о ремонте льдогенераторов | faq | 5.9 KB | 189 | no | src/pages/ice-machines/sections/043-faq-chastye-voprosy-o-remonte-l-dogeneratorov.html |
| Что говорят клиенты | pricing | 5.4 KB | 150 | no | src/pages/ice-machines/sections/033-pricing-chto-govoryat-klienty.html |
| Примеры ремонта льдогенераторов | pricing | 5.4 KB | 134 | no | src/pages/ice-machines/sections/025-pricing-primery-remonta-l-dogeneratorov.html |
| Оставьте заявку на ремонт | lead-form | 5.4 KB | 92 | no | src/pages/ice-machines/sections/047-lead-form-ostav-te-zayavku-na-remont.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- data/restaurant-services.json
- data/restaurant-taxonomy.json
- data/restaurant-proof-layer.json
- data/restaurant-page-slots.json
- ice-machines.html
- src/site-builder.json
- src/pages/ice-machines/page.json
- src/pages/ice-machines/sections/

## Checks

- npm run doctor:restaurant-page -- --page ice-machines.html
- npm run doctor:page -- --page ice-machines.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page ice-machines.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
