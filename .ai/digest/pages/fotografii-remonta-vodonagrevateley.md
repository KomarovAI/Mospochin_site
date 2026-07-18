# Page Digest — fotografii-remonta-vodonagrevateley.html

- Branch: household
- Role: service
- Title: Фотографии ремонта водонагревателей — узлы и процессы
- Description: Технический фотоархив ремонта бойлеров: нагревательные элементы, фланцы, электроника, обвязка, очистка и сложные системы ГВС.
- H1: Фотографии ремонта водонагревателей
- Canonical: https://mospochin.ru/fotografii-remonta-vodonagrevateley.html
- Builder model: src/pages/fotografii-remonta-vodonagrevateley/page.json
- Sections: 8 (0 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 419

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 2 |
| section | 2 |
| breadcrumb | 1 |
| faq | 1 |
| lead-form | 1 |
| related-links | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Мобильные контактные элементы | mobile-contact | 8.3 KB | 96 | no | src/components/parametric/water-heater-wh4/mobile-contact.template.html |
| Дополнительные детали процесса | related-links | 6.2 KB | 46 | no | src/components/parametric/water-heater-wh4/related-links.template.html |
| Мобильные контактные элементы | mobile-contact | 4.3 KB | 61 | no | src/components/parametric/water-heater-wh4/mobile-contact.template.html |
| Страницы и фотокейсы | section | 4.1 KB | 91 | no | src/components/parametric/water-heater-wh4/section.template.html |
| Фотографии ремонта водонагревателей | section | 2.4 KB | 40 | no | src/components/parametric/water-heater-wh4/section.template.html |
| Частые вопросы | faq | 1.6 KB | 61 | no | src/components/parametric/water-heater-wh4/faq.template.html |
| Пришлите фотографии своего водонагревателя | lead-form | 1.2 KB | 18 | no | src/components/parametric/water-heater-wh4/lead-form.template.html |
| Хлебные крошки бытовой ветки | breadcrumb | 1.0 KB | 6 | no | src/components/parametric/household-breadcrumb/two-parent.template.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/household-branch.json
- data/household-page-policy.json
- data/household-page-slots.json
- fotografii-remonta-vodonagrevateley.html
- src/site-builder.json
- src/pages/fotografii-remonta-vodonagrevateley/page.json
- src/pages/fotografii-remonta-vodonagrevateley/sections/

## Checks

- npm run doctor:page -- --page fotografii-remonta-vodonagrevateley.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page fotografii-remonta-vodonagrevateley.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
