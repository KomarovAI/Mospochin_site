# Page Digest — diagnostika-mikrovolnovoy-pechi.html

- Branch: household
- Role: service
- Title: Диагностика микроволновой печи в Москве | MosPochin
- Description: Последовательная диагностика СВЧ по наблюдаемому симптому без опасного вскрытия пользователем и замены деталей наугад.
- H1: Диагностика микроволновой печи
- Canonical: https://mospochin.ru/diagnostika-mikrovolnovoy-pechi.html
- Builder model: src/pages/diagnostika-mikrovolnovoy-pechi/page.json
- Sections: 16 (12 local, 2 shared refs, 0 raw)
- Text words inside referenced sections: 579

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
| Мобильные контактные элементы | mobile-contact | 7.4 KB | 78 | no | src/pages/diagnostika-mikrovolnovoy-pechi/sections/001-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Мобильные контактные элементы | mobile-contact | 4.4 KB | 61 | no | src/pages/diagnostika-mikrovolnovoy-pechi/sections/013-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Что отправить для предварительной квалификации | lead-form | 3.5 KB | 61 | no | src/pages/diagnostika-mikrovolnovoy-pechi/sections/011-lead-form-chto-otpravit-dlya-predvaritel-noy-kvalifi.html |
| Что можно проверить безопасно | proof | 2.8 KB | 48 | no | src/pages/diagnostika-mikrovolnovoy-pechi/sections/006-proof-chto-mozhno-proverit-bezopasno.html |
| Диагностика микроволновой печи | hero | 2.5 KB | 61 | no | src/pages/diagnostika-mikrovolnovoy-pechi/sections/003-hero-diagnostika-mikrovolnovoy-pechi.html |
| Связанные сценарии | related-links | 2.0 KB | 39 | no | src/pages/diagnostika-mikrovolnovoy-pechi/sections/010-related-links-svyazannye-scenarii.html |
| Что важно описать до выезда | section | 1.8 KB | 26 | no | src/pages/diagnostika-mikrovolnovoy-pechi/sections/005-section-chto-vazhno-opisat-do-vyezda.html |
| Каким может быть результат диагностики | section | 1.7 KB | 46 | no | src/pages/diagnostika-mikrovolnovoy-pechi/sections/008-section-kakim-mozhet-byt-rezul-tat-diagnostiki.html |


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
- diagnostika-mikrovolnovoy-pechi.html
- src/site-builder.json
- src/pages/diagnostika-mikrovolnovoy-pechi/page.json
- src/pages/diagnostika-mikrovolnovoy-pechi/sections/

## Checks

- npm run doctor:household-page -- --page diagnostika-mikrovolnovoy-pechi.html
- npm run doctor:page -- --page diagnostika-mikrovolnovoy-pechi.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page diagnostika-mikrovolnovoy-pechi.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
