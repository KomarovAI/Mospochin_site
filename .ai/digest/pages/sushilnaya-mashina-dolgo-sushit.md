# Page Digest — sushilnaya-mashina-dolgo-sushit.html

- Branch: household
- Role: service
- Title: Сушильная машина долго сушит бельё | MosPochin
- Description: Цикл сушки сильно увеличился: проверяем загрузку, фильтры, теплообменник, датчики влажности, циркуляцию воздуха и производительность системы нагрева.
- H1: Сушильная машина долго сушит бельё
- Canonical: https://mospochin.ru/sushilnaya-mashina-dolgo-sushit.html
- Builder model: src/pages/sushilnaya-mashina-dolgo-sushit/page.json
- Sections: 12 (6 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 489

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
| Мобильные контактные элементы | mobile-contact | 9.3 KB | 110 | no | src/components/parametric/dryer-dr1/header-ff5231eb4124.template.html |
| Мобильные контактные элементы | mobile-contact | 4.9 KB | 77 | no | src/components/parametric/dryer-dr1/footer-3aff2ca0a962.template.html |
| Что отправить до выезда | lead-form | 4.0 KB | 57 | no | src/pages/sushilnaya-mashina-dolgo-sushit/sections/008-lead-form-chto-otpravit-do-vyezda.html |
| Сушильная машина долго сушит бельё | contact-cta | 2.1 KB | 41 | no | src/pages/sushilnaya-mashina-dolgo-sushit/sections/002-contact-cta-sushil-naya-mashina-dolgo-sushit-bel-e.html |
| Что проверить безопасно | proof | 2.1 KB | 45 | no | src/components/parametric/dryer-dr1/safe-diagnostics.template.html |
| Связанные страницы кластера | section | 1.9 KB | 25 | no | src/pages/sushilnaya-mashina-dolgo-sushit/sections/007-section-svyazannye-stranicy-klastera.html |
| Частые вопросы | faq | 1.4 KB | 54 | no | src/pages/sushilnaya-mashina-dolgo-sushit/sections/009-faq-chastye-voprosy.html |
| Какие работы могут потребоваться | pricing | 1.3 KB | 28 | no | src/pages/sushilnaya-mashina-dolgo-sushit/sections/006-pricing-kakie-raboty-mogut-potrebovat-sya.html |


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
- sushilnaya-mashina-dolgo-sushit.html
- src/site-builder.json
- src/pages/sushilnaya-mashina-dolgo-sushit/page.json
- src/pages/sushilnaya-mashina-dolgo-sushit/sections/

## Checks

- npm run doctor:household-page -- --page sushilnaya-mashina-dolgo-sushit.html
- npm run doctor:page -- --page sushilnaya-mashina-dolgo-sushit.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page sushilnaya-mashina-dolgo-sushit.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
