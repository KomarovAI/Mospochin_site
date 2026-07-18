# Page Digest — diagnostika-promyshlennoy-posudomoechnoy-mashiny.html

- Branch: restaurant
- Role: branch
- Title: Диагностика промышленной посудомоечной машины | MosPochin
- Description: Диагностика промышленной посудомоечной машины по этапам цикла: питание, набор воды, нагрев, циркуляция, ополаскивание, дозирование и слив.
- H1: Диагностика промышленных посудомоечных машин
- Canonical: https://mospochin.ru/diagnostika-promyshlennoy-posudomoechnoy-mashiny.html
- Builder model: src/pages/diagnostika-promyshlennoy-posudomoechnoy-mashiny/page.json
- Sections: 6 (4 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 972

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 4 |
| breadcrumb | 1 |
| faq | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Диагностика промышленных посудомоечных машин | breadcrumb | 39.4 KB | 717 | no | src/pages/diagnostika-promyshlennoy-posudomoechnoy-mashiny/sections/002-breadcrumb-diagnostika-promyshlennyh-posudomoechnyh-.html |
| Мобильные контактные элементы | mobile-contact | 9.2 KB | 110 | no | src/pages/diagnostika-promyshlennoy-posudomoechnoy-mashiny/sections/001-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Мобильные контактные элементы | mobile-contact | 4.9 KB | 77 | no | src/pages/diagnostika-promyshlennoy-posudomoechnoy-mashiny/sections/004-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Частые вопросы | faq | 1.8 KB | 68 | no | src/pages/diagnostika-promyshlennoy-posudomoechnoy-mashiny/sections/003-faq-chastye-voprosy.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- diagnostika-promyshlennoy-posudomoechnoy-mashiny.html
- src/site-builder.json
- src/pages/diagnostika-promyshlennoy-posudomoechnoy-mashiny/page.json
- src/pages/diagnostika-promyshlennoy-posudomoechnoy-mashiny/sections/

## Checks

- npm run doctor:page -- --page diagnostika-promyshlennoy-posudomoechnoy-mashiny.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page diagnostika-promyshlennoy-posudomoechnoy-mashiny.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
