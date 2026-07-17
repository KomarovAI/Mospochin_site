# MosPochin — исправление сломанных основных страниц

**Дата:** 17 июля 2026 года  
**Приоритет:** P0  
**Страницы:** `index.html`, `uslugi.html`, `about.html`, `contact.html`

## Причина

HTML основных страниц использовал актуальные Tailwind-классы, но `styles-combined.css` был собран по устаревшему набору исходников. В CSS отсутствовали не только цветовые stops градиента (`from-slate-950`, `via-brand-blue`, `to-blue-900`), но и часть отступов, типографики, скруглений и теней. Поэтому белый текст hero отображался на прозрачном фоне, а геометрия первого экрана отличалась от разметки.

## Исправление

1. Восстановлен воспроизводимый Tailwind CSS 3.4.19 build.
2. Добавлен `tailwind.config.cjs` со сканированием текущих HTML, source-компонентов и генераторов.
3. Исходный кастомный CSS вынесен в `src/styles/site.css` после директив Tailwind.
4. `styles-combined.css` пересобран из актуального проекта.
5. Добавлен статический guard `tools/check-core-css.mjs` для критических utilities и hero-контракта четырёх страниц.
6. Добавлены desktop/mobile visual-smoke manifests для исправленных и контрольных страниц.

## Команды

```bash
npm install
npm run build
npm run check:site-builder
npm run audit:core-pages-css
npm run audit:core-pages-control
```

## Проверки

- `Core CSS guard`: 13/13 селекторов, 4/4 страницы;
- builder parity: все HTML совпадают с builder output;
- desktop/mobile capture: 8/8 исправленных рендеров;
- контрольные кластеры: 10/10 рендеров;
- `npm audit`: 0 уязвимостей.

## Визуальный результат

На четырёх основных страницах восстановлены:

- тёмный сине-графитовый hero-градиент;
- контраст заголовков и описаний;
- верхние/нижние отступы;
- скругления и тени карточек;
- размеры и отступы CTA;
- mobile-композиция первого экрана.

Контрольные страницы холодильного оборудования, пароконвектоматов, посудомоечных машин, вентиляции и бытовой техники после пересборки сохранили корректное отображение.

## Изменённые файлы

- `styles-combined.css`;
- `package.json`;
- `package-lock.json`;
- `tailwind.config.cjs`;
- `src/styles/site.css`;
- `tools/check-core-css.mjs`;
- `data/core-pages-visual-smoke.json`;
- `data/core-pages-control-visual-smoke.json`;
- `_ops/MOSPOCHIN_CORE_PAGES_CSS_FIX_2026-07-17.md`.

## Повторная независимая верификация

После первичной упаковки выполнен повторный прогон из чистой распаковки архива.

Обнаружено и устранено одно некритичное расхождение: отчёт исправления первоначально был помещён в `_ops/`, что нарушало внутреннюю политику repository hygiene. Файл перенесён в `reports/handoff/`; после этого полный профиль `npm run check:core` прошёл все 72 шага.

Дополнительно подтверждено:

- чистая установка `npm ci`;
- повторная Tailwind-сборка даёт байт-в-байт идентичный `styles-combined.css`;
- `check:css-core`: 13/13 селекторов и 4/4 основные страницы;
- `check:site-builder`: 296/296;
- `check:core`: 72/72 шагов;
- `HTML head`: 296/296;
- `Site crawl`: 296 HTML, 278 sitemap URL, 0 issues;
- свежий Chromium capture: 8/8 основных и 10/10 контрольных desktop/mobile PNG;
- `npm audit`: 0 уязвимостей;
- ZIP integrity и SHA-256 проверены после финальной переупаковки.

Важно: эти результаты относятся к подготовленному релизному архиву. Боевой домен станет подтверждённо исправленным только после deploy exact release SHA и отдельного production screenshot-smoke.
