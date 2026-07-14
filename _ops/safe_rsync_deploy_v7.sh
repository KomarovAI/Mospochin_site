#!/usr/bin/env bash
set -euo pipefail
LOCAL_SITE="${1:?usage: ./safe_rsync_deploy_v7.sh /path/to/unpacked/static user@host [/var/www/mospochin.ru]}"
HOST="${2:?usage: ./safe_rsync_deploy_v7.sh /path/to/unpacked/static user@host [/var/www/mospochin.ru]}"
DOCROOT="${3:-/var/www/mospochin.ru}"
cd "$LOCAL_SITE"
EXCLUDES="_ops/rsync_preserve_excludes_NOFONTS.txt"
if [ ! -f "$EXCLUDES" ]; then
  echo "MISSING $EXCLUDES" >&2
  exit 2
fi
./_ops/predeploy_local_check_v7.sh .
./_ops/production_remote_preflight_v7.sh "$HOST" "$DOCROOT" _ops/font_requirements_NOFONTS.csv
TS=$(date +%F_%H%M%S)
echo '===== REMOTE BACKUP ====='
ssh "$HOST" "bash -lc 'set -euo pipefail
  sudo mkdir -p /var/backups/mospochin
  sudo tar -C \"$(dirname "$DOCROOT")\" -czf /var/backups/mospochin/docroot_before_v7_${TS}.tar.gz \"$(basename "$DOCROOT")\"
  ls -lh /var/backups/mospochin/docroot_before_v7_${TS}.tar.gz
'"
echo '===== RSYNC DRY RUN V7 ====='
echo 'NOTE: NOFONTS package; font binaries are preserved through --exclude-from and must remain on production.'
rsync -avnc --delete --exclude '_ops/' --exclude-from "$EXCLUDES" ./ "$HOST:$DOCROOT/" | tee "rsync_dry_run_v7_${TS}.txt"
if grep -E 'deleting assets/fonts/.*\.(eot|svg|ttf|woff|woff2)$' "rsync_dry_run_v7_${TS}.txt"; then
  echo 'FAIL: dry-run wants to delete production font binaries.' >&2
  exit 8
fi
read -r -p 'Type DEPLOY_V7 to apply rsync: ' answer
if [ "$answer" != "DEPLOY_V7" ]; then echo 'aborted'; exit 3; fi
echo '===== RSYNC APPLY V7 ====='
rsync -avc --delete --exclude '_ops/' --exclude-from "$EXCLUDES" ./ "$HOST:$DOCROOT/" | tee "rsync_apply_v7_${TS}.txt"
if grep -E 'deleting assets/fonts/.*\.(eot|svg|ttf|woff|woff2)$' "rsync_apply_v7_${TS}.txt"; then
  echo 'FAIL: apply log shows production font binary deletion.' >&2
  exit 9
fi
echo '===== POST-RSYNC FONT AUDIT ====='
./_ops/production_font_audit_v7.sh "$HOST" "$DOCROOT" _ops/font_requirements_NOFONTS.csv
echo '===== NGINX RELOAD ====='
ssh "$HOST" "bash -lc 'set -euo pipefail
  if command -v nginx >/dev/null 2>&1; then sudo nginx -t && sudo systemctl reload nginx; fi
'"
echo "backup=/var/backups/mospochin/docroot_before_v7_${TS}.tar.gz"
echo 'PASS safe deploy V7'
