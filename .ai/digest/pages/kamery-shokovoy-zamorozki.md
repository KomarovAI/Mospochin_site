# Page Digest — kamery-shokovoy-zamorozki.html

- Branch: restaurant
- Role: branch
- Title: Ремонт камер шоковой заморозки | MosPochin
- Description: Диагностика и ремонт roll-in камер шокового охлаждения и заморозки: тележки, термощупы, вентиляторы, испарители, оттайка, двери, контроллер и удалённый агрегат.
- H1: Камеры шоковой заморозки
- Canonical: https://mospochin.ru/kamery-shokovoy-zamorozki.html
- Builder model: src/pages/kamery-shokovoy-zamorozki/page.json
- Sections: 7 (4 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 826

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
| Камеры шоковой заморозки | breadcrumb | 42.3 KB | 766 | no | src/pages/kamery-shokovoy-zamorozki/sections/002-breadcrumb-kamery-shokovoy-zamorozki.html |
| Частые вопросы | faq | 1.7 KB | 60 | no | src/pages/kamery-shokovoy-zamorozki/sections/003-faq-chastye-voprosy.html |
| Контактный CTA | contact-cta | 47 B | 0 | no | src/pages/kamery-shokovoy-zamorozki/sections/001-contact-cta-kontaktnyy-cta.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |
| Footer mount point | footer-anchor | 33 B | 0 | no | src/components/parametric/static/footer-anchor-footer-container-mount-e290e2b6541c.template.html |
| Подключение partials-injector | runtime-partials | 0 B | 0 | no | src/pages/kamery-shokovoy-zamorozki/sections/007-runtime-partials-podklyuchenie-partials-injector.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- kamery-shokovoy-zamorozki.html
- src/site-builder.json
- src/pages/kamery-shokovoy-zamorozki/page.json
- src/pages/kamery-shokovoy-zamorozki/sections/

## Checks

- npm run doctor:page -- --page kamery-shokovoy-zamorozki.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page kamery-shokovoy-zamorozki.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
