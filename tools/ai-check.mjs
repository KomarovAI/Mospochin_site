#!/usr/bin/env node

/**
 * AI Quick Check - быстрая проверка что сайт работает после изменений
 * 
 * Использование:
 *   npm run ai:check
 * 
 * Что делает:
 *   1. Проверяет валидность JSON файлов
 *   2. Запускает validate:site
 *   3. Проверяет что все HTML файлы существуют
 *   4. Выводит отчёт
 */

import { readFileSync, existsSync, readdirSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';

console.log('🔍 AI Quick Check - проверка сайта после изменений\n');

let errors = 0;
let warnings = 0;

// 1. Проверка JSON файлов
console.log('📊 1. Проверка JSON файлов...');
const dataDir = 'data';
const jsonFiles = readdirSync(dataDir).filter(f => f.endsWith('.json'));

for (const file of jsonFiles) {
  try {
    const content = readFileSync(join(dataDir, file), 'utf-8');
    JSON.parse(content);
    console.log(`  ✅ ${file} - OK`);
  } catch (err) {
    console.error(`  ❌ ${file} - ОШИБКА: ${err.message}`);
    errors++;
  }
}

console.log('');

// 2. Проверка что все HTML файлы из page-metadata существуют
console.log('📄 2. Проверка HTML файлов...');
try {
  const metadata = JSON.parse(readFileSync('data/page-metadata.json', 'utf-8'));
  const pages = Object.keys(metadata.pages);
  
  for (const page of pages) {
    if (existsSync(page)) {
      console.log(`  ✅ ${page} - существует`);
    } else {
      console.error(`  ❌ ${page} - НЕ НАЙДЕН`);
      errors++;
    }
  }
} catch (err) {
  console.error(`  ❌ Ошибка чтения page-metadata.json: ${err.message}`);
  errors++;
}

console.log('');

// 3. Запуск validate:site
console.log('🔧 3. Запуск validate:site...');
try {
  execSync('npm run validate:site', { stdio: 'inherit' });
  console.log('  ✅ Валидация прошла успешно');
} catch (err) {
  console.error('  ❌ Валидация завершилась с ошибками');
  errors++;
}

console.log('');

// 4. Проверка размера файлов
console.log('📦 4. Проверка размера файлов...');
const htmlFiles = readdirSync('.').filter(f => f.endsWith('.html'));
const largeFiles = [];

for (const file of htmlFiles) {
  const stats = readFileSync(file);
  const sizeKB = stats.length / 1024;
  
  if (sizeKB > 150) {
    console.warn(`  ⚠️  ${file} - ${sizeKB.toFixed(1)} KB (очень большой)`);
    warnings++;
    largeFiles.push({ file, size: sizeKB });
  } else if (sizeKB > 100) {
    console.warn(`  ⚠️  ${file} - ${sizeKB.toFixed(1)} KB (большой)`);
    warnings++;
  } else {
    console.log(`  ✅ ${file} - ${sizeKB.toFixed(1)} KB`);
  }
}

console.log('');

// 5. Итоговый отчёт
console.log('═══════════════════════════════════════════════════════════');
console.log('📊 ИТОГОВЫЙ ОТЧЁТ');
console.log('═══════════════════════════════════════════════════════════');
console.log('');

if (errors === 0 && warnings === 0) {
  console.log('✅ ВСЁ ОТЛИЧНО! Сайт готов к работе.');
  console.log('');
  console.log('Следующие шаги:');
  console.log('  1. Запусти dev server: npm run dev');
  console.log('  2. Открой http://localhost:3000');
  console.log('  3. Проверь визуально что всё работает');
  console.log('  4. Если всё ок - коммить: git add . && git commit -m "..."');
} else if (errors === 0) {
  console.log(`⚠️  ЕСТЬ ПРЕДУПРЕЖДЕНИЯ: ${warnings}`);
  console.log('');
  console.log('Сайт работает, но есть предупреждения:');
  
  if (largeFiles.length > 0) {
    console.log('');
    console.log('Большие HTML файлы (рекомендуется оптимизировать):');
    for (const { file, size } of largeFiles) {
      console.log(`  - ${file}: ${size.toFixed(1)} KB`);
    }
  }
  
  console.log('');
  console.log('Можно продолжать работу, но лучше оптимизировать.');
} else {
  console.log(`❌ ЕСТЬ ОШИБКИ: ${errors}`);
  console.log('');
  console.log('НЕ КОММИТЬ пока не исправишь ошибки!');
  console.log('');
  console.log('Как исправить:');
  console.log('  1. Посмотри ошибки выше');
  console.log('  2. Исправь JSON синтаксис или верни файлы');
  console.log('  3. Снова запусти: npm run ai:check');
  console.log('');
  console.log('Если не знаешь как исправить:');
  console.log('  git reset --hard HEAD  # откатить все изменения');
}

console.log('');
console.log('═══════════════════════════════════════════════════════════');

process.exit(errors > 0 ? 1 : 0);
