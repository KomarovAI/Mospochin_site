# Page Digest — ne-podaetsya-moyushchee-sredstvo.html

- Branch: restaurant
- Role: branch
- Title: Не подаётся моющее средство — диагностика и ремонт | MosPochin
- Description: В промышленную посудомоечную машину не подаётся моющее средство: диагностика канистры, всасывающей трубки, перистальтической помпы, клапана и управляющего сигнала.
- H1: Не подаётся моющее средство
- Canonical: https://mospochin.ru/ne-podaetsya-moyushchee-sredstvo.html
- Builder model: src/pages/ne-podaetsya-moyushchee-sredstvo/page.json
- Sections: 7 (3 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 842

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 2 |
| breadcrumb | 1 |
| contact-cta | 1 |
| faq | 1 |
| footer-anchor | 1 |
| runtime-partials | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Не подаётся моющее средство | breadcrumb | 36.6 KB | 777 | no | src/pages/ne-podaetsya-moyushchee-sredstvo/sections/002-breadcrumb-ne-podaetsya-moyuschee-sredstvo.html |
| Частые вопросы | faq | 1.8 KB | 65 | no | src/pages/ne-podaetsya-moyushchee-sredstvo/sections/003-faq-chastye-voprosy.html |
| Контактный CTA | contact-cta | 47 B | 0 | no | src/pages/ne-podaetsya-moyushchee-sredstvo/sections/001-contact-cta-kontaktnyy-cta.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container-inline.template.html |
| Мобильные контактные элементы | mobile-contact | 40 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container-inline.template.html |
| Footer mount point | footer-anchor | 33 B | 0 | no | src/components/parametric/static/footer-anchor-footer-container-mount-e290e2b6541c.template.html |
| Подключение partials-injector | runtime-partials | 0 B | 0 | no | src/components/parametric/static/runtime-partials-partials-injector-script-defer-empty.template.html |


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
