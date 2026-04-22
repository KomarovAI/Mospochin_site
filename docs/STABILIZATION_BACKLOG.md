# Stabilization Backlog

Confirmed rough edges and hardening candidates after the branch-parity rollout.

| Surface | Severity | Type | Source | Recommended edit surface | Status |
| --- | --- | --- | --- | --- | --- |
| Canonical docs do not yet have an automated integrity check against live contracts, so docs/runtime drift is still caught manually. | medium | tooling/docs | cleanup review 2026-04-22 | `tools/validate-site.mjs` or a narrow docs-contract check | open |
| Representative screenshot audits are still manual and not yet encoded as a repeatable checked-in workflow. | medium | process/visual | branch stabilization passes 2026-04-22 | docs/process layer, not branch content models | open |
| Several one-off docs remain in `docs/` (`*_UPDATE`, `VISUAL_EFFECTS`, brand/update notes) and still need classification as canonical, archive-only, or removable. | low | docs cleanup | inventory pass 2026-04-22 | docs cleanup pass, not runtime | open |
