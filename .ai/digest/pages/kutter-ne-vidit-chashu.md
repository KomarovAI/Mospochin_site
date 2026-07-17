# Page Digest — kutter-ne-vidit-chashu.html

- Branch: unknown
- Role: unknown
- Title: Куттер не видит чашу — проверка и ремонт | MosPochin
- Description: Что проверить, если куттер не запускается после установки чаши. Фиксация, датчик положения, активатор и диагностика защитной цепи.
- H1: Куттер не видит чашу
- Canonical: https://mospochin.ru/kutter-ne-vidit-chashu.html
- Builder model: src/pages/kutter-ne-vidit-chashu/page.json
- Sections: 7 (3 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 437

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
| Куттер не видит чашу | breadcrumb | 17.8 KB | 361 | no | src/pages/kutter-ne-vidit-chashu/sections/002-breadcrumb-kutter-ne-vidit-chashu.html |
| Частые вопросы | faq | 1.9 KB | 76 | no | src/pages/kutter-ne-vidit-chashu/sections/003-faq-chastye-voprosy.html |
| Секция 1 | body-preamble | 47 B | 0 | no | src/pages/kutter-ne-vidit-chashu/sections/001-body-preamble-sekciya-1.html |
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
- kutter-ne-vidit-chashu.html
- src/site-builder.json
- src/pages/kutter-ne-vidit-chashu/page.json
- src/pages/kutter-ne-vidit-chashu/sections/

## Checks

- npm run doctor:page -- --page kutter-ne-vidit-chashu.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page kutter-ne-vidit-chashu.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
