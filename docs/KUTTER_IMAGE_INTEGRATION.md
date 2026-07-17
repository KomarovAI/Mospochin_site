# Kutter image integration

## Scope

The source archive `processed_equipment_images_final(1).zip` contains four generatively enhanced photographs of professional cutter equipment:

- complete open cutter with bowl and lid;
- corroded drive coupling;
- corroded drive assembly;
- blade assembly over the working bowl.

The source PNG files are stored in `src/media-source/kutter/`. Production derivatives are generated into `assets/images/responsive/` at 480, 768 and 1080 pixels in JPEG and WebP.

## Content contract

Images are placed only on pages where the depicted assembly is relevant. Each production image must have:

- descriptive Russian `alt` text;
- `width` and `height` attributes;
- responsive `srcset` and `sizes`;
- WebP source with JPEG fallback;
- `loading="lazy"` and `decoding="async"` because the media section is below the hero;
- a visible caption;
- a visible processing disclosure.

The enhanced images are illustrative. Fine geometry, markings and fasteners may differ from the original photographs. They must not be used for measurements, engineering defect determination or model identification.

## Commands

```bash
npm run generate:kutter-images
npm run check:kutter-images
npm run build:site -- --page kuttery-dlya-restoranov.html --write
npm run check:core
npm run check:images
```

The machine-readable source of truth is `data/kutter-image-library.json`.
