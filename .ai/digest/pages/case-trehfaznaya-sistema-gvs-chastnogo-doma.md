# Page Digest — case-trehfaznaya-sistema-gvs-chastnogo-doma.html

- Branch: household
- Role: service
- Title: Фотокейс: сложная трёхфазная система ГВС частного дома
- Description: Фотографии силовой автоматики, насосных групп, измерительных приборов, коллекторов и крупной обвязки системы горячего водоснабжения.
- H1: Сложная трёхфазная система ГВС частного дома — фотокейс
- Canonical: https://mospochin.ru/case-trehfaznaya-sistema-gvs-chastnogo-doma.html
- Builder model: src/pages/case-trehfaznaya-sistema-gvs-chastnogo-doma/page.json
- Sections: 10 (0 local, 3 shared refs, 0 raw)
- Text words inside referenced sections: 523

## Component mix

| Component | Count |
| --- | --- |
| section | 3 |
| mobile-contact | 2 |
| pricing | 2 |
| breadcrumb | 1 |
| faq | 1 |
| lead-form | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Последовательность и детали | pricing | 22.1 KB | 166 | no | src/components/parametric/water-heater-wh4/pricing.template.html |
| Мобильные контактные элементы | mobile-contact | 8.4 KB | 96 | no | src/components/parametric/water-heater-wh4/mobile-contact.template.html |
| Мобильные контактные элементы | mobile-contact | 4.3 KB | 61 | no | src/components/parametric/water-heater-wh4/mobile-contact.template.html |
| Сложная трёхфазная система ГВС частного дома — фотокейс | pricing | 2.5 KB | 45 | no | src/components/parametric/water-heater-wh4/pricing.template.html |
| Частые вопросы | faq | 1.6 KB | 61 | yes | src/components/shared/faq/faq-chastye-voprosy--a7084e5e5cf57dc1.html |
| Связанные услуги | section | 1.5 KB | 22 | no | src/components/parametric/water-heater-wh4/section.template.html |
| Покажите свой узел | lead-form | 1.1 KB | 20 | yes | src/components/shared/lead-form/lead-form-pokazhite-svoy-uzel--026fa95bea2e36cd.html |
| Хлебные крошки бытовой ветки | breadcrumb | 1.1 KB | 11 | no | src/components/parametric/household-breadcrumb/two-parent.template.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/household-branch.json
- data/household-page-policy.json
- data/household-page-slots.json
- case-trehfaznaya-sistema-gvs-chastnogo-doma.html
- src/site-builder.json
- src/pages/case-trehfaznaya-sistema-gvs-chastnogo-doma/page.json
- src/pages/case-trehfaznaya-sistema-gvs-chastnogo-doma/sections/

## Checks

- npm run doctor:page -- --page case-trehfaznaya-sistema-gvs-chastnogo-doma.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page case-trehfaznaya-sistema-gvs-chastnogo-doma.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
