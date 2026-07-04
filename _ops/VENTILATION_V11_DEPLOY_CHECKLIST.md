# MosPochin V11 Ventilation — deploy checklist

Дата: 2026-07-04

## Используемый пакет

До добавления run18 ops исходный V11 ZIP имел SHA256:

```text
23b3e45447b4762cca250797fb80f590e2c8ab3d38af1cb5d7e59df872cd42bc
```

После добавления run18 safety-файлов использовать финальный архив `*_FINAL_WITH_RUN18.zip`; его SHA256 зафиксирован в `run18_deploy_safety_summary.json`.

## Правило NOFONTS

Пакет не содержит font binaries. Production-шрифты нельзя удалять. Выкладка только через safe deploy-control с preflight, dry-run и exclude/filter для шрифтов.

## Последовательность

1. Проверить SHA256 финального ZIP.
2. Распаковать ZIP в staging-каталог, не поверх production docroot.
3. Выполнить локальный preflight, если staging доступен локально.
4. Выполнить remote preflight на production VPS.
5. Проверить production fonts до rsync.
6. Сделать backup production docroot.
7. Выполнить rsync dry-run и вручную проверить удаления.
8. Убедиться, что dry-run не удаляет font binaries.
9. Выполнить safe rsync через `_ops/deploy_control_v9.sh` или существующую safe-процедуру.
10. Проверить production fonts после rsync.
11. Выполнить static smoke:

```bash
BASE_URL=https://mospochin.ru ./_ops/postdeploy_ventilation_smoke_v11.sh
```

12. Выполнить event-readiness smoke без отправки фейковых событий:

```bash
BASE_URL=https://mospochin.ru ./_ops/postdeploy_ventilation_event_smoke_v11.sh
```

13. После первых реальных посещений собрать аналитику на artikk:

```bash
./_ops/artikk_collect_and_review_v9.sh artikk-local ./postdeploy_review_v11_ventilation
```

## Реклама

Direct API write, бюджет и автостратегии не трогать до clean-action событий: `phone_click`, `whatsapp_click`, `form_open`, `form_start`, `form_submit_attempt`, `form_submit_success`.

## Rollback

Rollback делать существующим `_ops/rollback_v6.sh` или production backup, созданным deploy-control. После rollback снова проверить главную, услуги, пароконвектоматы, хаб вентиляции и формы.
