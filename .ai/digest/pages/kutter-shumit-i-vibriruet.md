# Page Digest — kutter-shumit-i-vibriruet.html

- Branch: unknown
- Role: unknown
- Title: Куттер шумит и вибрирует — диагностика и ремонт | MosPochin
- Description: Металлический шум, стук и вибрация куттера: ножевой блок, вал, подшипники, фиксация чаши и безопасная диагностика.
- H1: Куттер шумит и вибрирует
- Canonical: https://mospochin.ru/kutter-shumit-i-vibriruet.html
- Builder model: src/pages/kutter-shumit-i-vibriruet/page.json
- Sections: 7 (3 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 480

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 2 |
| body-preamble | 1 |
| breadcrumb | 1 |
| faq | 1 |
| footer-anchor | 1 |
| runtime-partials | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Куттер шумит и вибрирует | breadcrumb | 19.9 KB | 406 | no | src/pages/kutter-shumit-i-vibriruet/sections/002-breadcrumb-kutter-shumit-i-vibriruet.html |
| Частые вопросы | faq | 1.8 KB | 74 | no | src/pages/kutter-shumit-i-vibriruet/sections/003-faq-chastye-voprosy.html |
| Секция 1 | body-preamble | 47 B | 0 | no | src/pages/kutter-shumit-i-vibriruet/sections/001-body-preamble-sekciya-1.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |
| Footer mount point | footer-anchor | 33 B | 0 | no | src/components/parametric/static/footer-anchor-footer-container-mount-e290e2b6541c.template.html |
| Подключение partials-injector | runtime-partials | 0 B | 0 | no | src/components/parametric/static/runtime-partials-partials-injector-script-30d5aa9353a9.template.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- kutter-shumit-i-vibriruet.html
- src/site-builder.json
- src/pages/kutter-shumit-i-vibriruet/page.json
- src/pages/kutter-shumit-i-vibriruet/sections/

## Checks

- npm run doctor:page -- --page kutter-shumit-i-vibriruet.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page kutter-shumit-i-vibriruet.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
