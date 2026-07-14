# Page Digest — grili-mangaly.html

- Branch: restaurant
- Role: service
- Title: Ремонт грилей и фритюрниц в Москве — MosPochin | от 500₽
- Description: Ремонт грилей, фритюрниц, саламандр и мармитов. Выезд и смету согласуем после уточнения задачи. Условия по договору.
- H1: Грили или фритюрница встали? Уточним поломку и согласуем ремонт
- Canonical: https://mospochin.ru/grili-mangaly.html
- Builder model: src/pages/grili-mangaly/page.json
- Sections: 63 (43 local, 2 shared refs, 13 raw)
- Text words inside referenced sections: 1953

## Component mix

| Component | Count |
| --- | --- |
| layout-fragment | 13 |
| raw | 13 |
| proof | 10 |
| pricing | 6 |
| section | 5 |
| mobile-contact | 3 |
| breadcrumb | 2 |
| faq | 2 |
| related-links | 2 |
| body-preamble | 1 |
| contact-cta | 1 |
| footer-anchor | 1 |
| hero | 1 |
| lead-form | 1 |
| noscript | 1 |
| runtime-partials | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Ремонтируем грили, фритюрницы и тепловую линию кухни | pricing | 20.9 KB | 408 | no | src/pages/grili-mangaly/sections/012-pricing-remontiruem-grili-frityurnicy-i-teplovuyu-li.html |
| Ремонтируем все марки кухонного оборудования | section | 8.0 KB | 54 | no | src/pages/grili-mangaly/sections/022-section-remontiruem-vse-marki-kuhonnogo-oborudovaniy.html |
| Грили или фритюрница встали? Уточним поломку и согласуем ремонт | hero | 7.8 KB | 88 | no | src/pages/grili-mangaly/sections/006-hero-grili-ili-frityurnica-vstali-utochnim-polomku-i.html |
| Что фиксируем до начала работ на объекте | pricing | 6.7 KB | 181 | no | src/pages/grili-mangaly/sections/044-pricing-chto-fiksiruem-do-nachala-rabot-na-ob-ekte.html |
| Оставьте заявку на ремонт | lead-form | 5.8 KB | 95 | no | src/pages/grili-mangaly/sections/042-lead-form-ostav-te-zayavku-na-remont.html |
| Цены на ремонт грилей, фритюрниц и вспомогательной техники | pricing | 5.3 KB | 111 | no | src/pages/grili-mangaly/sections/018-pricing-ceny-na-remont-griley-frityurnic-i-vspomogat.html |
| Частые вопросы | faq | 5.1 KB | 122 | no | src/pages/grili-mangaly/sections/038-faq-chastye-voprosy.html |
| Если проблема в другом ресторанном оборудовании | related-links | 5.0 KB | 93 | no | src/pages/grili-mangaly/sections/047-related-links-esli-problema-v-drugom-restorannom-obo.html |


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
