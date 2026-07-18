# Page Digest — pishevarochnyj-kotel-ne-vklyuchaetsya.html

- Branch: restaurant
- Role: branch
- Title: Пищеварочный котел не включается — ремонт в Москве | MosPochin
- Description: Пищеварочный котел не включается, не запускает нагрев или панель не реагирует: диагностика питания, кнопок, автоматики, платы, контакторов и защит.
- H1: Пищеварочный котел не включается
- Canonical: https://mospochin.ru/pishevarochnyj-kotel-ne-vklyuchaetsya.html
- Builder model: src/pages/pishevarochnyj-kotel-ne-vklyuchaetsya/page.json
- Sections: 24 (9 local, 1 shared refs, 0 raw)
- Text words inside referenced sections: 1012

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
| Развели заявки по симптомам и узлам | pricing | 10.3 KB | 151 | no | src/pages/pishevarochnyj-kotel-ne-vklyuchaetsya/sections/015-pricing-razveli-zayavki-po-simptomam-i-uzlam.html |
| Отдельные посадочные под Abat, КПЭМ, Apach, Atesy и Iterma | pricing | 6.2 KB | 207 | no | src/pages/pishevarochnyj-kotel-ne-vklyuchaetsya/sections/009-pricing-otdel-nye-posadochnye-pod-abat-kpem-apach-at.html |
| Оставьте заявку на диагностику | lead-form | 5.7 KB | 71 | no | src/pages/pishevarochnyj-kotel-ne-vklyuchaetsya/sections/017-lead-form-ostav-te-zayavku-na-diagnostiku.html |
| Развели ошибки КПЭМ по отдельным сценариям | pricing | 5.4 KB | 124 | no | src/pages/pishevarochnyj-kotel-ne-vklyuchaetsya/sections/012-pricing-razveli-oshibki-kpem-po-otdel-nym-scenariyam.html |
| Симптом → узел → риск простоя → диагностика | mobile-contact | 5.3 KB | 110 | no | src/pages/pishevarochnyj-kotel-ne-vklyuchaetsya/sections/005-mobile-contact-simptom-uzel-risk-prostoya-diagnostik.html |
| Диагностическая граница интента | intent-diagnostic | 3.4 KB | 151 | no | src/components/parametric/kettle-intent-diagnostic/default.template.html |
| Пищеварочный котел не включается | mobile-contact | 3.0 KB | 44 | no | src/pages/pishevarochnyj-kotel-ne-vklyuchaetsya/sections/003-mobile-contact-pischevarochnyy-kotel-ne-vklyuchaetsy.html |
| Частые вопросы по этой неисправности | faq | 2.9 KB | 85 | no | src/pages/pishevarochnyj-kotel-ne-vklyuchaetsya/sections/018-faq-chastye-voprosy-po-etoy-neispravnosti.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- pishevarochnyj-kotel-ne-vklyuchaetsya.html
- src/site-builder.json
- src/pages/pishevarochnyj-kotel-ne-vklyuchaetsya/page.json
- src/pages/pishevarochnyj-kotel-ne-vklyuchaetsya/sections/

## Checks

- npm run doctor:page -- --page pishevarochnyj-kotel-ne-vklyuchaetsya.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page pishevarochnyj-kotel-ne-vklyuchaetsya.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
