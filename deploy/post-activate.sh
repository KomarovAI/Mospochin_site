#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RELEASE_ROOT="$(cd "${SCRIPT_DIR}/.." && pwd)"

cd "${RELEASE_ROOT}"

SERVICE_NAME="mospochin-telegram-api.service"
UNIT_SOURCE="deploy/systemd/${SERVICE_NAME}"
UNIT_TARGET="/etc/systemd/system/${SERVICE_NAME}"
ENV_DIR="/etc/mospochin"
ENV_TARGET="${ENV_DIR}/telegram.env"
ENV_TEMPLATE="deploy/env/telegram.env.example"

if [ ! -f "${UNIT_SOURCE}" ]; then
  echo "Missing unit file: ${UNIT_SOURCE}" >&2
  exit 1
fi

install -d -m 0755 /etc/systemd/system
install -d -m 0755 "${ENV_DIR}"
install -m 0644 "${UNIT_SOURCE}" "${UNIT_TARGET}"

if [ ! -f "${ENV_TARGET}" ]; then
  install -m 0600 "${ENV_TEMPLATE}" "${ENV_TARGET}"
  echo "Created ${ENV_TARGET}. Fill TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID before expecting delivery."
fi

systemctl daemon-reload
systemctl enable "${SERVICE_NAME}" >/dev/null
systemctl restart "${SERVICE_NAME}"
