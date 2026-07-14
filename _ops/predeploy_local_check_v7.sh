#!/usr/bin/env bash
set -euo pipefail
SITE_DIR="${1:-.}"
"$(dirname "$0")/predeploy_local_check_v6.sh" "$SITE_DIR"
echo 'V7 NOTE: this NOFONTS package includes rsync_preserve_excludes_NOFONTS.txt; use safe_rsync_deploy_v7.sh, not the V6 deploy script.'
