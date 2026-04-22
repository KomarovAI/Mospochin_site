# Restaurant Authoring Helpers

These helper commands reduce routine JSON edits for public restaurant service pages.

## Supported Commands

- `npm run restaurant:sync-fallbacks [-- --page <file.html>]`
  - syncs fallback HTML for `service-schema`, form placeholders, and FAQ blocks on public restaurant service pages
- `npm run restaurant:set-faq -- --page <file.html> --faq-json '<json>'`
  - replaces `faq` in `data/restaurant-page-slots.json`
- `npm run restaurant:set-form-hints -- --page <file.html> --chips "a|b|c" --type-placeholder "..." --problem-placeholder "..."`
  - replaces `formHints` in `data/restaurant-page-slots.json`
- `npm run restaurant:set-related -- --page <file.html> [--related "a.html,b.html"] [--symptoms "x,y"] [--brands "A,B"] [--form-example "..."]`
  - updates service identity fields in `data/restaurant-services.json`
- `npm run restaurant:set-proof -- --page <file.html> --section <slaStrip|proofCards> --json '<json>'`
  - replaces one shared `serviceDefaults` section in `data/restaurant-proof-layer.json`
- `npm run restaurant:set-metadata -- --page <file.html> [--title "..."] [--description "..."] [--canonical "https://..."] [--og-url "https://..."] [--robots "..."] [--clear-robots]`
  - updates the page entry in `data/page-metadata.json`

## Boundaries

- Helpers support only public restaurant service pages.
- Helpers do not edit layout or long-form narrative.
- Route strips, branch landing copy, and restaurant branch shells still live in `data/restaurant-branch.json` plus branch HTML.
- Use `--dry-run` on helpers to preview the resulting payload before writing.

## Fast Workflow

1. Run `npm run doctor:restaurant-page -- --page <file.html>`.
2. Follow the `recommended edit surface` block.
3. Apply the smallest helper command that matches the requested change.
4. Run `npm run restaurant:sync-fallbacks -- --page <file.html>`.
5. Run `npm run validate:site`.
