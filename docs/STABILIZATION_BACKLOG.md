# Stabilization Backlog

Confirmed rough edges and hardening candidates after the branch-parity rollout.

Use this backlog only for confirmed issues after review. For screenshot audits, run the relevant audit command, inspect the artifact folder, and log findings in the fixed format below. Do not use this file as an architecture map or auto-generated report.

Restaurant branch visual reviews should follow `docs/RESTAURANT_VISUAL_AUDIT_CHECKLIST.md` after `npm run audit:restaurant-branch`.

Source conventions:
- representative audit findings should identify the audit date and artifact folder
- restaurant full-branch findings should use `restaurant visual audit YYYY-MM-DD <artifact-folder-name>`
- use one row per confirmed root issue, not one row per viewport
- if a problem is viewport-specific, mention the viewport in `Surface`

| Surface | Severity | Type | Source | Recommended edit surface | Status |
| --- | --- | --- | --- | --- | --- |
| Canonical docs do not yet have an automated integrity check against live contracts, so docs/runtime drift is still caught manually. | medium | tooling/docs | cleanup review 2026-04-22 | `tools/validate-site.mjs` or a narrow docs-contract check | resolved |
| Representative screenshot audits are now a checked-in semi-automated workflow, but findings still require human review before they belong in the backlog. | low | process/visual | workflow rollout 2026-04-22 | `data/screenshot-audit.json`, `tools/audit-*.mjs`, docs/process layer | tracking |
| Restaurant service pages (`parokonvektomaty.html`, `plity-pechi.html`, `holodilnoe-oborudovanie.html`, `posudomoechnye-mashiny.html`, `grili-mangaly.html`, `ice-machines.html`) previously showed massive blank vertical bands in both desktop and mobile screenshots, so the old full-page audit output could not be trusted for visual review of those pages. | medium | layout | restaurant visual audit 2026-04-22 2026-04-22T18-26-15-974Z | `tools/audit-screenshots.mjs` runner-side reveal stabilization | resolved |
| Several one-off docs remain in `docs/` (`*_UPDATE`, `VISUAL_EFFECTS`, brand/update notes) and still need classification as canonical, archive-only, or removable. | low | docs cleanup | inventory pass 2026-04-22 | docs cleanup pass, not runtime | resolved |
