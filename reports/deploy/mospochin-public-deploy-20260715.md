# MosPochin public deploy pack

Дата: **2026-07-15T22:19:26.454Z**

## Результат

- ZIP: `.deploy/dist/mospochin-public-deploy-20260715.zip`
- SHA256: `.deploy/dist/mospochin-public-deploy-20260715.zip.sha256`
- ZIP size: **56.16 MB**
- SHA256: `ae3a0d2b2726728619d67d92bd54b4c5772102c504ed0e4fbad70b5b46829525`
- Staging dir: `.deploy/dist/public-runtime`

## Состав

- Manifest entries: **813**
- Copied existing files: **812**
- Generated runtime files: **1** (version.json)
- Runtime files in version.json: **813**

## Распределение по расширениям

| Extension | Count |
|---|---:|
| .css | 3 |
| .example | 1 |
| .html | 296 |
| .jpeg | 28 |
| .jpg | 199 |
| .js | 4 |
| .json | 18 |
| .mjs | 2 |
| .png | 8 |
| .service | 2 |
| .sh | 1 |
| .svg | 10 |
| .ttf | 5 |
| .txt | 2 |
| .webp | 227 |
| .woff2 | 6 |
| .xml | 1 |

## Важные решения

- Production ZIP собирается строго по `.deploy/include-files.txt`.
- `version.json` генерируется на этапе pack, если отсутствует в root проекта.
- Docs/src/reports/.ai не входят в public runtime artifact.
- Для полного AI handoff использовать `npm run handoff:pack`, для production — `npm run deploy:pack`.
