# MosPochin public deploy pack

Дата: **2026-07-15T06:20:25.437Z**

## Результат

- ZIP: `.deploy/dist/mospochin-dishwasher-images-deploy-20260715.zip`
- SHA256: `.deploy/dist/mospochin-dishwasher-images-deploy-20260715.zip.sha256`
- ZIP size: **34.16 MB**
- SHA256: `3bf3832980794fbdf4f52c71f9e49879e166266f882d378a16de246facf3eac4`
- Staging dir: `.deploy/dist/public-runtime`

## Состав

- Manifest entries: **553**
- Copied existing files: **552**
- Generated runtime files: **1** (version.json)
- Runtime files in version.json: **553**

## Распределение по расширениям

| Extension | Count |
|---|---:|
| .css | 3 |
| .example | 1 |
| .html | 242 |
| .jpeg | 31 |
| .jpg | 93 |
| .js | 4 |
| .json | 18 |
| .mjs | 2 |
| .png | 8 |
| .service | 2 |
| .sh | 1 |
| .svg | 10 |
| .ttf | 5 |
| .txt | 2 |
| .webp | 124 |
| .woff2 | 6 |
| .xml | 1 |

## Важные решения

- Production ZIP собирается строго по `.deploy/include-files.txt`.
- `version.json` генерируется на этапе pack, если отсутствует в root проекта.
- Docs/src/reports/.ai не входят в public runtime artifact.
- Для полного AI handoff использовать `npm run handoff:pack`, для production — `npm run deploy:pack`.
