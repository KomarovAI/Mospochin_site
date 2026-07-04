#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-https://mospochin.ru}"
TIMEOUT="${TIMEOUT:-15}"
ALLOW_EVENT_POST="${ALLOW_EVENT_POST:-0}"
FAIL=0

PAGES=('/ventilyatsiya-restoranov.html' '/remont-ventilyatsii-restoranov.html' '/obsluzhivanie-ventilyatsii-restoranov.html' '/chistka-ventilyatsii-restoranov.html' '/remont-vytyazhki-restorana.html' '/remont-pritochnoj-ventilyatsii-restorana.html' '/diagnostika-ventilyatsii-restorana.html' '/ventilyatsiya-restorana-ne-tyanet.html' '/vytyazhka-restorana-ne-rabotaet.html' '/dym-na-kuhne-restorana.html' '/zapah-iz-kuhni-v-zal.html' '/shumit-vytyazhka-restorana.html' '/vibriruet-ventilyator-vytyazhki.html' '/avtomatika-ventilyatsii-restorana.html' '/remont-ventilyatora-vytyazhki-restorana.html' '/ventilyator-vytyazhki-ne-vklyuchaetsya.html' '/ventilyator-vytyazhki-vybivaet-avtomat.html')
REQUIRED_MARKERS=('data-page-slug' 'data-contact-form' 'data-form-id' 'data-form-page-slug' 'data-cta-id' 'analytics.js' 'telegram-form.js')
REQUIRED_JS_EVENTS=('phone_click' 'whatsapp_click' 'form_open' 'form_start' 'form_submit_click' 'form_validation_error' 'form_submit_attempt' 'form_submit_success' 'form_submit_error')

TMP_JS="$(mktemp)"
curl -L -sS --max-time "$TIMEOUT" -o "$TMP_JS" "$BASE_URL/analytics.js" || true

echo 'page,marker_failures,js_event_failures,status'
for PAGE in "${PAGES[@]}"; do
  BODY="$(mktemp)"
  curl -L -sS --max-time "$TIMEOUT" -o "$BODY" "$BASE_URL$PAGE" || true
  MARKER_FAILS=()
  for M in "${REQUIRED_MARKERS[@]}"; do
    grep -q "$M" "$BODY" || MARKER_FAILS+=("$M")
  done
  JS_FAILS=()
  for E in "${REQUIRED_JS_EVENTS[@]}"; do
    grep -q "$E" "$TMP_JS" || JS_FAILS+=("$E")
  done
  STATUS=OK
  if [ "${#MARKER_FAILS[@]}" -gt 0 ] || [ "${#JS_FAILS[@]}" -gt 0 ]; then
    STATUS=FAIL
    FAIL=1
  fi
  printf '%s,%s,%s,%s
' "$PAGE" "${MARKER_FAILS[*]:-}" "${JS_FAILS[*]:-}" "$STATUS"
  rm -f "$BODY"
done
rm -f "$TMP_JS"

if [ "$ALLOW_EVENT_POST" = "1" ]; then
  echo 'ALLOW_EVENT_POST=1 set; sending one opt-in diagnostic event to /api/track-event'
  curl -L -sS --max-time "$TIMEOUT" -X POST "$BASE_URL/api/track-event"     -H 'Content-Type: application/json'     --data '{"event":"ventilation_postdeploy_smoke","page":"/ventilyatsiya-restoranov.html","source":"_ops/postdeploy_ventilation_event_smoke_v11.sh"}' || true
else
  echo 'No synthetic event POST sent. Set ALLOW_EVENT_POST=1 only for an intentional controlled API smoke.'
fi

exit "$FAIL"
