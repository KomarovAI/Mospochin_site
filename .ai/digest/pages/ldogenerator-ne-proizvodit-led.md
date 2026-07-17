# Page Digest — ldogenerator-ne-proizvodit-led.html

- Branch: restaurant
- Role: branch
- Title: Льдогенератор не производит лёд — диагностика | MosPochin
- Description: Льдогенератор не производит лёд: проверка воды, фильтра, насоса, замораживания, сброса, датчика бункера и холодильной системы.
- H1: Льдогенератор не производит лёд
- Canonical: https://mospochin.ru/ldogenerator-ne-proizvodit-led.html
- Builder model: src/pages/ldogenerator-ne-proizvodit-led/page.json
- Sections: 7 (4 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 823

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
| Льдогенератор не производит лёд | breadcrumb | 41.7 KB | 757 | no | src/pages/ldogenerator-ne-proizvodit-led/sections/002-breadcrumb-l-dogenerator-ne-proizvodit-led.html |
| Частые вопросы | faq | 1.8 KB | 66 | no | src/pages/ldogenerator-ne-proizvodit-led/sections/003-faq-chastye-voprosy.html |
| Контактный CTA | contact-cta | 47 B | 0 | no | src/pages/ldogenerator-ne-proizvodit-led/sections/001-contact-cta-kontaktnyy-cta.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |
| Footer mount point | footer-anchor | 33 B | 0 | no | src/components/parametric/static/footer-anchor-footer-container-mount-e290e2b6541c.template.html |
| Подключение partials-injector | runtime-partials | 0 B | 0 | no | src/pages/ldogenerator-ne-proizvodit-led/sections/007-runtime-partials-podklyuchenie-partials-injector.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- ldogenerator-ne-proizvodit-led.html
- src/site-builder.json
- src/pages/ldogenerator-ne-proizvodit-led/page.json
- src/pages/ldogenerator-ne-proizvodit-led/sections/

## Checks

- npm run doctor:page -- --page ldogenerator-ne-proizvodit-led.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page ldogenerator-ne-proizvodit-led.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
