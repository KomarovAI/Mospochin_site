# 🧠 ВНУТРЕННЯЯ ШПАРАЛКА — ЧТО НА ЧТО ВЛИЯЕТ

---

## 📦 КАРТОЧКА ОБОРУДОВАНИЯ (equipment-card)

### Файл: `index.html`
### Строки: 214-284 (8 карточек)

```html
<div class="equipment-card bg-white p-6 rounded-2xl shadow-sm border-2 border-slate-100 scroll-scale text-center cursor-pointer hover:shadow-xl hover:border-brand-orange transition-all duration-300 transform hover:-translate-y-2">
```

### Классы и что делают:

| Класс | Влияние | Пример |
|-------|---------|--------|
| `equipment-card` | Базовый класс (JS хуки) | - |
| `bg-white` | Фон белый | `background: white` |
| `p-6` | Отступы 24px | `padding: 1.5rem` |
| `rounded-2xl` | Скругление 16px | `border-radius: 16px` |
| `shadow-sm` | Тень маленькая | `box-shadow: 0 1px 2px` |
| `border-2 border-slate-100` | Рамка 2px серая | `border: 2px solid #f1f5f9` |
| `scroll-scale` | Анимация при скролле | `opacity: 0 → 1` |
| `text-center` | Текст по центру | `text-align: center` |
| `cursor-pointer` | Курсор рука | `cursor: pointer` |
| `hover:shadow-xl` | **Тень при наведении** | `box-shadow: 0 20px 40px` |
| `hover:border-brand-orange` | **Рамка оранжевая при наведении** | `border-color: #f97316` |
| `transition-all duration-300` | **Плавность 300ms** | `transition: all 0.3s` |
| `transform hover:-translate-y-2` | **Подъём на 8px при наведении** | `transform: translateY(-8px)` |

---

## 🔵 ИКОНКА (icon-hover-rotate)

### Внутри карточки оборудования

```html
<div class="w-20 h-20 bg-red-500/60 rounded-full flex items-center justify-center text-white text-3xl mb-4 mx-auto icon-hover-rotate">
```

### Классы и что делают:

| Класс | Влияние | Пример |
|-------|---------|--------|
| `w-20 h-20` | Размер 80x80px | `width: 80px; height: 80px` |
| `bg-red-500/60` | **Фон красный 50%** | `background: rgba(239,68,68,0.6)` |
| `rounded-full` | Круг | `border-radius: 50%` |
| `flex items-center justify-center` | Центровка | `display: flex` |
| `text-white` | **Иконка белая** | `color: white` |
| `text-3xl` | Размер иконки 30px | `font-size: 1.875rem` |
| `mb-4` | Отступ снизу 16px | `margin-bottom: 1rem` |
| `mx-auto` | По центру горизонтально | `margin-left: auto; margin-right: auto` |
| `icon-hover-rotate` | **CSS анимация при наведении** | см. ниже |

---

## 🎯 CSS АНИМАЦИИ (в `<style>`)

### Файл: `index.html`
### Строки: 14-18

```css
.icon-hover-rotate {
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
.equipment-card:hover .icon-hover-rotate {
  transform: scale(1.2) rotate(15deg);
}
```

### Параметры:

| Параметр | Влияние | Значение |
|----------|---------|----------|
| `transition: all 0.4s` | Плавность всех изменений | 400ms |
| `cubic-bezier(...)` | **Эффект отскока** (bounce) | кривая скорости |
| `scale(1.2)` | **Увеличение на 20%** | 1.0 = 100%, 1.2 = 120% |
| `rotate(15deg)` | **Поворот на 15°** | по часовой стрелке |

---

## 🎨 ЦВЕТА ИКОНОК

| Оборудование | Класс | HEX (50%) |
|-------------|-------|-----------|
| Пароконвектоматы | `bg-brand-orange/60` | rgba(249,115,22,0.6) |
| Плиты | `bg-red-500/60` | rgba(239,68,68,0.6) |
| Холодильники | `bg-blue-500/60` | rgba(59,130,246,0.6) |
| Посудомойки | `bg-green-500/60` | rgba(34,197,94,0.6) |
| Грили | `bg-orange-500/60` | rgba(249,115,22,0.6) |
| Фритюрницы | `bg-yellow-500/60` | rgba(234,179,8,0.6) |
| Миксеры | `bg-purple-500/60` | rgba(168,85,247,0.6) |
| Кофемашины | `bg-amber-500/60` | rgba(245,158,11,0.6) |

---

## 🏠 6 КАРТОЧЕК "ПОЧЕМУ 500+"

### Файл: `uslugi.html`
### Строки: 494-565

```html
<div class="scroll-reveal-left p-8 rounded-2xl stat-card-hover hover:scale-105 hover:shadow-xl transition-transform duration-300 border-2 border-red-200" 
     style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%)">
```

### Классы и что делают:

| Класс | Влияние | Пример |
|-------|---------|--------|
| `scroll-reveal-left` | Выезд слева при скролле | `transform: translateX(-50px) → 0` |
| `p-8` | Отступы 32px | `padding: 2rem` |
| `rounded-2xl` | Скругление 16px | `border-radius: 16px` |
| `stat-card-hover` | Базовый класс карточки | - |
| `hover:scale-105` | **Увеличение 5% при наведении** | `transform: scale(1.05)` |
| `hover:shadow-xl` | **Тень большая при наведении** | `box-shadow: 0 20px 40px` |
| `transition-transform duration-300` | **Плавность трансформации 300ms** | `transition: transform 0.3s` |
| `border-2 border-red-200` | Рамка 2px светло-красная | `border: 2px solid #fecaca` |

### Инлайн стиль (ОБЯЗАТЕЛЬНО!):

```html
style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%)"
```

| Параметр | Влияние |
|----------|---------|
| `linear-gradient(135deg, ...)` | Градиент под углом 135° |
| `#ef4444 0%` | Красный светлый (начало) |
| `#dc2626 100%` | Красный тёмный (конец) |

**Без инлайн стиля градиент НЕ РАБОТАЕТ!** (Tailwind CDN не грузится)

---

## 📊 3 КАРТОЧКИ "ПОСЛЕДСТВИЯ ПРОСТОЯ"

### Файл: `index.html`
### Строки: 206-228

```html
<div class="scroll-reveal-left p-8 rounded-2xl border-2 border-red-200 stat-card-hover" 
     style="background: linear-gradient(135deg, #f87171 0%, #fb7185 100%)">
```

### Отличия от "Почему 500+":
- Нет `hover:scale-105 hover:shadow-xl` (только базовый hover из CSS)
- Градиенты светлее (300→400 вместо 500→600)

---

## ⚙️ ГЛОБАЛЬНЫЕ ПАРАМЕТРЫ

### Файл: `styles.css`

```css
.glass-card {
  background: rgba(255,255,255,0.05);  /* 5% непрозрачности */
  backdrop-filter: blur(20px);          /* Размытие фона 20px */
  border: 1px solid rgba(255,255,255,0.5); /* 50% рамка */
  border-radius: 16px;
}
```

| Параметр | Влияние | Было | Стало |
|----------|---------|------|-------|
| `rgba(255,255,255,0.05)` | Прозрачность glass-card | 0.8 (80%) | 0.05 (5%) |
| `blur(20px)` | Размытие фона | 20px | 20px |

---

## 🎯 БЫСТРЫЙ ДОСТУП

### Найти все карточки с градиентами:
```bash
grep -n 'linear-gradient' /tmp/Mospochin_site/uslugi.html
```

### Найти все иконки 50%:
```bash
grep -n 'bg-[a-z]*-500/60' /tmp/Mospochin_site/index.html
```

### Найти hover эффекты:
```bash
grep -n 'hover:' /tmp/Mospochin_site/index.html
```

### Посмотреть строки:
```bash
sed -n '214,220p' /tmp/Mospochin_site/index.html
```

### Исправить класс:
```bash
sed -i 's/старый/новый/g' /tmp/Mospochin_site/index.html
```

---

## 📝 ПАМЯТКА

1. **Tailwind CDN не работает в headless** → используй инлайн стили
2. **glass-card 5%** → градиенты видны
3. **icon-hover-rotate** → только в index.html
4. **stat-card-hover** → в uslugi.html и index.html
5. **hover:-translate-y-2** → подъём карточки
6. **scale(1.2) rotate(15deg)** → анимация иконки

---

**СОХРАНИ ЭТО В ПАМЯТЬ!** 🧠
