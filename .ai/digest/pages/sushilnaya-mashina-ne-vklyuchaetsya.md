# Page Digest — sushilnaya-mashina-ne-vklyuchaetsya.html

- Branch: household
- Role: service
- Title: Сушильная машина не включается | MosPochin
- Description: Сушильная машина полностью без индикации: проверяем розетку, автомат, кабель, сетевой фильтр, питание платы и внутренние соединения.
- H1: Сушильная машина не включается
- Canonical: https://mospochin.ru/sushilnaya-mashina-ne-vklyuchaetsya.html
- Builder model: src/pages/sushilnaya-mashina-ne-vklyuchaetsya/page.json
- Sections: 12 (6 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 483

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
| Что отправить до выезда | lead-form | 4.0 KB | 57 | no | src/pages/sushilnaya-mashina-ne-vklyuchaetsya/sections/008-lead-form-chto-otpravit-do-vyezda.html |
| Сушильная машина не включается | contact-cta | 1.9 KB | 32 | no | src/pages/sushilnaya-mashina-ne-vklyuchaetsya/sections/002-contact-cta-sushil-naya-mashina-ne-vklyuchaetsya.html |
| Что проверить безопасно | proof | 1.9 KB | 41 | no | src/components/parametric/dryer-dr1/safe-diagnostics.template.html |
| Связанные страницы кластера | section | 1.8 KB | 23 | no | src/pages/sushilnaya-mashina-ne-vklyuchaetsya/sections/007-section-svyazannye-stranicy-klastera.html |
| Частые вопросы | faq | 1.5 KB | 58 | no | src/pages/sushilnaya-mashina-ne-vklyuchaetsya/sections/009-faq-chastye-voprosy.html |
| Какие работы могут потребоваться | pricing | 1.3 KB | 30 | no | src/pages/sushilnaya-mashina-ne-vklyuchaetsya/sections/006-pricing-kakie-raboty-mogut-potrebovat-sya.html |


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
- sushilnaya-mashina-ne-vklyuchaetsya.html
- src/site-builder.json
- src/pages/sushilnaya-mashina-ne-vklyuchaetsya/page.json
- src/pages/sushilnaya-mashina-ne-vklyuchaetsya/sections/

## Checks

- npm run doctor:household-page -- --page sushilnaya-mashina-ne-vklyuchaetsya.html
- npm run doctor:page -- --page sushilnaya-mashina-ne-vklyuchaetsya.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page sushilnaya-mashina-ne-vklyuchaetsya.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
