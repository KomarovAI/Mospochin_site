# Page Digest — index.html

- Branch: restaurant
- Role: branch
- Title: Ремонт ресторанного оборудования в Москве — MosPochin
- Description: Срочный ремонт пароконвектоматов, плит и холодильного оборудования для ресторанов и кафе. Выезд инженера, договор, гарантия.
- H1: Ремонт ресторанного оборудования в Москве без простоя и сюрпризов по цене
- Canonical: https://mospochin.ru/
- Builder model: src/pages/index/page.json
- Sections: 27 (20 local, 0 shared refs, 1 raw)
- Text words inside referenced sections: 1179

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
| runtime-partials | 1 |
| section | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Работаем со всеми производителями | pricing | 25.6 KB | 108 | no | src/pages/index/sections/013-pricing-rabotaem-so-vsemi-proizvoditelyami.html |
| Ремонт ресторанного оборудования в Москве без простоя и сюрпризов по цене | hero | 8.4 KB | 113 | no | src/pages/index/sections/004-hero-remont-restorannogo-oborudovaniya-v-moskve-bez-.html |
| Ключевые направления по типу поломки и оборудования | pricing | 8.3 KB | 87 | no | src/pages/index/sections/007-pricing-klyuchevye-napravleniya-po-tipu-polomki-i-ob.html |
| Почему рестораны возвращаются к MosPochin | pricing | 6.8 KB | 115 | no | src/pages/index/sections/008-pricing-pochemu-restorany-vozvraschayutsya-k-mospoch.html |
| Каждая минута простоя = потеря денег и смены | contact-cta | 4.9 KB | 77 | no | src/pages/index/sections/006-contact-cta-kazhdaya-minuta-prostoya-poterya-deneg-i.html |
| Оставьте заявку на ремонт | lead-form | 4.9 KB | 71 | no | src/pages/index/sections/019-lead-form-ostav-te-zayavku-na-remont.html |
| Истории наших клиентов | proof | 4.5 KB | 105 | no | src/pages/index/sections/012-proof-istorii-nashih-klientov.html |
| Что получает заказчик после выезда | pricing | 3.8 KB | 96 | no | src/pages/index/sections/017-pricing-chto-poluchaet-zakazchik-posle-vyezda.html |


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
