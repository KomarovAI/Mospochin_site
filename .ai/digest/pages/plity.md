# Page Digest — plity.html

- Branch: household
- Role: service
- Title: Ремонт плит и духовок в Москве на дому — MosPochin
- Description: Ремонт газовых, электрических и индукционных плит и духовок на дому в Москве. Согласуем работы до ремонта и даём гарантию.
- H1: Плита не греет, искрит или пахнет газом? Починим дома без навязанных замен
- Canonical: https://mospochin.ru/plity.html
- Builder model: src/pages/plity/page.json
- Sections: 48 (40 local, 3 shared refs, 8 raw)
- Text words inside referenced sections: 2855

## Component mix

| Component | Count |
| --- | --- |
| pricing | 12 |
| proof | 9 |
| raw | 8 |
| contact-cta | 4 |
| faq | 3 |
| mobile-contact | 3 |
| related-links | 2 |
| breadcrumb | 1 |
| footer-anchor | 1 |
| hero | 1 |
| lead-form | 1 |
| noscript | 1 |
| runtime-partials | 1 |
| section | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Ремонтируем все марки плит и духовок | pricing | 18.6 KB | 108 | no | src/pages/plity/sections/026-pricing-remontiruem-vse-marki-plit-i-duhovok.html |
| Что клиент понимает ещё до начала работ | pricing | 13.0 KB | 427 | no | src/pages/plity/sections/039-pricing-chto-klient-ponimaet-esche-do-nachala-rabot.html |
| Ремонтируем все типы плит и духовок | pricing | 9.7 KB | 184 | no | src/pages/plity/sections/010-pricing-remontiruem-vse-tipy-plit-i-duhovok.html |
| Реальные ремонты на этой неделе | contact-cta | 8.3 KB | 124 | no | src/pages/plity/sections/019-contact-cta-real-nye-remonty-na-etoy-nedele.html |
| Получите понятный сценарий ремонта плиты | lead-form | 6.6 KB | 86 | no | src/pages/plity/sections/035-lead-form-poluchite-ponyatnyy-scenariy-remonta-plity.html |
| Частые поломки плит и духовок | pricing | 6.3 KB | 121 | no | src/pages/plity/sections/020-pricing-chastye-polomki-plit-i-duhovok.html |
| Цены на ремонт плит и духовок | pricing | 6.1 KB | 136 | no | src/pages/plity/sections/021-pricing-ceny-na-remont-plit-i-duhovok.html |
| Что говорят наши клиенты | proof | 5.4 KB | 150 | no | src/pages/plity/sections/023-proof-chto-govoryat-nashi-klienty.html |


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
