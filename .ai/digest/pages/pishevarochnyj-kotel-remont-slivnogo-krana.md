# Page Digest — pishevarochnyj-kotel-remont-slivnogo-krana.html

- Branch: restaurant
- Role: branch
- Title: Ремонт сливного крана пищеварочного котла — Москва | MosPochin
- Description: Ремонт и замена сливного крана пищеварочного котла: течь, капает, не закрывается, забился или прокладка не держит. Выезд на кухню в Москве.
- H1: Ремонт сливного крана пищеварочного котла
- Canonical: https://mospochin.ru/pishevarochnyj-kotel-remont-slivnogo-krana.html
- Builder model: src/pages/pishevarochnyj-kotel-remont-slivnogo-krana/page.json
- Sections: 23 (11 local, 1 shared refs, 0 raw)
- Text words inside referenced sections: 850

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
| Развели заявки по симптомам и узлам | pricing | 10.4 KB | 160 | no | src/pages/pishevarochnyj-kotel-remont-slivnogo-krana/sections/015-pricing-razveli-zayavki-po-simptomam-i-uzlam.html |
| Отдельные посадочные под Abat, КПЭМ, Apach, Atesy и Iterma | pricing | 6.1 KB | 199 | no | src/pages/pishevarochnyj-kotel-remont-slivnogo-krana/sections/009-pricing-otdel-nye-posadochnye-pod-abat-kpem-apach-at.html |
| Оставьте заявку на диагностику | lead-form | 5.7 KB | 70 | no | src/pages/pishevarochnyj-kotel-remont-slivnogo-krana/sections/017-lead-form-ostav-te-zayavku-na-diagnostiku.html |
| Развели ошибки КПЭМ по отдельным сценариям | pricing | 5.4 KB | 129 | no | src/pages/pishevarochnyj-kotel-remont-slivnogo-krana/sections/012-pricing-razveli-oshibki-kpem-po-otdel-nym-scenariyam.html |
| Симптом → узел → риск простоя → диагностика | mobile-contact | 5.3 KB | 103 | no | src/pages/pishevarochnyj-kotel-remont-slivnogo-krana/sections/005-mobile-contact-simptom-uzel-risk-prostoya-diagnostik.html |
| Ремонт сливного крана пищеварочного котла | mobile-contact | 3.0 KB | 40 | no | src/pages/pishevarochnyj-kotel-remont-slivnogo-krana/sections/003-mobile-contact-remont-slivnogo-krana-pischevarochnog.html |
| Частые вопросы по этой неисправности | faq | 2.8 KB | 80 | no | src/pages/pishevarochnyj-kotel-remont-slivnogo-krana/sections/018-faq-chastye-voprosy-po-etoy-neispravnosti.html |
| Не просто статья, а страница под заявку | proof | 2.1 KB | 69 | yes | src/components/shared/proof/proof-ne-prosto-statya-a-stranica-pod-zayavku--ce9c82e757dac360.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- pishevarochnyj-kotel-remont-slivnogo-krana.html
- src/site-builder.json
- src/pages/pishevarochnyj-kotel-remont-slivnogo-krana/page.json
- src/pages/pishevarochnyj-kotel-remont-slivnogo-krana/sections/

## Checks

- npm run doctor:page -- --page pishevarochnyj-kotel-remont-slivnogo-krana.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page pishevarochnyj-kotel-remont-slivnogo-krana.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
