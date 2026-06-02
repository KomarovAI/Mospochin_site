# Declarative Components

Этот слой — следующий шаг после `Static Component Builder`.

Сайт по-прежнему остаётся статическим HTML-сайтом, но повторяющиеся секции больше не обязаны лежать копиями в каждой странице. Одинаковые HTML-фрагменты вынесены в `src/components/shared/*`, а `src/pages/<slug>/page.json` ссылается на них через `componentRef`.

## Что это даёт

- Один общий блок можно улучшать в одном файле.
- Нейронке проще понять, какие секции реально уникальны, а какие являются общими компонентами.
- Root HTML остаётся production-выводом и проверяется byte-to-byte через builder.
- Визуал не меняется: shared components хранят тот же HTML, который раньше был продублирован в `src/pages/*/sections`.

## Текущий статус

- Shared directory: `src/components/shared/`
- Shared component files: 32
- Shared section refs: 289
- Оценочно удалено duplicate source bytes: ~1.1 MB
- Builder status: `shared-component-baseline`

## Как устроена ссылка на компонент

В `src/pages/<slug>/page.json` секция может быть локальной:

```json
{
  "id": "005-hero-example",
  "component": "hero",
  "file": "sections/005-hero-example.html"
}
```

Или общей:

```json
{
  "id": "052-faq-chastye-voprosy",
  "component": "faq",
  "componentRef": "src/components/shared/faq/faq-chastye-voprosy-o-remonte-parokonvektomatov--8a089715e4395424.html",
  "componentScope": "shared",
  "componentSignature": "8a089715e4395424",
  "sourceFile": "sections/052-faq-chastye-voprosy-o-remonte-parokonvektomatov.html"
}
```

`sourceFile` — только историческая подсказка. Builder читает `componentRef`.

## Команды

```bash
npm run site-builder:extract-shared
npm run check:shared-components
npm run check:site-builder
npm run build:site -- --page holodilniki.html --write
```

## Безопасный workflow

### Изменить уникальную секцию одной страницы

1. Открой `src/pages/<slug>/sections/*.html`.
2. Измени нужную секцию.
3. Собери страницу:

```bash
npm run build:site -- --page <page.html> --write
```

4. Проверь:

```bash
npm run check:site-builder
npm run ai:semantic-diff -- --page <page.html>
npm run ai:check
```

### Изменить общий компонент

1. Открой файл в `src/components/shared/<component>/*.html`.
2. Пойми, что он может влиять на несколько страниц.
3. Найди impact:

```bash
npm run ai:impact -- --files src/components/shared/<component>/<file>.html
```

4. Пересобери затронутые страницы или весь сайт:

```bash
npm run build:site -- --write
```

5. Проверь:

```bash
npm run check:shared-components
npm run check:site-builder
npm run validate:site
npm run ai:check
```

## Когда запускать extract-shared

Запускай `npm run site-builder:extract-shared` после крупных HTML-миграций, bootstrap из root HTML или массовых изменений секций. Команда заново найдёт одинаковые секции и вынесет их в shared components.

Порог по умолчанию:

- минимум 512 bytes на секцию;
- минимум 2 использования.

Порог можно менять:

```bash
npm run site-builder:extract-shared -- --min-bytes 1024 --min-refs 3
```

## Важные правила

- Не редактируй root HTML как источник правды, если страница подключена к builder.
- Не удаляй `componentRef`, если не хочешь вернуть секцию в локальный HTML-файл.
- После изменения shared component всегда считай правку high-impact: один файл может изменить много страниц.
- `check:shared-components` должен проходить до финальной передачи проекта.
- `check:site-builder` должен подтверждать byte-to-byte совпадение root HTML и builder output.
