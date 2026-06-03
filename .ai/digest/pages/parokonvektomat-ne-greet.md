# Page Digest — parokonvektomat-ne-greet.html

- Branch: restaurant
- Role: branch
- Title: Пароконвектомат не греет — выезд инженера в Москве | MosPochin
- Description: Пароконвектомат не греет или не набирает температуру: проверка ТЭНов, датчиков, SSR-реле, платы и питания. Выезд инженера для ресторанов.
- H1: Пароконвектомат не греет
- Canonical: https://mospochin.ru/parokonvektomat-ne-greet.html
- Builder model: src/pages/parokonvektomat-ne-greet/page.json
- Sections: 74 (12 local, 21 shared refs, 2 raw)
- Text words inside referenced sections: 2243

## Component mix

| Component | Count |
| --- | --- |
| layout-fragment | 34 |
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
| Пароконвектомат не греет | hero | 11.1 KB | 93 | no | src/pages/parokonvektomat-ne-greet/sections/007-hero-parokonvektomat-ne-greet.html |
| Частые поломки пароконвектоматов | pricing | 10.6 KB | 197 | yes | src/components/shared/pricing/pricing-chastye-polomki-parokonvektomatov--49df61a84592b2cf.html |
| Последние ремонты пароконвектоматов | pricing | 8.9 KB | 124 | yes | src/components/shared/pricing/pricing-poslednie-remonty-parokonvektomatov--e1cca13f78f777a0.html |
| Ремонтируем все типы пароконвектоматов | pricing | 7.4 KB | 134 | yes | src/components/shared/pricing/pricing-remontiruem-vse-tipy-parokonvektomatov--716e30e482bc8a8d.html |
| Получите понятный сценарий ремонта пароконвектомата | lead-form | 7.2 KB | 104 | no | src/components/parametric/lead-form/restaurant-parokonvektomat-b2b.template.html |
| Частые вопросы о ремонте пароконвектоматов | faq | 6.7 KB | 242 | yes | src/components/shared/faq/faq-chastye-voprosy-o-remonte-parokonvektomatov--8a089715e4395424.html |
| Что фиксируем до начала работ на объекте | pricing | 6.7 KB | 179 | yes | src/components/shared/pricing/pricing-chto-fiksiruem-do-nachala-rabot-na-obekte--34bee320032c85f0.html |
| Цены на ремонт пароконвектоматов | pricing | 6.1 KB | 163 | yes | src/components/shared/pricing/pricing-ceny-na-remont-parokonvektomatov--d39ef7445dadc813.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- parokonvektomat-ne-greet.html
- src/site-builder.json
- src/pages/parokonvektomat-ne-greet/page.json
- src/pages/parokonvektomat-ne-greet/sections/

## Checks

- npm run doctor:page -- --page parokonvektomat-ne-greet.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page parokonvektomat-ne-greet.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
