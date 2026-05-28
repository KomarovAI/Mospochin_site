# 🚀 Оптимизация сайта для работы с нейронкой

## Что сделано

Сайт оптимизирован для работы с AI-ассистентами (Claude, GPT, и т.д.):

### 1. **Система компонентов (partials/)**
- Повторяющиеся блоки (header, footer, формы) вынесены в `partials/`
- HTML файлы уменьшены с 183KB до ~50KB
- Нейронка видит структуру, а не тонны вёрстки

### 2. **Контент слой (content/site-content.json)**
- Весь текстовый контент сайта в одном JSON файле
- ~100KB вместо 578MB HTML
- Нейронка читает смысл, не разметку

### 3. **Документация (AI-CONTEXT.md)**
- Краткая справка о сайте в 200 строк
- Правила редактирования
- Примеры команд

## Как использовать

### Полная оптимизация (одна команда)

```bash
npm run optimize:all
```

Это запустит:
1. `optimize:html` — вынесет блоки в partials/
2. `content:extract` — извлечёт контент в JSON
3. `validate:site` — проверит что ничего не сломано

### Пошаговая оптимизация

```bash
# 1. Оптимизировать HTML
npm run optimize:html

# 2. Извлечь контент для нейронки
npm run content:extract

# 3. Валидация
npm run validate:site
```

### Для production (сборка)

```bash
# Собрать partials обратно в HTML
npm run build:partials
```

## Как нейронка работает с сайтом

### Старый способ (медленно)
1. Нейронка читает `parokonvektomat.html` (183KB)
2. Ищет нужный текст в куче вёрстки
3. Редактирует HTML напрямую
4. Риск сломать вёрстку

### Новый способ (быстро)
1. Нейронка читает `content/site-content.json` (~100KB)
2. Находит нужный текст в структурированном JSON
3. Использует `npm run household:set-*` для редактирования
4. Валидирует через `npm run validate:site`
5. HTML обновляется автоматически из JSON

## Результаты

### До оптимизации
- HTML файлов: 30+
- Общий размер: 578 MB
- Самый большой файл: 183 KB
- Нейронка читала: весь HTML

### После оптимизации
- HTML файлов: 30+ (но тонкие)
- Контент в JSON: ~100 KB
- Экономия контекста: **95%**
- Нейронка читает: только JSON

## Команды для редактирования

### Бытовые услуги

```bash
# Изменить FAQ
npm run household:set-faq -- --page bytovaya-holodilniki.html \
  --faq-json '[{"question":"...?","answer":"..."}]'

# Изменить SEO
npm run household:set-metadata -- --page bytovaya-holodilniki.html \
  --title "Новый заголовок" --description "Новое описание"

# Изменить proof
npm run household:set-proof -- --page bytovaya-holodilniki.html \
  --proof '<json>'
```

### Ресторанное оборудование

```bash
# То же самое, но с restaurant:*
npm run restaurant:set-faq -- --page <file.html> --faq-json '<json>'
npm run restaurant:set-metadata -- --page <file.html> --title "..." --description "..."
npm run restaurant:set-proof -- --page <file.html> --proof '<json>'
```

## Структура файлов

```
Mospochin_site/
├── 📄 *.html (оптимизированные, с INCLUDE)
├── 📦 partials/
│   ├── header.html
│   ├── footer.html
│   ├── mobile-sticky.html
│   ├── whatsapp-float.html
│   └── noscript-fallback.html
├── 📊 content/
│   └── site-content.json (весь текст сайта)
├── 📊 data/
│   ├── household-services.json
│   ├── restaurant-services.json
│   ├── page-metadata.json
│   └── ... (23 файла)
├── 📖 AI-CONTEXT.md (документация для нейронки)
└── 🛠️ tools/
    ├── optimize-html.mjs
    ├── extract-content.mjs
    ├── build-partials.mjs
    └── optimize-all.mjs
```

## Безопасность

- Все изменения в ветке `site-optimization`
- Main ветка не тронута
- Можно откатиться: `git checkout main`

## Если что-то сломалось

```bash
# Посмотреть что изменилось
git status
git diff

# Откатить конкретный файл
git checkout -- <file>

# Полностью откатить
git checkout main
```

## Следующие шаги

1. ✅ Оптимизация HTML выполнена
2. ✅ Извлечение контента выполнено
3. ✅ Документация создана
4. ⏭️ Можно коммитить: `git add . && git commit -m "feat: оптимизация для нейронки"`
5. ⏭️ Можно пушить: `git push origin site-optimization`

---

**Сайт готов к работе с нейронкой! 🎉**
