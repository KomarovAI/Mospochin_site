# Visual checks — локальный нативный screenshot-контур

## Архитектурное правило

Основной способ снимать скриншоты в рабочей среде проекта:

```text
system Chromium
→ Playwright
→ page.setContent(root HTML)
→ route.fulfill(local CSS/JS/images)
→ PNG в .artifacts/screenshots/**
```

Локальный контур **не поднимает HTTP-сервер**, не открывает `localhost` и не требует `file://`.
Это принципиально: управляемая Chromium policy может блокировать обычную навигацию через
`URLBlocklist`, но не мешает рендеру уже открытого `about:blank` через `page.setContent()`.

GitHub Actions — только ручной резервный контур. Visual workflows должны иметь исключительно
`workflow_dispatch`; автоматические `push`, `pull_request`, `schedule` и `workflow_call` запрещены.

## Быстрый запуск

```bash
npm ci
npm run setup:visual
npm run check:visual-contract
npm run audit:visual-smoke
```

`npm run setup:visual` ничего не скачивает. Команда проверяет:

- наличие Playwright в `node_modules`;
- наличие системного Chromium;
- запуск Chromium headless;
- загрузку HTML/CSS/JS/images через local-content router;
- создание валидного PNG;
- наличие Python Pillow для детерминированной сборки длинных mobile-кадров.

Ожидаемый системный браузер ищется в следующем порядке:

1. `PLAYWRIGHT_CHROMIUM_EXECUTABLE`;
2. `CHROMIUM_PATH`;
3. `/usr/bin/chromium`;
4. `/usr/bin/chromium-browser`;
5. `/usr/bin/google-chrome`;
6. `/usr/bin/google-chrome-stable`.

## Главные команды

### Быстрый first-view smoke

```bash
npm run audit:visual-smoke
```

Результат:

```text
.artifacts/screenshots/visual-smoke/native-first-view/
```

### Длинные full-page кадры smoke-набора

```bash
npm run audit:visual-smoke:full
```

### Универсальный запуск любого manifest

```bash
npm run visual:capture -- \
  --manifest data/sous-vide-screenshot-audit.json \
  --mode both \
  --output .artifacts/screenshots/sous-vide/native
```

Режимы:

- `first-view` — только первый viewport, подходит для hero/header/CTA;
- `full-page` — длинная страница;
- `manifest` — использовать `fullPage` из manifest;
- `both` — отдельно `first-view/` и `full-page/`.

Дополнительные параметры:

```bash
--page page-a.html,page-b.html
--workers 2
--worker-timeout-ms 120000
--retries 1
--fresh
--json
```

## Надёжность и восстановление

`tools/visual-local-capture.mjs` запускает каждую страницу в отдельном Chromium worker-процессе.
Для каждого кадра проверяются PNG signature, размер и SHA-256. Mobile full-page снимается viewport-частями системным Chromium и сшивается предустановленным Python Pillow; это устраняет зависания Chromium на очень высоких страницах.

По умолчанию запуск возобновляемый:

- создаётся общий visual fingerprint HTML + manifest + локальных assets;
- после успешной страницы пишется `.state/<page>.json`;
- повторный запуск пропускает только страницы с совпавшим fingerprint и валидными PNG;
- при изменении HTML, manifest или assets страница снимается заново;
- stdout/stderr каждого worker сохраняются в `.logs/`;
- зависший worker завершается по timeout и повторяется.

Полностью переснять набор:

```bash
npm run visual:capture -- \
  --manifest data/sous-vide-screenshot-audit.json \
  --mode both \
  --output .artifacts/screenshots/sous-vide/native \
  --fresh
```

## Готовые cluster-команды

```bash
npm run audit:visual-pariki
npm run audit:cooking-kettles-screenshots
npm run audit:ventilation-screenshots
npm run audit:restaurant-screenshots
npm run audit:sous-vide-screenshots
```

Все эти команды используют один local-native runtime. Отдельный sous-vide shell-костыль больше не является архитектурой.

## Контрактные проверки

```bash
npm run check:visual-env
npm run check:visual-contract
npm run check:visual-workflows
npm run check:visual
```

- `check:visual-env` — реальный Chromium probe с PNG;
- `check:visual-contract` — manifests, registry и npm scripts;
- `check:visual-workflows` — GitHub visual workflows только `workflow_dispatch`;
- `check:visual` — env + contracts + local first-view smoke.

## GitHub Actions — ручной резерв

Резервные workflows:

```text
.github/workflows/visual-audit.yml
.github/workflows/visual-targeted-mobile.yml
```

Их запускают вручную через **Actions → Run workflow**. Они не должны запускаться от commit, PR,
расписания или другого workflow.

Firefox для резервного GitHub runner ставится только явной командой:

```bash
npm run setup:visual:github
```

Не использовать `setup:visual:github` в локальном штатном цикле. Он нужен только тогда, когда
системный Chromium действительно отсутствует или сломан и пользователь вручную выбрал GitHub fallback.

## Что хранить и что не хранить

Source of truth:

- `data/visual-runtime.json`;
- `tools/visual-local-runtime.mjs`;
- `tools/visual-local-capture.mjs`;
- `tools/audit-screenshots.mjs`;
- `data/*screenshot-audit.json`;
- этот документ;
- ручные GitHub fallback workflows.

Не включать в основной source ZIP:

- `.artifacts/screenshots/**`;
- `.state/` и `.logs/` из screenshot output;
- Playwright browser binaries;
- `.cache/ms-playwright`;
- `node_modules`.

PNG-пак можно передавать отдельно как evidence конкретного visual review.

## Формулировка финального QA

Успешный локальный прогон:

```text
local-native visual passed — system Chromium, Playwright local-content,
artifacts: .artifacts/screenshots/<scope>/<run>
```

Ручной GitHub fallback:

```text
local-native visual unavailable — причина указана точно;
manual GitHub workflow_dispatch fallback passed, artifact: <workflow artifact name>
```

Нельзя писать, что visual review пройден, если PNG фактически не созданы и не открыты для просмотра.
