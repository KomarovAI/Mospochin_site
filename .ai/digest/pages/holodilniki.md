# Page Digest — holodilniki.html

- Branch: household
- Role: service
- Title: Ремонт холодильников на дому в Москве — MosPochin
- Description: Ремонт холодильников Bosch, Samsung, LG, Indesit на дому в Москве и МО. Диагностика причины, согласование работ и гарантия после ремонта.
- H1: Холодильник не морозит? Вернём холод сегодня, без сюрпризов по цене
- Canonical: https://mospochin.ru/holodilniki.html
- Builder model: src/pages/holodilniki/page.json
- Sections: 49 (36 local, 5 shared refs, 0 raw)
- Text words inside referenced sections: 3053

## Component mix

| Component | Count |
| --- | --- |
| pricing | 11 |
| proof | 9 |
| layout-fragment | 8 |
| mobile-contact | 7 |
| section | 4 |
| faq | 3 |
| related-links | 2 |
| body-preamble | 1 |
| breadcrumb | 1 |
| contact-cta | 1 |
| hero | 1 |
| lead-form | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Какие бренды и модели берём в работу | pricing | 18.4 KB | 110 | no | src/pages/holodilniki/sections/027-pricing-kakie-brendy-i-modeli-berem-v-rabotu.html |
| Что клиент понимает ещё до начала работ | pricing | 11.6 KB | 429 | no | src/pages/holodilniki/sections/037-pricing-chto-klient-ponimaet-esche-do-nachala-rabot.html |
| Оставьте заявку на звонок по холодильнику | lead-form | 7.7 KB | 143 | no | src/pages/holodilniki/sections/035-lead-form-ostav-te-zayavku-na-zvonok-po-holodil-niku.html |
| Мобильные контактные элементы | mobile-contact | 7.2 KB | 78 | no | src/pages/holodilniki/sections/002-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Какие поломки мы чаще всего чиним на дому | pricing | 5.9 KB | 107 | no | src/pages/holodilniki/sections/018-pricing-kakie-polomki-my-chasche-vsego-chinim-na-dom.html |
| Холодильник не морозит? Вернём холод сегодня, без сюрпризов по цене | hero | 5.2 KB | 87 | no | src/pages/holodilniki/sections/004-hero-holodil-nik-ne-morozit-vernem-holod-segodnya-be.html |
| Какие симптомы чаще всего описывают по телефону | pricing | 5.1 KB | 56 | no | src/pages/holodilniki/sections/015-pricing-kakie-simptomy-chasche-vsego-opisyvayut-po-t.html |
| Что обычно происходит с поломкой холодильника, если тянуть | faq | 4.6 KB | 237 | no | src/pages/holodilniki/sections/021-faq-chto-obychno-proishodit-s-polomkoy-holodil-nika-.html |


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
