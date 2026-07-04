#!/usr/bin/env bash
set -euo pipefail
LOCAL_SITE="${1:?usage: ./safe_rsync_deploy_v6.sh /path/to/unpacked/static user@host [/var/www/mospochin.ru]}"
HOST="${2:?usage: ./safe_rsync_deploy_v6.sh /path/to/unpacked/static user@host [/var/www/mospochin.ru]}"
DOCROOT="${3:-/var/www/mospochin.ru}"
cd "$LOCAL_SITE"
./_ops/predeploy_local_check_v6.sh .
./_ops/production_remote_preflight_v6.sh "$HOST" "$DOCROOT" _ops/font_requirements_NOFONTS.csv
TS=$(date +%F_%H%M%S)
echo '===== REMOTE BACKUP ====='
ssh "$HOST" "bash -lc 'set -euo pipefail
  sudo mkdir -p /var/backups/mospochin
  sudo tar -C "$(dirname "$DOCROOT")" -czf /var/backups/mospochin/docroot_before_v6_${TS}.tar.gz "$(basename "$DOCROOT")"
  ls -lh /var/backups/mospochin/docroot_before_v6_${TS}.tar.gz
'"
echo '===== RSYNC DRY RUN ====='
rsync -avnc --delete --exclude '_ops/' ./ "$HOST:$DOCROOT/" | tee "rsync_dry_run_v6_${TS}.txt"
read -r -p 'Type DEPLOY to apply rsync: ' answer
if [ "$answer" != "DEPLOY" ]; then echo 'aborted'; exit 3; fi
echo '===== RSYNC APPLY ====='
rsync -avc --delete --exclude '_ops/' ./ "$HOST:$DOCROOT/" | tee "rsync_apply_v6_${TS}.txt"
echo '===== NGINX RELOAD ====='
ssh "$HOST" "bash -lc 'set -euo pipefail
  if command -v nginx >/dev/null 2>&1; then sudo nginx -t && sudo systemctl reload nginx; fi
'"
echo "backup=/var/backups/mospochin/docroot_before_v6_${TS}.tar.gz"
echo 'PASS safe deploy V6'
