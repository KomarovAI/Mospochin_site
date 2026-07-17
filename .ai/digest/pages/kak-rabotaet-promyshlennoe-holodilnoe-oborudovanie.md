# Page Digest — kak-rabotaet-promyshlennoe-holodilnoe-oborudovanie.html

- Branch: restaurant
- Role: branch
- Title: Как работает профессиональное холодильное оборудование | MosPochin
- Description: Устройство профессиональной холодильной системы: компрессор, конденсатор, расширительное устройство, испаритель, вентиляторы, оттайка и контроллер.
- H1: Как работает профессиональное холодильное оборудование
- Canonical: https://mospochin.ru/kak-rabotaet-promyshlennoe-holodilnoe-oborudovanie.html
- Builder model: src/pages/kak-rabotaet-promyshlennoe-holodilnoe-oborudovanie/page.json
- Sections: 7 (4 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 794

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
| Как работает профессиональное холодильное оборудование | breadcrumb | 42.8 KB | 735 | no | src/pages/kak-rabotaet-promyshlennoe-holodilnoe-oborudovanie/sections/002-breadcrumb-kak-rabotaet-professional-noe-holodil-noe.html |
| Частые вопросы | faq | 1.8 KB | 59 | no | src/pages/kak-rabotaet-promyshlennoe-holodilnoe-oborudovanie/sections/003-faq-chastye-voprosy.html |
| Контактный CTA | contact-cta | 47 B | 0 | no | src/pages/kak-rabotaet-promyshlennoe-holodilnoe-oborudovanie/sections/001-contact-cta-kontaktnyy-cta.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |
| Footer mount point | footer-anchor | 33 B | 0 | no | src/components/parametric/static/footer-anchor-footer-container-mount-e290e2b6541c.template.html |
| Подключение partials-injector | runtime-partials | 0 B | 0 | no | src/pages/kak-rabotaet-promyshlennoe-holodilnoe-oborudovanie/sections/007-runtime-partials-podklyuchenie-partials-injector.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- kak-rabotaet-promyshlennoe-holodilnoe-oborudovanie.html
- src/site-builder.json
- src/pages/kak-rabotaet-promyshlennoe-holodilnoe-oborudovanie/page.json
- src/pages/kak-rabotaet-promyshlennoe-holodilnoe-oborudovanie/sections/

## Checks

- npm run doctor:page -- --page kak-rabotaet-promyshlennoe-holodilnoe-oborudovanie.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page kak-rabotaet-promyshlennoe-holodilnoe-oborudovanie.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
