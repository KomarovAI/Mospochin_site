import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const profile = JSON.parse(fs.readFileSync(path.join(root, 'data/company-profile.json'), 'utf8'));
const pages = ['index.html', 'uslugi.html', 'about.html', 'contact.html'];
const requiredCatalog = [
  'parokonvektomaty.html', 'plity-pechi.html', 'pishevarochnye-kotly.html',
  'grili-mangaly.html', 'sous-vide-restoranov.html', 'holodilnoe-oborudovanie.html',
  'ice-machines.html', 'posudomoechnye-mashiny.html', 'kuttery-dlya-restoranov.html',
  'ventilyatsiya-restoranov.html'
];
const errors = [];
const strip = (html) => html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
for (const file of pages) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const text = strip(html).toLowerCase();
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  if (h1Count !== 1) errors.push(`${file}: H1 count ${h1Count}`);
  if (!html.includes('data-contact-form')) errors.push(`${file}: contact form missing`);
  if (!html.includes(profile.phoneDisplay)) errors.push(`${file}: verified phone missing`);
  for (const claim of profile.prohibitedClaims) {
    if (text.includes(claim.toLowerCase())) errors.push(`${file}: prohibited claim: ${claim}`);
  }
  if (html.includes('+7 (909) 994-61-77') || html.includes('+79099946177')) errors.push(`${file}: stale phone found`);
}
const services = fs.readFileSync(path.join(root, 'uslugi.html'), 'utf8');
for (const href of requiredCatalog) if (!services.includes(`href="${href}"`)) errors.push(`uslugi.html: catalog route missing ${href}`);
const about = fs.readFileSync(path.join(root, 'about.html'), 'utf8');
if (!about.includes(profile.advertiser.name) || !about.includes(profile.advertiser.inn)) errors.push('about.html: advertiser requisites missing');
const contact = fs.readFileSync(path.join(root, 'contact.html'), 'utf8');
if (!contact.includes(profile.email)) errors.push('contact.html: email missing');
if (errors.length) {
  console.error('Core Pages Content R1 failed:\n' + errors.map((x) => `- ${x}`).join('\n'));
  process.exit(1);
}
console.log(`✅ Core Pages Content R1: ${pages.length} pages, ${requiredCatalog.length} catalog routes, verified claims only.`);
