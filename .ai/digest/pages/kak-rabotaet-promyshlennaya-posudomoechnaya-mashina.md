# Page Digest — kak-rabotaet-promyshlennaya-posudomoechnaya-mashina.html

- Branch: restaurant
- Role: branch
- Title: Как работает промышленная посудомоечная машина | MosPochin
- Description: Как устроена промышленная посудомоечная машина: наполнение, нагрев, циркуляционная мойка, ополаскивание, дозирование и слив.
- H1: Устройство и цикл промышленной посудомоечной машины
- Canonical: https://mospochin.ru/kak-rabotaet-promyshlennaya-posudomoechnaya-mashina.html
- Builder model: src/pages/kak-rabotaet-promyshlennaya-posudomoechnaya-mashina/page.json
- Sections: 6 (4 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 969

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 4 |
| breadcrumb | 1 |
| faq | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Устройство и цикл промышленной посудомоечной машины | breadcrumb | 38.3 KB | 711 | no | src/pages/kak-rabotaet-promyshlennaya-posudomoechnaya-mashina/sections/002-breadcrumb-ustroystvo-i-cikl-promyshlennoy-posudomoe.html |
| Мобильные контактные элементы | mobile-contact | 9.3 KB | 110 | no | src/pages/kak-rabotaet-promyshlennaya-posudomoechnaya-mashina/sections/001-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Мобильные контактные элементы | mobile-contact | 4.9 KB | 77 | no | src/pages/kak-rabotaet-promyshlennaya-posudomoechnaya-mashina/sections/004-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Частые вопросы | faq | 1.9 KB | 71 | no | src/pages/kak-rabotaet-promyshlennaya-posudomoechnaya-mashina/sections/003-faq-chastye-voprosy.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- kak-rabotaet-promyshlennaya-posudomoechnaya-mashina.html
- src/site-builder.json
- src/pages/kak-rabotaet-promyshlennaya-posudomoechnaya-mashina/page.json
- src/pages/kak-rabotaet-promyshlennaya-posudomoechnaya-mashina/sections/

## Checks

- npm run doctor:page -- --page kak-rabotaet-promyshlennaya-posudomoechnaya-mashina.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page kak-rabotaet-promyshlennaya-posudomoechnaya-mashina.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
