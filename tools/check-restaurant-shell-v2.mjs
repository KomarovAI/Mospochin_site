import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT_DIR } from './ai-maintenance-lib.mjs';

const branch = JSON.parse(readFileSync(join(ROOT_DIR, 'data/restaurant-branch.json'), 'utf8'));
const metadata = JSON.parse(readFileSync(join(ROOT_DIR, 'data/page-metadata.json'), 'utf8'));
const requiredTargets = [
  'uslugi.html',
  ...branch.navigationGroups.flatMap((group) => group.items.map((item) => item.href)),
  ...branch.footerGroups.flatMap((group) => group.items.map((item) => item.href)),
];
const errors = [];

for (const target of new Set(requiredTargets)) {
  if (!existsSync(join(ROOT_DIR, target))) errors.push(`missing navigation target: ${target}`);
}

const pages = Object.entries(metadata.pages || {})
  .filter(([, value]) => value?.branch !== 'household')
  .map(([page]) => page)
  .filter((page) => page.endsWith('.html') && page !== '404.html');

for (const page of pages) {
  const html = readFileSync(join(ROOT_DIR, page), 'utf8');
  if (!/<nav(?=[^>]*\bid=["']navbar["'])(?=[^>]*\baria-label=["']Основная навигация["'])[^>]*>/i.test(html)) {
    errors.push(`${page}: missing labelled primary navigation`);
  }
  if (!/<footer\b/i.test(html)) errors.push(`${page}: missing footer landmark`);
  if (/class=["'][^"']*branch-switcher/i.test(html)) errors.push(`${page}: legacy floating branch switcher remains`);
  if (!html.includes('Каталог ремонта ресторанного оборудования')) errors.push(`${page}: missing catalog link in desktop menu`);
  if (!html.includes('Профессиональные куттеры') || !html.includes('Оборудование sous-vide')) {
    errors.push(`${page}: extended restaurant categories are incomplete`);
  }
  if (html.includes('Котел не греет</a></li>') || html.includes('Котел не держит давление</a></li>')) {
    errors.push(`${page}: symptom links still pollute global footer`);
  }
  if (html.includes('<h5 class="text-white font-bold mb-4">Бытовая техника</h5>')) {
    errors.push(`${page}: full household catalog still appears in restaurant footer`);
  }
  const footerStart = html.indexOf('<footer');
  const footerEnd = html.indexOf('</footer>', footerStart);
  const footer = footerStart >= 0 && footerEnd > footerStart ? html.slice(footerStart, footerEnd) : '';
  const footerLinks = (footer.match(/<a\b/g) || []).length;
  if (footerLinks > 18) errors.push(`${page}: footer has ${footerLinks} links (limit 18)`);
  if (!footer.includes('Написать в WhatsApp') || !footer.includes('mailto:')) {
    errors.push(`${page}: footer contact routes incomplete`);
  }
}

if (errors.length) {
  console.error(`❌ Restaurant shell v2: ${errors.length} issue(s)`);
  for (const error of errors.slice(0, 80)) console.error(` - ${error}`);
  process.exit(1);
}

console.log(`✅ Restaurant shell v2: ${pages.length} restaurant pages, ${new Set(requiredTargets).size} configured targets, compact footer contract passed`);
