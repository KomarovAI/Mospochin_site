#!/usr/bin/env python3
"""
Удаление дублирующихся секций из страниц пароконвектоматов
Секции 15 (БРЕНДЫ), 16 (СРАВНЕНИЕ), 17 (ГЕОГРАФИЯ) повторяются дважды
"""

import re
from pathlib import Path

# Файлы пароконвектоматов
files = [
    'parokonvektomat-rational-e9.html',
    'parokonvektomat-unox-af02-af08.html',
    'parokonvektomat-kod-oshibki.html',
    'parokonvektomat-ne-greet.html',
    'parokonvektomat-net-para.html',
    'parokonvektomat-e02-e07-e10.html',
    'parokonvektomaty.html',
    'parokonvektomaty-promo.html',
    'remont-oborudovaniya-restorana-parokonvektomat.html'
]

base_path = Path(__file__).parent.parent

# Паттерны для поиска дублирующихся секций
# Ищем второе вхождение каждой секции (первое оставляем)

def remove_duplicate_sections(content):
    """Удаляет дублирующиеся секции БРЕНДЫ, СРАВНЕНИЕ, ГЕОГРАФИЯ"""
    
    # Секция БРЕНДЫ (ищем по id="brands")
    # Первое вхождение оставляем, второе удаляем
    brands_pattern = r'(<!-- =+\s+SECTION 15: БРЕНДЫ\s+=+ -->.*?)(<!-- =+\s+SECTION 15: БРЕНДЫ\s+=+ -->.*?)(<!-- =+\s+SECTION 16:)'
    content = re.sub(brands_pattern, r'\1\3', content, flags=re.DOTALL)
    
    # Секция СРАВНЕНИЕ
    comparison_pattern = r'(<!-- =+\s+SECTION 16: СРАВНЕНИЕ.*?=+ -->.*?)(<!-- =+\s+SECTION 16: СРАВНЕНИЕ.*?=+ -->.*?)(<!-- =+\s+SECTION 17:)'
    content = re.sub(comparison_pattern, r'\1\3', content, flags=re.DOTALL)
    
    # Секция ГЕОГРАФИЯ
    geography_pattern = r'(<!-- =+\s+SECTION 17: ГЕОГРАФИЯ.*?=+ -->.*?)(<!-- =+\s+SECTION 17: ГЕОГРАФИЯ.*?=+ -->.*?)(<!-- =+\s+SECTION 18:)'
    content = re.sub(geography_pattern, r'\1\3', content, flags=re.DOTALL)
    
    return content

total_removed = 0
files_fixed = []

for filename in files:
    filepath = base_path / filename
    if not filepath.exists():
        print(f"⚠ Файл не найден: {filename}")
        continue
    
    original_size = filepath.stat().st_size
    content = filepath.read_text(encoding='utf-8')
    
    # Подсчитываем количество вхождений каждой секции
    brands_count = content.count('SECTION 15: БРЕНДЫ')
    comparison_count = content.count('SECTION 16: СРАВНЕНИЕ')
    geography_count = content.count('SECTION 17: ГЕОГРАФИЯ')
    
    if brands_count > 1 or comparison_count > 1 or geography_count > 1:
        print(f"\n{filename}:")
        print(f"  БРЕНДЫ: {brands_count} вхождений")
        print(f"  СРАВНЕНИЕ: {comparison_count} вхождений")
        print(f"  ГЕОГРАФИЯ: {geography_count} вхождений")
        
        # Удаляем дубли
        new_content = remove_duplicate_sections(content)
        
        # Проверяем что удалилось
        new_brands = new_content.count('SECTION 15: БРЕНДЫ')
        new_comparison = new_content.count('SECTION 16: СРАВНЕНИЕ')
        new_geography = new_content.count('SECTION 17: ГЕОГРАФИЯ')
        
        if new_brands < brands_count or new_comparison < comparison_count or new_geography < geography_count:
            filepath.write_text(new_content, encoding='utf-8')
            new_size = filepath.stat().st_size
            removed = original_size - new_size
            total_removed += removed
            files_fixed.append((filename, removed))
            print(f"  ✅ Удалено: {removed:,} bytes ({removed/1024:.1f} KB)")
            print(f"     БРЕНДЫ: {brands_count} → {new_brands}")
            print(f"     СРАВНЕНИЕ: {comparison_count} → {new_comparison}")
            print(f"     ГЕОГРАФИЯ: {geography_count} → {new_geography}")
        else:
            print(f"  ⚠ Паттерны не сработали")
    else:
        print(f"{filename}: дубли не найдены ✓")

print(f"\n{'='*60}")
print(f"Итого исправлено файлов: {len(files_fixed)}")
print(f"Общая экономия: {total_removed:,} bytes ({total_removed/1024:.1f} KB)")
print(f"\nИсправленные файлы:")
for filename, removed in files_fixed:
    print(f"  - {filename}: -{removed/1024:.1f} KB")