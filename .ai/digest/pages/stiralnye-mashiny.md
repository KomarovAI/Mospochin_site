# Page Digest — stiralnye-mashiny.html

- Branch: household
- Role: service
- Title: Ремонт стиральных машин в Москве на дому — MosPochin
- Description: Ремонт стиральных машин на дому в Москве. Диагностика, согласование стоимости до ремонта и честный бытовой сценарий без лишних замен.
- H1: Стиральная машина не сливает, течёт или шумит? Вернём стирку без лишних замен
- Canonical: https://mospochin.ru/stiralnye-mashiny.html
- Builder model: src/pages/stiralnye-mashiny/page.json
- Sections: 50 (40 local, 1 shared refs, 7 raw)
- Text words inside referenced sections: 2914

## Component mix

| Component | Count |
| --- | --- |
| pricing | 8 |
| proof | 8 |
| mobile-contact | 7 |
| raw | 7 |
| faq | 4 |
| layout-fragment | 4 |
| contact-cta | 2 |
| lead-form | 2 |
| related-links | 2 |
| breadcrumb | 1 |
| footer-anchor | 1 |
| hero | 1 |
| noscript | 1 |
| runtime-partials | 1 |
| section | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Что клиент понимает ещё до начала работ | pricing | 13.0 KB | 425 | no | src/pages/stiralnye-mashiny/sections/035-pricing-chto-klient-ponimaet-esche-do-nachala-rabot.html |
| Опишите проблему и получите понятный сценарий ремонта | lead-form | 8.6 KB | 155 | no | src/pages/stiralnye-mashiny/sections/033-lead-form-opishite-problemu-i-poluchite-ponyatnyy-sc.html |
| Свежие выезды, чтобы сразу понимать сценарий ремонта | contact-cta | 6.4 KB | 159 | no | src/pages/stiralnye-mashiny/sections/020-contact-cta-svezhie-vyezdy-chtoby-srazu-ponimat-scen.html |
| Какие проблемы стиральной машины мы закрываем за 1 визит | pricing | 5.7 KB | 124 | no | src/pages/stiralnye-mashiny/sections/011-pricing-kakie-problemy-stiral-noy-mashiny-my-zakryva.html |
| Стиральная машина не сливает, течёт или шумит? Вернём стирку без лишних замен | hero | 5.3 KB | 89 | no | src/pages/stiralnye-mashiny/sections/005-hero-stiral-naya-mashina-ne-slivaet-techet-ili-shumi.html |
| Сколько обычно стоит ремонт стиральной машины | pricing | 5.2 KB | 135 | no | src/pages/stiralnye-mashiny/sections/023-pricing-skol-ko-obychno-stoit-remont-stiral-noy-mash.html |
| Когда стиральную машину уже нельзя откладывать | pricing | 5.0 KB | 53 | no | src/pages/stiralnye-mashiny/sections/010-pricing-kogda-stiral-nuyu-mashinu-uzhe-nel-zya-otkla.html |
| Не откладывайте заявку, если стиралка уже встала | mobile-contact | 4.9 KB | 107 | no | src/pages/stiralnye-mashiny/sections/032-mobile-contact-ne-otkladyvayte-zayavku-esli-stiralka.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/household-branch.json
- data/household-page-policy.json
- data/household-services.json
- data/household-taxonomy.json
- data/household-proof-layer.json
- data/household-page-slots.json
- stiralnye-mashiny.html
- src/site-builder.json
- src/pages/stiralnye-mashiny/page.json
- src/pages/stiralnye-mashiny/sections/

## Checks

- npm run doctor:household-page -- --page stiralnye-mashiny.html
- npm run doctor:page -- --page stiralnye-mashiny.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page stiralnye-mashiny.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
