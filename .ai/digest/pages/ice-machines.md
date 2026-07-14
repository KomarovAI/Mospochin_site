# Page Digest — ice-machines.html

- Branch: restaurant
- Role: service
- Title: Ремонт льдогенераторов в Москве — MosPochin | от 800₽
- Description: Ремонт льдогенераторов Scotsman, Manitowoc и Hoshizaki: кусковые, гранулярные и Gourmet-модели. Диагностика и смета до работ.
- H1: Льдогенератор встал? Пришлите фото — уточним следующий шаг
- Canonical: https://mospochin.ru/ice-machines.html
- Builder model: src/pages/ice-machines/page.json
- Sections: 63 (52 local, 3 shared refs, 22 raw)
- Text words inside referenced sections: 2039

## Component mix

| Component | Count |
| --- | --- |
| raw | 22 |
| proof | 11 |
| pricing | 9 |
| layout-fragment | 3 |
| mobile-contact | 3 |
| section | 3 |
| breadcrumb | 2 |
| faq | 2 |
| related-links | 2 |
| body-preamble | 1 |
| contact-cta | 1 |
| footer-anchor | 1 |
| hero | 1 |
| lead-form | 1 |
| runtime-partials | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Ремонтируем все типы льдогенераторов | pricing | 15.3 KB | 320 | no | src/pages/ice-machines/sections/012-pricing-remontiruem-vse-tipy-l-dogeneratorov.html |
| Ремонтируем все марки льдогенераторов | section | 13.0 KB | 72 | no | src/pages/ice-machines/sections/026-section-remontiruem-vse-marki-l-dogeneratorov.html |
| Льдогенератор встал? Пришлите фото — уточним следующий шаг | hero | 7.6 KB | 75 | no | src/pages/ice-machines/sections/006-hero-l-dogenerator-vstal-prishlite-foto-utochnim-sle.html |
| Что фиксируем до начала работ на объекте | pricing | 6.7 KB | 180 | no | src/pages/ice-machines/sections/048-pricing-chto-fiksiruem-do-nachala-rabot-na-ob-ekte.html |
| Частые вопросы о ремонте льдогенераторов | faq | 6.0 KB | 191 | no | src/pages/ice-machines/sections/042-faq-chastye-voprosy-o-remonte-l-dogeneratorov.html |
| Оставьте заявку на ремонт | lead-form | 5.7 KB | 92 | no | src/pages/ice-machines/sections/046-lead-form-ostav-te-zayavku-na-remont.html |
| Примеры ремонта льдогенераторов | pricing | 5.4 KB | 134 | no | src/pages/ice-machines/sections/024-pricing-primery-remonta-l-dogeneratorov.html |
| Если проблема в другом ресторанном оборудовании | related-links | 5.0 KB | 94 | no | src/pages/ice-machines/sections/051-related-links-esli-problema-v-drugom-restorannom-obo.html |


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
