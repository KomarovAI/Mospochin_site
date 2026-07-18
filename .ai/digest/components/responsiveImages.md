# Component Digest — responsiveImages

- Name: Responsive images / srcset / WebP sidecars
- Appears in: 113 pages
- Keywords: картинка, изображ, фото, srcset, webp, avif, responsive, hero image
- CSS selectors: img[srcset], picture source

## Related files

- tools/generate-responsive-images.mjs
- tools/generate-webp-sidecars.mjs
- assets/images/

## Risks

- Оригиналы не пережимаем; production-деривативы генерируются.
- Не-hero изображения должны быть lazy, hero — eager/fetchpriority по месту.

## Safe editing notes

- После добавления/замены images запускай generate:responsive-images и check:webp-sidecars.

## Representative pages

- about.html
- bytovaya-about.html
- bytovaya-contact.html
- bytovaya-index.html
- bytovaya-uslugi.html
- case-chistka-boylera-s-silnoy-nakipyu.html
- case-remont-boylera-v-tesnoy-nishe.html
- case-remont-dvuhbakovogo-vodonagrevatelya.html
- case-trehfaznaya-sistema-gvs-chastnogo-doma.html
- chistka-i-dezinfekciya-kuttera.html
- chistka-ventilyatsii-restoranov.html
- chistka-vodonagrevatelya-ot-nakipi.html
- diagnostika-holodilnogo-oborudovaniya.html
- diagnostika-kuttera.html
- diagnostika-promyshlennoy-posudomoechnoy-mashiny.html
- diagnostika-ventilyatsii-restorana.html
- diagnostika-vodonagrevatelya.html
- dozatory-moyushchego-i-opolaskivatelya.html
- fotografii-remonta-vodonagrevateley.html
- frontalnye-posudomoechnye-mashiny.html
- … ещё 93
