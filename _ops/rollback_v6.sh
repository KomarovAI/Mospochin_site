#!/usr/bin/env bash
set -euo pipefail
HOST="${1:?usage: ./rollback_v6.sh user@host /var/backups/mospochin/docroot_before_v6_YYYY-MM-DD_HHMMSS.tar.gz [/var/www]}"
BACKUP="${2:?usage: ./rollback_v6.sh user@host /var/backups/mospochin/docroot_before_v6_YYYY-MM-DD_HHMMSS.tar.gz [/var/www]}"
PARENT="${3:-/var/www}"
echo '===== ROLLBACK V6 ====='
echo "host=$HOST backup=$BACKUP parent=$PARENT"
read -r -p 'Type ROLLBACK to restore backup: ' answer
[ "$answer" = "ROLLBACK" ] || { echo aborted; exit 3; }
ssh "$HOST" "bash -lc 'set -euo pipefail
  test -s "$BACKUP"
  sudo tar -C "$PARENT" -xzf "$BACKUP"
  if command -v nginx >/dev/null 2>&1; then sudo nginx -t && sudo systemctl reload nginx; fi
  echo PASS rollback restored
'"
