# Household Editing Checklist

Use this checklist before changing household pages through Codex/LLM workflows.

## Change Symptoms, Brands, or Related Pages

- Prefer `npm run household:set-related -- --page <file>.html ...` for public service pages.
- Edit `data/household-services.json` directly for branch pages, shadow pages, or structural registry changes.
- Keep `primarySymptoms` short and literal.
- Keep `brandCluster` representative, not exhaustive.
- Do not point visible pages to `isShadow: true` pages in `relatedPages`.

## Change FAQ Or Request-Form Copy

- Prefer:
  - `npm run household:set-faq -- --page <file>.html ...`
  - `npm run household:set-form-hints -- --page <file>.html ...`
- Edit `data/household-page-slots.json` directly only when the helper flow is not enough.
- Keep FAQ answers short, literal, and useful on a real call or form submission.
- Keep request hints focused on what the client should send or expect next.
- Keep placeholders realistic for the actual device page.
- After these changes on a public service page, run `npm run household:sync-fallbacks -- --page <file>.html`.

## Change Trust, Review, Or Conversion Proof

- Prefer `npm run household:set-proof -- --page <file>.html --section <section> ...` for public service-page proof defaults.
- Edit `data/household-proof-layer.json` directly for branch-level proof/review/case sections.
- Keep promises concrete: diagnosis, price before work, act, warranty, timing, and next step.
- Keep review, proof, objection, and case cards focused on one confidence signal each.
- Keep `priceClarity` items factual: symptom, diagnosis, decision, and explicit repair viability.
- Do not move shadow pages or speculative offers into visible proof content.
- After these changes on a public service page, run `npm run household:sync-fallbacks -- --page <file>.html`.

## Change Household Card Sections

- Edit `data/household-page-slots.json` first for `categoryCards`, `trustCards`, and `contactChannels`.
- Edit `data/household-page-slots.json` for `routingHint` on `bytovaya-index.html` and `bytovaya-uslugi.html`.
- Edit `data/household-page-slots.json` for `advisoryCards` on public household service pages when you need to change safe checks, "don't do" guidance, or urgency signals.
- Keep card tones and CTA labels aligned with `data/household-card-presets.json`.
- Prefer registry-driven category cards over handwritten HTML service-card copy.

## Change SEO or Indexing

- Prefer `npm run household:set-metadata -- --page <file>.html ...` for public service pages.
- Edit `data/page-metadata.json` directly for branch pages and shadow pages.
- Keep shadow pages aligned with `robots: noindex,follow`.
- Do not use the service registry as the source of canonical URLs.
- After public service-page metadata edits, run `npm run household:sync-fallbacks -- --page <file>.html`.

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
- Read the `recommended edit surface` block from `doctor` before touching JSON or HTML by hand.
- For public household service pages, run `npm run household:sync-fallbacks` before `validate:site`.
- Run `npm run generate:sitemap` if metadata or indexing changed.
- Run `npm run generate:deploy-manifest` if a new deployable file was added.
