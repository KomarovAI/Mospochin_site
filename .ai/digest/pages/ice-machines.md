# Page Digest — ice-machines.html

- Branch: restaurant
- Role: service
- Title: Ремонт профессиональных льдогенераторов в Москве | MosPochin
- Description: Ремонт профессиональных льдогенераторов: кубиковые, гранулированные и чешуйчатые модели, диагностика воды, замораживания, сброса и дренажа.
- H1: Ремонт профессиональных льдогенераторов
- Canonical: https://mospochin.ru/ice-machines.html
- Builder model: src/pages/ice-machines/page.json
- Sections: 7 (4 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 925

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
| Ремонт профессиональных льдогенераторов | breadcrumb | 46.2 KB | 861 | no | src/pages/ice-machines/sections/002-breadcrumb-remont-professional-nyh-l-dogeneratorov.html |
| Частые вопросы | faq | 1.8 KB | 64 | no | src/pages/ice-machines/sections/003-faq-chastye-voprosy.html |
| Контактный CTA | contact-cta | 47 B | 0 | no | src/pages/ice-machines/sections/001-contact-cta-kontaktnyy-cta.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |
| Footer mount point | footer-anchor | 33 B | 0 | no | src/components/parametric/static/footer-anchor-footer-container-mount-e290e2b6541c.template.html |
| Подключение partials-injector | runtime-partials | 0 B | 0 | no | src/pages/ice-machines/sections/007-runtime-partials-podklyuchenie-partials-injector.html |


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
- ice-machines.html
- src/site-builder.json
- src/pages/ice-machines/page.json
- src/pages/ice-machines/sections/

## Checks

- npm run doctor:restaurant-page -- --page ice-machines.html
- npm run doctor:page -- --page ice-machines.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page ice-machines.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
