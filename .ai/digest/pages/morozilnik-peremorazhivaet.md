# Page Digest — morozilnik-peremorazhivaet.html

- Branch: household
- Role: service
- Title: Морозильник перемораживает продукты | MosPochin
- Description: Морозильник работает при слишком низкой температуре: проверяем режим быстрой заморозки, настройку, датчик, термостат, заслонки и управление.
- H1: Морозильник перемораживает продукты
- Canonical: https://mospochin.ru/morozilnik-peremorazhivaet.html
- Builder model: src/pages/morozilnik-peremorazhivaet/page.json
- Sections: 12 (6 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 428

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
| Мобильные контактные элементы | mobile-contact | 7.8 KB | 86 | no | src/components/parametric/freezer-rf1/header-0dbca8217220.template.html |
| Мобильные контактные элементы | mobile-contact | 4.3 KB | 61 | no | src/components/parametric/freezer-rf1/footer-c46ffb5cdd91.template.html |
| Что отправить до выезда | lead-form | 4.0 KB | 58 | no | src/pages/morozilnik-peremorazhivaet/sections/008-lead-form-chto-otpravit-do-vyezda.html |
| Морозильник перемораживает продукты | contact-cta | 2.0 KB | 34 | no | src/pages/morozilnik-peremorazhivaet/sections/002-contact-cta-morozil-nik-peremorazhivaet-produkty.html |
| Что проверить безопасно | proof | 2.0 KB | 38 | no | src/components/parametric/freezer-rf1/safe-diagnostics.template.html |
| Связанные страницы кластера | section | 1.8 KB | 22 | no | src/pages/morozilnik-peremorazhivaet/sections/007-section-svyazannye-stranicy-klastera.html |
| Частые вопросы | faq | 1.5 KB | 53 | no | src/pages/morozilnik-peremorazhivaet/sections/009-faq-chastye-voprosy.html |
| Какие работы могут потребоваться | pricing | 1.3 KB | 30 | no | src/pages/morozilnik-peremorazhivaet/sections/006-pricing-kakie-raboty-mogut-potrebovat-sya.html |


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
- morozilnik-peremorazhivaet.html
- src/site-builder.json
- src/pages/morozilnik-peremorazhivaet/page.json
- src/pages/morozilnik-peremorazhivaet/sections/

## Checks

- npm run doctor:household-page -- --page morozilnik-peremorazhivaet.html
- npm run doctor:page -- --page morozilnik-peremorazhivaet.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page morozilnik-peremorazhivaet.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
