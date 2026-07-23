# MosPochin — итоговая переработка ресторанной вентиляции

**Период:** 21–22 июля 2026 года  
**Статус source-handoff:** готов к rollout  
**Production:** не изменён до запуска rollout

## Результат

- 44 канонические индексируемые страницы ресторанной вентиляции;
- 8 дублей подготовлены к прямому серверному `301` после переноса контента;
- 642 внутренних перехода, индексируемых сирот нет;
- минимум 4 уникальных донора на страницу;
- 14 наборов реальных фотографий и 29 технических SVG;
- 115 production-media-файлов;
- 3 режима CTA: emergency call, photo diagnostics, maintenance request;
- 14 специализированных событий аналитики;
- формы унифицированы на всех 44 страницах;
- desktop/mobile/320px регрессия пройдена;
- Nginx `301` проверены локально: 8/8;
- sitemap, canonical и внутренние ссылки согласованы с целевыми URL.

## Границы услуг

Кластер охватывает диагностику, ремонт, чистку, мойку и обслуживание существующих систем: зонты, фильтры, вентиляторы, двигатели, автоматику, частотные преобразователи, заслонки, приток и доступные участки воздуховодов. Проектирование и монтаж новой вентиляции с нуля не заявляются.

## Безопасность

Не допускаются обход защит, увеличение номиналов автоматов, повторные аварийные пуски, выжигание жировых отложений, мойка токоведущих узлов водой, эксплуатация без штатных фильтров и работа с вращающимися частями без безопасного отключения.

## URL-консолидация

- `chto-proveryaet-inzhener-ventilyatsii.html` → `diagnostika-ventilyatsii-restorana.html`
- `kak-podgotovitsya-k-vyezdu-mastera-po-ventilyatsii.html` → `diagnostika-ventilyatsii-restorana.html`
- `kak-ponyat-chto-nuzhna-chistka-ventilyatsii.html` → `chistka-ventilyatsii-restoranov.html`
- `kanalnaya-ventilyatsiya-restorana.html` → `remont-vozduhovodov-restorana.html`
- `oshibki-pri-ekspluatatsii-vytyazhki-restorana.html` → `chek-list-ventilyatsii-restorana.html`
- `pochemu-vytyazhka-ne-tyanet-v-restorane.html` → `ventilyatsiya-restorana-ne-tyanet.html`
- `ventilyatsiya-i-posudomoechnaya-zona.html` → `ventilyatsiya-moechnoj-zony.html`
- `ventilyatsiya-kafe.html` → `ventilyatsiya-restoranov.html`

## Rollout

Source-handoff является накопительным overlay без `rsync --delete`. Канонический `.github/workflows/deploy.yml` сохраняется rollout-kit. Post-activate устанавливает `mospochin-runtime-hardening.conf`, проверяет `nginx -t` и перезагружает Nginx. Автоматическая post-deploy проверка подтверждает канонические URL, assets и восемь HTTP `301`.
