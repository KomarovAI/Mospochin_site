# Scale Policy: controlled growth to 150 pages

Этот файл фиксирует техническое решение по росту проекта.

## Решение

Проект можно расширять до **100–150 страниц** без большого предварительного blueprint-рефактора, но только если не ухудшается AI-сопровождаемость source-layer.

Не надо заранее строить архитектуру под 500 страниц. Сначала сайт растёт до 100–150 страниц, потом повторяющиеся реальные семейства страниц переводятся в `parametric`/`blueprint` слой.

## Жёсткий контракт

Machine-readable policy живёт в:

```text
 data/ai-scale-policy.json
```

Проверка:

```bash
npm run guard:scale
```

Эта проверка встроена в:

```bash
npm run verify:fast
npm run lint
npm run verify
```

Если проект начинает расти копипастой локальных секций, `guard:scale` должен упасть.

## Текущий режим

Текущий режим называется:

```text
controlled-growth-to-150-pages
```

Он означает:

- до 100 страниц можно расти по текущей builder/source модели;
- после 100 страниц нужно активнее сжимать повторяющиеся блоки;
- после 125 страниц обязательны blueprints для повторяющихся семейств;
- после 150 страниц новые страницы заблокированы policy до отдельного source-compression/blueprint этапа.

## Что нельзя делать

Нельзя масштабировать сайт так:

```text
скопировать root HTML
поправить текст руками
забыть src/pages / data / components
```

Нельзя добавлять десятки страниц, если при этом:

- падает shared/parametric coverage;
- растёт среднее число секций на страницу;
- растёт среднее число source-файлов на страницу;
- новые страницы не проходят builder parity;
- root HTML расходится с builder output.

## Что можно делать

Правильный рост:

```text
src/pages / data / components
        ↓
build:site
        ↓
root HTML
        ↓
verify + guard:scale
```

Новые страницы можно добавлять через scaffold/source слой, если после этого проходит:

```bash
npm run verify
```

## Контрольные точки

### До 75 страниц

Можно добавлять страницы по текущей модели, не ухудшая coverage.

### 75+ страниц

Начать выносить повторяемые:

- hero;
- FAQ;
- proof;
- pricing;
- CTA;
- service intro.

### 100+ страниц

Нельзя продолжать рост длинными локальными section-списками. Нужен активный parametric слой.

### 125+ страниц

Нужны blueprints для повторяющихся семейств:

- service-page;
- equipment-page;
- equipment-problem-page;
- brand-repair-page;
- error-code-page.

### 150+ страниц

Стоп. Сначала отдельный source-compression/blueprint pack, потом рост дальше.

## Как менять лимиты

Лимиты можно менять только осознанно в `data/ai-scale-policy.json`.

Если `guard:scale` падает, правильная реакция — не отключать проверку, а сделать один из вариантов:

1. вынести повторяющиеся секции в shared/parametric;
2. перевести семейство страниц на blueprint;
3. обновить source-complexity отчёт;
4. только после этого менять policy, если причина действительно обоснована.

## Команды

```bash
npm run guard:scale
npm run guard:scale:strict
npm run analyze:source-complexity
npm run verify
```

`guard:scale:strict` превращает warning-и в ошибки. Его удобно запускать перед крупным расширением сайта.
