# Page Digest — remont-holodilnogo-oborudovaniya-abat.html

- Branch: restaurant
- Role: branch
- Title: Ремонт холодильного оборудования Abat в Москве | MosPochin
- Description: Ремонт профессионального холодильного оборудования Abat: столы СХС, шкафы серии Т, шкафы и камеры шоковой заморозки. Диагностика по модели и серийному номеру.
- H1: Ремонт холодильного оборудования Abat
- Canonical: https://mospochin.ru/remont-holodilnogo-oborudovaniya-abat.html
- Builder model: src/pages/remont-holodilnogo-oborudovaniya-abat/page.json
- Sections: 7 (4 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 814

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
| Ремонт холодильного оборудования Abat | breadcrumb | 43.2 KB | 758 | no | src/pages/remont-holodilnogo-oborudovaniya-abat/sections/002-breadcrumb-remont-holodil-nogo-oborudovaniya-abat.html |
| Частые вопросы | faq | 1.6 KB | 56 | no | src/pages/remont-holodilnogo-oborudovaniya-abat/sections/003-faq-chastye-voprosy.html |
| Контактный CTA | contact-cta | 47 B | 0 | no | src/pages/remont-holodilnogo-oborudovaniya-abat/sections/001-contact-cta-kontaktnyy-cta.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |
| Footer mount point | footer-anchor | 33 B | 0 | no | src/components/parametric/static/footer-anchor-footer-container-mount-e290e2b6541c.template.html |
| Подключение partials-injector | runtime-partials | 0 B | 0 | no | src/pages/remont-holodilnogo-oborudovaniya-abat/sections/007-runtime-partials-podklyuchenie-partials-injector.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- remont-holodilnogo-oborudovaniya-abat.html
- src/site-builder.json
- src/pages/remont-holodilnogo-oborudovaniya-abat/page.json
- src/pages/remont-holodilnogo-oborudovaniya-abat/sections/

## Checks

- npm run doctor:page -- --page remont-holodilnogo-oborudovaniya-abat.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page remont-holodilnogo-oborudovaniya-abat.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
