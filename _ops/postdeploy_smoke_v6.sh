#!/usr/bin/env bash
set -euo pipefail
BASE="${1:-https://mospochin.ru}"
echo '===== POSTDEPLOY SMOKE V6 ====='
echo "base=$BASE"
curl -fsSI "$BASE/analytics.js" | sed -n '1,10p'
curl -fsSI "$BASE/telegram-form.js" | sed -n '1,10p'
curl -fsS "$BASE/analytics.js" | grep -E 'MOSPOCHIN|/api/track-event|reachGoal|form_submit_click|form_validation_error' >/dev/null
curl -fsS "$BASE/telegram-form.js" | grep -E 'missing_consent|invalid_phone|too_fast|rate_limited|problem_too_long' >/dev/null
curl -fsS "$BASE/" | grep -E 'analytics.js|telegram-form.js|data-page-intent|data-cta-id|data-contact-form' | head -40
curl -fsS "$BASE/parokonvektomaty.html" | grep -E 'data-page-slug="parokonvektomaty"|rare-brand-help|data-cta-id|data-contact-form' | head -60
curl -fsS -X POST "$BASE/api/track-event" \
  -A 'Mozilla/5.0 smoke-test' \
  -H "Origin: $BASE" \
  -H "Referer: $BASE/" \
  -H 'Content-Type: application/json' \
  --data '{"event":"cta_click","page_path":"/index.html","session_id":"smoke_browser_v6","cta_id":"smoke_test_v6","page_intent":"hub","equipment":"site"}'
echo
echo 'PASS postdeploy smoke V6'
