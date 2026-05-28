#!/usr/bin/env python3
"""
Безопасная очистка мёртвых файлов проекта Mospochin_site
"""

import os
import sys
import subprocess
import shutil
from pathlib import Path

# Цвета для вывода
GREEN = '\033[92m'
YELLOW = '\033[93m'
RED = '\033[91m'
BLUE = '\033[94m'
RESET = '\033[0m'

def log(message, color=RESET):
    print(f"{color}{message}{RESET}")

def run_command(cmd, check=True):
    log(f"→ Выполняю: {cmd}", BLUE)
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if check and result.returncode != 0:
        log(f"✗ Ошибка: {result.stderr}", RED)
        sys.exit(1)
    return result.stdout.strip()

def get_size(path):
    p = Path(path)
    if p.is_file():
        return p.stat().st_size
    return sum(f.stat().st_size for f in p.rglob('*') if f.is_file())

def format_size(size):
    for unit in ['B', 'KB', 'MB', 'GB']:
        if size < 1024.0:
            return f"{size:.1f} {unit}"
        size /= 1024.0

def main():
    log("━━━ Очистка мёртвых файлов Mospochin_site ━━━", BLUE)

    if not Path("package.json").exists():
        log("✗ Ошибка: package.json не найден. Запустите из корня проекта.", RED)
        sys.exit(1)

    git_status_raw = run_command("git status --short")
    git_status_lines = [
        line for line in git_status_raw.splitlines()
        if "cleanup-dead-files.py" not in line
    ]
    git_status = "\n".join(git_status_lines).strip()
    if git_status:
        log("⚠ В git есть незакоммиченные изменения:", YELLOW)
        print(git_status)
        sys.exit(1)

    total_cleaned = 0
    cleaned_items = []

    # 1. Мёртвые CSS файлы
    log("\n━━━ 1. Мёртвые CSS файлы в assets/css/ ━━━", BLUE)
    css_files = ["assets/css/styles-built.css", "assets/css/styles.css"]
    for css_file in css_files:
        p = Path(css_file)
        if p.exists():
            size = get_size(p)
            log(f"Удаляю: {css_file} ({format_size(size)})", YELLOW)
            p.unlink()
            cleaned_items.append(f"{css_file} ({format_size(size)})")
            total_cleaned += size
        else:
            log(f"Уже отсутствует: {css_file}", GREEN)

    if Path("assets/css").exists() and not list(Path("assets/css").iterdir()):
        log("Удаляю пустую папку: assets/css/", YELLOW)
        Path("assets/css").rmdir()

    # 2. Бэкап неиспользуемых изображений
    log("\n━━━ 2. Бэкап неиспользуемых изображений ━━━", BLUE)
    unused_backup = Path("assets/images-unused-backup")
    if unused_backup.exists():
        size = get_size(unused_backup)
        log(f"Удаляю: assets/images-unused-backup/ ({format_size(size)})", YELLOW)
        shutil.rmtree(unused_backup)
        cleaned_items.append(f"assets/images-unused-backup/ ({format_size(size)})")
        total_cleaned += size
    else:
        log("Уже отсутствует: assets/images-unused-backup/", GREEN)

    # 3. Мёртвые шрифты
    log("\n━━━ 3. Мёртвые шрифты в assets/fonts/ ━━━", BLUE)
    used_fonts = {
        "xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk79FO_F.ttf",
        "xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk7PFO_F.ttf",
        "xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk4jE-_F.ttf",
        "xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk4aE-_F.ttf",
        "xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk59E-_F.ttf"
    }
    fonts_dir = Path("assets/fonts")
    if fonts_dir.exists():
        for font_file in fonts_dir.glob("*.ttf"):
            if font_file.name not in used_fonts:
                size = get_size(font_file)
                log(f"Удаляю: assets/fonts/{font_file.name} ({format_size(size)})", YELLOW)
                font_file.unlink()
                cleaned_items.append(f"assets/fonts/{font_file.name} ({format_size(size)})")
                total_cleaned += size

    # 4. hero-restaurant.jpg
    log("\n━━━ 4. Проверка hero-restaurant.jpg ━━━", BLUE)
    hero_image = Path("assets/images/hero-restaurant.jpg")
    if hero_image.exists():
        grep_result = subprocess.run(
            "grep -r 'assets/images/hero-restaurant.jpg' *.html 2>/dev/null || true",
            shell=True, capture_output=True, text=True
        ).stdout.strip()

        if not grep_result:
            size = get_size(hero_image)
            log(f"Удаляю (не используется): assets/images/hero-restaurant.jpg ({format_size(size)})", YELLOW)
            hero_image.unlink()
            cleaned_items.append(f"assets/images/hero-restaurant.jpg ({format_size(size)})")
            total_cleaned += size
        else:
            log(f"⚠ Файл используется в HTML, пропускаю", YELLOW)
            print(f"  Используется в: {grep_result}")
    else:
        log("Уже отсутствует: assets/images/hero-restaurant.jpg", GREEN)

    # Итоги
    log("\n━━━ Итоги очистки ━━━", BLUE)
    if not cleaned_items:
        log("Нечего удалять - всё уже чисто!", GREEN)
        return

    total_size_mb = total_cleaned / (1024 * 1024)
    log(f"Удалено файлов: {len(cleaned_items)}", GREEN)
    log(f"Освобождено места: {total_size_mb:.2f} MB", GREEN)
    print("\nУдалённые файлы:")
    for item in cleaned_items:
        print(f"  - {item}")

    # Валидация
    log("\n━━━ Валидация сайта ━━━", BLUE)
    validation_output = subprocess.run(
        "npm run validate:site",
        shell=True, capture_output=True, text=True
    )
    if "Validated 32 pages successfully" in validation_output.stdout:
        log("✓ Валидация прошла успешно", GREEN)
    else:
        log("✗ Валидация не прошла! Откатываю изменения.", RED)
        print(validation_output.stdout)
        run_command("git checkout .")
        sys.exit(1)

    # Git коммит
    log("\n━━━ Git коммит ━━━", BLUE)
    commit_message = f"chore: удаление мёртвых файлов (-{total_size_mb:.1f} MB)\n\nУдалено:\n" + "\n".join(f"- {item}" for item in cleaned_items)

    run_command("git add -A")
    run_command(f'git commit -m "{commit_message}"')

    log("\n✓ Очистка завершена успешно!", GREEN)
    log(f"Освобождено: {total_size_mb:.2f} MB", GREEN)

    log("\n━━━ Последние коммиты ━━━", BLUE)
    print(run_command("git log --oneline -5"))

if __name__ == "__main__":
    main()
