# Component Digest — responsiveImages

- Name: Responsive images / srcset / WebP sidecars
- Appears in: 93 pages
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
- chistka-i-dezinfekciya-kuttera.html
- chistka-ventilyatsii-restoranov.html
- diagnostika-holodilnogo-oborudovaniya.html
- diagnostika-kuttera.html
- diagnostika-promyshlennoy-posudomoechnoy-mashiny.html
- diagnostika-ventilyatsii-restorana.html
- dozatory-moyushchego-i-opolaskivatelya.html
- frontalnye-posudomoechnye-mashiny.html
- grili-mangaly.html
- holodilnoe-oborudovanie.html
- holodilnye-kamery-dlya-restoranov.html
- holodilnye-shkafy-dlya-restoranov.html
- holodilnye-stoly.html
- ice-machines.html
- index.html
- … ещё 73
