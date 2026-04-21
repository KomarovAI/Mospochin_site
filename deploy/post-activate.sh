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

install -d -m 0755 /etc/systemd/system

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

systemctl daemon-reload

if [ "${tunnel_unit_installed}" = true ]; then
  systemctl enable "${TUNNEL_SERVICE_NAME}" >/dev/null
  systemctl restart "${TUNNEL_SERVICE_NAME}"
fi

systemctl enable "${SERVICE_NAME}" >/dev/null
systemctl restart "${SERVICE_NAME}"
