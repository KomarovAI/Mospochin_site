# Page Digest — uslugi.html

- Branch: restaurant
- Role: branch
- Title: Услуги по ремонту ресторанного оборудования — MosPochin | Цены
- Description: Ремонт пароконвектоматов, плит, холодильного оборудования, посудомоек, грилей, фритюров и льдогенераторов. Диагностика и смета до работ.
- H1: Услуги и цены на ремонт ресторанного оборудования
- Canonical: https://mospochin.ru/uslugi.html
- Builder model: src/pages/uslugi/page.json
- Sections: 26 (21 local, 0 shared refs, 1 raw)
- Text words inside referenced sections: 969

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 6 |
| pricing | 4 |
| section | 3 |
| layout-fragment | 2 |
| proof | 2 |
| body-preamble | 1 |
| breadcrumb | 1 |
| contact-cta | 1 |
| faq | 1 |
| footer-anchor | 1 |
| hero | 1 |
| lead-form | 1 |
| raw | 1 |
| runtime-partials | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Ключевые направления по типу техники | pricing | 13.9 KB | 156 | no | src/pages/uslugi/sections/008-pricing-klyuchevye-napravleniya-po-tipu-tehniki.html |
| Услуги и цены на ремонт ресторанного оборудования | hero | 7.3 KB | 96 | no | src/pages/uslugi/sections/004-hero-uslugi-i-ceny-na-remont-restorannogo-oborudovan.html |
| Все виды услуг для ресторанов | pricing | 6.9 KB | 109 | no | src/pages/uslugi/sections/013-pricing-vse-vidy-uslug-dlya-restoranov.html |
| Почему Быстрый выезд, договор и понятная ответственность | proof | 5.5 KB | 106 | no | src/pages/uslugi/sections/010-proof-pochemu-bystryy-vyezd-dogovor-i-ponyatnaya-otv.html |
| Работаем со всеми форматами | section | 3.7 KB | 36 | no | src/pages/uslugi/sections/009-section-rabotaem-so-vsemi-formatami.html |
| Не знаете, какую услугу выбрать? | section | 3.7 KB | 82 | no | src/pages/uslugi/sections/014-section-ne-znaete-kakuyu-uslugu-vybrat.html |
| Каждая минута простоя = потеря денег | pricing | 3.4 KB | 67 | no | src/pages/uslugi/sections/007-pricing-kazhdaya-minuta-prostoya-poterya-deneg.html |
| Начните с симптома, если техника уже встала | section | 3.3 KB | 64 | no | src/pages/uslugi/sections/006-section-nachnite-s-simptoma-esli-tehnika-uzhe-vstala.html |


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
