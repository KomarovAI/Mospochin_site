# Page Digest — parokonvektomat-ne-greet.html

- Branch: restaurant
- Role: branch
- Title: Пароконвектомат не греет — выезд инженера в Москве | MosPochin
- Description: Пароконвектомат не греет или не набирает температуру: проверка ТЭНов, датчиков, SSR-реле, платы и питания. Выезд инженера для ресторанов.
- H1: Пароконвектомат не греет
- Canonical: https://mospochin.ru/parokonvektomat-ne-greet.html
- Builder model: src/pages/parokonvektomat-ne-greet/page.json
- Sections: 68 (20 local, 16 shared refs, 2 raw)
- Text words inside referenced sections: 2551

## Component mix

| Component | Count |
| --- | --- |
| layout-fragment | 28 |
| pricing | 11 |
| proof | 8 |
| related-links | 4 |
| mobile-contact | 3 |
| breadcrumb | 2 |
| contact-cta | 2 |
| faq | 2 |
| raw | 2 |
| body-preamble | 1 |
| footer-anchor | 1 |
| hero | 1 |
| lead-form | 1 |
| runtime-partials | 1 |
| section | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Почему пароконвектомат не греет | related-links | 14.0 KB | 425 | no | src/pages/parokonvektomat-ne-greet/sections/009-related-links-pochemu-parokonvektomat-ne-greet.html |
| Пароконвектомат не греет | hero | 9.3 KB | 97 | no | src/pages/parokonvektomat-ne-greet/sections/006-hero-parokonvektomat-ne-greet.html |
| Частые поломки пароконвектоматов | pricing | 8.1 KB | 197 | yes | src/components/shared/pricing/pricing-chastye-polomki-parokonvektomatov--e1e987fb23638159.html |
| Частые вопросы о ремонте пароконвектоматов | faq | 6.7 KB | 247 | yes | src/components/shared/faq/faq-chastye-voprosy-o-remonte-parokonvektomatov--3ca79656ae34529a.html |
| Получите понятный сценарий ремонта пароконвектомата | lead-form | 6.5 KB | 103 | no | src/pages/parokonvektomat-ne-greet/sections/051-lead-form-poluchite-ponyatnyy-scenariy-remonta-parok.html |
| Последние ремонты пароконвектоматов | pricing | 6.2 KB | 124 | yes | src/components/shared/pricing/pricing-poslednie-remonty-parokonvektomatov--7f0901fe41d1f650.html |
| Что фиксируем до начала работ на объекте | pricing | 6.0 KB | 179 | yes | src/components/shared/pricing/pricing-chto-fiksiruem-do-nachala-rabot-na-obekte--179e76b534feb278.html |
| Ремонтируем все типы пароконвектоматов | pricing | 5.8 KB | 134 | yes | src/components/shared/pricing/pricing-remontiruem-vse-tipy-parokonvektomatov--08947d2913b4455f.html |


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
