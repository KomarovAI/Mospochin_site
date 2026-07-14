# Archive hygiene for MosPochin

Полный project ZIP и public deploy ZIP — это разные артефакты.

## Правило

Полный project ZIP должен содержать source/work layer проекта, но не должен тащить внутрь уже собранные deploy ZIP, browser screenshots, heavy logs и временные артефакты.

Для source/handoff-архива используется:

```bash
npm run handoff:pack
```

Перед ним:

```bash
npm run check:handoff
npm run ai:change-manifest
```

## Что исключается из полного project ZIP

Handoff pack автоматически исключает:

```text
.git/  node_modules/  .cache/  .artifacts/  build/
reports/visual-*  reports/visual-audit/  **/__pycache__/
*.zip  *.log
```

Это защищает от попадания сборок, браузеров, старых скриншот-паков и вложенных ZIP в handoff.

## Проверка размера

Перед передачей архива:

```bash
npm run clean:workspace
npm run check:handoff
npm run handoff:pack
```

Для реальной очистки только воспроизводимых локальных артефактов:

```bash
npm run clean:workspace:apply
```

Команда удаляет `.artifacts/`, `.cache/`, `build/` и старые visual-паки, но сохраняет `reports/visual-p2-final-20260713`, `reports/handoff/`, source, data и assets.

После этого отдавать два отдельных файла:

```text
mospochin-site-*.zip                # source/handoff archive
mospochin-public-deploy-*.zip       # public deploy pack, если его создаёт deploy-процесс
```

Не вкладывать один ZIP внутрь другого.
