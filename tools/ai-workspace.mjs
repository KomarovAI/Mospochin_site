#!/usr/bin/env node
import { parseArgs } from './ai-maintenance-lib.mjs';
import { classifyFile, componentsForFile, guessComponentsFromTask, guessPagesFromTask, loadAiIndexSafe, loadComponentMapSafe } from './ai-semantic-lib.mjs';

const args = parseArgs();
const task = args.task || args.query || args._?.join(' ') || '';
const explicitPage = args.page;
const index = loadAiIndexSafe();
const componentMap = loadComponentMapSafe();

function printHelp() {
  console.log(`\n# AI Workspace\n\nСобирает гибкий рабочий контекст под задачу без ограничения способа правки.\n\nИспользование:\n  npm run ai:workspace -- --task "переделать hero на странице ремонта холодильников"\n  npm run ai:workspace -- --page holodilniki.html --task "улучшить форму"\n`);
}

if (!task && !explicitPage) {
  printHelp();
  process.exit(0);
}

const candidatePages = [];
if (explicitPage && index?.pages?.[explicitPage]) candidatePages.push(index.pages[explicitPage]);
for (const page of guessPagesFromTask(task, index, 10)) {
  if (!candidatePages.some((item) => item.page === page.page)) candidatePages.push(page);
}

const candidateComponents = guessComponentsFromTask(task, componentMap);
const files = new Set(['.ai/digest/project.md', '.ai/digest/content-map.json']);
const checks = new Set(['npm run ai:check -- --fast']);
const risks = [];

for (const page of candidatePages.slice(0, 3)) {
  files.add(page.page);
  files.add(`.ai/digest/pages/${page.page.replace(/\.html$/i, '')}.md`);
  for (const source of page.sources || []) files.add(source);
  if (page.siteBuilder) {
    files.add('src/site-builder.json');
    files.add(page.siteBuilder.model);
    files.add(`src/pages/${page.siteBuilder.slug}/sections/`);
    files.add('src/components/shared/');
    checks.add('npm run check:site-builder');
    checks.add('npm run check:shared-components');
    risks.push(`[${page.page}] Страница подключена к Static Component Builder: root HTML должен совпадать с src/pages/${page.siteBuilder.slug}.`);
  }
  for (const check of page.recommendedChecks || []) checks.add(check);
  checks.add(`npm run ai:semantic-diff -- --page ${page.page}`);
}

for (const component of candidateComponents) {
  files.add(`.ai/digest/components/${component.id}.md`);
  for (const file of component.relatedFiles || []) files.add(file);
  // Не добавляем все страницы компонента, если задача уже привязана к конкретным страницам:
  // иначе workspace превращается в шум. Component map остаётся подсказкой, а не коридором.
  if (!candidatePages.length) {
    for (const page of (component.appearsIn || []).slice(0, 6)) files.add(page);
  }
  for (const risk of component.risks || []) risks.push(`[${component.id}] ${risk}`);
}

const taskLower = String(task).toLowerCase();
if (/builder|component|компонент|секци|шаблон|template|partials|генератор|сборк/.test(taskLower)) {
  files.add('src/site-builder.json');
  files.add('src/components/shared/');
  files.add('tools/build-site.mjs');
  files.add('tools/site-builder-lib.mjs');
  files.add('tools/site-builder-extract-shared.mjs');
  files.add('docs/STATIC_COMPONENT_BUILDER.md');
  files.add('docs/DECLARATIVE_COMPONENTS.md');
  checks.add('npm run check:site-builder');
  checks.add('npm run check:shared-components');
  risks.push('Задача про build/component layer: не смешивай root HTML и src/pages без проверки check:site-builder.');
}
if (/css|стил|визуал|дизайн|layout|адаптив|mobile|мобил/.test(taskLower)) {
  files.add('styles-combined.css');
  risks.push('Визуальная/CSS-задача: глобальный CSS может затронуть все страницы.');
}
if (/js|скрипт|форма|telegram|таймер|меню|модал/.test(taskLower)) {
  files.add('main.js');
}
if (/форма|telegram|телеграм|заявк|phone|телефон/.test(taskLower)) {
  files.add('telegram-form.js');
  files.add('server/telegram-api.mjs');
}
if (/картин|изображ|фото|webp|srcset|hero image/.test(taskLower)) {
  files.add('tools/generate-responsive-images.mjs');
  files.add('assets/images/');
  checks.add('npm run check:responsive-images');
  checks.add('npm run check:webp-sidecars');
}
if (/seo|title|description|canonical|schema|json-ld|мета/.test(taskLower)) {
  files.add('data/page-metadata.json');
  files.add('data/schema-profile.json');
  checks.add('npm run validate:data');
  checks.add('npm run validate:site');
}

for (const file of files) {
  const info = classifyFile(file, index);
  for (const check of info.recommendedChecks) checks.add(check);
  for (const note of info.notes) risks.push(`[${file}] ${note}`);
}

console.log('\n# AI Workspace Snapshot\n');
console.log(`Задача: ${task || '(не указана)'}`);

console.log('\n## Вероятные страницы');
if (candidatePages.length) {
  for (const page of candidatePages.slice(0, 10)) {
    console.log(`- ${page.page} [${page.branch}/${page.role}] — ${page.title || page.h1 || ''}`);
  }
} else {
  console.log('- Не определены автоматически. Используй --page или ai:context -- --query "...".');
}

console.log('\n## Вероятные компоненты');
if (candidateComponents.length) {
  for (const component of candidateComponents) {
    console.log(`- ${component.id}: ${component.name} (${component.appearsInCount || 0} страниц)`);
  }
} else {
  console.log('- Не определены по ключевым словам; можно редактировать свободно, но затем запустить ai:review.');
}

console.log('\n## Файлы, которые стоит открыть первыми');
if (files.size) {
  for (const file of [...files].slice(0, 30)) console.log(`- ${file}`);
} else {
  console.log('- docs/AI_START_HERE.md');
  console.log('- data/project-map.generated.json');
  console.log('- data/file-ownership.json');
  console.log('- data/ai-component-map.json');
}

console.log('\n## Риски и guardrails');
const uniqueRisks = [...new Set(risks)].slice(0, 18);
if (uniqueRisks.length) for (const risk of uniqueRisks) console.log(`- ${risk}`);
else console.log('- Рисков не выявлено автоматически; после правок запусти ai:review и ai:check.');

console.log('\n## Проверки после гибкой правки');
for (const check of checks) console.log(`- ${check}`);

console.log('\n## Рабочий цикл');
console.log('1. Открой файлы из списка выше и редактируй гибко по задаче.');
console.log('2. После правок: npm run ai:review');
console.log('3. Для изменённых HTML: npm run ai:semantic-diff -- --page <file.html>');
console.log('4. Финально: npm run ai:check');
