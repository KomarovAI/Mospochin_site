# Remote checks for MosPochin Telegram form backend

Run on your admin machine with the same SSH alias used for deploy.
Do not paste TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID into chat/logs.

```bash
ssh mospochin-site-vps 'bash -lc '\''
set -euo pipefail

echo ===== SERVICE STATUS =====
systemctl is-enabled mospochin-telegram-api.service 2>/dev/null || true
systemctl is-active mospochin-telegram-api.service 2>/dev/null || true
sudo systemctl status mospochin-telegram-api.service --no-pager -n 30 || true

echo ===== LISTENER 3010 =====
ss -lntp | grep ":3010" || true

echo ===== LOCAL HEALTH =====
curl -sS -D - http://127.0.0.1:3010/health || true

echo ===== SAFE LOCAL INVALID-PHONE TEST =====
curl -sS -D - -X POST http://127.0.0.1:3010/api/send-telegram \
  -H "Content-Type: application/json" \
  --data "{\"page\":\"index.html\",\"branch\":\"restaurant\",\"name\":\"Local route check\",\"phone\":\"1\",\"type\":\"route_check\",\"problem\":\"safe invalid phone route check\",\"website\":\"\",\"consent\":true}" || true

echo ===== ENV PRESENCE WITHOUT SECRETS =====
sudo test -f /etc/mospochin/telegram.env && echo env_file_exists || echo env_file_missing
sudo awk -F= '\''/^(TELEGRAM_BOT_TOKEN|TELEGRAM_CHAT_ID|TELEGRAM_PROXY|PORT|HOST)=/ { print $1 "=" (($2=="") ? "EMPTY" : "SET") }'\'' /etc/mospochin/telegram.env 2>/dev/null || true

echo ===== JOURNAL =====
sudo journalctl -u mospochin-telegram-api.service -n 80 --no-pager || true
'\'''
```

If local service is OK but public `/api/send-telegram` is 404/405, add the nginx location snippet and reload nginx.
If public endpoint returns 502, inspect `journalctl -u mospochin-telegram-api.service`; likely token/chat/proxy/tunnel problem.
