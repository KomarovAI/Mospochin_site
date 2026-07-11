# MosPochin unified architecture audit

Date: 2026-07-11  
Scope: full archive; source/build/runtime checks; no production deploy.

## Final architecture

`src/pages/*` is now the single editable page layer. `src/site-builder.json` is the page registry. `src/components/shared/*` and the parameterized technical components are the only reusable section layers. Root `*.html` files are generated production output.

The runtime contract is also explicit:

- `analytics.js` sends redacted events through `/api/track-event` and keeps Yandex Metrika behind a production-host guard.
- `telegram-form.js` owns form submission and attribution fields.
- `server/telegram-api.mjs` owns Telegram delivery, event validation, rate limits, hashing and JSONL logs.
- `data/metrics-event-contract.json` defines the event and privacy contract.

## Source/build state

| Layer | Count | Status |
| --- | ---: | --- |
| Root HTML pages | 115 | generated production output |
| Source page models | 115 | complete |
| Builder-registered pages | 115 | byte-identical |
| Pending source models | 0 | clear |
| Legacy HTML pages | 0 | clear |
| Shared section refs | 271 | active |
| Parameterized section refs | 1,319 | active |

The registry is `status: source-of-truth` with `migration.mode: unified-source-parity`.

## Changes applied

- Converted all production pages to lossless sectioned source models from the archive’s current root HTML baseline.
- Registered all pages only after byte-level render parity.
- Extracted repeated sections into shared components and restored safe parameterization for technical/mount sections.
- Replaced the `validate-site` emergency bypass with a real architecture gate.
- Removed duplicate legacy Yandex Metrika noscript pixels; analytics remains JS-only and production-host gated.
- Added the missing `/api/track-event` backend with allowlisted events, origin/rate-limit checks, redaction, hashing, accepted/rejected event logs and lead logs.
- Added metrics contract, markup, runtime, legacy-pixel and API smoke checks to the project workflow.
- Removed temporary check bypasses so scale and parameterized checks report real state.

## Verification

Passed in the archive:

- `npm run check:architecture`
- `npm run check:site-builder`
- `npm run check:shared-components`
- `npm run check:parameterized-components`
- `npm run check:metrics`
- `npm run check:metrics-markup`
- `node tools/check-conversion-runtime.mjs`
- `node tools/audit-metrics-clean.mjs`
- runtime API smoke for accepted/unknown/bad-origin events and PII redaction
- `npm run smoke:metrics`
- `npm run check:doctor` (109/109 branch pages)
- `npm run guard:scale`
- `npm audit --audit-level=moderate`

The non-visual full profile also passed through image budgets and responsive/WebP checks. The screenshot step was not executable in this archive environment because `node_modules/playwright` is not installed; the source package and lockfile declare it as a dev dependency.

## Operational note

The archive does not prove the external production nginx/systemd wiring. Before deploy, set `MOSPOCHIN_LOG_DIR` to the production log directory and verify the proxy routes `/api/track-event` and `/api/send-telegram` to the same API process.
