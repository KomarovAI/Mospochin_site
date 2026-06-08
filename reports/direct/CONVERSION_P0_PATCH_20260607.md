# MosPochin — P0 patch: аналитика, атрибуция форм и Telegram-заявки

Дата: 2026-06-07  
Пакет: `mospochin-conversion-p0-runtime-attribution-patch-20260607.zip`  
Фокус: безопасные правки, которые можно было внести до новой production-only статистики Метрики.

## Что изменено

### 1. `analytics.js`

Добавлен production whitelist для Яндекс Метрики:

```text
mospochin.ru
www.mospochin.ru
```

Теперь Метрика и `reachGoal` не должны отправляться на:

```text
localhost
127.0.0.1
0.0.0.0
preview/dev host
```

Также добавлены runtime-флаги:

```js
window.MOSPOCHIN_RUNTIME.isProduction
window.MOSPOCHIN_RUNTIME.analyticsEnabled
window.__MOSPOCHIN_RUNTIME__.isProduction
window.__MOSPOCHIN_RUNTIME__.analyticsEnabled
```

Расширена рекламная атрибуция:

```text
page_url
page_path
page_title
referrer
referrer_host
utm_source
utm_medium
utm_campaign
utm_content
utm_term
utm_service
utm_landing
yclid
gclid
metrika_client_id
```

### 2. `telegram-form.js`

Все `.telegram-form` теперь автоматически получают hidden-поля атрибуции без ручного добавления в каждую HTML-форму.

Добавляемые поля:

```text
page_url
page_path
page_title
referrer
utm_source
utm_medium
utm_campaign
utm_content
utm_term
utm_service
utm_landing
yclid
gclid
metrika_client_id
```

Поля заполняются:

```text
1. при enhancement формы;
2. прямо перед submit;
3. из текущего URL;
4. из сохранённой attribution localStorage, если пользователь пришёл раньше и отправил форму позже.
```

Hidden-поля исключены из `extraFields`, чтобы Telegram не засорялся дублями. В Telegram они уходят отдельным объектом `attribution`.

### 3. `server/telegram-api.mjs`

Сервер теперь принимает расширенную attribution-схему и выводит в Telegram отдельные блоки:

```text
Источник заявки:
page: ...
url: ...
title: ...
referrer: ...
referrer_host: ...

Рекламная атрибуция:
utm_source: ...
utm_medium: ...
utm_campaign: ...
utm_content: ...
utm_term: ...
utm_service: ...
utm_landing: ...
yclid: ...
gclid: ...
metrika_client_id: ...
```

Также увеличен лимит дополнительных полей формы с 6 до 10, чтобы не обрезать полезные B2B-поля вроде адреса/формата кухни.

## Проверки

Выполнено:

```bash
node --check analytics.js
node --check telegram-form.js
node --check server/telegram-api.mjs
npm run check:core
npm run check:handoff
```

Результат:

```text
✅ JS syntax OK
✅ check:core passed
✅ check:handoff passed
✅ validate-data passed
✅ validate-site passed
✅ conversion UI: 16 parokonvektomat pages passed
✅ ownership guard passed
✅ builder output synced
✅ npm audit: 0 vulnerabilities
```

## Что проверить руками после деплоя

```text
[ ] На localhost / 127.0.0.1 нет запросов к mc.yandex.ru/metrika/watch.
[ ] На mospochin.ru Метрика грузится и цели отправляются.
[ ] phone_click работает на production.
[ ] whatsapp_click работает на production.
[ ] form_start работает на production.
[ ] form_submit_attempt работает на production.
[ ] form_submit_success работает после успешной заявки.
[ ] Telegram-заявка содержит page/url/referrer/utm/yclid/gclid.
[ ] В Метрике через 1–3 дня нет мусорных визитов с 127.0.0.1.
```

## Что намеренно не трогалось

```text
- root HTML напрямую;
- структуру кластера;
- новые SEO-страницы;
- картинки/assets;
- формы руками по всем страницам;
- счётчик Метрики и ID целей.
```

Причина: сначала нужно защитить аналитику и заявки, потом принимать контентные решения по чистой production-only статистике.
