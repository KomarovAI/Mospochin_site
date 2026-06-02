#!/usr/bin/env node
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';
import { buildAiIndex, parseArgs, ROOT_DIR } from './ai-maintenance-lib.mjs';
import { validateDataContracts } from './data-contract-lib.mjs';

const args = parseArgs();
const indexPath = join(ROOT_DIR, 'data', 'ai-project-index.json');
const index = existsSync(indexPath)
  ? JSON.parse(readFileSync(indexPath, 'utf8'))
  : buildAiIndex();

function printHelp() {
  console.log(`\n🤖 AI Context\n\nИспользование:\n  npm run ai:context -- --page holodilniki.html\n  npm run ai:context -- --query "ремонт холодильников"\n  npm run ai:context -- --summary\n`);
}

function pageSummary(page) {
  const p = index.pages[page];
  if (!p) {
    console.error(`❌ Страница не найдена в AI index: ${page}`);
    console.error('Подсказка: npm run ai:context -- --query "часть названия"');
    process.exit(1);
  }

  console.log(`\n# AI context: ${p.page}`);
  console.log(`\nВетка: ${p.branch}`);
  console.log(`Роль: ${p.role}`);
  console.log(`HTML существует: ${p.htmlExists ? 'да' : 'нет'}`);
  console.log(`Форма: ${p.hasForm ? 'есть' : 'нет'}`);
  console.log(`Title: ${p.title || '—'}`);
  console.log(`Description: ${p.description || '—'}`);
  if (p.h1) console.log(`H1: ${p.h1}`);
  if (p.canonical) console.log(`Canonical: ${p.canonical}`);


  if (p.siteBuilder) {
    console.log('\n## Static Component Builder');
    console.log(`Status: ${p.siteBuilder.status}`);
    console.log(`Model: ${p.siteBuilder.model}`);
    console.log(`Sections: ${p.siteBuilder.sections}`);
    console.log(`Preview: ${p.siteBuilder.commands.preview}`);
    console.log(`Write: ${p.siteBuilder.commands.write}`);
    console.log(`Check: ${p.siteBuilder.commands.check}`);
  }

  if (p.service) {
    console.log('\n## Service');
    console.log(`Slug: ${p.service.slug || '—'}`);
    console.log(`UI label: ${p.service.uiLabel || '—'}`);
    console.log(`Device: ${p.service.deviceName || '—'}`);
    console.log(`Service name: ${p.service.serviceName || '—'}`);
    if (p.service.relatedPages?.length) console.log(`Related: ${p.service.relatedPages.join(', ')}`);
    if (p.service.sectionIds?.length) console.log(`Sections: ${p.service.sectionIds.join(', ')}`);
  }

  console.log('\n## Источники правки');
  for (const source of p.sources) console.log(`- ${source}`);

  console.log('\n## Что обычно не менять вручную');
  console.log('- responsive/WebP derivatives: генерировать командами');
  console.log('- sitemap.xml: npm run generate:sitemap');
  console.log('- .deploy/include-files.txt: npm run generate:deploy-manifest');

  const dataReport = validateDataContracts({ page: p.page });
  console.log('\n## Data contracts по странице');
  if (!dataReport.errors.length && !dataReport.warnings.length) {
    console.log('OK: ошибок и предупреждений по этой странице нет');
  } else {
    for (const item of dataReport.errors) console.log(`ERROR [${item.file}] ${item.message}`);
    for (const item of dataReport.warnings) console.log(`WARN [${item.file}] ${item.message}`);
  }

  console.log('\n## Рекомендуемые проверки');
  for (const check of p.recommendedChecks) console.log(`- ${check}`);
  console.log('- npm run validate:data');
  console.log('- npm run ai:changed');
  console.log('- npm run ai:digest');
  console.log('- npm run check:ai-digest');
  console.log('- npm run ai:check');
}

function queryPages(query) {
  const q = query.toLowerCase();
  const matches = Object.values(index.pages)
    .map((p) => {
      const haystack = [
        p.page,
        p.branch,
        p.role,
        p.title,
        p.description,
        p.h1,
        p.service?.uiLabel,
        p.service?.deviceName,
        p.service?.serviceName,
        ...(p.service?.relatedPages || []),
      ].filter(Boolean).join(' ').toLowerCase();
      let score = 0;
      if (p.page.toLowerCase().includes(q)) score += 5;
      if ((p.title || '').toLowerCase().includes(q)) score += 4;
      if ((p.description || '').toLowerCase().includes(q)) score += 2;
      if ((p.service?.serviceName || '').toLowerCase().includes(q)) score += 4;
      if (haystack.includes(q)) score += 1;
      return { p, score };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.p.page.localeCompare(b.p.page))
    .slice(0, 12);

  if (!matches.length) {
    console.log(`\nНичего не найдено по запросу: ${query}`);
    console.log('Попробуй более короткий запрос: "холодиль", "пароконвект", "контакт".');
    return;
  }

  console.log(`\n# Найдено по запросу: ${query}\n`);
  for (const { p, score } of matches) {
    console.log(`- ${p.page} [${p.branch}/${p.role}, score=${score}]`);
    console.log(`  ${p.title || p.service?.serviceName || ''}`.trimEnd());
  }
  console.log('\nОткрой конкретную страницу: npm run ai:context -- --page <file.html>');
}

function printSummary() {
  console.log('\n# AI project summary');
  console.log(`Pages: ${index.summary.totalPages}`);
  console.log(`Branches: ${JSON.stringify(index.summary.byBranch)}`);
  console.log(`Roles: ${JSON.stringify(index.summary.byRole)}`);
  console.log('\nPrimary files:');
  for (const [key, value] of Object.entries(index.sourceOfTruth)) console.log(`- ${key}: ${value}`);
  console.log('\nDocs:');
  console.log('- AI-CONTEXT.md');
  console.log('- docs/AI_FILE_OWNERSHIP.md');
  console.log('- docs/AI_TASK_RECIPES.md');
  console.log('- docs/PROJECT_DECISIONS.md');
  console.log('- docs/DATA_CONTRACTS.md');
  console.log('- docs/STATIC_COMPONENT_BUILDER.md');
  console.log('\nValidation:');
  console.log('- npm run validate:data');
  console.log('- npm run check:site-builder');
  console.log('- npm run ai:digest');
  console.log('- npm run check:ai-digest');
  console.log('- npm run ai:check');
}

if (args.page) pageSummary(args.page);
else if (args.query) queryPages(args.query);
else if (args.summary) printSummary();
else printHelp();
