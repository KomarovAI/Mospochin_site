# Mospochin_site Rules

- Source of truth: `*.html`, `styles.css`, `main.js`, `telegram-form.js`, `data/`, `tools/`.
- Avoid editing generated output directly when a script owns it, especially `sitemap.xml` and synced metadata artifacts.
- Reuse the existing static-site structure; do not add new patterns without a clear need.
- Keep changes small; do not reformat unrelated HTML, CSS, or JS.

## Risky Zones

- `.github/workflows/*`
- `tools/*`
- `main.js`
- `telegram-form.js`
- `styles.css`
- SEO, metadata, canonicals, sitemap generation, and contact-form flows

## Validation

- `npm run validate:site`
- `npm run lint`
- `npm run sync:metadata` when metadata changes
- `npm run generate:sitemap` when URLs, canonicals, or indexed pages change
- `npm run dev` only for targeted preview or smoke checks

## Safety

- Inspect the dirty worktree before editing.
- Do not overwrite unrelated user changes.
- In the final summary, note substantive changes, validation run, and remaining risks.
