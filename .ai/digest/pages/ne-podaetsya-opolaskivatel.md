# Page Digest — ne-podaetsya-opolaskivatel.html

- Branch: restaurant
- Role: branch
- Title: Не подаётся ополаскиватель — диагностика и ремонт | MosPochin
- Description: В промышленную посудомоечную машину не подаётся ополаскиватель: проверка канистры, трубки, дозирующей помпы, прайминга и команды финального ополаскивания.
- H1: Не подаётся ополаскиватель
- Canonical: https://mospochin.ru/ne-podaetsya-opolaskivatel.html
- Builder model: src/pages/ne-podaetsya-opolaskivatel/page.json
- Sections: 6 (4 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 1012

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 4 |
| breadcrumb | 1 |
| faq | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Не подаётся ополаскиватель | breadcrumb | 36.4 KB | 762 | no | src/pages/ne-podaetsya-opolaskivatel/sections/002-breadcrumb-ne-podaetsya-opolaskivatel.html |
| Мобильные контактные элементы | mobile-contact | 9.2 KB | 110 | no | src/pages/ne-podaetsya-opolaskivatel/sections/001-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Мобильные контактные элементы | mobile-contact | 4.8 KB | 77 | no | src/pages/ne-podaetsya-opolaskivatel/sections/004-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Частые вопросы | faq | 1.7 KB | 63 | no | src/pages/ne-podaetsya-opolaskivatel/sections/003-faq-chastye-voprosy.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- ne-podaetsya-opolaskivatel.html
- src/site-builder.json
- src/pages/ne-podaetsya-opolaskivatel/page.json
- src/pages/ne-podaetsya-opolaskivatel/sections/

## Checks

- npm run doctor:page -- --page ne-podaetsya-opolaskivatel.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page ne-podaetsya-opolaskivatel.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
