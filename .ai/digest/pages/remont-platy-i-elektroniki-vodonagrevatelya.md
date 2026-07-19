# Page Digest — remont-platy-i-elektroniki-vodonagrevatelya.html

- Branch: household
- Role: service
- Title: Ремонт платы и электроники водонагревателя в Москве
- Description: Диагностика платы управления, реле, клемм, шлейфов, датчиков и силовых контактов электронного водонагревателя.
- H1: Ремонт платы и электроники водонагревателя
- Canonical: https://mospochin.ru/remont-platy-i-elektroniki-vodonagrevatelya.html
- Builder model: src/pages/remont-platy-i-elektroniki-vodonagrevatelya/page.json
- Sections: 12 (0 local, 2 shared refs, 0 raw)
- Text words inside referenced sections: 625

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
| Фото узла и этапов работы | section | 9.5 KB | 63 | no | src/components/parametric/water-heater-wh4/section.template.html |
| Мобильные контактные элементы | mobile-contact | 8.4 KB | 96 | no | src/components/parametric/water-heater-wh4/mobile-contact.template.html |
| Мобильные контактные элементы | mobile-contact | 4.3 KB | 61 | no | src/components/parametric/water-heater-wh4/mobile-contact.template.html |
| Ремонт платы и электроники водонагревателя | contact-cta | 3.1 KB | 50 | no | src/components/parametric/water-heater-wh4/contact-cta.template.html |
| Когда нужен этот сценарий | section | 2.0 KB | 79 | no | src/components/parametric/water-heater-wh4/section.template.html |
| Связанные страницы | section | 1.8 KB | 25 | yes | src/components/shared/section/section-svyazannye-stranicy--7a83390e067c8796.html |
| Секция страницы | section | 1.8 KB | 65 | no | src/components/parametric/water-heater-wh4/section.template.html |
| Какие работы могут потребоваться | section | 1.7 KB | 70 | no | src/components/parametric/water-heater-wh4/section.template.html |


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
- remont-platy-i-elektroniki-vodonagrevatelya.html
- src/site-builder.json
- src/pages/remont-platy-i-elektroniki-vodonagrevatelya/page.json
- src/pages/remont-platy-i-elektroniki-vodonagrevatelya/sections/

## Checks

- npm run doctor:household-page -- --page remont-platy-i-elektroniki-vodonagrevatelya.html
- npm run doctor:page -- --page remont-platy-i-elektroniki-vodonagrevatelya.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page remont-platy-i-elektroniki-vodonagrevatelya.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
