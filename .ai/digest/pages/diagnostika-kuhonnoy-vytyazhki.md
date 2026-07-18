# Page Digest — diagnostika-kuhonnoy-vytyazhki.html

- Branch: household
- Role: service
- Title: Диагностика кухонной вытяжки в Москве | MosPochin
- Description: Диагностика бытовой вытяжки: питание, фильтры, воздуховод, двигатель, крыльчатка, скорости, сенсор, плата и подсветка.
- H1: Диагностика кухонной вытяжки в Москве
- Canonical: https://mospochin.ru/diagnostika-kuhonnoy-vytyazhki.html
- Builder model: src/pages/diagnostika-kuhonnoy-vytyazhki/page.json
- Sections: 12 (6 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 495

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
| Мобильные контактные элементы | mobile-contact | 9.2 KB | 110 | no | src/components/parametric/hood1/header-9bbd5dfdb994.template.html |
| Мобильные контактные элементы | mobile-contact | 4.8 KB | 77 | no | src/components/parametric/hood1/footer-71b3c4a81b57.template.html |
| Что отправить до выезда | lead-form | 4.0 KB | 57 | no | src/pages/diagnostika-kuhonnoy-vytyazhki/sections/008-lead-form-chto-otpravit-do-vyezda.html |
| Диагностика кухонной вытяжки в Москве | contact-cta | 2.1 KB | 40 | no | src/pages/diagnostika-kuhonnoy-vytyazhki/sections/002-contact-cta-diagnostika-kuhonnoy-vytyazhki-v-moskve.html |
| Что проверить безопасно | proof | 2.0 KB | 43 | no | src/components/parametric/hood1/safe-diagnostics.template.html |
| Связанные страницы кластера | section | 1.8 KB | 22 | no | src/pages/diagnostika-kuhonnoy-vytyazhki/sections/007-section-svyazannye-stranicy-klastera.html |
| Частые вопросы | faq | 1.5 KB | 58 | no | src/pages/diagnostika-kuhonnoy-vytyazhki/sections/009-faq-chastye-voprosy.html |
| Какие работы могут потребоваться | pricing | 1.3 KB | 34 | no | src/pages/diagnostika-kuhonnoy-vytyazhki/sections/006-pricing-kakie-raboty-mogut-potrebovat-sya.html |


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
- diagnostika-kuhonnoy-vytyazhki.html
- src/site-builder.json
- src/pages/diagnostika-kuhonnoy-vytyazhki/page.json
- src/pages/diagnostika-kuhonnoy-vytyazhki/sections/

## Checks

- npm run doctor:household-page -- --page diagnostika-kuhonnoy-vytyazhki.html
- npm run doctor:page -- --page diagnostika-kuhonnoy-vytyazhki.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page diagnostika-kuhonnoy-vytyazhki.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
