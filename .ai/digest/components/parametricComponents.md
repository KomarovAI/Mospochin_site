# Component Digest — parametricComponents

- Name: Parameterized components / template + props
- Appears in: 0 pages
- Keywords: parametric, parameterized, templateRef, propsRef, content/components, параметризованные компоненты

## Related files

- src/components/parametric/
- content/components/
- tools/site-builder-parameterize-core.mjs
- tools/site-builder-lib.mjs

## Risks

- Template может изменить сразу много страниц; props меняют конкретные page-specific значения.
- Всегда проверяй hash/render через check:parameterized-components.

## Safe editing notes

- Parametric refs: 0, templates: 0, props files: 0.
- Для текста конкретной страницы меняй content/components/*/*.json; для разметки меняй template.html.
- После правки запускай check:parameterized-components и check:site-builder.
