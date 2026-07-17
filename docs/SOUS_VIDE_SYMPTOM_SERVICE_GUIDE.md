# Sous-vide symptom-service pages

Страницы строятся от наблюдаемого симптома. Пользователю разрешены только внешние безопасные проверки без вскрытия, обхода датчиков или защит. Каждая техническая формулировка должна ссылаться на evidence ID. `Article` не используется: основной объект — `Service` + `WebPage`. Видимый FAQ и FAQPage генерируются из одного source-of-truth.

## SEO and linking

The canonical link graph is `data/sous-vide-link-graph.json`. Published symptom pages link only to related symptoms from the same equipment family, plus the correct equipment overview and repair page. Generate and validate the layer with `npm run generate:sous-vide-seo-layer` and `npm run audit:sous-vide-seo`. FAQPage is maintained for visible/schema parity, not as a promise of a Google FAQ rich result.
