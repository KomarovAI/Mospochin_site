#!/usr/bin/env node
import { parseArgs } from './ai-maintenance-lib.mjs';
import { classifyFile, componentsForFile, loadAiIndexSafe, loadComponentMapSafe } from './ai-semantic-lib.mjs';

const args = parseArgs();
const index = loadAiIndexSafe();
const componentMap = loadComponentMapSafe();

function parseFiles() {
  const raw = [];
  if (args.files) raw.push(...String(args.files).split(/[\s,]+/));
  raw.push(...(args._ || []));
  return raw.map((f) => f.trim()).filter(Boolean);
}

function printHelp() {
  console.log(`\n# AI Impact\n\nПоказывает последствия гибких правок по файлам.\n\nИспользование:\n  npm run ai:impact -- --files holodilniki.html,styles-combined.css\n  npm run ai:impact -- holodilniki.html telegram-form.js\n`);
}

const files = parseFiles();
if (!files.length) {
  printHelp();
  process.exit(0);
}

console.log('\n# AI Impact Analyzer\n');
const allChecks = new Set();
const riskRank = { low: 1, medium: 2, high: 3 };
let maxRisk = 'low';
const allAffectedPages = new Set();

for (const file of files) {
  const info = classifyFile(file, index);
  if (riskRank[info.risk] > riskRank[maxRisk]) maxRisk = info.risk;
  for (const check of info.recommendedChecks) allChecks.add(check);
  for (const page of info.affectedPages) allAffectedPages.add(page);
  const components = componentsForFile(info.file, componentMap);

  console.log(`## ${info.file}`);
  console.log(`Тип: ${info.type}`);
  console.log(`Риск: ${info.risk}`);
  console.log(`Файл существует: ${info.exists ? 'да' : 'нет'}`);
  if (info.notes.length) {
    console.log('Заметки:');
    for (const note of info.notes) console.log(`- ${note}`);
  }
  if (components.length) {
    console.log('Связанные компоненты:');
    for (const component of components.slice(0, 12)) {
      console.log(`- ${component.id}: ${component.name}`);
    }
  }
  if (info.affectedPages.length) {
    const pages = info.affectedPages.length > 12
      ? `${info.affectedPages.slice(0, 12).join(', ')} … +${info.affectedPages.length - 12}`
      : info.affectedPages.join(', ');
    console.log(`Затронутые страницы: ${pages}`);
  }
  console.log('Проверки:');
  for (const check of info.recommendedChecks) console.log(`- ${check}`);
  console.log('');
}

console.log('## Сводка');
console.log(`Максимальный риск: ${maxRisk}`);
console.log(`Потенциально затронуто страниц: ${allAffectedPages.size}`);
if (allAffectedPages.size) console.log(`Ключевые страницы: ${[...allAffectedPages].slice(0, 10).join(', ')}${allAffectedPages.size > 10 ? ' …' : ''}`);
console.log('\nРекомендуемые проверки пакетом:');
for (const check of allChecks) console.log(`- ${check}`);
