# Page Digest — remont-dozatora-posudomoechnoy-mashiny.html

- Branch: household
- Role: service
- Title: Ремонт дозатора посудомоечной машины | MosPochin
- Description: Ремонт дозатора моющего средства и ополаскивателя: крышка, пружина, привод, уплотнение, проводка и управление.
- H1: Ремонт дозатора посудомоечной машины
- Canonical: https://mospochin.ru/remont-dozatora-posudomoechnoy-mashiny.html
- Builder model: src/pages/remont-dozatora-posudomoechnoy-mashiny/page.json
- Sections: 11 (6 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 434

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 3 |
| section | 3 |
| breadcrumb | 1 |
| faq | 1 |
| lead-form | 1 |
| pricing | 1 |
| proof | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Мобильные контактные элементы | mobile-contact | 9.3 KB | 110 | no | src/components/parametric/household-dishwasher-dw2/header-ff5231eb4124.template.html |
| Мобильные контактные элементы | mobile-contact | 4.9 KB | 77 | no | src/components/parametric/household-dishwasher-dw2/footer-3aff2ca0a962.template.html |
| Ремонт дозатора посудомоечной машины | mobile-contact | 1.7 KB | 36 | no | src/pages/remont-dozatora-posudomoechnoy-mashiny/sections/002-mobile-contact-remont-dozatora-posudomoechnoy-mashin.html |
| Что проверить безопасно | proof | 1.7 KB | 36 | no | src/components/parametric/household-dishwasher-dw2/safe-diagnostics.template.html |
| Частые вопросы | faq | 1.7 KB | 54 | no | src/pages/remont-dozatora-posudomoechnoy-mashiny/sections/009-faq-chastye-voprosy.html |
| Что отправить до выезда | lead-form | 1.7 KB | 27 | no | src/pages/remont-dozatora-posudomoechnoy-mashiny/sections/008-lead-form-chto-otpravit-do-vyezda.html |
| Связанные страницы | section | 1.6 KB | 23 | no | src/pages/remont-dozatora-posudomoechnoy-mashiny/sections/007-section-svyazannye-stranicy.html |
| Какие работы могут потребоваться | pricing | 1.1 KB | 30 | no | src/pages/remont-dozatora-posudomoechnoy-mashiny/sections/006-pricing-kakie-raboty-mogut-potrebovat-sya.html |


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
- remont-dozatora-posudomoechnoy-mashiny.html
- src/site-builder.json
- src/pages/remont-dozatora-posudomoechnoy-mashiny/page.json
- src/pages/remont-dozatora-posudomoechnoy-mashiny/sections/

## Checks

- npm run doctor:household-page -- --page remont-dozatora-posudomoechnoy-mashiny.html
- npm run doctor:page -- --page remont-dozatora-posudomoechnoy-mashiny.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page remont-dozatora-posudomoechnoy-mashiny.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
