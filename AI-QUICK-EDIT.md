# 🤖 AI Quick Edit Guide

Простые команды для быстрого редактирования сайта MosPochin.

## 🚀 Быстрый старт

```bash
# Запустить dev server
npm run dev

# Открыть сайт
open http://localhost:3000
```

## 💰 Изменить цену

```bash
npm run ai:price --page=holodilniki.html --service="Замена компрессора" --price=5000
```

**Параметры:**
- `--page` — имя HTML файла (например: `holodilniki.html`, `stiralnye-mashiny.html`)
- `--service` — название услуги
- `--price` — новая цена в рублях

**Примеры:**
```bash
npm run ai:price --page=holodilniki.html --service="Замена компрессора" --price=5000
npm run ai:price --page=posudomoyki.html --service="Ремонт насоса" --price=3500
```

## ✏️ Изменить текст

```bash
npm run ai:text --page=holodilniki.html --selector="h1" --text="Новый заголовок"
```

**Параметры:**
- `--page` — имя HTML файла
- `--selector` — CSS селектор (например: `h1`, `.description`, `#hero-title`)
- `--text` — новый текст

**Примеры:**
```bash
npm run ai:text --page=index.html --selector="h1" --text="Ремонт ресторанного оборудования в Москве"
npm run ai:text --page=about.html --selector=".subtitle" --text="Работаем с 2010 года"
```

## ❓ Добавить FAQ

```bash
npm run ai:faq-add --page=holodilniki.html --q="Сколько стоит ремонт?" --a="От 2000 рублей"
```

**Параметры:**
- `--page` — имя HTML файла
- `--q` — вопрос
- `--a` — ответ

**Примеры:**
```bash
npm run ai:faq-add --page=holodilniki.html \
  --q="Сколько стоит диагностика?" \
  --a="Диагностика бесплатна при заказе ремонта"

npm run ai:faq-add --page=bytovaya-index.html \
  --q="Вы работаете в выходные?" \
  --a="Да, работаем без выходных с 8:00 до 22:00"
```

## 📞 Изменить контакты

```bash
# Изменить телефон
npm run ai:contact --phone="+7 (999) 123-45-67"

# Изменить email
npm run ai:contact --email="new@email.com"
```

**Примеры:**
```bash
npm run ai:contact --phone="+7 (495) 123-45-67"
npm run ai:contact --email="info@mospochin.ru"
```

## 🔍 Проверить изменения

```bash
# Запустить dev server
npm run dev

# Открыть в браузере
open http://localhost:3000

# Валидация сайта
npm run validate:site
```

## 📝 Структура проекта

```
Mospochin_site/
├── index.html              # Главная страница (ресторанное оборудование)
├── bytovaya-index.html     # Главная страница (бытовая техника)
├── about.html              # О компании
├── contact.html            # Контакты
├── uslugi.html             # Услуги (ресторанное)
├── bytovaya-uslugi.html    # Услуги (бытовое)
├── styles.css              # Стили (исходник)
├── styles-built.css        # Стили (собранные)
├── main.js                 # JavaScript
├── data/                   # JSON данные
│   ├── household-services.json
│   ├── restaurant-services.json
│   ├── page-metadata.json
│   └── contact-config.json
└── tools/                  # Скрипты автоматизации
```

## 🎯 Типичные сценарии

### Сценарий 1: Обновить цены на странице холодильников

```bash
# 1. Изменить цену
npm run ai:price --page=holodilniki.html --service="Замена компрессора" --price=5000

# 2. Проверить в браузере
npm run dev
# Открыть http://localhost:3000/holodilniki.html

# 3. Закоммитить изменения
git add .
git commit -m "Обновил цену на замену компрессора"
git push
```

### Сценарий 2: Добавить новую услугу

```bash
# 1. Создать новую страницу
npm run scaffold:household-service -- --slug=mikrovolnovki --name="Микроволновки"

# 2. Добавить FAQ
npm run ai:faq-add --page=mikrovolnovki.html \
  --q="Почему микроволновка искрит?" \
  --a="Обычно это проблема с магнетроном или слюдяной пластиной"

# 3. Проверить
npm run dev
```

### Сценарий 3: Изменить контакты

```bash
# 1. Изменить телефон
npm run ai:contact --phone="+7 (495) 999-88-77"

# 2. Проверить
npm run dev

# 3. Закоммитить
git add .
git commit -m "Обновил телефон"
git push
```

## ⚠️ Важные замечания

1. **Всегда запускай `npm run dev`** после изменений чтобы проверить результат
2. **Не редактируй HTML напрямую** — используй JSON данные в `data/`
3. **Коммить часто** — после каждого логического изменения
4. **Проверяй валидацию** — `npm run validate:site` перед push

## 🆘 Помощь

```bash
# Показать все команды
npm run ai:help

# Показать все скрипты
npm run
```

## 📚 Дополнительные команды

```bash
# Генерация sitemap
npm run generate:sitemap

# Оптимизация изображений
npm run optimize:images

# Аудит скриншотов
npm run audit:screenshots

# Валидация сайта
npm run validate:site
```

---

**Последнее обновление:** 2026-05-28
