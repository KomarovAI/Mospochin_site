# Page Digest — podklyuchenie-i-obvyazka-vodonagrevatelya.html

- Branch: household
- Role: service
- Title: Подключение и обвязка водонагревателя в Москве — MosPochin
- Description: Локальное подключение электрического водонагревателя: запорная арматура, предохранительный клапан, слив, фильтр, редуктор и PP-R. Без полной разводки квартиры.
- H1: Подключение и обвязка водонагревателя
- Canonical: https://mospochin.ru/podklyuchenie-i-obvyazka-vodonagrevatelya.html
- Builder model: src/pages/podklyuchenie-i-obvyazka-vodonagrevatelya/page.json
- Sections: 21 (12 local, 1 shared refs, 5 raw)
- Text words inside referenced sections: 660

## Component mix

| Component | Count |
| --- | --- |
| section | 7 |
| raw | 5 |
| mobile-contact | 3 |
| pricing | 2 |
| breadcrumb | 1 |
| faq | 1 |
| layout-fragment | 1 |
| lead-form | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Мобильные контактные элементы | mobile-contact | 9.3 KB | 110 | no | src/pages/podklyuchenie-i-obvyazka-vodonagrevatelya/sections/001-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Мобильные контактные элементы | mobile-contact | 5.0 KB | 77 | no | src/pages/podklyuchenie-i-obvyazka-vodonagrevatelya/sections/020-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Дополнительные фотографии узла | section | 3.5 KB | 29 | no | src/components/parametric/water-heater-wh4/section.template.html |
| Связанные страницы водонагревателей | section | 2.8 KB | 46 | no | src/pages/podklyuchenie-i-obvyazka-vodonagrevatelya/sections/011-section-svyazannye-stranicy-vodonagrevateley.html |
| Что проверить безопасно | pricing | 2.3 KB | 71 | no | src/pages/podklyuchenie-i-obvyazka-vodonagrevatelya/sections/008-pricing-chto-proverit-bezopasno.html |
| Что видно на сервисном фото | section | 2.3 KB | 35 | no | src/components/parametric/water-heater-wh4/section.template.html |
| Что отправить до выезда | lead-form | 1.9 KB | 31 | no | src/pages/podklyuchenie-i-obvyazka-vodonagrevatelya/sections/018-lead-form-chto-otpravit-do-vyezda.html |
| Подключение и обвязка водонагревателя | mobile-contact | 1.8 KB | 42 | no | src/pages/podklyuchenie-i-obvyazka-vodonagrevatelya/sections/002-mobile-contact-podklyuchenie-i-obvyazka-vodonagrevat.html |


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
- podklyuchenie-i-obvyazka-vodonagrevatelya.html
- src/site-builder.json
- src/pages/podklyuchenie-i-obvyazka-vodonagrevatelya/page.json
- src/pages/podklyuchenie-i-obvyazka-vodonagrevatelya/sections/

## Checks

- npm run doctor:household-page -- --page podklyuchenie-i-obvyazka-vodonagrevatelya.html
- npm run doctor:page -- --page podklyuchenie-i-obvyazka-vodonagrevatelya.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page podklyuchenie-i-obvyazka-vodonagrevatelya.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
