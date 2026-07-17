# MosPochin public deploy pack

Дата: **2026-07-14T19:57:54.566Z**

## Результат

- ZIP: `.deploy/dist/mospochin-dishwasher-dw4-deploy-20260714.zip`
- SHA256: `.deploy/dist/mospochin-dishwasher-dw4-deploy-20260714.zip.sha256`
- ZIP size: **25.62 MB**
- SHA256: `d4fa7f192d50c2d9fadcfeb2dc1daf09f1c808f299f1967757418e5338ab1f84`
- Staging dir: `.deploy/dist/public-runtime`

## Состав

- Manifest entries: **463**
- Copied existing files: **462**
- Generated runtime files: **1** (version.json)
- Runtime files in version.json: **463**

## Распределение по расширениям

| Extension | Count |
|---|---:|
| .css | 3 |
| .example | 1 |
| .html | 224 |
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
