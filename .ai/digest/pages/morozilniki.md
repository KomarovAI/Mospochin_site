# Page Digest — morozilniki.html

- Branch: household
- Role: service
- Title: Ремонт морозильников и морозильных камер в Москве — MosPochin
- Description: Ремонт бытовых морозильных камер и ларей: диагностика температуры, двери, оттайки, вентилятора, компрессора и герметичности холодильного контура.
- H1: Ремонт бытовых морозильников в Москве
- Canonical: https://mospochin.ru/morozilniki.html
- Builder model: src/pages/morozilniki/page.json
- Sections: 12 (6 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 487

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
| Мобильные контактные элементы | mobile-contact | 7.8 KB | 86 | no | src/components/parametric/freezer-rf1/header-f835a0e908fb.template.html |
| Мобильные контактные элементы | mobile-contact | 4.3 KB | 61 | no | src/components/parametric/freezer-rf1/footer-c46ffb5cdd91.template.html |
| Что отправить до выезда | lead-form | 4.0 KB | 58 | no | src/pages/morozilniki/sections/008-lead-form-chto-otpravit-do-vyezda.html |
| Связанные страницы кластера | section | 2.6 KB | 40 | no | src/pages/morozilniki/sections/007-section-svyazannye-stranicy-klastera.html |
| Что проверить безопасно | proof | 2.1 KB | 57 | no | src/components/parametric/freezer-rf1/safe-diagnostics.template.html |
| Ремонт бытовых морозильников в Москве | contact-cta | 2.0 KB | 39 | no | src/pages/morozilniki/sections/002-contact-cta-remont-bytovyh-morozil-nikov-v-moskve.html |
| Частые вопросы | faq | 1.5 KB | 58 | no | src/pages/morozilniki/sections/009-faq-chastye-voprosy.html |
| Какие работы могут потребоваться | pricing | 1.4 KB | 33 | no | src/pages/morozilniki/sections/006-pricing-kakie-raboty-mogut-potrebovat-sya.html |


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
- morozilniki.html
- src/site-builder.json
- src/pages/morozilniki/page.json
- src/pages/morozilniki/sections/

## Checks

- npm run doctor:household-page -- --page morozilniki.html
- npm run doctor:page -- --page morozilniki.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page morozilniki.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
