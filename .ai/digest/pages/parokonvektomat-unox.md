# Page Digest — parokonvektomat-unox.html

- Branch: restaurant
- Role: branch
- Title: Ремонт пароконвектоматов Unox в Москве — диагностика и выезд | MosPochin
- Description: Ремонт пароконвектоматов Unox для ресторанов, кафе и пекарен: ошибки AF01, AF02, AF08, нет пара, не греет, выезд инженера.
- H1: Ремонт пароконвектоматов Unox
- Canonical: https://mospochin.ru/parokonvektomat-unox.html
- Builder model: src/pages/parokonvektomat-unox/page.json
- Sections: 75 (12 local, 21 shared refs, 2 raw)
- Text words inside referenced sections: 2688

## Component mix

| Component | Count |
| --- | --- |
| layout-fragment | 35 |
| pricing | 10 |
| proof | 9 |
| mobile-contact | 3 |
| related-links | 3 |
| breadcrumb | 2 |
| contact-cta | 2 |
| faq | 2 |
| raw | 2 |
| section | 2 |
| footer-anchor | 1 |
| hero | 1 |
| lead-form | 1 |
| noscript | 1 |
| runtime-partials | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Что проверяем у пароконвектомата Unox | section | 15.6 KB | 467 | no | src/pages/parokonvektomat-unox/sections/010-section-chto-proveryaem-u-parokonvektomata-unox.html |
| Ремонт пароконвектоматов Unox | hero | 12.9 KB | 127 | no | src/pages/parokonvektomat-unox/sections/007-hero-remont-parokonvektomatov-unox.html |
| Частые поломки пароконвектоматов | pricing | 10.6 KB | 197 | yes | src/components/shared/pricing/pricing-chastye-polomki-parokonvektomatov--49df61a84592b2cf.html |
| Последние ремонты пароконвектоматов | pricing | 8.9 KB | 124 | yes | src/components/shared/pricing/pricing-poslednie-remonty-parokonvektomatov--e1cca13f78f777a0.html |
| Ремонтируем все типы пароконвектоматов | pricing | 7.4 KB | 134 | yes | src/components/shared/pricing/pricing-remontiruem-vse-tipy-parokonvektomatov--716e30e482bc8a8d.html |
| Получите понятный сценарий ремонта пароконвектомата | lead-form | 7.2 KB | 109 | no | src/components/parametric/lead-form/restaurant-parokonvektomat-b2b.template.html |
| Что фиксируем до начала работ на объекте | pricing | 6.7 KB | 179 | yes | src/components/shared/pricing/pricing-chto-fiksiruem-do-nachala-rabot-na-obekte--34bee320032c85f0.html |
| Частые вопросы о ремонте пароконвектоматов | faq | 6.6 KB | 227 | yes | src/components/shared/faq/faq-chastye-voprosy-o-remonte-parokonvektomatov--ae5ce7618bf4987d.html |


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
