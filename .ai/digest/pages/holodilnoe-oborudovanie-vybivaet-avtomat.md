# Page Digest — holodilnoe-oborudovanie-vybivaet-avtomat.html

- Branch: restaurant
- Role: branch
- Title: Холодильное оборудование выбивает автомат | MosPochin
- Description: Диагностика холодильного оборудования при срабатывании автомата: компрессор, нагреватель оттайки, вентиляторы, проводка, контактор и утечка на корпус.
- H1: Холодильное оборудование выбивает автомат
- Canonical: https://mospochin.ru/holodilnoe-oborudovanie-vybivaet-avtomat.html
- Builder model: src/pages/holodilnoe-oborudovanie-vybivaet-avtomat/page.json
- Sections: 7 (4 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 806

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
| Холодильное оборудование выбивает автомат | breadcrumb | 42.4 KB | 744 | no | src/pages/holodilnoe-oborudovanie-vybivaet-avtomat/sections/002-breadcrumb-holodil-noe-oborudovanie-vybivaet-avtomat.html |
| Частые вопросы | faq | 1.7 KB | 62 | no | src/pages/holodilnoe-oborudovanie-vybivaet-avtomat/sections/003-faq-chastye-voprosy.html |
| Контактный CTA | contact-cta | 47 B | 0 | no | src/pages/holodilnoe-oborudovanie-vybivaet-avtomat/sections/001-contact-cta-kontaktnyy-cta.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |
| Footer mount point | footer-anchor | 33 B | 0 | no | src/components/parametric/static/footer-anchor-footer-container-mount-e290e2b6541c.template.html |
| Подключение partials-injector | runtime-partials | 0 B | 0 | no | src/pages/holodilnoe-oborudovanie-vybivaet-avtomat/sections/007-runtime-partials-podklyuchenie-partials-injector.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- holodilnoe-oborudovanie-vybivaet-avtomat.html
- src/site-builder.json
- src/pages/holodilnoe-oborudovanie-vybivaet-avtomat/page.json
- src/pages/holodilnoe-oborudovanie-vybivaet-avtomat/sections/

## Checks

- npm run doctor:page -- --page holodilnoe-oborudovanie-vybivaet-avtomat.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page holodilnoe-oborudovanie-vybivaet-avtomat.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
