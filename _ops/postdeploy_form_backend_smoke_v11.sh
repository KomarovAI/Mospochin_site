#!/usr/bin/env bash
set -euo pipefail
BASE_URL="${BASE_URL:-https://mospochin.ru}"
TMP_DIR="${TMP_DIR:-/tmp/mospochin_form_smoke_$$}"
mkdir -p "$TMP_DIR"

echo "===== RUNTIME CONFIG ====="
curl -fsS "$BASE_URL/data/runtime-config.json" | tee "$TMP_DIR/runtime-config.json"
echo

ENDPOINT="$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1])).get("telegramFormEndpoint",""))' "$TMP_DIR/runtime-config.json")"
if [ -z "$ENDPOINT" ]; then
  echo "FAIL: telegramFormEndpoint is empty" >&2
  exit 2
fi
API_URL="$BASE_URL$ENDPOINT"
echo "endpoint=$API_URL"

echo "===== SAFE INVALID-PHONE ROUTE TEST ====="
# This intentionally cannot deliver to Telegram. It checks whether the public endpoint reaches the Node handler.
HTTP_CODE="$(curl -sS -o "$TMP_DIR/invalid_phone_body.json" -w '%{http_code}' \
  -X POST "$API_URL" \
  -H 'Content-Type: application/json' \
  --data '{"page":"index.html","branch":"restaurant","name":"Smoke route check","phone":"1","type":"route_check","problem":"safe invalid phone route check","website":"","consent":true}')"
echo "http_code=$HTTP_CODE"
cat "$TMP_DIR/invalid_phone_body.json" || true
echo

case "$HTTP_CODE" in
  400)
    if grep -q 'invalid_phone' "$TMP_DIR/invalid_phone_body.json"; then
      echo "PASS: /api/send-telegram reaches Node handler. Now test real delivery only if needed."
    else
      echo "WARN: route reaches something, but response is not expected invalid_phone JSON. Inspect body above."
    fi
    ;;
  404|405)
    echo "FAIL: /api/send-telegram is not proxied to Telegram API service, or Nginx/static server handles it as a missing file." >&2
    exit 4
    ;;
  502)
    echo "FAIL: proxy likely reaches backend, but backend cannot deliver to Telegram. Check token/chat/proxy/tunnel and journalctl." >&2
    exit 5
    ;;
  000)
    echo "FAIL: network/TLS/DNS problem reaching site." >&2
    exit 6
    ;;
  *)
    echo "WARN: unexpected HTTP $HTTP_CODE. Inspect body above." >&2
    ;;
esac

if [ "${ALLOW_REAL_TELEGRAM_POST:-0}" != "1" ]; then
  echo "SKIP real Telegram delivery. Set ALLOW_REAL_TELEGRAM_POST=1 SMOKE_PHONE='+79999999999' to send one real test lead."
  exit 0
fi

SMOKE_PHONE="${SMOKE_PHONE:?Set SMOKE_PHONE for real delivery test, e.g. +79999999999}"
SMOKE_PAGE="${SMOKE_PAGE:-index.html}"
echo "===== REAL DELIVERY TEST ====="
HTTP_CODE="$(curl -sS -o "$TMP_DIR/real_body.json" -w '%{http_code}' \
  -X POST "$API_URL" \
  -H 'Content-Type: application/json' \
  --data "{\"page\":\"$SMOKE_PAGE\",\"branch\":\"restaurant\",\"name\":\"Smoke form delivery\",\"phone\":\"$SMOKE_PHONE\",\"type\":\"Тест формы\",\"problem\":\"Проверка реальной доставки заявки после deploy\",\"website\":\"\",\"consent\":true}")"
echo "http_code=$HTTP_CODE"
cat "$TMP_DIR/real_body.json" || true
echo
if [ "$HTTP_CODE" = "200" ] && grep -q '"ok":true' "$TMP_DIR/real_body.json"; then
  echo "PASS: real Telegram form delivery returned ok=true."
else
  echo "FAIL: real delivery did not return ok=true. Check service logs." >&2
  exit 7
fi
