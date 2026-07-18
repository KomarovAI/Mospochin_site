# Page Digest — kotlomoechnye-mashiny.html

- Branch: restaurant
- Role: branch
- Title: Котломоечные машины для ресторанов | MosPochin
- Description: Профессиональные котломоечные машины для мойки кастрюль, гастроёмкостей и кухонного инвентаря: устройство, загрузка, гидравлика и диагностика.
- H1: Профессиональные котломоечные машины
- Canonical: https://mospochin.ru/kotlomoechnye-mashiny.html
- Builder model: src/pages/kotlomoechnye-mashiny/page.json
- Sections: 6 (4 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 889

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 4 |
| breadcrumb | 1 |
| faq | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Профессиональные котломоечные машины | breadcrumb | 32.1 KB | 644 | no | src/pages/kotlomoechnye-mashiny/sections/002-breadcrumb-professional-nye-kotlomoechnye-mashiny.html |
| Мобильные контактные элементы | mobile-contact | 9.1 KB | 110 | no | src/pages/kotlomoechnye-mashiny/sections/001-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Мобильные контактные элементы | mobile-contact | 4.8 KB | 77 | no | src/pages/kotlomoechnye-mashiny/sections/004-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Частые вопросы | faq | 1.8 KB | 58 | no | src/pages/kotlomoechnye-mashiny/sections/003-faq-chastye-voprosy.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- kotlomoechnye-mashiny.html
- src/site-builder.json
- src/pages/kotlomoechnye-mashiny/page.json
- src/pages/kotlomoechnye-mashiny/sections/

## Checks

- npm run doctor:page -- --page kotlomoechnye-mashiny.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page kotlomoechnye-mashiny.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
