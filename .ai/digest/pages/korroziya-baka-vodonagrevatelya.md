# Page Digest — korroziya-baka-vodonagrevatelya.html

- Branch: household
- Role: service
- Title: Коррозия бака водонагревателя — ремонт или замена
- Description: Оценка коррозии фланца, посадочного места и внутреннего бака водонагревателя. Когда возможен ремонт узла, а когда безопаснее заменить прибор.
- H1: Коррозия бака водонагревателя: ремонт или замена
- Canonical: https://mospochin.ru/korroziya-baka-vodonagrevatelya.html
- Builder model: src/pages/korroziya-baka-vodonagrevatelya/page.json
- Sections: 12 (0 local, 2 shared refs, 0 raw)
- Text words inside referenced sections: 615

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
| Мобильные контактные элементы | mobile-contact | 8.3 KB | 96 | no | src/components/parametric/water-heater-wh4/mobile-contact.template.html |
| Фото узла и этапов работы | section | 6.2 KB | 50 | no | src/components/parametric/water-heater-wh4/section.template.html |
| Мобильные контактные элементы | mobile-contact | 4.3 KB | 61 | no | src/components/parametric/water-heater-wh4/mobile-contact.template.html |
| Коррозия бака водонагревателя: ремонт или замена | contact-cta | 3.0 KB | 54 | no | src/components/parametric/water-heater-wh4/contact-cta.template.html |
| Когда нужен этот сценарий | section | 1.9 KB | 82 | no | src/components/parametric/water-heater-wh4/section.template.html |
| Секция страницы | section | 1.9 KB | 78 | no | src/components/parametric/water-heater-wh4/section.template.html |
| Что сделать безопасно | proof | 1.7 KB | 33 | no | src/components/parametric/water-heater-wh4/proof.template.html |
| Какие работы могут потребоваться | section | 1.6 KB | 56 | no | src/components/parametric/water-heater-wh4/section.template.html |


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
- korroziya-baka-vodonagrevatelya.html
- src/site-builder.json
- src/pages/korroziya-baka-vodonagrevatelya/page.json
- src/pages/korroziya-baka-vodonagrevatelya/sections/

## Checks

- npm run doctor:household-page -- --page korroziya-baka-vodonagrevatelya.html
- npm run doctor:page -- --page korroziya-baka-vodonagrevatelya.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page korroziya-baka-vodonagrevatelya.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
