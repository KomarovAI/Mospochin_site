# MosPochin architecture stage 1

Date: 2026-07-11
Scope: archive-only; no production deploy and no live-server changes.

## What changed

- Added `tools/sync-site-builder-manifest.mjs`.
  - Registers only page models whose rendered output is byte-identical to the current root HTML.
  - Records pending model parity and legacy HTML pages explicitly in `src/site-builder.json`.
- Added `tools/check-architecture.mjs` and made `tools/validate-site.mjs` execute a real structural gate.
  - The previous `validate-site` entrypoint was an unconditional emergency bypass.
  - The original pre-V11 strict validator is not present in this archive, so the new gate checks the contracts that are available in the current source tree.
- Fixed `tools/site-builder-parameterize-core.mjs` so `process.exit()` cannot be swallowed and fall through into a mutating migration pass during `--check`.
  - Component coverage remains an explicit warning while the migration is staged.
- Reconciled shared components and FAQ registry for the active builder set.
- Regenerated project maps, AI indexes, deploy manifest, source-complexity report and AI digest.

## Current source state

| Layer | Count | Meaning |
| --- | ---: | --- |
| Root HTML pages | 115 | Production static output in the archive |
| Source page models | 63 | Existing sectioned source models |
| Builder-registered pages | 39 | Byte-identical and safe for builder writes |
| Pending source models | 24 | Model output differs from current root HTML; reconcile before registration |
| Legacy HTML pages | 52 | No source model yet; keep legacy/data authoring path |

## Verification

Passed:

- `npm run check:core`
- `npm run check:handoff`
- `npm run check:architecture`
- `npm run site-builder:sync-manifest -- --check`
- `npm run check:site-builder`
- `npm run check:shared-components`
- `npm run check:faq-registry`
- `npm audit --audit-level=moderate`

The scale policy still reports staged-migration warnings by design: the builder does not yet cover all 115 root pages.

## Remaining blockers

1. Reconcile the 24 pending source models with their current root HTML before registering them.
2. Decide whether the 52 legacy pages should be migrated to the builder or remain a formally supported legacy branch.
3. Reconcile the metrics generation: the current client posts to `/api/track-event`, but the current server source exposes only `/health` and `/api/send-telegram`. The full previous metrics backend implementation is not present in this archive.
4. Verify the external nginx proxy and systemd release paths on the real production host before any deploy.

