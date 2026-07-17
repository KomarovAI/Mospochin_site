# Page Digest — shoker-medlenno-okhlazhdaet.html

- Branch: restaurant
- Role: branch
- Title: Шокер медленно охлаждает — диагностика и ремонт | MosPochin
- Description: Диагностика медленного охлаждения в шокере: загрузка, термощуп, вентиляторы, конденсатор, испаритель, настройки цикла и холодильный контур.
- H1: Шокер медленно охлаждает
- Canonical: https://mospochin.ru/shoker-medlenno-okhlazhdaet.html
- Builder model: src/pages/shoker-medlenno-okhlazhdaet/page.json
- Sections: 7 (4 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 833

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
| Шокер медленно охлаждает | breadcrumb | 42.0 KB | 761 | no | src/pages/shoker-medlenno-okhlazhdaet/sections/002-breadcrumb-shoker-medlenno-ohlazhdaet.html |
| Частые вопросы | faq | 1.9 KB | 72 | no | src/pages/shoker-medlenno-okhlazhdaet/sections/003-faq-chastye-voprosy.html |
| Контактный CTA | contact-cta | 47 B | 0 | no | src/pages/shoker-medlenno-okhlazhdaet/sections/001-contact-cta-kontaktnyy-cta.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |
| Footer mount point | footer-anchor | 33 B | 0 | no | src/components/parametric/static/footer-anchor-footer-container-mount-e290e2b6541c.template.html |
| Подключение partials-injector | runtime-partials | 0 B | 0 | no | src/pages/shoker-medlenno-okhlazhdaet/sections/007-runtime-partials-podklyuchenie-partials-injector.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- shoker-medlenno-okhlazhdaet.html
- src/site-builder.json
- src/pages/shoker-medlenno-okhlazhdaet/page.json
- src/pages/shoker-medlenno-okhlazhdaet/sections/

## Checks

- npm run doctor:page -- --page shoker-medlenno-okhlazhdaet.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page shoker-medlenno-okhlazhdaet.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
