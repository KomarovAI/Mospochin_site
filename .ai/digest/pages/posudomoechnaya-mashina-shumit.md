# Page Digest — posudomoechnaya-mashina-shumit.html

- Branch: household
- Role: service
- Title: Посудомоечная машина шумит — диагностика звука | MosPochin
- Description: Посудомойка шумит, гудит или скрежещет: отделяем штатные звуки воды и насосов от посуды, фильтра, крыльчатки и двигателя.
- H1: Посудомоечная машина шумит и гудит
- Canonical: https://mospochin.ru/posudomoechnaya-mashina-shumit.html
- Builder model: src/pages/posudomoechnaya-mashina-shumit/page.json
- Sections: 11 (6 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 458

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
| Мобильные контактные элементы | mobile-contact | 9.3 KB | 110 | no | src/components/parametric/household-dishwasher-dw2/header-ff5231eb4124.template.html |
| Мобильные контактные элементы | mobile-contact | 4.9 KB | 77 | no | src/components/parametric/household-dishwasher-dw2/footer-3aff2ca0a962.template.html |
| Что проверить безопасно | proof | 1.8 KB | 44 | no | src/components/parametric/household-dishwasher-dw2/safe-diagnostics.template.html |
| Частые вопросы | faq | 1.7 KB | 68 | no | src/pages/posudomoechnaya-mashina-shumit/sections/009-faq-chastye-voprosy.html |
| Посудомоечная машина шумит и гудит | mobile-contact | 1.7 KB | 41 | no | src/pages/posudomoechnaya-mashina-shumit/sections/002-mobile-contact-posudomoechnaya-mashina-shumit-i-gudi.html |
| Что отправить до выезда | lead-form | 1.7 KB | 27 | no | src/pages/posudomoechnaya-mashina-shumit/sections/008-lead-form-chto-otpravit-do-vyezda.html |
| Связанные страницы | section | 1.5 KB | 16 | no | src/pages/posudomoechnaya-mashina-shumit/sections/007-section-svyazannye-stranicy.html |
| Какие работы могут потребоваться | pricing | 1.2 KB | 32 | no | src/pages/posudomoechnaya-mashina-shumit/sections/006-pricing-kakie-raboty-mogut-potrebovat-sya.html |


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
- posudomoechnaya-mashina-shumit.html
- src/site-builder.json
- src/pages/posudomoechnaya-mashina-shumit/page.json
- src/pages/posudomoechnaya-mashina-shumit/sections/

## Checks

- npm run doctor:household-page -- --page posudomoechnaya-mashina-shumit.html
- npm run doctor:page -- --page posudomoechnaya-mashina-shumit.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page posudomoechnaya-mashina-shumit.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
