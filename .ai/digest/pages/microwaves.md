# Page Digest — microwaves.html

- Branch: household
- Role: service
- Title: Ремонт встроенных микроволновок — MosPochin
- Description: Ремонт встраиваемых СВЧ Neff, Miele, Bosch, Siemens, Smeg и Gaggenau в Москве. Смета до работ и гарантия на ремонт.
- H1: Ремонт встроенных СВЧ Neff, Miele и Bosch
- Canonical: https://mospochin.ru/microwaves.html
- Builder model: src/pages/microwaves/page.json
- Sections: 10 (5 local, 0 shared refs, 3 raw)
- Text words inside referenced sections: 1284

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 3 |
| raw | 3 |
| footer-anchor | 1 |
| lead-form | 1 |
| noscript | 1 |
| runtime-partials | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Ремонт встроенных СВЧ Neff, Miele и Bosch | lead-form | 52.7 KB | 1284 | no | src/pages/microwaves/sections/004-lead-form-remont-vstroennyh-svch-neff-miele-i-bosch.html |
| Мобильные контактные элементы | mobile-contact | 486 B | 0 | no | src/pages/microwaves/sections/006-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| Noscript fallback | noscript | 208 B | 0 | no | src/components/parametric/static/noscript-yandex-metrika-pixel-468caad1f647.template.html |
| HTML-фрагмент | raw | 54 B | 0 | no | src/pages/microwaves/sections/003-raw-html-fragment.html |
| HTML-фрагмент | raw | 52 B | 0 | no | src/pages/microwaves/sections/002-raw-html-fragment.html |
| Подключение partials-injector | runtime-partials | 51 B | 0 | no | src/components/parametric/static/runtime-partials-partials-injector-script-a55dc22a049e.template.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |


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
