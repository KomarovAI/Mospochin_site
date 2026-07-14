# Page Digest — remont-vakuumnogo-upakovshika-reklama.html

- Branch: restaurant
- Role: promo
- Title: Ремонт вакуумного упаковщика — заявка инженеру | MosPochin
- Description: Вакуумный упаковщик не создаёт вакуум, плохо запаивает или не завершает цикл. Отправьте модель, видео и симптом для диагностики.
- H1: Ремонт вакуумного упаковщика
- Canonical: https://mospochin.ru/remont-vakuumnogo-upakovshika-reklama.html
- Builder model: src/pages/remont-vakuumnogo-upakovshika-reklama/page.json
- Sections: 8 (5 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 177

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
| Ремонт вакуумного упаковщика | lead-form | 8.2 KB | 110 | no | src/pages/remont-vakuumnogo-upakovshika-reklama/sections/002-lead-form-remont-vakuumnogo-upakovschika.html |
| Частые вопросы | faq | 1.7 KB | 67 | no | src/pages/remont-vakuumnogo-upakovshika-reklama/sections/002b-faq-chastye-voprosy.html |
| Секция 1 | body-preamble | 50 B | 0 | no | src/pages/remont-vakuumnogo-upakovshika-reklama/sections/001-body-preamble-sekciya-1.html |
| Подключение partials-injector | runtime-partials | 50 B | 0 | no | src/components/parametric/static/runtime-partials-partials-injector-script-55fc50b4acf9.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/pages/remont-vakuumnogo-upakovshika-reklama/sections/005-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Мобильные контактные элементы | mobile-contact | 40 B | 0 | no | src/pages/remont-vakuumnogo-upakovshika-reklama/sections/004-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Footer mount point | footer-anchor | 36 B | 0 | no | src/components/parametric/static/footer-anchor-footer-container-mount-7e779f23d41c.template.html |
| HTML-фрагмент | layout-fragment | 1 B | 0 | no | src/components/parametric/static/layout-fragment-technical-fragment-01ba4719c80b.template.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- remont-vakuumnogo-upakovshika-reklama.html
- src/site-builder.json
- src/pages/remont-vakuumnogo-upakovshika-reklama/page.json
- src/pages/remont-vakuumnogo-upakovshika-reklama/sections/

## Checks

- npm run doctor:page -- --page remont-vakuumnogo-upakovshika-reklama.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page remont-vakuumnogo-upakovshika-reklama.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
