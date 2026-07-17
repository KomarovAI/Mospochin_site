# Page Digest — remont-ldogeneratorov-hoshizaki.html

- Branch: restaurant
- Role: branch
- Title: Ремонт льдогенераторов Hoshizaki в Москве | MosPochin
- Description: Диагностика и ремонт льдогенераторов Hoshizaki серий KM, IM и FM: вода, freeze/harvest, насос, клапаны, качество льда и шнековые узлы.
- H1: Ремонт льдогенераторов Hoshizaki
- Canonical: https://mospochin.ru/remont-ldogeneratorov-hoshizaki.html
- Builder model: src/pages/remont-ldogeneratorov-hoshizaki/page.json
- Sections: 7 (4 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 859

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
| Ремонт льдогенераторов Hoshizaki | breadcrumb | 42.7 KB | 805 | no | src/pages/remont-ldogeneratorov-hoshizaki/sections/002-breadcrumb-remont-l-dogeneratorov-hoshizaki.html |
| Частые вопросы | faq | 1.6 KB | 54 | no | src/pages/remont-ldogeneratorov-hoshizaki/sections/003-faq-chastye-voprosy.html |
| Контактный CTA | contact-cta | 47 B | 0 | no | src/pages/remont-ldogeneratorov-hoshizaki/sections/001-contact-cta-kontaktnyy-cta.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |
| Footer mount point | footer-anchor | 33 B | 0 | no | src/components/parametric/static/footer-anchor-footer-container-mount-e290e2b6541c.template.html |
| Подключение partials-injector | runtime-partials | 0 B | 0 | no | src/pages/remont-ldogeneratorov-hoshizaki/sections/007-runtime-partials-podklyuchenie-partials-injector.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- remont-ldogeneratorov-hoshizaki.html
- src/site-builder.json
- src/pages/remont-ldogeneratorov-hoshizaki/page.json
- src/pages/remont-ldogeneratorov-hoshizaki/sections/

## Checks

- npm run doctor:page -- --page remont-ldogeneratorov-hoshizaki.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page remont-ldogeneratorov-hoshizaki.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
