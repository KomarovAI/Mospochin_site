# Operator Routing

Short operational entrypoint for LLM/operator work in `Mospochin_site`.

Use this doc to choose the default workflow fast. Use the branch docs only after the route is clear.

The wider maintenance model stays in [docs/SITE_MAINTENANCE_MODEL.md](/home/artikk/Mospochin_site/docs/SITE_MAINTENANCE_MODEL.md).
The machine-readable route catalog lives in `data/operator-recipes.json`.
The shortest machine-readable selector is `npm run recipe:select -- --intent <recipe-id-or-intent> [--page <file.html>] [--branch <household|restaurant|shared>] [--json]`.
For a compact page preflight before editing, use `npm run inspect:page -- --page <file.html>`.

## Default Routes

### 1. Diagnose A Page

Use this first when the page, branch, or edit surface is not obvious.

Command:
- `npm run inspect:page -- --page <file.html>`
- `npm run doctor:page -- --page <file.html>`
- `npm run recipe:select -- --intent <recipe-id-or-intent> --page <file.html>`

Relevant recipe ids:
- `household-change-faq`, `restaurant-change-faq`
- `household-change-form-hints`, `restaurant-change-form-hints`
- `household-change-related`, `restaurant-change-related`
- `household-change-proof`, `restaurant-change-proof`
- `household-change-metadata`, `restaurant-change-metadata`

What it gives:
- branch and page type
- likely JSON/source files and edit surfaces
- branch-safe doctor/sync/validation commands
- screenshot audit manifest coverage, if any
- issues, if any
- recommended edit surface

Stop rules:
- Do not start with screenshot audit for a normal content/edit task.
- Do not edit HTML/CSS/JS first if the doctor points to a smaller JSON source of truth.

## 2. Edit A Household Page

Use this only after the page is confirmed as `household`.

Default path:
1. `npm run doctor:page -- --page <file.html>`
2. Run the needed `household:set-*` helper
3. `npm run household:sync-fallbacks -- --page <file.html>` for public household service pages
4. `npm run validate:site`

Relevant recipe ids:
- `household-change-faq`
- `household-change-form-hints`
- `household-change-related`
- `household-change-proof`
- `household-change-metadata`
- `household-change-branch-shell`
- `household-add-service-page`

Guardrails:
- Do not use `restaurant:*` helpers.
- Keep HTML edits for unique layout or narrative only.

## 3. Edit A Restaurant Page

Use this only after the page is confirmed as `restaurant`.

Default path:
1. `npm run doctor:page -- --page <file.html>`
2. Run the needed `restaurant:set-*` helper
3. `npm run restaurant:sync-fallbacks -- --page <file.html>` for public restaurant service pages
4. `npm run validate:site`

Relevant recipe ids:
- `restaurant-change-faq`
- `restaurant-change-form-hints`
- `restaurant-change-related`
- `restaurant-change-proof`
- `restaurant-change-metadata`
- `restaurant-change-branch-shell`
- `restaurant-add-service-page`

Guardrails:
- Do not use `household:*` helpers.
- Keep HTML edits for unique layout or narrative only.
- For repeatable restaurant `trustCards` layout tuning, prefer `data/restaurant-page-slots.json` over page HTML.
- For repeatable restaurant service-page mobile pruning, prefer `data/restaurant-services.json` over page HTML.

## 4. Run Representative Stabilization Audit

Use this only for stabilization review, not for routine authoring.

Command:
- `npm run audit:representative-pages`

Relevant recipe id:
- `representative-stabilization-audit`

What it does:
- runs `doctor:page` on representative pages
- captures desktop/mobile screenshots from `data/screenshot-audit.json`
- prints the artifact folder

Guardrails:
- Do not treat this as a deploy gate.
- Do not log issues automatically.
- Add to `docs/STABILIZATION_BACKLOG.md` only confirmed findings after review.

## 5. Run Full Restaurant Stabilization Audit

Use this only when the whole restaurant branch needs a stabilization pass.

Command:
- `npm run audit:restaurant-branch`

Relevant recipe id:
- `restaurant-full-branch-audit`

What it does:
- runs `doctor:page` for every restaurant page from `data/restaurant-screenshot-audit.json`
- captures desktop/mobile screenshots for the full restaurant branch
- prints the artifact folder
- routes manual review through `docs/RESTAURANT_VISUAL_AUDIT_CHECKLIST.md`

Guardrails:
- Do not treat this as the default site-wide audit.
- Do not use this for household pages.
- Add to `docs/STABILIZATION_BACKLOG.md` only confirmed findings after review.

## When Not To Go Deeper

- If one of the 4 routes fits, do not invent a new helper or workflow.
- Use `npm run recipe:select` when you need the shortest safe command path from `data/operator-recipes.json` without reading the full catalog.
- If `doctor:page` already identifies the edit surface, follow that surface instead of reading the whole docs tree.
- Use `validate:site` as a contract gate, not as a guide for what to edit.
- Keep household and restaurant workflows separate even when the runtime is shared.
- For restaurant screenshot review, use `docs/RESTAURANT_VISUAL_AUDIT_CHECKLIST.md` instead of inventing an ad-hoc rubric.
