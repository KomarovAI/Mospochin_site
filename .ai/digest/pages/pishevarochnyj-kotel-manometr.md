# Page Digest — pishevarochnyj-kotel-manometr.html

- Branch: restaurant
- Role: branch
- Title: Манометр пищеварочного котла и давление в рубашке — ремонт | MosPochin
- Description: Диагностика манометра и давления пищеварочного котла: аварийное давление, неверные показания, проблемы рубашки, клапанов и автоматики.
- H1: Манометр и давление пищеварочного котла
- Canonical: https://mospochin.ru/pishevarochnyj-kotel-manometr.html
- Builder model: src/pages/pishevarochnyj-kotel-manometr/page.json
- Sections: 23 (9 local, 3 shared refs, 0 raw)
- Text words inside referenced sections: 843

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
| Развели заявки по симптомам и узлам | pricing | 8.5 KB | 160 | no | src/pages/pishevarochnyj-kotel-manometr/sections/015-pricing-razveli-zayavki-po-simptomam-i-uzlam.html |
| Отдельные посадочные под Abat, КПЭМ, Apach, Atesy и Iterma | pricing | 5.4 KB | 199 | yes | src/components/shared/pricing/pricing-otdelnye-posadochnye-pod-abat-kpem-apach-atesy-i-i--6501b772607fe7ea.html |
| Оставьте заявку на диагностику | lead-form | 5.3 KB | 70 | no | src/pages/pishevarochnyj-kotel-manometr/sections/017-lead-form-ostav-te-zayavku-na-diagnostiku.html |
| Симптом → узел → риск простоя → диагностика | mobile-contact | 5.2 KB | 103 | no | src/pages/pishevarochnyj-kotel-manometr/sections/005-mobile-contact-simptom-uzel-risk-prostoya-diagnostik.html |
| Развели ошибки КПЭМ по отдельным сценариям | pricing | 4.6 KB | 129 | yes | src/components/shared/pricing/pricing-razveli-oshibki-kpem-po-otdelnym-scenariyam--b9734b323f0f36f9.html |
| Манометр и давление пищеварочного котла | mobile-contact | 2.8 KB | 41 | no | src/pages/pishevarochnyj-kotel-manometr/sections/003-mobile-contact-manometr-i-davlenie-pischevarochnogo-.html |
| Частые вопросы по этой неисправности | faq | 2.8 KB | 72 | no | src/pages/pishevarochnyj-kotel-manometr/sections/018-faq-chastye-voprosy-po-etoy-neispravnosti.html |
| Не просто статья, а страница под заявку | proof | 2.1 KB | 69 | yes | src/components/shared/proof/proof-ne-prosto-statya-a-stranica-pod-zayavku--ce9c82e757dac360.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- pishevarochnyj-kotel-manometr.html
- src/site-builder.json
- src/pages/pishevarochnyj-kotel-manometr/page.json
- src/pages/pishevarochnyj-kotel-manometr/sections/

## Checks

- npm run doctor:page -- --page pishevarochnyj-kotel-manometr.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page pishevarochnyj-kotel-manometr.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
