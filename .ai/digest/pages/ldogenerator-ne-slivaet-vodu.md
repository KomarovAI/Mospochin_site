# Page Digest — ldogenerator-ne-slivaet-vodu.html

- Branch: restaurant
- Role: branch
- Title: Льдогенератор не сливает воду — диагностика дренажа | MosPochin
- Description: Диагностика дренажа льдогенератора: сливная трубка, уклон, стояк, резервуар, purge cycle и сливной насос в моделях, где он предусмотрен.
- H1: Льдогенератор не сливает воду
- Canonical: https://mospochin.ru/ldogenerator-ne-slivaet-vodu.html
- Builder model: src/pages/ldogenerator-ne-slivaet-vodu/page.json
- Sections: 7 (4 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 797

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
| Льдогенератор не сливает воду | breadcrumb | 41.6 KB | 740 | no | src/pages/ldogenerator-ne-slivaet-vodu/sections/002-breadcrumb-l-dogenerator-ne-slivaet-vodu.html |
| Частые вопросы | faq | 1.7 KB | 57 | no | src/pages/ldogenerator-ne-slivaet-vodu/sections/003-faq-chastye-voprosy.html |
| Контактный CTA | contact-cta | 47 B | 0 | no | src/pages/ldogenerator-ne-slivaet-vodu/sections/001-contact-cta-kontaktnyy-cta.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |
| Footer mount point | footer-anchor | 33 B | 0 | no | src/components/parametric/static/footer-anchor-footer-container-mount-e290e2b6541c.template.html |
| Подключение partials-injector | runtime-partials | 0 B | 0 | no | src/pages/ldogenerator-ne-slivaet-vodu/sections/007-runtime-partials-podklyuchenie-partials-injector.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- ldogenerator-ne-slivaet-vodu.html
- src/site-builder.json
- src/pages/ldogenerator-ne-slivaet-vodu/page.json
- src/pages/ldogenerator-ne-slivaet-vodu/sections/

## Checks

- npm run doctor:page -- --page ldogenerator-ne-slivaet-vodu.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page ldogenerator-ne-slivaet-vodu.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
