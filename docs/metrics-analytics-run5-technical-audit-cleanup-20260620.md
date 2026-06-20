# MosPochin metrics Run5 — technical audit and cleanup

Дата: 2026-06-20  
Режим: archive-only, без деплоя, без VPS, без изменений в Яндекс.Метрике/Директе.

## Что проверено

- `analytics.js`, `telegram-form.js`, `server/telegram-api.mjs` проходят `node --check`.
- `npm run verify:metrics`, `npm run verify:fast`, `npm run lint`, `npm run predeploy:check`, `npm audit` проходят.
- Root HTML совпадает с site-builder output.
- Метрики имеют production-only guard и не должны стрелять на localhost/preview/staging.
- CTA visibility использует `IntersectionObserver`, а local event transport использует `sendBeacon` + `fetch keepalive` fallback.
- События Метрики остаются отдельными JavaScript event goals.

## Исправления аудита

1. Убран риск записи открытого `tel:`, `mailto:`, телефонных номеров и email из contact events:
   - frontend маскирует contact target перед `reachGoal` и `/api/track-event`;
   - backend дополнительно маскирует `href` и текстовые поля перед записью `site_events.jsonl`.
2. Исправлен backend chunked decoder: убрано двойное добавление одного chunk, из-за которого Telegram JSON мог повреждаться при chunked response.
3. Убраны дубли в backend-коде:
   - двойной spread `extraHeaders`;
   - двойной ключ `extra_field_keys` в lead log record.
4. `generate-direct-landings.mjs` теперь сохраняет `data-*` атрибуты в `<body>` при замене class и не падает на страницах без `analysisCards`.
5. Сокращены 3 длинных title в котловых brand-pages, чтобы убрать warning валидатора.
6. Удалены устаревшие промежуточные metrics run1-run4 handoff/check файлы из корня и `docs/`; вместо них оставлен этот итоговый Run5 audit handoff.

## Что намеренно не удалялось

- `assets/images/*` и responsive assets: audit-unused-assets показал `safeDelete=0`, поэтому удалять картинки из архива нельзя без риска сломать source/build graph.
- `.ai/`, `data/*`, `reports/source-complexity.*`: это generated/context файлы, которые участвуют в `check:ai`/`predeploy:check`.
- Старые не-metrics проектные документы и handoff по котлам: они относятся к контексту сайта и не являются мусором текущего metrics-прогона.

## Политика логов после cleanup

В `site_events.jsonl` допустимы только clean/redacted поля: `event`, `page_path`, `page_intent`, `cta_id`, `block`, `utm_*`, `session_id_hash`, `yclid_hash`, `ip_hash`, `user_agent_family`, `quality`, `bot_flags`.

Запрещено писать открытым текстом: телефон, имя, комментарий, IP, full user-agent, raw `tel:`, raw `mailto:`, полный WhatsApp/Telegram идентификатор.

## Новая проверка

Добавлен скрипт:

```bash
npm run audit:metrics-clean
```

Он проверяет:

- отсутствие старых metrics run1-run4 артефактов;
- отсутствие известных дублей в backend;
- наличие redaction helpers на frontend/backend;
- отсутствие title warning > 75 символов;
- устойчивость direct landing generator к новым body data-attrs и отсутствующим `analysisCards`.
