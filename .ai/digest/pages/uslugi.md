# Page Digest — uslugi.html

- Branch: restaurant
- Role: branch
- Title: Ремонт оборудования ресторанов — каталог услуг MosPochin
- Description: Каталог ремонта профессионального оборудования ресторанов: пароконвектоматы, плиты, котлы, холодильная и моечная техника, куттеры, sous-vide и вентиляция.
- H1: Ремонт профессионального оборудования ресторанов
- Canonical: https://mospochin.ru/uslugi.html
- Builder model: src/pages/uslugi/page.json
- Sections: 18 (15 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 504

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 6 |
| section | 6 |
| body-preamble | 1 |
| faq | 1 |
| hero | 1 |
| layout-fragment | 1 |
| lead-form | 1 |
| navigation | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Мобильные контактные элементы | mobile-contact | 9.0 KB | 110 | no | src/pages/uslugi/sections/002-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Мобильные контактные элементы | mobile-contact | 4.8 KB | 77 | no | src/pages/uslugi/sections/014-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Тепловое оборудование | section | 4.6 KB | 60 | no | src/pages/uslugi/sections/006-section-teplovoe-oborudovanie.html |
| Оставить заявку по оборудованию | lead-form | 2.7 KB | 34 | no | src/pages/uslugi/sections/012-lead-form-ostavit-zayavku-po-oborudovaniyu.html |
| Частые вопросы | faq | 2.1 KB | 67 | no | src/pages/uslugi/sections/013-faq-chastye-voprosy.html |
| Холодильное оборудование | section | 2.0 KB | 27 | no | src/pages/uslugi/sections/007-section-holodil-noe-oborudovanie.html |
| Ремонт профессионального оборудования ресторанов | hero | 1.7 KB | 27 | no | src/pages/uslugi/sections/004-hero-remont-professional-nogo-oborudovaniya-restoran.html |
| Пришлите общий вид и шильдик | mobile-contact | 1.7 KB | 34 | no | src/pages/uslugi/sections/011-mobile-contact-prishlite-obschiy-vid-i-shil-dik.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- data/restaurant-page-slots.json
- uslugi.html
- src/site-builder.json
- src/pages/uslugi/page.json
- src/pages/uslugi/sections/

## Checks

- npm run doctor:page -- --page uslugi.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page uslugi.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
