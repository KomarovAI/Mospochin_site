# Page Digest — parokonvektomat-unox.html

- Branch: restaurant
- Role: branch
- Title: Ремонт пароконвектоматов Unox в Москве — диагностика и выезд | MosPochin
- Description: Ремонт пароконвектоматов Unox для ресторанов, кафе и пекарен: ошибки AF01, AF02, AF08, нет пара, не греет, выезд инженера.
- H1: Ремонт пароконвектоматов Unox
- Canonical: https://mospochin.ru/parokonvektomat-unox.html
- Builder model: src/pages/parokonvektomat-unox/page.json
- Sections: 68 (20 local, 16 shared refs, 2 raw)
- Text words inside referenced sections: 2599

## Component mix

| Component | Count |
| --- | --- |
| layout-fragment | 28 |
| pricing | 11 |
| proof | 8 |
| mobile-contact | 3 |
| related-links | 3 |
| breadcrumb | 2 |
| contact-cta | 2 |
| faq | 2 |
| raw | 2 |
| section | 2 |
| body-preamble | 1 |
| footer-anchor | 1 |
| hero | 1 |
| lead-form | 1 |
| runtime-partials | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Что проверяем у пароконвектомата Unox | section | 14.8 KB | 471 | no | src/pages/parokonvektomat-unox/sections/009-section-chto-proveryaem-u-parokonvektomata-unox.html |
| Ремонт пароконвектоматов Unox | hero | 9.1 KB | 100 | no | src/pages/parokonvektomat-unox/sections/006-hero-remont-parokonvektomatov-unox.html |
| Частые поломки пароконвектоматов | pricing | 8.1 KB | 197 | yes | src/components/shared/pricing/pricing-chastye-polomki-parokonvektomatov--e1e987fb23638159.html |
| Частые вопросы о ремонте пароконвектоматов | faq | 6.7 KB | 247 | yes | src/components/shared/faq/faq-chastye-voprosy-o-remonte-parokonvektomatov--3ca79656ae34529a.html |
| Получите понятный сценарий ремонта пароконвектомата | lead-form | 6.5 KB | 102 | no | src/pages/parokonvektomat-unox/sections/051-lead-form-poluchite-ponyatnyy-scenariy-remonta-parok.html |
| Последние ремонты пароконвектоматов | pricing | 6.2 KB | 124 | yes | src/components/shared/pricing/pricing-poslednie-remonty-parokonvektomatov--7f0901fe41d1f650.html |
| Что фиксируем до начала работ на объекте | pricing | 6.0 KB | 179 | yes | src/components/shared/pricing/pricing-chto-fiksiruem-do-nachala-rabot-na-obekte--179e76b534feb278.html |
| Ремонтируем все типы пароконвектоматов | pricing | 5.8 KB | 134 | yes | src/components/shared/pricing/pricing-remontiruem-vse-tipy-parokonvektomatov--08947d2913b4455f.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- parokonvektomat-unox.html
- src/site-builder.json
- src/pages/parokonvektomat-unox/page.json
- src/pages/parokonvektomat-unox/sections/

## Checks

- npm run doctor:page -- --page parokonvektomat-unox.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page parokonvektomat-unox.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
