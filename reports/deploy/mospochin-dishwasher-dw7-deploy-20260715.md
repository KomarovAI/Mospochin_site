# MosPochin public deploy pack

Дата: **2026-07-14T22:32:52.945Z**

## Результат

- ZIP: `.deploy/dist/mospochin-dishwasher-dw7-deploy-20260715.zip`
- SHA256: `.deploy/dist/mospochin-dishwasher-dw7-deploy-20260715.zip.sha256`
- ZIP size: **25.83 MB**
- SHA256: `b96db97da8c633cb37350798e00265a36ee9e752b623ac38b8608ec562173af7`
- Staging dir: `.deploy/dist/public-runtime`

## Состав

- Manifest entries: **481**
- Copied existing files: **480**
- Generated runtime files: **1** (version.json)
- Runtime files in version.json: **481**

## Распределение по расширениям

| Extension | Count |
|---|---:|
| .css | 3 |
| .example | 1 |
| .html | 242 |
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
