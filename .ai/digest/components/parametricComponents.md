# Component Digest — parametricComponents

- Name: Parameterized components / template + props
- Appears in: 296 pages
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

- Parametric refs: 1785, templates: 112, props files: 0.
- Для текста конкретной страницы меняй content/components/*/*.json; для разметки меняй template.html.
- После правки запускай check:parameterized-components и check:site-builder.

## Representative pages

- 404.html
- about.html
- avtomatika-ventilyatsii-restorana.html
- bezopasnost-sous-vide.html
- blixery-dlya-restoranov.html
- bytovaya-about.html
- bytovaya-contact.html
- bytovaya-index.html
- bytovaya-uslugi.html
- chek-list-ventilyatsii-restorana.html
- chem-otlichaetsya-pritok-ot-vytyazhki.html
- chistka-i-dezinfekciya-kuttera.html
- chistka-ventilyatsii-restoranov.html
- chto-proveryaet-inzhener-ventilyatsii.html
- contact.html
- diagnostika-holodilnogo-oborudovaniya.html
- diagnostika-kuttera.html
- diagnostika-promyshlennoy-posudomoechnoy-mashiny.html
- diagnostika-ventilyatsii-restorana.html
- dozatory-moyushchego-i-opolaskivatelya.html
- … ещё 276
