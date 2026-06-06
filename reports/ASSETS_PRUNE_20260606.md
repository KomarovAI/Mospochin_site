# Safe assets prune — 2026-06-06

Goal: reduce project weight without breaking runtime assets, SEO pages, forms, responsive image generation, or AI navigation.

## Policy

Files were deleted only if `tools/audit-unused-assets.mjs` classified them as `safeDelete`:

- not referenced by HTML/CSS/JS/JSON/MD/SVG/XML/YAML project text;
- not listed in `.deploy/include-files.txt`;
- not an original source required to regenerate a referenced/deployed responsive image;
- not a generated responsive derivative that `check:responsive-images` expects to remain current.

## Result

- Removed files: 33
- Removed size: 5.35 MB
- Remaining assets: 166 files / 26.12 MB
- Missing references: 0
- Remaining `safeDelete`: 0

See:

- `reports/unused-assets.json`
- `reports/unused-assets.md`

## Kept intentionally

Original source images such as `assets/images/master-06.jpeg`, `assets/images/grill-25.jpeg`, and similar were kept because they are source originals for currently used responsive derivatives. Removing them would make the ZIP smaller, but would reduce future image-regeneration quality.
