# Page Digest — vakuumnye-upakovshiki-dlya-restorana.html

- Branch: restaurant
- Role: service
- Title: Вакуумные упаковщики для ресторана: оборудование и сервис | MosPochin
- Description: Камерные вакуумные упаковщики для ресторанов: насос, камера, крышка, уплотнение, запаечная планка, эксплуатация и сервис оборудования.
- H1: Вакуумные упаковщики для ресторана
- Canonical: https://mospochin.ru/vakuumnye-upakovshiki-dlya-restorana.html
- Builder model: src/pages/vakuumnye-upakovshiki-dlya-restorana/page.json
- Sections: 7 (5 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 286

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
| Вакуумные упаковщики для ресторана | lead-form | 12.4 KB | 232 | no | src/pages/vakuumnye-upakovshiki-dlya-restorana/sections/002-lead-form-vakuumnye-upakovschiki-dlya-restorana.html |
| Частые вопросы | faq | 1.6 KB | 54 | no | src/pages/vakuumnye-upakovshiki-dlya-restorana/sections/002b-faq-chastye-voprosy.html |
| Подключение partials-injector | runtime-partials | 50 B | 0 | no | src/components/parametric/static/runtime-partials-partials-injector-script-55fc50b4acf9.template.html |
| Секция 1 | body-preamble | 47 B | 0 | no | src/pages/vakuumnye-upakovshiki-dlya-restorana/sections/001-body-preamble-sekciya-1.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/pages/vakuumnye-upakovshiki-dlya-restorana/sections/005-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Мобильные контактные элементы | mobile-contact | 40 B | 0 | no | src/pages/vakuumnye-upakovshiki-dlya-restorana/sections/004-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Footer mount point | footer-anchor | 33 B | 0 | no | src/components/parametric/static/footer-anchor-footer-container-mount-e290e2b6541c.template.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- vakuumnye-upakovshiki-dlya-restorana.html
- src/site-builder.json
- src/pages/vakuumnye-upakovshiki-dlya-restorana/page.json
- src/pages/vakuumnye-upakovshiki-dlya-restorana/sections/

## Checks

- npm run doctor:page -- --page vakuumnye-upakovshiki-dlya-restorana.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page vakuumnye-upakovshiki-dlya-restorana.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
