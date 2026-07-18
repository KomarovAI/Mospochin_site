# Page Digest — diagnostika-vinnogo-shkafa.html

- Branch: household
- Role: service
- Title: Диагностика винного шкафа в Москве | MosPochin
- Description: Проверка фактической температуры по зонам, двери, вентиляции, вентиляторов, датчиков, платы и холодильного контура.
- H1: Диагностика винного шкафа в Москве
- Canonical: https://mospochin.ru/diagnostika-vinnogo-shkafa.html
- Builder model: src/pages/diagnostika-vinnogo-shkafa/page.json
- Sections: 12 (4 local, 2 shared refs, 0 raw)
- Text words inside referenced sections: 537

## Component mix

| Component | Count |
| --- | --- |
| contact-cta | 2 |
| mobile-contact | 2 |
| proof | 2 |
| section | 2 |
| breadcrumb | 1 |
| faq | 1 |
| lead-form | 1 |
| pricing | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Мобильные контактные элементы | mobile-contact | 9.1 KB | 110 | no | src/components/parametric/wine-rf1/header-9bbd5dfdb994.template.html |
| Мобильные контактные элементы | mobile-contact | 4.8 KB | 77 | no | src/components/parametric/wine-rf1/footer-71b3c4a81b57.template.html |
| Что отправить до выезда | lead-form | 4.0 KB | 59 | no | src/pages/diagnostika-vinnogo-shkafa/sections/008-lead-form-chto-otpravit-do-vyezda.html |
| Что проверить безопасно | proof | 2.2 KB | 53 | no | src/components/parametric/wine-rf1/safe-diagnostics.template.html |
| Диагностика винного шкафа в Москве | contact-cta | 2.0 KB | 39 | no | src/pages/diagnostika-vinnogo-shkafa/sections/002-contact-cta-diagnostika-vinnogo-shkafa-v-moskve.html |
| Связанные страницы кластера | section | 1.8 KB | 24 | no | src/pages/diagnostika-vinnogo-shkafa/sections/007-section-svyazannye-stranicy-klastera.html |
| Частые вопросы | faq | 1.7 KB | 71 | yes | src/components/shared/faq/faq-chastye-voprosy--2ff733a9fbe54c0a.html |
| Какие работы могут потребоваться | pricing | 1.4 KB | 37 | no | src/pages/diagnostika-vinnogo-shkafa/sections/006-pricing-kakie-raboty-mogut-potrebovat-sya.html |


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
- diagnostika-vinnogo-shkafa.html
- src/site-builder.json
- src/pages/diagnostika-vinnogo-shkafa/page.json
- src/pages/diagnostika-vinnogo-shkafa/sections/

## Checks

- npm run doctor:household-page -- --page diagnostika-vinnogo-shkafa.html
- npm run doctor:page -- --page diagnostika-vinnogo-shkafa.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page diagnostika-vinnogo-shkafa.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
