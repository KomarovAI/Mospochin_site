# Page Digest — kak-vybrat-kutter-dlya-restorana.html

- Branch: unknown
- Role: unknown
- Title: Как выбрать профессиональный куттер для ресторана | MosPochin
- Description: Выбор профессионального куттера: меню, объём партии, текстура, скорости, ножи, чаша, безопасность, очистка и сервисопригодность.
- H1: Как выбрать куттер для ресторана
- Canonical: https://mospochin.ru/kak-vybrat-kutter-dlya-restorana.html
- Builder model: src/pages/kak-vybrat-kutter-dlya-restorana/page.json
- Sections: 7 (3 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 465

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
| Как выбрать куттер для ресторана | breadcrumb | 18.1 KB | 387 | no | src/pages/kak-vybrat-kutter-dlya-restorana/sections/002-breadcrumb-kak-vybrat-kutter-dlya-restorana.html |
| Частые вопросы | faq | 2.1 KB | 78 | no | src/pages/kak-vybrat-kutter-dlya-restorana/sections/003-faq-chastye-voprosy.html |
| Секция 1 | body-preamble | 47 B | 0 | no | src/pages/kak-vybrat-kutter-dlya-restorana/sections/001-body-preamble-sekciya-1.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |
| Footer mount point | footer-anchor | 33 B | 0 | no | src/components/parametric/static/footer-anchor-footer-container-mount-e290e2b6541c.template.html |
| Подключение partials-injector | runtime-partials | 0 B | 0 | no | src/components/parametric/static/runtime-partials-partials-injector-script-55fc50b4acf9.template.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- kak-vybrat-kutter-dlya-restorana.html
- src/site-builder.json
- src/pages/kak-vybrat-kutter-dlya-restorana/page.json
- src/pages/kak-vybrat-kutter-dlya-restorana/sections/

## Checks

- npm run doctor:page -- --page kak-vybrat-kutter-dlya-restorana.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page kak-vybrat-kutter-dlya-restorana.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
