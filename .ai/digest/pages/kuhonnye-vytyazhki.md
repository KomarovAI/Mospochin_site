# Page Digest — kuhonnye-vytyazhki.html

- Branch: household
- Role: service
- Title: Ремонт кухонных вытяжек в Москве — MosPochin
- Description: Ремонт бытовых кухонных вытяжек: слабая тяга, шум, вибрация, управление, двигатель, подсветка и фильтры. Бытовой B2C-кластер без ресторанной вентиляции.
- H1: Ремонт кухонных вытяжек в Москве
- Canonical: https://mospochin.ru/kuhonnye-vytyazhki.html
- Builder model: src/pages/kuhonnye-vytyazhki/page.json
- Sections: 12 (6 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 505

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
| Мобильные контактные элементы | mobile-contact | 9.1 KB | 110 | no | src/components/parametric/hood1/header-9bbd5dfdb994.template.html |
| Мобильные контактные элементы | mobile-contact | 4.8 KB | 77 | no | src/components/parametric/hood1/footer-71b3c4a81b57.template.html |
| Что отправить до выезда | lead-form | 4.0 KB | 57 | no | src/pages/kuhonnye-vytyazhki/sections/008-lead-form-chto-otpravit-do-vyezda.html |
| Связанные страницы кластера | section | 2.2 KB | 31 | no | src/pages/kuhonnye-vytyazhki/sections/007-section-svyazannye-stranicy-klastera.html |
| Что проверить безопасно | proof | 2.0 KB | 45 | no | src/components/parametric/hood1/safe-diagnostics.template.html |
| Ремонт кухонных вытяжек в Москве | contact-cta | 2.0 KB | 40 | no | src/pages/kuhonnye-vytyazhki/sections/002-contact-cta-remont-kuhonnyh-vytyazhek-v-moskve.html |
| Частые вопросы | faq | 1.5 KB | 58 | no | src/pages/kuhonnye-vytyazhki/sections/009-faq-chastye-voprosy.html |
| Какие работы могут потребоваться | pricing | 1.4 KB | 35 | no | src/pages/kuhonnye-vytyazhki/sections/006-pricing-kakie-raboty-mogut-potrebovat-sya.html |


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
- kuhonnye-vytyazhki.html
- src/site-builder.json
- src/pages/kuhonnye-vytyazhki/page.json
- src/pages/kuhonnye-vytyazhki/sections/

## Checks

- npm run doctor:household-page -- --page kuhonnye-vytyazhki.html
- npm run doctor:page -- --page kuhonnye-vytyazhki.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page kuhonnye-vytyazhki.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
