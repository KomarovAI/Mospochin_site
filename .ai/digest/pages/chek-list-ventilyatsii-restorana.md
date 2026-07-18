# Page Digest — chek-list-ventilyatsii-restorana.html

- Branch: restaurant
- Role: service
- Title: Чек-лист вентиляции ресторана для управляющего
- Description: Краткий чек-лист: тяга, запахи, дым, шум, вибрация, фильтры, приток, конденсат, доступ к чистке и когда вызывать инженера.
- H1: Чек-лист вентиляции ресторана
- Canonical: https://mospochin.ru/chek-list-ventilyatsii-restorana.html
- Builder model: src/pages/chek-list-ventilyatsii-restorana/page.json
- Sections: 9 (4 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 927

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 4 |
| layout-fragment | 3 |
| breadcrumb | 1 |
| lead-form | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Чек-лист вентиляции ресторана | breadcrumb | 30.9 KB | 740 | no | src/pages/chek-list-ventilyatsii-restorana/sections/002-breadcrumb-chek-list-ventilyacii-restorana.html |
| Мобильные контактные элементы | mobile-contact | 9.2 KB | 110 | no | src/pages/chek-list-ventilyatsii-restorana/sections/001-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Мобильные контактные элементы | mobile-contact | 4.9 KB | 77 | no | src/pages/chek-list-ventilyatsii-restorana/sections/003-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Форма заявки | lead-form | 50 B | 0 | no | src/pages/chek-list-ventilyatsii-restorana/sections/007-lead-form-forma-zayavki.html |
| HTML-фрагмент | layout-fragment | 46 B | 0 | no | src/components/parametric/static/layout-fragment-technical-fragment-52c8755076d4.template.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| HTML-фрагмент | layout-fragment | 42 B | 0 | no | src/components/parametric/static/layout-fragment-technical-fragment-47228a35947e.template.html |
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
- chek-list-ventilyatsii-restorana.html
- src/site-builder.json
- src/pages/chek-list-ventilyatsii-restorana/page.json
- src/pages/chek-list-ventilyatsii-restorana/sections/

## Checks

- npm run doctor:restaurant-page -- --page chek-list-ventilyatsii-restorana.html
- npm run doctor:page -- --page chek-list-ventilyatsii-restorana.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page chek-list-ventilyatsii-restorana.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
