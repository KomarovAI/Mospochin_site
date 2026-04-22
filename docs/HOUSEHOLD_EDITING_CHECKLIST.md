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

## Change Household Card Sections

- Edit `data/household-page-slots.json` first for `categoryCards`, `trustCards`, and `contactChannels`.
- Keep card tones and CTA labels aligned with `data/household-card-presets.json`.
- Prefer registry-driven category cards over handwritten HTML service-card copy.

## Change SEO or Indexing

- Edit `data/page-metadata.json`.
- Keep shadow pages aligned with `robots: noindex,follow`.
- Do not use the service registry as the source of canonical URLs.

## Change Menus, Branch Header, Footer, or Branch-Wide CTAs

- Edit `data/household-branch.json`.
- Do not duplicate branch shell content into each service page.
- Do not reintroduce household `routeStrips`; branch-level fast-route content is no longer part of the household contract.

## Add a New Household Service Page

- Start with `npm run scaffold:household-service -- --slug <slug> --device-name "<device>" --ui-label "<label>" --service-name "<service>" --family <family>`.
- The scaffold adds the HTML page, metadata, registry, taxonomy device, slot entry, and household branch navigation for public pages.
- If the page is shadow, add `--shadow`; the scaffold keeps it out of visible navigation and sets `noindex,follow`.
- After scaffold, refine the unique HTML sections and page-specific sales copy without breaking the scaffolded anchors and form contract.

## Validate

- Run `npm run validate:site`.
- Run `npm run doctor:household-page -- --page <file>.html` for a narrow page audit when one service page looks out of sync.
- Run `npm run generate:sitemap` if metadata or indexing changed.
- Run `npm run generate:deploy-manifest` if a new deployable file was added.
