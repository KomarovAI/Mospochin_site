# Component Digest — parametricComponents

- Name: Parameterized components / template + props
- Appears in: 500 pages
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

- Parametric refs: 2836, templates: 170, props files: 781.
- Для текста конкретной страницы меняй content/components/*/*.json; для разметки меняй template.html.
- После правки запускай check:parameterized-components и check:site-builder.

## Representative pages

- 404.html
- about.html
- avtomatika-ventilyatsii-restorana.html
- belyy-nalet-posle-posudomoechnoy-mashiny.html
- bezopasnost-sous-vide.html
- blixery-dlya-restoranov.html
- bytovaya-about.html
- bytovaya-contact.html
- bytovaya-index.html
- bytovaya-uslugi.html
- case-chistka-boylera-s-silnoy-nakipyu.html
- case-remont-boylera-v-tesnoy-nishe.html
- case-remont-dvuhbakovogo-vodonagrevatelya.html
- case-trehfaznaya-sistema-gvs-chastnogo-doma.html
- chek-list-ventilyatsii-restorana.html
- chem-otlichaetsya-pritok-ot-vytyazhki.html
- chistka-i-dezinfekciya-kuttera.html
- chistka-teploobmennika-i-vozdushnogo-trakta-sushilnoy-mashiny.html
- chistka-ventilyatsii-restoranov.html
- chistka-vodonagrevatelya-ot-nakipi.html
- … ещё 480
