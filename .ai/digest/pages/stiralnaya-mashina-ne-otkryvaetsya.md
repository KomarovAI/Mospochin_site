# Page Digest — stiralnaya-mashina-ne-otkryvaetsya.html

- Branch: household
- Role: service
- Title: Стиральная машина не открывается — диагностика в Москве | MosPochin
- Description: Диагностика стиральной машины, у которой после программы не открывается люк: вода в баке, температура, блокировка двери, слив и управление.
- H1: Стиральная машина не открывается после стирки
- Canonical: https://mospochin.ru/stiralnaya-mashina-ne-otkryvaetsya.html
- Builder model: src/pages/stiralnaya-mashina-ne-otkryvaetsya/page.json
- Sections: 11 (6 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 509

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 3 |
| section | 3 |
| breadcrumb | 1 |
| faq | 1 |
| lead-form | 1 |
| pricing | 1 |
| proof | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Мобильные контактные элементы | mobile-contact | 9.3 KB | 110 | no | src/components/parametric/washing-wm2/header-ff5231eb4124.template.html |
| Мобильные контактные элементы | mobile-contact | 4.9 KB | 77 | no | src/components/parametric/washing-wm2/footer-3aff2ca0a962.template.html |
| Стиральная машина не открывается после стирки | mobile-contact | 1.9 KB | 55 | no | src/pages/stiralnaya-mashina-ne-otkryvaetsya/sections/002-mobile-contact-stiral-naya-mashina-ne-otkryvaetsya-p.html |
| Что проверить безопасно | proof | 1.9 KB | 55 | no | src/components/parametric/washing-wm2/safe-diagnostics.template.html |
| Что отправить до выезда | lead-form | 1.6 KB | 25 | no | src/pages/stiralnaya-mashina-ne-otkryvaetsya/sections/008-lead-form-chto-otpravit-do-vyezda.html |
| Частые вопросы | faq | 1.6 KB | 67 | no | src/pages/stiralnaya-mashina-ne-otkryvaetsya/sections/009-faq-chastye-voprosy.html |
| Связанные страницы | section | 1.6 KB | 29 | no | src/pages/stiralnaya-mashina-ne-otkryvaetsya/sections/007-section-svyazannye-stranicy.html |
| Какие работы могут потребоваться | pricing | 1.2 KB | 33 | no | src/pages/stiralnaya-mashina-ne-otkryvaetsya/sections/006-pricing-kakie-raboty-mogut-potrebovat-sya.html |


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
- stiralnaya-mashina-ne-otkryvaetsya.html
- src/site-builder.json
- src/pages/stiralnaya-mashina-ne-otkryvaetsya/page.json
- src/pages/stiralnaya-mashina-ne-otkryvaetsya/sections/

## Checks

- npm run doctor:household-page -- --page stiralnaya-mashina-ne-otkryvaetsya.html
- npm run doctor:page -- --page stiralnaya-mashina-ne-otkryvaetsya.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page stiralnaya-mashina-ne-otkryvaetsya.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
