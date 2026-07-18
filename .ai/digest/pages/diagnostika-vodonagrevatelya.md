# Page Digest — diagnostika-vodonagrevatelya.html

- Branch: household
- Role: service
- Title: Диагностика водонагревателя в Москве — MosPochin
- Description: Диагностика электрических накопительных и проточных водонагревателей в Москве и МО: питание, защита, нагрев, датчики, соединения и источник течи.
- H1: Диагностика электрического водонагревателя
- Canonical: https://mospochin.ru/diagnostika-vodonagrevatelya.html
- Builder model: src/pages/diagnostika-vodonagrevatelya/page.json
- Sections: 40 (23 local, 2 shared refs, 4 raw)
- Text words inside referenced sections: 1499

## Component mix

| Component | Count |
| --- | --- |
| section | 8 |
| mobile-contact | 7 |
| layout-fragment | 6 |
| pricing | 4 |
| proof | 4 |
| raw | 4 |
| related-links | 2 |
| body-preamble | 1 |
| breadcrumb | 1 |
| faq | 1 |
| hero | 1 |
| lead-form | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Что клиент понимает ещё до начала работ | pricing | 13.1 KB | 428 | no | src/pages/diagnostika-vodonagrevatelya/sections/028-pricing-chto-klient-ponimaet-esche-do-nachala-rabot.html |
| Мобильные контактные элементы | mobile-contact | 7.4 KB | 78 | no | src/pages/diagnostika-vodonagrevatelya/sections/002-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Опишите модель и точный симптом | lead-form | 5.9 KB | 104 | no | src/pages/diagnostika-vodonagrevatelya/sections/026-lead-form-opishite-model-i-tochnyy-simptom.html |
| Частые вопросы | faq | 4.7 KB | 124 | no | src/pages/diagnostika-vodonagrevatelya/sections/033-faq-chastye-voprosy.html |
| Мобильные контактные элементы | mobile-contact | 4.4 KB | 61 | no | src/pages/diagnostika-vodonagrevatelya/sections/037-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Что клиент должен получить после диагностики | pricing | 4.3 KB | 82 | no | src/pages/diagnostika-vodonagrevatelya/sections/013-pricing-chto-klient-dolzhen-poluchit-posle-diagnosti.html |
| Одинаковый симптом — разные причины | section | 4.2 KB | 61 | no | src/pages/diagnostika-vodonagrevatelya/sections/011-section-odinakovyy-simptom-raznye-prichiny.html |
| Последовательность проверки | section | 3.8 KB | 83 | no | src/pages/diagnostika-vodonagrevatelya/sections/012-section-posledovatel-nost-proverki.html |


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
- diagnostika-vodonagrevatelya.html
- src/site-builder.json
- src/pages/diagnostika-vodonagrevatelya/page.json
- src/pages/diagnostika-vodonagrevatelya/sections/

## Checks

- npm run doctor:household-page -- --page diagnostika-vodonagrevatelya.html
- npm run doctor:page -- --page diagnostika-vodonagrevatelya.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page diagnostika-vodonagrevatelya.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
