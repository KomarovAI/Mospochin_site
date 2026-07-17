# MosPochin — интеграция изображений куттеров

**Дата:** 14 июля 2026 года  
**Исходный архив изображений:** `processed_equipment_images_final(1).zip`  
**Целевой проект:** `mospochin-technical-seo-optimized-20260714.zip`

## Результат

- Исходных изображений: **4**.
- Адаптивных production-файлов: **24**.
- Форматы: **JPEG + WebP**.
- Ширины: **480, 768 и 1080 px**.
- Общий размер production-вариантов: **3.33 MiB**.
- Страниц куттер-кластера с интегрированными изображениями: **15**.
- Изменений в других тематических кластерах: **нет**.

## Реализованный HTML-контракт

Каждое изображение встроено через семантические `<figure>` и `<picture>` и содержит:

- WebP source и JPEG fallback;
- `srcset` и `sizes`;
- явные `width` и `height` для предотвращения layout shift;
- `loading="lazy"` и `decoding="async"` для изображений ниже первого экрана;
- описательный русский `alt`;
- тематическую подпись;
- видимое предупреждение о генеративном улучшении исходных файлов и запрете использовать их для измерений/инженерной дефектовки.

## Распределение изображений

| Asset | Назначение | Страницы |
|---|---|---|
| `kutter-industrial-overview` | Общий вид промышленного куттера: рабочая чаша, защитная крышка, вал и ножевой узел. | `kuttery-dlya-restoranov.html`, `remont-kutterov.html`, `kak-rabotaet-professionalnyy-kutter.html` |
| `kutter-corroded-drive-coupling` | Коррозия и загрязнение соединительного узла требуют проверки состояния муфты, люфта и уплотнений. | `kuttery-dlya-restoranov.html`, `obsluzhivanie-kutterov.html`, `kutter-shumit-i-vibriruet.html` |
| `kutter-corroded-drive-assembly` | Приводной узел внутри корпуса: фланец, муфта, вал, опора и электродвигатель. | `kuttery-dlya-restoranov.html`, `remont-kutterov.html`, `obsluzhivanie-kutterov.html`, `diagnostika-kuttera.html`, `motor-kuttera-gudit-no-nozhi-ne-krutatsya.html`, `kutter-teryaet-oboroty.html`, `kutter-ostanavlivaetsya-pod-nagruzkoy.html` |
| `kutter-blade-assembly-bowl` | Ножевой блок и рабочая чаша. Любой осмотр проводят только после полного обесточивания оборудования. | `kuttery-dlya-restoranov.html`, `kak-rabotaet-professionalnyy-kutter.html`, `chistka-i-dezinfekciya-kuttera.html`, `kutter-ploho-izmelchaet.html`, `tupye-ili-povrezhdennye-nozhi-kuttera.html`, `nozh-kuttera-zaklinilo.html`, `kutter-ne-emulgiruet.html`, `kutter-mazhet-produkt-vmesto-izmelcheniya.html` |

## Архитектура

Добавлены:

- `src/media-source/kutter/` — неизменённые исходные PNG и их контрольные суммы;
- `assets/images/responsive/` — адаптивные JPEG/WebP;
- `data/kutter-image-library.json` — machine-readable registry;
- `tools/generate-kutter-images.mjs` — воспроизводимая генерация вариантов;
- `tools/check-kutter-images.mjs` — контроль исходников, outputs, размеров, хешей, alt и usage;
- `docs/KUTTER_IMAGE_INTEGRATION.md` — правила дальнейшего добавления изображений;
- `check:kutter-images` в core-профиле и registry кластера.

## SEO и Open Graph

На 15 релевантных страницах обновлены `og:image`, `twitter:image`, размеры и alt. Изображения распределены по смыслу, а не продублированы одинаковым блоком на всём кластере.

## Проверки

- Builder parity: **203/203**.
- Site crawl: **203 HTML, 192 sitemap URL, 0 issues**.
- Kutter pages: **45 published**.
- Kutter image library: **4 source assets, 24 outputs, 15 pages**.
- Kutter SEO: **45 pages, 435 internal edges, 0 warnings**.
- Core profile: **50/50 passed**.
- Visual profile: **passed**.
- AI profile: **passed**.
- Assets/images profiles: **passed**.
- Lead browser smoke: **23/23**.

## Ограничение исходных изображений

Файлы были генеративно улучшены до передачи в проект. Мелкая геометрия, маркировка и детали могут отличаться от исходных фотографий. Изображения подходят для оформления и иллюстрации узлов, но не для измерений, идентификации точной модели или инженерного заключения о дефекте.
