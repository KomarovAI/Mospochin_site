# Page Digest — bytovaya-about.html

- Branch: household
- Role: branch
- Title: О MosPochin — ремонт бытовой техники в Москве
- Description: MosPochin ремонтирует бытовую технику на дому в Москве: находим причину поломки, согласуем цену до работ и даём гарантию.
- H1: Помогаем спокойно решить поломку бытовой техники дома.
- Canonical: https://mospochin.ru/bytovaya-about.html
- Builder model: src/pages/bytovaya-about/page.json
- Sections: 49 (37 local, 0 shared refs, 16 raw)
- Text words inside referenced sections: 1206

## Component mix

| Component | Count |
| --- | --- |
| raw | 16 |
| layout-fragment | 6 |
| pricing | 6 |
| proof | 4 |
| section | 4 |
| mobile-contact | 3 |
| breadcrumb | 2 |
| faq | 2 |
| noscript | 2 |
| footer-anchor | 1 |
| hero | 1 |
| lead-form | 1 |
| runtime-partials | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Помогаем спокойно решить поломку бытовой техники дома. | hero | 8.2 KB | 111 | no | src/pages/bytovaya-about/sections/007-hero-pomogaem-spokoyno-reshit-polomku-bytovoy-tehnik.html |
| Ремонтируем любую бытовую технику на дому | pricing | 5.2 KB | 37 | no | src/pages/bytovaya-about/sections/015-pricing-remontiruem-lyubuyu-bytovuyu-tehniku-na-domu.html |
| 6 причин доверить нам свою технику | proof | 4.9 KB | 91 | no | src/pages/bytovaya-about/sections/021-proof-6-prichin-doverit-nam-svoyu-tehniku.html |
| Как мы смотрим на домашний сервис | proof | 4.9 KB | 126 | no | src/pages/bytovaya-about/sections/011-proof-kak-my-smotrim-na-domashniy-servis.html |
| Ремонтируем все марки бытовой техники | section | 4.5 KB | 53 | no | src/pages/bytovaya-about/sections/023-section-remontiruem-vse-marki-bytovoy-tehniki.html |
| Частые вопросы | faq | 4.3 KB | 113 | no | src/pages/bytovaya-about/sections/035-faq-chastye-voprosy.html |
| С какими задачами к нам обращаются чаще всего | pricing | 3.8 KB | 133 | no | src/pages/bytovaya-about/sections/025-pricing-s-kakimi-zadachami-k-nam-obraschayutsya-chas.html |
| Условия домашнего ремонта без лишнего шума | pricing | 3.7 KB | 112 | no | src/pages/bytovaya-about/sections/019-pricing-usloviya-domashnego-remonta-bez-lishnego-shu.html |


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
