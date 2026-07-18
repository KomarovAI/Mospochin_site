# Page Digest — case-remont-boylera-v-tesnoy-nishe.html

- Branch: household
- Role: service
- Title: Фотокейс: ремонт бойлера в тесной нише
- Description: Примеры сервисного доступа к водонагревателям в шкафах, кладовых, душевых и компактных инженерных нишах.
- H1: Ремонт бойлера в тесной нише — фотокейс
- Canonical: https://mospochin.ru/case-remont-boylera-v-tesnoy-nishe.html
- Builder model: src/pages/case-remont-boylera-v-tesnoy-nishe/page.json
- Sections: 10 (0 local, 3 shared refs, 0 raw)
- Text words inside referenced sections: 439

## Component mix

| Component | Count |
| --- | --- |
| section | 5 |
| mobile-contact | 2 |
| breadcrumb | 1 |
| faq | 1 |
| lead-form | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Последовательность и детали | section | 13.3 KB | 89 | no | src/components/parametric/water-heater-wh4/section.template.html |
| Мобильные контактные элементы | mobile-contact | 8.3 KB | 96 | no | src/components/parametric/water-heater-wh4/mobile-contact.template.html |
| Мобильные контактные элементы | mobile-contact | 4.3 KB | 61 | no | src/components/parametric/water-heater-wh4/mobile-contact.template.html |
| Ремонт бойлера в тесной нише — фотокейс | section | 2.3 KB | 36 | no | src/components/parametric/water-heater-wh4/section.template.html |
| Частые вопросы | faq | 1.6 KB | 61 | yes | src/components/shared/faq/faq-chastye-voprosy--a7084e5e5cf57dc1.html |
| Связанные услуги | section | 1.5 KB | 22 | no | src/components/parametric/water-heater-wh4/section.template.html |
| Покажите свой узел | lead-form | 1.1 KB | 20 | yes | src/components/shared/lead-form/lead-form-pokazhite-svoy-uzel--026fa95bea2e36cd.html |
| Хлебные крошки бытовой ветки | breadcrumb | 1.0 KB | 10 | no | src/components/parametric/household-breadcrumb/two-parent.template.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/household-branch.json
- data/household-page-policy.json
- data/household-page-slots.json
- case-remont-boylera-v-tesnoy-nishe.html
- src/site-builder.json
- src/pages/case-remont-boylera-v-tesnoy-nishe/page.json
- src/pages/case-remont-boylera-v-tesnoy-nishe/sections/

## Checks

- npm run doctor:page -- --page case-remont-boylera-v-tesnoy-nishe.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page case-remont-boylera-v-tesnoy-nishe.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
