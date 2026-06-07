# MosPochin — Stage 2 Conversion Runtime Pack

Дата: 2026-06-07

## Что сделано

1. `telegram-form.js`
   - добавлена mini diagnostic runtime-вставка для кластера пароконвектоматов: бренд, симптом, код ошибки;
   - добавлен расчёт `leadQuality` (`HIGH` / `MEDIUM` / `LOW`) по интенту страницы, бренду, коду ошибки, B2B-словам и телефону;
   - добавлено сохранение последнего черновика лида в `localStorage` (`mospochin_last_lead_draft_v2`);
   - добавлен WhatsApp fallback при ошибке отправки формы;
   - добавлен post-submit WhatsApp CTA для отправки фото ошибки/шильдика;
   - в payload добавлены `pageIntent`, `leadQuality`, `timeToSubmitMs`, `device`.

2. `server/telegram-api.mjs`
   - Telegram-сообщение преобразовано в более информативную карточку;
   - добавлены блоки: качество лида, интент, детали формы, UX-сигналы, реклама/атрибуция, первое касание;
   - расширен whitelist/sanitize для новых runtime-полей.

3. `main.js`
   - WhatsApp-ссылки получают page-specific prefill по страницам пароконвектоматов;
   - к WhatsApp-тексту автоматически добавляется текущая страница;
   - добавлен безопасный debug-режим без новой root-страницы: открыть любую страницу с `?lead_debug=1`.

## Как проверить debug-режим

Пример:

```text
/parokonvektomaty.html?utm_source=debug&utm_medium=test&utm_campaign=stage2&yclid=test_yclid&lead_debug=1
```

Внизу страницы появится debug-панель с проверкой:

- `analytics.js`;
- `mospochinGetAttribution`;
- `yclid`;
- `ym_client_id / metrika_client_id`;
- последнего lead draft;
- production host.

## Прогоны

Выполнено:

```bash
npm run sync:generated
npm run check:core
npm run check:handoff
```

Результат:

```text
check:core    passed
check:handoff passed
```

## Важный нюанс

Отдельную root-страницу `lead-debug.html` добавлять нельзя без расширения builder-слоя: она ломает scale-policy (`rootHtmlPages != builderPages`). Поэтому debug сделан как query-mode `?lead_debug=1` на существующих страницах.
