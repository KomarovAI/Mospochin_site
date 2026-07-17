# Page Digest — index.html

- Branch: restaurant
- Role: branch
- Title: Ремонт ресторанного оборудования в Москве — MosPochin
- Description: Ремонт профессионального оборудования ресторанов и пищеблоков в Москве и Московской области. Каталог направлений, быстрый выбор по симптому, телефон и WhatsApp.
- H1: Ремонт профессионального оборудования ресторанов в Москве
- Canonical: https://mospochin.ru/
- Builder model: src/pages/index/page.json
- Sections: 14 (11 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 711

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 5 |
| pricing | 2 |
| section | 2 |
| body-preamble | 1 |
| faq | 1 |
| hero | 1 |
| layout-fragment | 1 |
| lead-form | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Мобильные контактные элементы | mobile-contact | 9.0 KB | 110 | no | src/pages/index/sections/002-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Выберите нужное направление | section | 9.0 KB | 131 | no | src/pages/index/sections/004-section-vyberite-nuzhnoe-napravlenie.html |
| Мобильные контактные элементы | mobile-contact | 4.7 KB | 77 | no | src/pages/index/sections/010-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Ремонт профессионального оборудования ресторанов в Москве | hero | 3.5 KB | 54 | no | src/pages/index/sections/003-hero-remont-professional-nogo-oborudovaniya-restoran.html |
| Если симптом уже известен | section | 2.8 KB | 78 | no | src/pages/index/sections/005-section-esli-simptom-uzhe-izvesten.html |
| Частые вопросы | faq | 2.7 KB | 91 | no | src/pages/index/sections/009-faq-chastye-voprosy.html |
| Передать задачу инженеру | lead-form | 2.7 KB | 33 | no | src/pages/index/sections/008-lead-form-peredat-zadachu-inzheneru.html |
| Понятная передача задачи и результата | pricing | 2.6 KB | 83 | no | src/pages/index/sections/007-pricing-ponyatnaya-peredacha-zadachi-i-rezul-tata.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- data/restaurant-page-slots.json
- index.html
- src/site-builder.json
- src/pages/index/page.json
- src/pages/index/sections/

## Checks

- npm run doctor:page -- --page index.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page index.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
