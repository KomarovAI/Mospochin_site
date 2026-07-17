# Refrigeration image integration

## Scope

IMG-R1 integrates 36 processed technical photographs into 10 key refrigeration pages:

- main refrigeration hub;
- diagnostics;
- maintenance;
- cabinets;
- refrigerated counters;
- cold rooms;
- monoblocks and split systems;
- ice machines;
- confirmed POLAIR brand page;
- confirmed LIEBHERR brand page.

## Commands

```bash
npm run generate:refrigeration-images
npm run apply:refrigeration-images
npm run build:site
npm run check:refrigeration-images
npm run audit:refrigeration-media-review
```

## Contracts

- source masters: `src/media-source/refrigeration/`;
- production variants: JPEG and WebP, widths 480/768/1080;
- HTML: `<picture>`, `srcset`, `sizes`, explicit width/height;
- below-fold images use `loading="lazy"` and `decoding="async"`;
- captions describe visible context and do not establish a diagnosis;
- brand pages use only assets with matching `brandEvidence`;
- archive IDs 005 and 040 are quarantined from the refrigeration cluster;
- OG/Twitter image metadata is set from the page's selected lead asset.

## Source archive disclosure

The source photographs were processed for publication: light, detail, color and composition were adjusted while visible wear, contamination, corrosion, icing and working context were retained. Images are not used for measurements, exact model identification, wiring decisions or diagnosis without inspection and documentation.
