# Page Digest — ne-reguliruetsya-skorost-kuttera.html

- Branch: unknown
- Role: unknown
- Title: Не регулируется скорость куттера — диагностика | MosPochin
- Description: Регулятор куттера не меняет обороты или скорость скачет: контроллер, датчик, ручка управления и привод двигателя.
- H1: Не регулируется скорость куттера
- Canonical: https://mospochin.ru/ne-reguliruetsya-skorost-kuttera.html
- Builder model: src/pages/ne-reguliruetsya-skorost-kuttera/page.json
- Sections: 7 (3 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 398

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
| Не регулируется скорость куттера | breadcrumb | 17.9 KB | 343 | no | src/pages/ne-reguliruetsya-skorost-kuttera/sections/002-breadcrumb-ne-reguliruetsya-skorost-kuttera.html |
| Частые вопросы | faq | 1.7 KB | 55 | no | src/pages/ne-reguliruetsya-skorost-kuttera/sections/003-faq-chastye-voprosy.html |
| Секция 1 | body-preamble | 47 B | 0 | no | src/pages/ne-reguliruetsya-skorost-kuttera/sections/001-body-preamble-sekciya-1.html |
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
- ne-reguliruetsya-skorost-kuttera.html
- src/site-builder.json
- src/pages/ne-reguliruetsya-skorost-kuttera/page.json
- src/pages/ne-reguliruetsya-skorost-kuttera/sections/

## Checks

- npm run doctor:page -- --page ne-reguliruetsya-skorost-kuttera.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page ne-reguliruetsya-skorost-kuttera.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
