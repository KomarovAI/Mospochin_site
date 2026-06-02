# Page Digest — bytovaya-index.html

- Branch: household
- Role: branch
- Title: Ремонт бытовой техники на дому в Москве — MosPochin
- Description: Ремонт бытовой техники на дому в Москве: холодильники, стиральные машины, посудомойки, плиты, микроволновки и водонагреватели.
- H1: Ремонт бытовой техники на дому в Москве
- Canonical: https://mospochin.ru/bytovaya-index.html
- Builder model: src/pages/bytovaya-index/page.json
- Sections: 36 (31 local, 0 shared refs, 12 raw)
- Text words inside referenced sections: 1041

## Component mix

| Component | Count |
| --- | --- |
| raw | 12 |
| proof | 5 |
| pricing | 4 |
| mobile-contact | 3 |
| faq | 2 |
| lead-form | 2 |
| noscript | 2 |
| related-links | 2 |
| footer-anchor | 1 |
| hero | 1 |
| runtime-partials | 1 |
| section | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Ремонтируем все марки | pricing | 28.9 KB | 88 | no | src/pages/bytovaya-index/sections/020-pricing-remontiruem-vse-marki.html |
| Ремонт бытовой техники на дому в Москве | hero | 8.7 KB | 107 | no | src/pages/bytovaya-index/sections/006-hero-remont-bytovoy-tehniki-na-domu-v-moskve.html |
| Популярные категории и типовые поломки | related-links | 7.7 KB | 136 | no | src/pages/bytovaya-index/sections/011-related-links-populyarnye-kategorii-i-tipovye-polomk.html |
| Прозрачные цены без сюрпризов | pricing | 6.5 KB | 73 | no | src/pages/bytovaya-index/sections/018-pricing-prozrachnye-ceny-bez-syurprizov.html |
| Почему бытовую технику чаще чинят дома, а не везут в мастерскую | proof | 5.9 KB | 107 | no | src/pages/bytovaya-index/sections/013-proof-pochemu-bytovuyu-tehniku-chasche-chinyat-doma-.html |
| Спокойный сценарий ремонта без лишних шагов | pricing | 5.0 KB | 96 | no | src/pages/bytovaya-index/sections/009-pricing-spokoynyy-scenariy-remonta-bez-lishnih-shago.html |
| Истории наших клиентов | proof | 4.7 KB | 95 | no | src/pages/bytovaya-index/sections/015-proof-istorii-nashih-klientov.html |
| Оставьте заявку на ремонт | lead-form | 4.6 KB | 55 | no | src/pages/bytovaya-index/sections/025-lead-form-ostav-te-zayavku-na-remont.html |


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
