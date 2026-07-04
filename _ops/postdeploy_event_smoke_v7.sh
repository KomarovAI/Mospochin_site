#!/usr/bin/env bash
set -euo pipefail
BASE="${1:-https://mospochin.ru}"
SESSION="smoke_v7_$(date +%s)"
echo '===== POSTDEPLOY EVENT SMOKE V7 ====='
echo "base=$BASE"
echo "session=$SESSION"
post_event(){
  local event="$1" cta="$2" extra="$3"
  curl -fsS -X POST "$BASE/api/track-event" \
    -A 'Mozilla/5.0 smoke-test-v7' \
    -H "Origin: $BASE" \
    -H "Referer: $BASE/parokonvektomaty.html" \
    -H 'Content-Type: application/json' \
    --data "{\"event\":\"$event\",\"page_path\":\"/parokonvektomaty.html\",\"session_id\":\"$SESSION\",\"cta_id\":\"$cta\",\"page_intent\":\"repair\",\"equipment\":\"parokonvektomat\"$extra}"
  echo
}
post_event 'cta_click' 'smoke_v7_cta_click' ''
post_event 'form_start' 'smoke_v7_form_start' ',\"form_id\":\"smoke_v7_form\"'
post_event 'form_submit_click' 'smoke_v7_form_submit_click' ',\"form_id\":\"smoke_v7_form\"'
post_event 'form_validation_error' 'smoke_v7_form_validation_error' ',\"form_id\":\"smoke_v7_form\",\"reason\":\"smoke_validation\"'
echo 'PASS event smoke requests completed; final classification may be suspicious/internal by design.'
