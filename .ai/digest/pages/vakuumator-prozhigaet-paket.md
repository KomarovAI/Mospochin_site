# Page Digest — vakuumator-prozhigaet-paket.html

- Branch: restaurant
- Role: symptom-service
- Title: Вакууматор прожигает пакет при запайке — диагностика | MosPochin
- Description: Пакет плавится, обугливается или разрезается запаечной планкой: программа, тефлон, провод, трансформатор и безопасная диагностика узла.
- H1: Вакууматор прожигает пакет
- Canonical: https://mospochin.ru/vakuumator-prozhigaet-paket.html
- Builder model: src/pages/vakuumator-prozhigaet-paket/page.json
- Sections: 16 (11 local, 1 shared refs, 0 raw)
- Text words inside referenced sections: 668

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
| Связанные симптомы | related-symptoms | 4.2 KB | 87 | no | src/pages/vakuumator-prozhigaet-paket/sections/100-related-symptoms.html |
| Форма заявки | lead-form | 3.4 KB | 33 | no | src/pages/vakuumator-prozhigaet-paket/sections/080-lead-form.html |
| Матрица причин | cause-matrix | 3.2 KB | 120 | no | src/pages/vakuumator-prozhigaet-paket/sections/050-cause-matrix.html |
| Ремонтируемые узлы | repair-scope | 2.8 KB | 96 | no | src/pages/vakuumator-prozhigaet-paket/sections/070-repair-scope.html |
| Безопасная проверка | safe-self-check | 1.9 KB | 55 | no | src/pages/vakuumator-prozhigaet-paket/sections/030-safe-self-check.html |
| FAQ — частые вопросы | faq | 1.9 KB | 66 | no | src/pages/vakuumator-prozhigaet-paket/sections/090-faq.html |
| Сервисная диагностика | service-diagnostics | 1.8 KB | 45 | no | src/pages/vakuumator-prozhigaet-paket/sections/060-service-diagnostics.html |
| Первый экран | hero | 1.8 KB | 42 | no | src/pages/vakuumator-prozhigaet-paket/sections/010-hero.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- vakuumator-prozhigaet-paket.html
- src/site-builder.json
- src/pages/vakuumator-prozhigaet-paket/page.json
- src/pages/vakuumator-prozhigaet-paket/sections/

## Checks

- npm run doctor:page -- --page vakuumator-prozhigaet-paket.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page vakuumator-prozhigaet-paket.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
