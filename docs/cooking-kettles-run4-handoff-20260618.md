# MosPochin — Cooking Kettles Cluster Run 4 Handoff

Дата: 2026-06-18
Режим: финальная полировка / predeploy handoff

## Область

Прогон 4 не меняет Директ и не добавляет новые рекламные гипотезы. Цель — закрепить уже созданный кластер пищеварочных котлов как деплойный пакет:

- проверить canonical / sitemap / indexability;
- проверить JSON-LD Service / FAQPage / BreadcrumbList;
- проверить формы и hidden attribution через `telegram-form.js`;
- проверить внутреннюю перелинковку между хабом, симптомами, узлами, Abat-кодами и брендами;
- добавить отдельный визуальный manifest `data/cooking-kettles-screenshot-audit.json`;
- добавить npm-скрипт `audit:cooking-kettles-screenshots`.

## Страницы кластера

Всего: 25 страниц.

### Хаб и симптомы

- `pishevarochnye-kotly.html`
- `pishevarochnyj-kotel-ne-greet.html`
- `pishevarochnyj-kotel-dolgo-greet.html`
- `pishevarochnyj-kotel-techet.html`
- `pishevarochnyj-kotel-vybivaet-avtomat.html`
- `pishevarochnyj-kotel-ne-vklyuchaetsya.html`
- `pishevarochnyj-kotel-kod-oshibki.html`
- `pishevarochnyj-kotel-suhoy-hod.html`

### Узлы ремонта

- `pishevarochnyj-kotel-abat-kpem.html`
- `pishevarochnyj-kotel-zamena-tena.html`
- `pishevarochnyj-kotel-remont-slivnogo-krana.html`
- `pishevarochnyj-kotel-parovodyanaya-rubashka.html`
- `pishevarochnyj-kotel-datchik-temperatury.html`
- `pishevarochnyj-kotel-plata-upravleniya.html`
- `pishevarochnyj-kotel-manometr.html`

### Abat / КПЭМ коды

- `pishevarochnyj-kotel-abat-e01.html`
- `pishevarochnyj-kotel-abat-e02.html`
- `pishevarochnyj-kotel-abat-e04.html`
- `pishevarochnyj-kotel-abat-h20.html`
- `pishevarochnyj-kotel-abat-e17.html`

### Бренды

- `remont-pishevarochnyh-kotlov-abat.html`
- `remont-pishevarochnyh-kotlov-kpem.html`
- `remont-pishevarochnyh-kotlov-apach.html`
- `remont-pishevarochnyh-kotlov-atesy.html`
- `remont-pishevarochnyh-kotlov-iterma.html`

## Перед деплоем

```bash
npm ci
npm run verify:fast
npm run lint
npm run predeploy:check
npm audit --audit-level=moderate
```

Опционально для визуального контроля:

```bash
npx playwright install firefox
npm run audit:cooking-kettles-screenshots
```

## После деплоя

Проверить production URL:

```bash
curl -I https://mospochin.ru/pishevarochnye-kotly.html | head -40
curl -I https://mospochin.ru/pishevarochnyj-kotel-abat-h20.html | head -40
curl -I https://mospochin.ru/remont-pishevarochnyh-kotlov-abat.html | head -40
```

Затем смотреть Метрику и заявки по:

- `page_url`, `page_path`;
- `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`;
- `yclid`, `referrer`;
- phone / WhatsApp / form events.
