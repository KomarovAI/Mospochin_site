# Page Digest — stiralnye-mashiny.html

- Branch: household
- Role: service
- Title: Ремонт стиральных машин в Москве на дому — MosPochin
- Description: Ремонт бытовых стиральных машин в Москве: диагностика слива, набора воды, нагрева, отжима, барабана, протечек и электроники.
- H1: Ремонт стиральных машин в Москве на дому
- Canonical: https://mospochin.ru/stiralnye-mashiny.html
- Builder model: src/pages/stiralnye-mashiny/page.json
- Sections: 28 (20 local, 4 shared refs, 0 raw)
- Text words inside referenced sections: 1620

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 7 |
| section | 5 |
| pricing | 4 |
| proof | 4 |
| related-links | 2 |
| body-preamble | 1 |
| breadcrumb | 1 |
| faq | 1 |
| hero | 1 |
| layout-fragment | 1 |
| lead-form | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Что клиент понимает ещё до начала работ | pricing | 13.1 KB | 429 | no | src/pages/stiralnye-mashiny/sections/017-pricing-chto-klient-ponimaet-esche-do-nachala-rabot.html |
| Выберите наблюдаемый симптом или конкретную работу | pricing | 11.6 KB | 177 | no | src/pages/stiralnye-mashiny/sections/008-pricing-vyberite-nablyudaemyy-simptom-ili-konkretnuy.html |
| Мобильные контактные элементы | mobile-contact | 7.3 KB | 78 | no | src/pages/stiralnye-mashiny/sections/002-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Опишите модель, этап цикла и симптом | lead-form | 5.8 KB | 107 | no | src/pages/stiralnye-mashiny/sections/015-lead-form-opishite-model-etap-cikla-i-simptom.html |
| Люк, цикл, привод и конкретные работы | section | 5.7 KB | 77 | no | src/pages/stiralnye-mashiny/sections/014-section-lyuk-cikl-privod-i-konkretnye-raboty.html |
| Частые вопросы | faq | 4.4 KB | 113 | no | src/pages/stiralnye-mashiny/sections/022-faq-chastye-voprosy.html |
| Мобильные контактные элементы | mobile-contact | 4.4 KB | 61 | no | src/pages/stiralnye-mashiny/sections/026-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Ремонтировать или менять стиральную машину | pricing | 4.2 KB | 82 | no | src/pages/stiralnye-mashiny/sections/010-pricing-remontirovat-ili-menyat-stiral-nuyu-mashinu.html |


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
- stiralnye-mashiny.html
- src/site-builder.json
- src/pages/stiralnye-mashiny/page.json
- src/pages/stiralnye-mashiny/sections/

## Checks

- npm run doctor:household-page -- --page stiralnye-mashiny.html
- npm run doctor:page -- --page stiralnye-mashiny.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page stiralnye-mashiny.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
