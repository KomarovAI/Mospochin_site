import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const manifestPath = path.join(root, 'data', 'ventilation-cluster-pages.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const forbiddenHeadings = new Set([
  'Что фиксируем до начала работ',
  'Что фиксируем до начала работ на объекте',
  'Если проблема в другом ресторанном оборудовании',
]);

function directSections(html) {
  const mainStart = html.indexOf('<main');
  const mainEnd = html.lastIndexOf('</main>');
  if (mainStart < 0 || mainEnd < 0) return [];
  const openEnd = html.indexOf('>', mainStart) + 1;
  const body = html.slice(openEnd, mainEnd);
  const sections = [];
  let cursor = 0;
  while (cursor < body.length) {
    const start = body.indexOf('<section', cursor);
    if (start < 0) break;
    let depth = 0;
    let pos = start;
    while (pos < body.length) {
      const nextOpen = body.indexOf('<section', pos);
      const nextClose = body.indexOf('</section>', pos);
      if (nextClose < 0) throw new Error('Unclosed <section>');
      if (nextOpen >= 0 && nextOpen < nextClose) {
        depth += 1;
        pos = nextOpen + 8;
      } else {
        depth -= 1;
        pos = nextClose + 10;
        if (depth === 0) {
          sections.push({ start, end: pos, html: body.slice(start, pos) });
          cursor = pos;
          break;
        }
      }
    }
  }
  return { mainStart, mainEnd, openEnd, body, sections };
}

function textContent(fragment) {
  return fragment
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function heading(fragment) {
  const match = fragment.match(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/i);
  return match ? textContent(match[1]) : '';
}

function shouldRemove(fragment) {
  const h = heading(fragment);
  if (forbiddenHeadings.has(h)) return true;

  const idMatch = fragment.match(/^<section\b[^>]*\bid=["']([^"']+)["']/i);
  const id = idMatch?.[1] || '';
  const formCount = (fragment.match(/<form\b/gi) || []).length;
  const hCount = (fragment.match(/<h[1-3]\b/gi) || []).length;
  const text = textContent(fragment);

  // Secondary generic request shell: one form, no heading, only "Оставить заявку".
  if (id === 'request' && formCount === 1 && hCount === 0) {
    return true;
  }
  return false;
}

function processHtml(html) {
  const parsed = directSections(html);
  if (!parsed.sections) return { html, removed: [] };
  const removed = [];
  let output = '';
  let cursor = 0;
  for (const section of parsed.sections) {
    output += parsed.body.slice(cursor, section.start);
    if (shouldRemove(section.html)) {
      removed.push(heading(section.html) || 'secondary-request-form');
    } else {
      output += section.html;
    }
    cursor = section.end;
  }
  output += parsed.body.slice(cursor);
  const rebuilt = html.slice(0, parsed.openEnd) + output + html.slice(parsed.mainEnd);
  return { html: rebuilt, removed };
}

const results = [];
for (const row of manifest.pages) {
  const page = row.page;
  const slug = page.replace(/\.html$/, '');
  const pageJsonPath = path.join(root, 'src', 'pages', slug, 'page.json');
  if (!fs.existsSync(pageJsonPath)) throw new Error(`Missing source model: ${page}`);
  const pageJson = JSON.parse(fs.readFileSync(pageJsonPath, 'utf8'));
  const candidate = pageJson.sections
    .filter((section) => section.file)
    .map((section) => ({ section, abs: path.join(root, 'src', 'pages', slug, section.file) }))
    .filter(({ abs }) => fs.existsSync(abs))
    .sort((a, b) => fs.statSync(b.abs).size - fs.statSync(a.abs).size)[0];
  if (!candidate) throw new Error(`No editable main fragment: ${page}`);

  const before = fs.readFileSync(candidate.abs, 'utf8');
  const processed = processHtml(before);
  if (processed.removed.length) fs.writeFileSync(candidate.abs, processed.html, 'utf8');

  const rootPagePath = path.join(root, page);
  const rootBefore = fs.readFileSync(rootPagePath, 'utf8');
  const rootProcessed = processHtml(rootBefore);
  if (rootProcessed.removed.length) fs.writeFileSync(rootPagePath, rootProcessed.html, 'utf8');

  results.push({
    page,
    sourceFile: path.relative(root, candidate.abs),
    removed: [...processed.removed, ...rootProcessed.removed],
  });
}

const changed = results.filter((row) => row.removed.length);
const report = {
  schemaVersion: 1,
  release: 'VENTILATION_TEMPLATE_DEDUP_R3',
  pagesTotal: results.length,
  pagesChanged: changed.length,
  sectionsRemoved: changed.reduce((sum, row) => sum + row.removed.length, 0),
  rules: {
    keep: ['unique technical content', 'one process', 'one related block', 'one FAQ', 'one primary form'],
    remove: ['secondary generic form', ...forbiddenHeadings],
  },
  pages: results,
};
fs.writeFileSync(path.join(root, 'data', 'ventilation-template-dedup-r3.json'), `${JSON.stringify(report, null, 2)}\n`);
console.log(`Ventilation R3 applied: pages=${results.length}, changed=${changed.length}, removed=${report.sectionsRemoved}`);
