# Page Digest — pishevarochnyj-kotel-datchik-temperatury.html

- Branch: restaurant
- Role: branch
- Title: Датчик температуры пищеварочного котла — диагностика и замена | MosPochin
- Description: Диагностика датчика температуры пищеварочного котла: ошибка E01/E02, неверный нагрев, перегрев, не держит температуру или блокировка работы.
- H1: Датчик температуры пищеварочного котла
- Canonical: https://mospochin.ru/pishevarochnyj-kotel-datchik-temperatury.html
- Builder model: src/pages/pishevarochnyj-kotel-datchik-temperatury/page.json
- Sections: 24 (9 local, 1 shared refs, 0 raw)
- Text words inside referenced sections: 990

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
| Развели заявки по симптомам и узлам | pricing | 10.3 KB | 151 | no | src/pages/pishevarochnyj-kotel-datchik-temperatury/sections/015-pricing-razveli-zayavki-po-simptomam-i-uzlam.html |
| Отдельные посадочные под Abat, КПЭМ, Apach, Atesy и Iterma | pricing | 6.2 KB | 207 | no | src/pages/pishevarochnyj-kotel-datchik-temperatury/sections/009-pricing-otdel-nye-posadochnye-pod-abat-kpem-apach-at.html |
| Оставьте заявку на диагностику | lead-form | 5.7 KB | 68 | no | src/pages/pishevarochnyj-kotel-datchik-temperatury/sections/017-lead-form-ostav-te-zayavku-na-diagnostiku.html |
| Развели ошибки КПЭМ по отдельным сценариям | pricing | 5.4 KB | 124 | no | src/pages/pishevarochnyj-kotel-datchik-temperatury/sections/012-pricing-razveli-oshibki-kpem-po-otdel-nym-scenariyam.html |
| Симптом → узел → риск простоя → диагностика | mobile-contact | 5.4 KB | 103 | no | src/pages/pishevarochnyj-kotel-datchik-temperatury/sections/005-mobile-contact-simptom-uzel-risk-prostoya-diagnostik.html |
| Диагностическая граница интента | intent-diagnostic | 3.6 KB | 154 | no | src/components/parametric/kettle-intent-diagnostic/default.template.html |
| Датчик температуры пищеварочного котла | mobile-contact | 3.0 KB | 37 | no | src/pages/pishevarochnyj-kotel-datchik-temperatury/sections/003-mobile-contact-datchik-temperatury-pischevarochnogo-.html |
| Частые вопросы по этой неисправности | faq | 2.7 KB | 77 | no | src/pages/pishevarochnyj-kotel-datchik-temperatury/sections/018-faq-chastye-voprosy-po-etoy-neispravnosti.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- pishevarochnyj-kotel-datchik-temperatury.html
- src/site-builder.json
- src/pages/pishevarochnyj-kotel-datchik-temperatury/page.json
- src/pages/pishevarochnyj-kotel-datchik-temperatury/sections/

## Checks

- npm run doctor:page -- --page pishevarochnyj-kotel-datchik-temperatury.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page pishevarochnyj-kotel-datchik-temperatury.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
