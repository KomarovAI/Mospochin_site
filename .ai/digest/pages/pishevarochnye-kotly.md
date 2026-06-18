# Page Digest — pishevarochnye-kotly.html

- Branch: restaurant
- Role: service
- Title: Ремонт пищеварочных котлов в Москве — MosPochin
- Description: Ремонт промышленных пищеварочных котлов для ресторанов, столовых и производств: не греет, течёт, ошибка, не держит температуру.
- H1: Ремонт пищеварочных котлов для ресторанов и столовых
- Canonical: https://mospochin.ru/pishevarochnye-kotly.html
- Builder model: src/pages/pishevarochnye-kotly/page.json
- Sections: 42 (23 local, 3 shared refs, 1 raw)
- Text words inside referenced sections: 1737

## Component mix

| Component | Count |
| --- | --- |
| layout-fragment | 12 |
| mobile-contact | 6 |
| pricing | 6 |
| proof | 5 |
| lead-form | 2 |
| related-links | 2 |
| section | 2 |
| body-preamble | 1 |
| breadcrumb | 1 |
| contact-cta | 1 |
| faq | 1 |
| footer-anchor | 1 |
| raw | 1 |
| runtime-partials | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Развели заявки по симптомам и узлам | pricing | 8.5 KB | 160 | no | src/pages/pishevarochnye-kotly/sections/025-pricing-razveli-zayavki-po-simptomam-i-uzlam.html |
| Что фиксируем до начала работ на объекте | pricing | 6.7 KB | 181 | no | src/pages/pishevarochnye-kotly/sections/029-pricing-chto-fiksiruem-do-nachala-rabot-na-ob-ekte.html |
| Ремонт пищеварочных котлов для ресторанов и столовых | mobile-contact | 6.2 KB | 112 | no | src/pages/pishevarochnye-kotly/sections/004-mobile-contact-remont-pischevarochnyh-kotlov-dlya-re.html |
| Частые вопросы по ремонту | faq | 6.0 KB | 193 | no | src/pages/pishevarochnye-kotly/sections/034-faq-chastye-voprosy-po-remontu.html |
| Согласовать выезд по котлу | lead-form | 5.5 KB | 94 | no | src/pages/pishevarochnye-kotly/sections/027-lead-form-soglasovat-vyezd-po-kotlu.html |
| Отдельные посадочные под Abat, КПЭМ, Apach, Atesy и Iterma | pricing | 5.4 KB | 199 | yes | src/components/shared/pricing/pricing-otdelnye-posadochnye-pod-abat-kpem-apach-atesy-i-i--6501b772607fe7ea.html |
| Разводим трафик по реальному симптому | pricing | 4.9 KB | 122 | no | src/pages/pishevarochnye-kotly/sections/010-pricing-razvodim-trafik-po-real-nomu-simptomu.html |
| Разводим заявки по симптому: нагрев, течь, электрика, H2O и Abat КПЭМ | lead-form | 4.8 KB | 131 | no | src/pages/pishevarochnye-kotly/sections/007-lead-form-razvodim-zayavki-po-simptomu-nagrev-tech-e.html |


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
