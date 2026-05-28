#!/usr/bin/env node
/**
 * Главная команда оптимизации сайта
 * Запускает все оптимизации и показывает отчёт
 */

import { execSync } from 'child_process';

console.log(`\n🚀 Запуск оптимизации сайта MosPochin\n`);
console.log(`═══════════════════════════════════════════════════════════\n`);

const steps = [
  {
    name: 'Шаг 1: Оптимизация HTML файлов',
    command: 'npm run optimize:html',
    description: 'Выносит повторяющиеся блоки в partials/'
  },
  {
    name: 'Шаг 2: Извлечение контента',
    command: 'npm run content:extract',
    description: 'Создаёт content/site-content.json для нейронки'
  },
  {
    name: 'Шаг 3: Валидация сайта',
    command: 'npm run validate:site',
    description: 'Проверяет что сайт не сломан'
  }
];

const results = [];

for (const step of steps) {
  console.log(`\n${step.name}`);
  console.log(`───────────────────────────────────────────────────────────`);
  console.log(`📝 ${step.description}\n`);
  
  try {
    const output = execSync(step.command, { encoding: 'utf8', stdio: 'pipe' });
    console.log(output);
    results.push({ step: step.name, status: '✅ Успешно' });
  } catch (error) {
    console.log(`⚠️  Ошибка: ${error.message}`);
    if (error.stdout) console.log(error.stdout);
    if (error.stderr) console.log(error.stderr);
    results.push({ step: step.name, status: '❌ Ошибка' });
  }
}

console.log(`\n═══════════════════════════════════════════════════════════`);
console.log(`\n📊 Итоговый отчёт:\n`);

results.forEach(r => {
  console.log(`  ${r.status}  ${r.step}`);
});

console.log(`\n✅ Оптимизация завершена!\n`);
console.log(`📁 Что создано:`);
console.log(`   • partials/*.html — переиспользуемые компоненты`);
console.log(`   • content/site-content.json — весь контент для нейронки`);
console.log(`   • AI-CONTEXT.md — краткая документация`);
console.log(`\n🚀 Команды для работы:`);
console.log(`   npm run optimize:html      — оптимизировать HTML`);
console.log(`   npm run content:extract    — обновить контент`);
console.log(`   npm run build:partials     — собрать для production`);
console.log(`   npm run validate:site      — валидация`);
console.log(`\n`);
