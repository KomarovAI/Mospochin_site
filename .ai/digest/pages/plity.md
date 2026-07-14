# Page Digest — plity.html

- Branch: household
- Role: service
- Title: Ремонт плит и духовок в Москве на дому — MosPochin
- Description: Ремонт газовых, электрических и индукционных плит и духовок на дому в Москве. Согласуем работы до ремонта и даём гарантию.
- H1: Плита не греет, искрит или пахнет газом? Починим дома без навязанных замен
- Canonical: https://mospochin.ru/plity.html
- Builder model: src/pages/plity/page.json
- Sections: 47 (33 local, 3 shared refs, 0 raw)
- Text words inside referenced sections: 2881

## Component mix

| Component | Count |
| --- | --- |
| pricing | 11 |
| proof | 10 |
| layout-fragment | 7 |
| contact-cta | 4 |
| faq | 3 |
| mobile-contact | 3 |
| related-links | 2 |
| body-preamble | 1 |
| breadcrumb | 1 |
| footer-anchor | 1 |
| hero | 1 |
| lead-form | 1 |
| runtime-partials | 1 |
| section | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Ремонтируем все марки плит и духовок | pricing | 18.6 KB | 108 | no | src/pages/plity/sections/025-pricing-remontiruem-vse-marki-plit-i-duhovok.html |
| Что клиент понимает ещё до начала работ | pricing | 13.1 KB | 429 | no | src/pages/plity/sections/038-pricing-chto-klient-ponimaet-esche-do-nachala-rabot.html |
| Ремонтируем все типы плит и духовок | pricing | 9.7 KB | 184 | no | src/pages/plity/sections/009-pricing-remontiruem-vse-tipy-plit-i-duhovok.html |
| Реальные ремонты на этой неделе | contact-cta | 8.6 KB | 124 | no | src/pages/plity/sections/018-contact-cta-real-nye-remonty-na-etoy-nedele.html |
| Получите понятный сценарий ремонта плиты | lead-form | 6.8 KB | 86 | no | src/pages/plity/sections/034-lead-form-poluchite-ponyatnyy-scenariy-remonta-plity.html |
| Цены на ремонт плит и духовок | pricing | 6.3 KB | 145 | no | src/pages/plity/sections/020-pricing-ceny-na-remont-plit-i-duhovok.html |
| Частые поломки плит и духовок | pricing | 6.3 KB | 120 | no | src/pages/plity/sections/019-pricing-chastye-polomki-plit-i-duhovok.html |
| Что случилось с плитой или духовкой? | pricing | 5.8 KB | 47 | no | src/pages/plity/sections/016-pricing-chto-sluchilos-s-plitoy-ili-duhovkoy.html |


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
- plity.html
- src/site-builder.json
- src/pages/plity/page.json
- src/pages/plity/sections/

## Checks

- npm run doctor:household-page -- --page plity.html
- npm run doctor:page -- --page plity.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page plity.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
