# Page Digest — sous-vide-shumit-bulkaet-vibriruet.html

- Branch: restaurant
- Role: symptom-service
- Title: Су-вид шумит, булькает или вибрирует — диагностика | MosPochin
- Description: Как различить штатное гудение, вихрь воды, подсасывание воздуха, скрежет и вибрацию термостата sous-vide. Безопасная проверка и ремонт циркулятора.
- H1: Су-вид шумит, булькает или вибрирует
- Canonical: https://mospochin.ru/sous-vide-shumit-bulkaet-vibriruet.html
- Builder model: src/pages/sous-vide-shumit-bulkaet-vibriruet/page.json
- Sections: 16 (11 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 692

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
| Связанные симптомы | related-symptoms | 4.1 KB | 81 | no | src/pages/sous-vide-shumit-bulkaet-vibriruet/sections/100-related-symptoms.html |
| Форма заявки | lead-form | 3.4 KB | 33 | no | src/pages/sous-vide-shumit-bulkaet-vibriruet/sections/080-lead-form.html |
| Матрица причин | cause-matrix | 3.3 KB | 123 | no | src/pages/sous-vide-shumit-bulkaet-vibriruet/sections/050-cause-matrix.html |
| Ремонтируемые узлы | repair-scope | 2.8 KB | 104 | no | src/pages/sous-vide-shumit-bulkaet-vibriruet/sections/070-repair-scope.html |
| Безопасная проверка | safe-self-check | 2.0 KB | 55 | no | src/components/parametric/safe-self-check/default.template.html |
| FAQ — частые вопросы | faq | 1.9 KB | 75 | no | src/pages/sous-vide-shumit-bulkaet-vibriruet/sections/090-faq.html |
| Сервисная диагностика | service-diagnostics | 1.8 KB | 47 | no | src/pages/sous-vide-shumit-bulkaet-vibriruet/sections/060-service-diagnostics.html |
| Первый экран | hero | 1.8 KB | 48 | no | src/pages/sous-vide-shumit-bulkaet-vibriruet/sections/010-hero.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- sous-vide-shumit-bulkaet-vibriruet.html
- src/site-builder.json
- src/pages/sous-vide-shumit-bulkaet-vibriruet/page.json
- src/pages/sous-vide-shumit-bulkaet-vibriruet/sections/

## Checks

- npm run doctor:page -- --page sous-vide-shumit-bulkaet-vibriruet.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page sous-vide-shumit-bulkaet-vibriruet.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
