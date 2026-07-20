# Навигация инженерного кластера — события Метрики

Дата: 2026-07-20

## Основные события

- `error_nav_view` — навигатор попал в область просмотра;
- `error_nav_search_open` — переход к поиску по коду;
- `error_nav_brand_select` — выбор производителя;
- `error_nav_family_select` — переход к серии;
- `error_nav_system_select` — переход к функциональному контуру;
- `error_nav_impact_select` — фильтр по последствиям;
- `error_nav_parent_click` — переход к родительскому разделу;
- `error_nav_previous_click` / `error_nav_next_click` — соседняя инженерная карточка;
- `error_nav_related_code_click` — связанный код той же системы;
- `error_nav_symptom_click` — переход к симптомной странице;
- `error_nav_service_click` — переход к ремонту/диагностике;
- `error_nav_toc_click` — использование оглавления;
- `error_nav_system_from_symptom` / `error_nav_code_from_symptom` — обратный вход из симптома.

## Отчёты

Сегментировать по `page`, `data-conversion-mode`, производителю и функциональному контуру. Ключевые показатели: глубина переходов внутри справочника, возврат к поиску, переход к симптому, переход к услуге и дальнейшая конверсия в звонок/форму.
