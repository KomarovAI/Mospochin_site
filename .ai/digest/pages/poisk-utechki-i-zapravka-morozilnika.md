# Page Digest — poisk-utechki-i-zapravka-morozilnika.html

- Branch: household
- Role: service
- Title: Поиск утечки и заправка морозильника | MosPochin
- Description: Поиск причины потери хладагента, ремонт места утечки, вакуумирование и заправка морозильника по данным модели и типу хладагента.
- H1: Поиск утечки и заправка морозильника
- Canonical: https://mospochin.ru/poisk-utechki-i-zapravka-morozilnika.html
- Builder model: src/pages/poisk-utechki-i-zapravka-morozilnika/page.json
- Sections: 12 (6 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 449

## Component mix

| Component | Count |
| --- | --- |
| pricing | 3 |
| contact-cta | 2 |
| mobile-contact | 2 |
| breadcrumb | 1 |
| faq | 1 |
| lead-form | 1 |
| proof | 1 |
| section | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Мобильные контактные элементы | mobile-contact | 7.8 KB | 86 | no | src/components/parametric/freezer-rf1/header-0dbca8217220.template.html |
| Мобильные контактные элементы | mobile-contact | 4.3 KB | 61 | no | src/components/parametric/freezer-rf1/footer-c46ffb5cdd91.template.html |
| Что отправить до выезда | lead-form | 4.0 KB | 58 | no | src/pages/poisk-utechki-i-zapravka-morozilnika/sections/008-lead-form-chto-otpravit-do-vyezda.html |
| Что проверить безопасно | pricing | 2.0 KB | 45 | no | src/components/parametric/freezer-rf1/safe-diagnostics.template.html |
| Поиск утечки и заправка морозильника | contact-cta | 2.0 KB | 35 | no | src/pages/poisk-utechki-i-zapravka-morozilnika/sections/002-contact-cta-poisk-utechki-i-zapravka-morozil-nika.html |
| Связанные страницы кластера | section | 1.8 KB | 21 | no | src/pages/poisk-utechki-i-zapravka-morozilnika/sections/007-section-svyazannye-stranicy-klastera.html |
| Частые вопросы | faq | 1.5 KB | 57 | no | src/pages/poisk-utechki-i-zapravka-morozilnika/sections/009-faq-chastye-voprosy.html |
| Какие работы могут потребоваться | pricing | 1.4 KB | 34 | no | src/pages/poisk-utechki-i-zapravka-morozilnika/sections/006-pricing-kakie-raboty-mogut-potrebovat-sya.html |


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
- poisk-utechki-i-zapravka-morozilnika.html
- src/site-builder.json
- src/pages/poisk-utechki-i-zapravka-morozilnika/page.json
- src/pages/poisk-utechki-i-zapravka-morozilnika/sections/

## Checks

- npm run doctor:household-page -- --page poisk-utechki-i-zapravka-morozilnika.html
- npm run doctor:page -- --page poisk-utechki-i-zapravka-morozilnika.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page poisk-utechki-i-zapravka-morozilnika.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
