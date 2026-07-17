import { readdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { readSectionContent, hashContent } from './site-builder-lib.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const PAGES_DIR = join(ROOT, 'src', 'pages');

let pageCount = 0;
let sectionCount = 0;
let changedPages = 0;

for (const slug of readdirSync(PAGES_DIR).sort()) {
  const modelPath = join(PAGES_DIR, slug, 'page.json');
  if (!existsSync(modelPath)) continue;

  const model = JSON.parse(readFileSync(modelPath, 'utf8'));
  let changed = false;

  for (const section of model.sections || []) {
    if (section.componentMode !== 'parametric' && !section.templateRef) continue;
    const rendered = readSectionContent(relative(ROOT, modelPath).replaceAll('\\', '/'), section);
    const bytes = Buffer.byteLength(rendered, 'utf8');
    const hash = hashContent(rendered).slice(0, 16);
    sectionCount += 1;
    if (section.bytes !== bytes || section.hash !== hash) {
      section.bytes = bytes;
      section.hash = hash;
      changed = true;
    }
  }

  pageCount += 1;
  if (changed) {
    writeFileSync(modelPath, `${JSON.stringify(model, null, 2)}\n`, 'utf8');
    changedPages += 1;
  }
}

console.log(`Parametric hashes normalized: pages=${pageCount}, sections=${sectionCount}, changedPages=${changedPages}`);
