# Page Digest — shoker-ne-zapuskaet-cikl.html

- Branch: restaurant
- Role: branch
- Title: Шокер не запускает цикл — диагностика и ремонт | MosPochin
- Description: Диагностика шокера, который не запускает программу: питание, дверь, выбранный режим, термощуп, контроллер, защиты и исполнительные выходы.
- H1: Шокер не запускает цикл
- Canonical: https://mospochin.ru/shoker-ne-zapuskaet-cikl.html
- Builder model: src/pages/shoker-ne-zapuskaet-cikl/page.json
- Sections: 7 (4 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 772

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
| Шокер не запускает цикл | breadcrumb | 41.2 KB | 717 | no | src/pages/shoker-ne-zapuskaet-cikl/sections/002-breadcrumb-shoker-ne-zapuskaet-cikl.html |
| Частые вопросы | faq | 1.6 KB | 55 | no | src/pages/shoker-ne-zapuskaet-cikl/sections/003-faq-chastye-voprosy.html |
| Контактный CTA | contact-cta | 47 B | 0 | no | src/pages/shoker-ne-zapuskaet-cikl/sections/001-contact-cta-kontaktnyy-cta.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |
| Footer mount point | footer-anchor | 33 B | 0 | no | src/components/parametric/static/footer-anchor-footer-container-mount-e290e2b6541c.template.html |
| Подключение partials-injector | runtime-partials | 0 B | 0 | no | src/pages/shoker-ne-zapuskaet-cikl/sections/007-runtime-partials-podklyuchenie-partials-injector.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- shoker-ne-zapuskaet-cikl.html
- src/site-builder.json
- src/pages/shoker-ne-zapuskaet-cikl/page.json
- src/pages/shoker-ne-zapuskaet-cikl/sections/

## Checks

- npm run doctor:page -- --page shoker-ne-zapuskaet-cikl.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page shoker-ne-zapuskaet-cikl.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
