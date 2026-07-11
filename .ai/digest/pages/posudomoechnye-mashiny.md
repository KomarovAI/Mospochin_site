# Page Digest — posudomoechnye-mashiny.html

- Branch: restaurant
- Role: service
- Title: Ремонт промышленных посудомоечных машин — MosPochin
- Description: Ремонт купольных, конвейерных, фронтальных посудомоек Winterhalter, Hobart, Meiko. Выезд за 45 мин. Гарантия 24 мес. Диагностика при ремонте.
- H1: Ремонт промышленных посудомоечных машин без остановки кухни на полдня
- Canonical: https://mospochin.ru/posudomoechnye-mashiny.html
- Builder model: src/pages/posudomoechnye-mashiny/page.json
- Sections: 66 (43 local, 3 shared refs, 12 raw)
- Text words inside referenced sections: 2382

## Component mix

| Component | Count |
| --- | --- |
| layout-fragment | 15 |
| raw | 12 |
| proof | 11 |
| pricing | 10 |
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
| Ремонтируем все типы промышленных посудомоек | pricing | 14.9 KB | 315 | no | src/pages/posudomoechnye-mashiny/sections/012-pricing-remontiruem-vse-tipy-promyshlennyh-posudomoe.html |
| Ремонтируем все марки промышленных посудомоек | section | 12.2 KB | 70 | no | src/pages/posudomoechnye-mashiny/sections/026-section-remontiruem-vse-marki-promyshlennyh-posudomo.html |
| Ремонт промышленных посудомоечных машин без остановки кухни на полдня | hero | 8.1 KB | 88 | no | src/pages/posudomoechnye-mashiny/sections/006-hero-remont-promyshlennyh-posudomoechnyh-mashin-bez-.html |
| Что фиксируем до начала работ на объекте | pricing | 6.7 KB | 179 | no | src/pages/posudomoechnye-mashiny/sections/048-pricing-chto-fiksiruem-do-nachala-rabot-na-ob-ekte.html |
| Частые вопросы о ремонте промышленных посудомоек | faq | 6.6 KB | 232 | no | src/pages/posudomoechnye-mashiny/sections/042-faq-chastye-voprosy-o-remonte-promyshlennyh-posudomo.html |
| Получите понятный сценарий ремонта мойки | lead-form | 6.0 KB | 106 | no | src/pages/posudomoechnye-mashiny/sections/046-lead-form-poluchite-ponyatnyy-scenariy-remonta-moyki.html |
| Что говорят клиенты | proof | 5.4 KB | 151 | no | src/pages/posudomoechnye-mashiny/sections/032-proof-chto-govoryat-klienty.html |
| Примеры ремонта посудомоечных машин | pricing | 5.4 KB | 140 | no | src/pages/posudomoechnye-mashiny/sections/024-pricing-primery-remonta-posudomoechnyh-mashin.html |


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
- posudomoechnye-mashiny.html
- src/site-builder.json
- src/pages/posudomoechnye-mashiny/page.json
- src/pages/posudomoechnye-mashiny/sections/

## Checks

- npm run doctor:restaurant-page -- --page posudomoechnye-mashiny.html
- npm run doctor:page -- --page posudomoechnye-mashiny.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page posudomoechnye-mashiny.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
