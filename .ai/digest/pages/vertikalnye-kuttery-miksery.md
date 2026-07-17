# Page Digest — vertikalnye-kuttery-miksery.html

- Branch: restaurant
- Role: branch
- Title: Вертикальные куттеры-миксеры: устройство и сервис | MosPochin
- Description: Вертикальные куттеры-миксеры для профессиональной кухни: консистенции, скребок, скорости, ножевой блок, очистка и диагностика.
- H1: Вертикальные куттеры-миксеры
- Canonical: https://mospochin.ru/vertikalnye-kuttery-miksery.html
- Builder model: src/pages/vertikalnye-kuttery-miksery/page.json
- Sections: 7 (3 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 430

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
| Вертикальные куттеры-миксеры | breadcrumb | 18.1 KB | 368 | no | src/pages/vertikalnye-kuttery-miksery/sections/002-breadcrumb-vertikal-nye-kuttery-miksery.html |
| Частые вопросы | faq | 1.7 KB | 62 | no | src/pages/vertikalnye-kuttery-miksery/sections/003-faq-chastye-voprosy.html |
| Секция 1 | body-preamble | 47 B | 0 | no | src/pages/vertikalnye-kuttery-miksery/sections/001-body-preamble-sekciya-1.html |
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
- vertikalnye-kuttery-miksery.html
- src/site-builder.json
- src/pages/vertikalnye-kuttery-miksery/page.json
- src/pages/vertikalnye-kuttery-miksery/sections/

## Checks

- npm run doctor:page -- --page vertikalnye-kuttery-miksery.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page vertikalnye-kuttery-miksery.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
