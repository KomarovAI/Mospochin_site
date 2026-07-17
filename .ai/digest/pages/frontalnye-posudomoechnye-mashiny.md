# Page Digest — frontalnye-posudomoechnye-mashiny.html

- Branch: restaurant
- Role: branch
- Title: Фронтальные посудомоечные машины для ресторанов | MosPochin
- Description: Фронтальные промышленные посудомоечные машины: устройство подстольной камеры, типичные неисправности, обслуживание, диагностика нагрева, мойки и слива.
- H1: Фронтальные промышленные посудомоечные машины
- Canonical: https://mospochin.ru/frontalnye-posudomoechnye-mashiny.html
- Builder model: src/pages/frontalnye-posudomoechnye-mashiny/page.json
- Sections: 7 (3 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 798

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
| Фронтальные промышленные посудомоечные машины | breadcrumb | 35.3 KB | 733 | no | src/pages/frontalnye-posudomoechnye-mashiny/sections/002-breadcrumb-frontal-nye-promyshlennye-posudomoechnye-.html |
| Частые вопросы | faq | 1.7 KB | 65 | no | src/pages/frontalnye-posudomoechnye-mashiny/sections/003-faq-chastye-voprosy.html |
| Контактный CTA | contact-cta | 47 B | 0 | no | src/pages/frontalnye-posudomoechnye-mashiny/sections/001-contact-cta-kontaktnyy-cta.html |
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
- frontalnye-posudomoechnye-mashiny.html
- src/site-builder.json
- src/pages/frontalnye-posudomoechnye-mashiny/page.json
- src/pages/frontalnye-posudomoechnye-mashiny/sections/

## Checks

- npm run doctor:page -- --page frontalnye-posudomoechnye-mashiny.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page frontalnye-posudomoechnye-mashiny.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
