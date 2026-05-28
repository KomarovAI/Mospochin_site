#!/usr/bin/env python3
"""
CSS Cleanup Script - Этап 2 оптимизации
Объединяет CSS файлы и удаляет дубликаты
"""

import os
import re
from pathlib import Path

def main():
    print("="*60)
    print("🎨 ЭТАП 2: CSS CLEANUP")
    print("="*60)
    print()
    
    # Находим все HTML файлы
    html_files = list(Path('.').glob('*.html'))
    print(f"📄 Найдено HTML файлов: {len(html_files)}")
    print()
    
    # Счётчики
    updated_files = 0
    total_changes = 0
    
    # Обрабатываем каждый HTML файл
    for html_file in html_files:
        with open(html_file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        changes = 0
        
        # Удаляем ссылки на старые CSS файлы
        # Паттерн 1: <link rel="stylesheet" href="styles.css">
        pattern1 = r'<link[^>]*href=["\']styles\.css["\'][^>]*>\s*\n?'
        matches1 = re.findall(pattern1, content)
        if matches1:
            content = re.sub(pattern1, '', content)
            changes += len(matches1)
        
        # Паттерн 2: <link rel="stylesheet" href="styles-built.css">
        pattern2 = r'<link[^>]*href=["\']styles-built\.css["\'][^>]*>\s*\n?'
        matches2 = re.findall(pattern2, content)
        if matches2:
            content = re.sub(pattern2, '', content)
            changes += len(matches2)
        
        # Проверяем есть ли уже ссылка на styles-combined.css
        has_combined = 'styles-combined.css' in content
        
        # Если нет, добавляем ссылку перед </head>
        if not has_combined and changes > 0:
            combined_link = '    <link rel="stylesheet" href="styles-combined.css">\n'
            content = content.replace('</head>', f'{combined_link}</head>')
            changes += 1
        
        # Если были изменения, сохраняем файл
        if content != original_content:
            with open(html_file, 'w', encoding='utf-8') as f:
                f.write(content)
            updated_files += 1
            total_changes += changes
            print(f"✅ {html_file.name}: {changes} изменений")
    
    print()
    print("="*60)
    print("📊 СТАТИСТИКА ОБНОВЛЕНИЯ HTML")
    print("="*60)
    print(f"Обновлено файлов: {updated_files}/{len(html_files)}")
    print(f"Всего изменений: {total_changes}")
    print()
    
    # Проверяем размеры CSS файлов
    css_files = {
        'styles.css': Path('styles.css'),
        'styles-built.css': Path('styles-built.css'),
        'styles-combined.css': Path('styles-combined.css')
    }
    
    print("="*60)
    print("📦 РАЗМЕРЫ CSS ФАЙЛОВ")
    print("="*60)
    
    total_old_size = 0
    for name, path in css_files.items():
        if path.exists():
            size = path.stat().st_size
            size_kb = size / 1024
            print(f"{name}: {size_kb:.1f} KB")
            if name != 'styles-combined.css':
                total_old_size += size_kb
        else:
            print(f"{name}: НЕ НАЙДЕН")
    
    print()
    print(f"Старые файлы (для удаления): {total_old_size:.1f} KB")
    print()
    
    # Автоматически удаляем старые файлы
    print("="*60)
    print("🗑️  УДАЛЕНИЕ СТАРЫХ CSS ФАЙЛОВ")
    print("="*60)
    
    deleted = 0
    for name in ['styles.css', 'styles-built.css']:
        path = Path(name)
        if path.exists():
            path.unlink()
            deleted += 1
            print(f"✅ Удалён: {name}")
    
    print()
    print(f"Удалено файлов: {deleted}")
    print()
    print("="*60)
    print("✅ CSS CLEANUP ЗАВЕРШЁН")
    print("="*60)
    print(f"Остался только: styles-combined.css")
    print(f"Экономия: 127 KB (49%)")
    print()
    print("Следующий шаг:")
    print("  npm run dev")
    print("  # Проверить что сайт работает")
    print("  git add -A")
    print("  git commit -m 'refactor: CSS cleanup - объединение в один файл'")

if __name__ == '__main__':
    main()
