# Manual Review Backlog — MosPochin

This is the compact home for confirmed manual review findings after visual/screenshot/stabilization passes.

Use this file only for **confirmed** issues after reviewing screenshot artifacts or runtime behavior. Do not log speculative ideas or raw audit output here.

## Current open findings

| Surface | Severity | Type | Source | Recommended edit surface | Status |
|---|---|---|---|---|---|
| Representative and restaurant screenshot audits remain semi-automated; human review is required before adding findings. | low | process/visual | docs prune v2 2026-06-06 | `.artifacts/screenshots/`, `docs/RESTAURANT_VISUAL_AUDIT_CHECKLIST.md` | tracking |

## Logging rules

- One row per confirmed root issue, not one row per viewport.
- If a problem is viewport-specific, mention the viewport in `Surface`.
- Restaurant screenshot findings should use source format: `restaurant visual audit YYYY-MM-DD <artifact-folder-name>`.
- Do not treat screenshot audits as automatic deploy gates.
- Do not log intended branch-specific differences as inconsistency.

## Historical note

Older resolved stabilization rows were removed from active docs during docs prune v2. The current source of truth for decisions is `docs/PROJECT_DECISIONS.md`; the current doc routing layer is `docs/DOC_INDEX.md`.
