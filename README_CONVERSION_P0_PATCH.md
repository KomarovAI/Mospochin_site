# Как применить патч

Этот архив — overlay-патч поверх проекта `Mospochin_site-main`.

## Вариант 1: распаковать поверх проекта

```bash
unzip mospochin-conversion-p0-runtime-attribution-patch-20260607.zip -d /path/to/parent-dir
cd /path/to/parent-dir/Mospochin_site-main
npm run check:core
npm run check:handoff
```

## Вариант 2: скопировать файлы вручную

Скопировать в корень проекта:

```text
analytics.js
telegram-form.js
server/telegram-api.mjs
CHANGELOG_AI.md
reports/direct/CONVERSION_P0_PATCH_20260607.md
reports/patches/conversion-p0-runtime-attribution.diff.md
```

## После деплоя

Проверить в DevTools Network:

```text
localhost / 127.0.0.1 → нет запросов к mc.yandex.ru
mospochin.ru → Метрика грузится
```

Проверить тестовую заявку с UTM:

```text
https://mospochin.ru/parokonvektomat-unox.html?utm_source=yandex&utm_medium=cpc&utm_campaign=test&utm_content=test_ad&utm_term=test&utm_landing=unox_main&yclid=test123
```

В Telegram должны появиться `page`, `url`, `utm_*`, `utm_landing`, `yclid`.
