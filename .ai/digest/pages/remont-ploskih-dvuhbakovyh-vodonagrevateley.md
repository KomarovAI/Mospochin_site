# Page Digest — remont-ploskih-dvuhbakovyh-vodonagrevateley.html

- Branch: household
- Role: service
- Title: Ремонт плоских двухбаковых водонагревателей в Москве
- Description: Диагностика и ремонт плоских накопительных водонагревателей с двумя внутренними ёмкостями, двумя фланцами и раздельными нагревательными узлами.
- H1: Ремонт плоских двухбаковых водонагревателей
- Canonical: https://mospochin.ru/remont-ploskih-dvuhbakovyh-vodonagrevateley.html
- Builder model: src/pages/remont-ploskih-dvuhbakovyh-vodonagrevateley/page.json
- Sections: 12 (0 local, 2 shared refs, 0 raw)
- Text words inside referenced sections: 425

## Component mix

| Component | Count |
| --- | --- |
| section | 5 |
| mobile-contact | 2 |
| breadcrumb | 1 |
| contact-cta | 1 |
| faq | 1 |
| lead-form | 1 |
| proof | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Мобильные контактные элементы | mobile-contact | 8.4 KB | 96 | no | src/components/parametric/water-heater-wh4/mobile-contact.template.html |
| Мобильные контактные элементы | mobile-contact | 4.3 KB | 61 | no | src/components/parametric/water-heater-wh4/mobile-contact.template.html |
| Фото узла и этапов работы | section | 3.5 KB | 32 | no | src/components/parametric/water-heater-wh4/section.template.html |
| Ремонт плоских двухбаковых водонагревателей | contact-cta | 3.1 KB | 48 | no | src/components/parametric/water-heater-wh4/contact-cta.template.html |
| Что сделать безопасно | proof | 1.7 KB | 35 | no | src/components/parametric/water-heater-wh4/proof.template.html |
| Что отправить до выезда | lead-form | 1.6 KB | 23 | yes | src/components/shared/lead-form/lead-form-chto-otpravit-do-vyezda--f5a4f439e3ae8667.html |
| Частые вопросы | faq | 1.4 KB | 52 | no | src/components/parametric/water-heater-wh4/faq.template.html |
| Связанные страницы | section | 1.2 KB | 15 | yes | src/components/shared/section/section-svyazannye-stranicy--e7f315bdd817bc14.html |


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
- remont-ploskih-dvuhbakovyh-vodonagrevateley.html
- src/site-builder.json
- src/pages/remont-ploskih-dvuhbakovyh-vodonagrevateley/page.json
- src/pages/remont-ploskih-dvuhbakovyh-vodonagrevateley/sections/

## Checks

- npm run doctor:household-page -- --page remont-ploskih-dvuhbakovyh-vodonagrevateley.html
- npm run doctor:page -- --page remont-ploskih-dvuhbakovyh-vodonagrevateley.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page remont-ploskih-dvuhbakovyh-vodonagrevateley.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
