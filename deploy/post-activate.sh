#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RELEASE_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${RELEASE_ROOT}"

SERVICE_NAME="mospochin-telegram-api.service"
UNIT_SOURCE="deploy/systemd/${SERVICE_NAME}"
UNIT_TARGET="/etc/systemd/system/${SERVICE_NAME}"
TUNNEL_SERVICE_NAME="mospochin-telegram-tunnel.service"
TUNNEL_UNIT_SOURCE="deploy/systemd/${TUNNEL_SERVICE_NAME}"
TUNNEL_UNIT_TARGET="/etc/systemd/system/${TUNNEL_SERVICE_NAME}"
ENV_DIR="/etc/mospochin"
ENV_TARGET="${ENV_DIR}/telegram.env"
ENV_TEMPLATE="deploy/env/telegram.env.example"
NGINX_STATIC_COMPRESSION_CONF="/etc/nginx/conf.d/mospochin-static-compression.conf"
NGINX_SECURITY_HEADERS_CONF="/etc/nginx/conf.d/mospochin-security-headers.conf"
NGINX_RUNTIME_HARDENING_SOURCE="${RELEASE_ROOT}/deploy/nginx/mospochin-runtime-hardening.conf"
NGINX_RUNTIME_HARDENING_CONF="/etc/nginx/snippets/mospochin-runtime-hardening.conf"
NGINX_SITE_AVAILABLE="/etc/nginx/sites-available/mospochin.conf"

install -d -m 0755 /etc/systemd/system

build_public_webroot() {
  local public_dir="${RELEASE_ROOT}/public"
  local tmp_dir="${public_dir}.tmp"

  rm -rf "${tmp_dir}"
  mkdir -p "${tmp_dir}"

  local public_file_list
  public_file_list="$(mktemp)"
  node "${RELEASE_ROOT}/tools/generate-public-file-list.mjs" --out "${public_file_list}"

  rsync -a --delete --files-from="${public_file_list}" \
    "${RELEASE_ROOT}/" "${tmp_dir}/"
  rm -f "${public_file_list}"

  generate_precompressed_assets "${tmp_dir}"

  chmod -R u=rwX,go=rX "${tmp_dir}"
  rm -rf "${public_dir}"
  mv "${tmp_dir}" "${public_dir}"
  ln -sfn "${public_dir}" /var/www/mospochin-public-current
}

generate_precompressed_assets() {
  local public_dir="$1"
  local compressible_files
  compressible_files="$(mktemp)"

  find "${public_dir}" -type f \
    \( -name '*.html' -o -name '*.css' -o -name '*.js' -o -name '*.json' -o -name '*.svg' -o -name '*.xml' -o -name '*.txt' \) \
    -size +1023c \
    -print0 > "${compressible_files}"

  if command -v gzip >/dev/null 2>&1; then
    xargs -0 -r gzip -9 -n -kf -- < "${compressible_files}"
  else
    echo "Skipping gzip precompressed assets: gzip is not available."
  fi

  if command -v brotli >/dev/null 2>&1; then
    while IFS= read -r -d '' file; do
      brotli -f -q 11 "${file}"
    done < "${compressible_files}"
  else
    echo "Skipping Brotli precompressed assets: brotli is not available."
  fi

  rm -f "${compressible_files}"
}

nginx_supports_brotli_static() {
  command -v nginx >/dev/null 2>&1 && nginx -V 2>&1 | grep -qi 'brotli'
}

install_nginx_static_compression_config() {
  if ! command -v nginx >/dev/null 2>&1; then
    echo "Skipping nginx static compression config: nginx is not available."
    return
  fi

  install -d -m 0755 "$(dirname "${NGINX_STATIC_COMPRESSION_CONF}")"
  local tmp_conf
  tmp_conf="$(mktemp)"
  {
    echo "# Managed by MosPochin deploy hook."
    echo "gzip_static on;"
    if nginx_supports_brotli_static; then
      echo "brotli_static on;"
    else
      echo "# brotli_static is not enabled because the installed nginx build does not advertise Brotli support."
    fi
  } > "${tmp_conf}"
  install -m 0644 "${tmp_conf}" "${NGINX_STATIC_COMPRESSION_CONF}"
  rm -f "${tmp_conf}"

  nginx -t
  systemctl reload nginx
}

install_nginx_security_headers_config() {
  if ! command -v nginx >/dev/null 2>&1; then
    echo "Skipping nginx security headers config: nginx is not available."
    return
  fi

  install -d -m 0755 "$(dirname "${NGINX_SECURITY_HEADERS_CONF}")"
  local tmp_conf
  tmp_conf="$(mktemp)"
  cat > "${tmp_conf}" <<'NGINX_SECURITY_HEADERS'
# Managed by MosPochin deploy hook.
# CSP starts in report-only mode so inline legacy scripts can be audited before enforcement.
add_header Content-Security-Policy-Report-Only "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'self'; img-src 'self' data: https://mc.yandex.ru https://*.mc.yandex.ru; script-src 'self' 'unsafe-inline' https://mc.yandex.ru https://*.mc.yandex.ru; style-src 'self' 'unsafe-inline'; font-src 'self' data:; connect-src 'self' https://mc.yandex.ru https://*.mc.yandex.ru; form-action 'self'; upgrade-insecure-requests" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()" always;
add_header X-Content-Type-Options "nosniff" always;
NGINX_SECURITY_HEADERS
  install -m 0644 "${tmp_conf}" "${NGINX_SECURITY_HEADERS_CONF}"
  rm -f "${tmp_conf}"

  nginx -t
  systemctl reload nginx
}

# MOSPOCHIN_RUNTIME_INCLUDE_REPAIR_V4
repair_nginx_runtime_hardening_include() {
  if ! command -v nginx >/dev/null 2>&1; then
    echo "Skipping runtime-hardening include repair: nginx is not available."
    return
  fi

  [[ -f "${NGINX_SITE_AVAILABLE}" ]] || {
    echo "Missing nginx site config: ${NGINX_SITE_AVAILABLE}" >&2
    exit 1
  }

  python3 \
    "${RELEASE_ROOT}/deploy/nginx/repair-managed-includes.py" \
    "${NGINX_SITE_AVAILABLE}" \
    "${NGINX_RUNTIME_HARDENING_CONF}"

  nginx -t
}

install_nginx_runtime_hardening_config() {
  if ! command -v nginx >/dev/null 2>&1; then
    echo "Skipping nginx runtime-hardening config: nginx is not available."
    return
  fi

  [[ -f "${NGINX_RUNTIME_HARDENING_SOURCE}" ]] || {
    echo "Missing nginx runtime-hardening source: ${NGINX_RUNTIME_HARDENING_SOURCE}" >&2
    exit 1
  }

  [[ -f "${NGINX_SITE_AVAILABLE}" ]] || {
    echo "Missing nginx site config: ${NGINX_SITE_AVAILABLE}" >&2
    exit 1
  }

  install -d -m 0755 "$(dirname "${NGINX_RUNTIME_HARDENING_CONF}")"
  install -m 0644 \
    "${NGINX_RUNTIME_HARDENING_SOURCE}" \
    "${NGINX_RUNTIME_HARDENING_CONF}"

  repair_nginx_runtime_hardening_include
  systemctl reload nginx
}

ensure_env_file() {
  install -d -m 0755 "${ENV_DIR}"
  if [ ! -f "${ENV_TARGET}" ]; then
    install -m 0600 "${ENV_TEMPLATE}" "${ENV_TARGET}"
    echo "Created ${ENV_TARGET}. Fill TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID before expecting delivery."
  fi
}

tunnel_unit_installed=false

if [ ! -f "${UNIT_SOURCE}" ]; then
  echo "Missing unit file: ${UNIT_SOURCE}" >&2
  exit 1
fi

ensure_env_file
install -m 0644 "${UNIT_SOURCE}" "${UNIT_TARGET}"

if [ -f "${TUNNEL_UNIT_SOURCE}" ]; then
  ensure_env_file
  install -m 0644 "${TUNNEL_UNIT_SOURCE}" "${TUNNEL_UNIT_TARGET}"
  tunnel_unit_installed=true
else
  echo "Skipping Telegram tunnel unit install: ${TUNNEL_UNIT_SOURCE} is missing."
fi

# MOSPOCHIN_RUNTIME_INCLUDE_PRECHECK_V4
repair_nginx_runtime_hardening_include
build_public_webroot
install_nginx_static_compression_config
install_nginx_security_headers_config
install_nginx_runtime_hardening_config

systemctl daemon-reload

if [ "${tunnel_unit_installed}" = true ]; then
  systemctl enable "${TUNNEL_SERVICE_NAME}" >/dev/null
  systemctl restart "${TUNNEL_SERVICE_NAME}"
fi

systemctl enable "${SERVICE_NAME}" >/dev/null
systemctl restart "${SERVICE_NAME}"
