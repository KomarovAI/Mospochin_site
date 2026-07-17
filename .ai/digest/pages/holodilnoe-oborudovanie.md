# Page Digest — holodilnoe-oborudovanie.html

- Branch: restaurant
- Role: service
- Title: Ремонт профессионального холодильного оборудования в Москве | MosPochin
- Description: Ремонт профессионального холодильного оборудования в Москве: шкафы, столы, камеры, моноблоки, сплит-системы, шокеры и льдогенераторы.
- H1: Ремонт профессионального холодильного оборудования
- Canonical: https://mospochin.ru/holodilnoe-oborudovanie.html
- Builder model: src/pages/holodilnoe-oborudovanie/page.json
- Sections: 7 (4 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 976

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
| Ремонт профессионального холодильного оборудования | breadcrumb | 49.4 KB | 909 | no | src/pages/holodilnoe-oborudovanie/sections/002-breadcrumb-remont-professional-nogo-holodil-nogo-obo.html |
| Частые вопросы | faq | 1.9 KB | 67 | no | src/pages/holodilnoe-oborudovanie/sections/003-faq-chastye-voprosy.html |
| Контактный CTA | contact-cta | 47 B | 0 | no | src/pages/holodilnoe-oborudovanie/sections/001-contact-cta-kontaktnyy-cta.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |
| Footer mount point | footer-anchor | 33 B | 0 | no | src/components/parametric/static/footer-anchor-footer-container-mount-e290e2b6541c.template.html |
| Подключение partials-injector | runtime-partials | 0 B | 0 | no | src/pages/holodilnoe-oborudovanie/sections/007-runtime-partials-podklyuchenie-partials-injector.html |


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
- holodilnoe-oborudovanie.html
- src/site-builder.json
- src/pages/holodilnoe-oborudovanie/page.json
- src/pages/holodilnoe-oborudovanie/sections/

## Checks

- npm run doctor:restaurant-page -- --page holodilnoe-oborudovanie.html
- npm run doctor:page -- --page holodilnoe-oborudovanie.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page holodilnoe-oborudovanie.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
