#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith('--')) {
      result[key] = true;
      continue;
    }
    result[key] = next;
    index += 1;
  }
  return result;
}

function rel(filePath) {
  return path.relative(ROOT_DIR, filePath).replaceAll(path.sep, '/');
}

function walk(dir) {
  const result = [];
  if (!fs.existsSync(dir)) return result;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) result.push(...walk(fullPath));
    else result.push(fullPath);
  }
  return result;
}

function parseScreenshotName(filePath) {
  const base = path.basename(filePath);
  const match = base.match(/^(?<page>.+)\.(?<viewport>desktop|mobile|tablet|\w+)\.png$/i);
  if (!match?.groups) {
    return { page: base.replace(/\.png$/i, ''), viewport: 'unknown' };
  }
  return {
    page: `${match.groups.page}.html`,
    viewport: match.groups.viewport,
  };
}

function readJsonIfExists(filePath) {
  if (!fs.existsSync(filePath)) return null;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

const args = parseArgs(process.argv.slice(2));
const screenshotsDir = path.resolve(ROOT_DIR, String(args.screenshots || '.artifacts/screenshots/visual-smoke/latest'));
const outputDir = path.resolve(ROOT_DIR, String(args.output || 'reports/visual-ai-review/latest'));
const allowEmpty = Boolean(args['allow-empty']);

const pngFiles = walk(screenshotsDir)
  .filter((file) => file.toLowerCase().endsWith('.png'))
  .sort((a, b) => rel(a).localeCompare(rel(b)));

if (!pngFiles.length && !allowEmpty) {
  console.error(`No PNG screenshots found in ${rel(screenshotsDir)}.`);
  console.error('Run npm run visual:smoke:capture first, or pass --screenshots <dir>.');
  process.exit(1);
}

fs.mkdirSync(outputDir, { recursive: true });

const auditJson = readJsonIfExists(path.join(screenshotsDir, 'audit.json'));
const items = pngFiles.map((file, index) => {
  const parsed = parseScreenshotName(file);
  return {
    id: `shot-${String(index + 1).padStart(3, '0')}`,
    page: parsed.page,
    viewport: parsed.viewport,
    file: rel(file),
    status: 'todo',
    issues: [],
    notes: '',
  };
});

const reviewTemplate = {
  generatedAt: new Date().toISOString(),
  screenshotsDir: rel(screenshotsDir),
  rule: 'This file must be filled by the AI/human visual reviewer after looking at screenshots, not by static grep alone.',
  allowedStatus: ['pass', 'fail', 'needs-fix', 'not-reviewed'],
  finalStatus: 'not-reviewed',
  reviewer: 'AI visual reviewer',
  items,
  globalIssues: [],
  requiredRecheckAfterFix: true,
};

const checklist = [
  'Нет служебных/dev/AI слов: SEO-блок, hub/хаб, repair bridge, landing, B2B-посадочная, winner, Stage, P0/P1, handoff, rollback, generated, runtime, source of truth.',
  'Первый экран понятен обычному клиенту: что сломалось, кто чинит, куда нажать.',
  'На mobile 390/393 sticky CTA не перекрывает ключевой текст, форму и кнопки.',
  'Видимый телефон везде 8 (999) 005-71-72, клики ведут на tel:+79990057172.',
  'Нет визуальных нулей в proof/KPI: 0 ресторанов, 0 ремонтов, 0 лет и похожего.',
  'CTA звучат человечески, без внутренних ярлыков: “Отправить фото”, “Позвонить инженеру”, “Вызвать мастера”.',
  'Hub, brand, error и symptom страницы визуально/смыслово различаются, а не выглядят клонами.',
  'Форма читается, поля не обрезаны, placeholder/label не выглядят техническими.',
  'На desktop 1440 нет очевидных пустот, налезаний, сломанной сетки или слишком длинного hero.',
  'После любых правок screenshots нужно снять повторно и review должен стать pass только на повторном прогоне.',
];

const mdLines = [];
mdLines.push('# MosPochin — AI visual review pack');
mdLines.push('');
mdLines.push(`Generated: **${reviewTemplate.generatedAt}**`);
mdLines.push(`Screenshots dir: \`${reviewTemplate.screenshotsDir}\``);
mdLines.push('');
mdLines.push('## Правило');
mdLines.push('');
mdLines.push('Этот пакет предназначен для нейронки/ревьюера, который **смотрит изображения глазами**, а не только гоняет grep/check:core. Если найден визуальный или смысловой косяк, нужно внести правки, пересобрать проект, снова снять screenshots и повторить review.');
mdLines.push('');
mdLines.push('## Чеклист');
mdLines.push('');
for (const item of checklist) mdLines.push(`- [ ] ${item}`);
mdLines.push('');
mdLines.push('## Как заполнять результат');
mdLines.push('');
mdLines.push('1. Открой все PNG ниже.');
mdLines.push('2. Заполни `review.json`: у каждого screenshot поставь `pass`, `needs-fix` или `fail`, добавь issues.');
mdLines.push('3. Если были правки — не ставь finalStatus=pass до повторного screenshot-прогона.');
mdLines.push('4. Проверь результат командой `npm run check:ai-visual-review`.');
mdLines.push('');
mdLines.push('## Screenshots');
mdLines.push('');
if (!items.length) {
  mdLines.push('_Скриншоты не найдены. Сначала запусти `npm run visual:smoke:capture`._');
} else {
  for (const item of items) {
    const relativeFromOutput = path.relative(outputDir, path.join(ROOT_DIR, item.file)).replaceAll(path.sep, '/');
    mdLines.push(`### ${item.id}: ${item.page} / ${item.viewport}`);
    mdLines.push('');
    mdLines.push(`File: \`${item.file}\``);
    mdLines.push('');
    mdLines.push(`![${item.page} ${item.viewport}](${relativeFromOutput})`);
    mdLines.push('');
    mdLines.push('- Status: todo');
    mdLines.push('- Issues:');
    mdLines.push('');
  }
}

fs.writeFileSync(path.join(outputDir, 'AI_VISUAL_REVIEW.md'), `${mdLines.join('\n')}\n`, 'utf8');
fs.writeFileSync(path.join(outputDir, 'review.template.json'), `${JSON.stringify(reviewTemplate, null, 2)}\n`, 'utf8');
if (!fs.existsSync(path.join(outputDir, 'review.json'))) {
  fs.writeFileSync(path.join(outputDir, 'review.json'), `${JSON.stringify(reviewTemplate, null, 2)}\n`, 'utf8');
}

if (auditJson) {
  fs.writeFileSync(path.join(outputDir, 'audit-source.json'), `${JSON.stringify(auditJson, null, 2)}\n`, 'utf8');
}

console.log('# ai-visual-review-pack');
console.log(`screenshots=${items.length}`);
console.log(`output=${rel(outputDir)}`);
console.log(`review=${rel(path.join(outputDir, 'AI_VISUAL_REVIEW.md'))}`);
console.log(`template=${rel(path.join(outputDir, 'review.template.json'))}`);
