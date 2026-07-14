# Live Visual Pack MVP — historical compatibility note

Автоматический post-deploy visual capture не является действующей архитектурой.

Текущее решение:

1. Основной capture выполняется локально через system Chromium и `tools/visual-local-capture.mjs`.
2. GitHub Actions visual workflows используются только вручную через `workflow_dispatch`.
3. Visual capture не запускается автоматически после deploy, push или pull request.
4. Полный контракт описан в `docs/VISUAL_CHECKS.md`.

Старые live-site tools могут использоваться только для отдельного явно запрошенного production-аудита и не должны добавляться в автоматические CI/deploy gates.
