# Tools audit

Generated: 2026-07-17T06:46:13.697Z

## Summary

- Tools scanned: 211
- Total tools size: 1998.6 KB
- Categories: npmScriptEntry=188, importedByTool=18, manualUtility=4, deployUsed=1
- Actions: keep=211

## Review-for-prune candidates

No tools currently marked as review-for-prune.

## Keep policy

- Keep npm script entries, imported helpers, deploy/workflow references and safety guards.
- Do not delete branch-specific tools until a replacement generic branch tool exists and checks pass.
- Prefer consolidation over blind deletion for `set-*`, `doctor-*` and `scaffold-*` utilities.
