# Page Digest — pishevarochnye-kotly.html

- Branch: restaurant
- Role: service
- Title: Ремонт пищеварочных котлов в Москве — MosPochin
- Description: Ремонт промышленных пищеварочных котлов для ресторанов, столовых и производств: не греет, течёт, ошибка, не держит температуру.
- H1: Ремонт пищеварочных котлов для ресторанов и столовых
- Canonical: https://mospochin.ru/pishevarochnye-kotly.html
- Builder model: src/pages/pishevarochnye-kotly/page.json
- Sections: 27 (19 local, 1 shared refs, 0 raw)
- Text words inside referenced sections: 996

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 6 |
| proof | 5 |
| layout-fragment | 3 |
| pricing | 2 |
| related-links | 2 |
| section | 2 |
| body-preamble | 1 |
| breadcrumb | 1 |
| contact-cta | 1 |
| faq | 1 |
| footer-anchor | 1 |
| lead-form | 1 |
| runtime-partials | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Что фиксируем до начала работ на объекте | pricing | 6.7 KB | 181 | no | src/pages/pishevarochnye-kotly/sections/014-pricing-chto-fiksiruem-do-nachala-rabot-na-ob-ekte.html |
| Ремонт пищеварочных котлов для ресторанов и столовых | mobile-contact | 6.2 KB | 112 | no | src/pages/pishevarochnye-kotly/sections/004-mobile-contact-remont-pischevarochnyh-kotlov-dlya-re.html |
| Частые вопросы по ремонту | faq | 6.0 KB | 193 | no | src/pages/pishevarochnye-kotly/sections/019-faq-chastye-voprosy-po-remontu.html |
| Согласовать выезд по котлу | lead-form | 5.3 KB | 94 | no | src/pages/pishevarochnye-kotly/sections/012-lead-form-soglasovat-vyezd-po-kotlu.html |
| С чем чаще всего вызывают инженера | contact-cta | 3.3 KB | 94 | no | src/pages/pishevarochnye-kotly/sections/006-contact-cta-s-chem-chasche-vsego-vyzyvayut-inzhenera.html |
| Какие метрики держим по заявке ресторана | proof | 3.1 KB | 62 | yes | src/components/shared/proof/proof-kakie-metriki-derzhim-po-zayavke-restorana--49039622d5ec9ff8.html |
| Если проблема в другом ресторанном оборудовании | related-links | 2.9 KB | 59 | no | src/pages/pishevarochnye-kotly/sections/017-related-links-esli-problema-v-drugom-restorannom-obo.html |
| Что берем в ремонт на кухне | section | 2.9 KB | 65 | no | src/pages/pishevarochnye-kotly/sections/005-section-chto-berem-v-remont-na-kuhne.html |


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
- pishevarochnye-kotly.html
- src/site-builder.json
- src/pages/pishevarochnye-kotly/page.json
- src/pages/pishevarochnye-kotly/sections/

## Checks

- npm run doctor:restaurant-page -- --page pishevarochnye-kotly.html
- npm run doctor:page -- --page pishevarochnye-kotly.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page pishevarochnye-kotly.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
