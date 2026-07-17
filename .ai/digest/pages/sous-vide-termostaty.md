# Page Digest — sous-vide-termostaty.html

- Branch: restaurant
- Role: service
- Title: Термостаты sous-vide для ресторанов: устройство и сервис | MosPochin
- Description: Профессиональные термостаты sous-vide для ресторанов: погружные и стационарные решения, узлы оборудования, диагностика и сервис на объекте.
- H1: Термостаты sous-vide для ресторанов
- Canonical: https://mospochin.ru/sous-vide-termostaty.html
- Builder model: src/pages/sous-vide-termostaty/page.json
- Sections: 7 (3 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 320

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 2 |
| body-preamble | 1 |
| faq | 1 |
| footer-anchor | 1 |
| lead-form | 1 |
| runtime-partials | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Термостаты sous-vide для ресторанов | lead-form | 13.3 KB | 260 | no | src/pages/sous-vide-termostaty/sections/002-lead-form-termostaty-sous-vide-dlya-restoranov.html |
| Частые вопросы | faq | 1.7 KB | 60 | no | src/pages/sous-vide-termostaty/sections/002b-faq-chastye-voprosy.html |
| Секция 1 | body-preamble | 47 B | 0 | no | src/pages/sous-vide-termostaty/sections/001-body-preamble-sekciya-1.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |
| Footer mount point | footer-anchor | 33 B | 0 | no | src/components/parametric/static/footer-anchor-footer-container-mount-e290e2b6541c.template.html |
| Подключение partials-injector | runtime-partials | 0 B | 0 | no | src/components/parametric/static/runtime-partials-partials-injector-script-55fc50b4acf9.template.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- sous-vide-termostaty.html
- src/site-builder.json
- src/pages/sous-vide-termostaty/page.json
- src/pages/sous-vide-termostaty/sections/

## Checks

- npm run doctor:page -- --page sous-vide-termostaty.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page sous-vide-termostaty.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
