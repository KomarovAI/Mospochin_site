<!-- ai-instruction-file: true -->
# Asset Instructions

## Scope

These rules apply to images, icons, fonts and asset styles under `assets/`.

## Edit

- Preserve stable asset paths unless the task explicitly includes a migration.
- Keep master sources and generated responsive derivatives distinct.
- Use existing image generators for WebP and responsive variants.
- Do not manually create duplicate optimized copies with ad hoc names.

## Verify

Run `npm run check:images`, `npm run check:assets` and `npm run ai:verify -- --changed`.

## Do not add

Do not place screenshots, comparison exports, ZIP files, temporary conversions, notes or additional instruction files under `assets/`.
