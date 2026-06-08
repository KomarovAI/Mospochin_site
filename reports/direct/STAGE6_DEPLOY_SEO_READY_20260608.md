# MosPochin — Stage6 deploy + SEO hygiene ready

Дата: **2026-06-08**
База: `mospochin-site-direct-conversion-stage5-ready-20260608.zip`

## Что сделано

### 1. Production deploy packer

Добавлены команды:

```bash
npm run deploy:pack
npm run check:deploy-runtime
npm run smoke:production-conversion
```

Добавлены файлы:

```text
tools/deploy-pack.mjs
tools/check-deploy-runtime.mjs
tools/smoke-production-conversion.mjs
```

`deploy:pack` собирает отдельный production ZIP только из `.deploy/include-files.txt`.
Это отдельный runtime/public artifact, не handoff/dev архив.

Результат pack:

```text
.deploy/dist/mospochin-public-deploy-20260608.zip
.deploy/dist/mospochin-public-deploy-20260608.zip.sha256
reports/deploy/mospochin-public-deploy-20260608.md
```

Важно: `version.json` указан в deploy-manifest, но отсутствует в root проекта. Теперь `deploy:pack` генерирует его в staging/public ZIP на этапе сборки и фиксирует это в отчёте.

### 2. Deploy runtime guard

`check-deploy-runtime` проверяет:

- `.deploy/include-files.txt` без дублей;
- обязательные runtime-файлы;
- `version.json` как generated-by-pack файл;
- отсутствие приватных путей `docs/`, `reports/`, `.ai/`, `src/`, `node_modules/` в public manifest;
- наличие `robots.txt`, `sitemap.xml`, `data/runtime-config.json`;
- production sitemap в `robots.txt`;
- наличие `parokonvektomaty.html` в sitemap.

Guard встроен в `check:core` через `tools/check-profile.mjs`.

### 3. Production smoke check

`smoke:production-conversion` проверяет живой домен после раскатки:

```bash
npm run smoke:production-conversion
npm run smoke:production-conversion -- --base https://mospochin.ru
```

По умолчанию он не отправляет тестовую заявку. Для ручного теста Telegram/API:

```bash
npm run smoke:production-conversion -- --submit-test-lead
```

Этот режим отправляет явно помеченную smoke-test заявку.

### 4. SEO title micro-fix

Укорочены title на страницах, где длина была больше 70 символов:

```text
parokonvektomat-rational.html
parokonvektomat-unox.html
parokonvektomaty-promo.html
remont-oborudovaniya-restorana-parokonvektomat.html
parokonvektomat-e02-e07-e10.html
```

Теперь быстрый SEO spot-check показывает:

```text
long titles >70: 0
```

### 5. Schema hygiene

Добавлен `data-stage6-schema` JSON-LD для общих хабов/страниц услуг:

```text
index.html
uslugi.html
bytovaya-index.html
bytovaya-uslugi.html
```

Разметка добавлена в source-файлы `src/pages/**/head.html` и затем применена через `npm run build:site -- --write`.

### 6. Generated слой обновлён

Выполнено:

```bash
npm run generate:faq-registry
npm run build:site -- --write
npm run sync:generated
```

## Проверки

Успешно пройдены:

```bash
node --check tools/deploy-pack.mjs
node --check tools/check-deploy-runtime.mjs
node --check tools/smoke-production-conversion.mjs
npm run check:deploy-runtime
npm run check:core
npm run check:handoff
npm run check:images
npm run deploy:pack
```

Ключевые результаты:

```text
39 pages validated
16 parokonvektomat pages passed conversion UI check
check:core passed
check:handoff passed
check:images passed
npm audit: 0 vulnerabilities
safeDelete assets: 0
long titles >70: 0
stage6 schema missing: none
public deploy files: 185
public deploy ZIP: ~14 MB
```

`npm run check:full` был запущен отдельно, но в данной среде общий длинный прогон упёрся в timeout на этапе `generate-webp-sidecars --check`. При этом `npm run check:images` отдельно прошёл успешно, включая `generate-webp-sidecars --check`, поэтому это считается лимитом среды, а не поломкой проекта.

## Что осталось после stage6

После раскатки на VPS нужно выполнить production-проверку:

```bash
npm run smoke:production-conversion -- --base https://mospochin.ru
```

И вручную проверить:

- открытие `/version.json`;
- загрузку Метрики только на production host;
- отсутствие отправки Метрики с localhost;
- работу phone/WhatsApp/form events;
- Telegram-заявку с UTM, `yclid`, `ym_client_id`, `page_url`, `page_path`, `referrer`;
- чистую production-only Метрику через 1–3 дня после выката.
