# Page Digest — remont-holodilnogo-oborudovaniya-hicold.html

- Branch: restaurant
- Role: branch
- Title: Ремонт холодильного оборудования HICOLD в Москве | MosPochin
- Description: Диагностика и ремонт холодильных столов HICOLD серий BN, SN и GN. Проверка температурного исполнения HT, TN или BT и установленного контроллера.
- H1: Ремонт холодильного оборудования HICOLD
- Canonical: https://mospochin.ru/remont-holodilnogo-oborudovaniya-hicold.html
- Builder model: src/pages/remont-holodilnogo-oborudovaniya-hicold/page.json
- Sections: 7 (4 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 803

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
| Ремонт холодильного оборудования HICOLD | breadcrumb | 42.4 KB | 744 | no | src/pages/remont-holodilnogo-oborudovaniya-hicold/sections/002-breadcrumb-remont-holodil-nogo-oborudovaniya-hicold.html |
| Частые вопросы | faq | 1.7 KB | 59 | no | src/pages/remont-holodilnogo-oborudovaniya-hicold/sections/003-faq-chastye-voprosy.html |
| Контактный CTA | contact-cta | 47 B | 0 | no | src/pages/remont-holodilnogo-oborudovaniya-hicold/sections/001-contact-cta-kontaktnyy-cta.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |
| Footer mount point | footer-anchor | 33 B | 0 | no | src/components/parametric/static/footer-anchor-footer-container-mount-e290e2b6541c.template.html |
| Подключение partials-injector | runtime-partials | 0 B | 0 | no | src/pages/remont-holodilnogo-oborudovaniya-hicold/sections/007-runtime-partials-podklyuchenie-partials-injector.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- remont-holodilnogo-oborudovaniya-hicold.html
- src/site-builder.json
- src/pages/remont-holodilnogo-oborudovaniya-hicold/page.json
- src/pages/remont-holodilnogo-oborudovaniya-hicold/sections/

## Checks

- npm run doctor:page -- --page remont-holodilnogo-oborudovaniya-hicold.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page remont-holodilnogo-oborudovaniya-hicold.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
