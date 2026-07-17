# MosPochin public deploy pack

Дата: **2026-07-14T19:36:38.773Z**

## Результат

- ZIP: `.deploy/dist/mospochin-dishwasher-dw3-deploy-20260714.zip`
- SHA256: `.deploy/dist/mospochin-dishwasher-dw3-deploy-20260714.zip.sha256`
- ZIP size: **25.54 MB**
- SHA256: `9dd9402a2bd47924f1efc01f20d3bed65c394b354e99916069f30fd8525f94dc`
- Staging dir: `.deploy/dist/public-runtime`

## Состав

- Manifest entries: **455**
- Copied existing files: **454**
- Generated runtime files: **1** (version.json)
- Runtime files in version.json: **455**

## Распределение по расширениям

| Extension | Count |
|---|---:|
| .css | 3 |
| .example | 1 |
| .html | 216 |
| .jpeg | 31 |
| .jpg | 57 |
| .js | 4 |
| .json | 18 |
| .mjs | 2 |
| .png | 8 |
| .service | 2 |
| .sh | 1 |
| .svg | 10 |
| .ttf | 5 |
| .txt | 2 |
| .webp | 88 |
| .woff2 | 6 |
| .xml | 1 |

## Важные решения

- Production ZIP собирается строго по `.deploy/include-files.txt`.
- `version.json` генерируется на этапе pack, если отсутствует в root проекта.
- Docs/src/reports/.ai не входят в public runtime artifact.
- Для полного AI handoff использовать `npm run handoff:pack`, для production — `npm run deploy:pack`.
