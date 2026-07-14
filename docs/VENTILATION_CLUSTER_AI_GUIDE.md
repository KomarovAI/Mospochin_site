# Вентиляция — AI cluster guide

Кластер содержит 52 страницы ресторанной вентиляции: hub, коммерческие service-страницы, symptom-страницы, справочные guide-страницы, system/equipment-страницы и audience/integration-ветки. Контракт страниц находится в `data/ventilation-cluster-pages.json`, визуальный smoke — в `data/ventilation-screenshot-audit.json`, фото и их назначения — в `data/ventilation-photo-map.json`.

## Маршрут AI-правки

```bash
npm run ai:route -- --task <content|seo|links|cluster|assets|generator|docs|handoff> --page <file.html>
```

1. Сначала определить family и intent страницы в `data/ventilation-cluster-pages.json`.
2. Для service/symptom не переносить одинаковый диагностический текст на соседние URL: service объясняет услугу и результат, symptom — причину и следующий шаг, guide — профилактику и подготовку.
3. Все изменения выполнять в `src/pages/<slug>/page.json` и `src/pages/<slug>/sections/*`, metadata — в `data/page-metadata.json`; root HTML не редактировать отдельно.
4. Фото добавлять только через `data/ventilation-photo-map.json` и source-секции; сохранять `alt`, подпись и связь с узлом системы.
5. Новую страницу сначала добавить в manifest и связать минимум с hub, одной service- и одной близкой symptom/system-страницей.
6. Перед handoff обновить generated layer и прогнать guards.

## Слой SEO и перелинковки

- Hub связывает service, system и ключевые symptom-страницы.
- Service-страницы ведут на диагностику и релевантный symptom, но не конкурируют с hub по общему запросу.
- Symptom-страницы ссылаются на одну основную услугу и короткий guide-блок; не плодить новые URL под каждую переформулировку.
- Audience/integration-страницы должны иметь собственный контекст объекта, а не копию hub.
- Проверять title/description/canonical/robots через `data/page-metadata.json` и `npm run validate:data`.

## Проверки

```bash
npm run check:core
npm run check:ai
npm run check:conversion-ui
npm run check:visual-contract
npm run audit:ventilation-screenshots
npm run check:handoff
```

В среде без `node_modules` сначала `npm ci`. `npm run setup:visual` проверяет предустановленный system Chromium и ничего не скачивает. GitHub visual используется только как ручной `workflow_dispatch` fallback.
