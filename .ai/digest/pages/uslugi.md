# Page Digest — uslugi.html

- Branch: restaurant
- Role: branch
- Title: Услуги по ремонту ресторанного оборудования — MosPochin | Цены
- Description: Ремонт пароконвектоматов, плит, холодильного оборудования, посудомоек, грилей и фритюра, льдогенераторов. Гарантия 24 мес. Диагностика бесплатно при ремонте.
- H1: Услуги и цены на ремонт ресторанного оборудования
- Canonical: https://mospochin.ru/uslugi.html
- Builder model: src/pages/uslugi/page.json
- Sections: 30 (20 local, 0 shared refs, 2 raw)
- Text words inside referenced sections: 926

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 6 |
| layout-fragment | 5 |
| pricing | 4 |
| section | 3 |
| proof | 2 |
| raw | 2 |
| breadcrumb | 1 |
| contact-cta | 1 |
| faq | 1 |
| footer-anchor | 1 |
| hero | 1 |
| lead-form | 1 |
| noscript | 1 |
| runtime-partials | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Ключевые направления по типу техники | pricing | 14.0 KB | 134 | no | src/pages/uslugi/sections/009-pricing-klyuchevye-napravleniya-po-tipu-tehniki.html |
| Услуги и цены на ремонт ресторанного оборудования | hero | 8.5 KB | 81 | no | src/pages/uslugi/sections/005-hero-uslugi-i-ceny-na-remont-restorannogo-oborudovan.html |
| Все виды услуг для ресторанов | pricing | 7.1 KB | 109 | no | src/pages/uslugi/sections/014-pricing-vse-vidy-uslug-dlya-restoranov.html |
| Почему Быстрый выезд, договор и понятная ответственность | proof | 6.7 KB | 105 | no | src/pages/uslugi/sections/011-proof-pochemu-bystryy-vyezd-dogovor-i-ponyatnaya-otv.html |
| Работаем со всеми форматами | section | 4.7 KB | 36 | no | src/pages/uslugi/sections/010-section-rabotaem-so-vsemi-formatami.html |
| Каждая минута простоя = потеря денег | pricing | 4.4 KB | 67 | no | src/pages/uslugi/sections/008-pricing-kazhdaya-minuta-prostoya-poterya-deneg.html |
| Не знаете, какую услугу выбрать? | section | 3.7 KB | 82 | no | src/pages/uslugi/sections/015-section-ne-znaete-kakuyu-uslugu-vybrat.html |
| Нам доверяют | proof | 3.4 KB | 26 | no | src/pages/uslugi/sections/012-proof-nam-doveryayut.html |


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
