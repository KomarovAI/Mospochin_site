# Household Authoring Helpers

These helper commands reduce routine JSON edits for public household service pages.

## Supported Commands

- `npm run household:set-faq -- --page <file.html> --faq-json '<json>'`
  - replaces `faq` in `data/household-page-slots.json`
- `npm run household:set-form-hints -- --page <file.html> --chips "a|b|c" --type-placeholder "..." --problem-placeholder "..."`
  - replaces `formHints` in `data/household-page-slots.json`
- `npm run household:set-related -- --page <file.html> [--related "a.html,b.html"] [--symptoms "x,y"] [--brands "A,B"] [--form-example "..."]`
  - updates service identity fields in `data/household-services.json`
- `npm run household:set-proof -- --page <file.html> --section <slaStrip|priceClarity|proofCards|objectionCards> --json '<json>'`
  - replaces one shared `serviceDefaults` section in `data/household-proof-layer.json`
- `npm run household:set-metadata -- --page <file.html> [--title "..."] [--description "..."] [--canonical "https://..."] [--og-url "https://..."] [--robots "..."] [--clear-robots]`
  - updates the page entry in `data/page-metadata.json`

## Boundaries

- Helpers support only public household service pages.
- Shadow pages stay on direct registry/metadata edits.
- Helpers do not edit HTML, layout, or long-form narrative.
- Use `--dry-run` on helpers to preview the resulting payload before writing.

## Fast Workflow

1. Run `npm run doctor:household-page -- --page <file.html>`.
2. Follow the `recommended edit surface` block.
3. Apply the smallest helper command that matches the requested change.
4. Run `npm run validate:site`.
