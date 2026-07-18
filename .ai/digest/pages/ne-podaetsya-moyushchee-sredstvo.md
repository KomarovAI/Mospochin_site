# Page Digest — ne-podaetsya-moyushchee-sredstvo.html

- Branch: restaurant
- Role: branch
- Title: Не подаётся моющее средство — диагностика и ремонт | MosPochin
- Description: В промышленную посудомоечную машину не подаётся моющее средство: диагностика канистры, всасывающей трубки, перистальтической помпы, клапана и управляющего сигнала.
- H1: Не подаётся моющее средство
- Canonical: https://mospochin.ru/ne-podaetsya-moyushchee-sredstvo.html
- Builder model: src/pages/ne-podaetsya-moyushchee-sredstvo/page.json
- Sections: 6 (4 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 1029

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 4 |
| breadcrumb | 1 |
| faq | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Не подаётся моющее средство | breadcrumb | 36.7 KB | 777 | no | src/pages/ne-podaetsya-moyushchee-sredstvo/sections/002-breadcrumb-ne-podaetsya-moyuschee-sredstvo.html |
| Мобильные контактные элементы | mobile-contact | 9.2 KB | 110 | no | src/pages/ne-podaetsya-moyushchee-sredstvo/sections/001-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Мобильные контактные элементы | mobile-contact | 4.9 KB | 77 | no | src/pages/ne-podaetsya-moyushchee-sredstvo/sections/004-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Частые вопросы | faq | 1.8 KB | 65 | no | src/pages/ne-podaetsya-moyushchee-sredstvo/sections/003-faq-chastye-voprosy.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- ne-podaetsya-moyushchee-sredstvo.html
- src/site-builder.json
- src/pages/ne-podaetsya-moyushchee-sredstvo/page.json
- src/pages/ne-podaetsya-moyushchee-sredstvo/sections/

## Checks

- npm run doctor:page -- --page ne-podaetsya-moyushchee-sredstvo.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page ne-podaetsya-moyushchee-sredstvo.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
