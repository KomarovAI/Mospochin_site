# MosPochin — AI visual review workflow

Этот документ фиксирует обязательный цикл для визуальных правок сайта. Статические guards не заменяют просмотр PNG.

## Основной цикл

```bash
npm run build:site -- --write
npm run sync:generated
npm run check:core
npm run setup:visual
npm run audit:visual-smoke
npm run visual:workmode
# открыть PNG, зафиксировать подтверждённые issues, внести правки
npm run audit:visual-smoke -- --fresh
npm run check:visual-contract
npm run check:visual-workflows
```

Основной renderer — системный Chromium через `page.setContent + route.fulfill`.
Локальный visual не зависит от localhost, `file://`, Firefox sandbox или скачивания browser binaries.

Полная архитектура и параметры запуска: `docs/VISUAL_CHECKS.md`.

## Что смотрит AI/ревьюер

- Первый экран сразу объясняет услугу и основной CTA.
- Header/urgent bar не перекрывают hero.
- На mobile 390/393 fixed contact surface не перекрывает текст, форму и кнопки.
- Нет горизонтального overflow.
- Форма читается, labels/placeholders не обрезаны.
- Desktop 1440 не содержит сломанной сетки, налезаний и необъяснимых пустот.
- Hub, service, article и Direct landing визуально различаются.
- Не видны служебные слова: `SEO-блок`, `hub`, `handoff`, `generated`, `runtime`, `P0/P1`.
- Телефон и WhatsApp соответствуют production-контракту.
- Нет визуальных нулей в KPI/proof.

## First-view и full-page проверяются отдельно

Для hero/header/CTA:

```bash
npm run visual:capture -- \
  --manifest data/sous-vide-screenshot-audit.json \
  --mode first-view \
  --output .artifacts/screenshots/sous-vide/review-first
```

Для всей страницы:

```bash
npm run visual:capture -- \
  --manifest data/sous-vide-screenshot-audit.json \
  --mode full-page \
  --output .artifacts/screenshots/sous-vide/review-full
```

На mobile full-page фиксированная контактная панель скрывается только в audit DOM, чтобы Chromium
не повторял fixed surface поверх длинного stitched-кадра. В first-view она остаётся видимой и проверяется как UI.

## Возобновляемый прогон

Локальный launcher сохраняет fingerprint, page state, логи и SHA-256 PNG. Если внешний процесс прерван,
повторная команда продолжает только незавершённые страницы. `--fresh` используется, когда нужен полностью новый evidence pack.

## GitHub fallback

GitHub Actions используется только вручную:

```text
Actions → Visual Audit (manual fallback) → Run workflow
Actions → Visual Targeted Mobile (manual fallback) → Run workflow
```

Автоматические visual triggers запрещены и проверяются `npm run check:visual-workflows`.
Не предлагать GitHub первым способом, пока `npm run check:visual-env` подтверждает локальный Chromium.

## Финальный отчёт

Указать:

1. manifest и режим;
2. system Chromium path;
3. число PNG;
4. artifact directory;
5. какие PNG реально просмотрены;
6. найденные/исправленные дефекты;
7. использовался ли manual GitHub fallback.
