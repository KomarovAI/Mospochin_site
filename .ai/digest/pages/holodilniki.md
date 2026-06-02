# Page Digest — holodilniki.html

- Branch: household
- Role: service
- Title: Ремонт холодильников на дому в Москве — MosPochin
- Description: Ремонт холодильников Bosch, Samsung, LG, Indesit на дому в Москве и МО. Диагностика причины, согласование работ и гарантия после ремонта.
- H1: Холодильник не морозит? Вернём холод сегодня, без сюрпризов по цене
- Canonical: https://mospochin.ru/holodilniki.html
- Builder model: src/pages/holodilniki/page.json
- Sections: 51 (44 local, 2 shared refs, 10 raw)
- Text words inside referenced sections: 2995

## Component mix

| Component | Count |
| --- | --- |
| pricing | 12 |
| raw | 10 |
| proof | 7 |
| mobile-contact | 5 |
| section | 4 |
| faq | 3 |
| contact-cta | 2 |
| related-links | 2 |
| breadcrumb | 1 |
| footer-anchor | 1 |
| hero | 1 |
| lead-form | 1 |
| noscript | 1 |
| runtime-partials | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Какие бренды и модели берём в работу | pricing | 18.9 KB | 110 | no | src/pages/holodilniki/sections/028-pricing-kakie-brendy-i-modeli-berem-v-rabotu.html |
| Что клиент понимает ещё до начала работ | pricing | 13.0 KB | 424 | no | src/pages/holodilniki/sections/038-pricing-chto-klient-ponimaet-esche-do-nachala-rabot.html |
| Оставьте заявку на звонок по холодильнику | lead-form | 8.2 KB | 143 | no | src/pages/holodilniki/sections/036-lead-form-ostav-te-zayavku-na-zvonok-po-holodil-niku.html |
| Свежие кейсы по ремонту холодильников | contact-cta | 8.1 KB | 105 | no | src/pages/holodilniki/sections/018-contact-cta-svezhie-keysy-po-remontu-holodil-nikov.html |
| Холодильник не морозит? Вернём холод сегодня, без сюрпризов по цене | hero | 6.2 KB | 85 | no | src/pages/holodilniki/sections/005-hero-holodil-nik-ne-morozit-vernem-holod-segodnya-be.html |
| Какие поломки мы чаще всего чиним на дому | pricing | 6.0 KB | 108 | no | src/pages/holodilniki/sections/019-pricing-kakie-polomki-my-chasche-vsego-chinim-na-dom.html |
| Сколько обычно стоит ремонт холодильника | pricing | 5.4 KB | 105 | no | src/pages/holodilniki/sections/020-pricing-skol-ko-obychno-stoit-remont-holodil-nika.html |
| Отзывы по ремонту холодильников | pricing | 5.4 KB | 138 | no | src/pages/holodilniki/sections/024-pricing-otzyvy-po-remontu-holodil-nikov.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/household-branch.json
- data/household-page-policy.json
- data/household-services.json
- data/household-taxonomy.json
- data/household-proof-layer.json
- data/household-page-slots.json
- holodilniki.html
- src/site-builder.json
- src/pages/holodilniki/page.json
- src/pages/holodilniki/sections/

## Checks

- npm run doctor:household-page -- --page holodilniki.html
- npm run doctor:page -- --page holodilniki.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page holodilniki.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
