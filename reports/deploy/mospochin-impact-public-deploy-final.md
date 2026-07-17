# MosPochin public deploy pack

Дата: **2026-07-17T10:11:45.378Z**

## Результат

- ZIP: `.deploy/dist/mospochin-impact-public-deploy-final.zip`
- SHA256: `.deploy/dist/mospochin-impact-public-deploy-final.zip.sha256`
- ZIP size: **52.01 MB**
- SHA256: `53b3581436de086f266307345c4f69aa60d181ad7542d8083181cd7eaa257eb0`
- Staging dir: `.deploy/dist/public-runtime`

## Состав

- Manifest entries: **800**
- Copied existing files: **799**
- Generated runtime files: **2** (version.json, artifact.json)
- Runtime files in version.json: **801**

## Распределение по расширениям

| Extension | Count |
|---|---:|
| .conf | 2 |
| .css | 3 |
| .example | 1 |
| .html | 296 |
| .jpeg | 20 |
| .jpg | 199 |
| .js | 3 |
| .json | 19 |
| .mjs | 2 |
| .png | 8 |
| .service | 2 |
| .sh | 3 |
| .svg | 10 |
| .ttf | 5 |
| .txt | 2 |
| .webp | 219 |
| .woff2 | 6 |
| .xml | 1 |

## Важные решения

- Production ZIP собирается строго по `.deploy/include-files.txt`.
- `version.json` генерируется на этапе pack, если отсутствует в root проекта.
- Docs/src/reports/.ai не входят в public runtime artifact.
- Для полного AI handoff использовать `npm run handoff:pack`, для production — `npm run deploy:pack`.
