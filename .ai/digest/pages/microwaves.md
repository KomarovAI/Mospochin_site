# Page Digest — microwaves.html

- Branch: household
- Role: service
- Title: Ремонт микроволновых печей в Москве — MosPochin
- Description: Диагностика и ремонт бытовых отдельно стоящих и встроенных СВЧ в Москве: нагрев, искрение, дверца, поддон, питание и управление.
- H1: Ремонт микроволновых печей в Москве
- Canonical: https://mospochin.ru/microwaves.html
- Builder model: src/pages/microwaves/page.json
- Sections: 16 (12 local, 2 shared refs, 0 raw)
- Text words inside referenced sections: 630

## Component mix

| Component | Count |
| --- | --- |
| section | 4 |
| mobile-contact | 2 |
| breadcrumb | 1 |
| contact-cta | 1 |
| faq | 1 |
| hero | 1 |
| layout-fragment | 1 |
| lead-form | 1 |
| navigation | 1 |
| pricing | 1 |
| proof | 1 |
| related-links | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Мобильные контактные элементы | mobile-contact | 7.4 KB | 78 | no | src/pages/microwaves/sections/001-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Мобильные контактные элементы | mobile-contact | 4.4 KB | 61 | no | src/pages/microwaves/sections/013-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Что отправить для предварительной квалификации | lead-form | 3.4 KB | 61 | no | src/pages/microwaves/sections/011-lead-form-chto-otpravit-dlya-predvaritel-noy-kvalifi.html |
| Связанные сценарии | related-links | 2.8 KB | 55 | no | src/pages/microwaves/sections/010-related-links-svyazannye-scenarii.html |
| Что можно проверить безопасно | proof | 2.7 KB | 44 | no | src/pages/microwaves/sections/006-proof-chto-mozhno-proverit-bezopasno.html |
| Ремонт микроволновых печей в Москве | hero | 2.5 KB | 64 | no | src/pages/microwaves/sections/003-hero-remont-mikrovolnovyh-pechey-v-moskve.html |
| Частые вопросы | faq | 2.1 KB | 76 | no | src/pages/microwaves/sections/012-faq-chastye-voprosy.html |
| Что важно описать до выезда | section | 1.9 KB | 34 | no | src/pages/microwaves/sections/005-section-chto-vazhno-opisat-do-vyezda.html |


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
- microwaves.html
- src/site-builder.json
- src/pages/microwaves/page.json
- src/pages/microwaves/sections/

## Checks

- npm run doctor:household-page -- --page microwaves.html
- npm run doctor:page -- --page microwaves.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page microwaves.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
