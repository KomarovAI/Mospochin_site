# MosPochin — visual fix patch handoff

Дата: 2026-06-20
База: `mospochin_metrics_run6_final_tz_compliance_20260620.zip`
Цель: исправить визуальные проблемы, найденные по screenshots/contact sheets visual audit.

## Что исправлено

### 1. Header overlap на light/direct kettle pages

Проблема: на светлых страницах пищеварочных котлов белый navbar визуально начинался под красной emergency top bar, из-за чего на mobile и desktop шапка выглядела обрезанной.

Правка: добавлен CSS scope для `body.page-direct-landing`:

- `#header-container` получает верхний offset `3rem`;
- первый section получает увеличенный top padding;
- mobile nav получает устойчивую высоту;
- mobile menu button сохраняет крупный tap target.

Файл: `styles-combined.css`.

### 2. Контраст stat cards на `/contact.html`

Проблема: hero stat cards на тёмном фоне контактов выглядели мутно; цифры и подписи плохо читались.

Правка:

- затемнён фон `.glass-card` в `body.page-contact header`;
- усилен border;
- цифры переведены в оранжевый с text-shadow;
- подписи переведены в почти белый.

Файл: `styles-combined.css`.

### 3. Mobile `/about.html`: устранён видимый `0+` / `0%`

Проблема: counters сначала отрисовывались как `0+`, потом анимировались. На скриншотах и медленных устройствах это визуально выглядело как слабые/странные цифры.

Правка:

- `initCounters()` теперь сразу пишет финальное значение из `data-target + data-suffix`;
- counter сразу получает `.is-visible`;
- анимация от нуля отключена ради стабильного визуального результата.

Файл: `main.js`.

### 4. Mobile brand/header polish

Проблема: на mobile в шапке часто был виден только оранжевый квадрат-иконка без бренда.

Правка:

- на ширинах `380px–767px` показывается `MosPochin` рядом с иконкой;
- subtitle скрывается, чтобы не раздувать header.

Файл: `styles-combined.css`.

### 5. Tap target safety

Правка: сохранён минимальный размер важных header/CTA элементов не меньше `44px`.

Файл: `styles-combined.css`.

## Изменённые файлы

- `main.js`
- `styles-combined.css`

HTML-страницы не менялись, чтобы не ломать site-builder parity.

## Проверки

Внутри patch workspace выполнено:

```bash
npm run check:core
npm run verify:metrics
node --check main.js
```

Результат:

```text
PASS check:core
PASS verify:metrics
PASS node --check main.js
```

## Как применить

Вариант 1 — применить full archive:

```bash
cd ~/raskatka_mospoch/Mospochin_site_repo || exit 1
unzip -o ~/Загрузки/mospochin_visual_fix_2026-06-20_full.zip -d .
npm run check:core
npm run verify:metrics
git status --short
git add main.js styles-combined.css
git commit -m "Fix visual audit issues in header counters and contact contrast"
git push origin main
```

Вариант 2 — применить patch-only archive:

```bash
cd ~/raskatka_mospoch/Mospochin_site_repo || exit 1
unzip -o ~/Загрузки/mospochin_visual_fix_2026-06-20_patch_only.zip -d .
npm run check:core
npm run verify:metrics
git status --short
git add main.js styles-combined.css
git commit -m "Fix visual audit issues in header counters and contact contrast"
git push origin main
```

## Что проверить после deploy

Запустить visual audit:

```bash
gh workflow run visual-audit.yml \
  -R KomarovAI/Mospochin_site \
  --ref main \
  -f scope=sitemap \
  -f viewports=both \
  -f workers=10
```

Проверить по картинкам:

- light kettle pages: header не обрезан, белый navbar полностью ниже red top bar;
- `/contact.html`: stat cards читаются на desktop/mobile;
- `/about.html` mobile: нет `0+`, видны финальные значения `15+`, `500+`, `12000+`, `98%`;
- mobile header: на 390px виден `MosPochin`, а не только оранжевая иконка.
