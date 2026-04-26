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

install -d -m 0755 /etc/systemd/system

build_public_webroot() {
  local public_dir="${RELEASE_ROOT}/public"
  local tmp_dir="${public_dir}.tmp"

  rm -rf "${tmp_dir}"
  mkdir -p "${tmp_dir}/data"
  rsync -a --delete \
    --include='/assets/***' \
    --include='/*.html' \
    --include='/*.css' \
    --include='/*.js' \
    --include='/*.svg' \
    --include='/robots.txt' \
    --include='/sitemap.xml' \
    --include='/version.json' \
    --exclude='*' \
    "${RELEASE_ROOT}/" "${tmp_dir}/"

  local public_data_files=(
    contact-config.json page-metadata.json schema-profile.json runtime-config.json
    restaurant-branch.json restaurant-services.json restaurant-page-slots.json restaurant-proof-layer.json
    household-branch.json household-services.json household-page-slots.json household-card-presets.json household-proof-layer.json
  )
  local file
  for file in "${public_data_files[@]}"; do
    install -m 0644 "${RELEASE_ROOT}/data/${file}" "${tmp_dir}/data/${file}"
  done

  generate_precompressed_assets "${tmp_dir}"

  chmod -R u=rwX,go=rX "${tmp_dir}"
  rm -rf "${public_dir}"
  mv "${tmp_dir}" "${public_dir}"
  ln -sfn "${public_dir}" /var/www/mospochin-public-current
}

generate_precompressed_assets() {
  local public_dir="$1"

  if ! command -v gzip >/dev/null 2>&1; then
    echo "Skipping precompressed assets: gzip is not available."
    return
  fi

  find "${public_dir}" -type f \
    \( -name '*.html' -o -name '*.css' -o -name '*.js' -o -name '*.json' -o -name '*.svg' -o -name '*.xml' -o -name '*.txt' \) \
    -size +1023c \
    -print0 | xargs -0 -r gzip -9 -n -kf --
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
  } > "${tmp_conf}"
  install -m 0644 "${tmp_conf}" "${NGINX_STATIC_COMPRESSION_CONF}"
  rm -f "${tmp_conf}"

  nginx -t
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

build_public_webroot
install_nginx_static_compression_config

systemctl daemon-reload

if [ "${tunnel_unit_installed}" = true ]; then
  systemctl enable "${TUNNEL_SERVICE_NAME}" >/dev/null
  systemctl restart "${TUNNEL_SERVICE_NAME}"
fi

systemctl enable "${SERVICE_NAME}" >/dev/null
systemctl restart "${SERVICE_NAME}"
