# Page Digest — holodilnye-kamery-dlya-restoranov.html

- Branch: restaurant
- Role: branch
- Title: Ремонт холодильных камер для ресторанов | MosPochin
- Description: Ремонт холодильных и морозильных камер: двери, панели, испаритель, оттайка, дренаж, моноблоки и сплит-системы.
- H1: Холодильные камеры для ресторанов и пищеблоков
- Canonical: https://mospochin.ru/holodilnye-kamery-dlya-restoranov.html
- Builder model: src/pages/holodilnye-kamery-dlya-restoranov/page.json
- Sections: 7 (4 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 922

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
| Холодильные камеры для ресторанов и пищеблоков | breadcrumb | 49.2 KB | 857 | no | src/pages/holodilnye-kamery-dlya-restoranov/sections/002-breadcrumb-holodil-nye-kamery-dlya-restoranov-i-pisc.html |
| Частые вопросы | faq | 1.8 KB | 65 | no | src/pages/holodilnye-kamery-dlya-restoranov/sections/003-faq-chastye-voprosy.html |
| Контактный CTA | contact-cta | 47 B | 0 | no | src/pages/holodilnye-kamery-dlya-restoranov/sections/001-contact-cta-kontaktnyy-cta.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |
| Footer mount point | footer-anchor | 33 B | 0 | no | src/components/parametric/static/footer-anchor-footer-container-mount-e290e2b6541c.template.html |
| Подключение partials-injector | runtime-partials | 0 B | 0 | no | src/pages/holodilnye-kamery-dlya-restoranov/sections/007-runtime-partials-podklyuchenie-partials-injector.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- holodilnye-kamery-dlya-restoranov.html
- src/site-builder.json
- src/pages/holodilnye-kamery-dlya-restoranov/page.json
- src/pages/holodilnye-kamery-dlya-restoranov/sections/

## Checks

- npm run doctor:page -- --page holodilnye-kamery-dlya-restoranov.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page holodilnye-kamery-dlya-restoranov.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
