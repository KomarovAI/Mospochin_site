# MosPochin public deploy pack

Дата: **2026-07-15T08:55:41.289Z**

## Результат

- ZIP: `.deploy/dist/mospochin-refrigeration-rf4-deploy-20260715.zip`
- SHA256: `.deploy/dist/mospochin-refrigeration-rf4-deploy-20260715.zip.sha256`
- ZIP size: **33.12 MB**
- SHA256: `8d46891765410c70e64e9c1452bb8878a40877e7805890f010d4e11c405895fa`
- Staging dir: `.deploy/dist/public-runtime`

## Состав

- Manifest entries: **563**
- Copied existing files: **562**
- Generated runtime files: **1** (version.json)
- Runtime files in version.json: **563**

## Распределение по расширениям

| Extension | Count |
|---|---:|
| .css | 3 |
| .example | 1 |
| .html | 262 |
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
