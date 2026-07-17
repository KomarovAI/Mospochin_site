# Page Digest — gryaznyy-mutnyy-ili-s-zapahom-led.html

- Branch: restaurant
- Role: branch
- Title: Мутный лёд или лёд с запахом — диагностика льдогенератора | MosPochin
- Description: Диагностика качества льда: исходная вода, фильтрация, жёсткость, санитарная обработка, резервуар, распределительная система и бункер.
- H1: Льдогенератор делает мутный лёд или лёд с запахом
- Canonical: https://mospochin.ru/gryaznyy-mutnyy-ili-s-zapahom-led.html
- Builder model: src/pages/gryaznyy-mutnyy-ili-s-zapahom-led/page.json
- Sections: 7 (4 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 822

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
| Льдогенератор делает мутный лёд или лёд с запахом | breadcrumb | 42.2 KB | 755 | no | src/pages/gryaznyy-mutnyy-ili-s-zapahom-led/sections/002-breadcrumb-l-dogenerator-delaet-mutnyy-led-ili-led-s.html |
| Частые вопросы | faq | 1.8 KB | 67 | no | src/pages/gryaznyy-mutnyy-ili-s-zapahom-led/sections/003-faq-chastye-voprosy.html |
| Контактный CTA | contact-cta | 47 B | 0 | no | src/pages/gryaznyy-mutnyy-ili-s-zapahom-led/sections/001-contact-cta-kontaktnyy-cta.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |
| Footer mount point | footer-anchor | 33 B | 0 | no | src/components/parametric/static/footer-anchor-footer-container-mount-e290e2b6541c.template.html |
| Подключение partials-injector | runtime-partials | 0 B | 0 | no | src/pages/gryaznyy-mutnyy-ili-s-zapahom-led/sections/007-runtime-partials-podklyuchenie-partials-injector.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- gryaznyy-mutnyy-ili-s-zapahom-led.html
- src/site-builder.json
- src/pages/gryaznyy-mutnyy-ili-s-zapahom-led/page.json
- src/pages/gryaznyy-mutnyy-ili-s-zapahom-led/sections/

## Checks

- npm run doctor:page -- --page gryaznyy-mutnyy-ili-s-zapahom-led.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page gryaznyy-mutnyy-ili-s-zapahom-led.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
