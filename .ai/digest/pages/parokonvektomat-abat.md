# Page Digest — parokonvektomat-abat.html

- Branch: neutral
- Role: neutral
- Title: Ремонт пароконвектоматов Abat — ПКА, КПЭ | MosPochin
- Description: Ремонт пароконвектоматов Abat ПКА, КПЭ: ошибки E02, E07, E10, не греет, нет пара. Срочный выезд инженера по Москве. Договор, безнал, гарантия по договору
- H1: Ремонт пароконвектоматов Abat
- Canonical: https://mospochin.ru/parokonvektomat-abat.html
- Builder model: src/pages/parokonvektomat-abat/page.json
- Sections: 75 (27 local, 15 shared refs, 2 raw)
- Text words inside referenced sections: 2699

## Component mix

| Component | Count |
| --- | --- |
| layout-fragment | 32 |
| pricing | 9 |
| proof | 8 |
| section | 6 |
| mobile-contact | 5 |
| related-links | 4 |
| breadcrumb | 2 |
| contact-cta | 2 |
| faq | 2 |
| raw | 2 |
| body-preamble | 1 |
| hero | 1 |
| lead-form | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Связанные страницы по пароконвектоматам | related-links | 10.1 KB | 189 | no | src/pages/parokonvektomat-abat/sections/065-related-links-svyazannye-stranicy-po-parokonvektomat.html |
| Мобильные контактные элементы | mobile-contact | 9.0 KB | 110 | no | src/pages/parokonvektomat-abat/sections/002-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Ремонт пароконвектоматов Abat | hero | 8.6 KB | 98 | no | src/pages/parokonvektomat-abat/sections/006-hero-remont-parokonvektomatov-abat.html |
| Частые поломки пароконвектоматов | section | 8.6 KB | 202 | yes | src/components/shared/section/section-chastye-polomki-parokonvektomatov--92107a1adc63b709.html |
| Получите понятный сценарий ремонта пароконвектомата | lead-form | 6.7 KB | 103 | no | src/pages/parokonvektomat-abat/sections/056-lead-form-poluchite-ponyatnyy-scenariy-remonta-parok.html |
| Частые вопросы о ремонте пароконвектоматов | faq | 6.6 KB | 240 | yes | src/components/shared/faq/faq-chastye-voprosy-o-remonte-parokonvektomatov--2419627029e3672a.html |
| Что фиксируем до начала работ на объекте | proof | 6.3 KB | 197 | no | src/pages/parokonvektomat-abat/sections/058-proof-chto-fiksiruem-do-nachala-rabot-na-ob-ekte.html |
| Ремонтируем все типы пароконвектоматов | section | 6.0 KB | 125 | yes | src/components/shared/section/section-remontiruem-vse-tipy-parokonvektomatov--66391bf17107a40d.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- parokonvektomat-abat.html
- src/site-builder.json
- src/pages/parokonvektomat-abat/page.json
- src/pages/parokonvektomat-abat/sections/

## Checks

- npm run doctor:page -- --page parokonvektomat-abat.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page parokonvektomat-abat.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
