# Local visual screenshot pack — compatibility note

Этот документ сохранён как compatibility stub. Старый Python/Firefox workflow больше не является основным.

Актуальная архитектура:

- `docs/VISUAL_CHECKS.md` — system Chromium + Playwright local-content;
- `docs/AI_VISUAL_REVIEW_WORKFLOW.md` — цикл capture → review → fix → recapture;
- `npm run visual:capture -- --manifest <file> --mode both` — универсальный launcher.

Для отдельного ZIP с PNG сначала снять кадры штатной командой, затем упаковать выбранный output-каталог отдельно от source ZIP. Не устанавливать Python Firefox pack для обычного project run.
