#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { hashContent, renderPageFromModel } from './site-builder-lib.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const APPLY = process.argv.includes('--apply');

const kettlePages = [
  'pishevarochnyj-kotel-abat-kpem.html',
  'pishevarochnyj-kotel-suhoy-hod.html',
  'pishevarochnyj-kotel-techet.html',
  'pishevarochnyj-kotel-vybivaet-avtomat.html',
  'pishevarochnyj-kotel-kod-oshibki.html',
  'pishevarochnyj-kotel-ne-greet.html',
];

const combiPages = [
  'parokonvektomat-unox-af02-af08.html',
  'parokonvektomat-net-para.html',
  'parokonvektomat-e02-e07-e10.html',
  'parokonvektomat-rational-e9.html',
  'parokonvektomat-kod-oshibki.html',
  'parokonvektomat-ne-greet.html',
  'parokonvektomat-convotherm.html',
  'parokonvektomat-lainox.html',
  'parokonvektomat-rational.html',
  'parokonvektomat-unox.html',
  'parokonvektomat-electrolux.html',
];

const kettleHeadings = new Set([
  'Что фиксируем до начала работ',
  'Отдельные посадочные под Abat, КПЭМ, Apach, Atesy и Iterma',
  'Развели ошибки КПЭМ по отдельным сценариям',
  'Развели заявки по симптомам и узлам',
  'Что фиксируем до начала работ на объекте',
  'Если проблема в другом ресторанном оборудовании',
]);

const combiHeadings = new Set([
  'Какие метрики держим по заявке ресторана',
  'Ремонтируем все типы пароконвектоматов',
  'Факторы стоимости ремонта',
  'Типовые обращения по пароконвектоматам',
  'Частые поломки пароконвектоматов',
  'Почему рестораны обращаются в сервис',
  'Что фиксируем после диагностики',
  'Как проходит ремонт без лишнего хаоса для кухни',
  'Что получает кухня после ремонта',
  'Откладывать ремонт пароконвектомата обычно дороже',
  'Что фиксируем до начала работ на объекте',
  'Если проблема в другом ресторанном оборудовании',
]);

const kettleCopy = {
  oldHeading: 'Разводим трафик по реальному симптому',
  newHeading: 'Выберите ближайший симптом пищеварочного котла',
  oldIntro: 'Для Директа и SEO ведем пользователя не в общий текст, а в конкретный сценарий: нагрев, течь, электрика, код ошибки, H2O или Abat КПЭМ.',
  newIntro: 'Сравните проявление с соседними сценариями: нагрев, течь, электрика, код ошибки, H2O или особенности Abat КПЭМ. Так проще сразу открыть страницу по вашей ситуации.',
};

const combiPriceSection = {
  id: 'p2-pricing-kak-formiruyutsya-stoimost-i-srok-remonta',
  component: 'pricing',
  label: 'Как формируются стоимость и срок ремонта',
  bytes: 1953,
  hash: '10b13373c68636ab',
  componentRef: 'src/components/shared/pricing/pricing-kak-formiruyutsya-stoimost-i-srok-remonta--10b13373c68636ab.html',
  componentScope: 'shared',
  componentSignature: '10b13373c68636ab',
};

function textContent(fragment) {
  return fragment
    .replace(/<script\b[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function heading(fragment) {
  const match = fragment.match(/<h[1-3]\b[^>]*>([\s\S]*?)<\/h[1-3]>/i);
  return match ? textContent(match[1]) : '';
}

function topLevelSections(html) {
  const sections = [];
  let cursor = 0;
  while (cursor < html.length) {
    const start = html.indexOf('<section', cursor);
    if (start < 0) break;
    let depth = 0;
    let position = start;
    let closed = false;
    while (position < html.length) {
      const nextOpen = html.indexOf('<section', position);
      const nextClose = html.indexOf('</section>', position);
      if (nextClose < 0) throw new Error('Unclosed <section>');
      if (nextOpen >= 0 && nextOpen < nextClose) {
        depth += 1;
        position = nextOpen + 8;
      } else {
        depth -= 1;
        position = nextClose + 10;
        if (depth === 0) {
          sections.push({ start, end: position, html: html.slice(start, position) });
          cursor = position;
          closed = true;
          break;
        }
      }
    }
    if (!closed) throw new Error('Unable to parse top-level <section>');
  }
  return sections;
}

function pruneHtml(html, headings) {
  const sections = topLevelSections(html);
  const removed = [];
  let output = '';
  let cursor = 0;
  for (const section of sections) {
    output += html.slice(cursor, section.start);
    const sectionHeading = heading(section.html);
    if (headings.has(sectionHeading)) removed.push(sectionHeading);
    else output += section.html;
    cursor = section.end;
  }
  output += html.slice(cursor);
  return { html: output, removed };
}

function updatePage(page, headings, rewriteKettleCopy = false, ensureCombiPrice = false) {
  const slug = page.replace(/\.html$/, '');
  const modelPath = path.join(ROOT, 'src/pages', slug, 'page.json');
  const rootPath = path.join(ROOT, page);
  const model = JSON.parse(fs.readFileSync(modelPath, 'utf8'));
  const beforeCount = model.sections.length;
  const removedFiles = [];

  if (APPLY) {
    model.sections = model.sections.filter((section) => {
      if (!headings.has(section.label)) return true;
      if (section.file) {
        const localFile = path.join(path.dirname(modelPath), section.file);
        if (fs.existsSync(localFile)) {
          fs.unlinkSync(localFile);
          removedFiles.push(path.relative(ROOT, localFile));
        }
      }
      return false;
    });

    if (rewriteKettleCopy) {
      const section = model.sections.find((item) => item.label === kettleCopy.oldHeading || item.label === kettleCopy.newHeading);
      if (!section?.file) throw new Error(`${page}: kettle symptom navigator section missing`);
      const sectionPath = path.join(path.dirname(modelPath), section.file);
      const before = fs.readFileSync(sectionPath, 'utf8');
      const after = before
        .replace(kettleCopy.oldHeading, kettleCopy.newHeading)
        .replace(kettleCopy.oldIntro, kettleCopy.newIntro);
      if (before !== after) fs.writeFileSync(sectionPath, after, 'utf8');
      section.label = kettleCopy.newHeading;
      section.bytes = Buffer.byteLength(after);
      section.hash = hashContent(after).slice(0, 16);
    }

    if (ensureCombiPrice && !model.sections.some((section) => section.label === combiPriceSection.label)) {
      const insertAt = model.sections.findIndex((section) => section.label === 'Выберите проблему — уточним сценарий');
      model.sections.splice(insertAt >= 0 ? insertAt : model.sections.length, 0, { ...combiPriceSection });
    }

    fs.writeFileSync(modelPath, `${JSON.stringify(model, null, 2)}\n`);
  }

  const rootBefore = fs.readFileSync(rootPath, 'utf8');
  const pruned = pruneHtml(rootBefore, headings);
  let rootAfter = pruned.html;
  if (rewriteKettleCopy) {
    rootAfter = rootAfter
      .replace(kettleCopy.oldHeading, kettleCopy.newHeading)
      .replace(kettleCopy.oldIntro, kettleCopy.newIntro);
  }
  if (APPLY) rootAfter = renderPageFromModel(path.relative(ROOT, modelPath).replace(/\\/g, '/')).html;
  if (APPLY && rootAfter !== rootBefore) fs.writeFileSync(rootPath, rootAfter, 'utf8');

  const currentModel = APPLY ? model : JSON.parse(fs.readFileSync(modelPath, 'utf8'));
  const currentRoot = APPLY ? rootAfter : rootBefore;
  const modelRemaining = currentModel.sections.filter((section) => headings.has(section.label)).map((section) => section.label);
  const rootRemaining = [...headings].filter((value) => currentRoot.includes(`>${value}<`));
  const copyFailure = rewriteKettleCopy && (
    currentModel.sections.some((section) => section.label === kettleCopy.oldHeading)
    || currentRoot.includes(kettleCopy.oldHeading)
    || currentRoot.includes(kettleCopy.oldIntro)
  );
  const priceFailure = ensureCombiPrice && (
    currentModel.sections.filter((section) => section.label === combiPriceSection.label).length !== 1
    || !currentRoot.includes('id="prices"')
  );

  return {
    page,
    modelRemoved: Math.max(0, beforeCount - model.sections.length),
    modelAdded: Math.max(0, model.sections.length - beforeCount),
    outputRemoved: pruned.removed.length,
    removedFiles,
    modelRemaining,
    rootRemaining,
    copyFailure,
    priceFailure,
  };
}

const rows = [
  ...kettlePages.map((page) => updatePage(page, kettleHeadings, true)),
  ...combiPages.map((page) => updatePage(page, combiHeadings, false, true)),
];
const failures = rows.flatMap((row) => [
  ...row.modelRemaining.map((value) => `${row.page}: model still contains ${value}`),
  ...row.rootRemaining.map((value) => `${row.page}: output still contains ${value}`),
  ...(row.copyFailure ? [`${row.page}: internal kettle copy remains`] : []),
  ...(row.priceFailure ? [`${row.page}: #prices section is missing or duplicated`] : []),
]);

if (failures.length) {
  console.error(`❌ Restaurant content prune P2 failed (${failures.length})`);
  for (const failure of failures.slice(0, 30)) console.error(`- ${failure}`);
  if (failures.length > 30) console.error(`- …and ${failures.length - 30} more`);
  process.exit(1);
}

if (APPLY) {
  console.log(`✅ Restaurant content prune P2 applied: pages=${rows.length}, model removed=${rows.reduce((sum, row) => sum + row.modelRemoved, 0)}, model added=${rows.reduce((sum, row) => sum + row.modelAdded, 0)}, output removed=${rows.reduce((sum, row) => sum + row.outputRemoved, 0)}, local files=${rows.reduce((sum, row) => sum + row.removedFiles.length, 0)}`);
  console.log('Дальше: npm run site-builder:sync-manifest');
} else {
  console.log(`✅ Restaurant content prune P2 current: ${rows.length} pages, redundant sections=0`);
}
