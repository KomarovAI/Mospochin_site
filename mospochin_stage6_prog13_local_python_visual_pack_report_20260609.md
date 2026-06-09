# MosPochin — Prog13 local Python visual screenshot pack

Дата: **2026-06-09**
База: **Prog12 AI visual review workflow**
Назначение прогона: добавить локальный Python-генератор screenshot ZIP-пака, чтобы пользователь мог снять скриншоты у себя и загрузить отдельный ZIP в ChatGPT для реального визуального анализа нейронкой.

## Что добавлено

Новые файлы:

```text
tools/capture_visual_pack.py
requirements-visual.txt
data/visual-ai-capture-manifest.json
docs/LOCAL_VISUAL_SCREENSHOT_PACK.md
```

Новые npm-wrapper команды:

```bash
npm run visual:local-pack
npm run visual:local-pack:pariki
npm run visual:local-pack:all
npm run visual:local-pack:dry-run
```

Главная команда без npm:

```bash
python3 tools/capture_visual_pack.py --mode smoke --zip
```

## Какой цикл теперь поддерживается

```text
1. Пользователь локально запускает Python-скрипт.
2. Скрипт поднимает локальный HTTP server из root проекта.
3. Playwright Python открывает страницы.
4. Снимаются desktop/mobile/mobile_full screenshots.
5. Скриншоты, HTML snapshots, manifest, environment и review-template пакуются в отдельный ZIP.
6. Пользователь загружает ZIP в ChatGPT.
7. Нейронка реально открывает PNG и делает visual/content/UX review.
8. После правок пользователь генерирует новый ZIP, и цикл повторяется.
```

## Режимы генератора

```bash
# smoke: главные страницы + ключевой пароконвектоматный кластер
python3 tools/capture_visual_pack.py --mode smoke --zip

# весь пароконвектоматный кластер
python3 tools/capture_visual_pack.py --mode pariki --zip

# все root HTML страницы
python3 tools/capture_visual_pack.py --mode all --zip

# dry-run без браузера, только проверка manifest/структуры ZIP
python3 tools/capture_visual_pack.py --mode smoke --dry-run --zip
```

## Что попадает в visual ZIP

```text
AI_VISUAL_REVIEW.md
manifest.json
environment.json
pages.json
review-template.json
screenshots/*.png
html-snapshots/*.html
logs/capture.log
logs/errors.json
```

## Проверки этого прогона

Проектные проверки:

```text
python3 -m py_compile tools/capture_visual_pack.py  passed
npm run visual:local-pack:dry-run                  passed
npm run build:site -- --write                      passed
npm run sync:generated                             passed
npm run check:core                                 passed
npm run check:handoff                              passed
npm run check:images                               passed
npm run deploy:pack                                passed
npm run check:deploy-runtime                       passed
npm run handoff:pack                               passed
```

## Реальная попытка screenshot capture в этой среде

Без установленного Playwright Chromium:

```text
Could not launch Chromium.
Рекомендация скрипта: python -m playwright install chromium
```

Через системный Chromium:

```text
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/chromium python3 tools/capture_visual_pack.py --mode smoke --zip
```

Результат в текущей ChatGPT/container среде:

```text
screenshots=0
errors=33
root cause: Chromium policy blocks localhost with ERR_BLOCKED_BY_ADMINISTRATOR
```

Это не ошибка сайта и не ошибка генератора. В обычной локальной среде/VPS/CI без такой политики скрипт должен снять PNG и собрать ZIP.

## Как запускать пользователю локально

```bash
python3 -m venv .venv-visual
source .venv-visual/bin/activate
pip install -r requirements-visual.txt
python -m playwright install chromium
python tools/capture_visual_pack.py --mode smoke --zip
```

Если на Linux не хватает системных зависимостей:

```bash
python -m playwright install --with-deps chromium
```

Если нужно использовать системный Chromium:

```bash
PLAYWRIGHT_CHROMIUM_EXECUTABLE=/usr/bin/chromium \
  python tools/capture_visual_pack.py --mode smoke --zip
```

## Что загружать в ChatGPT

Загружать только ZIP из:

```text
reports/visual-ai-review/<timestamp>/mospochin-visual-ai-review-pack-<timestamp>.zip
```

Не нужно загружать весь проект ради визуальной проверки, если правки не требуются. Скриншоты — review artifact, не production artifact.

## Важные ограничения

- Скриншоты не входят в public deploy pack.
- Browser binaries и node_modules не добавлялись в архив проекта.
- Dry-run ZIP не содержит PNG и не подходит для визуального анализа.
- Реальный visual pass считается пройденным только после загрузки screenshot ZIP в ChatGPT и ручного/нейронного анализа картинок.
