# Page Digest — case-chistka-boylera-s-silnoy-nakipyu.html

- Branch: household
- Role: service
- Title: Фотокейс: очистка бойлера с сильной накипью
- Description: Фотопоследовательность обслуживания накопительного водонагревателя: отложения, слив, промывка и осмотр нагревательного узла.
- H1: Очистка бойлера с сильной накипью — фотокейс
- Canonical: https://mospochin.ru/case-chistka-boylera-s-silnoy-nakipyu.html
- Builder model: src/pages/case-chistka-boylera-s-silnoy-nakipyu/page.json
- Sections: 10 (0 local, 3 shared refs, 0 raw)
- Text words inside referenced sections: 503

## Component mix

| Component | Count |
| --- | --- |
| section | 5 |
| mobile-contact | 2 |
| breadcrumb | 1 |
| faq | 1 |
| lead-form | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Последовательность и детали | section | 9.5 KB | 81 | no | src/components/parametric/water-heater-wh4/section.template.html |
| Мобильные контактные элементы | mobile-contact | 8.4 KB | 96 | no | src/components/parametric/water-heater-wh4/mobile-contact.template.html |
| Мобильные контактные элементы | mobile-contact | 4.3 KB | 61 | no | src/components/parametric/water-heater-wh4/mobile-contact.template.html |
| Очистка бойлера с сильной накипью — фотокейс | section | 2.4 KB | 38 | no | src/components/parametric/water-heater-wh4/section.template.html |
| Что видно в этой серии | section | 2.2 KB | 91 | no | src/components/parametric/water-heater-wh4/section.template.html |
| Частые вопросы | faq | 1.6 KB | 61 | yes | src/components/shared/faq/faq-chastye-voprosy--a7084e5e5cf57dc1.html |
| Связанные услуги | section | 1.5 KB | 23 | no | src/components/parametric/water-heater-wh4/section.template.html |
| Покажите свой узел | lead-form | 1.1 KB | 20 | yes | src/components/shared/lead-form/lead-form-pokazhite-svoy-uzel--026fa95bea2e36cd.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/household-branch.json
- data/household-page-policy.json
- data/household-page-slots.json
- case-chistka-boylera-s-silnoy-nakipyu.html
- src/site-builder.json
- src/pages/case-chistka-boylera-s-silnoy-nakipyu/page.json
- src/pages/case-chistka-boylera-s-silnoy-nakipyu/sections/

## Checks

- npm run doctor:page -- --page case-chistka-boylera-s-silnoy-nakipyu.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page case-chistka-boylera-s-silnoy-nakipyu.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
