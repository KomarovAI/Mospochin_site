# 📊 DATA-INDEX: Единый указатель всех данных сайта

Этот файл объясняет **какой JSON файл за что отвечает** и **что можно безопасно менять**.

---

## 🎯 БЫСТРЫЙ СТАРТ

### Хочешь изменить цену?
→ Файл: `data/household-services.json` или `data/restaurant-services.json`  
→ Поле: `price` в нужной услуге

### Хочешь добавить FAQ?
→ Файл: `data/household-page-slots.json` или `data/restaurant-page-slots.json`  
→ Поле: `faq` в нужной странице

### Хочешь изменить контакты?
→ Файл: `data/contact-config.json`  
→ Поля: `phoneDisplay`, `phoneE164`, `telegramHref`

### Хочешь изменить SEO (title, description)?
→ Файл: `data/page-metadata.json`  
→ Поля: `title`, `description`, `canonical`

---

## 📁 СТРУКТУРА ДАННЫХ

### 🏠 BYTOVAYA (Бытовая техника - B2C)

| Файл | Размер | Назначение | Что можно менять |
|------|--------|------------|------------------|
| `household-services.json` | 6.6 KB | Список услуг (холодильники, стиралки и т.д.) | ✅ Цены, симптомы, бренды |
| `household-page-slots.json` | 44 KB | **ГЛАВНЫЙ ФАЙЛ** - контент для каждой страницы | ✅ FAQ, тексты, proof, form-hints |
| `household-branch.json` | 2.2 KB | Общие настройки ветки | ✅ Заголовок, контакты, ссылки |
| `household-proof-layer.json` | 24 KB | Доказательства (отзывы, кейсы) | ✅ Тексты отзывов, имена клиентов |
| `household-taxonomy.json` | 4.9 KB | Таксономия (устройства, симптомы) | ✅ Названия категорий |
| `household-card-presets.json` | 1.7 KB | Пресеты для карточек | ⚠️ Только если знаешь что делаешь |
| `household-page-policy.json` | 3.2 KB | Политика страниц | ❌ НЕ ТРОГАТЬ |

### 🍽️ RESTAURANT (Ресторанное оборудование - B2B)

| Файл | Размер | Назначение | Что можно менять |
|------|--------|------------|------------------|
| `restaurant-services.json` | 8.1 KB | Список услуг (пароконвектоматы, плиты и т.д.) | ✅ Цены, симптомы, бренды |
| `restaurant-page-slots.json` | 43 KB | **ГЛАВНЫЙ ФАЙЛ** - контент для каждой страницы | ✅ FAQ, тексты, proof, form-hints |
| `restaurant-branch.json` | 5.8 KB | Общие настройки ветки | ✅ Заголовок, контакты, ссылки |
| `restaurant-proof-layer.json` | 12 KB | Доказательства (отзывы, кейсы) | ✅ Тексты отзывов, имена клиентов |
| `restaurant-taxonomy.json` | 2.0 KB | Таксономия (устройства, симптомы) | ✅ Названия категорий |
| `restaurant-page-policy.json` | 3.1 KB | Политика страниц | ❌ НЕ ТРОГАТЬ |

### 🌐 ОБЩИЕ ФАЙЛЫ

| Файл | Размер | Назначение | Что можно менять |
|------|--------|------------|------------------|
| `page-metadata.json` | 20 KB | **SEO для всех страниц** | ✅ Title, description, canonical |
| `contact-config.json` | 292 B | Контакты (телефон, email, мессенджеры) | ✅ Все поля |
| `runtime-config.json` | 51 B | Runtime настройки (Telegram endpoint) | ⚠️ Только если меняешь API |
| `direct-landing-pages.json` | 25 KB | Лендинги для Яндекс Директ | ✅ Тексты, CTA, формы |
| `schema-profile.json` | 922 B | Schema.org разметка | ⚠️ Только если знаешь SEO |
| `site-page-contracts.json` | 1.3 KB | Контракты страниц | ❌ НЕ ТРОГАТЬ |
| `docs-contracts.json` | 2.7 KB | Контракты документации | ❌ НЕ ТРОГАТЬ |
| `operator-recipes.json` | 15 KB | Защитные рецепты для AI | ❌ НЕ ТРОГАТЬ |

---

## 🔥 ТОП-5 ФАЙЛОВ ДЛЯ РЕДАКТИРОВАНИЯ

### 1. `data/household-page-slots.json` (44 KB)
**Что внутри:**
```json
{
  "pages": {
    "bytovaya-holodilniki.html": {
      "faq": [
        {"question": "Сколько стоит ремонт?", "answer": "От 2000 рублей"}
      ],
      "formHints": {
        "chips": ["Не морозит", "Течёт", "Шумит"],
        "typePlaceholder": "Холодильник",
        "problemPlaceholder": "Опишите проблему"
      },
      "proof": {
        "testimonial": "Отличный сервис!",
        "clientName": "Анна К."
      }
    }
  }
}
```

**Что можно менять:**
- ✅ `faq` - вопросы и ответы
- ✅ `formHints` - подсказки в форме заявки
- ✅ `proof` - отзывы и доказательства

**Пример изменения:**
```bash
# Добавить FAQ вопрос
npm run ai:faq-add --page=bytovaya-holodilniki.html --q="Новый вопрос?" --a="Ответ"
```

---

### 2. `data/restaurant-page-slots.json` (43 KB)
**Аналогично household, но для ресторанного оборудования**

---

### 3. `data/page-metadata.json` (20 KB)
**Что внутри:**
```json
{
  "pages": {
    "bytovaya-holodilniki.html": {
      "title": "Ремонт холодильников в Москве — MosPochin",
      "description": "Ремонт холодильников на дому: не морозит, течёт, шумит...",
      "canonical": "https://mospochin.ru/bytovaya-holodilniki.html"
    }
  }
}
```

**Что можно менять:**
- ✅ `title` - заголовок страницы в браузере и Google
- ✅ `description` - описание в поисковой выдаче
- ⚠️ `canonical` - только если меняешь URL

**Пример изменения:**
```bash
# Изменить title
npm run ai:seo --page=bytovaya-holodilniki.html --title="Новый заголовок"
```

---

### 4. `data/household-services.json` (6.6 KB)
**Что внутри:**
```json
{
  "services": [
    {
      "page": "bytovaya-holodilniki.html",
      "slug": "holodilniki",
      "uiLabel": "Холодильники",
      "primarySymptoms": ["не морозит", "течёт", "шумит"],
      "brandCluster": ["Bosch", "Samsung", "LG"]
    }
  ]
}
```

**Что можно менять:**
- ✅ `primarySymptoms` - симптомы поломок
- ✅ `brandCluster` - список брендов
- ⚠️ `page`, `slug` - только если создаёшь новую страницу

---

### 5. `data/contact-config.json` (292 B)
**Что внутри:**
```json
{
  "phoneDisplay": "8 (999) 005-71-72",
  "phoneE164": "+79990057172",
  "telegramHref": "https://t.me/mospochin",
  "whatsappNumber": "79990057172",
  "email": "mospochin@yandex.ru"
}
```

**Что можно менять:**
- ✅ Все поля (телефон, email, мессенджеры)

**Пример изменения:**
```bash
# Изменить телефон
npm run ai:contact --phone="+7 (999) 123-45-67"
```

---

## ⚠️ ФАЙЛЫ КОТОРЫЕ НЕЛЬЗЯ ТРОГАТЬ

| Файл | Почему нельзя |
|------|---------------|
| `household-page-policy.json` | Определяет структуру страниц, ломает вёрстку |
| `restaurant-page-policy.json` | Определяет структуру страниц, ломает вёрстку |
| `site-page-contracts.json` | Системный файл, ломает валидацию |
| `docs-contracts.json` | Системный файл, ломает документацию |
| `operator-recipes.json` | Защитные рецепты для AI, ломает безопасность |

---

## 🚀 БЫСТРЫЕ КОМАНДЫ

```bash
# Изменить цену
npm run ai:price --page=bytovaya-holodilniki.html --service="Замена компрессора" --price=5000

# Добавить FAQ
npm run ai:faq-add --page=bytovaya-holodilniki.html --q="Вопрос?" --a="Ответ"

# Изменить контакты
npm run ai:contact --phone="+7 (999) 123-45-67"

# Изменить SEO
npm run ai:seo --page=bytovaya-holodilniki.html --title="Новый заголовок"

# Проверить что сайт работает
npm run ai:check
```

---

## 📝 ПРИМЕРЫ РЕАЛЬНЫХ ИЗМЕНЕНИЙ

### Пример 1: Добавить новую услугу "Ремонт микроволновок"

**Шаг 1:** Открой `data/household-services.json`

**Шаг 2:** Добавь новую запись в массив `services`:
```json
{
  "page": "bytovaya-mikrovolnovki.html",
  "slug": "mikrovolnovki",
  "uiLabel": "Микроволновки",
  "deviceName": "Микроволновые печи",
  "serviceName": "Ремонт микроволновок",
  "primarySymptoms": ["не греет", "искрит", "не включается"],
  "brandCluster": ["Samsung", "LG", "Panasonic"],
  "relatedPages": ["bytovaya-plity.html", "bytovaya-duhovki.html"]
}
```

**Шаг 3:** Запусти валидацию:
```bash
npm run validate:site
```

---

### Пример 2: Изменить цену на "Замена ТЭНа"

**Шаг 1:** Открой `data/household-page-slots.json`

**Шаг 2:** Найди страницу `bytovaya-stiralnye-mashiny.html`

**Шаг 3:** Найди секцию `prices` и измени цену:
```json
"prices": [
  {
    "service": "Замена ТЭНа",
    "price": "от 2500 ₽"  // ← измени здесь
  }
]
```

**Шаг 4:** Запусти валидацию:
```bash
npm run validate:site
```

---

### Пример 3: Добавить отзыв клиента

**Шаг 1:** Открой `data/household-proof-layer.json`

**Шаг 2:** Найди нужную страницу и добавь отзыв:
```json
"branchPages": {
  "bytovaya-holodilniki.html": {
    "testimonials": [
      {
        "text": "Отличный сервис! Починили холодильник за час.",
        "author": "Анна К.",
        "location": "Бутово"
      }
      // ← добавь новый отзыв здесь
    ]
  }
}
```

**Шаг 3:** Запусти валидацию:
```bash
npm run validate:site
```

---

## 🎯 ИТОГО

**Для 90% задач тебе нужны только эти файлы:**
1. `data/household-page-slots.json` - FAQ, отзывы, формы
2. `data/restaurant-page-slots.json` - FAQ, отзывы, формы
3. `data/page-metadata.json` - SEO
4. `data/contact-config.json` - контакты

**Остальные файлы - только если знаешь что делаешь.**

---

**Вопросы? Читай `AGENTS.md` или спрашивай у нейронки!** 🚀
