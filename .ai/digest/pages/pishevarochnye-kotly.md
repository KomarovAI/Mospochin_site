# Page Digest — pishevarochnye-kotly.html

- Branch: restaurant
- Role: service
- Title: Ремонт пищеварочных котлов в Москве — MosPochin
- Description: Ремонт промышленных пищеварочных котлов для ресторанов, столовых и производств: не греет, течёт, ошибка, не держит температуру.
- H1: Ремонт пищеварочных котлов для ресторанов и столовых
- Canonical: https://mospochin.ru/pishevarochnye-kotly.html
- Builder model: src/pages/pishevarochnye-kotly/page.json
- Sections: 45 (39 local, 1 shared refs, 13 raw)
- Text words inside referenced sections: 1937

## Component mix

| Component | Count |
| --- | --- |
| raw | 13 |
| mobile-contact | 7 |
| pricing | 7 |
| proof | 4 |
| section | 3 |
| layout-fragment | 2 |
| related-links | 2 |
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
| Развели заявки по симптомам и узлам | pricing | 11.4 KB | 200 | no | src/pages/pishevarochnye-kotly/sections/025-pricing-razveli-zayavki-po-simptomam-i-uzlam.html |
| Ремонт пищеварочных котлов для ресторанов и столовых | mobile-contact | 8.1 KB | 150 | no | src/pages/pishevarochnye-kotly/sections/004-mobile-contact-remont-pischevarochnyh-kotlov-dlya-re.html |
| Что фиксируем до начала работ на объекте | pricing | 6.7 KB | 181 | no | src/pages/pishevarochnye-kotly/sections/029-pricing-chto-fiksiruem-do-nachala-rabot-na-ob-ekte.html |
| Частые вопросы по ремонту | faq | 6.0 KB | 193 | no | src/pages/pishevarochnye-kotly/sections/034-faq-chastye-voprosy-po-remontu.html |
| Отдельные посадочные под Abat, КПЭМ, Apach, Atesy и Iterma | pricing | 5.7 KB | 199 | no | src/pages/pishevarochnye-kotly/sections/019-pricing-otdel-nye-posadochnye-pod-abat-kpem-apach-at.html |
| Согласовать выезд по котлу | lead-form | 5.6 KB | 94 | no | src/pages/pishevarochnye-kotly/sections/027-lead-form-soglasovat-vyezd-po-kotlu.html |
| Разводим трафик по реальному симптому | pricing | 5.4 KB | 126 | no | src/pages/pishevarochnye-kotly/sections/010-pricing-razvodim-trafik-po-real-nomu-simptomu.html |
| Если проблема в другом ресторанном оборудовании | related-links | 5.1 KB | 94 | no | src/pages/pishevarochnye-kotly/sections/032-related-links-esli-problema-v-drugom-restorannom-obo.html |


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
