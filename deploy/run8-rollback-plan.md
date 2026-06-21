# MosPochin — Run8 Rollback Plan

Дата: 2026-06-21

## Rollback trigger

Откатывать или останавливать выкладку, если после deploy:

- `/api/track-event` не отвечает `ok`;
- `/api/send-telegram` не принимает заявку;
- `site_events.jsonl` не пишется;
- `site_event_rejects.jsonl` растёт аномально;
- ключевые страницы не отдают HTTP 200;
- формы не открываются или не отправляются;
- JS blocker errors на ключевых страницах;
- sitemap/canonical/noindex расходятся с P6/P7 QA.

## Safe rollback

```bash
set -e
# 1. остановить backend/app, если деплой менял server слой
# 2. восстановить backup static root
# 3. восстановить backup server/config только если он менялся
# 4. НЕ удалять site_events.jsonl и site_event_rejects.jsonl
# 5. перезапустить backend/app
# 6. повторить smoke /api/track-event и /api/send-telegram
```

## После rollback

- Зафиксировать точную ошибку.
- Не менять Директ.
- Сравнить diff только по слою, который сломал smoke.
