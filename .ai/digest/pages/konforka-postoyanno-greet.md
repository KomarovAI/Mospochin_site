# Page Digest — konforka-postoyanno-greet.html

- Branch: household
- Role: service
- Title: Конфорка постоянно греет и не регулируется | MosPochin
- Description: Конфорка остаётся на высокой мощности: проверяем регулятор, реле, сенсор, датчик и силовую плату.
- H1: Конфорка постоянно греет и не регулируется
- Canonical: https://mospochin.ru/konforka-postoyanno-greet.html
- Builder model: src/pages/konforka-postoyanno-greet/page.json
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
| Что отправить до выезда | lead-form | 4.0 KB | 57 | no | src/pages/konforka-postoyanno-greet/sections/008-lead-form-chto-otpravit-do-vyezda.html |
| Конфорка постоянно греет и не регулируется | contact-cta | 2.2 KB | 40 | no | src/pages/konforka-postoyanno-greet/sections/002-contact-cta-konforka-postoyanno-greet-i-ne-regulirue.html |
| Связанные страницы кластера | section | 1.9 KB | 25 | no | src/pages/konforka-postoyanno-greet/sections/007-section-svyazannye-stranicy-klastera.html |
| Что проверить безопасно | proof | 1.9 KB | 38 | no | src/components/parametric/cooking-appliance-cook2/safe-diagnostics.template.html |
| Частые вопросы | faq | 1.4 KB | 51 | no | src/pages/konforka-postoyanno-greet/sections/009-faq-chastye-voprosy.html |
| Какие работы могут потребоваться | pricing | 1.3 KB | 31 | no | src/pages/konforka-postoyanno-greet/sections/006-pricing-kakie-raboty-mogut-potrebovat-sya.html |


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
- konforka-postoyanno-greet.html
- src/site-builder.json
- src/pages/konforka-postoyanno-greet/page.json
- src/pages/konforka-postoyanno-greet/sections/

## Checks

- npm run doctor:household-page -- --page konforka-postoyanno-greet.html
- npm run doctor:page -- --page konforka-postoyanno-greet.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page konforka-postoyanno-greet.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
