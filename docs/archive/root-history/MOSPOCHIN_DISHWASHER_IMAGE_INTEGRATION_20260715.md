# MosPochin — интеграция фотографий в кластер профессиональных посудомоечных машин

**Дата:** 15 июля 2026 года  
**Исходный кластер:** DW7 complete, 40/40 URL  
**Исходный фотоархив:** `processed_equipment_photos_complete(1).zip`

## 1. Результат

Из фотоархива выделены 12 новых изображений профессионального посудомоечного оборудования. Первые четыре файла архива относятся к ранее интегрированному кластеру куттеров и повторно не использовались.

Новые изображения преобразованы в адаптивные production-варианты и интегрированы через source-builder:

- source-изображения посудомоечного оборудования: **12**;
- варианты на одно изображение: **6** — JPEG/WebP в ширинах 480, 768 и 1080 px;
- production outputs: **72**;
- страницы с новыми медиаблоками: **30**;
- production HTML: **242**;
- builder parity: **242/242**;
- sitemap URL: **228**;
- site crawl issues: **0**.

## 2. Состав фотоархива

Использованы следующие технические сюжеты:

1. дозирующие насосы и внутренняя проводка;
2. открытая машина с сервисным доступом;
3. общий вид моечного поста с купольной машиной;
4. нижний разбрызгиватель и форсунки;
5. машина со следами эксплуатации;
6. внутренняя гидравлическая и электрическая компоновка;
7. водоумягчитель, клапаны и коммуникации;
8. задняя сервисная сторона машины;
9. бойлер, насос и проводка;
10. плата управления, реле и контактор;
11. полный сервисный доступ к узлам;
12. выводы нагревательных элементов бойлера.

## 3. Логика распределения

Изображения назначены страницам по техническому контексту:

- общий вид и сервисный доступ — хаб, обслуживание, диагностика, устройство;
- разбрызгиватель — низкое давление, неподвижные коромысла, плохое качество мойки;
- дозаторы — страницы моющего средства, ополаскивателя, пены и разводов;
- водоумягчитель — водоподготовка и связанные проблемы качества;
- бойлер и ТЭН — отсутствие нагрева и остановка цикла;
- плата, реле и проводка — отсутствие питания, запуск цикла, автомат и ошибки;
- сливные и гидравлические коммуникации — отсутствие слива, протечка и постоянный набор воды.

Изображения намеренно **не размещены**:

- на брендовых страницах — фотографии не подтверждают конкретную марку или серию;
- на странице конвейерных машин и симптоме конвейера — архив не содержит подтверждённой конвейерной линии;
- на странице котломоечных машин — нет изображения, достоверно представляющего этот класс;
- на брендовой Direct-странице Winterhalter — нельзя создавать визуальную атрибуцию марки без подтверждения модели.

## 4. HTML и SEO-контракт

Каждый медиаблок использует:

- `<picture>`;
- WebP source и JPEG fallback;
- `srcset` и `sizes`;
- явные `width` и `height`;
- `loading="lazy"` для блоков ниже первого экрана;
- `decoding="async"`;
- содержательный русский `alt`;
- подпись с техническим контекстом;
- отдельные `og:image`, `og:image:width`, `og:image:height`, `og:image:alt`;
- `twitter:image` и `twitter:image:alt`.

Для изображений присутствует явное уведомление: материалы обработаны для повышения наглядности и не должны использоваться для измерений, определения точной модели, электрического подключения или инженерной дефектовки.

## 5. Новые source-файлы

- `data/dishwasher-image-library.json`;
- `src/components/parametric/dishwasher-media/section.template.html`;
- `src/media-source/dishwasher/*.png`;
- `tools/generate-dishwasher-images.mjs`;
- `tools/apply-dishwasher-images.mjs`;
- `tools/check-dishwasher-images.mjs`;
- `tools/render-dishwasher-images.py`;
- `tools/capture-dishwasher-media-review.mjs`;
- `docs/DISHWASHER_IMAGE_INTEGRATION.md`.

Добавлены npm-команды:

```bash
npm run generate:dishwasher-images
npm run apply:dishwasher-images
npm run check:dishwasher-images
```

Проверка библиотеки включена в core-профиль и cluster registry.

## 6. Проверки

| Проверка | Результат |
|---|---:|
| Dishwasher image registry | 12 sources / 72 outputs / 30 pages |
| Builder parity | 242/242 |
| Site crawl | 0 issues |
| Image budget | 256 raster assets; 0 warnings; 0 violations |
| Visual environment | passed |
| Visual contract | passed |
| Workflow policy | passed |
| AI/generated profile | 5/5 passed |
| npm audit | 0 vulnerabilities |

Глобальный последовательный visual-smoke не объявляется завершённым: процесс дошёл до создания части кадров, но был остановлен лимитом выполнения среды. Связанные с новыми изображениями проверки выполнены отдельным targeted-пакетом.

## 7. Визуальный QA

Создано **17 контрольных PNG**:

- 8 targeted media-section screenshots — четыре страницы × desktop/mobile;
- 8 first-view screenshots — четыре страницы × desktop/mobile;
- 1 full-page desktop screenshot хаба.

После первого прогона capture-сценарий был усилен: перед element-screenshot он прокручивает каждый lazy image и ждёт `load/decode`. Это исключило ложные серые placeholders в длинной мобильной галерее.

Проверены:

- desktop/mobile сетки;
- пропорции карточек;
- подписи;
- отсутствие горизонтального переполнения;
- загрузка всех lazy images;
- расположение блоков ниже hero;
- отсутствие ложной брендовой атрибуции.

## 8. Источники рекомендаций

- Google Search Central — Image SEO best practices: https://developers.google.com/search/docs/appearance/google-images
- web.dev — Responsive images: https://web.dev/learn/images/responsive-images
- web.dev — Browser-level image lazy loading: https://web.dev/articles/browser-level-image-lazy-loading
