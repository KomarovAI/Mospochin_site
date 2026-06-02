# Component Digest — responsiveImages

- Name: Responsive images / srcset / WebP sidecars
- Appears in: 32 pages
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
- grili-mangaly.html
- holodilnoe-oborudovanie.html
- kompyutery.html
- microwaves.html
- parokonvektomat-abat.html
- parokonvektomat-convotherm.html
- parokonvektomat-e02-e07-e10.html
- parokonvektomat-electrolux.html
- parokonvektomat-kod-oshibki.html
- parokonvektomat-lainox.html
- parokonvektomat-ne-greet.html
- parokonvektomat-net-para.html
- parokonvektomat-obschuzhivanie.html
- parokonvektomat-rational-e9.html
- parokonvektomat-unox-af02-af08.html
- … ещё 12
