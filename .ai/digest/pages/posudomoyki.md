# Page Digest — posudomoyki.html

- Branch: household
- Role: service
- Title: Ремонт посудомоечных машин в Москве — MosPochin
- Description: Ремонт посудомоечных машин на дому в Москве. Диагностика, согласование стоимости до ремонта и аккуратное восстановление без лишних замен.
- H1: Посудомойка не сливает, не моет или течёт? Вернём мойку без лишних замен
- Canonical: https://mospochin.ru/posudomoyki.html
- Builder model: src/pages/posudomoyki/page.json
- Sections: 52 (37 local, 1 shared refs, 0 raw)
- Text words inside referenced sections: 2755

## Component mix

| Component | Count |
| --- | --- |
| pricing | 12 |
| layout-fragment | 10 |
| proof | 8 |
| mobile-contact | 5 |
| contact-cta | 4 |
| faq | 3 |
| related-links | 2 |
| section | 2 |
| body-preamble | 1 |
| breadcrumb | 1 |
| footer-anchor | 1 |
| hero | 1 |
| lead-form | 1 |
| runtime-partials | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Ремонтируем все марки посудомоечных машин | pricing | 18.7 KB | 107 | no | src/pages/posudomoyki/sections/028-pricing-remontiruem-vse-marki-posudomoechnyh-mashin.html |
| Что клиент понимает ещё до начала работ | pricing | 13.0 KB | 427 | no | src/pages/posudomoyki/sections/039-pricing-chto-klient-ponimaet-esche-do-nachala-rabot.html |
| Свежие кейсы по ремонту посудомоек | contact-cta | 8.4 KB | 110 | no | src/pages/posudomoyki/sections/021-contact-cta-svezhie-keysy-po-remontu-posudomoek.html |
| Оставьте заявку на ремонт посудомойки | lead-form | 8.3 KB | 140 | no | src/pages/posudomoyki/sections/037-lead-form-ostav-te-zayavku-na-remont-posudomoyki.html |
| Какие поломки посудомойки мы чаще всего чиним на дому | pricing | 5.9 KB | 99 | no | src/pages/posudomoyki/sections/022-pricing-kakie-polomki-posudomoyki-my-chasche-vsego-c.html |
| Когда посудомойку уже нельзя откладывать | pricing | 5.9 KB | 50 | no | src/pages/posudomoyki/sections/019-pricing-kogda-posudomoyku-uzhe-nel-zya-otkladyvat.html |
| Сколько обычно стоит ремонт посудомойки | pricing | 5.7 KB | 114 | no | src/pages/posudomoyki/sections/023-pricing-skol-ko-obychno-stoit-remont-posudomoyki.html |
| Какие проблемы посудомойки мы закрываем после диагностики | pricing | 5.2 KB | 88 | no | src/pages/posudomoyki/sections/009-pricing-kakie-problemy-posudomoyki-my-zakryvaem-posl.html |


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
- posudomoyki.html
- src/site-builder.json
- src/pages/posudomoyki/page.json
- src/pages/posudomoyki/sections/

## Checks

- npm run doctor:household-page -- --page posudomoyki.html
- npm run doctor:page -- --page posudomoyki.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page posudomoyki.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
