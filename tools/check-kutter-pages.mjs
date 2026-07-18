#!/usr/bin/env node
import fs from 'node:fs';
import { load, taxonomy, evidenceMap, failIf } from './kutter-fault-lib.mjs';

const cluster = load('kutter-cluster-pages.json');
const symptoms = load('kutter-symptom-pages.json').pages || [];
const tax = taxonomy();
const ev = evidenceMap();
const metadata = load('page-metadata.json').pages || {};
const builder = JSON.parse(fs.readFileSync('src/site-builder.json', 'utf8'));
const registered = new Set((builder.pages || []).map((x) => x.page));
const errors = [];
const pages = cluster.pages || [];
const seen = new Set();

if (!['planned', 'pilot', 'active'].includes(cluster.status)) errors.push(`unsupported cluster status ${cluster.status}`);
if (pages.length !== 45) errors.push(`expected 45 cluster pages, got ${pages.length}`);
const published = pages.filter((p) => p.status === 'published');
const planned = pages.filter((p) => p.status === 'planned');
if (cluster.status === 'pilot' && published.length < 8) errors.push(`pilot requires >=8 published pages, got ${published.length}`);

for (const p of pages) {
  if (!p.page || seen.has(p.page)) errors.push(`duplicate/missing page ${p.page}`);
  seen.add(p.page);
  if (!['planned', 'published'].includes(p.status)) errors.push(`${p.page}: invalid status ${p.status}`);
  const exists = fs.existsSync(p.page);
  const model = fs.existsSync(`src/pages/${p.page.replace(/\.html$/, '')}/page.json`);
  if (p.status === 'published') {
    if (!exists) errors.push(`${p.page}: published root HTML missing`);
    if (!model) errors.push(`${p.page}: published source model missing`);
    if (!registered.has(p.page)) errors.push(`${p.page}: absent from builder manifest`);
    if (!metadata[p.page]) errors.push(`${p.page}: metadata missing`);
  } else {
    if (exists) errors.push(`${p.page}: planned page unexpectedly exists`);
    if (model) errors.push(`${p.page}: planned source model unexpectedly exists`);
  }
}

if (symptoms.length !== tax.length) errors.push('symptom page registry/taxonomy count mismatch');
for (const s of symptoms) {
  if (!seen.has(s.page)) errors.push(`${s.page}: absent from cluster manifest`);
  const t = tax.find((x) => x.symptomId === s.symptomId);
  if (!t) errors.push(`${s.page}: missing taxonomy`);
  if (s.status !== t?.status) errors.push(`${s.page}: registry/taxonomy status mismatch`);
}

for (const rel of [
  'src/components/parametric/kutter-hub/blueprint.json',
  'src/components/parametric/kutter-service/blueprint.json',
  'src/components/parametric/kutter-symptom-service/blueprint.json',
  'src/components/parametric/kutter-brand-service/blueprint.json',
]) if (!fs.existsSync(rel)) errors.push(`missing blueprint ${rel}`);

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

for (const p of published) {
  const html = fs.readFileSync(p.page, 'utf8');
  if ((html.match(/<h1\b/gi) || []).length !== 1) errors.push(`${p.page}: exactly one H1 required`);
  if (!html.includes(`https://mospochin.ru/${p.page}`)) errors.push(`${p.page}: canonical URL missing`);
  if (!/src=["']analytics\.js["']/.test(html)) errors.push(`${p.page}: analytics.js missing`);
  if (!/src=["']telegram-form\.js["']/.test(html)) errors.push(`${p.page}: telegram-form.js missing`);
  if (!/class=["'][^"']*telegram-form/.test(html)) errors.push(`${p.page}: lead form missing`);
  if (!/name=["']problem["']/.test(html) || !/name=["']phone["']/.test(html)) errors.push(`${p.page}: required form fields missing`);
  if (!/href=["']tel:/.test(html) || !/wa\.me\//.test(html)) errors.push(`${p.page}: contact CTAs missing`);
  if (!/id=["']mobile-footer-container["']/.test(html) || !/id=["']whatsapp-float-container["']/.test(html)) errors.push(`${p.page}: mobile contact mounts missing`);
  if (/"@type"\s*:\s*"FAQPage"/.test(html)) errors.push(`${p.page}: retired FAQPage schema must be absent`);
  if ((html.match(/<details\b/gi) || []).length < 2) errors.push(`${p.page}: at least two visible FAQ items required`);
  if (!/"@type"\s*:\s*"BreadcrumbList"/.test(html)) errors.push(`${p.page}: BreadcrumbList missing`);
  if (p.pageType === 'cluster_hub' && !/CollectionPage/.test(html)) errors.push(`${p.page}: CollectionPage missing`);
  if (p.pageType === 'informational_article' && !/"@type"\s*:\s*"Article"/.test(html)) errors.push(`${p.page}: Article missing`);
  if (['commercial_service', 'symptom_service', 'brand_service'].includes(p.pageType) && !/"@type"\s*:\s*"Service"/.test(html)) errors.push(`${p.page}: Service schema missing`);
  const tracked = (html.match(/data-cta-group=["']internal_link["']/g) || []).length;
  if (tracked < (p.minClusterLinks || 3)) errors.push(`${p.page}: tracked cluster links ${tracked} < ${p.minClusterLinks || 3}`);
  const visibleEvidenceIds = [...html.matchAll(/data-evidence-id=["']([^"']+)["']/g)].map((match) => match[1]);
  for (const id of visibleEvidenceIds) if (!ev.has(id)) errors.push(`${p.page}: visible evidence id is not registered: ${id}`);

  if (p.pageType === 'symptom_service') {
    const t = tax.find((x) => x.symptomId === p.intent);
    for (const token of ['Проверка без вскрытия', 'Дерево решений', 'Матрица причин', 'Сервисная диагностика', 'На каких официальных материалах']) {
      if (!html.includes(token)) errors.push(`${p.page}: required symptom block missing: ${token}`);
    }
    for (const field of ['equipment_model', 'error_code', 'problem', 'phone']) {
      if (!new RegExp(`name=["']${field}["']`).test(html)) errors.push(`${p.page}: field ${field} missing`);
    }
    for (const id of t?.sourceEvidenceIds || []) {
      if (!ev.has(id)) errors.push(`${p.page}: unknown evidence ${id}`);
      if (!html.includes(`data-evidence-id="${id}"`)) errors.push(`${p.page}: evidence ${id} not visible`);
    }
    for (const internal of t?.probableNodes || []) {
      if (new RegExp(`>[^<]*${escapeRegex(internal)}[^<]*<`, 'i').test(html)) errors.push(`${p.page}: internal node id leaked: ${internal}`);
    }
  }
}

failIf(errors, `Kutter pages passed: ${published.length} published, ${planned.length} planned, builder=${registered.size}`);
