<!-- ai-instruction-file: true -->
# Server Instructions

## Scope

These rules apply to the lead and analytics backend under `server/`.

## Edit

- Preserve backward compatibility unless a migration is explicitly approved.
- Never expose secrets, Telegram identifiers or raw personal data to the browser or logs.
- Preserve idempotency, trace identifiers, validation and null-safe optional fields.
- Keep production configuration in environment variables, not repository files.

## Verify

- Run syntax checks for every changed server file.
- Run idempotency and paid-contract tests when lead payloads change.
- Run `npm run ai:verify -- --changed` after the iteration.

## Do not add

Do not place logs, payload dumps, production data, credentials, temporary fixtures or additional instruction files under `server/`.
