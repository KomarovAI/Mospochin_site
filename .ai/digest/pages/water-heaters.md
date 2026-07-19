# Page Digest — water-heaters.html

- Branch: household
- Role: service
- Title: Ремонт электрических водонагревателей в Москве — MosPochin
- Description: Ремонт накопительных бойлеров и электрических проточных водонагревателей в Москве и МО. Диагностика причины, безопасные действия и согласование работ до ремонта.
- H1: Ремонт электрических водонагревателей в Москве
- Canonical: https://mospochin.ru/water-heaters.html
- Builder model: src/pages/water-heaters/page.json
- Sections: 44 (24 local, 3 shared refs, 6 raw)
- Text words inside referenced sections: 1837

## Component mix

| Component | Count |
| --- | --- |
| section | 8 |
| mobile-contact | 7 |
| layout-fragment | 6 |
| raw | 6 |
| pricing | 5 |
| proof | 5 |
| related-links | 2 |
| body-preamble | 1 |
| breadcrumb | 1 |
| faq | 1 |
| hero | 1 |
| lead-form | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Что клиент понимает ещё до начала работ | pricing | 13.1 KB | 427 | no | src/pages/water-heaters/sections/032-pricing-chto-klient-ponimaet-esche-do-nachala-rabot.html |
| Выберите тип прибора или то, что произошло | section | 9.9 KB | 155 | no | src/pages/water-heaters/sections/011-section-vyberite-tip-pribora-ili-to-chto-proizoshlo.html |
| Мобильные контактные элементы | mobile-contact | 7.3 KB | 78 | no | src/pages/water-heaters/sections/002-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Опишите модель и точный симптом | lead-form | 5.9 KB | 104 | no | src/pages/water-heaters/sections/030-lead-form-opishite-model-i-tochnyy-simptom.html |
| Расширенный кластер водонагревателей | section | 4.9 KB | 115 | no | src/pages/water-heaters/sections/028-section-rasshirennyy-klaster-vodonagrevateley.html |
| Частые вопросы | faq | 4.7 KB | 131 | no | src/pages/water-heaters/sections/037-faq-chastye-voprosy.html |
| Мобильные контактные элементы | mobile-contact | 4.4 KB | 61 | no | src/pages/water-heaters/sections/041-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Ремонтировать или менять прибор | pricing | 4.3 KB | 87 | no | src/pages/water-heaters/sections/013-pricing-remontirovat-ili-menyat-pribor.html |


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
- water-heaters.html
- src/site-builder.json
- src/pages/water-heaters/page.json
- src/pages/water-heaters/sections/

## Checks

- npm run doctor:household-page -- --page water-heaters.html
- npm run doctor:page -- --page water-heaters.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page water-heaters.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
