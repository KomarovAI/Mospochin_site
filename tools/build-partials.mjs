#!/usr/bin/env node
/**
 * Собирает partials обратно в HTML для production
 * Заменяет INCLUDE комментарии на реальный код из partials/
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PARTIALS_DIR = join(ROOT, 'partials');

if (!existsSync(PARTIALS_DIR)) {
  console.log('⚠️  Директория partials/ не найдена. Нечего собирать.');
  process.exit(0);
}

// Загружаем все partials
const partials = {};
const partialFiles = readdirSync(PARTIALS_DIR).filter(f => f.endsWith('.html'));

for (const file of partialFiles) {
  const name = file.replace('.html', '');
  const content = readFileSync(join(PARTIALS_DIR, file), 'utf8');
  partials[name] = content;
  console.log(`📦 Загружен partial: ${name}`);
}

// Находим все HTML файлы
const htmlFiles = readdirSync(ROOT)
  .filter(f => f.endsWith('.html'))
  .map(f => join(ROOT, f));

console.log(`\n🔧 Собираю ${htmlFiles.length} HTML файлов...`);

let filesUpdated = 0;

for (const htmlPath of htmlFiles) {
  let html = readFileSync(htmlPath, 'utf8');
  let changed = false;
  
  // Заменяем INCLUDE комментарии на реальный код
  for (const [name, content] of Object.entries(partials)) {
    const pattern = new RegExp(`<!-- INCLUDE: partials/${name}\\.html -->`, 'g');
    if (html.match(pattern)) {
      html = html.replace(pattern, content);
      changed = true;
    }
  }
  
  if (changed) {
    writeFileSync(htmlPath, html, 'utf8');
    filesUpdated++;
    console.log(`   ✓ ${htmlPath.split('/').pop()}`);
  }
}

console.log(`\n✅ Сборка завершена!`);
console.log(`   Файлов обновлено: ${filesUpdated}`);
console.log(`   Partial'ов использовано: ${Object.keys(partials).length}`);
