# Page Digest — duhovka-ne-vklyuchaetsya.html

- Branch: household
- Role: service
- Title: Духовка не включается — диагностика и ремонт | MosPochin
- Description: Духовка полностью не включается: проверяем питание, автомат, клеммы, сетевой фильтр, термозащиту, панель и силовую плату.
- H1: Духовка не включается — диагностика и ремонт
- Canonical: https://mospochin.ru/duhovka-ne-vklyuchaetsya.html
- Builder model: src/pages/duhovka-ne-vklyuchaetsya/page.json
- Sections: 12 (5 local, 1 shared refs, 0 raw)
- Text words inside referenced sections: 494

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
| Мобильные контактные элементы | mobile-contact | 9.2 KB | 110 | no | src/components/parametric/cooking-appliance-cook2/header-ff5231eb4124.template.html |
| Мобильные контактные элементы | mobile-contact | 4.9 KB | 77 | no | src/components/parametric/cooking-appliance-cook2/footer-3aff2ca0a962.template.html |
| Что отправить до выезда | lead-form | 4.0 KB | 57 | no | src/pages/duhovka-ne-vklyuchaetsya/sections/008-lead-form-chto-otpravit-do-vyezda.html |
| Духовка не включается — диагностика и ремонт | contact-cta | 2.1 KB | 46 | no | src/pages/duhovka-ne-vklyuchaetsya/sections/002-contact-cta-duhovka-ne-vklyuchaetsya-diagnostika-i-r.html |
| Что проверить безопасно | proof | 2.0 KB | 46 | no | src/components/parametric/cooking-appliance-cook2/safe-diagnostics.template.html |
| Связанные страницы кластера | section | 1.8 KB | 23 | no | src/pages/duhovka-ne-vklyuchaetsya/sections/007-section-svyazannye-stranicy-klastera.html |
| Какие работы могут потребоваться | pricing | 1.3 KB | 33 | no | src/pages/duhovka-ne-vklyuchaetsya/sections/006-pricing-kakie-raboty-mogut-potrebovat-sya.html |
| Частые вопросы | faq | 1.3 KB | 46 | yes | src/components/shared/faq/faq-chastye-voprosy--2e07bfeccbcc5ed4.html |


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
- duhovka-ne-vklyuchaetsya.html
- src/site-builder.json
- src/pages/duhovka-ne-vklyuchaetsya/page.json
- src/pages/duhovka-ne-vklyuchaetsya/sections/

## Checks

- npm run doctor:household-page -- --page duhovka-ne-vklyuchaetsya.html
- npm run doctor:page -- --page duhovka-ne-vklyuchaetsya.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page duhovka-ne-vklyuchaetsya.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
