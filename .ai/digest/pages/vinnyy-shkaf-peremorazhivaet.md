# Page Digest — vinnyy-shkaf-peremorazhivaet.html

- Branch: household
- Role: service
- Title: Винный шкаф перемораживает или охлаждает ниже настройки | MosPochin
- Description: Диагностика винного шкафа, в котором температура опускается ниже заданной или бутылки переохлаждаются.
- H1: Винный шкаф слишком сильно охлаждает
- Canonical: https://mospochin.ru/vinnyy-shkaf-peremorazhivaet.html
- Builder model: src/pages/vinnyy-shkaf-peremorazhivaet/page.json
- Sections: 12 (5 local, 1 shared refs, 0 raw)
- Text words inside referenced sections: 528

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
| Что отправить до выезда | lead-form | 4.0 KB | 59 | no | src/pages/vinnyy-shkaf-peremorazhivaet/sections/008-lead-form-chto-otpravit-do-vyezda.html |
| Что проверить безопасно | proof | 2.1 KB | 50 | no | src/components/parametric/wine-rf1/safe-diagnostics.template.html |
| Винный шкаф слишком сильно охлаждает | contact-cta | 2.0 KB | 39 | no | src/pages/vinnyy-shkaf-peremorazhivaet/sections/002-contact-cta-vinnyy-shkaf-slishkom-sil-no-ohlazhdaet.html |
| Связанные страницы кластера | section | 1.9 KB | 26 | no | src/pages/vinnyy-shkaf-peremorazhivaet/sections/007-section-svyazannye-stranicy-klastera.html |
| Частые вопросы | faq | 1.7 KB | 71 | no | src/pages/vinnyy-shkaf-peremorazhivaet/sections/009-faq-chastye-voprosy.html |
| Какие работы могут потребоваться | pricing | 1.3 KB | 33 | no | src/pages/vinnyy-shkaf-peremorazhivaet/sections/006-pricing-kakie-raboty-mogut-potrebovat-sya.html |


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
- vinnyy-shkaf-peremorazhivaet.html
- src/site-builder.json
- src/pages/vinnyy-shkaf-peremorazhivaet/page.json
- src/pages/vinnyy-shkaf-peremorazhivaet/sections/

## Checks

- npm run doctor:household-page -- --page vinnyy-shkaf-peremorazhivaet.html
- npm run doctor:page -- --page vinnyy-shkaf-peremorazhivaet.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page vinnyy-shkaf-peremorazhivaet.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
