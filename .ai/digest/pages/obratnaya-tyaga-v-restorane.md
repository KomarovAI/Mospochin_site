# Page Digest — obratnaya-tyaga-v-restorane.html

- Branch: restaurant
- Role: service
- Title: Обратная тяга в вентиляции ресторана — диагностика
- Description: Причины обратной тяги: нехватка притока, проблемы с вытяжным каналом, вентилятором, заслонками, балансом воздуха и соседними системами.
- H1: Обратная тяга в ресторане
- Canonical: https://mospochin.ru/obratnaya-tyaga-v-restorane.html
- Builder model: src/pages/obratnaya-tyaga-v-restorane/page.json
- Sections: 10 (4 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 1443

## Component mix

| Component | Count |
| --- | --- |
| layout-fragment | 3 |
| mobile-contact | 2 |
| body-preamble | 1 |
| breadcrumb | 1 |
| footer-anchor | 1 |
| lead-form | 1 |
| runtime-partials | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Обратная тяга в ресторане | breadcrumb | 56.5 KB | 1443 | no | src/pages/obratnaya-tyaga-v-restorane/sections/002-breadcrumb-obratnaya-tyaga-v-restorane.html |
| Подключение partials-injector | runtime-partials | 54 B | 0 | no | src/pages/obratnaya-tyaga-v-restorane/sections/008-runtime-partials-podklyuchenie-partials-injector.html |
| Форма заявки | lead-form | 50 B | 0 | no | src/pages/obratnaya-tyaga-v-restorane/sections/007-lead-form-forma-zayavki.html |
| Секция 1 | body-preamble | 48 B | 0 | no | src/pages/obratnaya-tyaga-v-restorane/sections/001-body-preamble-sekciya-1.html |
| HTML-фрагмент | layout-fragment | 46 B | 0 | no | src/components/parametric/static/layout-fragment-technical-fragment-52c8755076d4.template.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |
| HTML-фрагмент | layout-fragment | 41 B | 0 | no | src/components/parametric/static/layout-fragment-technical-fragment-5b57bace79b1.template.html |


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
- obratnaya-tyaga-v-restorane.html
- src/site-builder.json
- src/pages/obratnaya-tyaga-v-restorane/page.json
- src/pages/obratnaya-tyaga-v-restorane/sections/

## Checks

- npm run doctor:restaurant-page -- --page obratnaya-tyaga-v-restorane.html
- npm run doctor:page -- --page obratnaya-tyaga-v-restorane.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page obratnaya-tyaga-v-restorane.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
