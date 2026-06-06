# Tools audit

Generated: 2026-06-06T08:58:13.069Z

## Summary

- Tools scanned: 79
- Total tools size: 715.5 KB
- Categories: npmScriptEntry=68, importedByTool=10, deployUsed=1
- Actions: keep=79

## Review-for-prune candidates

No tools currently marked as review-for-prune.

## Keep policy

- Keep npm script entries, imported helpers, deploy/workflow references and safety guards.
- Do not delete branch-specific tools until a replacement generic branch tool exists and checks pass.
- Prefer consolidation over blind deletion for `set-*`, `doctor-*` and `scaffold-*` utilities.
