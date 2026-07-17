# MosPochin public deploy pack

Дата: **2026-07-14T19:15:52.146Z**

## Результат

- ZIP: `.deploy/dist/mospochin-dishwasher-dw2-deploy-20260714.zip`
- SHA256: `.deploy/dist/mospochin-dishwasher-dw2-deploy-20260714.zip.sha256`
- ZIP size: **25.48 MB**
- SHA256: `3b505d77cd72f55e638adb0b4bc9944ce825779e0d46c6e37c84b458ca88eed1`
- Staging dir: `.deploy/dist/public-runtime`

## Состав

- Manifest entries: **449**
- Copied existing files: **448**
- Generated runtime files: **1** (version.json)
- Runtime files in version.json: **449**

## Распределение по расширениям

| Extension | Count |
|---|---:|
| .css | 3 |
| .example | 1 |
| .html | 210 |
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
