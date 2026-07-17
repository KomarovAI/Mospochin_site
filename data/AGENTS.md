<!-- ai-instruction-file: true -->
# Data Instructions

## Scope

These rules apply to editable registries, metadata, policies and generated JSON under `data/`.

## Edit

- Check `data/file-ownership.json` before changing an unclear file.
- Edit manual registries only; regenerate files marked generated.
- Preserve schema versions, stable identifiers and published/deferred status semantics.
- Keep shared business facts in their canonical registry instead of duplicating them in page data.

## Generate

Use the generator named in ownership metadata or the task brief. Never hand-edit project maps, AI indexes or generated link graphs.

## Verify

Run `npm run validate:data` and `npm run ai:verify -- --changed`.

## Do not add

Only data files belong here. Do not add prose notes, task reports, prompts, screenshots, backups or additional instruction files.
