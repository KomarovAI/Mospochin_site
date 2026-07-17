# Page Digest — microwaves.html

- Branch: household
- Role: service
- Title: Ремонт встроенных микроволновок — MosPochin
- Description: Ремонт встраиваемых СВЧ Neff, Miele, Bosch, Siemens, Smeg и Gaggenau в Москве. Смета до работ и гарантия на ремонт.
- H1: Ремонт встроенных СВЧ Neff, Miele и Bosch
- Canonical: https://mospochin.ru/microwaves.html
- Builder model: src/pages/microwaves/page.json
- Sections: 8 (7 local, 0 shared refs, 1 raw)
- Text words inside referenced sections: 1458

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 5 |
| layout-fragment | 1 |
| lead-form | 1 |
| raw | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Ремонт встроенных СВЧ Neff, Miele и Bosch | lead-form | 45.4 KB | 1319 | no | src/pages/microwaves/sections/003-lead-form-remont-vstroennyh-svch-neff-miele-i-bosch.html |
| Мобильные контактные элементы | mobile-contact | 7.2 KB | 78 | no | src/pages/microwaves/sections/001-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Мобильные контактные элементы | mobile-contact | 4.3 KB | 61 | no | src/pages/microwaves/sections/004-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Мобильные контактные элементы | mobile-contact | 599 B | 0 | no | src/pages/microwaves/sections/005-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| HTML-фрагмент | raw | 51 B | 0 | no | src/pages/microwaves/sections/002-raw-html-fragment.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/pages/microwaves/sections/006-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/pages/microwaves/sections/007-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| HTML-фрагмент | layout-fragment | 1 B | 0 | no | src/components/parametric/static/layout-fragment-technical-fragment-01ba4719c80b.template.html |


## Editable source files

- data/page-metadata.json
- data/contact-config.json
- data/runtime-config.json
- data/household-branch.json
- data/household-page-policy.json
- data/household-services.json
- data/household-taxonomy.json
- data/household-proof-layer.json
- data/household-page-slots.json
- microwaves.html
- src/site-builder.json
- src/pages/microwaves/page.json
- src/pages/microwaves/sections/

## Checks

- npm run doctor:household-page -- --page microwaves.html
- npm run doctor:page -- --page microwaves.html
- npm run validate:site
- npm run check:site-builder
- npm run ai:semantic-diff -- --page microwaves.html
- npm run ai:check

## AI notes

- Для правки уникального блока открывай конкретный `sections/*.html`.
- Для shared-блока сначала запускай `npm run ai:impact -- --files <componentRef>`, потому что он может затронуть несколько страниц.
- Если много raw-секций, не переписывай их вслепую: сначала пойми границы блока по соседним секциям.
