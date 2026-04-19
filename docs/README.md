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
  - `deploy/post-activate.sh`
  - `deploy/env/telegram.env.example`

## Validation and deploy

- `npm run validate:site` now requires `data/runtime-config.json` and a non-empty `telegramFormEndpoint`.
- Deploy smoke tests call the configured form endpoint after publishing.
- Deploy manifest must include the backend script and deploy hook assets so the VPS can activate them from the same release tree.
