# Page Digest — bytovaya-index.html

- Branch: household
- Role: branch
- Title: Ремонт бытовой техники на дому в Москве — MosPochin
- Description: Ремонт бытовой техники на дому в Москве: холодильники, стиральные машины, посудомойки, плиты, микроволновки и водонагреватели.
- H1: Ремонт бытовой техники на дому в Москве
- Canonical: https://mospochin.ru/bytovaya-index.html
- Builder model: src/pages/bytovaya-index/page.json
- Sections: 34 (33 local, 0 shared refs, 9 raw)
- Text words inside referenced sections: 1191

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
| hero | 1 |
| layout-fragment | 1 |
| noscript | 1 |
| section | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Работаем с распространёнными марками | pricing | 21.3 KB | 90 | no | src/pages/bytovaya-index/sections/019-pricing-rabotaem-s-rasprostranennymi-markami.html |
| Мобильные контактные элементы | mobile-contact | 7.2 KB | 78 | no | src/pages/bytovaya-index/sections/003-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Популярные категории и типовые поломки | related-links | 7.1 KB | 136 | no | src/pages/bytovaya-index/sections/010-related-links-populyarnye-kategorii-i-tipovye-polomk.html |
| Ремонт бытовой техники на дому в Москве | hero | 6.7 KB | 108 | no | src/pages/bytovaya-index/sections/005-hero-remont-bytovoy-tehniki-na-domu-v-moskve.html |
| Прозрачные цены без сюрпризов | pricing | 5.9 KB | 73 | no | src/pages/bytovaya-index/sections/017-pricing-prozrachnye-ceny-bez-syurprizov.html |
| Почему бытовую технику чаще чинят дома, а не везут в мастерскую | proof | 4.9 KB | 109 | no | src/pages/bytovaya-index/sections/012-proof-pochemu-bytovuyu-tehniku-chasche-chinyat-doma-.html |
| Сначала выберите, что сломалось | section | 4.3 KB | 73 | no | src/pages/bytovaya-index/sections/006-section-snachala-vyberite-chto-slomalos.html |
| Мобильные контактные элементы | mobile-contact | 4.3 KB | 61 | no | src/pages/bytovaya-index/sections/028-mobile-contact-mobil-nye-kontaktnye-elementy.html |


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
