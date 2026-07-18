# Page Digest — zamena-tena-duhovki.html

- Branch: household
- Role: service
- Title: Замена ТЭНа духового шкафа в Москве | MosPochin
- Description: Замена верхнего, нижнего или кольцевого ТЭНа духовки после проверки сопротивления, изоляции, питания и совместимости детали.
- H1: Замена ТЭНа духового шкафа в Москве
- Canonical: https://mospochin.ru/zamena-tena-duhovki.html
- Builder model: src/pages/zamena-tena-duhovki/page.json
- Sections: 12 (6 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 486

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
| Мобильные контактные элементы | mobile-contact | 9.2 KB | 110 | no | src/components/parametric/cooking-appliance-cook2/header-ff5231eb4124.template.html |
| Мобильные контактные элементы | mobile-contact | 4.9 KB | 77 | no | src/components/parametric/cooking-appliance-cook2/footer-3aff2ca0a962.template.html |
| Что отправить до выезда | lead-form | 4.0 KB | 57 | no | src/pages/zamena-tena-duhovki/sections/008-lead-form-chto-otpravit-do-vyezda.html |
| Замена ТЭНа духового шкафа в Москве | contact-cta | 2.1 KB | 44 | no | src/pages/zamena-tena-duhovki/sections/002-contact-cta-zamena-tena-duhovogo-shkafa-v-moskve.html |
| Что проверить безопасно | proof | 2.0 KB | 45 | no | src/components/parametric/cooking-appliance-cook2/safe-diagnostics.template.html |
| Связанные страницы кластера | section | 1.8 KB | 25 | no | src/pages/zamena-tena-duhovki/sections/007-section-svyazannye-stranicy-klastera.html |
| Какие работы могут потребоваться | pricing | 1.3 KB | 33 | no | src/pages/zamena-tena-duhovki/sections/006-pricing-kakie-raboty-mogut-potrebovat-sya.html |
| Частые вопросы | faq | 1.3 KB | 44 | no | src/pages/zamena-tena-duhovki/sections/009-faq-chastye-voprosy.html |


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
- zamena-tena-duhovki.html
- src/site-builder.json
- src/pages/zamena-tena-duhovki/page.json
- src/pages/zamena-tena-duhovki/sections/

## Checks

- npm run doctor:household-page -- --page zamena-tena-duhovki.html
- npm run doctor:page -- --page zamena-tena-duhovki.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page zamena-tena-duhovki.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
