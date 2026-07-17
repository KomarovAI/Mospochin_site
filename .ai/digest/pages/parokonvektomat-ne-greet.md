# Page Digest — parokonvektomat-ne-greet.html

- Branch: restaurant
- Role: branch
- Title: Пароконвектомат не греет — выезд инженера в Москве | MosPochin
- Description: Пароконвектомат не греет или не набирает температуру: проверка ТЭНов, датчиков, SSR-реле, платы и питания. Выезд инженера для ресторанов.
- H1: Пароконвектомат не греет
- Canonical: https://mospochin.ru/parokonvektomat-ne-greet.html
- Builder model: src/pages/parokonvektomat-ne-greet/page.json
- Sections: 65 (22 local, 15 shared refs, 1 raw)
- Text words inside referenced sections: 2564

## Component mix

| Component | Count |
| --- | --- |
| layout-fragment | 27 |
| pricing | 10 |
| proof | 7 |
| mobile-contact | 5 |
| related-links | 4 |
| section | 3 |
| breadcrumb | 2 |
| faq | 2 |
| body-preamble | 1 |
| contact-cta | 1 |
| hero | 1 |
| lead-form | 1 |
| raw | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Почему пароконвектомат не греет | related-links | 14.0 KB | 421 | no | src/pages/parokonvektomat-ne-greet/sections/009-related-links-pochemu-parokonvektomat-ne-greet.html |
| Мобильные контактные элементы | mobile-contact | 9.0 KB | 110 | no | src/pages/parokonvektomat-ne-greet/sections/002-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Пароконвектомат не греет | hero | 8.9 KB | 117 | no | src/pages/parokonvektomat-ne-greet/sections/006-hero-parokonvektomat-ne-greet.html |
| Частые поломки пароконвектоматов | section | 8.5 KB | 202 | yes | src/components/shared/section/section-chastye-polomki-parokonvektomatov--16d8721c09cebb16.html |
| Получите понятный сценарий ремонта пароконвектомата | lead-form | 6.8 KB | 108 | no | src/pages/parokonvektomat-ne-greet/sections/050-lead-form-poluchite-ponyatnyy-scenariy-remonta-parok.html |
| Частые вопросы о ремонте пароконвектоматов | faq | 6.6 KB | 240 | yes | src/components/shared/faq/faq-chastye-voprosy-o-remonte-parokonvektomatov--d15f88b47a30bdfb.html |
| Что фиксируем до начала работ на объекте | pricing | 6.0 KB | 179 | yes | src/components/shared/pricing/pricing-chto-fiksiruem-do-nachala-rabot-na-obekte--179e76b534feb278.html |
| Ремонтируем все типы пароконвектоматов | section | 5.9 KB | 125 | yes | src/components/shared/section/section-remontiruem-vse-tipy-parokonvektomatov--5ce5c0ec71cc04c7.html |


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
