# Page Digest — zamena-tena-vodonagrevatelya.html

- Branch: household
- Role: service
- Title: Замена ТЭНа водонагревателя в Москве — MosPochin
- Description: Замена ТЭНа электрического водонагревателя в Москве и МО после диагностики сопротивления и изоляции. Подбор совместимого узла, прокладки и проверка нагрева.
- H1: Замена ТЭНа водонагревателя
- Canonical: https://mospochin.ru/zamena-tena-vodonagrevatelya.html
- Builder model: src/pages/zamena-tena-vodonagrevatelya/page.json
- Sections: 34 (22 local, 1 shared refs, 4 raw)
- Text words inside referenced sections: 1441

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 7 |
| proof | 5 |
| section | 5 |
| pricing | 4 |
| raw | 4 |
| layout-fragment | 2 |
| related-links | 2 |
| body-preamble | 1 |
| breadcrumb | 1 |
| faq | 1 |
| hero | 1 |
| lead-form | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Что клиент понимает ещё до начала работ | pricing | 13.1 KB | 429 | no | src/pages/zamena-tena-vodonagrevatelya/sections/022-pricing-chto-klient-ponimaet-esche-do-nachala-rabot.html |
| Дополнительные фотографии узла | pricing | 10.4 KB | 71 | no | src/components/parametric/water-heater-wh4/pricing.template.html |
| Мобильные контактные элементы | mobile-contact | 7.4 KB | 78 | no | src/pages/zamena-tena-vodonagrevatelya/sections/002-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Опишите модель и точный симптом | lead-form | 5.9 KB | 106 | no | src/pages/zamena-tena-vodonagrevatelya/sections/020-lead-form-opishite-model-i-tochnyy-simptom.html |
| Что входит в корректную замену | pricing | 4.6 KB | 77 | no | src/pages/zamena-tena-vodonagrevatelya/sections/013-pricing-chto-vhodit-v-korrektnuyu-zamenu.html |
| Частые вопросы | faq | 4.6 KB | 121 | no | src/pages/zamena-tena-vodonagrevatelya/sections/027-faq-chastye-voprosy.html |
| Мобильные контактные элементы | mobile-contact | 4.4 KB | 61 | no | src/pages/zamena-tena-vodonagrevatelya/sections/031-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Нет нагрева | section | 4.2 KB | 59 | no | src/pages/zamena-tena-vodonagrevatelya/sections/011-section-net-nagreva.html |


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
- zamena-tena-vodonagrevatelya.html
- src/site-builder.json
- src/pages/zamena-tena-vodonagrevatelya/page.json
- src/pages/zamena-tena-vodonagrevatelya/sections/

## Checks

- npm run doctor:household-page -- --page zamena-tena-vodonagrevatelya.html
- npm run doctor:page -- --page zamena-tena-vodonagrevatelya.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page zamena-tena-vodonagrevatelya.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
