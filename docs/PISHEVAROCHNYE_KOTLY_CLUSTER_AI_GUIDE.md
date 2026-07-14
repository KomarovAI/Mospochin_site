# Пищеварочные котлы — AI cluster guide

Этот документ описывает машинный маршрут для кластера пищеварочных котлов. Список страниц и visual manifest находятся в `data/cluster-registry.json` и `data/cooking-kettles-screenshot-audit.json`.

## Source of truth

- page model и sections: `src/pages/<slug>/page.json`, `src/pages/<slug>/sections/*.html`;
- SEO: `data/page-metadata.json`;
- FAQ: `content/faq/`;
- cluster registry: `data/cluster-registry.json`;
- production HTML: generated output, не редактировать отдельно от source.

## Правила AI-правки

- Сначала определить роль страницы: hub, symptom, error, brand или service.
- Не объединять symptom/error страницы в одну без проверки поискового интента и существующих ссылок.
- Новую страницу добавлять только при отдельном запросе/интенте и с обязательной перелинковкой из hub или близких symptom/error страниц.
- В коммерческих блоках сохранять явные phone/WhatsApp/Telegram CTA и понятную форму заявки.
- Не добавлять повторяющийся технический текст на все страницы; различать симптом, диагностику и следующий шаг для инженера.

## Минимальные проверки

```bash
npm run build:site -- --write
npm run check:core
npm run audit:cooking-kettles-screenshots
```

Команда использует локальный system Chromium через local-content renderer. При прерывании повторный запуск продолжает незавершённые страницы; GitHub visual допустим только как ручной fallback.
