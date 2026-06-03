# Page Digest — kompyutery.html

- Branch: household
- Role: service
- Title: Ремонт компьютеров и ноутбуков в Москве на дому — MosPochin
- Description: Ремонт компьютеров и ноутбуков на дому в Москве. Диагностика, согласование работ, аккуратная настройка и восстановление техники с гарантией.
- H1: Компьютер или ноутбук тормозит, шумит или не включается? Вернём в работу без лишних замен
- Canonical: https://mospochin.ru/kompyutery.html
- Builder model: src/pages/kompyutery/page.json
- Sections: 55 (42 local, 4 shared refs, 15 raw)
- Text words inside referenced sections: 2260

## Component mix

| Component | Count |
| --- | --- |
| raw | 15 |
| pricing | 12 |
| proof | 6 |
| mobile-contact | 5 |
| layout-fragment | 4 |
| contact-cta | 3 |
| faq | 3 |
| breadcrumb | 1 |
| footer-anchor | 1 |
| hero | 1 |
| lead-form | 1 |
| noscript | 1 |
| runtime-partials | 1 |
| section | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Ремонтируем все марки компьютеров и ноутбуков | pricing | 17.9 KB | 108 | no | src/pages/kompyutery/sections/032-pricing-remontiruem-vse-marki-komp-yuterov-i-noutbuk.html |
| Ремонтируем ноутбуки и стационарные ПК | pricing | 9.9 KB | 216 | no | src/pages/kompyutery/sections/008-pricing-remontiruem-noutbuki-i-stacionarnye-pk.html |
| Реальные ремонты на этой неделе | contact-cta | 7.6 KB | 133 | no | src/pages/kompyutery/sections/017-contact-cta-real-nye-remonty-na-etoy-nedele.html |
| Частые вопросы | faq | 7.2 KB | 238 | no | src/pages/kompyutery/sections/041-faq-chastye-voprosy.html |
| Частые поломки компьютеров и ноутбуков | pricing | 6.2 KB | 125 | no | src/pages/kompyutery/sections/019-pricing-chastye-polomki-komp-yuterov-i-noutbukov.html |
| Цены на ремонт компьютеров и ноутбуков | pricing | 5.8 KB | 115 | no | src/pages/kompyutery/sections/021-pricing-ceny-na-remont-komp-yuterov-i-noutbukov.html |
| Что случилось с компьютером? | pricing | 5.2 KB | 45 | no | src/pages/kompyutery/sections/015-pricing-chto-sluchilos-s-komp-yuterom.html |
| Что говорят наши клиенты | pricing | 5.0 KB | 143 | no | src/pages/kompyutery/sections/025-pricing-chto-govoryat-nashi-klienty.html |


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
