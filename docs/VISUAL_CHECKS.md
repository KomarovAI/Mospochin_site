# Visual checks / screenshot audit

Этот проект умеет делать браузерный visual smoke через Playwright: поднимается локальный `tools/dev-server.mjs`, открываются root HTML-страницы в desktop/mobile viewport, снимаются PNG-скриншоты в `.artifacts/screenshots/**`.

## Быстрый маршрут

```bash
npm ci
npm run setup:visual
npm run check:visual-env
npm run audit:visual-smoke
```

Если в среде уже есть системный Chromium, но Playwright-браузер скачать нельзя:

```bash
npm ci
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run check:visual-env
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/chromium npm run audit:visual-smoke
```

Если `setup:visual` не может поставить системные зависимости, но зависимости уже стоят:

```bash
npm run setup:visual:browsers
npm run audit:visual-smoke
```

## Полный visual по пароконвектоматному кластеру

```bash
npm run check:visual
# или явно:
npm run audit:visual-pariki
```

## Что добавлено специально для AI/CI

- `npm run setup:visual` — `npx playwright install --with-deps chromium`.
- `npm run setup:visual:browsers` — fallback без apt/system deps.
- `npm run check:visual-env` — быстрый тест: может ли среда открыть локальную страницу через Chromium.
- `npm run audit:visual-smoke` — быстрый smoke: ключевые страницы, desktop 1440 и mobile 393.
- `npm run audit:visual-pariki` / `npm run check:visual` — полный screenshot audit пароконвектоматного кластера.

## Важные ограничения

Не кладём в архив `node_modules`, браузерные binaries и готовые screenshots как source of truth. Они зависят от ОС/архитектуры и раздувают архив. Архив должен хранить скрипты, manifests и документацию; браузер ставится в среде.

Если среда блокирует browser navigation политикой Chromium (`ERR_BLOCKED_BY_ADMINISTRATOR`) или не даёт скачать browser binaries, это не ошибка сайта. Тогда visual smoke нужно запускать на локальной машине, VPS, GitHub Actions runner или в официальном Playwright Docker image.

## Финальное правило для отчёта

В каждом финальном QA надо явно писать одно из двух:

```text
visual-smoke passed — screenshots сняты, artifacts: .artifacts/screenshots/visual-smoke
```

или:

```text
visual-smoke skipped/failed by environment — указать точную причину: нет Playwright browser, нет system deps, DNS/download blocked, Chromium policy blocked.
```
