#!/usr/bin/env bash
set -euo pipefail
BASE_URL="${1:-https://mospochin.ru}"
SID="smoke_v9_$(date +%s)"
post_event(){
  local ev="$1" cta="$2" path="${3:-/parokonvektomaty.html}"
  curl -fsS -X POST "$BASE_URL/api/track-event" \
    -A 'Mozilla/5.0 smoke-test-v9' \
    -H "Origin: $BASE_URL" \
    -H "Referer: $BASE_URL$path" \
    -H 'Content-Type: application/json' \
    --data "{\"event\":\"$ev\",\"page_path\":\"$path\",\"session_id\":\"$SID\",\"cta_id\":\"$cta\",\"page_intent\":\"repair\",\"equipment\":\"parokonvektomat\",\"smoke_id\":\"$SID\"}"
  echo
}
post_event cta_click smoke_v9_cta_click
post_event form_open smoke_v9_form_open
post_event form_start smoke_v9_form_start
post_event form_submit_click smoke_v9_form_submit_click
post_event form_validation_error smoke_v9_form_validation_error
post_event form_submit_attempt smoke_v9_form_submit_attempt
# Do NOT emit fake form_submit_success by default: success must be real backend success.
echo "smoke_id=$SID"
