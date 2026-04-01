# 🔧 Шпаргалка по проекту

## 📍 Где что находится

### Яркие карточки (ОБРАЗЕЦ)
**Файл:** `uslugi.html` (строки 494-565)
```html
<!-- 6 карточек "Почему 500+" -->
<div style="background: linear-gradient(135deg, #ef4444, #dc2626)">
```

### Иконки оборудования (ОБРАЗЕЦ)
**Файл:** `index.html` (строки 214-284)
```html
<div class="equipment-card ... hover:-translate-y-2">
  <div class="icon-hover-rotate bg-red-500/60 text-white">
```

---

## 🔍 Поиск в файлах

```bash
# Найти все карточки с градиентами
grep -n 'linear-gradient' *.html

# Найти все иконки с hover
grep -n 'icon-hover-rotate' *.html

# Найти класс в конкретном файле
grep -n 'класс' index.html
```

---

## 🎨 Цвета

| Цвет | Tailwind | HEX |
|------|----------|-----|
| Красный | red-500 | #ef4444 |
| Красный тёмный | red-600 | #dc2626 |
| Синий | blue-500 | #3b82f6 |
| Синий тёмный | blue-600 | #2563eb |
| Зелёный | green-500 | #22c55e |
| Зелёный тёмный | green-600 | #16a34a |
| Оранжевый | orange-500 | #f97316 |
| Оранжевый тёмный | orange-600 | #ea580c |
| Янтарный | amber-500 | #f59e0b |
| Янтарный тёмный | amber-600 | #d97706 |
| Фиолетовый | purple-500 | #a855f7 |
| Фиолетовый тёмный | purple-600 | #9333ea |

---

## ⚡ Команды

```bash
# Запустить сервер
cd /tmp/Mospochin_site && sudo python3 -m http.server 8080 --bind 0.0.0.0 &

# Остановить сервер
pkill -9 -f "http.server"

# Проверить сервер
curl -s http://localhost:8080/ | wc -c

# Git статус
cd /tmp/Mospochin_site && git status

# Git коммит
git add -A && git commit -m "сообщение" && git push
```

---

## 🎯 Hover эффекты

### Карточка оборудования
```css
.equipment-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  border-color: #f97316;
}
```

### Иконка
```css
.icon-hover-rotate:hover {
  transform: scale(1.2) rotate(15deg);
}
```

---

## 📊 Статус страниц

| Страница | Градиенты | Иконки | Hover |
|----------|-----------|--------|-------|
| index.html | ✅ | ✅ 60% | ✅ |
| uslugi.html | ✅ | ✅ 30% | ✅ |
| bytovaya-* | ❌ | ❌ | ❌ |
| Остальные | ❌ | ❌ | ❌ |

---

**💡 Помни:** Tailwind CDN не работает в headless браузере!
Используй инлайн стили: `style="background: linear-gradient(...)"`
