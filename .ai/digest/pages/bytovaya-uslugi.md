# Page Digest — bytovaya-uslugi.html

- Branch: household
- Role: branch
- Title: Услуги по ремонту бытовой техники — MosPochin
- Description: Каталог услуг MosPochin: ремонт холодильников, стиральных машин, посудомоек, плит, микроволновок и водонагревателей на дому.
- H1: Ремонт бытовой техники на дому
- Canonical: https://mospochin.ru/bytovaya-uslugi.html
- Builder model: src/pages/bytovaya-uslugi/page.json
- Sections: 18 (11 local, 0 shared refs, 1 raw)
- Text words inside referenced sections: 713

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 3 |
| pricing | 3 |
| faq | 2 |
| layout-fragment | 2 |
| breadcrumb | 1 |
| contact-cta | 1 |
| footer-anchor | 1 |
| hero | 1 |
| lead-form | 1 |
| noscript | 1 |
| raw | 1 |
| runtime-partials | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Сначала выберите тип техники | faq | 14.0 KB | 115 | no | src/pages/bytovaya-uslugi/sections/007-faq-snachala-vyberite-tip-tehniki.html |
| Ремонт бытовой техники на дому | hero | 7.2 KB | 81 | no | src/pages/bytovaya-uslugi/sections/005-hero-remont-bytovoy-tehniki-na-domu.html |
| Оставьте заявку на ремонт | lead-form | 4.6 KB | 57 | no | src/pages/bytovaya-uslugi/sections/012-lead-form-ostav-te-zayavku-na-remont.html |
| Как выглядит путь от симптома до результата | pricing | 4.2 KB | 131 | no | src/pages/bytovaya-uslugi/sections/009-pricing-kak-vyglyadit-put-ot-simptoma-do-rezul-tata.html |
| Что остаётся у клиента после ремонта | pricing | 3.9 KB | 100 | no | src/pages/bytovaya-uslugi/sections/010-pricing-chto-ostaetsya-u-klienta-posle-remonta.html |
| Что проговариваем до начала ремонта | pricing | 3.5 KB | 103 | no | src/pages/bytovaya-uslugi/sections/008-pricing-chto-progovarivaem-do-nachala-remonta.html |
| Частые вопросы | faq | 3.3 KB | 105 | no | src/pages/bytovaya-uslugi/sections/011-faq-chastye-voprosy.html |
| Контактный CTA | contact-cta | 1.3 KB | 17 | no | src/pages/bytovaya-uslugi/sections/006-contact-cta-kontaktnyy-cta.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/household-branch.json
- data/household-page-policy.json
- data/household-page-slots.json
- bytovaya-uslugi.html
- src/site-builder.json
- src/pages/bytovaya-uslugi/page.json
- src/pages/bytovaya-uslugi/sections/

## Checks

- npm run doctor:page -- --page bytovaya-uslugi.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page bytovaya-uslugi.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
