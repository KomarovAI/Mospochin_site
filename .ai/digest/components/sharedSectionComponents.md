# Component Digest — sharedSectionComponents

- Name: Shared section components / общие HTML-секции
- Appears in: 27 pages
- Keywords: shared, компонент, общие секции, дубли, src/components/shared

## Related files

- src/components/shared/
- src/site-builder.json
- tools/site-builder-extract-shared.mjs
- tools/site-builder-lib.mjs

## Risks

- Один shared component может менять сразу несколько страниц.
- Builder output должен оставаться синхронным с root HTML.

## Safe editing notes

- Сейчас shared refs: 333, shared files: 32.
- После правки src/components/shared/* запускай check:shared-components и check:site-builder.

## Representative pages

- grili-mangaly.html
- holodilniki.html
- holodilnoe-oborudovanie.html
- ice-machines.html
- kompyutery.html
- parokonvektomat-abat.html
- parokonvektomat-convotherm.html
- parokonvektomat-e02-e07-e10.html
- parokonvektomat-electrolux.html
- parokonvektomat-kod-oshibki.html
- parokonvektomat-lainox.html
- parokonvektomat-ne-greet.html
- parokonvektomat-net-para.html
- parokonvektomat-rational-e9.html
- parokonvektomat-rational.html
- parokonvektomat-unox-af02-af08.html
- parokonvektomat-unox.html
- parokonvektomaty-promo.html
- parokonvektomaty.html
- pishevarochnye-kotly.html
- … ещё 7
