#!/usr/bin/env node
import { parseArgs } from './ai-maintenance-lib.mjs';
import { classifyFile, componentsForFile, getGitChangedFiles, loadAiIndexSafe, loadComponentMapSafe } from './ai-semantic-lib.mjs';

const args = parseArgs();
const index = loadAiIndexSafe();
const componentMap = loadComponentMapSafe();

function parseFiles() {
  const raw = [];
  if (args.files) raw.push(...String(args.files).split(/[\s,]+/));
  raw.push(...(args._ || []));
  return raw.map((f) => f.trim()).filter(Boolean);
}

let files = parseFiles();
const gitChanged = getGitChangedFiles();
if (!files.length && Array.isArray(gitChanged)) files = gitChanged;

console.log('\n# AI Review\n');
if (!files.length) {
  if (gitChanged === null) {
    console.log('Git metadata не найдена. Для архива это нормально. Передай файлы явно:');
    console.log('npm run ai:review -- --files holodilniki.html,styles-combined.css');
  } else {
    console.log('Изменённых файлов нет.');
  }
  process.exit(0);
}

const groups = new Map();
const checks = new Set(['npm run ai:check -- --fast']);
const risks = [];
const affectedPages = new Set();
const semanticPages = new Set();

for (const file of files) {
  const info = classifyFile(file, index);
  if (!groups.has(info.type)) groups.set(info.type, []);
  groups.get(info.type).push(info);
  for (const check of info.recommendedChecks) checks.add(check);
  for (const page of info.affectedPages) affectedPages.add(page);
  if (file.endsWith('.html')) semanticPages.add(file);
  for (const note of info.notes) risks.push(`[${file}] ${note}`);
  const comps = componentsForFile(info.file, componentMap);
  for (const comp of comps) {
    for (const risk of comp.risks || []) risks.push(`[${comp.id}] ${risk}`);
  }
}

console.log('## Изменённые файлы по типам');
for (const [type, items] of groups.entries()) {
  console.log(`\n### ${type}`);
  for (const item of items) console.log(`- ${item.file} [risk=${item.risk}]`);
}

console.log('\n## Затронутые компоненты');
const componentIds = new Map();
for (const file of files) {
  for (const comp of componentsForFile(file, componentMap)) componentIds.set(comp.id, comp.name);
}
if (componentIds.size) {
  for (const [id, name] of componentIds.entries()) console.log(`- ${id}: ${name}`);
} else {
  console.log('- Не определены автоматически.');
}

console.log('\n## Потенциально затронутые страницы');
if (affectedPages.size) console.log([...affectedPages].slice(0, 20).map((p) => `- ${p}`).join('\n'));
else console.log('- Не определены автоматически.');

console.log('\n## Риски');
const uniqueRisks = [...new Set(risks)].slice(0, 24);
if (uniqueRisks.length) for (const risk of uniqueRisks) console.log(`- ${risk}`);
else console.log('- Явных рисков не выявлено.');

console.log('\n## Semantic diff для HTML');
if (semanticPages.size) {
  for (const page of semanticPages) console.log(`- npm run ai:semantic-diff -- --page ${page}`);
} else if (affectedPages.size && affectedPages.size <= 8) {
  for (const page of affectedPages) console.log(`- npm run ai:semantic-diff -- --page ${page}`);
} else {
  console.log('- Для глобальных CSS/JS правок выбери 3–5 ключевых страниц и проверь semantic diff + визуально.');
}

console.log('\n## Рекомендуемые проверки');
for (const check of checks) console.log(`- ${check}`);
console.log('- npm run ai:check');
