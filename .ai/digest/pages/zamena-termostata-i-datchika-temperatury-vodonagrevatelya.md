# Page Digest — zamena-termostata-i-datchika-temperatury-vodonagrevatelya.html

- Branch: household
- Role: service
- Title: Замена термостата и датчика температуры водонагревателя
- Description: Диагностика термостата, температурного датчика и термозащиты при отсутствии нагрева, перегреве или неверной индикации.
- H1: Замена термостата и датчика температуры водонагревателя
- Canonical: https://mospochin.ru/zamena-termostata-i-datchika-temperatury-vodonagrevatelya.html
- Builder model: src/pages/zamena-termostata-i-datchika-temperatury-vodonagrevatelya/page.json
- Sections: 12 (0 local, 2 shared refs, 0 raw)
- Text words inside referenced sections: 433

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
| Мобильные контактные элементы | mobile-contact | 4.4 KB | 61 | no | src/components/parametric/water-heater-wh4/mobile-contact.template.html |
| Фото узла и этапов работы | section | 3.7 KB | 31 | no | src/components/parametric/water-heater-wh4/section.template.html |
| Замена термостата и датчика температуры водонагревателя | contact-cta | 3.2 KB | 50 | no | src/components/parametric/water-heater-wh4/contact-cta.template.html |
| Связанные страницы | section | 1.8 KB | 25 | yes | src/components/shared/section/section-svyazannye-stranicy--7a83390e067c8796.html |
| Что сделать безопасно | proof | 1.7 KB | 34 | no | src/components/parametric/water-heater-wh4/proof.template.html |
| Что отправить до выезда | lead-form | 1.6 KB | 23 | yes | src/components/shared/lead-form/lead-form-chto-otpravit-do-vyezda--f5a4f439e3ae8667.html |
| Частые вопросы | faq | 1.5 KB | 55 | no | src/components/parametric/water-heater-wh4/faq.template.html |


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
- zamena-termostata-i-datchika-temperatury-vodonagrevatelya.html
- src/site-builder.json
- src/pages/zamena-termostata-i-datchika-temperatury-vodonagrevatelya/page.json
- src/pages/zamena-termostata-i-datchika-temperatury-vodonagrevatelya/sections/

## Checks

- npm run doctor:household-page -- --page zamena-termostata-i-datchika-temperatury-vodonagrevatelya.html
- npm run doctor:page -- --page zamena-termostata-i-datchika-temperatury-vodonagrevatelya.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page zamena-termostata-i-datchika-temperatury-vodonagrevatelya.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
