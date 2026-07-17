# Page Digest — sous-vide-remont-moskva.html

- Branch: restaurant
- Role: promo
- Title: Ремонт sous-vide в Москве — заявка инженеру | MosPochin
- Description: Не включается или не нагревает оборудование sous-vide. Передайте модель и симптом, отправьте фото в WhatsApp и согласуйте диагностику на объекте.
- H1: Ремонт sous-vide в Москве
- Canonical: https://mospochin.ru/sous-vide-remont-moskva.html
- Builder model: src/pages/sous-vide-remont-moskva/page.json
- Sections: 8 (3 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 202

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 2 |
| body-preamble | 1 |
| faq | 1 |
| footer-anchor | 1 |
| layout-fragment | 1 |
| lead-form | 1 |
| runtime-partials | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Ремонт sous-vide в Москве | lead-form | 9.4 KB | 135 | no | src/pages/sous-vide-remont-moskva/sections/002-lead-form-remont-sous-vide-v-moskve.html |
| Частые вопросы | faq | 1.7 KB | 67 | no | src/pages/sous-vide-remont-moskva/sections/002b-faq-chastye-voprosy.html |
| Секция 1 | body-preamble | 48 B | 0 | no | src/pages/sous-vide-remont-moskva/sections/001-body-preamble-sekciya-1.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |
| Footer mount point | footer-anchor | 36 B | 0 | no | src/components/parametric/static/footer-anchor-footer-container-mount-7e779f23d41c.template.html |
| HTML-фрагмент | layout-fragment | 1 B | 0 | no | src/components/parametric/static/layout-fragment-technical-fragment-01ba4719c80b.template.html |
| Подключение partials-injector | runtime-partials | 0 B | 0 | no | src/components/parametric/static/runtime-partials-partials-injector-script-55fc50b4acf9.template.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- sous-vide-remont-moskva.html
- src/site-builder.json
- src/pages/sous-vide-remont-moskva/page.json
- src/pages/sous-vide-remont-moskva/sections/

## Checks

- npm run doctor:page -- --page sous-vide-remont-moskva.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page sous-vide-remont-moskva.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
