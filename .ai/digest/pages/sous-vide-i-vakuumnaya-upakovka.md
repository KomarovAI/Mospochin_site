# Page Digest — sous-vide-i-vakuumnaya-upakovka.html

- Branch: restaurant
- Role: guide
- Title: Sous-vide и вакуумная упаковка: как связаны процессы
- Description: Связь sous-vide и вакуумной упаковки: подготовка пакета, работа камерного упаковщика, герметичный шов, маркировка и границы ответственности оборудования.
- H1: Sous-vide и вакуумная упаковка
- Canonical: https://mospochin.ru/sous-vide-i-vakuumnaya-upakovka.html
- Builder model: src/pages/sous-vide-i-vakuumnaya-upakovka/page.json
- Sections: 7 (5 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 322

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
| Sous-vide и вакуумная упаковка | lead-form | 12.0 KB | 272 | no | src/pages/sous-vide-i-vakuumnaya-upakovka/sections/002-lead-form-sous-vide-i-vakuumnaya-upakovka.html |
| Частые вопросы | faq | 1.6 KB | 50 | no | src/pages/sous-vide-i-vakuumnaya-upakovka/sections/002b-faq-chastye-voprosy.html |
| Подключение partials-injector | runtime-partials | 50 B | 0 | no | src/components/parametric/static/runtime-partials-partials-injector-script-55fc50b4acf9.template.html |
| Секция 1 | body-preamble | 47 B | 0 | no | src/pages/sous-vide-i-vakuumnaya-upakovka/sections/001-body-preamble-sekciya-1.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/pages/sous-vide-i-vakuumnaya-upakovka/sections/005-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Мобильные контактные элементы | mobile-contact | 40 B | 0 | no | src/pages/sous-vide-i-vakuumnaya-upakovka/sections/004-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Footer mount point | footer-anchor | 33 B | 0 | no | src/components/parametric/static/footer-anchor-footer-container-mount-e290e2b6541c.template.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- sous-vide-i-vakuumnaya-upakovka.html
- src/site-builder.json
- src/pages/sous-vide-i-vakuumnaya-upakovka/page.json
- src/pages/sous-vide-i-vakuumnaya-upakovka/sections/

## Checks

- npm run doctor:page -- --page sous-vide-i-vakuumnaya-upakovka.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page sous-vide-i-vakuumnaya-upakovka.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
