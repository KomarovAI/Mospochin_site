# Page Digest — diagnostika-posudomoechnoy-mashiny.html

- Branch: household
- Role: service
- Title: Диагностика посудомоечной машины в Москве | MosPochin
- Description: Диагностика бытовой посудомойки: вода, слив, циркуляция, нагрев, сушка, дверь, датчики и плата управления.
- H1: Диагностика бытовой посудомоечной машины
- Canonical: https://mospochin.ru/diagnostika-posudomoechnoy-mashiny.html
- Builder model: src/pages/diagnostika-posudomoechnoy-mashiny/page.json
- Sections: 12 (11 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 542

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
| Мобильные контактные элементы | mobile-contact | 9.3 KB | 110 | no | src/pages/diagnostika-posudomoechnoy-mashiny/sections/001-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Мобильные контактные элементы | mobile-contact | 4.9 KB | 77 | no | src/pages/diagnostika-posudomoechnoy-mashiny/sections/010-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Что отправить до выезда | lead-form | 4.1 KB | 58 | no | src/pages/diagnostika-posudomoechnoy-mashiny/sections/008-lead-form-chto-otpravit-do-vyezda.html |
| Частые вопросы | faq | 2.1 KB | 87 | no | src/pages/diagnostika-posudomoechnoy-mashiny/sections/009-faq-chastye-voprosy.html |
| Что проверить безопасно | proof | 2.0 KB | 50 | no | src/pages/diagnostika-posudomoechnoy-mashiny/sections/004-proof-chto-proverit-bezopasno.html |
| Диагностика бытовой посудомоечной машины | contact-cta | 2.0 KB | 35 | no | src/pages/diagnostika-posudomoechnoy-mashiny/sections/002-contact-cta-diagnostika-bytovoy-posudomoechnoy-mashi.html |
| Связанные страницы бытового кластера | section | 1.5 KB | 27 | no | src/pages/diagnostika-posudomoechnoy-mashiny/sections/007-section-svyazannye-stranicy-bytovogo-klastera.html |
| Какие работы могут потребоваться | pricing | 1.4 KB | 40 | no | src/pages/diagnostika-posudomoechnoy-mashiny/sections/006-pricing-kakie-raboty-mogut-potrebovat-sya.html |


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
- diagnostika-posudomoechnoy-mashiny.html
- src/site-builder.json
- src/pages/diagnostika-posudomoechnoy-mashiny/page.json
- src/pages/diagnostika-posudomoechnoy-mashiny/sections/

## Checks

- npm run doctor:household-page -- --page diagnostika-posudomoechnoy-mashiny.html
- npm run doctor:page -- --page diagnostika-posudomoechnoy-mashiny.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page diagnostika-posudomoechnoy-mashiny.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
