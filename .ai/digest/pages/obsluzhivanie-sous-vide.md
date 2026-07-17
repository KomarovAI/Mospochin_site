# Page Digest — obsluzhivanie-sous-vide.html

- Branch: restaurant
- Role: service
- Title: Обслуживание оборудования sous-vide для ресторанов | MosPochin
- Description: Плановое обслуживание термостатов, водяных бань и вакуумных упаковщиков: осмотр, очистка доступных зон, проверка узлов и фиксация замечаний.
- H1: Обслуживание оборудования sous-vide
- Canonical: https://mospochin.ru/obsluzhivanie-sous-vide.html
- Builder model: src/pages/obsluzhivanie-sous-vide/page.json
- Sections: 7 (3 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 293

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 2 |
| body-preamble | 1 |
| faq | 1 |
| footer-anchor | 1 |
| lead-form | 1 |
| runtime-partials | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Обслуживание оборудования sous-vide | lead-form | 12.5 KB | 234 | no | src/pages/obsluzhivanie-sous-vide/sections/002-lead-form-obsluzhivanie-oborudovaniya-sous-vide.html |
| Частые вопросы | faq | 1.7 KB | 59 | no | src/pages/obsluzhivanie-sous-vide/sections/002b-faq-chastye-voprosy.html |
| Секция 1 | body-preamble | 47 B | 0 | no | src/pages/obsluzhivanie-sous-vide/sections/001-body-preamble-sekciya-1.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |
| Footer mount point | footer-anchor | 33 B | 0 | no | src/components/parametric/static/footer-anchor-footer-container-mount-e290e2b6541c.template.html |
| Подключение partials-injector | runtime-partials | 0 B | 0 | no | src/components/parametric/static/runtime-partials-partials-injector-script-55fc50b4acf9.template.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- obsluzhivanie-sous-vide.html
- src/site-builder.json
- src/pages/obsluzhivanie-sous-vide/page.json
- src/pages/obsluzhivanie-sous-vide/sections/

## Checks

- npm run doctor:page -- --page obsluzhivanie-sous-vide.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page obsluzhivanie-sous-vide.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
