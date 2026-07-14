# Page Digest — bezopasnost-sous-vide.html

- Branch: restaurant
- Role: guide
- Title: Безопасность sous-vide в ресторане: роли процесса и оборудования
- Description: Безопасность sous-vide в ресторане: технологическая карта, проверка оборудования, упаковка, маркировка, контроль отклонений и разделение ответственности.
- H1: Безопасность sous-vide в ресторане
- Canonical: https://mospochin.ru/bezopasnost-sous-vide.html
- Builder model: src/pages/bezopasnost-sous-vide/page.json
- Sections: 7 (5 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 348

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
| Безопасность sous-vide в ресторане | lead-form | 12.3 KB | 288 | no | src/pages/bezopasnost-sous-vide/sections/002-lead-form-bezopasnost-sous-vide-v-restorane.html |
| Частые вопросы | faq | 1.9 KB | 60 | no | src/pages/bezopasnost-sous-vide/sections/002b-faq-chastye-voprosy.html |
| Подключение partials-injector | runtime-partials | 50 B | 0 | no | src/components/parametric/static/runtime-partials-partials-injector-script-55fc50b4acf9.template.html |
| Секция 1 | body-preamble | 47 B | 0 | no | src/pages/bezopasnost-sous-vide/sections/001-body-preamble-sekciya-1.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/pages/bezopasnost-sous-vide/sections/005-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Мобильные контактные элементы | mobile-contact | 40 B | 0 | no | src/pages/bezopasnost-sous-vide/sections/004-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Footer mount point | footer-anchor | 33 B | 0 | no | src/components/parametric/static/footer-anchor-footer-container-mount-e290e2b6541c.template.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- bezopasnost-sous-vide.html
- src/site-builder.json
- src/pages/bezopasnost-sous-vide/page.json
- src/pages/bezopasnost-sous-vide/sections/

## Checks

- npm run doctor:page -- --page bezopasnost-sous-vide.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page bezopasnost-sous-vide.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
