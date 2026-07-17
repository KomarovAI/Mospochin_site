# Page Digest — holodilnoe-oborudovanie-ne-holodit.html

- Branch: restaurant
- Role: branch
- Title: Холодильное оборудование не холодит — диагностика | MosPochin
- Description: Что проверить, если профессиональное холодильное оборудование не холодит: двери, вентиляторы, конденсатор, оттайка, датчики, компрессор и контур.
- H1: Холодильное оборудование не холодит
- Canonical: https://mospochin.ru/holodilnoe-oborudovanie-ne-holodit.html
- Builder model: src/pages/holodilnoe-oborudovanie-ne-holodit/page.json
- Sections: 7 (4 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 798

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
| Холодильное оборудование не холодит | breadcrumb | 42.2 KB | 739 | no | src/pages/holodilnoe-oborudovanie-ne-holodit/sections/002-breadcrumb-holodil-noe-oborudovanie-ne-holodit.html |
| Частые вопросы | faq | 1.7 KB | 59 | no | src/pages/holodilnoe-oborudovanie-ne-holodit/sections/003-faq-chastye-voprosy.html |
| Контактный CTA | contact-cta | 47 B | 0 | no | src/pages/holodilnoe-oborudovanie-ne-holodit/sections/001-contact-cta-kontaktnyy-cta.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |
| Footer mount point | footer-anchor | 33 B | 0 | no | src/components/parametric/static/footer-anchor-footer-container-mount-e290e2b6541c.template.html |
| Подключение partials-injector | runtime-partials | 0 B | 0 | no | src/pages/holodilnoe-oborudovanie-ne-holodit/sections/007-runtime-partials-podklyuchenie-partials-injector.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- holodilnoe-oborudovanie-ne-holodit.html
- src/site-builder.json
- src/pages/holodilnoe-oborudovanie-ne-holodit/page.json
- src/pages/holodilnoe-oborudovanie-ne-holodit/sections/

## Checks

- npm run doctor:page -- --page holodilnoe-oborudovanie-ne-holodit.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page holodilnoe-oborudovanie-ne-holodit.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
