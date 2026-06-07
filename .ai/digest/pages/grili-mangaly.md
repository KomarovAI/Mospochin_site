# Page Digest — grili-mangaly.html

- Branch: restaurant
- Role: service
- Title: Ремонт грилей и фритюрниц в Москве — MosPochin | от 500₽
- Description: Ремонт контактных и газовых грилей, фритюрниц, саламандр и мармитов. Миксеры и блендеры обслуживаем как доп. оборудование. Выезд за 45 мин. Гарантия 24 мес.
- H1: Грили или фритюрница встали? Починим за 1-3 часа
- Canonical: https://mospochin.ru/grili-mangaly.html
- Builder model: src/pages/grili-mangaly/page.json
- Sections: 61 (42 local, 2 shared refs, 14 raw)
- Text words inside referenced sections: 1865

## Component mix

| Component | Count |
| --- | --- |
| raw | 14 |
| layout-fragment | 11 |
| proof | 11 |
| pricing | 6 |
| mobile-contact | 3 |
| section | 3 |
| breadcrumb | 2 |
| faq | 2 |
| noscript | 2 |
| related-links | 2 |
| contact-cta | 1 |
| footer-anchor | 1 |
| hero | 1 |
| lead-form | 1 |
| runtime-partials | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Ремонтируем грили, фритюрницы и тепловую линию кухни | pricing | 20.9 KB | 408 | no | src/pages/grili-mangaly/sections/013-pricing-remontiruem-grili-frityurnicy-i-teplovuyu-li.html |
| Ремонтируем все марки кухонного оборудования | section | 8.0 KB | 54 | no | src/pages/grili-mangaly/sections/023-section-remontiruem-vse-marki-kuhonnogo-oborudovaniy.html |
| Грили или фритюрница встали? Починим за 1-3 часа | hero | 7.7 KB | 85 | no | src/pages/grili-mangaly/sections/007-hero-grili-ili-frityurnica-vstali-pochinim-za-1-3-ch.html |
| Что фиксируем до начала работ на объекте | pricing | 6.7 KB | 181 | no | src/pages/grili-mangaly/sections/045-pricing-chto-fiksiruem-do-nachala-rabot-na-ob-ekte.html |
| Оставьте заявку на ремонт | lead-form | 5.5 KB | 95 | no | src/pages/grili-mangaly/sections/043-lead-form-ostav-te-zayavku-na-remont.html |
| Цены на ремонт грилей, фритюрниц и вспомогательной техники | pricing | 5.2 KB | 108 | no | src/pages/grili-mangaly/sections/019-pricing-ceny-na-remont-griley-frityurnic-i-vspomogat.html |
| Что говорят клиенты | proof | 5.2 KB | 132 | no | src/pages/grili-mangaly/sections/029-proof-chto-govoryat-klienty.html |
| Частые вопросы | faq | 4.9 KB | 116 | no | src/pages/grili-mangaly/sections/039-faq-chastye-voprosy.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- data/restaurant-services.json
- data/restaurant-taxonomy.json
- data/restaurant-proof-layer.json
- data/restaurant-page-slots.json
- grili-mangaly.html
- src/site-builder.json
- src/pages/grili-mangaly/page.json
- src/pages/grili-mangaly/sections/

## Checks

- npm run doctor:restaurant-page -- --page grili-mangaly.html
- npm run doctor:page -- --page grili-mangaly.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page grili-mangaly.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
