# Page Digest — kutter-peregrevaetsya.html

- Branch: unknown
- Role: unknown
- Title: Куттер перегревается — причины и диагностика | MosPochin
- Description: Куттер нагревается и отключается после партий: загрузка, вентиляция, термозащита, подшипники и ток двигателя.
- H1: Куттер перегревается
- Canonical: https://mospochin.ru/kutter-peregrevaetsya.html
- Builder model: src/pages/kutter-peregrevaetsya/page.json
- Sections: 7 (3 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 396

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 2 |
| body-preamble | 1 |
| breadcrumb | 1 |
| faq | 1 |
| footer-anchor | 1 |
| runtime-partials | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Куттер перегревается | breadcrumb | 17.8 KB | 332 | no | src/pages/kutter-peregrevaetsya/sections/002-breadcrumb-kutter-peregrevaetsya.html |
| Частые вопросы | faq | 1.7 KB | 64 | no | src/pages/kutter-peregrevaetsya/sections/003-faq-chastye-voprosy.html |
| Секция 1 | body-preamble | 47 B | 0 | no | src/pages/kutter-peregrevaetsya/sections/001-body-preamble-sekciya-1.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |
| Footer mount point | footer-anchor | 33 B | 0 | no | src/components/parametric/static/footer-anchor-footer-container-mount-e290e2b6541c.template.html |
| Подключение partials-injector | runtime-partials | 0 B | 0 | no | src/components/parametric/static/runtime-partials-partials-injector-script-30d5aa9353a9.template.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- kutter-peregrevaetsya.html
- src/site-builder.json
- src/pages/kutter-peregrevaetsya/page.json
- src/pages/kutter-peregrevaetsya/sections/

## Checks

- npm run doctor:page -- --page kutter-peregrevaetsya.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page kutter-peregrevaetsya.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
