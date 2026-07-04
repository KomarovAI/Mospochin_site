#!/usr/bin/env bash
set -euo pipefail
LOCAL_SITE="${1:-.}"
SSH_ALIAS="${2:-mospochin-site-vps}"
REMOTE_DOCROOT="${3:-/var/www/mospochin.ru}"
BASE_URL="${4:-https://mospochin.ru}"

cd "$LOCAL_SITE"

echo "===== V8 LOCAL PREFLIGHT ====="
./_ops/predeploy_local_check_v7.sh .

echo "===== V8 REMOTE PREFLIGHT ====="
./_ops/production_remote_preflight_v7.sh "$SSH_ALIAS" "$REMOTE_DOCROOT"

echo "===== V8 SAFE DEPLOY ====="
./_ops/safe_rsync_deploy_v7.sh . "$SSH_ALIAS" "$REMOTE_DOCROOT"

echo "===== V8 POSTDEPLOY SMOKE ====="
./_ops/postdeploy_smoke_v6.sh "$BASE_URL"
./_ops/postdeploy_event_smoke_v7.sh "$BASE_URL"
./_ops/metrika_event_smoke_v8.sh "$BASE_URL"

echo "===== V8 DONE ====="
echo "Next: ./_ops/artikk_smoke_tail_v7.sh artikk-local smoke_v8"
echo "Then: ./_ops/artikk_daily_run_check_v6.sh artikk-local"
