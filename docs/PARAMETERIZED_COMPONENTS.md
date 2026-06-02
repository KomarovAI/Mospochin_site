# Parameterized Components

Этот слой идёт после `Static Component Builder` и `Declarative Components`.

`src/components/shared/*` убирает точные дубли HTML. `src/components/parametric/*` убирает смысловые дубли: общий template хранит разметку, а page-specific значения лежат в props JSON.

## Что уже параметризовано

### `lead-form / restaurant-parokonvektomat-b2b`

- Template: `src/components/parametric/lead-form/restaurant-parokonvektomat-b2b.template.html`
- Contract: `src/components/parametric/lead-form/restaurant-parokonvektomat-b2b.contract.json`
- Props: `content/components/lead-form/*.json`
- Coverage: 12 B2B-форм страниц пароконвектоматов

Пример section в `src/pages/<slug>/page.json`:

```json
{
  "component": "lead-form",
  "componentMode": "parametric",
  "componentScope": "parametric",
  "variant": "restaurant-parokonvektomat-b2b",
  "templateRef": "src/components/parametric/lead-form/restaurant-parokonvektomat-b2b.template.html",
  "propsRef": "content/components/lead-form/parokonvektomat-abat.json"
}
```

### `mobile-contact` mount containers

- `src/components/parametric/mobile-contact/mobile-footer-container.template.html`
- `src/components/parametric/mobile-contact/whatsapp-float-container.template.html`
- Contract: `src/components/parametric/mobile-contact/mobile-contact-containers.contract.json`
- Coverage: 72 mount-секции

## Как это читать нейронке

- Если надо поменять структуру B2B формы для пароконвектоматов — редактируй template.
- Если надо поменять текст, placeholder, formContext или кнопку на конкретной странице — редактируй props JSON.
- Если надо понять impact — запускай `npm run ai:impact -- --files <template или props>`.
- Root HTML не является source of truth: после source-правки запускай build.

## Команды

```bash
npm run site-builder:parameterize-core
npm run check:parameterized-components
npm run check:site-builder
npm run ai:check
```

`site-builder:parameterize-core` безопасно повторяемая: она мигрирует только те секции, которые byte-to-byte совпадают с template-render output.

## Контракт качества

`check:parameterized-components` проверяет:

- все `templateRef` существуют;
- все `propsRef` существуют;
- render hash совпадает с hash секции;
- формы сохраняют `/api/send-telegram`, `method="post"`, phone field, `inputmode="tel"`;
- coverage не просел ниже ожидаемого минимума.

## Почему это импактно

Раньше 12 B2B-форм и 72 мобильных mount-секции лежали как локальные HTML-файлы. Теперь разметка формы одна, а различия вынесены в компактные props. Это уменьшает AI-контекст, снижает риск расхождения форм и готовит проект к полноценному `Content Registry`.

## FAQ Registry + FAQPage Schema Sync

FAQ пока не полностью переведён в props-driven template, но уже вынесен в машинно-читаемый registry:

- `content/faq/page-faq-registry.json` — индекс видимых FAQ-блоков и extracted question/answer.
- `content/faq/schema/*.json` — generated FAQPage JSON-LD.
- `docs/FAQ_REGISTRY.md` — правила работы.
- `tools/generate-faq-registry.mjs` — генератор и check-mode.

Workflow после любой правки FAQ:

```bash
npm run generate:faq-registry
npm run build:site -- --write
npm run check:faq-registry
npm run ai:semantic-diff -- --page <file.html>
npm run ai:check
```

Generated scripts `data-generated="faq-registry"` в `src/pages/<slug>/head.html` не редактируются вручную.
