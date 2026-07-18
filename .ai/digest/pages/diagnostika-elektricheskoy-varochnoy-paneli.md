# Page Digest — diagnostika-elektricheskoy-varochnoy-paneli.html

- Branch: household
- Role: service
- Title: Диагностика электрической варочной панели | MosPochin
- Description: Диагностика стеклокерамической или электрической панели: питание, зоны нагрева, ограничители, регуляторы, сенсор и плата.
- H1: Диагностика электрической варочной панели
- Canonical: https://mospochin.ru/diagnostika-elektricheskoy-varochnoy-paneli.html
- Builder model: src/pages/diagnostika-elektricheskoy-varochnoy-paneli/page.json
- Sections: 12 (6 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 477

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
| Мобильные контактные элементы | mobile-contact | 9.3 KB | 110 | no | src/components/parametric/cooking-appliance-cook2/header-ff5231eb4124.template.html |
| Мобильные контактные элементы | mobile-contact | 5.0 KB | 77 | no | src/components/parametric/cooking-appliance-cook2/footer-3aff2ca0a962.template.html |
| Что отправить до выезда | lead-form | 4.0 KB | 57 | no | src/pages/diagnostika-elektricheskoy-varochnoy-paneli/sections/008-lead-form-chto-otpravit-do-vyezda.html |
| Диагностика электрической варочной панели | contact-cta | 2.2 KB | 41 | no | src/pages/diagnostika-elektricheskoy-varochnoy-paneli/sections/002-contact-cta-diagnostika-elektricheskoy-varochnoy-pan.html |
| Что проверить безопасно | proof | 1.9 KB | 39 | no | src/components/parametric/cooking-appliance-cook2/safe-diagnostics.template.html |
| Связанные страницы кластера | section | 1.9 KB | 25 | no | src/pages/diagnostika-elektricheskoy-varochnoy-paneli/sections/007-section-svyazannye-stranicy-klastera.html |
| Какие работы могут потребоваться | pricing | 1.3 KB | 31 | no | src/pages/diagnostika-elektricheskoy-varochnoy-paneli/sections/006-pricing-kakie-raboty-mogut-potrebovat-sya.html |
| Частые вопросы | faq | 1.3 KB | 46 | no | src/pages/diagnostika-elektricheskoy-varochnoy-paneli/sections/009-faq-chastye-voprosy.html |


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
- diagnostika-elektricheskoy-varochnoy-paneli.html
- src/site-builder.json
- src/pages/diagnostika-elektricheskoy-varochnoy-paneli/page.json
- src/pages/diagnostika-elektricheskoy-varochnoy-paneli/sections/

## Checks

- npm run doctor:household-page -- --page diagnostika-elektricheskoy-varochnoy-paneli.html
- npm run doctor:page -- --page diagnostika-elektricheskoy-varochnoy-paneli.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page diagnostika-elektricheskoy-varochnoy-paneli.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
