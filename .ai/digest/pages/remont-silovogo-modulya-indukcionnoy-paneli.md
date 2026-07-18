# Page Digest — remont-silovogo-modulya-indukcionnoy-paneli.html

- Branch: household
- Role: service
- Title: Ремонт силового модуля индукционной панели | MosPochin
- Description: Ремонт силового модуля индукционной панели после проверки питания, катушек, датчиков, охлаждения и межблочной связи.
- H1: Ремонт силового модуля индукционной панели
- Canonical: https://mospochin.ru/remont-silovogo-modulya-indukcionnoy-paneli.html
- Builder model: src/pages/remont-silovogo-modulya-indukcionnoy-paneli/page.json
- Sections: 12 (5 local, 1 shared refs, 0 raw)
- Text words inside referenced sections: 483

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
| Мобильные контактные элементы | mobile-contact | 5.0 KB | 77 | no | src/components/parametric/cooking-appliance-cook2/footer-3aff2ca0a962.template.html |
| Что отправить до выезда | lead-form | 4.0 KB | 57 | no | src/pages/remont-silovogo-modulya-indukcionnoy-paneli/sections/008-lead-form-chto-otpravit-do-vyezda.html |
| Ремонт силового модуля индукционной панели | contact-cta | 2.2 KB | 42 | no | src/pages/remont-silovogo-modulya-indukcionnoy-paneli/sections/002-contact-cta-remont-silovogo-modulya-indukcionnoy-pan.html |
| Что проверить безопасно | proof | 2.0 KB | 44 | no | src/components/parametric/cooking-appliance-cook2/safe-diagnostics.template.html |
| Связанные страницы кластера | section | 1.9 KB | 26 | yes | src/components/shared/section/section-svyazannye-stranicy-klastera--795640a56d300ca6.html |
| Какие работы могут потребоваться | pricing | 1.4 KB | 33 | no | src/pages/remont-silovogo-modulya-indukcionnoy-paneli/sections/006-pricing-kakie-raboty-mogut-potrebovat-sya.html |
| Частые вопросы | faq | 1.3 KB | 46 | no | src/pages/remont-silovogo-modulya-indukcionnoy-paneli/sections/009-faq-chastye-voprosy.html |


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
- remont-silovogo-modulya-indukcionnoy-paneli.html
- src/site-builder.json
- src/pages/remont-silovogo-modulya-indukcionnoy-paneli/page.json
- src/pages/remont-silovogo-modulya-indukcionnoy-paneli/sections/

## Checks

- npm run doctor:household-page -- --page remont-silovogo-modulya-indukcionnoy-paneli.html
- npm run doctor:page -- --page remont-silovogo-modulya-indukcionnoy-paneli.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page remont-silovogo-modulya-indukcionnoy-paneli.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
