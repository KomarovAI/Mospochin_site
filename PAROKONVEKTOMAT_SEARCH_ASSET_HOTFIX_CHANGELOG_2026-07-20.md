# MosPochin — search asset hotfix v2 (2026-07-20)

## Причина

Production стабильно публикует корневые CSS/JS, но три новых `/data/*.json` остаются 404 даже после обновления public allowlist.

## Исправление

- инженерная база поиска преобразована в корневой `error-search-data.js`;
- центральный справочник загружает data asset до `error-search.js`;
- `error-search.js` использует встроенный JS payload как основной источник;
- `/data/parokonvektomat-error-codes.json` оставлен только как legacy fallback;
- служебные navigation/conversion JSON больше не считаются production runtime assets;
- rollout smoke проверяет `error-search-data.js` вместо недоступных `/data/*.json`.

## Безопасность

Никакие сервисные пароли, токены или закрытые инструкции в data asset не включены. Payload содержит только поля, уже выводимые в открытом инженерном справочнике.
