<!-- ai-instruction-file: true -->
# Repository Instructions

## Start

- Run `npm run ai:brief -- --task <task> --page <file.html>` before a non-trivial edit.
- Read `.ai/CURRENT.md` for current project state.
- Open only the files listed by the brief; do not read generated project maps in full.
- Use `docs/AI_CONTROL_LITE.md` only when the brief is insufficient.

## Source of truth

- Page structure: `src/site-builder.json` and `src/pages/<slug>/page.json`.
- Page-local markup: `src/pages/<slug>/sections/*`.
- Shared markup: `src/components/shared/*`.
- Parametric markup and props: `src/components/parametric/*` and `content/components/*`.
- Metadata, contacts, cluster contracts and policies: `data/*`.
- Runtime code: `main.js`, `analytics.js`, `telegram-form.js`, `styles-combined.css`.
- Backend: `server/*`.
- Root HTML, sitemap, digests, reports and deploy manifests are generated outputs.

## Editing rules

- Edit the smallest relevant source file.
- Do not manually edit root HTML when a builder source exists.
- Do not reformat unrelated files.
- Do not create reports, notes, backups, screenshots or temporary files in authoring directories.
- Put temporary output in `.artifacts/`; put durable release evidence in `reports/handoff/`.
- Do not add new instruction files. Approved instruction files are listed in `data/ai-instruction-policy.json`.
- Instruction files contain stable rules only; never append task results, metrics, dates, logs or release notes.

## Verification

- After an iteration: `npm run ai:verify -- --changed`.
- For an explicit file list: `npm run ai:verify -- --files path/a,path/b`.
- After a no-delete source overlay: `npm run apply:ai-control-lite-r5`.
- Before a release or ZIP: `npm run ai:release`.
- If a command fails, fix the source or policy; do not disable the guard.

## Instruction hygiene

- `npm run check:instruction-hygiene` protects instruction files from unrelated content.
- `npm run check:repo-hygiene` blocks new root notes, backup copies, logs, ZIP files and stray instruction files.
- Current status belongs only in `.ai/CURRENT.md` and `data/ai-current-state.json`.
- Long plans belong only in `docs/exec-plans/active/` and are moved to `completed/` when done.

## Risky zones

- `.github/workflows/*`, `deploy/*`, `.deploy/*`.
- `server/*`, `tools/*`, package scripts and lock files.
- Forms, analytics, contacts, canonicals, sitemap, structured data and indexability.
- Shared components and runtime files that affect many pages.

## Handoff

Report only what changed, files touched, checks passed and remaining manual review. Do not paste terminal logs or generated reports into instruction files.
