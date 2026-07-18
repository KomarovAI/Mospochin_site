# Page Digest — posudomoyki.html

- Branch: household
- Role: service
- Title: Ремонт бытовых посудомоечных машин в Москве — MosPochin
- Description: Ремонт бытовых посудомоечных машин: не сливает, плохо моет, течёт, не набирает или не нагревает воду. Диагностика на дому в Москве.
- H1: Ремонт бытовых посудомоечных машин в Москве
- Canonical: https://mospochin.ru/posudomoyki.html
- Builder model: src/pages/posudomoyki/page.json
- Sections: 13 (12 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 591

## Component mix

| Component | Count |
| --- | --- |
| section | 3 |
| contact-cta | 2 |
| mobile-contact | 2 |
| pricing | 2 |
| breadcrumb | 1 |
| faq | 1 |
| lead-form | 1 |
| proof | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Мобильные контактные элементы | mobile-contact | 7.4 KB | 78 | no | src/pages/posudomoyki/sections/001-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Мобильные контактные элементы | mobile-contact | 4.4 KB | 61 | no | src/pages/posudomoyki/sections/011-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Что отправить до выезда | lead-form | 4.0 KB | 58 | no | src/pages/posudomoyki/sections/009-lead-form-chto-otpravit-do-vyezda.html |
| Углублённые сценарии DW2 | section | 3.5 KB | 64 | no | src/pages/posudomoyki/sections/008-section-uglublennye-scenarii-dw2.html |
| Частые вопросы | faq | 2.3 KB | 93 | no | src/pages/posudomoyki/sections/010-faq-chastye-voprosy.html |
| Ремонт бытовых посудомоечных машин в Москве | contact-cta | 2.1 KB | 52 | no | src/pages/posudomoyki/sections/002-contact-cta-remont-bytovyh-posudomoechnyh-mashin-v-m.html |
| Что проверить безопасно | pricing | 2.1 KB | 54 | no | src/pages/posudomoyki/sections/004-pricing-chto-proverit-bezopasno.html |
| Связанные страницы бытового кластера | section | 1.9 KB | 31 | no | src/pages/posudomoyki/sections/007-section-svyazannye-stranicy-bytovogo-klastera.html |


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
- posudomoyki.html
- src/site-builder.json
- src/pages/posudomoyki/page.json
- src/pages/posudomoyki/sections/

## Checks

- npm run doctor:household-page -- --page posudomoyki.html
- npm run doctor:page -- --page posudomoyki.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page posudomoyki.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
