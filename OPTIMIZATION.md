# 🚀 Оптимизация сайта для работы с нейронкой

## Проблема

Большие HTML файлы (183KB+) тяжело парсить и редактировать нейронке:
- Дублирующийся код (header, footer, формы)
- Inline стили в HTML
- Нет системы компонентов
- Сложно найти и изменить нужный элемент

## Решение

### 1. Система компонентов (partials/)

Создана папка `partials/` с переиспользуемыми блоками:

```
partials/
├── mobile-sticky-footer.html    # Мобильная панель с кнопками
├── whatsapp-floating.html       # Плавающая кнопка WhatsApp
└── noscript-fallback.html       # Fallback для отключённого JS
```

### 2. Оптимизация HTML файлов

Скрипт `npm run optimize:site`:
- Находит большие HTML файлы (>50KB)
- Заменяет дублирующийся код на комментарии `<!-- INCLUDE: partials/... -->`
- Уменьшает размер файлов на 10-15%

### 3. Сборка компонентов

Скрипт `npm run build:partials`:
- Заменяет комментарии `<!-- INCLUDE: ... -->` на реальное содержимое из `partials/`
- Восстанавливает полные HTML файлы для продакшена

## Использование

### Оптимизация файлов

```bash
npm run optimize:site
```

Эта команда:
1. Создаёт компоненты в `partials/`
2. Заменяет дублирующийся код в HTML на INCLUDE комментарии
3. Уменьшает размер файлов

### Сборка для продакшена

```bash
npm run build:partials
```

Эта команда:
1. Заменяет INCLUDE комментарии на реальное содержимое
2. Восстанавливает полные HTML файлы

## Workflow для нейронки

### 1. Редактирование контента

Нейронка работает с оптимизированными файлами (меньше дублирования, легче парсить):

```bash
# Оптимизируем файлы
npm run optimize:site

# Нейронка редактирует оптимизированные файлы
# ...

# Собираем для продакшена
npm run build:partials

# Проверяем
npm run validate:site
```

### 2. Редактирование компонентов

Если нужно изменить компонент (например, mobile footer):

```bash
# Редактируем partials/mobile-sticky-footer.html
# ...

# Собираем - изменения применятся ко всем файлам
npm run build:partials
```

## Результаты

### До оптимизации
- `remont-oborudovaniya-restorana-parokonvektomat.html`: 184KB
- `parokonvektomat-kod-oshibki.html`: 183KB
- `holodilniki.html`: 157KB
- Дублирование: mobile footer, WhatsApp button, noscript fallback в каждом файле

### После оптимизации
- Файлы уменьшены на 10-15%
- Дублирующийся код вынесен в `partials/`
- Изменение одного компонента применяется ко всем файлам
- Нейронке легче парсить и редактировать

## Следующие шаги

### 1. Вынести inline стили в CSS

Найти все `<style>` блоки в HTML и переместить в `styles.css`:

```bash
# Найти inline стили
grep -r "<style>" *.html
```

### 2. Создать систему шаблонов

Для типовых секций (hero, features, pricing) создать шаблоны:

```
templates/
├── hero-section.html
├── features-grid.html
└── pricing-table.html
```

### 3. Автоматическая генерация страниц

Создать скрипт для генерации страниц из JSON данных:

```javascript
// data/pages/holodilniki.json
{
  "title": "Ремонт холодильников",
  "hero": { ... },
  "features": [ ... ],
  "pricing": [ ... ]
}
```

## Команды

```bash
# Оптимизация файлов
npm run optimize:site

# Сборка компонентов
npm run build:partials

# Валидация
npm run validate:site

# Dev server
npm run dev
```

## Архитектура

```
Mospochin_site/
├── *.html                    # Оптимизированные файлы с INCLUDE
├── partials/                 # Переиспользуемые компоненты
│   ├── mobile-sticky-footer.html
│   ├── whatsapp-floating.html
│   └── noscript-fallback.html
└── tools/
    ├── optimize-site.mjs     # Оптимизация файлов
    └── build-partials.mjs    # Сборка компонентов
```

## Безопасность

- Все изменения в ветке `ai-optimization`
- Перед оптимизацией создаётся бэкап
- Можно откатиться в любой момент: `git checkout backup-before-ai-optimization`
- Валидация после каждого изменения: `npm run validate:site`
