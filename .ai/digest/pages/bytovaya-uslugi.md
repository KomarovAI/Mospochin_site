# Page Digest — bytovaya-uslugi.html

- Branch: household
- Role: branch
- Title: Услуги по ремонту бытовой техники — MosPochin
- Description: Каталог ремонта бытовой техники на дому: 10 направлений с типовыми симптомами — от холодильников и стиральных машин до вытяжек и водонагревателей.
- H1: Ремонт бытовой техники на дому
- Canonical: https://mospochin.ru/bytovaya-uslugi.html
- Builder model: src/pages/bytovaya-uslugi/page.json
- Sections: 16 (12 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 905

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 5 |
| pricing | 3 |
| faq | 2 |
| body-preamble | 1 |
| breadcrumb | 1 |
| contact-cta | 1 |
| hero | 1 |
| layout-fragment | 1 |
| lead-form | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Сначала выберите тип техники | faq | 8.8 KB | 159 | no | src/pages/bytovaya-uslugi/sections/006-faq-snachala-vyberite-tip-tehniki.html |
| Мобильные контактные элементы | mobile-contact | 7.2 KB | 78 | no | src/pages/bytovaya-uslugi/sections/002-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Ремонт бытовой техники на дому | hero | 6.1 KB | 85 | no | src/pages/bytovaya-uslugi/sections/004-hero-remont-bytovoy-tehniki-na-domu.html |
| Мобильные контактные элементы | mobile-contact | 4.3 KB | 61 | no | src/pages/bytovaya-uslugi/sections/013-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Как выглядит путь от симптома до результата | pricing | 3.5 KB | 131 | no | src/pages/bytovaya-uslugi/sections/008-pricing-kak-vyglyadit-put-ot-simptoma-do-rezul-tata.html |
| Оставьте заявку на ремонт | lead-form | 3.4 KB | 61 | no | src/pages/bytovaya-uslugi/sections/011-lead-form-ostav-te-zayavku-na-remont.html |
| Что остаётся у клиента после ремонта | pricing | 3.3 KB | 99 | no | src/pages/bytovaya-uslugi/sections/009-pricing-chto-ostaetsya-u-klienta-posle-remonta.html |
| Частые вопросы | faq | 3.2 KB | 106 | no | src/pages/bytovaya-uslugi/sections/010-faq-chastye-voprosy.html |


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
