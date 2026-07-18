# Page Digest — holodilniki.html

- Branch: household
- Role: service
- Title: Ремонт холодильников в Москве на дому — MosPochin
- Description: Диагностика и ремонт бытовых холодильников: не морозит, течёт, шумит, намерзает лёд, не работает No Frost. Выезд по Москве.
- H1: Ремонт бытовых холодильников в Москве
- Canonical: https://mospochin.ru/holodilniki.html
- Builder model: src/pages/holodilniki/page.json
- Sections: 12 (10 local, 1 shared refs, 0 raw)
- Text words inside referenced sections: 597

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
| Мобильные контактные элементы | mobile-contact | 7.2 KB | 78 | no | src/pages/holodilniki/sections/001-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Мобильные контактные элементы | mobile-contact | 4.3 KB | 61 | no | src/pages/holodilniki/sections/010-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Что отправить до выезда | lead-form | 4.1 KB | 60 | no | src/pages/holodilniki/sections/008-lead-form-chto-otpravit-do-vyezda.html |
| Связанные страницы кластера | section | 3.3 KB | 67 | no | src/pages/holodilniki/sections/007-section-svyazannye-stranicy-klastera.html |
| Что проверяет мастер | proof | 2.4 KB | 56 | no | src/pages/holodilniki/sections/005-proof-chto-proveryaet-master.html |
| Ремонт бытовых холодильников в Москве | contact-cta | 2.3 KB | 52 | no | src/pages/holodilniki/sections/002-contact-cta-remont-bytovyh-holodil-nikov-v-moskve.html |
| Частые вопросы | faq | 2.1 KB | 85 | no | src/pages/holodilniki/sections/009-faq-chastye-voprosy.html |
| Что можно проверить безопасно | pricing | 2.1 KB | 62 | no | src/pages/holodilniki/sections/004-pricing-chto-mozhno-proverit-bezopasno.html |


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
- holodilniki.html
- src/site-builder.json
- src/pages/holodilniki/page.json
- src/pages/holodilniki/sections/

## Checks

- npm run doctor:household-page -- --page holodilniki.html
- npm run doctor:page -- --page holodilniki.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page holodilniki.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
