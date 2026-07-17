# MosPochin public deploy pack

Дата: **2026-07-15T20:28:13.431Z**

## Результат

- ZIP: `.deploy/dist/mospochin-refrigeration-rf8-brand-deploy-20260715.zip`
- SHA256: `.deploy/dist/mospochin-refrigeration-rf8-brand-deploy-20260715.zip.sha256`
- ZIP size: **33.48 MB**
- SHA256: `daff9f903ca2b67b2fe2dda7159cf8e577f105deb4f6711c5b7cfa5bf7b03369`
- Staging dir: `.deploy/dist/public-runtime`

## Состав

- Manifest entries: **593**
- Copied existing files: **592**
- Generated runtime files: **1** (version.json)
- Runtime files in version.json: **593**

## Распределение по расширениям

| Extension | Count |
|---|---:|
| .css | 3 |
| .example | 1 |
| .html | 292 |
| .jpeg | 28 |
| .jpg | 91 |
| .js | 4 |
| .json | 18 |
| .mjs | 2 |
| .png | 8 |
| .service | 2 |
| .sh | 1 |
| .svg | 10 |
| .ttf | 5 |
| .txt | 2 |
| .webp | 119 |
| .woff2 | 6 |
| .xml | 1 |

## Важные решения

- Production ZIP собирается строго по `.deploy/include-files.txt`.
- `version.json` генерируется на этапе pack, если отсутствует в root проекта.
- Docs/src/reports/.ai не входят в public runtime artifact.
- Для полного AI handoff использовать `npm run handoff:pack`, для production — `npm run deploy:pack`.
