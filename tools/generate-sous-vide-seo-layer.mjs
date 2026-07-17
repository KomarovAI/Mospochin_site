#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const check = process.argv.includes('--check');
const taxonomyDoc = JSON.parse(fs.readFileSync(path.join(root, 'data/sous-vide-fault-taxonomy.json'), 'utf8'));
const registry = JSON.parse(fs.readFileSync(path.join(root, 'data/sous-vide-symptom-pages.json'), 'utf8'));
const graph = JSON.parse(fs.readFileSync(path.join(root, 'data/sous-vide-link-graph.json'), 'utf8'));
const taxonomy = new Map(taxonomyDoc.symptoms.map((item) => [item.symptomId, item]));
const published = registry.pages.filter((item) => item.status === 'published');
const pageBySymptom = new Map(published.map((item) => [item.symptomId, item.page]));
let errors = 0;
let writes = 0;

function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}
function slug(page) { return page.replace(/\.html$/, ''); }
function ctaId(sourcePage, targetPage, index) {
  return `${slug(sourcePage)}_internal_${slug(targetPage)}_${String(index).padStart(2, '0')}`;
}
function card(sourcePage, targetPage, label, description, index) {
  return `<a class="block rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-brand-orange" href="${esc(targetPage)}" data-cta-id="${esc(ctaId(sourcePage, targetPage, index))}" data-cta-group="internal_link" data-block="related_cluster"><span class="font-display text-lg font-extrabold text-brand-blue">${esc(label)}</span><span class="mt-2 block text-sm leading-relaxed text-slate-600">${esc(description)}</span></a>`;
}
function writeExpected(file, expected) {
  const full = path.join(root, file);
  const actual = fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : '';
  if (actual === expected) return;
  if (check) {
    console.error(`STALE: ${file}`);
    errors += 1;
    return;
  }
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, expected);
  console.log(`WRITE: ${file}`);
  writes += 1;
}
function symptomSection(entry) {
  const sourcePage = entry.page;
  const item = taxonomy.get(entry.symptomId);
  if (!item) throw new Error(`Missing taxonomy: ${entry.symptomId}`);
  const family = graph.equipmentFamilies[item.equipmentFamily];
  if (!family) throw new Error(`Missing equipment family: ${item.equipmentFamily}`);
  const cards = [
    { target: graph.hubPage, label: 'Sous-vide для ресторанов', description: 'Карта оборудования, технологических материалов и диагностических сценариев.' },
    { target: family.overviewPage, label: family.overviewLabel, description: family.overviewDescription },
    { target: family.repairPage, label: family.repairLabel, description: family.repairDescription },
  ];
  for (const relatedId of item.relatedSymptoms || []) {
    const related = taxonomy.get(relatedId);
    const target = pageBySymptom.get(relatedId);
    if (!related || !target) throw new Error(`${entry.symptomId}: unresolved related symptom ${relatedId}`);
    cards.push({
      target,
      label: related.label,
      description: related.userSymptoms?.[0] || `Отдельный маршрут диагностики: ${related.label}.`,
    });
  }
  for (const extra of graph.contextualGuideLinks?.[entry.symptomId] || []) cards.push(extra);
  const body = cards.map((item, index) => card(sourcePage, item.target, item.label, item.description, index + 1)).join('');
  return `<section class="bg-white py-16 lg:py-20"><div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><p class="text-sm font-extrabold uppercase tracking-[0.2em] text-brand-orange">Связанные материалы</p><h2 class="mt-3 text-3xl font-display font-extrabold text-brand-blue">Следующий шаг диагностики</h2><p class="mt-4 max-w-3xl text-base leading-relaxed text-slate-600">Ссылки подобраны по тому же типу оборудования и близкому техническому контуру — без случайного смешивания термостатов и вакууматоров.</p><div class="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">${body}</div></div></section>`;
}
function repairSection(entry) {
  const item = taxonomy.get(entry.symptomId);
  const labels = item.probableNodeLabels || [];
  const descriptions = item.probableNodeDescriptions || [];
  if (labels.length !== descriptions.length || labels.length !== (item.probableNodes || []).length) {
    throw new Error(`${entry.symptomId}: probable node labels/descriptions mismatch`);
  }
  const articles = labels.map((label, index) => `<article class="rounded-2xl border border-slate-200 bg-white p-5"><i class="ri-tools-line text-2xl text-brand-orange"></i><h3 class="mt-3 font-display text-lg font-extrabold text-brand-blue">${esc(label)}</h3><p class="mt-2 text-sm leading-relaxed text-slate-600">${esc(descriptions[index])}</p></article>`).join('');
  return `<section class="bg-slate-50 py-16 lg:py-20"><div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><p class="text-sm font-extrabold uppercase tracking-[0.2em] text-brand-orange">Диагностический контур</p><h2 class="mt-3 text-3xl font-display font-extrabold text-brand-blue">Что проверяется в этом сценарии</h2><div class="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">${articles}</div></div></section>`;
}
function hubSymptomSection() {
  const sourcePage = graph.hubPage;
  const groups = [];
  for (const [familyId, family] of Object.entries(graph.equipmentFamilies)) {
    const familyPages = published
      .map((entry) => ({ entry, item: taxonomy.get(entry.symptomId) }))
      .filter(({ item }) => item?.equipmentFamily === familyId)
      .sort((a, b) => a.item.label.localeCompare(b.item.label, 'ru'));
    const cards = familyPages.map(({ entry, item }, index) => card(
      sourcePage,
      entry.page,
      item.label,
      item.userSymptoms?.[0] || `Диагностический маршрут: ${item.label}.`,
      index + 1 + groups.reduce((sum, group) => sum + group.count, 0),
    )).join('');
    groups.push({
      count: familyPages.length,
      html: `<div class="mt-10"><h3 class="text-2xl font-display font-extrabold text-brand-blue">${esc(family.label)}</h3><p class="mt-3 max-w-3xl leading-relaxed text-slate-600">Выберите наблюдаемый симптом — каждая страница использует отдельное дерево причин и собственный сервисный маршрут.</p><div class="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">${cards}</div></div>`,
    });
  }
  return `<section id="symptom-diagnostics" class="bg-slate-50 py-16 lg:py-20"><div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8"><p class="text-sm font-extrabold uppercase tracking-[0.2em] text-brand-orange">Диагностика по симптомам</p><h2 class="mt-3 text-3xl font-display font-extrabold text-brand-blue">Что именно происходит с оборудованием</h2><p class="mt-4 max-w-3xl text-lg leading-relaxed text-slate-600">Сначала выберите тип оборудования, затем точный симптом. Так страницы нагрева, циркуляции, вакуума, насоса и запайки не конкурируют друг с другом и не смешивают разные ремонтные контуры.</p>${groups.map((group) => group.html).join('')}</div></section>`;
}

for (const entry of published) {
  const pageSlug = slug(entry.page);
  writeExpected(`src/pages/${pageSlug}/sections/100-related-symptoms.html`, symptomSection(entry));
  writeExpected(`src/pages/${pageSlug}/sections/070-repair-scope.html`, repairSection(entry));
}

const hubFile = path.join(root, graph.hubSectionFile);
let hub = fs.readFileSync(hubFile, 'utf8');
const expectedHubSection = hubSymptomSection();
const hubPattern = /<section id="symptom-diagnostics"[\s\S]*?<\/section>/;
if (!hubPattern.test(hub)) throw new Error('Hub symptom section not found');
const replaced = hub.replace(hubPattern, expectedHubSection);
let renamed = replaced;
renamed = renamed.replace('>Связанные страницы sous-vide</h2>', '>Основные маршруты sous-vide</h2>');
renamed = renamed.replace('>Связанные страницы sous-vide</h2>', '>Оборудование, сервис и технология</h2>');
writeExpected(graph.hubSectionFile, renamed);

if (errors) process.exit(1);
console.log(check ? 'Sous-vide SEO layer is current' : `Sous-vide SEO layer generated: ${writes} files`);
