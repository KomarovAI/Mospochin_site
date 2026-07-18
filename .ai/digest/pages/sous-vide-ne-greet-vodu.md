# Page Digest — sous-vide-ne-greet-vodu.html

- Branch: restaurant
- Role: symptom-service
- Title: Су-вид не греет воду — проверка и ремонт в Москве | MosPochin
- Description: Что безопасно проверить, если термостат sous-vide включается, но не нагревает воду. Возможные причины, диагностика нагрева и ремонт в Москве.
- H1: Су-вид не греет воду
- Canonical: https://mospochin.ru/sous-vide-ne-greet-vodu.html
- Builder model: src/pages/sous-vide-ne-greet-vodu/page.json
- Sections: 16 (10 local, 1 shared refs, 0 raw)
- Text words inside referenced sections: 596

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
| Связанные симптомы | related-symptoms | 4.0 KB | 80 | no | src/pages/sous-vide-ne-greet-vodu/sections/100-related-symptoms.html |
| Форма заявки | lead-form | 3.3 KB | 33 | no | src/pages/sous-vide-ne-greet-vodu/sections/080-lead-form.html |
| Матрица причин | cause-matrix | 2.8 KB | 95 | no | src/pages/sous-vide-ne-greet-vodu/sections/050-cause-matrix.html |
| Ремонтируемые узлы | repair-scope | 2.5 KB | 83 | no | src/pages/sous-vide-ne-greet-vodu/sections/070-repair-scope.html |
| FAQ — частые вопросы | faq | 2.0 KB | 79 | no | src/pages/sous-vide-ne-greet-vodu/sections/090-faq.html |
| Безопасная проверка | safe-self-check | 1.9 KB | 49 | no | src/components/parametric/safe-self-check/default.template.html |
| Сервисная диагностика | service-diagnostics | 1.7 KB | 37 | yes | src/components/shared/service-diagnostics/service-diagnostics-servisnaya-diagnostika--eae9d6f0e3273b80.html |
| Первый экран | hero | 1.7 KB | 40 | no | src/pages/sous-vide-ne-greet-vodu/sections/010-hero.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- sous-vide-ne-greet-vodu.html
- src/site-builder.json
- src/pages/sous-vide-ne-greet-vodu/page.json
- src/pages/sous-vide-ne-greet-vodu/sections/

## Checks

- npm run doctor:page -- --page sous-vide-ne-greet-vodu.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page sous-vide-ne-greet-vodu.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
