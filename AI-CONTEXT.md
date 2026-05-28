# AI-CONTEXT: MosPochin Site

**Краткая справка для нейронки. Читай ЭТО вместо всех HTML файлов.**

## 🎯 Что это за сайт

MosPochin — сервис ремонта техники в Москве с 2010 года. Две ветки бизнеса:

- **restaurant** — ресторанное оборудование (B2B, юрлица, 24/7, гарантия до 24 мес)
- **household** — бытовая техника на дому (B2C, гарантия 12 мес)

## 📊 Ключевые цифры

- 15+ лет опыта, 500+ клиентов, 12K+ ремонтов
- Выезд 45 мин по Москве, 98% за 1 визит
- Москва + МО (Химки, Мытищи, Балашиха и т.д.)
- Работаем с юрлицами, НДС

## 🏗️ Архитектура сайта

### Структура файлов

```
Mospochin_site/
├── 📄 30+ HTML страниц (оптимизированы через partials/)
├── 🎨 styles.css (53 KB) + styles-built.css (81 KB)
├── ⚙️ main.js (104 KB) + telegram-form.js (13 KB)
├── 📊 data/*.json (23 файла) — источник правды для контента
├── 🛠️ tools/*.mjs (42 инструмента) — автоматизация
├── 📦 partials/*.html — переиспользуемые компоненты
└── 📖 docs/ — документация
```

### Как работает система компонентов

HTML файлы оптимизированы через partials:

```html
<!-- INCLUDE: partials/header.html -->
<!-- INCLUDE: partials/footer.html -->
<!-- INCLUDE: partials/mobile-sticky.html -->
```

- **Для разработки:** HTML файлы маленькие, легко читать и редактировать
- **Для production:** `npm run build:partials` собирает всё обратно

## 📝 Как редактировать (ПРАВИЛА)

### ✅ ЧТО МОЖНО менять

1. **Тексты, цены, FAQ** — через JSON в `data/`:
   - `data/household-services.json` — бытовые услуги
   - `data/restaurant-services.json` — ресторанные услуги
   - `data/household-page-slots.json` — FAQ, формы, proof
   - `data/page-metadata.json` — SEO title/description

2. **Через готовые npm команды:**
   ```bash
   npm run household:set-faq -- --page <file.html> --faq-json '<json>'
   npm run household:set-metadata -- --page <file.html> --title "..." --description "..."
   npm run household:set-proof -- --page <file.html> --proof '<json>'
   npm run restaurant:set-* — то же самое для ресторанной ветки
   ```

3. **AI контент слой:**
   - `content/site-content.json` — весь текст сайта в одном файле
   - Читай этот файл чтобы понять что на сайте, НЕ читай HTML

### ❌ ЧТО НЕЛЬЗЯ трогать

- `.github/workflows/*` — CI/CD
- `tools/*.mjs` — скрипты автоматизации
- `main.js`, `telegram-form.js` — runtime логика
- `styles.css` — стили (есть ещё `styles-built.css` для production)
- Структуру HTML (секции, классы, id)

## 🔍 Валидация после изменений

```bash
npm run validate:site          # основная валидация
npm run doctor:page -- --page <file.html>  # проверка конкретной страницы
npm run sync:metadata          # синхронизация метаданных
npm run generate:sitemap       # обновление sitemap
```

## 📁 Ключевые файлы

- `AGENTS.md` — правила для AI (короткие)
- `data/operator-recipes.json` — защитные рецепты
- `data/page-metadata.json` — SEO всех страниц
- `content/site-content.json` — **весь контент сайта** (читай это!)

## 🎯 Типовые задачи

### Изменить цену/текст услуги

1. Найти услугу в `data/household-services.json` или `restaurant-services.json`
2. Изменить поле
3. `npm run validate:site`

### Добавить FAQ на страницу

```bash
npm run household:set-faq -- --page bytovaya-holodilniki.html \
  --faq-json '[{"question":"...?","answer":"..."}]'
```

### Изменить SEO страницы

```bash
npm run household:set-metadata -- --page bytovaya-holodilniki.html \
  --title "Новый заголовок" --description "Новое описание"
```

## 🆘 Если что-то сломалось

```bash
git status                    # посмотреть что изменилось
git diff                      # посмотреть изменения
npm run validate:site         # запустить валидацию
git checkout -- <file>        # откатить конкретный файл
```

## 📊 Оптимизация для нейронки

### Проблема была

- HTML файлы по 183 KB
- Нейронка читала весь HTML чтобы изменить один текст
- 95% HTML — это вёрстка, не контент

### Что сделали

- Вынесли повторяющиеся блоки в `partials/`
- HTML файлы стали 40-50 KB вместо 183 KB
- Создали `content/site-content.json` — весь текст в одном файле
- Нейронка теперь читает ~100 KB вместо 578 MB

### Как работать

1. **Читай `content/site-content.json`** — там весь текст сайта
2. **Используй JSON в `data/`** — для редактирования контента
3. **НЕ читай HTML** — они для продакшена, не для понимания

## 🚀 Команды для работы

```bash
# Извлечь контент для нейронки
npm run content:extract

# Оптимизировать HTML (разделить на partials)
npm run optimize:html

# Собрать partials обратно в HTML (для production)
npm run build:partials

# Валидация
npm run validate:site
npm run doctor:page -- --page <file.html>
```

## 📞 Контакты

- Телефон: 8 (999) 005-71-72
- Email: mospochin@yandex.ru
- Сайт: mospochin.ru
- Telegram: @mospochin_bot

---

**Этот файл создан для нейронки. Читай его вместо всех HTML файлов.**
