# Page Digest — mutnoe-maslo-vakuumatora.html

- Branch: restaurant
- Role: symptom-service
- Title: Мутное масло вакууматора — влага, эмульсия и сервис | MosPochin
- Description: Что означает мутное или молочное масло вакуумного насоса: попадание влаги, жидкие продукты, программа осушения и модельное обслуживание насоса.
- H1: Мутное масло вакууматора
- Canonical: https://mospochin.ru/mutnoe-maslo-vakuumatora.html
- Builder model: src/pages/mutnoe-maslo-vakuumatora/page.json
- Sections: 16 (11 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 735

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 2 |
| body-preamble | 1 |
| cause-matrix | 1 |
| decision-tree | 1 |
| faq | 1 |
| footer-anchor | 1 |
| hero | 1 |
| lead-form | 1 |
| related-symptoms | 1 |
| repair-scope | 1 |
| runtime-partials | 1 |
| safe-self-check | 1 |
| service-diagnostics | 1 |
| sources-note | 1 |
| stop-use | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Связанные симптомы | related-symptoms | 4.2 KB | 83 | no | src/pages/mutnoe-maslo-vakuumatora/sections/100-related-symptoms.html |
| Матрица причин | cause-matrix | 3.4 KB | 133 | no | src/pages/mutnoe-maslo-vakuumatora/sections/050-cause-matrix.html |
| Форма заявки | lead-form | 3.3 KB | 33 | no | src/pages/mutnoe-maslo-vakuumatora/sections/080-lead-form.html |
| Ремонтируемые узлы | repair-scope | 2.9 KB | 111 | no | src/pages/mutnoe-maslo-vakuumatora/sections/070-repair-scope.html |
| Безопасная проверка | safe-self-check | 2.0 KB | 65 | no | src/components/parametric/safe-self-check/default.template.html |
| Источники | sources-note | 1.9 KB | 63 | no | src/pages/mutnoe-maslo-vakuumatora/sections/110-sources-note.html |
| Сервисная диагностика | service-diagnostics | 1.9 KB | 47 | no | src/pages/mutnoe-maslo-vakuumatora/sections/060-service-diagnostics.html |
| FAQ — частые вопросы | faq | 1.8 KB | 78 | no | src/pages/mutnoe-maslo-vakuumatora/sections/090-faq.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- mutnoe-maslo-vakuumatora.html
- src/site-builder.json
- src/pages/mutnoe-maslo-vakuumatora/page.json
- src/pages/mutnoe-maslo-vakuumatora/sections/

## Checks

- npm run doctor:page -- --page mutnoe-maslo-vakuumatora.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page mutnoe-maslo-vakuumatora.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
