# Page Digest — about.html

- Branch: restaurant
- Role: branch
- Title: О сервисе MosPochin — ремонт ресторанного оборудования
- Description: О сервисе MosPochin: специализация, порядок обработки технической заявки, проверяемые контакты и реквизиты без неподтверждённых обещаний.
- H1: Сервис профессионального оборудования ресторанов
- Canonical: https://mospochin.ru/about.html
- Builder model: src/pages/about/page.json
- Sections: 15 (12 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 543

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 5 |
| pricing | 2 |
| body-preamble | 1 |
| contact-cta | 1 |
| faq | 1 |
| hero | 1 |
| layout-fragment | 1 |
| lead-form | 1 |
| navigation | 1 |
| section | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Мобильные контактные элементы | mobile-contact | 9.0 KB | 110 | no | src/pages/about/sections/002-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Мобильные контактные элементы | mobile-contact | 4.8 KB | 77 | no | src/pages/about/sections/011-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Обсудить задачу по оборудованию | lead-form | 2.7 KB | 34 | no | src/pages/about/sections/009-lead-form-obsudit-zadachu-po-oborudovaniyu.html |
| Сервис профессионального оборудования ресторанов | hero | 2.4 KB | 35 | no | src/pages/about/sections/004-hero-servis-professional-nogo-oborudovaniya-restoran.html |
| Что можно подтвердить на сайте | pricing | 2.3 KB | 54 | no | src/pages/about/sections/007-pricing-chto-mozhno-podtverdit-na-sayte.html |
| Частые вопросы | faq | 2.2 KB | 67 | no | src/pages/about/sections/010-faq-chastye-voprosy.html |
| Профессиональная кухня и инженерные системы | section | 2.2 KB | 62 | no | src/pages/about/sections/005-section-professional-naya-kuhnya-i-inzhenernye-siste.html |
| Сначала данные, затем решение | pricing | 1.9 KB | 69 | no | src/pages/about/sections/006-pricing-snachala-dannye-zatem-reshenie.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- data/restaurant-page-slots.json
- about.html
- src/site-builder.json
- src/pages/about/page.json
- src/pages/about/sections/

## Checks

- npm run doctor:page -- --page about.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page about.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
