# Page Digest — parokonvektomat-lainox.html

- Branch: neutral
- Role: neutral
- Title: Ремонт пароконвектоматов Lainox — Naboo, Krea, Junior | MosPochin
- Description: Ремонт пароконвектоматов Lainox Naboo, Krea, Junior: ошибки, не греет, нет пара. Премиум-сервис по Москве. Договор, безнал, гарантия по договору
- H1: Ремонт пароконвектоматов Lainox
- Canonical: https://mospochin.ru/parokonvektomat-lainox.html
- Builder model: src/pages/parokonvektomat-lainox/page.json
- Sections: 64 (20 local, 7 shared refs, 2 raw)
- Text words inside referenced sections: 1517

## Component mix

| Component | Count |
| --- | --- |
| layout-fragment | 32 |
| proof | 6 |
| mobile-contact | 5 |
| pricing | 4 |
| section | 4 |
| related-links | 3 |
| breadcrumb | 2 |
| faq | 2 |
| raw | 2 |
| body-preamble | 1 |
| contact-cta | 1 |
| hero | 1 |
| lead-form | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Связанные страницы по пароконвектоматам | related-links | 9.4 KB | 172 | no | src/pages/parokonvektomat-lainox/sections/065-related-links-svyazannye-stranicy-po-parokonvektomat.html |
| Мобильные контактные элементы | mobile-contact | 9.0 KB | 110 | no | src/pages/parokonvektomat-lainox/sections/002-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Ремонт пароконвектоматов Lainox | hero | 8.6 KB | 96 | no | src/pages/parokonvektomat-lainox/sections/006-hero-remont-parokonvektomatov-lainox.html |
| Получите понятный сценарий ремонта пароконвектомата | lead-form | 6.7 KB | 103 | no | src/components/parametric/lead-form/restaurant-parokonvektomat-b2b-3fc70c71db1d.template.html |
| Частые вопросы о ремонте пароконвектоматов | faq | 6.6 KB | 240 | yes | src/components/shared/faq/faq-chastye-voprosy-o-remonte-parokonvektomatov--2419627029e3672a.html |
| Мобильные контактные элементы | mobile-contact | 4.8 KB | 77 | no | src/pages/parokonvektomat-lainox/sections/069-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Выберите проблему — уточним сценарий | pricing | 4.7 KB | 43 | no | src/pages/parokonvektomat-lainox/sections/024-pricing-vyberite-problemu-utochnim-scenariy.html |
| Типовые поломки Lainox | section | 4.0 KB | 148 | no | src/pages/parokonvektomat-lainox/sections/060-section-tipovye-polomki-lainox.html |


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
