# Page Digest — posudomoechnye-mashiny.html

- Branch: restaurant
- Role: service
- Title: Ремонт промышленных посудомоечных машин — MosPochin | MosPochin
- Description: Ремонт промышленных посудомоечных машин в Москве: диагностика фронтальных, купольных и конвейерных машин, восстановление нагрева, набора и слива воды.
- H1: Ремонт промышленных посудомоечных машин
- Canonical: https://mospochin.ru/posudomoechnye-mashiny.html
- Builder model: src/pages/posudomoechnye-mashiny/page.json
- Sections: 7 (3 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 838

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
| Ремонт промышленных посудомоечных машин | breadcrumb | 39.1 KB | 766 | no | src/pages/posudomoechnye-mashiny/sections/002-breadcrumb-remont-promyshlennyh-posudomoechnyh-mashi.html |
| Частые вопросы | faq | 1.9 KB | 72 | no | src/pages/posudomoechnye-mashiny/sections/003-faq-chastye-voprosy.html |
| Контактный CTA | contact-cta | 47 B | 0 | no | src/pages/posudomoechnye-mashiny/sections/001-contact-cta-kontaktnyy-cta.html |
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
- data/restaurant-services.json
- data/restaurant-taxonomy.json
- data/restaurant-proof-layer.json
- data/restaurant-page-slots.json
- posudomoechnye-mashiny.html
- src/site-builder.json
- src/pages/posudomoechnye-mashiny/page.json
- src/pages/posudomoechnye-mashiny/sections/

## Checks

- npm run doctor:restaurant-page -- --page posudomoechnye-mashiny.html
- npm run doctor:page -- --page posudomoechnye-mashiny.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page posudomoechnye-mashiny.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
