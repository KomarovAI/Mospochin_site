# Page Digest — posudomoyki.html

- Branch: household
- Role: service
- Title: Ремонт посудомоечных машин в Москве — MosPochin
- Description: Ремонт посудомоечных машин на дому в Москве. Диагностика, согласование стоимости до ремонта и аккуратное восстановление без лишних замен.
- H1: Посудомойка не сливает, не моет или течёт? Вернём мойку без лишних замен
- Canonical: https://mospochin.ru/posudomoyki.html
- Builder model: src/pages/posudomoyki/page.json
- Sections: 51 (37 local, 5 shared refs, 0 raw)
- Text words inside referenced sections: 2830

## Component mix

| Component | Count |
| --- | --- |
| pricing | 13 |
| layout-fragment | 9 |
| mobile-contact | 7 |
| proof | 7 |
| contact-cta | 3 |
| faq | 3 |
| section | 3 |
| related-links | 2 |
| body-preamble | 1 |
| breadcrumb | 1 |
| hero | 1 |
| lead-form | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Работаем с распространёнными марками посудомоечных машин | pricing | 18.3 KB | 112 | no | src/pages/posudomoyki/sections/028-pricing-rabotaem-s-rasprostranennymi-markami-posudom.html |
| Что клиент понимает ещё до начала работ | pricing | 11.5 KB | 430 | no | src/pages/posudomoyki/sections/039-pricing-chto-klient-ponimaet-esche-do-nachala-rabot.html |
| Оставьте заявку на ремонт посудомойки | lead-form | 7.6 KB | 140 | no | src/pages/posudomoyki/sections/037-lead-form-ostav-te-zayavku-na-remont-posudomoyki.html |
| Мобильные контактные элементы | mobile-contact | 7.2 KB | 78 | no | src/pages/posudomoyki/sections/002-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Какие поломки посудомойки мы чаще всего чиним на дому | section | 5.8 KB | 99 | no | src/pages/posudomoyki/sections/022-section-kakie-polomki-posudomoyki-my-chasche-vsego-c.html |
| Когда посудомойку уже нельзя откладывать | pricing | 5.0 KB | 50 | no | src/pages/posudomoyki/sections/019-pricing-kogda-posudomoyku-uzhe-nel-zya-otkladyvat.html |
| Посудомойка не сливает, не моет или течёт? Вернём мойку без лишних замен | hero | 4.4 KB | 74 | no | src/pages/posudomoyki/sections/004-hero-posudomoyka-ne-slivaet-ne-moet-ili-techet-verne.html |
| Какие проблемы посудомойки мы закрываем после диагностики | pricing | 4.3 KB | 92 | no | src/pages/posudomoyki/sections/009-pricing-kakie-problemy-posudomoyki-my-zakryvaem-posl.html |


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
