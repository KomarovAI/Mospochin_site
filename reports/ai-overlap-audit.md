# AI overlap audit

Generated: 2026-07-14T03:53:43.650Z

## Summary

- Project-map pages: 121
- AI project-index pages: 121
- Page digests: 121
- Cluster digests: 3
- Tracked AI/map files size: 908.3 KB

## Inventory

| File | Exists | Size | Role |
|---|---:|---:|---|
| `data/project-map.generated.json` | yes | 178.7 KB | primary machine-readable project map |
| `data/ai-editing-manifest.json` | yes | 6.9 KB | compatibility/editing hints; candidate for compaction |
| `data/ai-project-index.json` | yes | 332.8 KB | AI search/index layer; keep generated |
| `data/ai-component-map.json` | yes | 124.8 KB | AI component index; keep generated |
| `.ai/digest/content-map.json` | yes | 250.4 KB | AI digest map; candidate for compaction if it duplicates project-map |
| `docs/AI_START_HERE.md` | yes | 5.8 KB | primary human AI entrypoint |
| `docs/DOC_INDEX.md` | yes | 7.0 KB | primary docs index |
| `data/file-ownership.json` | yes | 1.9 KB | primary ownership/generated/manual contract |

## Findings

### project-map-vs-ai-index-pages

- Severity: info
- Summary: 121/121 project-map pages also appear in ai-project-index
- Recommendation: Keep both for now: project-map routes edits; ai-project-index supports semantic/project context.

### project-map-vs-page-digests

- Severity: info
- Summary: 121/121 project-map pages have page digests
- Recommendation: Keep page digests; they provide compact page summaries not present in project-map.

### ai-editing-manifest-overlap

- Severity: review
- Summary: ai-editing-manifest likely overlaps with project-map and file-ownership after the AI navigation pack.
- Recommendation: Review unique fields, then reduce to a small compatibility manifest in a future prune step.

### content-map-size

- Severity: info
- Summary: .ai/digest/content-map.json size is 250.4 KB
- Recommendation: If still >500 KB, compact long excerpts and duplicated page metadata in a future AI generated compact step.

## Recommended future compaction order

1. Keep `data/project-map.generated.json`, `data/file-ownership.json`, `docs/AI_START_HERE.md` and page/cluster digests.
2. Review and shrink `data/ai-editing-manifest.json` only after confirming unique fields.
3. Compact `.ai/digest/content-map.json` if it carries long excerpts already covered by page digests.
4. Do not remove `data/ai-project-index.json` or `data/ai-component-map.json` while `ai:check` depends on them.
