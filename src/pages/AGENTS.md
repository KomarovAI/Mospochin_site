<!-- ai-instruction-file: true -->
# Page Authoring Instructions

## Scope

These rules apply to page models and page-local sections under `src/pages/`.

## Edit

- Edit `page.json` only for page composition and source references.
- Edit page-local HTML in `sections/`.
- Move repeated markup to shared or parametric components instead of copying it.
- Keep page intent, canonical purpose, forms and internal links intact unless the task explicitly changes them.

## Build

- One page: `npm run build:site -- --page <file.html> --write`.
- All pages: `npm run build:site -- --write`.
- Never treat root HTML as the long-term source of truth.

## Verify

- Run `npm run doctor:page -- <file.html>` for a page edit.
- Run `npm run ai:verify -- --changed` after the iteration.

## Do not add

Do not place notes, screenshots, reports, prompts, backups, ZIP files or additional instruction files under `src/pages/`.
