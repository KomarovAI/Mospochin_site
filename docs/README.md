# Mospochin_site

## Source of truth

- Canonical site source lives only in `/home/artikk/Mospochin_site`.
- Matching HTML/CSS/JS files in `/home/artikk` are non-canonical workspace copies and must not be used for deploys or edits.

## Telegram form runtime contract

- Production form delivery is configured through `data/runtime-config.json`.
- `telegramFormEndpoint` must point to a live site-relative POST endpoint on the deployed host.
- Local `npm run dev` serves the same path for smoke testing, but its handler is only a mock and does not deliver real Telegram messages.
- Production backend source now lives in `server/telegram-api.mjs`.
- Server activation artifacts now live in-repo under `deploy/`:
  - `deploy/systemd/mospochin-telegram-api.service`
  - `deploy/systemd/mospochin-telegram-tunnel.service`
  - `deploy/post-activate.sh`
  - `deploy/env/telegram.env.example`

## Telegram delivery path

- Public form requests hit `https://mospochin.ru/api/send-telegram`.
- Nginx proxies that path to the local backend on `127.0.0.1:3010`.
- `server/telegram-api.mjs` sends Telegram Bot API requests through `TELEGRAM_PROXY`.
- Production default is `socks5h://127.0.0.1:58161`.
- `mospochin-telegram-tunnel.service` keeps that local SOCKS port open through an SSH tunnel to `primary-vps` (`31.58.58.133`) on port `27016`.
- Only Telegram traffic uses this tunnel; the site and other VPS traffic stay local to the Mospochin host.

## Validation and deploy

- `npm run validate:site` now requires `data/runtime-config.json` and a non-empty `telegramFormEndpoint`.
- Deploy smoke tests call the configured form endpoint after publishing.
- Deploy manifest must include the backend script and deploy hook assets so the VPS can activate them from the same release tree.

## Restaurant Branch

- Restaurant branch maintenance contract: [docs/RESTAURANT_BRANCH_CONTRACT.md](/home/artikk/Mospochin_site/docs/RESTAURANT_BRANCH_CONTRACT.md)
- `main.js` is the canonical runtime JavaScript for the restaurant branch.
