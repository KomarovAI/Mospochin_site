# Page Digest — parokonvektomaty.html

- Branch: restaurant
- Role: service
- Title: Ремонт пароконвектоматов для ресторанов в Москве | MosPochin
- Description: Ремонт и обслуживание пароконвектоматов для ресторанов, кафе и пекарен. Выезд инженера, смета до работ, договор и безнал.
- H1: Ремонт пароконвектоматов для ресторанов
- Canonical: https://mospochin.ru/parokonvektomaty.html
- Builder model: src/pages/parokonvektomaty/page.json
- Sections: 78 (43 local, 10 shared refs, 9 raw)
- Text words inside referenced sections: 3289

## Component mix

| Component | Count |
| --- | --- |
| layout-fragment | 21 |
| pricing | 12 |
| proof | 9 |
| raw | 9 |
| section | 6 |
| related-links | 5 |
| mobile-contact | 4 |
| breadcrumb | 2 |
| contact-cta | 2 |
| faq | 2 |
| lead-form | 2 |
| body-preamble | 1 |
| footer-anchor | 1 |
| hero | 1 |
| runtime-partials | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Связанные страницы по пароконвектоматам | related-links | 12.8 KB | 237 | no | src/pages/parokonvektomaty/sections/064-related-links-svyazannye-stranicy-po-parokonvektomat.html |
| Ремонтируем все марки пароконвектоматов | pricing | 12.6 KB | 98 | no | src/pages/parokonvektomaty/sections/043-pricing-remontiruem-vse-marki-parokonvektomatov.html |
| Ремонт пароконвектоматов для ресторанов | hero | 9.7 KB | 115 | no | src/pages/parokonvektomaty/sections/006-hero-remont-parokonvektomatov-dlya-restoranov.html |
| Частые поломки пароконвектоматов | pricing | 8.8 KB | 205 | no | src/pages/parokonvektomaty/sections/029-pricing-chastye-polomki-parokonvektomatov.html |
| Ошибка на дисплее — повод не читать справочник, а быстро вернуть кухню в работу | lead-form | 8.7 KB | 171 | no | src/pages/parokonvektomaty/sections/010-lead-form-oshibka-na-displee-povod-ne-chitat-spravoc.html |
| Получите понятный сценарий ремонта пароконвектомата | lead-form | 7.6 KB | 116 | no | src/pages/parokonvektomaty/sections/056-lead-form-poluchite-ponyatnyy-scenariy-remonta-parok.html |
| Частые вопросы о ремонте пароконвектоматов | faq | 6.7 KB | 243 | no | src/pages/parokonvektomaty/sections/051-faq-chastye-voprosy-o-remonte-parokonvektomatov.html |
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
