# MosPochin public deploy pack

Дата: **2026-07-18T13:33:14.082Z**

## Результат

- ZIP: `.deploy/dist/mospochin-public-deploy-20260718.zip`
- SHA256: `.deploy/dist/mospochin-public-deploy-20260718.zip.sha256`
- ZIP size: **104.62 MB**
- SHA256: `05e3c0f2130eb2516a679ef75b2a67d72eb1df005d2a0a4fa614ccdd03aacf5c`
- Staging dir: `.deploy/dist/public-runtime`

## Состав

- Manifest entries: **1686**
- Copied existing files: **1685**
- Generated runtime files: **2** (version.json, artifact.json)
- Runtime files in version.json: **1687**

## Распределение по расширениям

| Extension | Count |
|---|---:|
| .avif | 12 |
| .conf | 2 |
| .css | 3 |
| .example | 1 |
| .html | 500 |
| .jpeg | 12 |
| .jpg | 546 |
| .js | 3 |
| .json | 19 |
| .mjs | 2 |
| .png | 8 |
| .service | 2 |
| .sh | 3 |
| .svg | 2 |
| .ttf | 5 |
| .txt | 2 |
| .webp | 558 |
| .woff2 | 6 |
| .xml | 1 |

## Важные решения

- Production ZIP собирается строго по `.deploy/include-files.txt`.
- `version.json` генерируется на этапе pack, если отсутствует в root проекта.
- Docs/src/reports/.ai не входят в public runtime artifact.
- Для полного AI handoff использовать `npm run handoff:pack`, для production — `npm run deploy:pack`.
