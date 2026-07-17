# MosPochin public deploy pack

Дата: **2026-07-15T20:45:17.492Z**

## Результат

- ZIP: `.deploy/dist/mospochin-refrigeration-rf9-final-deploy-20260715.zip`
- SHA256: `.deploy/dist/mospochin-refrigeration-rf9-final-deploy-20260715.zip.sha256`
- ZIP size: **33.51 MB**
- SHA256: `8a1dbe88356df92ecfb70f31f7742c445b9108f844444b8a210eaded0c2afe13`
- Staging dir: `.deploy/dist/public-runtime`

## Состав

- Manifest entries: **597**
- Copied existing files: **596**
- Generated runtime files: **1** (version.json)
- Runtime files in version.json: **597**

## Распределение по расширениям

| Extension | Count |
|---|---:|
| .css | 3 |
| .example | 1 |
| .html | 296 |
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
