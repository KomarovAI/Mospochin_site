<!-- ai-instruction-file: true -->
# Documentation Instructions

## Scope

Documentation records durable architecture, contracts and decisions.

## Edit

- Update a canonical document instead of creating an overlapping note.
- Put active execution plans in `docs/exec-plans/active/`.
- Move completed plans to `docs/exec-plans/completed/`.
- Put historical material in `docs/archive/`.
- Keep current metrics and release state out of durable documents.

## Verify

Run `npm run check:instruction-hygiene` and `npm run check:repo-hygiene`.

## Do not add

Do not store chat transcripts, raw terminal output, temporary reports, duplicate instructions or unverified status summaries in `docs/`.
