# Page Digest — obsluzhivanie-holodilnogo-oborudovaniya.html

- Branch: restaurant
- Role: branch
- Title: Обслуживание профессионального холодильного оборудования | MosPochin
- Description: Техническое обслуживание холодильных шкафов, столов и камер: конденсатор, вентиляторы, оттайка, дренаж, уплотнения, датчики и контроллер.
- H1: Обслуживание профессионального холодильного оборудования
- Canonical: https://mospochin.ru/obsluzhivanie-holodilnogo-oborudovaniya.html
- Builder model: src/pages/obsluzhivanie-holodilnogo-oborudovaniya/page.json
- Sections: 7 (4 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 949

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
| Обслуживание профессионального холодильного оборудования | breadcrumb | 52.7 KB | 884 | no | src/pages/obsluzhivanie-holodilnogo-oborudovaniya/sections/002-breadcrumb-obsluzhivanie-professional-nogo-holodil-n.html |
| Частые вопросы | faq | 1.8 KB | 65 | no | src/pages/obsluzhivanie-holodilnogo-oborudovaniya/sections/003-faq-chastye-voprosy.html |
| Контактный CTA | contact-cta | 47 B | 0 | no | src/pages/obsluzhivanie-holodilnogo-oborudovaniya/sections/001-contact-cta-kontaktnyy-cta.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |
| Footer mount point | footer-anchor | 33 B | 0 | no | src/components/parametric/static/footer-anchor-footer-container-mount-e290e2b6541c.template.html |
| Подключение partials-injector | runtime-partials | 0 B | 0 | no | src/pages/obsluzhivanie-holodilnogo-oborudovaniya/sections/007-runtime-partials-podklyuchenie-partials-injector.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- obsluzhivanie-holodilnogo-oborudovaniya.html
- src/site-builder.json
- src/pages/obsluzhivanie-holodilnogo-oborudovaniya/page.json
- src/pages/obsluzhivanie-holodilnogo-oborudovaniya/sections/

## Checks

- npm run doctor:page -- --page obsluzhivanie-holodilnogo-oborudovaniya.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page obsluzhivanie-holodilnogo-oborudovaniya.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
