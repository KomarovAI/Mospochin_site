# Page Digest — remont-duhovyh-shkafov.html

- Branch: household
- Role: service
- Title: Ремонт электрических духовых шкафов в Москве — MosPochin
- Description: Ремонт электрических духовых шкафов: нагрев, конвекция, гриль, дверца, датчики, термозащита и электронное управление.
- H1: Ремонт электрических духовых шкафов в Москве
- Canonical: https://mospochin.ru/remont-duhovyh-shkafov.html
- Builder model: src/pages/remont-duhovyh-shkafov/page.json
- Sections: 12 (6 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 432

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
| Мобильные контактные элементы | mobile-contact | 7.4 KB | 78 | no | src/components/parametric/cooking-appliance-cook2/header-d845b1b50d44.template.html |
| Мобильные контактные элементы | mobile-contact | 4.4 KB | 61 | no | src/components/parametric/cooking-appliance-cook2/footer-c264df5b3edf.template.html |
| Что отправить до выезда | lead-form | 4.0 KB | 57 | no | src/pages/remont-duhovyh-shkafov/sections/008-lead-form-chto-otpravit-do-vyezda.html |
| Что проверить безопасно | proof | 2.0 KB | 47 | no | src/components/parametric/cooking-appliance-cook2/safe-diagnostics.template.html |
| Ремонт электрических духовых шкафов в Москве | contact-cta | 1.9 KB | 32 | no | src/pages/remont-duhovyh-shkafov/sections/002-contact-cta-remont-elektricheskih-duhovyh-shkafov-v-.html |
| Связанные страницы кластера | section | 1.8 KB | 24 | no | src/pages/remont-duhovyh-shkafov/sections/007-section-svyazannye-stranicy-klastera.html |
| Частые вопросы | faq | 1.3 KB | 49 | no | src/pages/remont-duhovyh-shkafov/sections/009-faq-chastye-voprosy.html |
| Какие работы могут потребоваться | pricing | 1.3 KB | 33 | no | src/pages/remont-duhovyh-shkafov/sections/006-pricing-kakie-raboty-mogut-potrebovat-sya.html |


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
- remont-duhovyh-shkafov.html
- src/site-builder.json
- src/pages/remont-duhovyh-shkafov/page.json
- src/pages/remont-duhovyh-shkafov/sections/

## Checks

- npm run doctor:household-page -- --page remont-duhovyh-shkafov.html
- npm run doctor:page -- --page remont-duhovyh-shkafov.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page remont-duhovyh-shkafov.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
