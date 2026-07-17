# Page Digest — posudomoechnaya-mashina-ne-sushit-posudu.html

- Branch: restaurant
- Role: branch
- Title: Посудомоечная машина не сушит посуду — диагностика и ремонт | MosPochin
- Description: Промышленная посудомоечная машина не сушит посуду: диагностика температуры ополаскивания, подачи ополаскивателя, качества воды, загрузки и модуля сушки.
- H1: Посудомоечная машина не сушит посуду
- Canonical: https://mospochin.ru/posudomoechnaya-mashina-ne-sushit-posudu.html
- Builder model: src/pages/posudomoechnaya-mashina-ne-sushit-posudu/page.json
- Sections: 7 (3 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 850

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
| Посудомоечная машина не сушит посуду | breadcrumb | 38.5 KB | 781 | no | src/pages/posudomoechnaya-mashina-ne-sushit-posudu/sections/002-breadcrumb-posudomoechnaya-mashina-ne-sushit-posudu.html |
| Частые вопросы | faq | 1.9 KB | 69 | no | src/pages/posudomoechnaya-mashina-ne-sushit-posudu/sections/003-faq-chastye-voprosy.html |
| Контактный CTA | contact-cta | 47 B | 0 | no | src/pages/posudomoechnaya-mashina-ne-sushit-posudu/sections/001-contact-cta-kontaktnyy-cta.html |
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
- posudomoechnaya-mashina-ne-sushit-posudu.html
- src/site-builder.json
- src/pages/posudomoechnaya-mashina-ne-sushit-posudu/page.json
- src/pages/posudomoechnaya-mashina-ne-sushit-posudu/sections/

## Checks

- npm run doctor:page -- --page posudomoechnaya-mashina-ne-sushit-posudu.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page posudomoechnaya-mashina-ne-sushit-posudu.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
