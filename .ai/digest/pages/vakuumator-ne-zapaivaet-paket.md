# Page Digest — vakuumator-ne-zapaivaet-paket.html

- Branch: restaurant
- Role: symptom-service
- Title: Вакууматор не запаивает пакет — проверка и ремонт | MosPochin
- Description: Что проверить, если камерный вакууматор удаляет воздух, но не формирует шов. Влага, складки, тефлон, проволока, прижим и ремонт.
- H1: Вакууматор не запаивает пакет
- Canonical: https://mospochin.ru/vakuumator-ne-zapaivaet-paket.html
- Builder model: src/pages/vakuumator-ne-zapaivaet-paket/page.json
- Sections: 16 (11 local, 1 shared refs, 0 raw)
- Text words inside referenced sections: 602

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
| Связанные симптомы | related-symptoms | 4.8 KB | 99 | no | src/pages/vakuumator-ne-zapaivaet-paket/sections/100-related-symptoms.html |
| Форма заявки | lead-form | 3.4 KB | 33 | no | src/pages/vakuumator-ne-zapaivaet-paket/sections/080-lead-form.html |
| Матрица причин | cause-matrix | 2.7 KB | 91 | no | src/pages/vakuumator-ne-zapaivaet-paket/sections/050-cause-matrix.html |
| Ремонтируемые узлы | repair-scope | 2.5 KB | 78 | no | src/pages/vakuumator-ne-zapaivaet-paket/sections/070-repair-scope.html |
| FAQ — частые вопросы | faq | 2.0 KB | 79 | no | src/pages/vakuumator-ne-zapaivaet-paket/sections/090-faq.html |
| Безопасная проверка | safe-self-check | 1.8 KB | 46 | no | src/pages/vakuumator-ne-zapaivaet-paket/sections/030-safe-self-check.html |
| Сервисная диагностика | service-diagnostics | 1.7 KB | 37 | yes | src/components/shared/service-diagnostics/service-diagnostics-servisnaya-diagnostika--eae9d6f0e3273b80.html |
| Первый экран | hero | 1.7 KB | 37 | no | src/pages/vakuumator-ne-zapaivaet-paket/sections/010-hero.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- vakuumator-ne-zapaivaet-paket.html
- src/site-builder.json
- src/pages/vakuumator-ne-zapaivaet-paket/page.json
- src/pages/vakuumator-ne-zapaivaet-paket/sections/

## Checks

- npm run doctor:page -- --page vakuumator-ne-zapaivaet-paket.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page vakuumator-ne-zapaivaet-paket.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
