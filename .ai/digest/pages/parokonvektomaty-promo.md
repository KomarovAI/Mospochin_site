# Page Digest — parokonvektomaty-promo.html

- Branch: restaurant
- Role: branch
- Title: Ошибка пароконвектомата — выезд инженера Rational, Unox, Abat | MosPochin
- Description: Ошибка, нет пара или нагрева у пароконвектомата Rational, Unox, Abat. Фото кода в WhatsApp, выезд инженера, договор и безнал.
- H1: Ошибка Rational / Unox / Abat
- Canonical: https://mospochin.ru/parokonvektomaty-promo.html
- Builder model: src/pages/parokonvektomaty-promo/page.json
- Sections: 67 (20 local, 15 shared refs, 2 raw)
- Text words inside referenced sections: 2562

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
| contact-cta | 2 |
| faq | 2 |
| raw | 2 |
| body-preamble | 1 |
| hero | 1 |
| lead-form | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Что важно по ошибке пароконвектомата | related-links | 14.8 KB | 412 | no | src/pages/parokonvektomaty-promo/sections/009-related-links-chto-vazhno-po-oshibke-parokonvektomat.html |
| Ошибка Rational / Unox / Abat | hero | 9.2 KB | 95 | no | src/pages/parokonvektomaty-promo/sections/006-hero-oshibka-rational-unox-abat.html |
| Мобильные контактные элементы | mobile-contact | 9.0 KB | 110 | no | src/pages/parokonvektomaty-promo/sections/002-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Частые поломки пароконвектоматов | section | 8.5 KB | 202 | yes | src/components/shared/section/section-chastye-polomki-parokonvektomatov--16d8721c09cebb16.html |
| Получите понятный сценарий ремонта пароконвектомата | lead-form | 6.5 KB | 102 | no | src/components/parametric/lead-form/restaurant-parokonvektomat-b2b-14c3fd8c1b20.template.html |
| Частые вопросы о ремонте пароконвектоматов | faq | 6.4 KB | 233 | no | src/pages/parokonvektomaty-promo/sections/046-faq-chastye-voprosy-o-remonte-parokonvektomatov.html |
| Что фиксируем до начала работ на объекте | pricing | 6.0 KB | 179 | yes | src/components/shared/pricing/pricing-chto-fiksiruem-do-nachala-rabot-na-obekte--179e76b534feb278.html |
| Ремонтируем все типы пароконвектоматов | section | 5.9 KB | 125 | yes | src/components/shared/section/section-remontiruem-vse-tipy-parokonvektomatov--5ce5c0ec71cc04c7.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- parokonvektomaty-promo.html
- src/site-builder.json
- src/pages/parokonvektomaty-promo/page.json
- src/pages/parokonvektomaty-promo/sections/

## Checks

- npm run doctor:page -- --page parokonvektomaty-promo.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page parokonvektomaty-promo.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
