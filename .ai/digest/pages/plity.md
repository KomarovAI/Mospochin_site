# Page Digest — plity.html

- Branch: household
- Role: service
- Title: Ремонт духовых шкафов и варочных панелей в Москве — MosPochin
- Description: Ремонт электрических духовых шкафов, стеклокерамических и индукционных варочных панелей в Москве. Диагностика нагрева, управления и силовой части.
- H1: Ремонт духовых шкафов и варочных панелей в Москве
- Canonical: https://mospochin.ru/plity.html
- Builder model: src/pages/plity/page.json
- Sections: 12 (6 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 452

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
| Мобильные контактные элементы | mobile-contact | 7.4 KB | 78 | no | src/components/parametric/cooking-appliance-cook2/header-76780d2f5125.template.html |
| Мобильные контактные элементы | mobile-contact | 4.4 KB | 61 | no | src/components/parametric/cooking-appliance-cook2/footer-e7dcf49c74e0.template.html |
| Что отправить до выезда | lead-form | 4.0 KB | 57 | no | src/pages/plity/sections/008-lead-form-chto-otpravit-do-vyezda.html |
| Связанные страницы кластера | section | 2.2 KB | 30 | no | src/pages/plity/sections/007-section-svyazannye-stranicy-klastera.html |
| Что проверить безопасно | proof | 2.0 KB | 48 | no | src/components/parametric/cooking-appliance-cook2/safe-diagnostics.template.html |
| Ремонт духовых шкафов и варочных панелей в Москве | contact-cta | 1.9 KB | 42 | no | src/pages/plity/sections/002-contact-cta-remont-duhovyh-shkafov-i-varochnyh-panel.html |
| Частые вопросы | faq | 1.4 KB | 50 | no | src/pages/plity/sections/009-faq-chastye-voprosy.html |
| Какие работы могут потребоваться | pricing | 1.3 KB | 31 | no | src/pages/plity/sections/006-pricing-kakie-raboty-mogut-potrebovat-sya.html |


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
- plity.html
- src/site-builder.json
- src/pages/plity/page.json
- src/pages/plity/sections/

## Checks

- npm run doctor:household-page -- --page plity.html
- npm run doctor:page -- --page plity.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page plity.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
