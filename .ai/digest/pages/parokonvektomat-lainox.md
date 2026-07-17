# Page Digest — parokonvektomat-lainox.html

- Branch: neutral
- Role: neutral
- Title: Ремонт пароконвектоматов Lainox — Naboo, Krea, Junior | MosPochin
- Description: Ремонт пароконвектоматов Lainox Naboo, Krea, Junior: ошибки, не греет, нет пара. Премиум-сервис по Москве. Договор, безнал, гарантия по договору
- H1: Ремонт пароконвектоматов Lainox
- Canonical: https://mospochin.ru/parokonvektomat-lainox.html
- Builder model: src/pages/parokonvektomat-lainox/page.json
- Sections: 75 (26 local, 16 shared refs, 2 raw)
- Text words inside referenced sections: 2506

## Component mix

| Component | Count |
| --- | --- |
| layout-fragment | 32 |
| pricing | 10 |
| proof | 7 |
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
| Связанные страницы по пароконвектоматам | related-links | 9.4 KB | 172 | no | src/pages/parokonvektomat-lainox/sections/065-related-links-svyazannye-stranicy-po-parokonvektomat.html |
| Мобильные контактные элементы | mobile-contact | 9.0 KB | 110 | no | src/pages/parokonvektomat-lainox/sections/002-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Ремонт пароконвектоматов Lainox | hero | 8.6 KB | 96 | no | src/pages/parokonvektomat-lainox/sections/006-hero-remont-parokonvektomatov-lainox.html |
| Частые поломки пароконвектоматов | section | 8.6 KB | 202 | yes | src/components/shared/section/section-chastye-polomki-parokonvektomatov--92107a1adc63b709.html |
| Получите понятный сценарий ремонта пароконвектомата | lead-form | 6.7 KB | 103 | no | src/pages/parokonvektomat-lainox/sections/056-lead-form-poluchite-ponyatnyy-scenariy-remonta-parok.html |
| Частые вопросы о ремонте пароконвектоматов | faq | 6.6 KB | 240 | yes | src/components/shared/faq/faq-chastye-voprosy-o-remonte-parokonvektomatov--2419627029e3672a.html |
| Ремонтируем все типы пароконвектоматов | section | 6.0 KB | 125 | yes | src/components/shared/section/section-remontiruem-vse-tipy-parokonvektomatov--66391bf17107a40d.html |
| Мобильные контактные элементы | mobile-contact | 4.8 KB | 77 | no | src/pages/parokonvektomat-lainox/sections/069-mobile-contact-mobil-nye-kontaktnye-elementy.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- parokonvektomat-lainox.html
- src/site-builder.json
- src/pages/parokonvektomat-lainox/page.json
- src/pages/parokonvektomat-lainox/sections/

## Checks

- npm run doctor:page -- --page parokonvektomat-lainox.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page parokonvektomat-lainox.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
