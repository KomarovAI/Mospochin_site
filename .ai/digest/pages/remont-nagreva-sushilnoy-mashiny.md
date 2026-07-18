# Page Digest — remont-nagreva-sushilnoy-mashiny.html

- Branch: household
- Role: service
- Title: Ремонт системы нагрева сушильной машины | MosPochin
- Description: Ремонт нагрева сушильной машины с учётом конструкции: резистивный нагреватель, термозащита или тепловой насос.
- H1: Ремонт системы нагрева сушильной машины
- Canonical: https://mospochin.ru/remont-nagreva-sushilnoy-mashiny.html
- Builder model: src/pages/remont-nagreva-sushilnoy-mashiny/page.json
- Sections: 12 (6 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 460

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
| Мобильные контактные элементы | mobile-contact | 9.3 KB | 110 | no | src/components/parametric/dryer-dr1/header-ff5231eb4124.template.html |
| Мобильные контактные элементы | mobile-contact | 4.9 KB | 77 | no | src/components/parametric/dryer-dr1/footer-3aff2ca0a962.template.html |
| Что отправить до выезда | lead-form | 4.0 KB | 57 | no | src/pages/remont-nagreva-sushilnoy-mashiny/sections/008-lead-form-chto-otpravit-do-vyezda.html |
| Ремонт системы нагрева сушильной машины | contact-cta | 2.0 KB | 35 | no | src/pages/remont-nagreva-sushilnoy-mashiny/sections/002-contact-cta-remont-sistemy-nagreva-sushil-noy-mashin.html |
| Что проверить безопасно | proof | 1.9 KB | 33 | no | src/components/parametric/dryer-dr1/safe-diagnostics.template.html |
| Связанные страницы кластера | section | 1.8 KB | 23 | no | src/pages/remont-nagreva-sushilnoy-mashiny/sections/007-section-svyazannye-stranicy-klastera.html |
| Частые вопросы | faq | 1.4 KB | 53 | no | src/pages/remont-nagreva-sushilnoy-mashiny/sections/009-faq-chastye-voprosy.html |
| Какие работы могут потребоваться | pricing | 1.3 KB | 28 | no | src/pages/remont-nagreva-sushilnoy-mashiny/sections/006-pricing-kakie-raboty-mogut-potrebovat-sya.html |


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
- remont-nagreva-sushilnoy-mashiny.html
- src/site-builder.json
- src/pages/remont-nagreva-sushilnoy-mashiny/page.json
- src/pages/remont-nagreva-sushilnoy-mashiny/sections/

## Checks

- npm run doctor:household-page -- --page remont-nagreva-sushilnoy-mashiny.html
- npm run doctor:page -- --page remont-nagreva-sushilnoy-mashiny.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page remont-nagreva-sushilnoy-mashiny.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
