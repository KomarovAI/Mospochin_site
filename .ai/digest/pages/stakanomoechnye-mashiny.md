# Page Digest — stakanomoechnye-mashiny.html

- Branch: restaurant
- Role: branch
- Title: Стаканомоечные машины для баров и ресторанов | MosPochin
- Description: Профессиональные стаканомоечные машины для баров: особенности короткого цикла, качество воды, ополаскивание, дозирование и диагностика разводов и запаха.
- H1: Профессиональные стаканомоечные машины
- Canonical: https://mospochin.ru/stakanomoechnye-mashiny.html
- Builder model: src/pages/stakanomoechnye-mashiny/page.json
- Sections: 6 (4 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 970

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 4 |
| breadcrumb | 1 |
| faq | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Профессиональные стаканомоечные машины | breadcrumb | 34.8 KB | 721 | no | src/pages/stakanomoechnye-mashiny/sections/002-breadcrumb-professional-nye-stakanomoechnye-mashiny.html |
| Мобильные контактные элементы | mobile-contact | 9.1 KB | 110 | no | src/pages/stakanomoechnye-mashiny/sections/001-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Мобильные контактные элементы | mobile-contact | 4.8 KB | 77 | no | src/pages/stakanomoechnye-mashiny/sections/004-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Частые вопросы | faq | 1.7 KB | 62 | no | src/pages/stakanomoechnye-mashiny/sections/003-faq-chastye-voprosy.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- stakanomoechnye-mashiny.html
- src/site-builder.json
- src/pages/stakanomoechnye-mashiny/page.json
- src/pages/stakanomoechnye-mashiny/sections/

## Checks

- npm run doctor:page -- --page stakanomoechnye-mashiny.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page stakanomoechnye-mashiny.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
