# Tools audit

Generated: 2026-07-14T03:53:43.404Z

## Summary

- Tools scanned: 120
- Total tools size: 855.0 KB
- Categories: npmScriptEntry=86, importedByTool=12, manualUtility=3, orphanCandidate=14, deployUsed=5
- Actions: keep=106, reviewForPrune=14

## Review-for-prune candidates

| Tool | Category | Size | Why |
|---|---:|---:|---|
| `tools/check-ai-visual-review.mjs` | orphanCandidate | 2.5 KB | No project text references found outside the tool itself. |
| `tools/check-deploy-runtime.mjs` | orphanCandidate | 3.7 KB | No project text references found outside the tool itself. |
| `tools/check-visible-copy.mjs` | orphanCandidate | 11.1 KB | No project text references found outside the tool itself. |
| `tools/create-ai-visual-review-pack.mjs` | orphanCandidate | 7.5 KB | No project text references found outside the tool itself. |
| `tools/deploy-pack.mjs` | orphanCandidate | 7.8 KB | No project text references found outside the tool itself. |
| `tools/smoke-production-conversion.mjs` | orphanCandidate | 5.1 KB | No project text references found outside the tool itself. |
| `tools/validate-site-v11-static-wrapper.mjs` | orphanCandidate | 2.6 KB | No project text references found outside the tool itself. |
| `tools/validate-site.strict.mjs` | orphanCandidate | 2.8 KB | No project text references found outside the tool itself. |
| `tools/visual-atomic-capture.mjs` | orphanCandidate | 22.7 KB | No project text references found outside the tool itself. |
| `tools/visual-contact-sheets.mjs` | orphanCandidate | 14.7 KB | No project text references found outside the tool itself. |
| `tools/visual-dom-dissector.mjs` | orphanCandidate | 19.1 KB | No project text references found outside the tool itself. |
| `tools/visual-shard-merge.mjs` | orphanCandidate | 4.0 KB | No project text references found outside the tool itself. |
| `tools/visual-shard-plan.mjs` | orphanCandidate | 4.0 KB | No project text references found outside the tool itself. |
| `tools/visual-shard-runner.mjs` | orphanCandidate | 16.6 KB | No project text references found outside the tool itself. |

## Keep policy

- Keep npm script entries, imported helpers, deploy/workflow references and safety guards.
- Do not delete branch-specific tools until a replacement generic branch tool exists and checks pass.
- Prefer consolidation over blind deletion for `set-*`, `doctor-*` and `scaffold-*` utilities.
