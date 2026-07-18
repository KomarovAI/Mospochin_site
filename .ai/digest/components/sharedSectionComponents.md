# Component Digest — sharedSectionComponents

- Name: Shared section components / общие HTML-секции
- Appears in: 140 pages
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

- Сейчас shared refs: 349, shared files: 74.
- После правки src/components/shared/* запускай check:shared-components и check:site-builder.

## Representative pages

- case-chistka-boylera-s-silnoy-nakipyu.html
- case-remont-boylera-v-tesnoy-nishe.html
- case-remont-dvuhbakovogo-vodonagrevatelya.html
- case-trehfaznaya-sistema-gvs-chastnogo-doma.html
- chistka-vodonagrevatelya-ot-nakipi.html
- diagnostika-holodilnika.html
- diagnostika-mikrovolnovoy-pechi.html
- diagnostika-stiralnoy-mashiny.html
- diagnostika-vinnogo-shkafa.html
- diagnostika-vodonagrevatelya.html
- duhovka-ne-vklyuchaetsya.html
- dver-holodilnika-ne-zakryvaetsya.html
- dvertsa-mikrovolnovki-ne-zakryvaetsya.html
- elektricheskaya-varochnaya-panel-ne-vklyuchaetsya.html
- grili-mangaly.html
- holodilnaya-kamera-ne-holodit.html
- holodilnik-namerzaet-led.html
- holodilnik-ne-morozit.html
- holodilnik-ne-vklyuchaetsya.html
- holodilnik-peremorazhivaet-produkty.html
- … ещё 120
