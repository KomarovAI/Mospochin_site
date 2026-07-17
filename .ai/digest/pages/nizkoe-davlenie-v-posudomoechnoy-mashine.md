# Page Digest — nizkoe-davlenie-v-posudomoechnoy-mashine.html

- Branch: restaurant
- Role: branch
- Title: Низкое давление в посудомоечной машине — диагностика и ремонт | MosPochin
- Description: Низкое давление в промышленной посудомоечной машине: диагностика фильтров, моечного насоса, рабочего колеса, рукавов и утечек гидравлического тракта.
- H1: Низкое давление в посудомоечной машине
- Canonical: https://mospochin.ru/nizkoe-davlenie-v-posudomoechnoy-mashine.html
- Builder model: src/pages/nizkoe-davlenie-v-posudomoechnoy-mashine/page.json
- Sections: 7 (3 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 877

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
| Низкое давление в посудомоечной машине | breadcrumb | 37.2 KB | 794 | no | src/pages/nizkoe-davlenie-v-posudomoechnoy-mashine/sections/002-breadcrumb-nizkoe-davlenie-v-posudomoechnoy-mashine.html |
| Частые вопросы | faq | 2.0 KB | 83 | no | src/pages/nizkoe-davlenie-v-posudomoechnoy-mashine/sections/003-faq-chastye-voprosy.html |
| Контактный CTA | contact-cta | 47 B | 0 | no | src/pages/nizkoe-davlenie-v-posudomoechnoy-mashine/sections/001-contact-cta-kontaktnyy-cta.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container-inline.template.html |
| Мобильные контактные элементы | mobile-contact | 40 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container-inline.template.html |
| Footer mount point | footer-anchor | 33 B | 0 | no | src/components/parametric/static/footer-anchor-footer-container-mount-e290e2b6541c.template.html |
| Подключение partials-injector | runtime-partials | 0 B | 0 | no | src/components/parametric/static/runtime-partials-partials-injector-script-defer-empty.template.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- nizkoe-davlenie-v-posudomoechnoy-mashine.html
- src/site-builder.json
- src/pages/nizkoe-davlenie-v-posudomoechnoy-mashine/page.json
- src/pages/nizkoe-davlenie-v-posudomoechnoy-mashine/sections/

## Checks

- npm run doctor:page -- --page nizkoe-davlenie-v-posudomoechnoy-mashine.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page nizkoe-davlenie-v-posudomoechnoy-mashine.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
