# Page Digest — holodilnye-shkafy-dlya-restoranov.html

- Branch: restaurant
- Role: branch
- Title: Ремонт профессиональных холодильных шкафов | MosPochin
- Description: Диагностика и ремонт профессиональных холодильных и морозильных шкафов: двери, уплотнения, вентиляторы, оттайка, дренаж, контроллер и компрессор.
- H1: Холодильные шкафы для ресторанов и кафе
- Canonical: https://mospochin.ru/holodilnye-shkafy-dlya-restoranov.html
- Builder model: src/pages/holodilnye-shkafy-dlya-restoranov/page.json
- Sections: 7 (4 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 909

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
| Холодильные шкафы для ресторанов и кафе | breadcrumb | 48.8 KB | 849 | no | src/pages/holodilnye-shkafy-dlya-restoranov/sections/002-breadcrumb-holodil-nye-shkafy-dlya-restoranov-i-kafe.html |
| Частые вопросы | faq | 1.7 KB | 60 | no | src/pages/holodilnye-shkafy-dlya-restoranov/sections/003-faq-chastye-voprosy.html |
| Контактный CTA | contact-cta | 47 B | 0 | no | src/pages/holodilnye-shkafy-dlya-restoranov/sections/001-contact-cta-kontaktnyy-cta.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |
| Footer mount point | footer-anchor | 33 B | 0 | no | src/components/parametric/static/footer-anchor-footer-container-mount-e290e2b6541c.template.html |
| Подключение partials-injector | runtime-partials | 0 B | 0 | no | src/pages/holodilnye-shkafy-dlya-restoranov/sections/007-runtime-partials-podklyuchenie-partials-injector.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- holodilnye-shkafy-dlya-restoranov.html
- src/site-builder.json
- src/pages/holodilnye-shkafy-dlya-restoranov/page.json
- src/pages/holodilnye-shkafy-dlya-restoranov/sections/

## Checks

- npm run doctor:page -- --page holodilnye-shkafy-dlya-restoranov.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page holodilnye-shkafy-dlya-restoranov.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
