# Page Digest — kak-rabotaet-sous-vide.html

- Branch: restaurant
- Role: guide
- Title: Как работает sous-vide: упаковка, нагрев и циркуляция воды
- Description: Как устроен процесс sous-vide на профессиональной кухне: вакуумная упаковка, водяная среда, нагрев, датчик и циркуляция без универсальных режимов.
- H1: Как работает sous-vide
- Canonical: https://mospochin.ru/kak-rabotaet-sous-vide.html
- Builder model: src/pages/kak-rabotaet-sous-vide/page.json
- Sections: 8 (5 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 308

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 2 |
| body-preamble | 1 |
| faq | 1 |
| footer-anchor | 1 |
| layout-fragment | 1 |
| lead-form | 1 |
| runtime-partials | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Как работает sous-vide | lead-form | 10.8 KB | 234 | no | src/pages/kak-rabotaet-sous-vide/sections/002-lead-form-kak-rabotaet-sous-vide.html |
| Частые вопросы | faq | 1.9 KB | 74 | no | src/pages/kak-rabotaet-sous-vide/sections/002b-faq-chastye-voprosy.html |
| Секция 1 | body-preamble | 50 B | 0 | no | src/pages/kak-rabotaet-sous-vide/sections/001-body-preamble-sekciya-1.html |
| Подключение partials-injector | runtime-partials | 50 B | 0 | no | src/components/parametric/static/runtime-partials-partials-injector-script-55fc50b4acf9.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/pages/kak-rabotaet-sous-vide/sections/005-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Мобильные контактные элементы | mobile-contact | 40 B | 0 | no | src/pages/kak-rabotaet-sous-vide/sections/004-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Footer mount point | footer-anchor | 36 B | 0 | no | src/components/parametric/static/footer-anchor-footer-container-mount-7e779f23d41c.template.html |
| HTML-фрагмент | layout-fragment | 1 B | 0 | no | src/components/parametric/static/layout-fragment-technical-fragment-01ba4719c80b.template.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- kak-rabotaet-sous-vide.html
- src/site-builder.json
- src/pages/kak-rabotaet-sous-vide/page.json
- src/pages/kak-rabotaet-sous-vide/sections/

## Checks

- npm run doctor:page -- --page kak-rabotaet-sous-vide.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page kak-rabotaet-sous-vide.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
