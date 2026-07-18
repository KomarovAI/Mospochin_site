# Page Digest — elektricheskaya-panel-vybivaet-avtomat.html

- Branch: household
- Role: service
- Title: Электрическая панель выбивает автомат или УЗО | MosPochin
- Description: Варочная панель отключает автомат: проверяем подключение, кабель, изоляцию зон, силовые реле и плату.
- H1: Электрическая панель выбивает автомат или УЗО
- Canonical: https://mospochin.ru/elektricheskaya-panel-vybivaet-avtomat.html
- Builder model: src/pages/elektricheskaya-panel-vybivaet-avtomat/page.json
- Sections: 12 (6 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 465

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
| Мобильные контактные элементы | mobile-contact | 9.3 KB | 110 | no | src/components/parametric/cooking-appliance-cook2/header-ff5231eb4124.template.html |
| Мобильные контактные элементы | mobile-contact | 4.9 KB | 77 | no | src/components/parametric/cooking-appliance-cook2/footer-3aff2ca0a962.template.html |
| Что отправить до выезда | lead-form | 4.0 KB | 57 | no | src/pages/elektricheskaya-panel-vybivaet-avtomat/sections/008-lead-form-chto-otpravit-do-vyezda.html |
| Электрическая панель выбивает автомат или УЗО | contact-cta | 2.2 KB | 41 | no | src/pages/elektricheskaya-panel-vybivaet-avtomat/sections/002-contact-cta-elektricheskaya-panel-vybivaet-avtomat-i.html |
| Связанные страницы кластера | section | 1.9 KB | 25 | no | src/pages/elektricheskaya-panel-vybivaet-avtomat/sections/007-section-svyazannye-stranicy-klastera.html |
| Что проверить безопасно | proof | 1.9 KB | 41 | no | src/components/parametric/cooking-appliance-cook2/safe-diagnostics.template.html |
| Какие работы могут потребоваться | pricing | 1.3 KB | 29 | no | src/pages/elektricheskaya-panel-vybivaet-avtomat/sections/006-pricing-kakie-raboty-mogut-potrebovat-sya.html |
| Частые вопросы | faq | 1.2 KB | 40 | no | src/pages/elektricheskaya-panel-vybivaet-avtomat/sections/009-faq-chastye-voprosy.html |


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
- elektricheskaya-panel-vybivaet-avtomat.html
- src/site-builder.json
- src/pages/elektricheskaya-panel-vybivaet-avtomat/page.json
- src/pages/elektricheskaya-panel-vybivaet-avtomat/sections/

## Checks

- npm run doctor:household-page -- --page elektricheskaya-panel-vybivaet-avtomat.html
- npm run doctor:page -- --page elektricheskaya-panel-vybivaet-avtomat.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page elektricheskaya-panel-vybivaet-avtomat.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
