# Component Digest — sharedSectionComponents

- Name: Shared section components / общие HTML-секции
- Appears in: 0 pages
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

- Сейчас shared refs: 0, shared files: 0.
- После правки src/components/shared/* запускай check:shared-components и check:site-builder.
