#!/usr/bin/env node
/**
 * Оптимизатор HTML файлов для MosPochin
 * Извлекает повторяющиеся блоки в partials/, уменьшает размер HTML
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PARTIALS_DIR = join(ROOT, 'partials');

// Создаём директорию для компонентов
if (!existsSync(PARTIALS_DIR)) {
  mkdirSync(PARTIALS_DIR, { recursive: true });
  console.log(`✅ Создана директория: partials/`);
}

// Паттерны для извлечения
const PATTERNS = {
  header: /<header[\s\S]*?<\/header>/i,
  footer: /<footer[\s\S]*?<\/footer>/i,
  mobileSticky: /<div[^>]*class="[^"]*mobile-sticky-footer[^"]*"[\s\S]*?<\/div>\s*<\/div>/i,
  whatsappFloat: /<a[^>]*class="[^"]*whatsapp-float[^"]*"[\s\S]*?<\/a>/i,
  noscriptFallback: /<noscript>[\s\S]*?<\/noscript>/i,
  contactForm: /<form[^>]*id="[^"]*contact-form[^"]*"[\s\S]*?<\/form>/i,
};

// Извлекаем блоки из первого файла как эталон
function extractPartials(html) {
  const partials = {};
  
  for (const [name, pattern] of Object.entries(PATTERNS)) {
    const match = html.match(pattern);
    if (match) {
      partials[name] = match[0];
    }
  }
  
  return partials;
}

// Заменяем блоки на INCLUDE комментарии
function replaceWithIncludes(html, partials) {
  let result = html;
  
  for (const [name, content] of Object.entries(partials)) {
    if (result.includes(content)) {
      const includeComment = `<!-- INCLUDE: partials/${name}.html -->`;
      result = result.replace(content, includeComment);
    }
  }
  
  return result;
}

// Анализируем все HTML файлы
const htmlFiles = readdirSync(ROOT)
  .filter(f => f.endsWith('.html'))
  .map(f => ({
    name: f,
    path: join(ROOT, f),
    size: statSync(join(ROOT, f)).size
  }))
  .sort((a, b) => b.size - a.size);

console.log(`\n📊 Анализ HTML файлов:`);
console.log(`   Всего: ${htmlFiles.length} файлов`);
console.log(`   Общий размер: ${(htmlFiles.reduce((s, f) => s + f.size, 0) / 1024 / 1024).toFixed(1)} MB`);
console.log(`\n🔥 Топ-5 самых больших файлов:`);
htmlFiles.slice(0, 5).forEach(f => {
  console.log(`   ${(f.size / 1024).toFixed(0)} KB  ${f.name}`);
});

// Извлекаем partials из самого большого файла
const largestFile = htmlFiles[0];
console.log(`\n🔍 Извлекаю компоненты из: ${largestFile.name}`);

const largestHtml = readFileSync(largestFile.path, 'utf8');
const partials = extractPartials(largestHtml);

console.log(`\n📦 Найдено компонентов:`);
Object.keys(partials).forEach(name => {
  console.log(`   ✓ ${name} (${partials[name].length} байт)`);
});

// Сохраняем partials
for (const [name, content] of Object.entries(partials)) {
  const partialPath = join(PARTIALS_DIR, `${name}.html`);
  writeFileSync(partialPath, content, 'utf8');
  console.log(`   💾 Сохранён: partials/${name}.html`);
}

// Оптимизируем топ-10 самых больших файлов
console.log(`\n🚀 Оптимизирую топ-10 файлов...`);

const results = [];
const topFiles = htmlFiles.slice(0, 10);

for (const file of topFiles) {
  const html = readFileSync(file.path, 'utf8');
  const originalSize = file.size;
  
  const optimized = replaceWithIncludes(html, partials);
  const newSize = Buffer.byteLength(optimized, 'utf8');
  
  if (newSize < originalSize) {
    writeFileSync(file.path, optimized, 'utf8');
    const saved = originalSize - newSize;
    const percent = ((saved / originalSize) * 100).toFixed(1);
    
    results.push({
      file: file.name,
      original: originalSize,
      optimized: newSize,
      saved: saved,
      percent: percent
    });
    
    console.log(`   ✓ ${file.name}: ${(originalSize/1024).toFixed(0)}KB → ${(newSize/1024).toFixed(0)}KB (−${percent}%)`);
  } else {
    console.log(`   ⚠ ${file.name}: нет изменений`);
  }
}

// Итоговая статистика
const totalSaved = results.reduce((s, r) => s + r.saved, 0);
const totalOriginal = results.reduce((s, r) => s + r.original, 0);
const totalOptimized = results.reduce((s, r) => s + r.optimized, 0);

console.log(`\n✅ Оптимизация завершена!`);
console.log(`\n📊 Результаты:`);
console.log(`   Файлов оптимизировано: ${results.length}`);
console.log(`   Исходный размер: ${(totalOriginal / 1024).toFixed(0)} KB`);
console.log(`   После оптимизации: ${(totalOptimized / 1024).toFixed(0)} KB`);
console.log(`   Сэкономлено: ${(totalSaved / 1024).toFixed(0)} KB (${((totalSaved / totalOriginal) * 100).toFixed(1)}%)`);

// Сохраняем отчёт
const report = {
  timestamp: new Date().toISOString(),
  partialsCreated: Object.keys(partials),
  filesOptimized: results,
  summary: {
    totalFiles: results.length,
    totalSavedKB: Math.round(totalSaved / 1024),
    percentSaved: ((totalSaved / totalOriginal) * 100).toFixed(1)
  }
};

writeFileSync(join(ROOT, 'optimization-report.json'), JSON.stringify(report, null, 2));
console.log(`\n📄 Отчёт сохранён: optimization-report.json`);
