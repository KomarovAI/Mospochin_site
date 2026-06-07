# Page Digest — parokonvektomaty.html

- Branch: restaurant
- Role: service
- Title: Ремонт пароконвектоматов для ресторанов в Москве | MosPochin
- Description: Ремонт и обслуживание пароконвектоматов для ресторанов, кафе и пекарен. Выезд инженера, смета до работ, договор и безнал.
- H1: Ремонт пароконвектоматов для ресторанов
- Canonical: https://mospochin.ru/parokonvektomaty.html
- Builder model: src/pages/parokonvektomaty/page.json
- Sections: 72 (29 local, 15 shared refs, 5 raw)
- Text words inside referenced sections: 3113

## Component mix

| Component | Count |
| --- | --- |
| layout-fragment | 22 |
| pricing | 12 |
| proof | 9 |
| raw | 5 |
| related-links | 5 |
| section | 5 |
| mobile-contact | 3 |
| breadcrumb | 2 |
| contact-cta | 2 |
| faq | 2 |
| footer-anchor | 1 |
| hero | 1 |
| lead-form | 1 |
| noscript | 1 |
| runtime-partials | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Ремонтируем все марки пароконвектоматов | pricing | 20.6 KB | 219 | no | src/pages/parokonvektomaty/sections/040-pricing-remontiruem-vse-marki-parokonvektomatov.html |
| Ремонт пароконвектоматов для ресторанов | hero | 13.8 KB | 133 | no | src/pages/parokonvektomaty/sections/007-hero-remont-parokonvektomatov-dlya-restoranov.html |
| Связанные страницы по пароконвектоматам | related-links | 11.8 KB | 237 | no | src/pages/parokonvektomaty/sections/061-related-links-svyazannye-stranicy-po-parokonvektomat.html |
| Частые поломки пароконвектоматов | pricing | 11.2 KB | 205 | no | src/pages/parokonvektomaty/sections/026-pricing-chastye-polomki-parokonvektomatov.html |
| Последние ремонты пароконвектоматов | pricing | 8.9 KB | 124 | yes | src/components/shared/pricing/pricing-poslednie-remonty-parokonvektomatov--e1cca13f78f777a0.html |
| Ремонтируем все типы пароконвектоматов | pricing | 7.4 KB | 133 | no | src/pages/parokonvektomaty/sections/014-pricing-remontiruem-vse-tipy-parokonvektomatov.html |
| Получите понятный сценарий ремонта пароконвектомата | lead-form | 7.1 KB | 101 | no | src/pages/parokonvektomaty/sections/053-lead-form-poluchite-ponyatnyy-scenariy-remonta-parok.html |
| Что фиксируем до начала работ на объекте | pricing | 6.7 KB | 179 | yes | src/components/shared/pricing/pricing-chto-fiksiruem-do-nachala-rabot-na-obekte--34bee320032c85f0.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- data/restaurant-services.json
- data/restaurant-taxonomy.json
- data/restaurant-proof-layer.json
- data/restaurant-page-slots.json
- parokonvektomaty.html
- src/site-builder.json
- src/pages/parokonvektomaty/page.json
- src/pages/parokonvektomaty/sections/

## Checks

- npm run doctor:restaurant-page -- --page parokonvektomaty.html
- npm run doctor:page -- --page parokonvektomaty.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page parokonvektomaty.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
