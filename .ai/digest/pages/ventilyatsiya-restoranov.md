# Page Digest — ventilyatsiya-restoranov.html

- Branch: restaurant
- Role: service
- Title: Ремонт вентиляции ресторанов и кафе в Москве — MosPochin
- Description: Диагностика, ремонт, обслуживание и чистка вентиляции ресторанов, кафе, столовых, пекарен и dark kitchen. Вытяжка, приток, зонты, вентиляторы, воздуховоды, автоматика.
- H1: Ремонт и обслуживание вентиляции ресторанов, кафе и пищеблоков
- Canonical: https://mospochin.ru/ventilyatsiya-restoranov.html
- Builder model: src/pages/ventilyatsiya-restoranov/page.json
- Sections: 10 (6 local, 0 shared refs, 2 raw)
- Text words inside referenced sections: 1566

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 2 |
| raw | 2 |
| body-preamble | 1 |
| breadcrumb | 1 |
| footer-anchor | 1 |
| layout-fragment | 1 |
| lead-form | 1 |
| runtime-partials | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Ремонт и обслуживание вентиляции ресторанов, кафе и пищеблоков | breadcrumb | 64.1 KB | 1566 | no | src/pages/ventilyatsiya-restoranov/sections/002-breadcrumb-remont-i-obsluzhivanie-ventilyacii-restor.html |
| Подключение partials-injector | runtime-partials | 54 B | 0 | no | src/pages/ventilyatsiya-restoranov/sections/008-runtime-partials-podklyuchenie-partials-injector.html |
| Форма заявки | lead-form | 50 B | 0 | no | src/pages/ventilyatsiya-restoranov/sections/007-lead-form-forma-zayavki.html |
| Секция 1 | body-preamble | 48 B | 0 | no | src/pages/ventilyatsiya-restoranov/sections/001-body-preamble-sekciya-1.html |
| HTML-фрагмент | raw | 46 B | 0 | no | src/pages/ventilyatsiya-restoranov/sections/006-raw-html-fragment.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |
| HTML-фрагмент | raw | 41 B | 0 | no | src/pages/ventilyatsiya-restoranov/sections/009-raw-html-fragment.html |


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
- ventilyatsiya-restoranov.html
- src/site-builder.json
- src/pages/ventilyatsiya-restoranov/page.json
- src/pages/ventilyatsiya-restoranov/sections/

## Checks

- npm run doctor:restaurant-page -- --page ventilyatsiya-restoranov.html
- npm run doctor:page -- --page ventilyatsiya-restoranov.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page ventilyatsiya-restoranov.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
