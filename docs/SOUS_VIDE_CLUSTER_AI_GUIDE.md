# Sous-vide — AI cluster guide

Кластер содержит 15 страниц: hub, 6 сервисных страниц, 5 информационных материалов и 3 noindex Direct landing. Контракт страниц — `data/sous-vide-cluster-pages.json`, визуальный manifest — `data/sous-vide-screenshot-audit.json`.

## Состав MVP

- Hub: `sous-vide-restoranov.html`.
- Service: общий ремонт, термостаты, вакуумные упаковщики, ремонт термостата, ремонт вакууматора и обслуживание.
- Guide: принцип sous-vide, выбор оборудования, вакуумная упаковка, шоковое охлаждение и безопасность процесса.
- Promo: три noindex landing с отдельными рекламными интентами.

## Маршрут правки

1. Определи intent страницы в cluster manifest.
2. Редактируй `src/pages/<slug>/page.json` и `src/pages/<slug>/sections/*`; root HTML — production output.
3. Не смешивай сервисные утверждения с технологическими режимами приготовления.
4. Не публикуй универсальные температуры, время, охлаждение или хранение без профильной проверки.
5. Direct landing поддерживается через `data/direct-landing-pages.json` и `tools/generate-direct-landings.mjs`; для sous-vide используется `renderMode: compact-service-v1`.
6. Каждая страница должна иметь минимум три ссылки на другие страницы кластера. Все такие ссылки обязаны иметь `data-cta-id`, `data-cta-group="internal_link"` и `data-block="related_cluster"`.
7. Индексируемые страницы не ссылаются на noindex Direct landing; рекламный контур получает трафик из кампаний и сам возвращает пользователя на SEO/service-страницы.
8. FAQ хранится отдельной builder-секцией с `component: "faq"`. JSON-LD `FAQPage` не редактируется вручную: его генерирует FAQ Registry.
9. Hub должен оставаться основной навигационной точкой; новые симптомные или брендовые страницы добавляются только после отдельного blueprint.

## Проверки

```bash
npm run generate:direct-landings
npm run generate:sitemap
npm run sync:generated
npm run check:conversion-ui
npm run check:sous-vide-run5
npm run check:visual-contract
npm run check:visual-workflows
npm run audit:sous-vide-screenshots
npm run check:handoff
```

`audit:sous-vide-screenshots` использует основной visual runtime проекта:

- предустановленный системный Chromium;
- Playwright `page.setContent()`;
- локальный request router для CSS, JS, JSON, шрифтов и изображений;
- раздельные `first-view` и `full-page` кадры;
- page worker timeout/retry;
- fingerprint/state для безопасного resume;
- проверку PNG signature, размера и SHA-256.

GitHub Actions — только ручной резерв через `workflow_dispatch`.

## Run 5 contract

`npm run check:sous-vide-run5` проверяет весь кластер как единый SEO/analytics-граф:

- уникальность indexable title, description и H1;
- canonical, `og:url`, robots и sitemap/noindex;
- соответствие `CollectionPage`, `Service`, `Article`, `FAQPage` и `BreadcrumbList`;
- совпадение видимого FAQ с generated FAQPage schema;
- регистрацию FAQ в `content/faq/page-faq-registry.json`;
- отсутствие SEO-ссылок на Direct/noindex страницы;
- существование и analytics-разметку каждого кластерного перехода;
- входящие ссылки на каждую indexable дочернюю страницу;
- совпадение metrics context, body data-атрибутов и cluster manifest.
