# Page Digest — zapah-iz-kuhni-v-zal.html

- Branch: restaurant
- Role: service
- Title: Запах из кухни в зал ресторана — диагностика вентиляции
- Description: Разбираем причины запаха из кухни в зал: слабая вытяжка, обратная тяга, недостаток притока, загрязнение фильтров и воздуховодов.
- H1: Запах из кухни попадает в зал
- Canonical: https://mospochin.ru/zapah-iz-kuhni-v-zal.html
- Builder model: src/pages/zapah-iz-kuhni-v-zal/page.json
- Sections: 9 (4 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 961

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
| Запах из кухни попадает в зал | breadcrumb | 29.7 KB | 774 | no | src/pages/zapah-iz-kuhni-v-zal/sections/002-breadcrumb-zapah-iz-kuhni-popadaet-v-zal.html |
| Мобильные контактные элементы | mobile-contact | 9.1 KB | 110 | no | src/pages/zapah-iz-kuhni-v-zal/sections/001-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Мобильные контактные элементы | mobile-contact | 4.8 KB | 77 | no | src/pages/zapah-iz-kuhni-v-zal/sections/003-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Форма заявки | lead-form | 50 B | 0 | no | src/pages/zapah-iz-kuhni-v-zal/sections/007-lead-form-forma-zayavki.html |
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
- zapah-iz-kuhni-v-zal.html
- src/site-builder.json
- src/pages/zapah-iz-kuhni-v-zal/page.json
- src/pages/zapah-iz-kuhni-v-zal/sections/

## Checks

- npm run doctor:restaurant-page -- --page zapah-iz-kuhni-v-zal.html
- npm run doctor:page -- --page zapah-iz-kuhni-v-zal.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page zapah-iz-kuhni-v-zal.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
