# Page Digest — routery.html

- Branch: household
- Role: service
- Title: Ремонт и настройка роутеров в Москве — MosPochin
- Description: Ремонт и настройка Wi-Fi роутеров TP-Link, ASUS, D-Link и Keenetic в Москве. Диагностика, выезд мастера, аккуратная настройка домашней сети.
- H1: Ремонт и настройка роутеров в Москве
- Canonical: https://mospochin.ru/routery.html
- Builder model: src/pages/routery/page.json
- Sections: 52 (43 local, 2 shared refs, 10 raw)
- Text words inside referenced sections: 2395

## Component mix

| Component | Count |
| --- | --- |
| pricing | 11 |
| raw | 10 |
| section | 7 |
| mobile-contact | 5 |
| contact-cta | 4 |
| proof | 4 |
| faq | 3 |
| layout-fragment | 2 |
| breadcrumb | 1 |
| footer-anchor | 1 |
| hero | 1 |
| lead-form | 1 |
| noscript | 1 |
| runtime-partials | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Ремонтируем все марки роутеров | pricing | 16.9 KB | 104 | no | src/pages/routery/sections/037-pricing-remontiruem-vse-marki-routerov.html |
| Настраиваем и чиним всё сетевое | pricing | 13.5 KB | 228 | no | src/pages/routery/sections/010-pricing-nastraivaem-i-chinim-vse-setevoe.html |
| Реальные вызовы на этой неделе | contact-cta | 8.3 KB | 108 | no | src/pages/routery/sections/019-contact-cta-real-nye-vyzovy-na-etoy-nedele.html |
| Частые вопросы про роутеры | faq | 8.0 KB | 216 | no | src/pages/routery/sections/030-faq-chastye-voprosy-pro-routery.html |
| Настройка и ремонт роутеров | faq | 7.3 KB | 176 | no | src/pages/routery/sections/042-faq-nastroyka-i-remont-routerov.html |
| Частые поломки роутеров | pricing | 6.3 KB | 122 | no | src/pages/routery/sections/031-pricing-chastye-polomki-routerov.html |
| Ремонт и настройка роутеров в Москве | hero | 6.3 KB | 77 | no | src/pages/routery/sections/005-hero-remont-i-nastroyka-routerov-v-moskve.html |
| 2.4ГГц vs 5ГГц vs 6ГГц — что выбрать | section | 5.9 KB | 93 | no | src/pages/routery/sections/023-section-2-4ggc-vs-5ggc-vs-6ggc-chto-vybrat.html |


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
