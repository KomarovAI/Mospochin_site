# Parameterized Components

Этот слой идёт после `Static Component Builder` и `Declarative Components`.

`src/components/shared/*` убирает точные дубли HTML. `src/components/parametric/*` убирает смысловые дубли: общий template хранит разметку, а page-specific значения лежат в props JSON.

## Что уже параметризовано

### `lead-form / restaurant-parokonvektomat-b2b`

- Canonical template: `src/components/parametric/lead-form/restaurant-parokonvektomat-b2b.template.html`
- Byte-preserving render variants: `src/components/parametric/lead-form/restaurant-parokonvektomat-b2b-*.template.html`
- Contract: `src/components/parametric/lead-form/restaurant-parokonvektomat-b2b.contract.json`
- Props: `content/components/lead-form/*.json`
- Minimum pilot coverage: 15 B2B-форм страниц пароконвектоматов

Пример section в `src/pages/<slug>/page.json`:

```json
{
  "component": "lead-form",
  "componentMode": "parametric",
  "componentScope": "parametric",
  "variant": "restaurant-parokonvektomat-b2b",
  "templateRef": "src/components/parametric/lead-form/restaurant-parokonvektomat-b2b-<render-hash>.template.html",
  "propsRef": "content/components/lead-form/parokonvektomat-abat.json"
}
```

### `mobile-contact` mount containers

- `src/components/parametric/mobile-contact/mobile-footer-container.template.html`
- `src/components/parametric/mobile-contact/whatsapp-float-container.template.html`
- Contract: `src/components/parametric/mobile-contact/mobile-contact-containers.contract.json`
- Minimum coverage contract: 70 mount-секций

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

Формы одной B2B-семьи используют общий contract и компактные props. Ограниченное число render-вариантов сохраняет legacy HTML byte-for-byte там, где различаются форматирование или набор технических атрибутов. Это уменьшает AI-контекст, снижает риск расхождения форм и не требует массового визуального изменения.

## Breadcrumb pilot

- Cluster: `parokonvektomaty`
- Templates: `src/components/parametric/breadcrumb/cluster-parokonvektomaty-*.template.html`
- Props: `content/components/breadcrumb/*.json`
- Contract: `src/components/parametric/breadcrumb/cluster-parokonvektomaty.contract.json`
- Apply/check: `node tools/parameterize-cluster-breadcrumbs.mjs [--check]`

Breadcrumb pilot параметризует только те visible navigation blocks, для которых template + props воспроизводят исходную секцию byte-for-byte. Breadcrumb structured data в head остаётся отдельным SEO-контрактом.

## FAQ Registry

FAQ пока не полностью переведён в props-driven template, но уже вынесен в машинно-читаемый registry:

- `content/faq/page-faq-registry.json` — индекс видимых FAQ-блоков и extracted question/answer.
- `content/faq/schema/*.json` — пустой generated-каталог после retirement FAQ rich results.
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

FAQPage JSON-LD не генерируется: Google перестал показывать FAQ rich results 7 мая 2026 года. Полезные ответы остаются видимыми, а registry используется как индекс контента.
