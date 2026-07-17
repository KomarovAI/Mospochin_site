# AI Start Here

Use the lightweight workflow:

```bash
npm run ai:brief -- --task content --page example.html
npm run ai:verify -- --changed
```

Before a release:

```bash
npm run ai:release
```

Canonical rules:

- root `AGENTS.md`;
- `docs/AI_CONTROL_LITE.md`;
- `.ai/CURRENT.md` for generated current state;
- scoped `AGENTS.md` files for page, data, documentation and server work.

Do not read full generated project maps unless debugging the brief generator.
