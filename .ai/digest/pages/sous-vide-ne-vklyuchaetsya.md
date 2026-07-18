# Page Digest — sous-vide-ne-vklyuchaetsya.html

- Branch: restaurant
- Role: symptom-service
- Title: Су-вид не включается — безопасная проверка и ремонт | MosPochin
- Description: Безопасная проверка питания, кабеля и защиты, если термостат sous-vide не включается или внезапно отключился. Диагностика и ремонт в Москве.
- H1: Су-вид не включается
- Canonical: https://mospochin.ru/sous-vide-ne-vklyuchaetsya.html
- Builder model: src/pages/sous-vide-ne-vklyuchaetsya/page.json
- Sections: 16 (10 local, 1 shared refs, 0 raw)
- Text words inside referenced sections: 584

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
| Связанные симптомы | related-symptoms | 4.7 KB | 97 | no | src/pages/sous-vide-ne-vklyuchaetsya/sections/100-related-symptoms.html |
| Форма заявки | lead-form | 3.3 KB | 33 | no | src/pages/sous-vide-ne-vklyuchaetsya/sections/080-lead-form.html |
| Матрица причин | cause-matrix | 2.7 KB | 83 | no | src/pages/sous-vide-ne-vklyuchaetsya/sections/050-cause-matrix.html |
| Ремонтируемые узлы | repair-scope | 2.3 KB | 65 | no | src/pages/sous-vide-ne-vklyuchaetsya/sections/070-repair-scope.html |
| FAQ — частые вопросы | faq | 1.9 KB | 69 | no | src/pages/sous-vide-ne-vklyuchaetsya/sections/090-faq.html |
| Безопасная проверка | safe-self-check | 1.8 KB | 48 | no | src/components/parametric/safe-self-check/default.template.html |
| Сервисная диагностика | service-diagnostics | 1.7 KB | 37 | yes | src/components/shared/service-diagnostics/service-diagnostics-servisnaya-diagnostika--eae9d6f0e3273b80.html |
| Первый экран | hero | 1.7 KB | 39 | no | src/pages/sous-vide-ne-vklyuchaetsya/sections/010-hero.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- sous-vide-ne-vklyuchaetsya.html
- src/site-builder.json
- src/pages/sous-vide-ne-vklyuchaetsya/page.json
- src/pages/sous-vide-ne-vklyuchaetsya/sections/

## Checks

- npm run doctor:page -- --page sous-vide-ne-vklyuchaetsya.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page sous-vide-ne-vklyuchaetsya.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
