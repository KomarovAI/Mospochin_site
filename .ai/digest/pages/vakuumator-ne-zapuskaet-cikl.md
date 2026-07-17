# Page Digest — vakuumator-ne-zapuskaet-cikl.html

- Branch: restaurant
- Role: symptom-service
- Title: Вакууматор не запускает цикл — диагностика запуска | MosPochin
- Description: Камерный вакууматор не начинает откачку после закрытия крышки: программа, датчик крышки, защита вакуума, питание и сервисная диагностика.
- H1: Вакууматор не запускает цикл
- Canonical: https://mospochin.ru/vakuumator-ne-zapuskaet-cikl.html
- Builder model: src/pages/vakuumator-ne-zapuskaet-cikl/page.json
- Sections: 16 (12 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 712

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
| Связанные симптомы | related-symptoms | 4.2 KB | 82 | no | src/pages/vakuumator-ne-zapuskaet-cikl/sections/100-related-symptoms.html |
| Форма заявки | lead-form | 3.4 KB | 33 | no | src/pages/vakuumator-ne-zapuskaet-cikl/sections/080-lead-form.html |
| Матрица причин | cause-matrix | 3.3 KB | 125 | no | src/pages/vakuumator-ne-zapuskaet-cikl/sections/050-cause-matrix.html |
| Ремонтируемые узлы | repair-scope | 2.8 KB | 103 | no | src/pages/vakuumator-ne-zapuskaet-cikl/sections/070-repair-scope.html |
| Безопасная проверка | safe-self-check | 2.0 KB | 57 | no | src/pages/vakuumator-ne-zapuskaet-cikl/sections/030-safe-self-check.html |
| FAQ — частые вопросы | faq | 2.0 KB | 80 | no | src/pages/vakuumator-ne-zapuskaet-cikl/sections/090-faq.html |
| Сервисная диагностика | service-diagnostics | 1.9 KB | 48 | no | src/pages/vakuumator-ne-zapuskaet-cikl/sections/060-service-diagnostics.html |
| Первый экран | hero | 1.7 KB | 44 | no | src/pages/vakuumator-ne-zapuskaet-cikl/sections/010-hero.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- vakuumator-ne-zapuskaet-cikl.html
- src/site-builder.json
- src/pages/vakuumator-ne-zapuskaet-cikl/page.json
- src/pages/vakuumator-ne-zapuskaet-cikl/sections/

## Checks

- npm run doctor:page -- --page vakuumator-ne-zapuskaet-cikl.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page vakuumator-ne-zapuskaet-cikl.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
