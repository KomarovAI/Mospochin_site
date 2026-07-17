# MosPochin public deploy pack

Дата: **2026-07-15T18:01:15.261Z**

## Результат

- ZIP: `.deploy/dist/mospochin-refrigeration-rf6-deploy-20260715.zip`
- SHA256: `.deploy/dist/mospochin-refrigeration-rf6-deploy-20260715.zip.sha256`
- ZIP size: **33.28 MB**
- SHA256: `9be00d7d7869977c1a7a83ff7e5a8bb369c202d5ad1a3f5b4c52bd67d6ac3e2d`
- Staging dir: `.deploy/dist/public-runtime`

## Состав

- Manifest entries: **577**
- Copied existing files: **576**
- Generated runtime files: **1** (version.json)
- Runtime files in version.json: **577**

## Распределение по расширениям

| Extension | Count |
|---|---:|
| .css | 3 |
| .example | 1 |
| .html | 276 |
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
