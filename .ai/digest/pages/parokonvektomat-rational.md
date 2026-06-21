# Page Digest — parokonvektomat-rational.html

- Branch: restaurant
- Role: branch
- Title: Ремонт пароконвектоматов Rational в Москве — выезд инженера | MosPochin
- Description: Ремонт пароконвектоматов Rational SCC и CMP для ресторанов и кафе: ошибки, нет пара, не греет, диагностика и выезд инженера.
- H1: Ремонт пароконвектоматов Rational — модель, ошибка, диагностика
- Canonical: https://mospochin.ru/parokonvektomat-rational.html
- Builder model: src/pages/parokonvektomat-rational/page.json
- Sections: 77 (19 local, 16 shared refs, 2 raw)
- Text words inside referenced sections: 2829

## Component mix

| Component | Count |
| --- | --- |
| layout-fragment | 35 |
| pricing | 10 |
| proof | 9 |
| related-links | 5 |
| mobile-contact | 3 |
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
| Что проверяем у пароконвектомата Rational | related-links | 16.8 KB | 475 | no | src/pages/parokonvektomat-rational/sections/010-related-links-chto-proveryaem-u-parokonvektomata-rat.html |
| Ремонт пароконвектоматов Rational | hero | 12.4 KB | 94 | no | src/pages/parokonvektomat-rational/sections/007-hero-remont-parokonvektomatov-rational.html |
| Частые поломки пароконвектоматов | pricing | 10.6 KB | 197 | yes | src/components/shared/pricing/pricing-chastye-polomki-parokonvektomatov--49df61a84592b2cf.html |
| Получите понятный сценарий ремонта пароконвектомата | lead-form | 9.1 KB | 109 | no | src/components/parametric/lead-form/restaurant-parokonvektomat-b2b.template.html |
| Последние ремонты пароконвектоматов | pricing | 8.9 KB | 124 | yes | src/components/shared/pricing/pricing-poslednie-remonty-parokonvektomatov--e1cca13f78f777a0.html |
| Ремонтируем все типы пароконвектоматов | pricing | 7.4 KB | 134 | yes | src/components/shared/pricing/pricing-remontiruem-vse-tipy-parokonvektomatov--716e30e482bc8a8d.html |
| Repair bridge: ошибка / симптом / бренд → диагностика → заявка | section | 7.0 KB | 111 | no | src/pages/parokonvektomat-rational/sections/008a-parokonvektomat-error-intent-bridge.html |
| Частые вопросы о ремонте пароконвектоматов | faq | 6.7 KB | 242 | yes | src/components/shared/faq/faq-chastye-voprosy-o-remonte-parokonvektomatov--8a089715e4395424.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- parokonvektomat-rational.html
- src/site-builder.json
- src/pages/parokonvektomat-rational/page.json
- src/pages/parokonvektomat-rational/sections/

## Checks

- npm run doctor:page -- --page parokonvektomat-rational.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page parokonvektomat-rational.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
