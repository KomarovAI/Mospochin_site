# Page Digest — stiralnye-mashiny.html

- Branch: household
- Role: service
- Title: Ремонт стиральных машин в Москве на дому — MosPochin
- Description: Ремонт стиральных машин на дому в Москве. Диагностика, согласование стоимости до ремонта и честный бытовой сценарий без лишних замен.
- H1: Стиральная машина не сливает, течёт или шумит? Вернём стирку без лишних замен
- Canonical: https://mospochin.ru/stiralnye-mashiny.html
- Builder model: src/pages/stiralnye-mashiny/page.json
- Sections: 48 (40 local, 2 shared refs, 3 raw)
- Text words inside referenced sections: 2948

## Component mix

| Component | Count |
| --- | --- |
| pricing | 10 |
| mobile-contact | 9 |
| proof | 8 |
| layout-fragment | 6 |
| faq | 4 |
| raw | 3 |
| lead-form | 2 |
| related-links | 2 |
| body-preamble | 1 |
| breadcrumb | 1 |
| contact-cta | 1 |
| hero | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Что клиент понимает ещё до начала работ | pricing | 11.6 KB | 430 | no | src/pages/stiralnye-mashiny/sections/034-pricing-chto-klient-ponimaet-esche-do-nachala-rabot.html |
| Опишите проблему и получите понятный сценарий ремонта | lead-form | 8.6 KB | 157 | no | src/pages/stiralnye-mashiny/sections/032-lead-form-opishite-problemu-i-poluchite-ponyatnyy-sc.html |
| Мобильные контактные элементы | mobile-contact | 7.2 KB | 78 | no | src/pages/stiralnye-mashiny/sections/002-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Какие проблемы стиральной машины мы закрываем после диагностики | pricing | 6.0 KB | 131 | no | src/pages/stiralnye-mashiny/sections/010-pricing-kakie-problemy-stiral-noy-mashiny-my-zakryva.html |
| Стиральная машина не сливает, течёт или шумит? Вернём стирку без лишних замен | hero | 5.4 KB | 90 | no | src/pages/stiralnye-mashiny/sections/004-hero-stiral-naya-mashina-ne-slivaet-techet-ili-shumi.html |
| Когда стиральную машину уже нельзя откладывать | pricing | 5.2 KB | 53 | no | src/pages/stiralnye-mashiny/sections/009-pricing-kogda-stiral-nuyu-mashinu-uzhe-nel-zya-otkla.html |
| Не откладывайте заявку, если стиралка уже встала | mobile-contact | 4.9 KB | 107 | no | src/pages/stiralnye-mashiny/sections/031-mobile-contact-ne-otkladyvayte-zayavku-esli-stiralka.html |
| Что говорят после ремонта стиральной машины | proof | 4.7 KB | 141 | no | src/pages/stiralnye-mashiny/sections/024-proof-chto-govoryat-posle-remonta-stiral-noy-mashiny.html |


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
