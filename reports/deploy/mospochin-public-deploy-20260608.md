# MosPochin public deploy pack

Дата: **2026-06-08T18:27:13.847Z**

## Результат

- ZIP: `.deploy/dist/mospochin-public-deploy-20260608.zip`
- SHA256: `.deploy/dist/mospochin-public-deploy-20260608.zip.sha256`
- ZIP size: **13.65 MB**
- SHA256: `b4e2b49818106e1200c3071c472a026b92d4b24bb60aeaf9bc673e2a61d18d65`
- Staging dir: `.deploy/dist/public-runtime`

## Состав

- Manifest entries: **185**
- Copied existing files: **184**
- Generated runtime files: **1** (version.json)
- Runtime files in version.json: **185**

## Распределение по расширениям

| Extension | Count |
|---|---:|
| .css | 3 |
| .example | 1 |
| .html | 39 |
| .jpeg | 35 |
| .jpg | 9 |
| .js | 4 |
| .json | 18 |
| .mjs | 2 |
| .png | 8 |
| .service | 2 |
| .sh | 1 |
| .svg | 10 |
| .ttf | 5 |
| .txt | 2 |
| .webp | 44 |
| .woff2 | 1 |
| .xml | 1 |

## Важные решения

- Production ZIP собирается строго по `.deploy/include-files.txt`.
- `version.json` генерируется на этапе pack, если отсутствует в root проекта.
- Docs/src/reports/.ai не входят в public runtime artifact.
- Для полного AI handoff использовать `npm run handoff:pack`, для production — `npm run deploy:pack`.
