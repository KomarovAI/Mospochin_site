# Page Digest — bytovaya-contact.html

- Branch: household
- Role: branch
- Title: Контакты MosPochin — сервисные точки в Москве и Балашихе
- Description: Контакты MosPochin по бытовой технике: 8 (999) 005-71-72, WhatsApp, Telegram и сервисные точки в Москве и Балашихе. Работаем без выходных.
- H1: Связаться по ремонту бытовой техники
- Canonical: https://mospochin.ru/bytovaya-contact.html
- Builder model: src/pages/bytovaya-contact/page.json
- Sections: 18 (11 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 1477

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 5 |
| contact-cta | 3 |
| layout-fragment | 2 |
| breadcrumb | 1 |
| faq | 1 |
| footer-anchor | 1 |
| hero | 1 |
| noscript | 1 |
| pricing | 1 |
| proof | 1 |
| runtime-partials | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Сервисные точки и карта | contact-cta | 18.3 KB | 302 | no | src/pages/bytovaya-contact/sections/007-contact-cta-servisnye-tochki-i-karta.html |
| Когда лучше звонить, а когда писать | mobile-contact | 13.0 KB | 263 | no | src/pages/bytovaya-contact/sections/009-mobile-contact-kogda-luchshe-zvonit-a-kogda-pisat.html |
| Связаться по ремонту бытовой техники | hero | 12.3 KB | 136 | no | src/pages/bytovaya-contact/sections/005-hero-svyazat-sya-po-remontu-bytovoy-tehniki.html |
| Куда писать и звонить по бытовой технике | mobile-contact | 9.8 KB | 146 | no | src/pages/bytovaya-contact/sections/006-mobile-contact-kuda-pisat-i-zvonit-po-bytovoy-tehnik.html |
| Что лучше отправить сразу | contact-cta | 7.4 KB | 172 | no | src/pages/bytovaya-contact/sections/011-contact-cta-chto-luchshe-otpravit-srazu.html |
| Что клиент понимает ещё до приезда мастера | proof | 4.7 KB | 154 | no | src/pages/bytovaya-contact/sections/008-proof-chto-klient-ponimaet-esche-do-priezda-mastera.html |
| Частые вопросы | faq | 4.7 KB | 152 | no | src/pages/bytovaya-contact/sections/012-faq-chastye-voprosy.html |
| Возражения, которые лучше снять ещё на странице контактов | pricing | 3.8 KB | 125 | no | src/pages/bytovaya-contact/sections/010-pricing-vozrazheniya-kotorye-luchshe-snyat-esche-na-.html |


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
