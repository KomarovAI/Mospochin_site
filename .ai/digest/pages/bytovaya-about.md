# Page Digest — bytovaya-about.html

- Branch: household
- Role: branch
- Title: О MosPochin — ремонт бытовой техники в Москве
- Description: MosPochin ремонтирует бытовую технику на дому в Москве: находим причину поломки, согласуем цену до работ и даём гарантию.
- H1: Помогаем спокойно решить поломку бытовой техники дома.
- Canonical: https://mospochin.ru/bytovaya-about.html
- Builder model: src/pages/bytovaya-about/page.json
- Sections: 47 (42 local, 0 shared refs, 16 raw)
- Text words inside referenced sections: 1363

## Component mix

| Component | Count |
| --- | --- |
| raw | 16 |
| proof | 7 |
| mobile-contact | 5 |
| layout-fragment | 4 |
| section | 4 |
| pricing | 3 |
| breadcrumb | 2 |
| faq | 2 |
| body-preamble | 1 |
| hero | 1 |
| lead-form | 1 |
| noscript | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Мобильные контактные элементы | mobile-contact | 7.2 KB | 78 | no | src/pages/bytovaya-about/sections/002-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Помогаем спокойно решить поломку бытовой техники дома. | hero | 6.6 KB | 113 | no | src/pages/bytovaya-about/sections/006-hero-pomogaem-spokoyno-reshit-polomku-bytovoy-tehnik.html |
| Ремонтируем любую бытовую технику на дому | proof | 5.3 KB | 37 | no | src/pages/bytovaya-about/sections/014-proof-remontiruem-lyubuyu-bytovuyu-tehniku-na-domu.html |
| 6 причин доверить нам свою технику | proof | 4.3 KB | 91 | no | src/pages/bytovaya-about/sections/020-proof-6-prichin-doverit-nam-svoyu-tehniku.html |
| Мобильные контактные элементы | mobile-contact | 4.3 KB | 61 | no | src/pages/bytovaya-about/sections/042-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Частые вопросы | faq | 4.2 KB | 118 | no | src/pages/bytovaya-about/sections/034-faq-chastye-voprosy.html |
| Работаем с распространёнными марками бытовой техники | section | 3.8 KB | 54 | no | src/pages/bytovaya-about/sections/022-section-rabotaem-s-rasprostranennymi-markami-bytovoy.html |
| Оставьте заявку на ремонт | lead-form | 3.6 KB | 41 | no | src/pages/bytovaya-about/sections/038-lead-form-ostav-te-zayavku-na-remont.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/household-branch.json
- data/household-page-policy.json
- data/household-page-slots.json
- bytovaya-about.html
- src/site-builder.json
- src/pages/bytovaya-about/page.json
- src/pages/bytovaya-about/sections/

## Checks

- npm run doctor:page -- --page bytovaya-about.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page bytovaya-about.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
