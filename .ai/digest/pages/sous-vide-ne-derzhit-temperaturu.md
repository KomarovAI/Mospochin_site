# Page Digest — sous-vide-ne-derzhit-temperaturu.html

- Branch: restaurant
- Role: symptom-service
- Title: Су-вид не держит температуру — диагностика отклонений | MosPochin
- Description: Что проверить, если температура sous-vide плавает, не совпадает с внешним термометром или нестабильна: циркуляция, испарение, датчик и управление.
- H1: Су-вид не держит температуру
- Canonical: https://mospochin.ru/sous-vide-ne-derzhit-temperaturu.html
- Builder model: src/pages/sous-vide-ne-derzhit-temperaturu/page.json
- Sections: 16 (12 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 685

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
| Связанные симптомы | related-symptoms | 4.1 KB | 79 | no | src/pages/sous-vide-ne-derzhit-temperaturu/sections/100-related-symptoms.html |
| Матрица причин | cause-matrix | 3.4 KB | 122 | no | src/pages/sous-vide-ne-derzhit-temperaturu/sections/050-cause-matrix.html |
| Форма заявки | lead-form | 3.4 KB | 33 | no | src/pages/sous-vide-ne-derzhit-temperaturu/sections/080-lead-form.html |
| Ремонтируемые узлы | repair-scope | 2.8 KB | 102 | no | src/pages/sous-vide-ne-derzhit-temperaturu/sections/070-repair-scope.html |
| FAQ — частые вопросы | faq | 2.0 KB | 74 | no | src/pages/sous-vide-ne-derzhit-temperaturu/sections/090-faq.html |
| Безопасная проверка | safe-self-check | 2.0 KB | 55 | no | src/pages/sous-vide-ne-derzhit-temperaturu/sections/030-safe-self-check.html |
| Сервисная диагностика | service-diagnostics | 1.9 KB | 47 | no | src/pages/sous-vide-ne-derzhit-temperaturu/sections/060-service-diagnostics.html |
| Первый экран | hero | 1.8 KB | 44 | no | src/pages/sous-vide-ne-derzhit-temperaturu/sections/010-hero.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- sous-vide-ne-derzhit-temperaturu.html
- src/site-builder.json
- src/pages/sous-vide-ne-derzhit-temperaturu/page.json
- src/pages/sous-vide-ne-derzhit-temperaturu/sections/

## Checks

- npm run doctor:page -- --page sous-vide-ne-derzhit-temperaturu.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page sous-vide-ne-derzhit-temperaturu.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
