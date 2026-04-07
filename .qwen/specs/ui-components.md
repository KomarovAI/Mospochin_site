# UI Components Spec — MosPochin

## TOP BAR (красная полоска сверху)
- **Расположение:** В `main.js`, функция `getHeader()`
- **B2B текст:** "🚨 АВАРИЙНЫЙ ВЫЕЗД • Мастер будет через 20 минут"
- **B2C текст:** "🚨 СРОЧНЫЙ ВЫЕЗД НА ДОМ • Мастер будет через 60 минут"
- **НЕ редактировать в HTML** — только через main.js

## Header / Навигация
- **Расположение:** В `main.js`, функция `getHeader()`
- **B2B навигация:** Главная, Услуги (выпадающее), О нас, Контакты
- **B2C навигация:** Главная, Услуги (выпадающее), О нас, Контакты
- **Телефон:** 8 (999) 005-71-72

## Footer
- **Расположение:** В `main.js`, функция `getFooter()`
- **Переключатель веток:** Всегда отображается
- **НЕ редактировать в HTML** — только через main.js

## Floating CTA кнопки
- **B2C:** WhatsApp (зелёная), только мобильные (md:hidden)
- **B2B:** Телефон (оранжевая), только мобильные (md:hidden)
- **Расположение:** В HTML файлах перед </body>

## Формы заявок
- **B2B страницы:** index, uslugi, about, contact + 7 equipment
- **B2C страницы:** bytovaya-index, bytovaya-uslugi, bytovaya-about, bytovaya-contact + 15 equipment
- **Все формы:** class="telegram-form", отправляют в Telegram бот
- **Скрипт:** telegram-form.js подключается перед </body>

## Иконки
- **Библиотека:** Remix Icon 4.1.0 (cdn.jsdelivr.net/npm/remixicon@4.1.0/fonts/remixicon.css)
- **НЕ использовать Font Awesome** — полностью заменено на Remix Icon
- **Формат:** ri-XXX-XXX-line или ri-XXX-XXX-fill
- **Проверка:** Все иконки должны быть из официального списка remixicon.com

## Шрифты
- **B2B:** Manrope (строгий, техничный)
- **B2C:** Nunito (мягкий, дружелюбный)

## CSS
- **Tailwind:** через CDN
- **Custom:** styles.css → компилируется в styles-built.css (--minify)
- **Purge:** Tailwind JIT автоматически удаляет неиспользуемые классы
- **Размер:** ~40KB minified
