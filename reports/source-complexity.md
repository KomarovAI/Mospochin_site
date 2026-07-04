# Source Complexity Report

Детерминированный отчёт для сжатия исходного смысла проекта. Он не оценивает визуал, а показывает, где AI тратит больше всего контекста.

## Сводка

| Метрика | Значение |
| --- | --- |
| Root HTML pages | 63 |
| Builder pages | 1 |
| src/pages files | 1992 |
| src/pages HTML section files | 1929 |
| Shared component files | 48 |
| Parametric template files | 86 |
| Parametric props files | 14 |
| Total declared sections | 76 |
| Local sections | 76 |
| Shared section refs | 0 |
| Parametric section refs | 0 |
| Compressed refs | 0 |
| Shared/parametric coverage | 0.0% |
| Average sections/page | 76.0 |
| Average source files/page | 80.0 |
| Root HTML bytes | 5.78 MB |
| src/pages HTML bytes | 4.52 MB |
| Shared HTML bytes | 203.9 KB |
| Estimated duplicate bytes removed by shared components | 0 B |


## Самые сложные страницы по количеству секций

| Page | Sections | Local | Shared refs |
| --- | --- | --- | --- |
| parokonvektomaty.html | 76 | 76 | 0 |


## Самые тяжёлые страницы по локальному source HTML

| Page | Local source | Sections |
| --- | --- | --- |
| parokonvektomaty.html | 160.7 KB | 76 |


## Компоненты по количеству секций

| Component | Total | Local | Shared refs | Parametric refs | Compressed % |
| --- | --- | --- | --- | --- | --- |
| raw | 29 | 29 | 0 | 0 | 0% |
| pricing | 12 | 12 | 0 | 0 | 0% |
| proof | 9 | 9 | 0 | 0 | 0% |
| related-links | 5 | 5 | 0 | 0 | 0% |
| section | 5 | 5 | 0 | 0 | 0% |
| mobile-contact | 4 | 4 | 0 | 0 | 0% |
| breadcrumb | 2 | 2 | 0 | 0 | 0% |
| contact-cta | 2 | 2 | 0 | 0 | 0% |
| faq | 2 | 2 | 0 | 0 | 0% |
| lead-form | 2 | 2 | 0 | 0 | 0% |
| footer-anchor | 1 | 1 | 0 | 0 | 0% |
| hero | 1 | 1 | 0 | 0 | 0% |
| noscript | 1 | 1 | 0 | 0 | 0% |
| runtime-partials | 1 | 1 | 0 | 0 | 0% |


## Главные shared components по экономии

_Нет данных._


## Возможности для следующего сжатия смысла

- **medium** / componentize-local-sections: raw: 29 локальных секций, shared ratio 0% — кандидат на параметризованный компонент + props.
- **high** / page-blueprint: parokonvektomaty.html: 76 секций — кандидат на page blueprint вместо длинного списка sections.
- **high** / raw-section-reduction: parokonvektomaty.html: 29 raw-секций — стоит объединить/классифицировать, чтобы AI видел смысл блока.

## Как читать этот отчёт

- Много `local` секций у компонента = кандидат на параметризованный компонент.
- Много секций на странице = кандидат на page blueprint.
- Много `raw` секций = AI хуже понимает смысл блока; стоит переклассифицировать или объединить.
- Shared coverage — не цель сама по себе: важнее отделить смысловые props от HTML-разметки.
