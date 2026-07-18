# Page Digest — dozatory-moyushchego-i-opolaskivatelya.html

- Branch: restaurant
- Role: branch
- Title: Дозаторы моющего средства и ополаскивателя | MosPochin
- Description: Дозаторы моющего средства и ополаскивателя в промышленных посудомоечных машинах: помпы, трубки, настройка дозы, подсос воздуха и диагностика подачи.
- H1: Дозирование химии в промышленных посудомоечных машинах
- Canonical: https://mospochin.ru/dozatory-moyushchego-i-opolaskivatelya.html
- Builder model: src/pages/dozatory-moyushchego-i-opolaskivatelya/page.json
- Sections: 6 (4 local, 0 shared refs, 0 raw)
- Text words inside referenced sections: 1002

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 4 |
| breadcrumb | 1 |
| faq | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Дозирование химии в промышленных посудомоечных машинах | breadcrumb | 37.4 KB | 756 | no | src/pages/dozatory-moyushchego-i-opolaskivatelya/sections/002-breadcrumb-dozirovanie-himii-v-promyshlennyh-posudom.html |
| Мобильные контактные элементы | mobile-contact | 9.2 KB | 110 | no | src/pages/dozatory-moyushchego-i-opolaskivatelya/sections/001-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Мобильные контактные элементы | mobile-contact | 4.9 KB | 77 | no | src/pages/dozatory-moyushchego-i-opolaskivatelya/sections/004-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Частые вопросы | faq | 1.7 KB | 59 | no | src/pages/dozatory-moyushchego-i-opolaskivatelya/sections/003-faq-chastye-voprosy.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/restaurant-branch.json
- data/restaurant-page-policy.json
- dozatory-moyushchego-i-opolaskivatelya.html
- src/site-builder.json
- src/pages/dozatory-moyushchego-i-opolaskivatelya/page.json
- src/pages/dozatory-moyushchego-i-opolaskivatelya/sections/

## Checks

- npm run doctor:page -- --page dozatory-moyushchego-i-opolaskivatelya.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page dozatory-moyushchego-i-opolaskivatelya.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
