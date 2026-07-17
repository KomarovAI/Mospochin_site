# Page Digest — bytovaya-contact.html

- Branch: household
- Role: branch
- Title: Контакты MosPochin — сервисные точки в Москве и Балашихе
- Description: Контакты MosPochin по бытовой технике: 8 (999) 005-71-72, WhatsApp, Telegram и сервисные точки в Москве и Балашихе. Работаем без выходных.
- H1: Связаться по ремонту бытовой техники
- Canonical: https://mospochin.ru/bytovaya-contact.html
- Builder model: src/pages/bytovaya-contact/page.json
- Sections: 16 (15 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 1628

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 7 |
| contact-cta | 3 |
| breadcrumb | 1 |
| faq | 1 |
| hero | 1 |
| layout-fragment | 1 |
| pricing | 1 |
| proof | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Сервисные точки и карта | contact-cta | 15.2 KB | 312 | no | src/pages/bytovaya-contact/sections/006-contact-cta-servisnye-tochki-i-karta.html |
| Когда лучше звонить, а когда писать | mobile-contact | 11.2 KB | 263 | no | src/pages/bytovaya-contact/sections/008-mobile-contact-kogda-luchshe-zvonit-a-kogda-pisat.html |
| Связаться по ремонту бытовой техники | hero | 10.2 KB | 138 | no | src/pages/bytovaya-contact/sections/004-hero-svyazat-sya-po-remontu-bytovoy-tehniki.html |
| Куда писать и звонить по бытовой технике | mobile-contact | 8.9 KB | 146 | no | src/pages/bytovaya-contact/sections/005-mobile-contact-kuda-pisat-i-zvonit-po-bytovoy-tehnik.html |
| Мобильные контактные элементы | mobile-contact | 7.2 KB | 78 | no | src/pages/bytovaya-contact/sections/002-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Что лучше отправить сразу | contact-cta | 6.1 KB | 172 | no | src/pages/bytovaya-contact/sections/010-contact-cta-chto-luchshe-otpravit-srazu.html |
| Мобильные контактные элементы | mobile-contact | 4.3 KB | 61 | no | src/pages/bytovaya-contact/sections/013-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Что клиент понимает ещё до приезда мастера | proof | 4.0 KB | 154 | no | src/pages/bytovaya-contact/sections/007-proof-chto-klient-ponimaet-esche-do-priezda-mastera.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/household-branch.json
- data/household-page-policy.json
- data/household-page-slots.json
- bytovaya-contact.html
- src/site-builder.json
- src/pages/bytovaya-contact/page.json
- src/pages/bytovaya-contact/sections/

## Checks

- npm run doctor:page -- --page bytovaya-contact.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page bytovaya-contact.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
