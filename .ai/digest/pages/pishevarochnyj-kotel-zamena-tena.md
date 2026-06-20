# Page Digest — pishevarochnyj-kotel-zamena-tena.html

- Branch: restaurant
- Role: branch
- Title: Замена ТЭНа пищеварочного котла — ремонт в Москве | MosPochin
- Description: Замена и диагностика ТЭНов пищеварочного котла: нет нагрева, долгий нагрев, выбивает автомат, перегрев или сухой ход. Выезд на объект в Москве.
- H1: Замена ТЭНа пищеварочного котла
- Canonical: https://mospochin.ru/pishevarochnyj-kotel-zamena-tena.html
- Builder model: src/pages/pishevarochnyj-kotel-zamena-tena/page.json
- Sections: 23 (9 local, 3 shared refs, 0 raw)
- Text words inside referenced sections: 862

## Component mix

| Component | Count |
| --- | --- |
| layout-fragment | 10 |
| mobile-contact | 4 |
| pricing | 3 |
| body-preamble | 1 |
| faq | 1 |
| footer-anchor | 1 |
| lead-form | 1 |
| proof | 1 |
| runtime-partials | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Развели заявки по симптомам и узлам | pricing | 8.5 KB | 161 | no | src/pages/pishevarochnyj-kotel-zamena-tena/sections/015-pricing-razveli-zayavki-po-simptomam-i-uzlam.html |
| Оставьте заявку на диагностику | lead-form | 5.4 KB | 69 | no | src/pages/pishevarochnyj-kotel-zamena-tena/sections/017-lead-form-ostav-te-zayavku-na-diagnostiku.html |
| Отдельные посадочные под Abat, КПЭМ, Apach, Atesy и Iterma | pricing | 5.4 KB | 199 | yes | src/components/shared/pricing/pricing-otdelnye-posadochnye-pod-abat-kpem-apach-atesy-i-i--6501b772607fe7ea.html |
| Симптом → узел → риск простоя → диагностика | mobile-contact | 5.3 KB | 116 | no | src/pages/pishevarochnyj-kotel-zamena-tena/sections/005-mobile-contact-simptom-uzel-risk-prostoya-diagnostik.html |
| Развели ошибки КПЭМ по отдельным сценариям | pricing | 4.6 KB | 129 | yes | src/components/shared/pricing/pricing-razveli-oshibki-kpem-po-otdelnym-scenariyam--b9734b323f0f36f9.html |
| Замена ТЭНа пищеварочного котла | mobile-contact | 3.0 KB | 42 | no | src/pages/pishevarochnyj-kotel-zamena-tena/sections/003-mobile-contact-zamena-tena-pischevarochnogo-kotla.html |
| Частые вопросы по этой неисправности | faq | 2.8 KB | 77 | no | src/pages/pishevarochnyj-kotel-zamena-tena/sections/018-faq-chastye-voprosy-po-etoy-neispravnosti.html |
| Не просто статья, а страница под заявку | proof | 2.1 KB | 69 | yes | src/components/shared/proof/proof-ne-prosto-statya-a-stranica-pod-zayavku--ce9c82e757dac360.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- pishevarochnyj-kotel-zamena-tena.html
- src/site-builder.json
- src/pages/pishevarochnyj-kotel-zamena-tena/page.json
- src/pages/pishevarochnyj-kotel-zamena-tena/sections/

## Checks

- npm run doctor:page -- --page pishevarochnyj-kotel-zamena-tena.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page pishevarochnyj-kotel-zamena-tena.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
