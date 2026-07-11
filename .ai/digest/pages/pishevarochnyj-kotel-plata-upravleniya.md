# Page Digest — pishevarochnyj-kotel-plata-upravleniya.html

- Branch: restaurant
- Role: branch
- Title: Плата управления пищеварочного котла — диагностика и ремонт | MosPochin
- Description: Диагностика платы управления пищеварочного котла: не включается, ошибки, не запускается нагрев, не реагирует панель, сбои автоматики.
- H1: Плата управления пищеварочного котла
- Canonical: https://mospochin.ru/pishevarochnyj-kotel-plata-upravleniya.html
- Builder model: src/pages/pishevarochnyj-kotel-plata-upravleniya/page.json
- Sections: 23 (11 local, 1 shared refs, 0 raw)
- Text words inside referenced sections: 863

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
| Развели заявки по симптомам и узлам | pricing | 10.3 KB | 161 | no | src/pages/pishevarochnyj-kotel-plata-upravleniya/sections/015-pricing-razveli-zayavki-po-simptomam-i-uzlam.html |
| Отдельные посадочные под Abat, КПЭМ, Apach, Atesy и Iterma | pricing | 6.1 KB | 199 | no | src/pages/pishevarochnyj-kotel-plata-upravleniya/sections/009-pricing-otdel-nye-posadochnye-pod-abat-kpem-apach-at.html |
| Оставьте заявку на диагностику | lead-form | 5.7 KB | 70 | no | src/pages/pishevarochnyj-kotel-plata-upravleniya/sections/017-lead-form-ostav-te-zayavku-na-diagnostiku.html |
| Развели ошибки КПЭМ по отдельным сценариям | pricing | 5.3 KB | 129 | no | src/pages/pishevarochnyj-kotel-plata-upravleniya/sections/012-pricing-razveli-oshibki-kpem-po-otdel-nym-scenariyam.html |
| Симптом → узел → риск простоя → диагностика | mobile-contact | 5.3 KB | 110 | no | src/pages/pishevarochnyj-kotel-plata-upravleniya/sections/005-mobile-contact-simptom-uzel-risk-prostoya-diagnostik.html |
| Плата управления пищеварочного котла | mobile-contact | 3.0 KB | 42 | no | src/pages/pishevarochnyj-kotel-plata-upravleniya/sections/003-mobile-contact-plata-upravleniya-pischevarochnogo-ko.html |
| Частые вопросы по этой неисправности | faq | 2.9 KB | 83 | no | src/pages/pishevarochnyj-kotel-plata-upravleniya/sections/018-faq-chastye-voprosy-po-etoy-neispravnosti.html |
| Не просто статья, а страница под заявку | proof | 2.1 KB | 69 | yes | src/components/shared/proof/proof-ne-prosto-statya-a-stranica-pod-zayavku--ce9c82e757dac360.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- pishevarochnyj-kotel-plata-upravleniya.html
- src/site-builder.json
- src/pages/pishevarochnyj-kotel-plata-upravleniya/page.json
- src/pages/pishevarochnyj-kotel-plata-upravleniya/sections/

## Checks

- npm run doctor:page -- --page pishevarochnyj-kotel-plata-upravleniya.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page pishevarochnyj-kotel-plata-upravleniya.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
