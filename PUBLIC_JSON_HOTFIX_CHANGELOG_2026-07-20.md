# MosPochin public JSON hotfix v1

## Причина

`tools/generate-public-file-list.mjs` использует явный allowlist для файлов `data/*.json`.
Три новых runtime-файла инженерного кластера присутствовали в репозитории и `.deploy/include-files.txt`,
но отсутствовали в `PUBLIC_DATA_FILES`, поэтому `deploy/post-activate.sh` не копировал их в публичный webroot.

## Исправление

В публичный allowlist добавлены:

- `data/parokonvektomat-error-codes.json`
- `data/parokonvektomat-error-navigation.json`
- `data/error-conversion-pages.json`

## Ожидаемый production smoke

Все три URL должны отвечать HTTP 200 и иметь размер выше установленного smoke-порога.

## Безопасность раскатки

Это overlay source-handoff. Он не удаляет файлы и не меняет canonical `.github/workflows/deploy.yml`.
