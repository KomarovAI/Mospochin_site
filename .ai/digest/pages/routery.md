# Page Digest — routery.html

- Branch: household
- Role: service
- Title: Ремонт и настройка роутеров в Москве — MosPochin
- Description: Ремонт и настройка Wi-Fi роутеров TP-Link, ASUS, D-Link и Keenetic в Москве. Диагностика, выезд мастера, аккуратная настройка домашней сети.
- H1: Ремонт и настройка роутеров в Москве
- Canonical: https://mospochin.ru/routery.html
- Builder model: src/pages/routery/page.json
- Sections: 50 (41 local, 5 shared refs, 9 raw)
- Text words inside referenced sections: 2561

## Component mix

| Component | Count |
| --- | --- |
| section | 10 |
| pricing | 9 |
| raw | 9 |
| mobile-contact | 7 |
| proof | 4 |
| contact-cta | 3 |
| faq | 3 |
| body-preamble | 1 |
| breadcrumb | 1 |
| hero | 1 |
| layout-fragment | 1 |
| lead-form | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Работаем с распространёнными марками роутеров | pricing | 16.5 KB | 109 | no | src/pages/routery/sections/036-pricing-rabotaem-s-rasprostranennymi-markami-routero.html |
| Настраиваем и чиним всё сетевое | section | 10.9 KB | 230 | no | src/pages/routery/sections/009-section-nastraivaem-i-chinim-vse-setevoe.html |
| Мобильные контактные элементы | mobile-contact | 7.1 KB | 78 | no | src/pages/routery/sections/002-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Настройка и ремонт роутеров | faq | 6.3 KB | 178 | no | src/pages/routery/sections/041-faq-nastroyka-i-remont-routerov.html |
| Частые вопросы про роутеры | faq | 6.2 KB | 216 | no | src/pages/routery/sections/029-faq-chastye-voprosy-pro-routery.html |
| Частые поломки роутеров | section | 6.2 KB | 121 | no | src/pages/routery/sections/030-section-chastye-polomki-routerov.html |
| Ремонт и настройка роутеров в Москве | hero | 5.7 KB | 89 | no | src/pages/routery/sections/004-hero-remont-i-nastroyka-routerov-v-moskve.html |
| Что случилось с роутером? | pricing | 4.9 KB | 41 | no | src/pages/routery/sections/016-pricing-chto-sluchilos-s-routerom.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/household-branch.json
- data/household-page-policy.json
- data/household-services.json
- data/household-taxonomy.json
- data/household-proof-layer.json
- routery.html
- src/site-builder.json
- src/pages/routery/page.json
- src/pages/routery/sections/

## Checks

- npm run doctor:household-page -- --page routery.html
- npm run doctor:page -- --page routery.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page routery.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
