# Page Digest — microwaves.html

- Branch: household
- Role: service
- Title: Ремонт встроенных микроволновок — MosPochin
- Description: Ремонт встраиваемых СВЧ Neff, Miele, Bosch, Siemens, Smeg и Gaggenau в Москве. Смета до работ и гарантия на ремонт.
- H1: Ремонт встроенных СВЧ Neff, Miele и Bosch
- Canonical: https://mospochin.ru/microwaves.html
- Builder model: src/pages/microwaves/page.json
- Sections: 9 (4 local, 0 shared refs, 1 raw)
- Text words inside referenced sections: 1317

## Component mix

| Component | Count |
| --- | --- |
| mobile-contact | 3 |
| body-preamble | 1 |
| footer-anchor | 1 |
| layout-fragment | 1 |
| lead-form | 1 |
| raw | 1 |
| runtime-partials | 1 |


## Largest sections to inspect first

| Section | Component | Bytes | Words | Shared | Source |
| --- | --- | --- | --- | --- | --- |
| Ремонт встроенных СВЧ Neff, Miele и Bosch | lead-form | 54.0 KB | 1317 | no | src/pages/microwaves/sections/003-lead-form-remont-vstroennyh-svch-neff-miele-i-bosch.html |
| Мобильные контактные элементы | mobile-contact | 630 B | 0 | no | src/pages/microwaves/sections/005-mobile-contact-mobil-nye-kontaktnye-elementy.html |
| HTML-фрагмент | raw | 54 B | 0 | no | src/pages/microwaves/sections/002-raw-html-fragment.html |
| Подключение partials-injector | runtime-partials | 51 B | 0 | no | src/components/parametric/static/runtime-partials-partials-injector-script-a55dc22a049e.template.html |
| Секция 1 | body-preamble | 48 B | 0 | no | src/pages/microwaves/sections/001-body-preamble-sekciya-1.html |
| Мобильные контактные элементы | mobile-contact | 42 B | 0 | no | src/components/parametric/mobile-contact/whatsapp-float-container.template.html |
| Мобильные контактные элементы | mobile-contact | 41 B | 0 | no | src/components/parametric/mobile-contact/mobile-footer-container.template.html |
| Footer mount point | footer-anchor | 39 B | 0 | no | src/components/parametric/static/footer-anchor-footer-container-mount-f6291c7cb9f5.template.html |


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
