#!/usr/bin/env node
/**
 * Извлекает весь текстовый контент из HTML в JSON
 * Создаёт content/site-content.json для работы с нейронкой
 */

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const CONTENT_DIR = join(ROOT, 'content');

// Создаём директорию
if (!existsSync(CONTENT_DIR)) {
  mkdirSync(CONTENT_DIR, { recursive: true });
  console.log(`✅ Создана директория: content/`);
}

// Извлекаем текст из HTML
function extractContent(html) {
  // Удаляем script и style
  html = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  html = html.replace(/<style[\s\S]*?<\/style>/gi, '');
  
  // Извлекаем title и meta
  const title = (html.match(/<title>([\s\S]*?)<\/title>/i) || [, ''])[1].trim();
  const description = (html.match(/<meta name="description" content="([^"]+)"/i) || [, ''])[1].trim();
  
  // Извлекаем h1
  const h1 = (html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [, ''])[1]
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  
  // Извлекаем секции
  const sections = [];
  const sectionRegex = /<(section|div|article)[^>]*(?:id|data-section)="([^"]+)"[^>]*>([\s\S]*?)<\/\1>/gi;
  let match;
  
  while ((match = sectionRegex.exec(html)) !== null) {
    const [, tag, id, content] = match;
    const text = content
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    
    if (text.length > 20) {
      sections.push({
        id: id,
        text: text.substring(0, 500) // Ограничиваем длину
      });
    }
  }
  
  // Извлекаем FAQ
  const faq = [];
  const faqRegex = /data-faq-question="([^"]+)"[\s\S]*?data-faq-answer="([^"]+)"/gi;
  let faqMatch;
  
  while ((faqMatch = faqRegex.exec(html)) !== null) {
    faq.push({
      question: faqMatch[1],
      answer: faqMatch[2]
    });
  }
  
  return {
    title,
    h1,
    description,
    sections: sections.slice(0, 15), // Топ-15 секций
    faq
  };
}

// Находим все HTML файлы
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

// Извлекаем контент из каждого файла
const result = {
  meta: {
    generated: new Date().toISOString(),
    totalFiles: htmlFiles.length,
    totalHtmlBytes: htmlFiles.reduce((s, f) => s + f.size, 0),
    purpose: "AI-friendly content layer. Edit this file, not HTML."
  },
  pages: {}
};

console.log(`\n🔍 Извлекаю контент из ${htmlFiles.length} файлов...`);

for (const file of htmlFiles) {
  try {
    const html = readFileSync(file.path, 'utf8');
    result.pages[file.name] = extractContent(html);
    process.stdout.write(`   ✓ ${file.name}\n`);
  } catch (e) {
    console.error(`   ⚠ ${file.name}: ${e.message}`);
  }
}

// Сохраняем результат
const jsonStr = JSON.stringify(result, null, 2);
const contentPath = join(CONTENT_DIR, 'site-content.json');
writeFileSync(contentPath, jsonStr, 'utf8');

// Статистика
const stats = {
  htmlTotalKB: Math.round(result.meta.totalHtmlBytes / 1024),
  jsonKB: Math.round(jsonStr.length / 1024),
  reduction: Math.round((1 - jsonStr.length / result.meta.totalHtmlBytes) * 100)
};

console.log(`\n✅ Контент извлечён!`);
console.log(`\n📊 Результаты:`);
console.log(`   HTML всего: ${stats.htmlTotalKB} KB`);
console.log(`   JSON контента: ${stats.jsonKB} KB`);
console.log(`   Экономия контекста: ${stats.reduction}%`);
console.log(`\n📁 Создан файл: content/site-content.json`);
console.log(`\n💡 Теперь нейронка читает ${stats.jsonKB} KB вместо ${stats.htmlTotalKB} KB`);
