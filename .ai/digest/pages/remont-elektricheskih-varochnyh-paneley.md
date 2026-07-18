# Page Digest — remont-elektricheskih-varochnyh-paneley.html

- Branch: household
- Role: service
- Title: Ремонт электрических варочных панелей в Москве — MosPochin
- Description: Ремонт электрических и стеклокерамических варочных панелей: конфорки, регуляторы мощности, сенсор, проводка и плата управления.
- H1: Ремонт электрических варочных панелей в Москве
- Canonical: https://mospochin.ru/remont-elektricheskih-varochnyh-paneley.html
- Builder model: src/pages/remont-elektricheskih-varochnyh-paneley/page.json
- Sections: 12 (6 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 425

## Component mix

| Component | Count |
| --- | --- |
| contact-cta | 2 |
| mobile-contact | 2 |
| proof | 2 |
| section | 2 |
| breadcrumb | 1 |
| faq | 1 |
| lead-form | 1 |
| pricing | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Мобильные контактные элементы | mobile-contact | 7.5 KB | 78 | no | src/components/parametric/cooking-appliance-cook2/header-d845b1b50d44.template.html |
| Мобильные контактные элементы | mobile-contact | 4.4 KB | 61 | no | src/components/parametric/cooking-appliance-cook2/footer-c264df5b3edf.template.html |
| Что отправить до выезда | lead-form | 4.0 KB | 57 | no | src/pages/remont-elektricheskih-varochnyh-paneley/sections/008-lead-form-chto-otpravit-do-vyezda.html |
| Ремонт электрических варочных панелей в Москве | contact-cta | 2.0 KB | 34 | no | src/pages/remont-elektricheskih-varochnyh-paneley/sections/002-contact-cta-remont-elektricheskih-varochnyh-paneley-.html |
| Что проверить безопасно | proof | 1.9 KB | 41 | no | src/components/parametric/cooking-appliance-cook2/safe-diagnostics.template.html |
| Связанные страницы кластера | section | 1.9 KB | 25 | no | src/pages/remont-elektricheskih-varochnyh-paneley/sections/007-section-svyazannye-stranicy-klastera.html |
| Частые вопросы | faq | 1.3 KB | 47 | no | src/pages/remont-elektricheskih-varochnyh-paneley/sections/009-faq-chastye-voprosy.html |
| Какие работы могут потребоваться | pricing | 1.3 KB | 33 | no | src/pages/remont-elektricheskih-varochnyh-paneley/sections/006-pricing-kakie-raboty-mogut-potrebovat-sya.html |


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
- remont-elektricheskih-varochnyh-paneley.html
- src/site-builder.json
- src/pages/remont-elektricheskih-varochnyh-paneley/page.json
- src/pages/remont-elektricheskih-varochnyh-paneley/sections/

## Checks

- npm run doctor:household-page -- --page remont-elektricheskih-varochnyh-paneley.html
- npm run doctor:page -- --page remont-elektricheskih-varochnyh-paneley.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page remont-elektricheskih-varochnyh-paneley.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
