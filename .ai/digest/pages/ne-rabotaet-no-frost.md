# Page Digest — ne-rabotaet-no-frost.html

- Branch: household
- Role: service
- Title: Не работает No Frost — ремонт холодильника в Москве | MosPochin
- Description: No Frost обмерзает, холодильная камера теплеет или вентилятор задевает лёд: диагностика оттайки, датчиков и управления.
- H1: Не работает система No Frost
- Canonical: https://mospochin.ru/ne-rabotaet-no-frost.html
- Builder model: src/pages/ne-rabotaet-no-frost/page.json
- Sections: 12 (10 local, 1 shared refs, 0 raw)
- Text words inside referenced sections: 535

## Component mix

| Component | Count |
| --- | --- |
| section | 4 |
| contact-cta | 2 |
| mobile-contact | 2 |
| breadcrumb | 1 |
| faq | 1 |
| lead-form | 1 |
| proof | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Мобильные контактные элементы | mobile-contact | 7.2 KB | 78 | no | src/pages/ne-rabotaet-no-frost/sections/001-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Мобильные контактные элементы | mobile-contact | 4.3 KB | 61 | no | src/pages/ne-rabotaet-no-frost/sections/010-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Что отправить до выезда | lead-form | 4.1 KB | 60 | no | src/pages/ne-rabotaet-no-frost/sections/008-lead-form-chto-otpravit-do-vyezda.html |
| Не работает система No Frost | contact-cta | 2.2 KB | 54 | no | src/pages/ne-rabotaet-no-frost/sections/002-contact-cta-ne-rabotaet-sistema-no-frost.html |
| Связанные страницы кластера | section | 2.1 KB | 40 | no | src/pages/ne-rabotaet-no-frost/sections/007-section-svyazannye-stranicy-klastera.html |
| Частые вопросы | faq | 2.1 KB | 77 | no | src/pages/ne-rabotaet-no-frost/sections/009-faq-chastye-voprosy.html |
| Что проверяет мастер | proof | 1.9 KB | 39 | no | src/pages/ne-rabotaet-no-frost/sections/005-proof-chto-proveryaet-master.html |
| Что можно проверить безопасно | section | 1.9 KB | 47 | no | src/pages/ne-rabotaet-no-frost/sections/004-section-chto-mozhno-proverit-bezopasno.html |


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
- ne-rabotaet-no-frost.html
- src/site-builder.json
- src/pages/ne-rabotaet-no-frost/page.json
- src/pages/ne-rabotaet-no-frost/sections/

## Checks

- npm run doctor:household-page -- --page ne-rabotaet-no-frost.html
- npm run doctor:page -- --page ne-rabotaet-no-frost.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page ne-rabotaet-no-frost.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
