# Page Digest — pishevarochnyj-kotel-abat-h20.html

- Branch: restaurant
- Role: branch
- Title: Ошибка H20 / Н20 на пищеварочном котле Abat КПЭМ — сухой ход | MosPochin
- Description: Ошибка H20 или Н20 на Abat КПЭМ: низкий уровень воды в пароводяной рубашке, сухой ход, датчик уровня, клапан залива и защита ТЭНов.
- H1: Ошибка H20 / Н20 на пищеварочном котле Abat КПЭМ
- Canonical: https://mospochin.ru/pishevarochnyj-kotel-abat-h20.html
- Builder model: src/pages/pishevarochnyj-kotel-abat-h20/page.json
- Sections: 20 (10 local, 1 shared refs, 0 raw)
- Text words inside referenced sections: 803

## Component mix

| Component | Count |
| --- | --- |
| layout-fragment | 8 |
| mobile-contact | 4 |
| pricing | 3 |
| body-preamble | 1 |
| faq | 1 |
| footer-anchor | 1 |
| lead-form | 1 |
| runtime-partials | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Переходы по симптомам, узлам и кодам | pricing | 6.3 KB | 132 | no | src/pages/pishevarochnyj-kotel-abat-h20/sections/007-pricing-perehody-po-simptomam-uzlam-i-kodam.html |
| Отправьте код и шильдик инженеру | lead-form | 5.6 KB | 83 | no | src/pages/pishevarochnyj-kotel-abat-h20/sections/014-lead-form-otprav-te-kod-i-shil-dik-inzheneru.html |
| Отдельные посадочные под Abat, КПЭМ, Apach, Atesy и Iterma | pricing | 5.4 KB | 199 | yes | src/components/shared/pricing/pricing-otdelnye-posadochnye-pod-abat-kpem-apach-atesy-i-i--6501b772607fe7ea.html |
| Не просто сбросить ошибку, а найти причину | mobile-contact | 5.3 KB | 115 | no | src/pages/pishevarochnyj-kotel-abat-h20/sections/005-mobile-contact-ne-prosto-sbrosit-oshibku-a-nayti-pri.html |
| Ошибка H20 / Н20 на пищеварочном котле Abat КПЭМ | mobile-contact | 4.1 KB | 87 | no | src/pages/pishevarochnyj-kotel-abat-h20/sections/003-mobile-contact-oshibka-h20-n20-na-pischevarochnom-ko.html |
| Развели ошибки КПЭМ по отдельным сценариям | pricing | 3.9 KB | 108 | no | src/pages/pishevarochnyj-kotel-abat-h20/sections/012-pricing-razveli-oshibki-kpem-po-otdel-nym-scenariyam.html |
| Частые вопросы по H20 / Н20 | faq | 2.8 KB | 79 | no | src/pages/pishevarochnyj-kotel-abat-h20/sections/015-faq-chastye-voprosy-po-h20-n20.html |
| Секция 1 | body-preamble | 73 B | 0 | no | src/pages/pishevarochnyj-kotel-abat-h20/sections/001-body-preamble-sekciya-1.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- pishevarochnyj-kotel-abat-h20.html
- src/site-builder.json
- src/pages/pishevarochnyj-kotel-abat-h20/page.json
- src/pages/pishevarochnyj-kotel-abat-h20/sections/

## Checks

- npm run doctor:page -- --page pishevarochnyj-kotel-abat-h20.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page pishevarochnyj-kotel-abat-h20.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
