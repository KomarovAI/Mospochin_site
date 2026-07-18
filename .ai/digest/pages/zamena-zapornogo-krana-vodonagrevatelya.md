# Page Digest — zamena-zapornogo-krana-vodonagrevatelya.html

- Branch: household
- Role: service
- Title: Замена запорного крана водонагревателя в Москве
- Description: Замена локальной запорной арматуры перед защитным узлом водонагревателя. Без вмешательства в стояки и общую разводку квартиры.
- H1: Замена запорного крана водонагревателя
- Canonical: https://mospochin.ru/zamena-zapornogo-krana-vodonagrevatelya.html
- Builder model: src/pages/zamena-zapornogo-krana-vodonagrevatelya/page.json
- Sections: 15 (10 local, 1 shared refs, 2 raw)
- Text words inside referenced sections: 531

## Component mix

| Component | Count |
| --- | --- |
| section | 6 |
| mobile-contact | 3 |
| raw | 2 |
| breadcrumb | 1 |
| faq | 1 |
| lead-form | 1 |
| pricing | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Мобильные контактные элементы | mobile-contact | 9.2 KB | 110 | no | src/pages/zamena-zapornogo-krana-vodonagrevatelya/sections/001-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Мобильные контактные элементы | mobile-contact | 4.9 KB | 77 | no | src/pages/zamena-zapornogo-krana-vodonagrevatelya/sections/014-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Что видно на сервисном фото | section | 2.2 KB | 39 | no | src/components/parametric/water-heater-wh4/section.template.html |
| Что проверить безопасно | pricing | 2.1 KB | 52 | no | src/pages/zamena-zapornogo-krana-vodonagrevatelya/sections/008-pricing-chto-proverit-bezopasno.html |
| Что отправить до выезда | lead-form | 1.8 KB | 31 | yes | src/components/shared/lead-form/lead-form-chto-otpravit-do-vyezda--fda738717a7b479e.html |
| Замена запорного крана водонагревателя | mobile-contact | 1.7 KB | 37 | no | src/pages/zamena-zapornogo-krana-vodonagrevatelya/sections/002-mobile-contact-zamena-zapornogo-krana-vodonagrevatel.html |
| Связанные страницы водонагревателей | section | 1.7 KB | 26 | no | src/pages/zamena-zapornogo-krana-vodonagrevatelya/sections/011-section-svyazannye-stranicy-vodonagrevateley.html |
| Частые вопросы | faq | 1.5 KB | 56 | no | src/pages/zamena-zapornogo-krana-vodonagrevatelya/sections/013-faq-chastye-voprosy.html |


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
- zamena-zapornogo-krana-vodonagrevatelya.html
- src/site-builder.json
- src/pages/zamena-zapornogo-krana-vodonagrevatelya/page.json
- src/pages/zamena-zapornogo-krana-vodonagrevatelya/sections/

## Checks

- npm run doctor:household-page -- --page zamena-zapornogo-krana-vodonagrevatelya.html
- npm run doctor:page -- --page zamena-zapornogo-krana-vodonagrevatelya.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page zamena-zapornogo-krana-vodonagrevatelya.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
