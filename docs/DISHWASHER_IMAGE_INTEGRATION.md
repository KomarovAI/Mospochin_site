# Dishwasher image integration

## Source of truth

- Registry: `data/dishwasher-image-library.json`
- Source photographs: `src/media-source/dishwasher/*.png`
- Responsive outputs: `assets/images/responsive/dishwasher-*`
- Generator: `npm run generate:dishwasher-images`
- Source-page integration: `npm run apply:dishwasher-images`
- Gate: `npm run check:dishwasher-images`

## Rendering contract

Each published photograph uses a `<picture>` element with JPEG fallback, WebP source, 480/768/1080 px variants, `srcset`, `sizes`, explicit intrinsic dimensions, `loading="lazy"` and `decoding="async"`. Media sections are placed below the hero so they do not become unintentional LCP elements.

## Content contract

Images are attached only to pages where the depicted machine or component is technically relevant. Generic service photographs are not placed on manufacturer pages because the photographed equipment must not be presented as a specific brand or model. No image from this library may be used for measurements, electrical reconnection, model identification, warranty evidence or engineering defect determination.

## Adding a photograph

1. Put the processed PNG in `src/media-source/dishwasher/`.
2. Add its metadata and SHA-256 to `data/dishwasher-image-library.json`.
3. Add page assignments under `pageUsage`.
4. Run `npm run generate:dishwasher-images`.
5. Run `npm run apply:dishwasher-images`.
6. Rebuild production HTML and run the image, builder, crawl and visual checks.
