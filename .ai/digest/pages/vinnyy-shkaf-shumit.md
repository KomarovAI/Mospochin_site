# Page Digest — vinnyy-shkaf-shumit.html

- Branch: household
- Role: service
- Title: Винный шкаф шумит — диагностика звука и вибрации | MosPochin
- Description: Разделяем штатные звуки компрессора, вентилятора и хладагента от вибрации полок, корпуса и неисправных узлов.
- H1: Винный шкаф шумит или вибрирует
- Canonical: https://mospochin.ru/vinnyy-shkaf-shumit.html
- Builder model: src/pages/vinnyy-shkaf-shumit/page.json
- Sections: 12 (4 local, 2 shared refs, 0 raw)
- Text words inside referenced sections: 521

## Component mix

| Component | Count |
| --- | --- |
| contact-cta | 2 |
| mobile-contact | 2 |
| pricing | 2 |
| section | 2 |
| breadcrumb | 1 |
| faq | 1 |
| lead-form | 1 |
| proof | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Мобильные контактные элементы | mobile-contact | 9.1 KB | 110 | no | src/components/parametric/wine-rf1/header-9bbd5dfdb994.template.html |
| Мобильные контактные элементы | mobile-contact | 4.8 KB | 77 | no | src/components/parametric/wine-rf1/footer-71b3c4a81b57.template.html |
| Что отправить до выезда | lead-form | 4.0 KB | 59 | no | src/pages/vinnyy-shkaf-shumit/sections/008-lead-form-chto-otpravit-do-vyezda.html |
| Что проверить безопасно | pricing | 2.1 KB | 52 | no | src/components/parametric/wine-rf1/safe-diagnostics.template.html |
| Винный шкаф шумит или вибрирует | contact-cta | 2.0 KB | 40 | no | src/pages/vinnyy-shkaf-shumit/sections/002-contact-cta-vinnyy-shkaf-shumit-ili-vibriruet.html |
| Связанные страницы кластера | section | 1.8 KB | 21 | no | src/pages/vinnyy-shkaf-shumit/sections/007-section-svyazannye-stranicy-klastera.html |
| Частые вопросы | faq | 1.7 KB | 67 | yes | src/components/shared/faq/faq-chastye-voprosy--3c9b5b2e5932a8e7.html |
| Какие работы могут потребоваться | pricing | 1.3 KB | 32 | no | src/pages/vinnyy-shkaf-shumit/sections/006-pricing-kakie-raboty-mogut-potrebovat-sya.html |


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
- vinnyy-shkaf-shumit.html
- src/site-builder.json
- src/pages/vinnyy-shkaf-shumit/page.json
- src/pages/vinnyy-shkaf-shumit/sections/

## Checks

- npm run doctor:household-page -- --page vinnyy-shkaf-shumit.html
- npm run doctor:page -- --page vinnyy-shkaf-shumit.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page vinnyy-shkaf-shumit.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
