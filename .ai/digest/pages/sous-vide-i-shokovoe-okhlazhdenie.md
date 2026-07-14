# Page Digest — sous-vide-i-shokovoe-okhlazhdenie.html

- Branch: restaurant
- Role: guide
- Title: Sous-vide и шоковое охлаждение: разделение оборудования и процессов
- Description: Как связаны sous-vide и шоковое охлаждение на профессиональной кухне: роли термостата, упаковки, охлаждающего оборудования, маркировки и технологической карты.
- H1: Sous-vide и шоковое охлаждение
- Canonical: https://mospochin.ru/sous-vide-i-shokovoe-okhlazhdenie.html
- Builder model: src/pages/sous-vide-i-shokovoe-okhlazhdenie/page.json
- Sections: 7 (5 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 337

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
| Sous-vide и шоковое охлаждение | lead-form | 12.2 KB | 281 | no | src/pages/sous-vide-i-shokovoe-okhlazhdenie/sections/002-lead-form-sous-vide-i-shokovoe-ohlazhdenie.html |
| Частые вопросы | faq | 1.7 KB | 56 | no | src/pages/sous-vide-i-shokovoe-okhlazhdenie/sections/002b-faq-chastye-voprosy.html |
| Подключение partials-injector | runtime-partials | 50 B | 0 | no | src/components/parametric/static/runtime-partials-partials-injector-script-55fc50b4acf9.template.html |
| Секция 1 | body-preamble | 47 B | 0 | no | src/pages/sous-vide-i-shokovoe-okhlazhdenie/sections/001-body-preamble-sekciya-1.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/pages/sous-vide-i-shokovoe-okhlazhdenie/sections/005-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Мобильные контактные элементы | mobile-contact | 40 B | 0 | no | src/pages/sous-vide-i-shokovoe-okhlazhdenie/sections/004-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Footer mount point | footer-anchor | 33 B | 0 | no | src/components/parametric/static/footer-anchor-footer-container-mount-e290e2b6541c.template.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- sous-vide-i-shokovoe-okhlazhdenie.html
- src/site-builder.json
- src/pages/sous-vide-i-shokovoe-okhlazhdenie/page.json
- src/pages/sous-vide-i-shokovoe-okhlazhdenie/sections/

## Checks

- npm run doctor:page -- --page sous-vide-i-shokovoe-okhlazhdenie.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page sous-vide-i-shokovoe-okhlazhdenie.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
