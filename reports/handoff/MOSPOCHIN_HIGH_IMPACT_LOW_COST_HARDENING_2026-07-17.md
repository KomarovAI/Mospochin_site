# MosPochin — high-impact / low-cost hardening

**Date:** 2026-07-17

## Implemented

1. Machine-readable `artifact.json` contract for source, lite handoff, media masters and public deploy artifacts.
2. ZIP guard that rejects wrong artifact types, non-deployable archives, unsafe paths and incomplete public runtime packages.
3. Compact `handoff:lite` pack excluding media masters, generated build output and nested artifacts.
4. Separate `media:pack` for original service-photo masters.
5. Unified `release:prepare` pipeline: clean dependency install, CSS build, CSS guard, Nginx guard, core checks, visual smoke, deploy manifest, deploy ZIP, artifact verification and ZIP integrity.
6. Nginx hardening snippet that blocks public access to `server/`, `tools/`, `deploy/`, `.deploy/` and `package.json` while preserving the public `data/` JSON required by the frontend.
7. No-cache policy for the four core CSS/JS shell files to prevent stale CSS after deploy.
8. Gzip for text assets.
9. Repository hygiene policy updated so generated archives and deploy staging are allowed only in canonical artifact directories.

## New operator commands

```bash
npm run release:prepare
npm run handoff:lite
npm run media:pack
npm run artifact:verify -- /absolute/path/to/archive.zip --expect-type public-deploy --deployable
bash deploy/verify-artifact.sh /absolute/path/to/archive.zip public-deploy
npm run check:nginx-hardening
```

## Verification completed

- `check:core`: 72/72 steps passed.
- HTML head: 296/296.
- Builder parity: 296/296.
- Crawl: 296 HTML, 278 sitemap URLs, 0 issues.
- Core CSS guard: 13 selectors, 4 pages.
- Visual smoke: 8/8 PNG captures.
- Public deploy artifact contract: passed.
- ZIP integrity: passed.
- `npm audit`: 0 vulnerabilities.

## Important operational note

The Nginx snippet is included in the project and public deploy pack, but it becomes active only after `deploy/nginx/apply-nginx.sh` is executed on the VPS and `nginx -t` succeeds.

GitHub Actions concurrency and signed artifact attestations were not activated because the canonical production workflow is intentionally not stored in this source archive. They should be added in the repository that owns `.github/workflows/deploy.yml`.
