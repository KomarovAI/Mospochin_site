# Page Digest — parokonvektomat-ne-greet.html

- Branch: restaurant
- Role: branch
- Title: Пароконвектомат не греет — выезд инженера в Москве | MosPochin
- Description: Пароконвектомат не греет или не набирает температуру: проверка ТЭНов, датчиков, SSR-реле, платы и питания. Выезд инженера для ресторанов.
- H1: Пароконвектомат не греет
- Canonical: https://mospochin.ru/parokonvektomat-ne-greet.html
- Builder model: src/pages/parokonvektomat-ne-greet/page.json
- Sections: 54 (17 local, 5 shared refs, 1 raw)
- Text words inside referenced sections: 1439

## Component mix

| Component | Count |
| --- | --- |
| layout-fragment | 27 |
| proof | 6 |
| mobile-contact | 5 |
| pricing | 3 |
| related-links | 3 |
| breadcrumb | 2 |
| faq | 2 |
| body-preamble | 1 |
| contact-cta | 1 |
| hero | 1 |
| lead-form | 1 |
| raw | 1 |
| section | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Почему пароконвектомат не греет | related-links | 14.0 KB | 421 | no | src/pages/parokonvektomat-ne-greet/sections/009-related-links-pochemu-parokonvektomat-ne-greet.html |
| Мобильные контактные элементы | mobile-contact | 9.0 KB | 110 | no | src/pages/parokonvektomat-ne-greet/sections/002-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Пароконвектомат не греет | hero | 8.9 KB | 117 | no | src/pages/parokonvektomat-ne-greet/sections/006-hero-parokonvektomat-ne-greet.html |
| Получите понятный сценарий ремонта пароконвектомата | lead-form | 6.8 KB | 108 | no | src/components/parametric/lead-form/restaurant-parokonvektomat-b2b-647ff67890ef.template.html |
| Частые вопросы о ремонте пароконвектоматов | faq | 6.6 KB | 240 | yes | src/components/shared/faq/faq-chastye-voprosy-o-remonte-parokonvektomatov--d15f88b47a30bdfb.html |
| Мобильные контактные элементы | mobile-contact | 4.8 KB | 77 | no | src/pages/parokonvektomat-ne-greet/sections/060-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Выберите проблему — уточним сценарий | pricing | 4.7 KB | 43 | no | src/pages/parokonvektomat-ne-greet/sections/024-pricing-vyberite-problemu-utochnim-scenariy.html |
| Пароконвектомат встал? | contact-cta | 2.6 KB | 43 | no | src/pages/parokonvektomat-ne-greet/sections/049-contact-cta-parokonvektomat-vstal.html |


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
