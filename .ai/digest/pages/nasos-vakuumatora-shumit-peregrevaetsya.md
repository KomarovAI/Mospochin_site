# Page Digest — nasos-vakuumatora-shumit-peregrevaetsya.html

- Branch: restaurant
- Role: symptom-service
- Title: Насос вакууматора шумит или перегревается — диагностика | MosPochin
- Description: Причины усиленного шума, перегрева и медленной работы насоса камерного вакууматора. Проверка масла, фильтра, охлаждения и ремонт.
- H1: Насос вакууматора шумит или перегревается
- Canonical: https://mospochin.ru/nasos-vakuumatora-shumit-peregrevaetsya.html
- Builder model: src/pages/nasos-vakuumatora-shumit-peregrevaetsya/page.json
- Sections: 16 (9 local, 2 shared refs, 0 raw)
- Text words inside referenced sections: 577

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
| Связанные симптомы | related-symptoms | 4.2 KB | 85 | no | src/pages/nasos-vakuumatora-shumit-peregrevaetsya/sections/100-related-symptoms.html |
| Форма заявки | lead-form | 3.4 KB | 33 | no | src/pages/nasos-vakuumatora-shumit-peregrevaetsya/sections/080-lead-form.html |
| Матрица причин | cause-matrix | 2.8 KB | 93 | no | src/pages/nasos-vakuumatora-shumit-peregrevaetsya/sections/050-cause-matrix.html |
| Ремонтируемые узлы | repair-scope | 2.6 KB | 85 | no | src/pages/nasos-vakuumatora-shumit-peregrevaetsya/sections/070-repair-scope.html |
| Безопасная проверка | safe-self-check | 1.9 KB | 48 | no | src/components/parametric/safe-self-check/default.template.html |
| FAQ — частые вопросы | faq | 1.8 KB | 62 | no | src/pages/nasos-vakuumatora-shumit-peregrevaetsya/sections/090-faq.html |
| Первый экран | hero | 1.7 KB | 40 | no | src/pages/nasos-vakuumatora-shumit-peregrevaetsya/sections/010-hero.html |
| Сервисная диагностика | service-diagnostics | 1.7 KB | 37 | yes | src/components/shared/service-diagnostics/service-diagnostics-servisnaya-diagnostika--eae9d6f0e3273b80.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- nasos-vakuumatora-shumit-peregrevaetsya.html
- src/site-builder.json
- src/pages/nasos-vakuumatora-shumit-peregrevaetsya/page.json
- src/pages/nasos-vakuumatora-shumit-peregrevaetsya/sections/

## Checks

- npm run doctor:page -- --page nasos-vakuumatora-shumit-peregrevaetsya.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page nasos-vakuumatora-shumit-peregrevaetsya.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
