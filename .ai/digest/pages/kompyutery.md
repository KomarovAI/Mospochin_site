# Page Digest — kompyutery.html

- Branch: household
- Role: service
- Title: Ремонт компьютеров и ноутбуков в Москве на дому — MosPochin
- Description: Ремонт компьютеров и ноутбуков на дому в Москве. Диагностика, согласование работ, аккуратная настройка и восстановление техники с гарантией.
- H1: Компьютер или ноутбук тормозит, шумит или не включается? Вернём в работу без лишних замен
- Canonical: https://mospochin.ru/kompyutery.html
- Builder model: src/pages/kompyutery/page.json
- Sections: 53 (40 local, 6 shared refs, 13 raw)
- Text words inside referenced sections: 2318

## Component mix

| Component | Count |
| --- | --- |
| raw | 13 |
| pricing | 12 |
| mobile-contact | 7 |
| proof | 6 |
| layout-fragment | 4 |
| faq | 3 |
| contact-cta | 2 |
| section | 2 |
| body-preamble | 1 |
| breadcrumb | 1 |
| hero | 1 |
| lead-form | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Работаем с распространёнными марками компьютеров и ноутбуков | pricing | 17.4 KB | 113 | no | src/pages/kompyutery/sections/031-pricing-rabotaem-s-rasprostranennymi-markami-komp-yu.html |
| Ремонтируем ноутбуки и стационарные ПК | pricing | 8.1 KB | 216 | no | src/pages/kompyutery/sections/007-pricing-remontiruem-noutbuki-i-stacionarnye-pk.html |
| Мобильные контактные элементы | mobile-contact | 7.1 KB | 78 | no | src/pages/kompyutery/sections/002-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Частые вопросы | faq | 6.7 KB | 248 | no | src/pages/kompyutery/sections/040-faq-chastye-voprosy.html |
| Частые поломки компьютеров и ноутбуков | section | 6.1 KB | 124 | no | src/pages/kompyutery/sections/018-section-chastye-polomki-komp-yuterov-i-noutbukov.html |
| Что случилось с компьютером? | pricing | 5.0 KB | 45 | no | src/pages/kompyutery/sections/014-pricing-chto-sluchilos-s-komp-yuterom.html |
| Мобильные контактные элементы | mobile-contact | 4.2 KB | 61 | no | src/pages/kompyutery/sections/050-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Типовые сценарии по компьютерам и ноутбукам | faq | 4.2 KB | 197 | no | src/pages/kompyutery/sections/025-faq-tipovye-scenarii-po-komp-yuteram-i-noutbukam.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/household-branch.json
- data/household-page-policy.json
- data/household-services.json
- data/household-taxonomy.json
- data/household-proof-layer.json
- kompyutery.html
- src/site-builder.json
- src/pages/kompyutery/page.json
- src/pages/kompyutery/sections/

## Checks

- npm run doctor:household-page -- --page kompyutery.html
- npm run doctor:page -- --page kompyutery.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page kompyutery.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
