#!/usr/bin/env node
import fs from 'node:fs';
const cluster = JSON.parse(fs.readFileSync('data/dishwasher-cluster-pages.json', 'utf8'));
const rows = cluster.pages.filter((p) => p.status === 'published');
const errors = [];
const norm = (s='') => s.toLowerCase().replace(/<[^>]+>/g, ' ').replace(/ё/g, 'е').replace(/[^a-zа-я0-9]+/gi, ' ').trim().replace(/\s+/g, ' ');
const data = rows.map((p) => {
  const html = fs.readFileSync(p.page, 'utf8');
  const title = (html.match(/<title>([\s\S]*?)<\/title>/i) || [,''])[1];
  const h1 = (html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i) || [,''])[1];
  const description = (html.match(/<meta\b(?=[^>]*name=["']description["'])[^>]*content=["']([^"']*)["'][^>]*>/i) || [,''])[1];
  const faq = [...html.matchAll(/<summary\b[^>]*>([\s\S]*?)<\/summary>/gi)].map((m) => norm(m[1]));
  return { ...p, title:norm(title), h1:norm(h1), description:norm(description), faq };
});
for (let i=0;i<data.length;i++) for (let j=i+1;j<data.length;j++) {
  const a=data[i], b=data[j];
  if (a.title && a.title === b.title) errors.push(`${a.page} / ${b.page}: duplicate title`);
  if (a.h1 && a.h1 === b.h1) errors.push(`${a.page} / ${b.page}: duplicate H1`);
  if (a.description && a.description === b.description) errors.push(`${a.page} / ${b.page}: duplicate description`);
  if (a.indexable && b.indexable) {
    const sharedFaq = a.faq.filter((q) => q && b.faq.includes(q));
    if (sharedFaq.length >= 3) errors.push(`${a.page} / ${b.page}: ${sharedFaq.length} identical FAQ questions`);
  }
}
for (const d of data.filter((p) => p.pageType === 'direct')) {
  if (d.indexable !== false) errors.push(`${d.page}: Direct page must remain noindex`);
}
if (errors.length) {
  console.error(`❌ Dishwasher cannibalization failed (${errors.length})`);
  for (const e of errors) console.error(`- ${e}`);
  process.exit(1);
}
console.log(`✅ Dishwasher cannibalization passed: ${data.length} published pages, no exact title/H1/description conflicts`);
