# MosPochin backend patch — paid tracking v3

Файл патча: `server/telegram-api.mjs`.

## Изменения

- backward-compatible lead v3 fields;
- null-safe hashes;
- idempotency payload fingerprint;
- duplicate HTTP 200 without Telegram resend;
- conflict HTTP 409;
- trace/request/public lead IDs;
- separate first/last/offline yclid;
- public response without Telegram message ID.

## Deployment

1. Сохранить backup фактического production backend-файла.
2. Заменить только `telegram-api.mjs` в существующем backend directory.
3. Не менять nginx, systemd unit, env-файл, tunnel и log paths.
4. Использовать существующую штатную процедуру restart/reload.
5. Выполнить production smoke из handoff.

Точный путь и service name намеренно не указаны: они не были предоставлены.
