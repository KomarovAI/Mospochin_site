# Component Digest — parametricComponents

- Name: Parameterized components / template + props
- Appears in: 39 pages
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

- Parametric refs: 870, templates: 63, props files: 14.
- Для текста конкретной страницы меняй content/components/*/*.json; для разметки меняй template.html.
- После правки запускай check:parameterized-components и check:site-builder.

## Representative pages

- 404.html
- about.html
- bytovaya-about.html
- bytovaya-contact.html
- bytovaya-index.html
- bytovaya-uslugi.html
- contact.html
- grili-mangaly.html
- holodilniki.html
- holodilnoe-oborudovanie.html
- ice-machines.html
- index.html
- kompyutery.html
- microwaves.html
- parokonvektomat-abat.html
- parokonvektomat-convotherm.html
- parokonvektomat-e02-e07-e10.html
- parokonvektomat-electrolux.html
- parokonvektomat-kod-oshibki.html
- parokonvektomat-lainox.html
- … ещё 19
