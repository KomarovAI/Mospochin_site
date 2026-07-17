# Page Digest — kody-oshibok-holodilnogo-oborudovaniya.html

- Branch: restaurant
- Role: branch
- Title: Коды ошибок холодильного оборудования | MosPochin
- Description: Коды контроллеров холодильного оборудования с обязательной привязкой к модели контроллера. Danfoss ERC 211/213/214: датчики, температура, напряжение, конденсатор и дверь.
- H1: Коды ошибок холодильного оборудования
- Canonical: https://mospochin.ru/kody-oshibok-holodilnogo-oborudovaniya.html
- Builder model: src/pages/kody-oshibok-holodilnogo-oborudovaniya/page.json
- Sections: 7 (4 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 1011

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
| Коды ошибок холодильного оборудования | breadcrumb | 46.4 KB | 939 | no | src/pages/kody-oshibok-holodilnogo-oborudovaniya/sections/002-breadcrumb-kody-oshibok-holodil-nogo-oborudovaniya.html |
| Частые вопросы | faq | 1.7 KB | 72 | no | src/pages/kody-oshibok-holodilnogo-oborudovaniya/sections/003-faq-chastye-voprosy.html |
| Контактный CTA | contact-cta | 47 B | 0 | no | src/pages/kody-oshibok-holodilnogo-oborudovaniya/sections/001-contact-cta-kontaktnyy-cta.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |
| Footer mount point | footer-anchor | 33 B | 0 | no | src/components/parametric/static/footer-anchor-footer-container-mount-e290e2b6541c.template.html |
| Подключение partials-injector | runtime-partials | 0 B | 0 | no | src/pages/kody-oshibok-holodilnogo-oborudovaniya/sections/007-runtime-partials-podklyuchenie-partials-injector.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- kody-oshibok-holodilnogo-oborudovaniya.html
- src/site-builder.json
- src/pages/kody-oshibok-holodilnogo-oborudovaniya/page.json
- src/pages/kody-oshibok-holodilnogo-oborudovaniya/sections/

## Checks

- npm run doctor:page -- --page kody-oshibok-holodilnogo-oborudovaniya.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page kody-oshibok-holodilnogo-oborudovaniya.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
