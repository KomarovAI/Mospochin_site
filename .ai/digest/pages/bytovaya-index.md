# Page Digest — bytovaya-index.html

- Branch: household
- Role: branch
- Title: Ремонт бытовой техники на дому в Москве — MosPochin
- Description: Ремонт бытовой техники на дому в Москве: холодильная техника, стиральные и сушильные машины, посудомойки, кухонная техника и водонагреватели.
- H1: Ремонт бытовой техники на дому в Москве
- Canonical: https://mospochin.ru/bytovaya-index.html
- Builder model: src/pages/bytovaya-index/page.json
- Sections: 35 (31 local, 0 shared refs, 9 raw)
- Text words inside referenced sections: 1058

## Component mix

| Component | Count |
| --- | --- |
| raw | 9 |
| mobile-contact | 5 |
| proof | 5 |
| pricing | 4 |
| faq | 2 |
| lead-form | 2 |
| related-links | 2 |
| body-preamble | 1 |
| breadcrumb | 1 |
| hero | 1 |
| layout-fragment | 1 |
| noscript | 1 |
| section | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Мобильные контактные элементы | mobile-contact | 7.2 KB | 78 | no | src/pages/bytovaya-index/sections/003-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Ремонт бытовой техники на дому в Москве | hero | 6.7 KB | 108 | no | src/pages/bytovaya-index/sections/005-hero-remont-bytovoy-tehniki-na-domu-v-moskve.html |
| Сначала выберите, что сломалось | section | 6.2 KB | 111 | no | src/pages/bytovaya-index/sections/006-section-snachala-vyberite-chto-slomalos.html |
| Мобильные контактные элементы | mobile-contact | 4.3 KB | 61 | no | src/pages/bytovaya-index/sections/028-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Спокойный сценарий ремонта без лишних шагов | pricing | 4.1 KB | 96 | no | src/pages/bytovaya-index/sections/008-pricing-spokoynyy-scenariy-remonta-bez-lishnih-shago.html |
| Истории наших клиентов | proof | 3.9 KB | 95 | no | src/pages/bytovaya-index/sections/014-proof-istorii-nashih-klientov.html |
| Оставьте заявку на ремонт | lead-form | 3.7 KB | 61 | no | src/pages/bytovaya-index/sections/024-lead-form-ostav-te-zayavku-na-remont.html |
| Что обычно происходит на бытовом выезде | pricing | 3.7 KB | 153 | no | src/pages/bytovaya-index/sections/015-pricing-chto-obychno-proishodit-na-bytovom-vyezde.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/household-branch.json
- data/household-page-policy.json
- data/household-page-slots.json
- bytovaya-index.html
- src/site-builder.json
- src/pages/bytovaya-index/page.json
- src/pages/bytovaya-index/sections/

## Checks

- npm run doctor:page -- --page bytovaya-index.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page bytovaya-index.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
