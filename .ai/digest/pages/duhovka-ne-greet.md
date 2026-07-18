# Page Digest — duhovka-ne-greet.html

- Branch: household
- Role: service
- Title: Духовка не греет — ремонт в Москве | MosPochin
- Description: Духовка включается, но не нагревает: проверяем режим, питание, ТЭНы, датчик температуры, термозащиту, проводку и плату.
- H1: Духовка не греет — ремонт в Москве
- Canonical: https://mospochin.ru/duhovka-ne-greet.html
- Builder model: src/pages/duhovka-ne-greet/page.json
- Sections: 12 (6 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 497

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
| Что отправить до выезда | lead-form | 4.0 KB | 57 | no | src/pages/duhovka-ne-greet/sections/008-lead-form-chto-otpravit-do-vyezda.html |
| Духовка не греет — ремонт в Москве | contact-cta | 2.1 KB | 45 | no | src/pages/duhovka-ne-greet/sections/002-contact-cta-duhovka-ne-greet-remont-v-moskve.html |
| Что проверить безопасно | proof | 2.0 KB | 42 | no | src/components/parametric/cooking-appliance-cook2/safe-diagnostics.template.html |
| Связанные страницы кластера | section | 1.8 KB | 23 | no | src/pages/duhovka-ne-greet/sections/007-section-svyazannye-stranicy-klastera.html |
| Какие работы могут потребоваться | pricing | 1.3 KB | 35 | no | src/pages/duhovka-ne-greet/sections/006-pricing-kakie-raboty-mogut-potrebovat-sya.html |
| Частые вопросы | faq | 1.3 KB | 48 | no | src/pages/duhovka-ne-greet/sections/009-faq-chastye-voprosy.html |


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
- duhovka-ne-greet.html
- src/site-builder.json
- src/pages/duhovka-ne-greet/page.json
- src/pages/duhovka-ne-greet/sections/

## Checks

- npm run doctor:household-page -- --page duhovka-ne-greet.html
- npm run doctor:page -- --page duhovka-ne-greet.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page duhovka-ne-greet.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
