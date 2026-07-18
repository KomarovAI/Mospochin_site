# Page Digest — remont-shokera-moskva.html

- Branch: unknown
- Role: unknown
- Title: Ремонт шокера в Москве — заявка инженеру | MosPochin
- Description: Шкаф шокового охлаждения не набирает температуру, останавливает цикл или не видит термощуп. Передайте модель, цикл, загрузку и код для диагностики в Москве.
- H1: Ремонт шкафа шокового охлаждения и заморозки
- Canonical: https://mospochin.ru/remont-shokera-moskva.html
- Builder model: src/pages/remont-shokera-moskva/page.json
- Sections: 7 (3 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 240

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 2 |
| body-preamble | 1 |
| footer-anchor | 1 |
| layout-fragment | 1 |
| lead-form | 1 |
| runtime-partials | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Ремонт шкафа шокового охлаждения и заморозки | lead-form | 13.2 KB | 240 | no | src/pages/remont-shokera-moskva/sections/002-lead-form-remont-shkafa-shokovogo-ohlazhdeniya-i-zam.html |
| Секция 1 | body-preamble | 48 B | 0 | no | src/pages/remont-shokera-moskva/sections/001-body-preamble-sekciya-1.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |
| Footer mount point | footer-anchor | 34 B | 0 | no | src/components/parametric/static/footer-anchor-footer-container-mount-06f3fb249f34.template.html |
| HTML-фрагмент | layout-fragment | 1 B | 0 | no | src/components/parametric/static/layout-fragment-technical-fragment-01ba4719c80b.template.html |
| Подключение partials-injector | runtime-partials | 0 B | 0 | no | src/pages/remont-shokera-moskva/sections/006-runtime-partials-podklyuchenie-partials-injector.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- remont-shokera-moskva.html
- src/site-builder.json
- src/pages/remont-shokera-moskva/page.json
- src/pages/remont-shokera-moskva/sections/

## Checks

- npm run doctor:page -- --page remont-shokera-moskva.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page remont-shokera-moskva.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
