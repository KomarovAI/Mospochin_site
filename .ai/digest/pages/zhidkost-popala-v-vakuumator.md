# Page Digest — zhidkost-popala-v-vakuumator.html

- Branch: restaurant
- Role: symptom-service
- Title: Жидкость попала в вакууматор — что делать и диагностика | MosPochin
- Description: Что безопасно сделать, если жидкость вышла из пакета, попала в камеру или масло насоса стало мутным. Очистка, диагностика и ремонт вакууматора.
- H1: Жидкость попала в вакууматор
- Canonical: https://mospochin.ru/zhidkost-popala-v-vakuumator.html
- Builder model: src/pages/zhidkost-popala-v-vakuumator/page.json
- Sections: 16 (11 local, 1 shared refs, 0 raw)
- Text words inside referenced sections: 590

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
| Связанные симптомы | related-symptoms | 4.7 KB | 93 | no | src/pages/zhidkost-popala-v-vakuumator/sections/100-related-symptoms.html |
| Форма заявки | lead-form | 3.4 KB | 33 | no | src/pages/zhidkost-popala-v-vakuumator/sections/080-lead-form.html |
| Матрица причин | cause-matrix | 2.7 KB | 89 | no | src/pages/zhidkost-popala-v-vakuumator/sections/050-cause-matrix.html |
| Ремонтируемые узлы | repair-scope | 2.4 KB | 74 | no | src/pages/zhidkost-popala-v-vakuumator/sections/070-repair-scope.html |
| Безопасная проверка | safe-self-check | 1.8 KB | 48 | no | src/pages/zhidkost-popala-v-vakuumator/sections/030-safe-self-check.html |
| FAQ — частые вопросы | faq | 1.8 KB | 64 | no | src/pages/zhidkost-popala-v-vakuumator/sections/090-faq.html |
| Сервисная диагностика | service-diagnostics | 1.7 KB | 37 | yes | src/components/shared/service-diagnostics/service-diagnostics-servisnaya-diagnostika--eae9d6f0e3273b80.html |
| Первый экран | hero | 1.7 KB | 42 | no | src/pages/zhidkost-popala-v-vakuumator/sections/010-hero.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- zhidkost-popala-v-vakuumator.html
- src/site-builder.json
- src/pages/zhidkost-popala-v-vakuumator/page.json
- src/pages/zhidkost-popala-v-vakuumator/sections/

## Checks

- npm run doctor:page -- --page zhidkost-popala-v-vakuumator.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page zhidkost-popala-v-vakuumator.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
