# Page Digest — ne-rabotaet-ottaika-holodilnogo-oborudovaniya.html

- Branch: restaurant
- Role: branch
- Title: Не работает оттайка холодильного оборудования | MosPochin
- Description: Диагностика оттайки профессионального холодильного оборудования: контроллер, интервалы, датчик испарителя, ТЭН, горячий газ, вентиляторы и дренаж.
- H1: Не работает оттайка холодильного оборудования
- Canonical: https://mospochin.ru/ne-rabotaet-ottaika-holodilnogo-oborudovaniya.html
- Builder model: src/pages/ne-rabotaet-ottaika-holodilnogo-oborudovaniya/page.json
- Sections: 7 (4 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 830

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
| Не работает оттайка холодильного оборудования | breadcrumb | 42.8 KB | 769 | no | src/pages/ne-rabotaet-ottaika-holodilnogo-oborudovaniya/sections/002-breadcrumb-ne-rabotaet-ottayka-holodil-nogo-oborudov.html |
| Частые вопросы | faq | 1.7 KB | 61 | no | src/pages/ne-rabotaet-ottaika-holodilnogo-oborudovaniya/sections/003-faq-chastye-voprosy.html |
| Контактный CTA | contact-cta | 47 B | 0 | no | src/pages/ne-rabotaet-ottaika-holodilnogo-oborudovaniya/sections/001-contact-cta-kontaktnyy-cta.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |
| Footer mount point | footer-anchor | 33 B | 0 | no | src/components/parametric/static/footer-anchor-footer-container-mount-e290e2b6541c.template.html |
| Подключение partials-injector | runtime-partials | 0 B | 0 | no | src/pages/ne-rabotaet-ottaika-holodilnogo-oborudovaniya/sections/007-runtime-partials-podklyuchenie-partials-injector.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- ne-rabotaet-ottaika-holodilnogo-oborudovaniya.html
- src/site-builder.json
- src/pages/ne-rabotaet-ottaika-holodilnogo-oborudovaniya/page.json
- src/pages/ne-rabotaet-ottaika-holodilnogo-oborudovaniya/sections/

## Checks

- npm run doctor:page -- --page ne-rabotaet-ottaika-holodilnogo-oborudovaniya.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page ne-rabotaet-ottaika-holodilnogo-oborudovaniya.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
