# Page Digest — kody-oshibok-sous-vide.html

- Branch: restaurant
- Role: symptom-service
- Title: Коды ошибок sous-vide по брендам и моделям | MosPochin
- Description: Проверенные коды ошибок термостатов sous-vide с обязательной привязкой к производителю и модели. Что можно проверить безопасно и когда прекращать работу.
- H1: Коды ошибок sous-vide
- Canonical: https://mospochin.ru/kody-oshibok-sous-vide.html
- Builder model: src/pages/kody-oshibok-sous-vide/page.json
- Sections: 16 (12 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 688

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
| Связанные симптомы | related-symptoms | 4.0 KB | 76 | no | src/pages/kody-oshibok-sous-vide/sections/100-related-symptoms.html |
| Форма заявки | lead-form | 3.3 KB | 33 | no | src/pages/kody-oshibok-sous-vide/sections/080-lead-form.html |
| Матрица причин | cause-matrix | 3.2 KB | 115 | no | src/pages/kody-oshibok-sous-vide/sections/050-cause-matrix.html |
| Ремонтируемые узлы | repair-scope | 2.8 KB | 103 | no | src/pages/kody-oshibok-sous-vide/sections/070-repair-scope.html |
| FAQ — частые вопросы | faq | 2.0 KB | 85 | no | src/pages/kody-oshibok-sous-vide/sections/090-faq.html |
| Безопасная проверка | safe-self-check | 1.9 KB | 50 | no | src/pages/kody-oshibok-sous-vide/sections/030-safe-self-check.html |
| Сервисная диагностика | service-diagnostics | 1.9 KB | 48 | no | src/pages/kody-oshibok-sous-vide/sections/060-service-diagnostics.html |
| Первый экран | hero | 1.7 KB | 42 | no | src/pages/kody-oshibok-sous-vide/sections/010-hero.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- kody-oshibok-sous-vide.html
- src/site-builder.json
- src/pages/kody-oshibok-sous-vide/page.json
- src/pages/kody-oshibok-sous-vide/sections/

## Checks

- npm run doctor:page -- --page kody-oshibok-sous-vide.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page kody-oshibok-sous-vide.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
