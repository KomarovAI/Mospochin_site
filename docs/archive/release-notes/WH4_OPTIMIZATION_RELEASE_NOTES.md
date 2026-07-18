# WH4 lightweight optimization release

## Goal

Reduce routine handoff and production artifact weight without reducing delivered image resolution or removing any published page.

## Decisions

- Keep all published responsive assets referenced by the 500-page site.
- Keep WebP and JPEG fallback sets; no destructive recompression was applied.
- Remove only assets classified as safe-unused by `audit-unused-assets`.
- Ship original `src/media-source` masters separately from the routine source handoff.
- Build a public runtime artifact strictly from `.deploy/include-files.txt`.
- Use maximum ZIP compression for deploy, lite handoff and media-master artifacts.

## Repeatable command

```bash
npm run release:optimized
```

The command prunes verified unused assets, regenerates the deploy manifest, runs critical image/site/builder/FAQ checks, and creates three artifacts:

1. optimized public deploy;
2. optimized lite source handoff;
3. separate media-master archive.

## Quality policy

The optimization does not downscale existing responsive image breakpoints and does not lower JPEG/WebP quality. Original media masters remain available in the separate media package.
