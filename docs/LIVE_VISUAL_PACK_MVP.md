# MosPochin Live Visual Pack MVP

Этот пакет добавляет post-deploy visual capture для production `https://mospochin.ru`.

Что добавляется:

- `tools/visual-capture.config.json`
- `tools/visual-capture-plan.mjs`
- `tools/screenshot-live-site.mjs`
- npm scripts `screenshots:live:*`
- GitHub Actions шаги после production verify
- artifact `reports/live-visual-pack/` с retention 5 дней

Что собирается:

- `capture-plan.json/csv`
- `manifest.csv`
- `llm_visual_index.md`
- `llm/llm_visual_pages.jsonl`
- `llm/llm_visual_blocks.csv`
- `llm/llm_visual_warnings.csv`
- desktop/mobile screenshots для core/new/changed pages

Не собирается в MVP:

- video
- trace
- Firefox/WebKit
- atomic full-site разбор
- raw HTML dump
- сырые логи
