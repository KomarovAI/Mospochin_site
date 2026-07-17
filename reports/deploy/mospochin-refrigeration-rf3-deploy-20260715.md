# MosPochin public deploy pack

Дата: **2026-07-15T08:06:47.464Z**

## Результат

- ZIP: `.deploy/dist/mospochin-refrigeration-rf3-deploy-20260715.zip`
- SHA256: `.deploy/dist/mospochin-refrigeration-rf3-deploy-20260715.zip.sha256`
- ZIP size: **33.04 MB**
- SHA256: `d1cfcccbace856c0bbd08c371f938a2512ff620ecd2513dfefc785931cbba73b`
- Staging dir: `.deploy/dist/public-runtime`

## Состав

- Manifest entries: **555**
- Copied existing files: **554**
- Generated runtime files: **1** (version.json)
- Runtime files in version.json: **555**

## Распределение по расширениям

| Extension | Count |
|---|---:|
| .css | 3 |
| .example | 1 |
| .html | 254 |
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
