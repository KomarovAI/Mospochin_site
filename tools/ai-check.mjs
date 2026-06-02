#!/usr/bin/env node
/**
 * AI Check - финальная проверка проекта после правок AI/разработчика.
 *
 * Использование:
 *   npm run ai:check
 *   npm run ai:check -- --fast
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import { join } from 'path';
import { getFileSize, listHtmlFiles, parseArgs, ROOT_DIR } from './ai-maintenance-lib.mjs';

const args = parseArgs();
const fast = Boolean(args.fast);

let errors = 0;
let warnings = 0;
const warningsList = [];
const errorsList = [];

function section(title) {
  console.log(`\n## ${title}`);
}

function ok(message) {
  console.log(`✅ ${message}`);
}

function warn(message) {
  warnings += 1;
  warningsList.push(message);
  console.warn(`⚠️  ${message}`);
}

function fail(message) {
  errors += 1;
  errorsList.push(message);
  console.error(`❌ ${message}`);
}

function run(command, { required = true } = {}) {
  try {
    execSync(command, { cwd: ROOT_DIR, stdio: 'inherit' });
    ok(command);
  } catch (error) {
    if (required) fail(`${command} завершилась с ошибкой`);
    else warn(`${command} завершилась с предупреждением`);
  }
}

console.log('\n# AI Check — MosPochin\n');
console.log(fast ? 'Режим: fast' : 'Режим: full');

section('1. JSON syntax');
try {
  const jsonFiles = [];
  for (const dir of ['data', 'content']) {
    if (!existsSync(join(ROOT_DIR, dir))) continue;
    for (const file of readdirSync(join(ROOT_DIR, dir))) {
      if (file.endsWith('.json')) jsonFiles.push(`${dir}/${file}`);
    }
  }
  for (const file of jsonFiles.sort()) {
    JSON.parse(readFileSync(join(ROOT_DIR, file), 'utf8'));
  }
  ok(`${jsonFiles.length} JSON файлов валидны`);
} catch (error) {
  fail(`JSON ошибка: ${error.message}`);
}

section('2. Data contracts');
run('npm run validate:data');

section('3. AI docs and index');
for (const file of [
  '.aiignore',
  'AI-CONTEXT.md',
  'docs/AI_FILE_OWNERSHIP.md',
  'docs/AI_TASK_RECIPES.md',
  'docs/PROJECT_DECISIONS.md',
  'data/ai-project-index.json',
  'data/ai-component-map.json',
  'docs/AI_PROJECT_KNOWLEDGE.md',
  'docs/AI_FLEXIBLE_EDITING.md',
  'docs/STATIC_COMPONENT_BUILDER.md',
  'docs/DECLARATIVE_COMPONENTS.md',
  'docs/SOURCE_COMPRESSION_PLAN.md',
  'docs/PARAMETERIZED_COMPONENTS.md',
  'docs/FAQ_REGISTRY.md',
  'content/faq/page-faq-registry.json',
  'reports/source-complexity.md',
  'reports/source-complexity.json',
  '.ai/digest/project.md',
  '.ai/digest/content-map.json',
  'src/site-builder.json',
]) {
  if (existsSync(join(ROOT_DIR, file))) ok(`${file} найден`);
  else fail(`${file} отсутствует`);
}
run('npm run check:ai-index');
run('npm run check:ai-component-map');
run('npm run check:site-builder');
run('npm run check:shared-components');
run('npm run check:parameterized-components');
run('npm run check:faq-registry');
run('npm run check:source-complexity');
run('npm run check:ai-digest');

section('4. Flexible AI workspace tools');
for (const file of [
  'tools/ai-workspace.mjs',
  'tools/ai-impact.mjs',
  'tools/ai-review.mjs',
  'tools/ai-semantic-diff.mjs',
  'tools/ai-semantic-lib.mjs',
  'tools/generate-ai-component-map.mjs',
  'tools/build-site.mjs',
  'tools/site-builder-bootstrap.mjs',
  'tools/site-builder-extract-shared.mjs',
  'tools/site-builder-parameterize-core.mjs',
  'tools/generate-faq-registry.mjs',
  'tools/site-builder-lib.mjs',
  'tools/source-compression-lib.mjs',
  'tools/analyze-source-complexity.mjs',
  'tools/generate-ai-digest.mjs',
]) {
  if (existsSync(join(ROOT_DIR, file))) ok(`${file} найден`);
  else fail(`${file} отсутствует`);
}

section('5. Page metadata coverage');
try {
  const metadata = JSON.parse(readFileSync(join(ROOT_DIR, 'data/page-metadata.json'), 'utf8'));
  const pages = Object.keys(metadata.pages || {}).sort();
  const missing = pages.filter((page) => !existsSync(join(ROOT_DIR, page)));
  if (missing.length) fail(`HTML отсутствуют для страниц: ${missing.join(', ')}`);
  else ok(`${pages.length} страниц из metadata существуют`);

  for (const [page, meta] of Object.entries(metadata.pages || {})) {
    if (!meta.title || meta.title.length < 10) warn(`${page}: короткий/пустой title`);
    if (!meta.description || meta.description.length < 40) warn(`${page}: короткий/пустой description`);
    if (meta.title && meta.title.length > 75) warn(`${page}: title длиннее 75 символов`);
    if (meta.description && meta.description.length > 170) warn(`${page}: description длиннее 170 символов`);
  }
} catch (error) {
  fail(`Не удалось проверить page-metadata.json: ${error.message}`);
}

section('6. Site validators');
run('npm run validate:site');
if (!fast) {
  run('npm run check:responsive-images');
  run('npm run check:webp-sidecars');
  run('npm run check:image-budget');
  run('npm run generate:deploy-manifest');
}

section('7. HTML size report');
try {
  const htmlFiles = listHtmlFiles();
  const large = [];
  for (const file of htmlFiles) {
    const sizeKB = getFileSize(file) / 1024;
    if (sizeKB > 180) large.push(`${file}: ${sizeKB.toFixed(1)} KB`);
  }
  if (large.length) warn(`Очень крупные HTML: ${large.join('; ')}`);
  else ok(`${htmlFiles.length} HTML страниц без критического размера`);
} catch (error) {
  warn(`Не удалось собрать size report: ${error.message}`);
}

section('8. Final report');
if (errorsList.length) {
  console.log('\nОшибки:');
  for (const item of errorsList) console.log(`- ${item}`);
}
if (warningsList.length) {
  console.log('\nПредупреждения:');
  for (const item of warningsList) console.log(`- ${item}`);
}

console.log(`\nИтог: ${errors} errors, ${warnings} warnings`);
if (errors === 0) {
  console.log('✅ Проект прошёл AI-проверку. Перед публикацией всё равно желателен короткий визуальный review ключевых страниц.');
} else {
  console.log('❌ Исправь ошибки выше и повтори npm run ai:check.');
}

process.exit(errors > 0 ? 1 : 0);
