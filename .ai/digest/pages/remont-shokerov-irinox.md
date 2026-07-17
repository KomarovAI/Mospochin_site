# Page Digest — remont-shokerov-irinox.html

- Branch: restaurant
- Role: branch
- Title: Ремонт шокеров IRINOX в Москве | MosPochin
- Description: Диагностика и ремонт шокеров IRINOX EasyFresh Next и MultiFresh Next: цикл, термощуп, вентиляторы, температура продукта и сообщения контроллера.
- H1: Ремонт шокеров IRINOX
- Canonical: https://mospochin.ru/remont-shokerov-irinox.html
- Builder model: src/pages/remont-shokerov-irinox/page.json
- Sections: 7 (4 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 819

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
| Ремонт шокеров IRINOX | breadcrumb | 42.0 KB | 758 | no | src/pages/remont-shokerov-irinox/sections/002-breadcrumb-remont-shokerov-irinox.html |
| Частые вопросы | faq | 1.6 KB | 61 | no | src/pages/remont-shokerov-irinox/sections/003-faq-chastye-voprosy.html |
| Контактный CTA | contact-cta | 47 B | 0 | no | src/pages/remont-shokerov-irinox/sections/001-contact-cta-kontaktnyy-cta.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |
| Footer mount point | footer-anchor | 33 B | 0 | no | src/components/parametric/static/footer-anchor-footer-container-mount-e290e2b6541c.template.html |
| Подключение partials-injector | runtime-partials | 0 B | 0 | no | src/pages/remont-shokerov-irinox/sections/007-runtime-partials-podklyuchenie-partials-injector.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- remont-shokerov-irinox.html
- src/site-builder.json
- src/pages/remont-shokerov-irinox/page.json
- src/pages/remont-shokerov-irinox/sections/

## Checks

- npm run doctor:page -- --page remont-shokerov-irinox.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page remont-shokerov-irinox.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
