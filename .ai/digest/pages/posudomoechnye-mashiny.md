# Page Digest — posudomoechnye-mashiny.html

- Branch: restaurant
- Role: service
- Title: Ремонт промышленных посудомоечных машин — MosPochin | MosPochin
- Description: Ремонт промышленных посудомоечных машин в Москве: диагностика фронтальных, купольных и конвейерных машин, восстановление нагрева, набора и слива воды.
- H1: Ремонт промышленных посудомоечных машин
- Canonical: https://mospochin.ru/posudomoechnye-mashiny.html
- Builder model: src/pages/posudomoechnye-mashiny/page.json
- Sections: 6 (4 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 1025

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 4 |
| breadcrumb | 1 |
| faq | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Ремонт промышленных посудомоечных машин | breadcrumb | 39.2 KB | 766 | no | src/pages/posudomoechnye-mashiny/sections/002-breadcrumb-remont-promyshlennyh-posudomoechnyh-mashi.html |
| Мобильные контактные элементы | mobile-contact | 9.2 KB | 110 | no | src/pages/posudomoechnye-mashiny/sections/001-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Мобильные контактные элементы | mobile-contact | 4.9 KB | 77 | no | src/pages/posudomoechnye-mashiny/sections/004-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Частые вопросы | faq | 1.9 KB | 72 | no | src/pages/posudomoechnye-mashiny/sections/003-faq-chastye-voprosy.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- data/restaurant-services.json
- data/restaurant-taxonomy.json
- data/restaurant-proof-layer.json
- data/restaurant-page-slots.json
- posudomoechnye-mashiny.html
- src/site-builder.json
- src/pages/posudomoechnye-mashiny/page.json
- src/pages/posudomoechnye-mashiny/sections/

## Checks

- npm run doctor:restaurant-page -- --page posudomoechnye-mashiny.html
- npm run doctor:page -- --page posudomoechnye-mashiny.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page posudomoechnye-mashiny.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
