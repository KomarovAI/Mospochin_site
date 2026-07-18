# Page Digest — pishevarochnyj-kotel-parovodyanaya-rubashka.html

- Branch: restaurant
- Role: branch
- Title: Пароводяная рубашка пищеварочного котла — диагностика и ремонт | MosPochin
- Description: Диагностика пароводяной рубашки пищеварочного котла: уровень воды, сухой ход, давление, ТЭНы, клапаны, манометр и риск перегрева.
- H1: Диагностика пароводяной рубашки пищеварочного котла
- Canonical: https://mospochin.ru/pishevarochnyj-kotel-parovodyanaya-rubashka.html
- Builder model: src/pages/pishevarochnyj-kotel-parovodyanaya-rubashka/page.json
- Sections: 24 (9 local, 1 shared refs, 0 raw)
- Text words inside referenced sections: 992

## Component mix

| Component | Count |
| --- | --- |
| layout-fragment | 10 |
| mobile-contact | 4 |
| pricing | 3 |
| body-preamble | 1 |
| faq | 1 |
| footer-anchor | 1 |
| intent-diagnostic | 1 |
| lead-form | 1 |
| proof | 1 |
| runtime-partials | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Развели заявки по симптомам и узлам | pricing | 10.3 KB | 151 | no | src/pages/pishevarochnyj-kotel-parovodyanaya-rubashka/sections/015-pricing-razveli-zayavki-po-simptomam-i-uzlam.html |
| Отдельные посадочные под Abat, КПЭМ, Apach, Atesy и Iterma | pricing | 6.2 KB | 207 | no | src/pages/pishevarochnyj-kotel-parovodyanaya-rubashka/sections/009-pricing-otdel-nye-posadochnye-pod-abat-kpem-apach-at.html |
| Оставьте заявку на диагностику | lead-form | 5.8 KB | 69 | no | src/pages/pishevarochnyj-kotel-parovodyanaya-rubashka/sections/017-lead-form-ostav-te-zayavku-na-diagnostiku.html |
| Симптом → узел → риск простоя → диагностика | mobile-contact | 5.5 KB | 106 | no | src/pages/pishevarochnyj-kotel-parovodyanaya-rubashka/sections/005-mobile-contact-simptom-uzel-risk-prostoya-diagnostik.html |
| Развели ошибки КПЭМ по отдельным сценариям | pricing | 5.4 KB | 124 | no | src/pages/pishevarochnyj-kotel-parovodyanaya-rubashka/sections/012-pricing-razveli-oshibki-kpem-po-otdel-nym-scenariyam.html |
| Диагностическая граница интента | intent-diagnostic | 3.4 KB | 145 | no | src/components/parametric/kettle-intent-diagnostic/default.template.html |
| Диагностика пароводяной рубашки пищеварочного котла | mobile-contact | 3.1 KB | 41 | no | src/pages/pishevarochnyj-kotel-parovodyanaya-rubashka/sections/003-mobile-contact-diagnostika-parovodyanoy-rubashki-pis.html |
| Частые вопросы по этой неисправности | faq | 2.9 KB | 80 | no | src/pages/pishevarochnyj-kotel-parovodyanaya-rubashka/sections/018-faq-chastye-voprosy-po-etoy-neispravnosti.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- pishevarochnyj-kotel-parovodyanaya-rubashka.html
- src/site-builder.json
- src/pages/pishevarochnyj-kotel-parovodyanaya-rubashka/page.json
- src/pages/pishevarochnyj-kotel-parovodyanaya-rubashka/sections/

## Checks

- npm run doctor:page -- --page pishevarochnyj-kotel-parovodyanaya-rubashka.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page pishevarochnyj-kotel-parovodyanaya-rubashka.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
