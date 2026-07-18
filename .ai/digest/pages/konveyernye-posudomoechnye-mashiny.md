# Page Digest — konveyernye-posudomoechnye-mashiny.html

- Branch: restaurant
- Role: branch
- Title: Конвейерные посудомоечные машины | MosPochin
- Description: Конвейерные посудомоечные машины: кассетные и пальчиковые линии, зоны предварительной мойки, ополаскивания и сушки, диагностика транспорта и гидравлики.
- H1: Кассетные и пальчиковые посудомоечные линии
- Canonical: https://mospochin.ru/konveyernye-posudomoechnye-mashiny.html
- Builder model: src/pages/konveyernye-posudomoechnye-mashiny/page.json
- Sections: 6 (4 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 936

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 4 |
| breadcrumb | 1 |
| faq | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Кассетные и пальчиковые посудомоечные линии | breadcrumb | 33.5 KB | 685 | no | src/pages/konveyernye-posudomoechnye-mashiny/sections/002-breadcrumb-kassetnye-i-pal-chikovye-posudomoechnye-l.html |
| Мобильные контактные элементы | mobile-contact | 9.2 KB | 110 | no | src/pages/konveyernye-posudomoechnye-mashiny/sections/001-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Мобильные контактные элементы | mobile-contact | 4.9 KB | 77 | no | src/pages/konveyernye-posudomoechnye-mashiny/sections/004-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Частые вопросы | faq | 1.9 KB | 64 | no | src/pages/konveyernye-posudomoechnye-mashiny/sections/003-faq-chastye-voprosy.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- konveyernye-posudomoechnye-mashiny.html
- src/site-builder.json
- src/pages/konveyernye-posudomoechnye-mashiny/page.json
- src/pages/konveyernye-posudomoechnye-mashiny/sections/

## Checks

- npm run doctor:page -- --page konveyernye-posudomoechnye-mashiny.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page konveyernye-posudomoechnye-mashiny.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
