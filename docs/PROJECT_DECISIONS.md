# Project Decisions — MosPochin

Журнал решений для будущих AI-агентов и разработчиков. Новые архитектурные решения добавляй сюда кратко: дата, решение, причина, чего не делать.

## 2026-06 — Safe optimization over destructive compression

**Решение:** оригинальные изображения не пережимать и не заменять. Генерировать responsive/WebP production-деривативы отдельными командами.

**Причина:** сайт должен становиться легче на отдаче, но исходники должны сохранять качество и быть воспроизводимыми.

**Не делать:** не заменять оригинальные JPEG/PNG вручную «оптимизированными» копиями без явного visual review и без генератора.

## 2026-06 — AI-maintainable workflow

**Решение:** добавить `.aiignore`, `data/ai-project-index.json`, `docs/AI_FILE_OWNERSHIP.md`, `docs/AI_TASK_RECIPES.md` и команды `ai:context`, `ai:changed`, `ai:check`.

**Причина:** нейросетям проще и безопаснее работать через источники правды и машинный индекс, чем читать десятки HTML-страниц.

**Не делать:** не редактировать generated-файлы вручную, если есть команда генерации.

## 2026-06 — Forms security contract

**Решение:** формы используют серверный endpoint `/api/send-telegram`, а клиентский JS не хранит токен.

**Причина:** Telegram token и логика отправки должны оставаться на сервере.

**Не делать:** не добавлять токены, секреты или private chat id в HTML/JS/CSS.

## 2026-06 — Metadata source of truth

**Решение:** SEO-метаданные страниц хранить в `data/page-metadata.json`, а HTML синхронизировать командой `npm run sync:metadata`.

**Причина:** это снижает риск расхождения title/description/canonical между страницами.

**Не делать:** не менять `<title>` и `<meta name="description">` вручную на десятках страниц без последующей синхронизации.

## 2026-06 — Static Component Builder baseline

Решение: добавить параллельный `src/`-слой для всех индексированных HTML-страниц и собирать root HTML из section components.

Причина: большие HTML-файлы сложно сопровождать человеку и AI. Sectioned source даёт гибкость без перехода на SPA/CMS.

Правило: root HTML для builder pages должен совпадать с builder output. Проверка: `npm run check:site-builder`.

Не делать: не удалять root HTML и не считать builder полноценной контентной моделью, пока не выделены декларативные компоненты.
