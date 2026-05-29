#!/usr/bin/env python3
"""
Оптимизация пароконвектоматов:
1. Удаление дублирующихся секций (Бренды/Сравнение/География) — оставляем ВТОРУЮ (более новую) версию
2. Создание 3 бренд-специфичных страниц (Abat, Convotherm, Lainox) на основе шаблона rational-e9
3. Валидация и git commit
"""

import os
import re
import sys
import subprocess
from pathlib import Path

PROJECT_DIR = Path.home() / "Mospochin_site"
os.chdir(PROJECT_DIR)

# Цвета вывода
GREEN = '\033[92m'
YELLOW = '\033[93m'
RED = '\033[91m'
BLUE = '\033[94m'
RESET = '\033[0m'


def log(msg, color=RESET):
    print(f"{color}{msg}{RESET}")


# ═══════════════════════════════════════════════════════════════
# ШАГ 1: Удаление дублирующихся секций
# ═══════════════════════════════════════════════════════════════

def deduplicate_sections(filepath):
    """
    Если секция (определяемая комментарием SECTION N: NAME) встречается
    более одного раза, удаляет ПЕРВОЕ вхождение (оставляя более новую ВТОРУЮ).
    """
    if not filepath.exists():
        return 0, 0

    content = filepath.read_text(encoding='utf-8')
    original_size = len(content)

    # Паттерн для поиска SECTION-комментариев
    # Пример: <!-- ============================================================
    #              SECTION 15: БРЕНДЫ
    #          ============================================================ -->
    section_pattern = re.compile(
        r'(    <!-- =+\s*\n\s*SECTION (\d+[A-Za-z]?):\s*([^\n]+?)\s*\n\s*=+ -->\n)',
        re.MULTILINE
    )

    # Группируем по ключу "номер:имя"
    sections_by_key = {}
    for match in section_pattern.finditer(content):
        full_comment = match.group(1)
        section_num = match.group(2)
        section_name = match.group(3).strip()
        key = f"{section_num}:{section_name}"

        if key not in sections_by_key:
            sections_by_key[key] = []
        sections_by_key[key].append(match)

    # Определяем что удалять (первые копии дублей)
    to_remove = []
    for key, matches in sections_by_key.items():
        if len(matches) < 2:
            continue

        first_match = matches[0]
        second_match = matches[1]

        first_start = first_match.start()

        # Конец первой секции — начало второй копии
        # Ищем последнюю пустую строку или перевод перед второй копией
        between = content[first_match.end():second_match.start()]

        # Удаляем всё от начала первого комментария до начала второго комментария
        # (включая промежуточные пустые строки)
        first_end = second_match.start()

        # Убираем лишние пустые строки в конце удаляемого блока
        while first_end > first_start and content[first_end - 1] in ' \t':
            first_end -= 1

        to_remove.append((first_start, first_end, key))

    if not to_remove:
        return 0, 0

    # Сортируем в обратном порядке чтобы индексы не сбивались
    to_remove.sort(reverse=True)

    for start, end, key in to_remove:
        content = content[:start] + content[end:]

    filepath.write_text(content, encoding='utf-8')
    saved = original_size - len(content)
    return len(to_remove), saved


# ═══════════════════════════════════════════════════════════════
# ШАГ 2: Создание бренд-специфичных страниц
# ═══════════════════════════════════════════════════════════════

BRAND_PAGES = {
    'parokonvektomat-abat.html': {
        'brand': 'Abat',
        'slug': 'abat',
        'title': 'Ремонт пароконвектоматов Abat (Чувашторгтехника) — ПКА, КПЭ | MosPochin',
        'description': 'Ремонт пароконвектоматов Abat ПКА, КПЭ: ошибки E02, E07, E10, не греет, нет пара. Срочный выезд инженера по Москве. Договор, безнал, гарантия 24 мес.',
        'h1_html': 'Ремонт пароконвектоматов <span class="text-brand-orange">Abat</span>',
        'hero_copy_html': 'Пароконвектомат Abat ПКА или КПЭ показывает ошибку, не греет или не даёт пар. <span class="text-white font-bold">Инженер знаком с российской техникой — выезд в день заявки.</span>',
        'wa_text': 'У%20пароконвектомата%20Abat%20проблема.%20Отправлю%20модель%20и%20код%20ошибки.',
        'models': 'ПКА-6-1/1, ПКА-10-1/1, КПЭ',
        'typical_errors': 'E02, E07, E10, перегрев, нет пара',
        'form_placeholder_type': 'Abat ПКА-6-1/1, КПЭ...',
        'form_placeholder_problem': 'Ошибка E02/E07/E10, не греет, нет пара, адрес объекта...',
        'form_context': 'parokonvektomat_b2b_abat',
        'button_text': 'Вызвать инженера по Abat',
        'quick_form_h2': 'Проверить Abat',
        'quick_form_button': 'Проверить Abat',
        'analysis_h2': 'Что уточняем по Abat',
        'analysis_intro': 'Для Abat важны точная модель (ПКА/КПЭ, количество уровней), код ошибки и момент появления. Это ускоряет выезд и подготовку запчастей.',
        'article_1_title': 'Модель',
        'article_1_text': 'ПКА-6-1/1, ПКА-10-1/1, КПЭ — смотрим шильдик.',
        'article_2_title': 'Ошибка',
        'article_2_text': 'E02, E07, E10 и момент когда появляется.',
        'article_3_title': 'Выезд',
        'article_3_text': 'Срочный выезд с запчастями под Abat.',
        'schema_name': 'Ремонт пароконвектоматов Abat',
        'body_extra_class': 'page-parokonvektomat-abat',
    },
    'parokonvektomat-convotherm.html': {
        'brand': 'Convotherm',
        'slug': 'convotherm',
        'title': 'Ремонт пароконвектоматов Convotherm (Welbilt) — C4, C6, mini | MosPochin',
        'description': 'Ремонт пароконвектоматов Convotherm C4, C6, mini, combiPro: ошибки, не греет, нет пара. Премиум-сервис по Москве. Договор, безнал, гарантия 24 мес.',
        'h1_html': 'Ремонт пароконвектоматов <span class="text-brand-orange">Convotherm</span>',
        'hero_copy_html': 'Convotherm C4, C6 или mini показывает ошибку, не держит режим или не генерирует пар. <span class="text-white font-bold">Инженер с опытом Convotherm — подготовим выезд под вашу модель.</span>',
        'wa_text': 'У%20пароконвектомата%20Convotherm%20проблема.%20Отправлю%20фото%20дисплея%20и%20шильдика.',
        'models': 'C4, C6, mini, combiPro, CMP',
        'typical_errors': 'EasyTouch, AdvancedEasyTouch, ошибки E01-E20',
        'form_placeholder_type': 'Convotherm C4, C6, mini...',
        'form_placeholder_problem': 'Ошибка, не греет, нет пара, адрес объекта...',
        'form_context': 'parokonvektomat_b2b_convotherm',
        'button_text': 'Вызвать инженера по Convotherm',
        'quick_form_h2': 'Проверить Convotherm',
        'quick_form_button': 'Проверить Convotherm',
        'analysis_h2': 'Что уточняем по Convotherm',
        'analysis_intro': 'Для Convotherm важны модель (C4/C6/mini), тип панели (EasyTouch/AdvancedEasyTouch) и момент появления ошибки. Это помогает не терять время на объекте.',
        'article_1_title': 'Модель',
        'article_1_text': 'C4, C6, mini, combiPro — точная модель по шильдику.',
        'article_2_title': 'Ошибка',
        'article_2_text': 'EasyTouch, AdvancedEasyTouch и момент появления.',
        'article_3_title': 'Выезд',
        'article_3_text': 'Срочный выезд с запчастями под Convotherm.',
        'schema_name': 'Ремонт пароконвектоматов Convotherm',
        'body_extra_class': 'page-parokonvektomat-convotherm',
    },
    'parokonvektomat-lainox.html': {
        'brand': 'Lainox',
        'slug': 'lainox',
        'title': 'Ремонт пароконвектоматов Lainox — Naboo, Krea, Junior | MosPochin',
        'description': 'Ремонт пароконвектоматов Lainox Naboo, Krea, Junior: ошибки, не греет, нет пара. Премиум-сервис по Москве. Договор, безнал, гарантия 24 мес.',
        'h1_html': 'Ремонт пароконвектоматов <span class="text-brand-orange">Lainox</span>',
        'hero_copy_html': 'Lainox Naboo, Krea или Junior показывает ошибку, перегрев или потерю пара. <span class="text-white font-bold">Инженер с опытом Lainox — срочный выезд с нужными запчастями.</span>',
        'wa_text': 'У%20пароконвектомата%20Lainox%20проблема.%20Отправлю%20фото%20дисплея%20и%20модель.',
        'models': 'Naboo, Krea, Junior, CV, AE',
        'typical_errors': 'Naboo Voice/Touch, Krea Touch, ошибки E01-E99',
        'form_placeholder_type': 'Lainox Naboo, Krea, Junior...',
        'form_placeholder_problem': 'Ошибка, не греет, нет пара, адрес объекта...',
        'form_context': 'parokonvektomat_b2b_lainox',
        'button_text': 'Вызвать инженера по Lainox',
        'quick_form_h2': 'Проверить Lainox',
        'quick_form_button': 'Проверить Lainox',
        'analysis_h2': 'Что уточняем по Lainox',
        'analysis_intro': 'Для Lainox важны линейка (Naboo/Krea/Junior), тип панели (Voice/Touch) и момент появления ошибки. Это ускоряет диагностику.',
        'article_1_title': 'Модель',
        'article_1_text': 'Naboo, Krea, Junior — точная модель по шильдику.',
        'article_2_title': 'Ошибка',
        'article_2_text': 'Naboo Voice/Touch, Krea Touch и момент появления.',
        'article_3_title': 'Выезд',
        'article_3_text': 'Срочный выезд с запчастями под Lainox.',
        'schema_name': 'Ремонт пароконвектоматов Lainox',
        'body_extra_class': 'page-parokonvektomat-lainox',
    },
}


def update_page_metadata(filename, data):
    """Добавляет метаданные для новой страницы в page-metadata.json."""
    metadata_path = PROJECT_DIR / 'data' / 'page-metadata.json'
    if not metadata_path.exists():
        log(f"✗ page-metadata.json не найден", RED)
        return False
    
    import json
    with open(metadata_path, 'r', encoding='utf-8') as f:
        metadata = json.load(f)
    
    # Добавляем метаданные для новой страницы
    metadata['pages'][filename] = {
        'title': data['title'],
        'description': data['description'],
        'canonical': f"https://mospochin.ru/{filename}",
        'ogUrl': f"https://mospochin.ru/{filename}",
        'hasForm': True,
        'branch': 'neutral'
    }
    
    with open(metadata_path, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)
    
    return True


def update_sitemap(filename):
    """Добавляет URL в sitemap.xml."""
    sitemap_path = PROJECT_DIR / 'sitemap.xml'
    if not sitemap_path.exists():
        log(f"✗ sitemap.xml не найден", RED)
        return False
    
    content = sitemap_path.read_text(encoding='utf-8')
    
    # Проверяем есть ли уже URL в sitemap
    url_entry = f'https://mospochin.ru/{filename}'
    if url_entry in content:
        return True  # Уже есть
    
    # Находим место перед </urlset> и вставляем новый URL
    new_url = f'''  <url>
    <loc>https://mospochin.ru/{filename}</loc>
    <lastmod>2026-05-30</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
'''
    
    content = content.replace('</urlset>', new_url + '</urlset>')
    sitemap_path.write_text(content, encoding='utf-8')
    return True


def create_brand_page(filename, data):
    """Создаёт бренд-специфичную страницу на основе шаблона parokonvektomat-rational-e9.html."""
    template_path = PROJECT_DIR / 'parokonvektomat-rational-e9.html'
    if not template_path.exists():
        log(f"✗ Шаблон parokonvektomat-rational-e9.html не найден", RED)
        return False

    content = template_path.read_text(encoding='utf-8')

    # ── META ─────────────────────────────────────────────────
    content = re.sub(
        r'<title>[^<]+</title>',
        f'<title>{data["title"]}</title>',
        content
    )
    content = re.sub(
        r'<meta name="description" content="[^"]+">',
        f'<meta name="description" content="{data["description"]}">',
        content
    )
    content = re.sub(
        r'<meta property="og:title" content="[^"]+">',
        f'<meta property="og:title" content="{data["title"]}">',
        content
    )
    content = re.sub(
        r'<meta property="og:description" content="[^"]+">',
        f'<meta property="og:description" content="{data["description"]}">',
        content
    )
    content = re.sub(
        r'<meta property="og:url" content="https://mospochin\.ru/[^"]+">',
        f'<meta property="og:url" content="https://mospochin.ru/{filename}">',
        content
    )
    content = re.sub(
        r'<link rel="canonical" href="https://mospochin\.ru/[^"]+">',
        f'<link rel="canonical" href="https://mospochin.ru/{filename}">',
        content
    )

    # ── JSON-LD schema description/name ──────────────────────
    content = re.sub(
        r'("name":\s*")Ремонт пароконвектоматов(")',
        f'\\g<1>{data["schema_name"]}\\g<2>',
        content
    )
    content = re.sub(
        r'("description":\s*")[^"]+(")',
        f'\\g<1>{data["description"]}\\g<2>',
        content
    )

    # ── Body class ───────────────────────────────────────────
    content = content.replace(
        'page-parokonvektomat-rational-e9',
        data['body_extra_class']
    )

    # ── H1 ───────────────────────────────────────────────────
    content = re.sub(
        r'<h1 class="pariki-hero-title[^>]*>\s*Ошибка Rational <span class="text-brand-orange">E9</span>\s*</h1>',
        f'<h1 class="pariki-hero-title text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight mb-5 leading-tight">\n                        {data["h1_html"]}\n                    </h1>',
        content
    )

    # ── Hero copy ────────────────────────────────────────────
    content = re.sub(
        r'<p class="pariki-hero-copy[^>]*>\s*Rational SCC, CMP или iCombi показывает E9, сбивает режим или не запускает цикл\.\s*<span class="text-white font-bold">[^<]*</span>\s*</p>',
        f'<p class="pariki-hero-copy text-base sm:text-lg lg:text-xl text-slate-200 mb-6 leading-relaxed max-w-xl mx-auto lg:mx-0">\n                        {data["hero_copy_html"]}\n                    </p>',
        content
    )

    # ── WhatsApp URL (все вхождения) ─────────────────────────
    content = re.sub(
        r'wa\.me/79990057172\?text=[^"]+',
        f'wa.me/79990057172?text={data["wa_text"]}',
        content
    )

    # ── Quick form (в hero) ──────────────────────────────────
    content = content.replace(
        '<h2 class="mt-1 text-base font-display font-extrabold text-brand-blue">Проверить Rational E9</h2>',
        f'<h2 class="mt-1 text-base font-display font-extrabold text-brand-blue">{data["quick_form_h2"]}</h2>'
    )
    content = content.replace(
        '<input type="hidden" name="problem" value="Ошибка Rational E9 пароконвектомата">',
        f'<input type="hidden" name="problem" value="Проблема с пароконвектоматом {data["brand"]}">'
    )
    content = content.replace(
        'placeholder="Rational E9, SCC 6-1/1, CMP..." class="mb-2',
        f'placeholder="{data["form_placeholder_type"]}" class="mb-2'
    )
    content = content.replace(
        '<i class="ri-send-plane-line mr-2"></i>Проверить E9',
        f'<i class="ri-send-plane-line mr-2"></i>{data["quick_form_button"]}'
    )

    # ── Analysis section (3 карточки "под запрос из рекламы") ─
    content = re.sub(
        r'<h2 class="mt-3 font-display text-2xl sm:text-3xl font-extrabold text-brand-blue">Что уточняем по Rational E9</h2>',
        f'<h2 class="mt-3 font-display text-2xl sm:text-3xl font-extrabold text-brand-blue">{data["analysis_h2"]}</h2>',
        content
    )
    content = re.sub(
        r'<p class="mt-4 text-base leading-relaxed text-slate-600">У Rational важно знать линейку, режим работы и момент появления ошибки\. Это помогает не терять время на объекте\.</p>',
        f'<p class="mt-4 text-base leading-relaxed text-slate-600">{data["analysis_intro"]}</p>',
        content
    )

    # Карточки 1-2-3
    content = content.replace(
        '<h3 class="font-display text-lg font-extrabold text-brand-blue">Линейка</h3>\n                    <p class="mt-2 text-sm leading-relaxed text-slate-600">SCC, CMP, iCombi и точная модель по шильдику.</p>',
        f'<h3 class="font-display text-lg font-extrabold text-brand-blue">{data["article_1_title"]}</h3>\n                    <p class="mt-2 text-sm leading-relaxed text-slate-600">{data["article_1_text"]}</p>'
    )
    content = content.replace(
        '<h3 class="font-display text-lg font-extrabold text-brand-blue">Симптом</h3>\n                    <p class="mt-2 text-sm leading-relaxed text-slate-600">Ошибка на старте, в нагреве, в паре или после мойки.</p>',
        f'<h3 class="font-display text-lg font-extrabold text-brand-blue">{data["article_2_title"]}</h3>\n                    <p class="mt-2 text-sm leading-relaxed text-slate-600">{data["article_2_text"]}</p>'
    )
    content = content.replace(
        '<h3 class="font-display text-lg font-extrabold text-brand-blue">Выезд</h3>\n                    <p class="mt-2 text-sm leading-relaxed text-slate-600">Согласуем окно и готовим диагностику под модель.</p>',
        f'<h3 class="font-display text-lg font-extrabold text-brand-blue">{data["article_3_title"]}</h3>\n                    <p class="mt-2 text-sm leading-relaxed text-slate-600">{data["article_3_text"]}</p>'
    )

    # ── Main form placeholders ───────────────────────────────
    content = content.replace(
        'placeholder="Rational E9, SCC 6-1/1, CMP..." class="w-full px-4 py-3 border-2',
        f'placeholder="{data["form_placeholder_type"]}" class="w-full px-4 py-3 border-2'
    )
    content = content.replace(
        'placeholder="Когда появляется E9, что не работает, адрес объекта..."',
        f'placeholder="{data["form_placeholder_problem"]}"'
    )

    # ── Main form button ─────────────────────────────────────
    content = content.replace(
        '<i class="ri-send-plane-line mr-2"></i>Вызвать инженера Rational',
        f'<i class="ri-send-plane-line mr-2"></i>{data["button_text"]}'
    )

    # ── Form context ─────────────────────────────────────────
    content = content.replace(
        'data-form-context="parokonvektomat_b2b_ad_landing"',
        f'data-form-context="{data["form_context"]}"'
    )

    # Сохранение
    out_path = PROJECT_DIR / filename
    out_path.write_text(content, encoding='utf-8')
    size_kb = out_path.stat().st_size // 1024
    log(f"✓ Создана {filename} ({size_kb} KB)", GREEN)
    
    # Обновляем page-metadata.json
    if update_page_metadata(filename, data):
        log(f"✓ Добавлены метаданные в page-metadata.json", GREEN)
    
    # Обновляем sitemap.xml
    if update_sitemap(filename):
        log(f"✓ Добавлен URL в sitemap.xml", GREEN)
    
    return True


# ═══════════════════════════════════════════════════════════════
# ШАГ 3: Валидация
# ═══════════════════════════════════════════════════════════════

def run_validate():
    log("\n━━━ Валидация сайта ━━━", BLUE)
    result = subprocess.run(
        ['npm', 'run', 'validate:site'],
        capture_output=True,
        text=True
    )
    output = result.stdout + result.stderr
    print(output[-1000:] if len(output) > 1000 else output)

    if 'Validated' in output and 'successfully' in output:
        log("✓ Валидация прошла успешно", GREEN)
        return True
    else:
        log("✗ Валидация не прошла", RED)
        return False


# ═══════════════════════════════════════════════════════════════
# MAIN
# ═══════════════════════════════════════════════════════════════

def main():
    log("━━━ Оптимизация пароконвектоматов ━━━", BLUE)

    # Проверка git
    status = subprocess.run(['git', 'status', '--short'], capture_output=True, text=True)
    dirty = [l for l in status.stdout.strip().split('\n')
             if l and 'parokonvektomat-optimize.py' not in l and 'remove-duplicate-sections.py' not in l]
    if dirty:
        log("⚠ В git есть незакоммиченные изменения:", YELLOW)
        print('\n'.join(dirty[:10]))
        response = input("\nПродолжить? [y/N]: ").strip().lower()
        if response != 'y':
            sys.exit(0)

    # ─── ШАГ 1: Удаление дублей ─────────────────────────────
    log("\n━━━ 1. Удаление дублирующихся секций ━━━", BLUE)
    files_to_clean = [
        'parokonvektomat-rational-e9.html',
        'parokonvektomat-unox-af02-af08.html',
        'parokonvektomaty-promo.html',
        'parokonvektomat-kod-oshibki.html',
        'parokonvektomat-e02-e07-e10.html',
        'parokonvektomat-ne-greet.html',
        'parokonvektomat-net-para.html',
        'parokonvektomaty.html',
    ]

    total_saved = 0
    total_removed = 0
    for fname in files_to_clean:
        removed, saved = deduplicate_sections(PROJECT_DIR / fname)
        if removed > 0:
            log(f"  ✓ {fname}: удалено {removed} дублей (-{saved // 1024} KB)", GREEN)
            total_saved += saved
            total_removed += removed
        else:
            log(f"  • {fname}: дублей нет", BLUE)

    log(f"\nИтого удалено: {total_removed} дублей, освобождено: {total_saved // 1024} KB", GREEN)

    # ─── ШАГ 2: Создание бренд-страниц ──────────────────────
    log("\n━━━ 2. Создание бренд-специфичных страниц ━━━", BLUE)
    created = 0
    for fname, data in BRAND_PAGES.items():
        if create_brand_page(fname, data):
            created += 1

    log(f"\nСоздано страниц: {created}", GREEN)

    # ─── ШАГ 3: Валидация ───────────────────────────────────
    if not run_validate():
        log("\n⚠ Валидация не прошла — откатываю изменения", YELLOW)
        subprocess.run(['git', 'checkout', '.'])
        for fname in BRAND_PAGES.keys():
            p = PROJECT_DIR / fname
            if p.exists():
                p.unlink()
        sys.exit(1)

    # ─── ШАГ 4: Git commit ──────────────────────────────────
    log("\n━━━ Git коммит ━━━", BLUE)
    subprocess.run(['git', 'add', '-A'], check=True)

    commit_msg = f"""feat: оптимизация пароконвектоматов + 3 бренд-страницы

- Удалено {total_removed} дублей секций (Бренды/Сравнение/География)
  Освобождено ~{total_saved // 1024} KB из 8 HTML файлов
- Созданы 3 новые бренд-специфичные страницы:
  * parokonvektomat-abat.html (Abat ПКА/КПЭ)
  * parokonvektomat-convotherm.html (Convotherm C4/C6/mini)
  * parokonvektomat-lainox.html (Lainox Naboo/Krea/Junior)
- Каждая страница имеет уникальный H1, meta, контекстные формы и WhatsApp
- Готово под связь с группой объявлений "Rational Abat Unox" в Яндекс Директе"""

    subprocess.run(['git', 'commit', '-m', commit_msg], check=True)
    log("✓ Коммит создан", GREEN)

    # ─── Итог ───────────────────────────────────────────────
    log("\n━━━ Итоги ━━━", BLUE)
    log(f"✓ Удалено дублей: {total_removed} (~{total_saved // 1024} KB)", GREEN)
    log(f"✓ Создано бренд-страниц: {created}", GREEN)
    subprocess.run(['git', 'log', '--oneline', '-3'])

    log("\n📋 Следующий шаг:", YELLOW)
    log("  git push origin main", YELLOW)


if __name__ == "__main__":
    main()
