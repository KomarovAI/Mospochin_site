# Household Editing Checklist

Use this checklist before changing household pages through Codex/LLM workflows.

## Change Symptoms, Brands, or Related Pages

- Edit `data/household-services.json` first.
- Keep `primarySymptoms` short and literal.
- Keep `brandCluster` representative, not exhaustive.
- Do not point visible pages to `isShadow: true` pages in `relatedPages`.

## Change FAQ Or Request-Form Copy

- Edit `data/household-page-slots.json` first.
- Keep FAQ answers short, literal, and useful on a real call or form submission.
- Keep request hints focused on what the client should send or expect next.
- Keep placeholders realistic for the actual device page.

## Change SEO or Indexing

- Edit `data/page-metadata.json`.
- Keep shadow pages aligned with `robots: noindex,follow`.
- Do not use the service registry as the source of canonical URLs.

## Change Menus, Branch Header, Footer, or Branch-Wide CTAs

- Edit `data/household-branch.json`.
- Do not duplicate branch shell content into each service page.
- Do not reintroduce household `routeStrips`; branch-level fast-route content is no longer part of the household contract.

## Add a New Household Service Page

- Add the HTML page.
- Add metadata in `data/page-metadata.json`.
- Add a registry entry in `data/household-services.json`.
- Add a slot entry in `data/household-page-slots.json` if the page is public.
- Make sure the page has `Service` JSON-LD, `.telegram-form`, `.faq-item`, and the declared section ids.
- If the page should be public, add it to the appropriate branch navigation source.

## Validate

- Run `npm run validate:site`.
- Run `npm run generate:sitemap` if metadata or indexing changed.
- Run `npm run generate:deploy-manifest` if a new deployable file was added.
