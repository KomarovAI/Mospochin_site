# Page Digest — ustanovka-slivnogo-krana-vodonagrevatelya.html

- Branch: household
- Role: service
- Title: Установка сливного крана для водонагревателя в Москве
- Description: Монтаж сервисного сливного узла для обслуживания и демонтажа накопительного водонагревателя без нарушения работы предохранительного клапана.
- H1: Установка сливного крана водонагревателя
- Canonical: https://mospochin.ru/ustanovka-slivnogo-krana-vodonagrevatelya.html
- Builder model: src/pages/ustanovka-slivnogo-krana-vodonagrevatelya/page.json
- Sections: 18 (10 local, 1 shared refs, 4 raw)
- Text words inside referenced sections: 603

## Component mix

| Component | Count |
| --- | --- |
| section | 7 |
| raw | 4 |
| mobile-contact | 3 |
| breadcrumb | 1 |
| faq | 1 |
| lead-form | 1 |
| proof | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Мобильные контактные элементы | mobile-contact | 9.2 KB | 110 | no | src/pages/ustanovka-slivnogo-krana-vodonagrevatelya/sections/001-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Дополнительные фотографии узла | section | 6.4 KB | 47 | no | src/components/parametric/water-heater-wh4/section.template.html |
| Мобильные контактные элементы | mobile-contact | 4.9 KB | 77 | no | src/pages/ustanovka-slivnogo-krana-vodonagrevatelya/sections/017-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Что проверить безопасно | proof | 2.2 KB | 68 | no | src/pages/ustanovka-slivnogo-krana-vodonagrevatelya/sections/008-proof-chto-proverit-bezopasno.html |
| Что видно на сервисном фото | section | 2.2 KB | 38 | no | src/components/parametric/water-heater-wh4/section.template.html |
| Что отправить до выезда | lead-form | 1.8 KB | 31 | yes | src/components/shared/lead-form/lead-form-chto-otpravit-do-vyezda--dd9c1b923c2d6304.html |
| Установка сливного крана водонагревателя | mobile-contact | 1.7 KB | 39 | no | src/pages/ustanovka-slivnogo-krana-vodonagrevatelya/sections/002-mobile-contact-ustanovka-slivnogo-krana-vodonagrevat.html |
| Связанные страницы водонагревателей | section | 1.7 KB | 27 | no | src/pages/ustanovka-slivnogo-krana-vodonagrevatelya/sections/011-section-svyazannye-stranicy-vodonagrevateley.html |


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
- ustanovka-slivnogo-krana-vodonagrevatelya.html
- src/site-builder.json
- src/pages/ustanovka-slivnogo-krana-vodonagrevatelya/page.json
- src/pages/ustanovka-slivnogo-krana-vodonagrevatelya/sections/

## Checks

- npm run doctor:household-page -- --page ustanovka-slivnogo-krana-vodonagrevatelya.html
- npm run doctor:page -- --page ustanovka-slivnogo-krana-vodonagrevatelya.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page ustanovka-slivnogo-krana-vodonagrevatelya.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
