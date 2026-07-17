# AI Control Lite

This is the canonical operating guide for AI-assisted changes.

## Workflow

1. Describe the task with `TASK`, `TARGET`, `GOAL`, `MUST KEEP` and `DONE WHEN`.
2. Run `npm run ai:brief` to obtain the smallest useful context.
3. Edit only the source-of-truth files returned by the brief.
4. Run `npm run ai:verify -- --changed` after each iteration.
5. After a no-delete overlay, run `npm run apply:ai-control-lite-r5`.
6. Run `npm run ai:release` only before packaging or production handoff.

## Public commands

- `npm run ai:brief` — compact task and page context.
- `npm run ai:edit` — safe existing editing helper.
- `npm run ai:verify` — changed-only verification.
- `npm run ai:release` — full release verification.

Existing `ai:*` utilities remain internal building blocks. Agents should not choose among them directly unless debugging the AI harness.

## Context budget

Do not open `data/project-map.generated.json`, full AI indexes or all cluster guides by default. `ai:brief` reads them and prints only the relevant source paths, ownership, risks and checks.

## Instruction files

Approved instruction files are defined in `data/ai-instruction-policy.json`. They contain stable operating rules only. Current state, task progress, metrics, release notes and terminal output are forbidden there.

## File hygiene

- Temporary files: `.artifacts/`.
- Durable handoff evidence: `reports/handoff/`.
- Active plans: `docs/exec-plans/active/`.
- Completed plans: `docs/exec-plans/completed/`.
- Historical documentation: `docs/archive/`.

New Markdown or text reports are not allowed in the repository root. Backup copies, numbered downloads, editor recovery files, logs and nested ZIP archives are rejected by the hygiene guard.

## Browser evidence

Normal release checks validate stored browser evidence. Real browser smoke is refreshed only when forms, analytics or backend behavior changes.

## Verification levels

- Iteration: changed-only checks selected by file type.
- Cluster change: changed-only checks plus the cluster guards returned by `ai:brief`.
- Release: full handoff profile, AI hygiene, assets and security checks.

## Plans

Use an execution plan only for broad changes that alter many pages, a generator, a schema, backend behavior or deployment. Small edits do not need a plan.
