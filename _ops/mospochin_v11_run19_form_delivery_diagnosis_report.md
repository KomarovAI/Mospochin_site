# MosPochin V11 — Run19 form delivery diagnosis

Date: 2026-07-04

## Problem reported

Deploy notification reaches Telegram, but a real website form submit does not create a Telegram message.

## Local package finding

The frontend form chain is present:

```text
telegram-form.js -> runtime-config -> /api/send-telegram -> server/telegram-api.mjs -> Telegram Bot API sendMessage
```

Important local facts from the V11 package:

```text
runtime endpoint: /api/send-telegram
Node route exists: POST /api/send-telegram
Node service default: HOST=127.0.0.1 PORT=3010
systemd unit: mospochin-telegram-api.service
systemd WorkingDirectory: /var/www/mospochin-current
deploy_control_v9 default docroot: /var/www/mospochin.ru
nginx proxy config for /api/send-telegram in package: not found
```

## Likely root cause

The static site and Telegram delivery backend are separate chains. The deploy/event notification can work while `/api/send-telegram` is still not reachable from the public website.

Most likely cases:

1. Nginx does not proxy `/api/send-telegram` to `127.0.0.1:3010`.
2. `mospochin-telegram-api.service` is not installed/running after the static deploy.
3. The service is running from `/var/www/mospochin-current`, while the static deploy was rsynced to `/var/www/mospochin.ru`, so the service points at a missing/stale release.
4. The service reaches the route, but Telegram delivery fails because `/etc/mospochin/telegram.env` is empty/wrong or the configured SOCKS tunnel `127.0.0.1:58161` is down.

## Fast triage

Run:

```bash
BASE_URL=https://mospochin.ru ./postdeploy_form_backend_smoke_v11.sh
```

Expected safe route result if backend is wired:

```text
HTTP 400 + JSON error invalid_phone
```

That test intentionally uses an invalid phone, so it should not send a Telegram message. It only proves that public `/api/send-telegram` reaches the Node handler.

## Interpretation

```text
404 / 405 / HTML body  -> nginx/static server is handling /api/send-telegram; proxy missing
400 invalid_phone      -> route reaches Node handler; then test real delivery
502                    -> route reaches Node, but Telegram delivery failed; check token/chat/proxy/tunnel
429                    -> rate limit; wait or check limits
200 ok=true            -> real form delivery works
```

## Files in this run

- postdeploy_form_backend_smoke_v11.sh
- nginx_send_telegram_location_snippet.conf
- FORM_BACKEND_REMOTE_CHECKS.md
- run19_local_chain_checks.csv
