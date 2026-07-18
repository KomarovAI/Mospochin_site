#!/usr/bin/env node
import fs from 'node:fs';
import { load, evidenceMap, failIf } from './kutter-fault-lib.mjs';

const cluster = load('kutter-cluster-pages.json');
const brands = load('kutter-brand-models.json').brands || [];
const metrics = load('metrics-page-context.json').pages || {};
const evidence = evidenceMap();
const errors = [];
const expected = new Map([
  ['robot-coupe', { page: 'remont-kutterov-robot-coupe.html', label: 'Robot Coupe', metric: 'robot_coupe' }],
  ['sammic', { page: 'remont-kutterov-sammic.html', label: 'Sammic', metric: 'sammic' }],
  ['hallde', { page: 'remont-kutterov-hallde.html', label: 'HALLDE', metric: 'hallde' }],
  ['sirman', { page: 'remont-kutterov-sirman.html', label: 'Sirman', metric: 'sirman' }],
]);
const clusterByPage = new Map((cluster.pages || []).map((row) => [row.page, row]));
const faqQuestions = new Map();

function attr(tag, name) {
  return tag.match(new RegExp(`\\s${name}=["']([^"']*)["']`, 'i'))?.[1] || '';
}
function visibleText(html) {
  return html.replace(/<script\b[\s\S]*?<\/script>/gi, ' ').replace(/<style\b[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

for (const brand of brands) {
  const exp = expected.get(brand.brandId);
  if (!exp) continue;
  const entry = clusterByPage.get(exp.page);
  if (!entry || entry.status !== 'published' || entry.pageType !== 'brand_service') errors.push(`${exp.page}: cluster entry must be published brand_service`);
  if ((brand.series || []).length < 2) errors.push(`${brand.brandId}: at least two official series groups required`);
  if (!fs.existsSync(exp.page)) { errors.push(`${exp.page}: root HTML missing`); continue; }
  const html = fs.readFileSync(exp.page, 'utf8');
  const text = visibleText(html);
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || '';
  const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1].replace(/<[^>]+>/g, ' ').trim() || '';
  if (!title.includes(exp.label) || !h1.includes(exp.label)) errors.push(`${exp.page}: brand missing from title/H1`);
  if (!/независимый сервис/i.test(text) || !/не является официальным сервисным центром/i.test(text)) errors.push(`${exp.page}: independent-service disclaimer missing`);
  if (!/"@type"\s*:\s*"Service"/.test(html)) errors.push(`${exp.page}: Service schema missing`);
  if (!/"@type"\s*:\s*"BreadcrumbList"/.test(html)) errors.push(`${exp.page}: BreadcrumbList missing`);
  if (/"@type"\s*:\s*"FAQPage"/.test(html)) errors.push(`${exp.page}: retired FAQPage schema must be absent`);
  if ((html.match(/data-brand-series=/g) || []).length < 2) errors.push(`${exp.page}: at least two visible series blocks required`);
  const evidenceIds = [...html.matchAll(/data-evidence-id=["']([^"']+)["']/g)].map((m) => m[1]);
  if (new Set(evidenceIds).size < 2) errors.push(`${exp.page}: at least two visible evidence records required`);
  for (const id of evidenceIds) {
    const row = evidence.get(id);
    if (!row) errors.push(`${exp.page}: unregistered evidence ${id}`);
    else if (row.manufacturer.toLowerCase() !== exp.label.toLowerCase()) errors.push(`${exp.page}: foreign manufacturer evidence ${id}`);
  }
  for (const field of ['problem','phone','equipment_model','serial_number','error_code']) {
    if (!new RegExp(`name=["']${field}["']`).test(html)) errors.push(`${exp.page}: form field ${field} missing`);
  }
  const internalLinks = (html.match(/data-cta-group=["']internal_link["']/g) || []).length;
  if (internalLinks < 7) errors.push(`${exp.page}: internal links ${internalLinks} < 7`);
  const symptomLinks = [...html.matchAll(/href=["']([^"']+\.html)["']/g)].map((m) => m[1]).filter((href) => /kutter-|nozh-|skreber-|oborot|skorost|taymer|impuls/.test(href));
  if (new Set(symptomLinks).size < 4) errors.push(`${exp.page}: fewer than 4 symptom links`);
  const context = metrics[exp.page];
  if (!context || context.page_intent !== 'brand_service' || context.brand !== exp.metric || context.service !== 'repair') errors.push(`${exp.page}: metrics brand-service context invalid`);
  if (text.split(/\s+/).filter(Boolean).length < 320) errors.push(`${exp.page}: content too thin`);
  const questions = [...html.matchAll(/<summary\b[^>]*>([\s\S]*?)<\/summary>/gi)].map((m) => m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
  if (questions.length < 4) errors.push(`${exp.page}: at least 4 FAQ questions required`);
  for (const question of questions) {
    const key = question.toLowerCase();
    if (!faqQuestions.has(key)) faqQuestions.set(key, []);
    faqQuestions.get(key).push(exp.page);
  }
}

for (const [question, pages] of faqQuestions) if (new Set(pages).size > 1) errors.push(`duplicate brand FAQ: ${question} -> ${[...new Set(pages)].join(', ')}`);

failIf(errors, `Kutter brand pages passed: ${expected.size} published brand-service pages`);
