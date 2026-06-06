# Docs prune v2 — 2026-06-06

## Goal

Cut legacy/duplicate documentation that could distract future AI agents, without removing live project rules or quality gates.

## Removed docs

- `docs/AI_PROJECT_KNOWLEDGE.md`
- `docs/DOC_STATUS.md`
- `docs/PROJECT_MAP.md`
- `docs/SOURCE_COMPRESSION_PLAN.md`
- `docs/STABILIZATION_BACKLOG.md`
- `docs/STATIC_BUILDER_MIGRATION_PLAN.md`

## Preserved / moved value

- Active AI entry: `docs/AI_START_HERE.md`
- Doc taxonomy: `docs/DOC_INDEX.md`
- Architecture decisions: `docs/PROJECT_DECISIONS.md`
- Machine project map: `data/project-map.generated.json`
- Ownership contract: `data/file-ownership.json`
- Confirmed manual findings: `reports/manual-review-backlog.md`

## Rule

Generated maps and active docs are the source of truth. Do not recreate stale human map/status/planning docs unless a new persistent contract is needed.
