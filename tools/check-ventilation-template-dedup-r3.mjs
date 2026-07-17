import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'data', 'ventilation-cluster-pages.json'), 'utf8'));
const forbidden = [
  'Что фиксируем до начала работ',
  'Что фиксируем до начала работ на объекте',
  'Если проблема в другом ресторанном оборудовании',
];
const paidManifest = JSON.parse(fs.readFileSync(path.join(root, 'data', 'paid-landings.json'), 'utf8'));
const paidRows = Array.isArray(paidManifest) ? paidManifest : (paidManifest.pages || paidManifest.landings || []);
const paidPages = new Set(paidRows.map((row) => row.page || row.file || String(row.landing_path || '').replace(/^\//, '')).filter(Boolean));
const errors = [];
const rows = [];

for (const item of manifest.pages) {
  const file = item.page;
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const formCount = (html.match(/<form\b/gi) || []).length;
  const faqSections = (html.match(/<section\b[^>]*\bid=["']faq["']/gi) || []).length;
  const relatedSections = (html.match(/<section\b[^>]*\bid=["']related["']/gi) || []).length;
  const requestSections = (html.match(/<section\b[^>]*\bid=["']request["']/gi) || []).length;
  const mainSections = ((html.match(/<section\b/gi) || []).length);
  for (const phrase of forbidden) {
    if (html.includes(phrase)) errors.push(`${file}: forbidden duplicate heading: ${phrase}`);
  }
  const expectedForms = paidPages.has(file) ? 2 : 1;
  if (formCount !== expectedForms) errors.push(`${file}: forms=${formCount}, expected ${expectedForms}`);
  if (faqSections !== 1) errors.push(`${file}: faq sections=${faqSections}, expected 1`);
  if (relatedSections !== 1) errors.push(`${file}: related sections=${relatedSections}, expected 1`);
  if (requestSections !== 1) errors.push(`${file}: request sections=${requestSections}, expected 1`);
  rows.push({ file, formCount, faqSections, relatedSections, requestSections, mainSections, bytes: Buffer.byteLength(html) });
}

if (errors.length) {
  console.error('# Ventilation Template Dedup R3 — FAIL');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
const totalBytes = rows.reduce((sum, row) => sum + row.bytes, 0);
const maxSections = Math.max(...rows.map((row) => row.mainSections));
console.log('# Ventilation Template Dedup R3 — PASS');
console.log(`Pages: ${rows.length}`);
console.log(`Forms: ${rows.reduce((s,r)=>s+r.formCount,0)} (1/page; paid hero+request allowed)`);
console.log(`FAQ: ${rows.reduce((s,r)=>s+r.faqSections,0)} (1/page)`);
console.log(`Related: ${rows.reduce((s,r)=>s+r.relatedSections,0)} (1/page)`);
console.log(`Request: ${rows.reduce((s,r)=>s+r.requestSections,0)} (1/page)`);
console.log(`Total HTML bytes: ${totalBytes}`);
console.log(`Max section tags/page: ${maxSections}`);
