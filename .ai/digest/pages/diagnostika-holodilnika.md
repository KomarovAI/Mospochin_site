# Page Digest — diagnostika-holodilnika.html

- Branch: household
- Role: service
- Title: Диагностика холодильника в Москве | MosPochin
- Description: Диагностика холодильника на дому: температуры камер, оттайка, вентиляторы, датчики, компрессор и холодильный контур.
- H1: Диагностика бытового холодильника
- Canonical: https://mospochin.ru/diagnostika-holodilnika.html
- Builder model: src/pages/diagnostika-holodilnika/page.json
- Sections: 12 (10 local, 1 shared refs, 0 raw)
- Text words inside referenced sections: 554

## Component mix

| Component | Count |
| --- | --- |
| section | 3 |
| contact-cta | 2 |
| mobile-contact | 2 |
| breadcrumb | 1 |
| faq | 1 |
| lead-form | 1 |
| pricing | 1 |
| proof | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Мобильные контактные элементы | mobile-contact | 7.2 KB | 78 | no | src/pages/diagnostika-holodilnika/sections/001-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Мобильные контактные элементы | mobile-contact | 4.3 KB | 61 | no | src/pages/diagnostika-holodilnika/sections/010-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Что отправить до выезда | lead-form | 4.1 KB | 60 | no | src/pages/diagnostika-holodilnika/sections/008-lead-form-chto-otpravit-do-vyezda.html |
| Диагностика бытового холодильника | contact-cta | 2.3 KB | 51 | no | src/pages/diagnostika-holodilnika/sections/002-contact-cta-diagnostika-bytovogo-holodil-nika.html |
| Что проверяет мастер | proof | 2.2 KB | 50 | no | src/pages/diagnostika-holodilnika/sections/005-proof-chto-proveryaet-master.html |
| Частые вопросы | faq | 2.1 KB | 78 | no | src/pages/diagnostika-holodilnika/sections/009-faq-chastye-voprosy.html |
| Связанные страницы кластера | section | 2.1 KB | 42 | no | src/pages/diagnostika-holodilnika/sections/007-section-svyazannye-stranicy-klastera.html |
| Что можно проверить безопасно | pricing | 1.9 KB | 52 | no | src/pages/diagnostika-holodilnika/sections/004-pricing-chto-mozhno-proverit-bezopasno.html |


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
- diagnostika-holodilnika.html
- src/site-builder.json
- src/pages/diagnostika-holodilnika/page.json
- src/pages/diagnostika-holodilnika/sections/

## Checks

- npm run doctor:household-page -- --page diagnostika-holodilnika.html
- npm run doctor:page -- --page diagnostika-holodilnika.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page diagnostika-holodilnika.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
