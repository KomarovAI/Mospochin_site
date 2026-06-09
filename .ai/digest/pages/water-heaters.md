# Page Digest — water-heaters.html

- Branch: household
- Role: service
- Title: Ремонт водонагревателей в Москве на дому — MosPochin
- Description: Ремонт накопительных, проточных и газовых водонагревателей на дому в Москве. Диагностика, согласование работ и аккуратное восстановление техники с гарантией.
- H1: Ремонт водонагревателей на дому в Москве
- Canonical: https://mospochin.ru/water-heaters.html
- Builder model: src/pages/water-heaters/page.json
- Sections: 49 (35 local, 1 shared refs, 2 raw)
- Text words inside referenced sections: 2507

## Component mix

| Component | Count |
| --- | --- |
| pricing | 10 |
| proof | 10 |
| layout-fragment | 8 |
| mobile-contact | 5 |
| contact-cta | 2 |
| hero | 2 |
| raw | 2 |
| related-links | 2 |
| section | 2 |
| breadcrumb | 1 |
| faq | 1 |
| footer-anchor | 1 |
| lead-form | 1 |
| noscript | 1 |
| runtime-partials | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Ремонтируем водонагреватели известных марок | hero | 17.4 KB | 129 | no | src/pages/water-heaters/sections/024-hero-remontiruem-vodonagrevateli-izvestnyh-marok.html |
| Что клиент понимает ещё до начала работ | pricing | 13.0 KB | 425 | no | src/pages/water-heaters/sections/036-pricing-chto-klient-ponimaet-esche-do-nachala-rabot.html |
| Ремонтируем все типы водонагревателей | pricing | 9.9 KB | 205 | no | src/pages/water-heaters/sections/009-pricing-remontiruem-vse-tipy-vodonagrevateley.html |
| Реальные ремонты на этой неделе | contact-cta | 8.3 KB | 130 | no | src/pages/water-heaters/sections/016-contact-cta-real-nye-remonty-na-etoy-nedele.html |
| Оставьте заявку на ремонт | lead-form | 6.5 KB | 80 | no | src/pages/water-heaters/sections/034-lead-form-ostav-te-zayavku-na-remont.html |
| Частые поломки водонагревателей | pricing | 6.4 KB | 135 | no | src/pages/water-heaters/sections/017-pricing-chastye-polomki-vodonagrevateley.html |
| Ремонт водонагревателей на дому в Москве | hero | 6.0 KB | 64 | no | src/pages/water-heaters/sections/005-hero-remont-vodonagrevateley-na-domu-v-moskve.html |
| Цены на ремонт водонагревателей | pricing | 5.9 KB | 112 | no | src/pages/water-heaters/sections/018-pricing-ceny-na-remont-vodonagrevateley.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/household-branch.json
- data/household-page-policy.json
- data/household-services.json
- data/household-taxonomy.json
- data/household-proof-layer.json
- data/household-page-slots.json
- water-heaters.html
- src/site-builder.json
- src/pages/water-heaters/page.json
- src/pages/water-heaters/sections/

## Checks

- npm run doctor:household-page -- --page water-heaters.html
- npm run doctor:page -- --page water-heaters.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page water-heaters.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
