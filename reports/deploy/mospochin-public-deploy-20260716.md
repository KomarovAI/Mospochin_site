# MosPochin public deploy pack

Дата: **2026-07-16T05:26:05.421Z**

## Результат

- ZIP: `.deploy/dist/mospochin-public-deploy-20260716.zip`
- SHA256: `.deploy/dist/mospochin-public-deploy-20260716.zip.sha256`
- ZIP size: **56.25 MB**
- SHA256: `f7ea53db6537558b43fcbf30e36d2fd9f0b237966381a29e54cf02831728a15a`
- Staging dir: `.deploy/dist/public-runtime`

## Состав

- Manifest entries: **812**
- Copied existing files: **811**
- Generated runtime files: **1** (version.json)
- Runtime files in version.json: **812**

## Распределение по расширениям

| Extension | Count |
|---|---:|
| .css | 3 |
| .example | 1 |
| .html | 296 |
| .jpeg | 28 |
| .jpg | 199 |
| .js | 3 |
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
