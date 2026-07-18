# Page Digest — sous-vide-vybivaet-avtomat.html

- Branch: restaurant
- Role: symptom-service
- Title: Су-вид выбивает автомат или УЗО — безопасная диагностика | MosPochin
- Description: Что делать, если термостат sous-vide отключает автомат или УЗО: немедленная остановка, фиксация условий и профессиональная проверка электрической части.
- H1: Су-вид выбивает автомат или УЗО
- Canonical: https://mospochin.ru/sous-vide-vybivaet-avtomat.html
- Builder model: src/pages/sous-vide-vybivaet-avtomat/page.json
- Sections: 16 (11 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 727

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
| Связанные симптомы | related-symptoms | 4.6 KB | 89 | no | src/pages/sous-vide-vybivaet-avtomat/sections/100-related-symptoms.html |
| Форма заявки | lead-form | 3.4 KB | 33 | no | src/pages/sous-vide-vybivaet-avtomat/sections/080-lead-form.html |
| Матрица причин | cause-matrix | 3.3 KB | 130 | no | src/pages/sous-vide-vybivaet-avtomat/sections/050-cause-matrix.html |
| Ремонтируемые узлы | repair-scope | 2.8 KB | 103 | no | src/pages/sous-vide-vybivaet-avtomat/sections/070-repair-scope.html |
| FAQ — частые вопросы | faq | 2.0 KB | 80 | no | src/pages/sous-vide-vybivaet-avtomat/sections/090-faq.html |
| Безопасная проверка | safe-self-check | 2.0 KB | 60 | no | src/components/parametric/safe-self-check/default.template.html |
| Сервисная диагностика | service-diagnostics | 1.8 KB | 47 | no | src/pages/sous-vide-vybivaet-avtomat/sections/060-service-diagnostics.html |
| Первый экран | hero | 1.8 KB | 51 | no | src/pages/sous-vide-vybivaet-avtomat/sections/010-hero.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- sous-vide-vybivaet-avtomat.html
- src/site-builder.json
- src/pages/sous-vide-vybivaet-avtomat/page.json
- src/pages/sous-vide-vybivaet-avtomat/sections/

## Checks

- npm run doctor:page -- --page sous-vide-vybivaet-avtomat.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page sous-vide-vybivaet-avtomat.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
