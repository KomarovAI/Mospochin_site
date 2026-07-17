# Page Digest — kutter-ploho-izmelchaet.html

- Branch: restaurant
- Role: symptom-service
- Title: Куттер плохо измельчает — ножи, загрузка и диагностика | MosPochin
- Description: Куттер плохо измельчает: ножи, загрузка, скорость, скребок и диагностика качества работы профессионального оборудования.
- H1: Куттер плохо измельчает
- Canonical: https://mospochin.ru/kutter-ploho-izmelchaet.html
- Builder model: src/pages/kutter-ploho-izmelchaet/page.json
- Sections: 7 (3 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 481

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
| Куттер плохо измельчает | breadcrumb | 19.8 KB | 411 | no | src/pages/kutter-ploho-izmelchaet/sections/002-breadcrumb-kutter-ploho-izmel-chaet.html |
| FAQ — частые вопросы | faq | 1.8 KB | 70 | no | src/pages/kutter-ploho-izmelchaet/sections/090-faq.html |
| Секция 1 | body-preamble | 47 B | 0 | no | src/pages/kutter-ploho-izmelchaet/sections/001-body-preamble-sekciya-1.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |
| Footer mount point | footer-anchor | 33 B | 0 | no | src/components/parametric/static/footer-anchor-footer-container-mount-e290e2b6541c.template.html |
| Подключение partials-injector | runtime-partials | 0 B | 0 | no | src/components/parametric/static/runtime-partials-partials-injector-script-55fc50b4acf9.template.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- kutter-ploho-izmelchaet.html
- src/site-builder.json
- src/pages/kutter-ploho-izmelchaet/page.json
- src/pages/kutter-ploho-izmelchaet/sections/

## Checks

- npm run doctor:page -- --page kutter-ploho-izmelchaet.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page kutter-ploho-izmelchaet.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
