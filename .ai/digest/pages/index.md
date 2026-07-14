# Page Digest — index.html

- Branch: restaurant
- Role: branch
- Title: Ремонт ресторанного оборудования в Москве — MosPochin
- Description: Срочный ремонт пароконвектоматов, плит и холодильного оборудования для ресторанов и кафе. Выезд инженера, договор, гарантия.
- H1: Оборудование встало? Пришлите фото ошибки или шильдика
- Canonical: https://mospochin.ru/
- Builder model: src/pages/index/page.json
- Sections: 26 (21 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 1162

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 6 |
| pricing | 6 |
| proof | 4 |
| layout-fragment | 2 |
| body-preamble | 1 |
| contact-cta | 1 |
| faq | 1 |
| footer-anchor | 1 |
| hero | 1 |
| lead-form | 1 |
| runtime-partials | 1 |
| section | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Работаем со всеми производителями | pricing | 19.1 KB | 108 | no | src/pages/index/sections/012-pricing-rabotaem-so-vsemi-proizvoditelyami.html |
| Ключевые направления по типу поломки и оборудования | pricing | 9.1 KB | 99 | no | src/pages/index/sections/006-pricing-klyuchevye-napravleniya-po-tipu-polomki-i-ob.html |
| Оборудование встало? Пришлите фото ошибки или шильдика | hero | 6.5 KB | 104 | no | src/pages/index/sections/003-hero-oborudovanie-vstalo-prishlite-foto-oshibki-ili-.html |
| Почему рестораны возвращаются к MosPochin | pricing | 5.4 KB | 117 | no | src/pages/index/sections/007-pricing-pochemu-restorany-vozvraschayutsya-k-mospoch.html |
| Оставьте заявку на ремонт | lead-form | 4.3 KB | 70 | no | src/pages/index/sections/018-lead-form-ostav-te-zayavku-na-remont.html |
| Каждая минута простоя = потеря денег и смены | contact-cta | 4.0 KB | 77 | no | src/pages/index/sections/005-contact-cta-kazhdaya-minuta-prostoya-poterya-deneg-i.html |
| Если уже знаете симптом, переходите сразу | section | 3.5 KB | 61 | no | src/pages/index/sections/004-section-esli-uzhe-znaete-simptom-perehodite-srazu.html |
| Что получает заказчик после выезда | pricing | 3.3 KB | 98 | no | src/pages/index/sections/016-pricing-chto-poluchaet-zakazchik-posle-vyezda.html |


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
