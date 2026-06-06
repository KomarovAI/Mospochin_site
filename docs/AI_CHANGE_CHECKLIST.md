# AI Change Checklist — MosPochin

Использовать перед выдачей ZIP после AI-правки.

## 0. Navigation / routing

- [ ] Открыт `docs/AI_START_HERE.md`.
- [ ] При необходимости запущен `npm run ai:route -- --task <type> --page <file.html>`.
- [ ] Проверен `data/project-map.generated.json` для страницы/кластера.
- [ ] Проверен ownership: `npm run check:ownership`.

## 1. Source / build

- [ ] Правка сделана в source/data слое, а не только в root HTML.
- [ ] Если root HTML менялся, builder/source синхронизирован.
- [ ] `src/site-builder.json` не рассинхронизирован.
- [ ] Generated-файлы не правились вручную без причины.

## 2. SEO / индексация

- [ ] Canonical ведёт на правильный URL.
- [ ] SEO-страницы не получили `noindex` случайно.
- [ ] Promo/noindex страницы не попали в sitemap.
- [ ] `sitemap.xml` обновлён, если менялись страницы/metadata/index logic.
- [ ] Title/description не пустые и не явно переспамлены.

## 3. Деньги / заявки

- [ ] Есть форма заявки.
- [ ] Есть hidden problem.
- [ ] Есть поле телефона.
- [ ] Есть submit-кнопка.
- [ ] Есть `tel:` ссылка.
- [ ] Есть WhatsApp-ссылка.
- [ ] Подключены `analytics.js` и `telegram-form.js`.
- [ ] Есть `mobile-footer-container`.
- [ ] Есть `whatsapp-float-container`.

## 4. Ссылки / кластер

- [ ] Нет битых внутренних ссылок.
- [ ] Нет self-link в related/cluster links.
- [ ] Кластерные страницы не стали сиротами.
- [ ] Related links соответствуют интенту страницы.

## 5. Schema / FAQ

- [ ] H1 один.
- [ ] FAQ schema не сломана.
- [ ] JSON-LD валиден синтаксически.
- [ ] FAQ registry обновлён, если менялись FAQ.

## 6. Проверки

Минимум после обычной правки:

```bash
npm run check:core
```

Перед ZIP / handoff:

```bash
npm run check:handoff
```

Для AI-сопровождения отдельно:

```bash
npm run check:ai
# или совместимый алиас
npm run ai:doctor
```

Глубокий page-doctor слой по необходимости:

```bash
npm run check:doctor
```

Перед продом или после visual/image-правок:

```bash
npm run check:full
```

Если менялись generated-слои, сначала синхронизировать:

```bash
npm run sync:generated
```

Для автоматического ZIP/handoff:

```bash
npm run handoff:pack
```

## 7. Handoff

- [ ] Обновлён `CHANGELOG_AI.md`.
- [ ] ZIP создан.
- [ ] `unzip -tq <zip>` прошёл.
- [ ] В финальном ответе указаны изменения, проверки, ограничения и ссылка на ZIP.
