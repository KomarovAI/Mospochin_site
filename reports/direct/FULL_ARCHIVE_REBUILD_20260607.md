# MosPochin — full project archive rebuild with conversion P0 patch

Date: 2026-06-07
Base archive: `mospochin-docs-prune-v2-pack-20260606(7).zip`
Applied patch: `mospochin-conversion-p0-runtime-attribution-patch-20260607.zip`
Output archive: `mospochin-full-project-conversion-p0-runtime-attribution-20260607.zip`

## Applied changes

- `analytics.js` — production-host whitelist for Yandex Metrika and safe goal dispatch.
- `telegram-form.js` — form attribution hidden fields and payload enrichment.
- `server/telegram-api.mjs` — Telegram message receives and displays attribution context.
- `CHANGELOG_AI.md` — patch entry added.
- `reports/direct/CONVERSION_P0_PATCH_20260607.md` — patch report.
- `reports/patches/conversion-p0-runtime-attribution.diff.md` — diff report.
- `README_CONVERSION_P0_PATCH.md` — original patch application notes copied into project root.

## Why this full archive exists

The previous output was a lightweight patch archive for applying over an existing repository.
This archive is a complete rebuilt project directory with the patch already applied.

## Recommended local flow

```bash
unzip mospochin-full-project-conversion-p0-runtime-attribution-20260607.zip -d ./work
cd ./work/Mospochin_site-main
npm run check:core
npm run check:handoff
git status
git add .
git commit -m "Fix production analytics and form attribution for Direct"
git push origin main
```

## Important manual checks after deploy

- localhost / 127.0.0.1 must not send requests to `mc.yandex.ru`.
- `mospochin.ru` must still load Yandex Metrika.
- Test lead with UTM must show page URL, page path, UTM, yclid/gclid in Telegram.
