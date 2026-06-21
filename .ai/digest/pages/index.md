# Page Digest — index.html

- Branch: restaurant
- Role: branch
- Title: Ремонт оборудования для ресторанов, кафе и столовых — MosPochin
- Description: Ремонт профессионального кухонного оборудования для ресторанов, кафе и столовых: пароконвектоматы, котлы, плиты, посудомойки, холодильное оборудование.
- H1: Ремонт оборудования для ресторанов, кафе и столовых в Москве и области
- Canonical: https://mospochin.ru/
- Builder model: src/pages/index/page.json
- Sections: 28 (21 local, 0 shared refs, 1 raw)
- Text words inside referenced sections: 1375

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 6 |
| pricing | 5 |
| proof | 5 |
| layout-fragment | 2 |
| contact-cta | 1 |
| faq | 1 |
| footer-anchor | 1 |
| hero | 1 |
| lead-form | 1 |
| noscript | 1 |
| raw | 1 |
| related-links | 1 |
| runtime-partials | 1 |
| section | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Работаем со всеми производителями | pricing | 25.6 KB | 108 | no | src/pages/index/sections/013-pricing-rabotaem-so-vsemi-proizvoditelyami.html |
| Основные направления ремонта для кухни общепита | section | 9.1 KB | 180 | no | src/pages/index/sections/005-section-esli-uzhe-znaete-simptom-perehodite-srazu.html |
| Ключевые направления по типу поломки и оборудования | pricing | 8.9 KB | 87 | no | src/pages/index/sections/007-pricing-klyuchevye-napravleniya-po-tipu-polomki-i-ob.html |
| Ремонт оборудования для ресторанов, кафе и столовых в Москве и области | hero | 8.9 KB | 140 | no | src/pages/index/sections/004-hero-remont-restorannogo-oborudovaniya-v-moskve-bez-.html |
| Почему рестораны возвращаются к MosPochin | pricing | 6.8 KB | 115 | no | src/pages/index/sections/008-pricing-pochemu-restorany-vozvraschayutsya-k-mospoch.html |
| Оставьте заявку на ремонт | lead-form | 5.1 KB | 75 | no | src/pages/index/sections/019-lead-form-ostav-te-zayavku-na-remont.html |
| Каждая минута простоя = потеря денег и смены | contact-cta | 4.9 KB | 77 | no | src/pages/index/sections/006-contact-cta-kazhdaya-minuta-prostoya-poterya-deneg-i.html |
| Истории наших клиентов | proof | 4.5 KB | 105 | no | src/pages/index/sections/012-proof-istorii-nashih-klientov.html |


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
