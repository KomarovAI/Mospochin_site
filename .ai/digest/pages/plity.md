# Page Digest — plity.html

- Branch: household
- Role: service
- Title: Ремонт плит и духовок в Москве на дому — MosPochin
- Description: Ремонт газовых, электрических и индукционных плит и духовок на дому в Москве. Согласуем работы до ремонта и даём гарантию.
- H1: Плита не греет, искрит или пахнет газом? Починим дома без навязанных замен
- Canonical: https://mospochin.ru/plity.html
- Builder model: src/pages/plity/page.json
- Sections: 46 (34 local, 6 shared refs, 0 raw)
- Text words inside referenced sections: 2877

## Component mix

| Component | Count |
| --- | --- |
| pricing | 13 |
| proof | 8 |
| layout-fragment | 6 |
| mobile-contact | 5 |
| contact-cta | 3 |
| faq | 3 |
| related-links | 2 |
| section | 2 |
| body-preamble | 1 |
| breadcrumb | 1 |
| hero | 1 |
| lead-form | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Работаем с распространёнными марками плит и духовок | pricing | 18.2 KB | 113 | no | src/pages/plity/sections/025-pricing-rabotaem-s-rasprostranennymi-markami-plit-i-.html |
| Что клиент понимает ещё до начала работ | pricing | 11.6 KB | 432 | no | src/pages/plity/sections/038-pricing-chto-klient-ponimaet-esche-do-nachala-rabot.html |
| Ремонтируем все типы плит и духовок | pricing | 8.0 KB | 186 | no | src/pages/plity/sections/009-pricing-remontiruem-vse-tipy-plit-i-duhovok.html |
| Мобильные контактные элементы | mobile-contact | 7.2 KB | 78 | no | src/pages/plity/sections/002-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Частые поломки плит и духовок | section | 6.2 KB | 120 | no | src/pages/plity/sections/019-section-chastye-polomki-plit-i-duhovok.html |
| Получите понятный сценарий ремонта плиты | lead-form | 6.1 KB | 86 | no | src/pages/plity/sections/034-lead-form-poluchite-ponyatnyy-scenariy-remonta-plity.html |
| Что случилось с плитой или духовкой? | pricing | 5.0 KB | 47 | no | src/pages/plity/sections/016-pricing-chto-sluchilos-s-plitoy-ili-duhovkoy.html |
| Мобильные контактные элементы | mobile-contact | 4.2 KB | 61 | no | src/pages/plity/sections/043-mobile-contact-mobil-nye-kontaktnye-elementy.html |


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
- plity.html
- src/site-builder.json
- src/pages/plity/page.json
- src/pages/plity/sections/

## Checks

- npm run doctor:household-page -- --page plity.html
- npm run doctor:page -- --page plity.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page plity.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
