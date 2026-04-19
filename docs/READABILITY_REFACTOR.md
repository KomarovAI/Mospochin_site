# Readability Refactor

## Goal

Make the static site predictable to edit:

- one asset loading order for every production page;
- one place to enforce `head` conventions;
- no duplicate Telegram form handlers;
- no mixed `head`/`body` script conventions across pages.

## Source Of Truth

Use `tools/normalize-html.mjs` when page heads drift apart.

It standardizes:

- `charset`, `viewport`, favicon;
- local font includes;
- `styles-built.css` and `styles.css`;
- `main.js` on every page;
- `telegram-form.js` only on pages that actually contain `.telegram-form`;
- removal of duplicate Telegram script tags from the body.

## Command

```bash
node tools/normalize-html.mjs
```

## Scope

This refactor normalizes layout scaffolding and asset loading.
It does not rewrite page-specific marketing copy or section order.

## Metadata Source Of Truth

Page-level SEO metadata now lives in `data/page-metadata.json`.

Use:

```bash
npm run sync:metadata
npm run generate:sitemap
npm run validate:site
```

This keeps `title`, `description`, `canonical`, `og:url`, form expectations, and
404 robots directives aligned across the whole site.

`sitemap.xml` is now generated from the same metadata source of truth.
