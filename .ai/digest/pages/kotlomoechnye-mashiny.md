# Page Digest — kotlomoechnye-mashiny.html

- Branch: restaurant
- Role: branch
- Title: Котломоечные машины для ресторанов | MosPochin
- Description: Профессиональные котломоечные машины для мойки кастрюль, гастроёмкостей и кухонного инвентаря: устройство, загрузка, гидравлика и диагностика.
- H1: Профессиональные котломоечные машины
- Canonical: https://mospochin.ru/kotlomoechnye-mashiny.html
- Builder model: src/pages/kotlomoechnye-mashiny/page.json
- Sections: 7 (3 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 702

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 2 |
| breadcrumb | 1 |
| contact-cta | 1 |
| faq | 1 |
| footer-anchor | 1 |
| runtime-partials | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Профессиональные котломоечные машины | breadcrumb | 32.0 KB | 644 | no | src/pages/kotlomoechnye-mashiny/sections/002-breadcrumb-professional-nye-kotlomoechnye-mashiny.html |
| Частые вопросы | faq | 1.8 KB | 58 | no | src/pages/kotlomoechnye-mashiny/sections/003-faq-chastye-voprosy.html |
| Контактный CTA | contact-cta | 47 B | 0 | no | src/pages/kotlomoechnye-mashiny/sections/001-contact-cta-kontaktnyy-cta.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container-inline.template.html |
| Мобильные контактные элементы | mobile-contact | 40 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container-inline.template.html |
| Footer mount point | footer-anchor | 33 B | 0 | no | src/components/parametric/static/footer-anchor-footer-container-mount-e290e2b6541c.template.html |
| Подключение partials-injector | runtime-partials | 0 B | 0 | no | src/components/parametric/static/runtime-partials-partials-injector-script-defer-empty.template.html |


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
