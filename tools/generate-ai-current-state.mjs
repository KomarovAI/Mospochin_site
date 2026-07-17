#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const checkMode = process.argv.includes('--check');

const readJson = (rel, fallback = null) => {
  const full = path.join(ROOT, rel);
  return fs.existsSync(full) ? JSON.parse(fs.readFileSync(full, 'utf8')) : fallback;
};
const normalize = (text) => text.replace(/\r\n/g, '\n');

const htmlFiles = fs.readdirSync(ROOT).filter((name) => name.endsWith('.html')).sort();
let indexable = 0;
let noindex = 0;
for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
  if (/<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(html)) noindex += 1;
  else indexable += 1;
}

const sitemap = fs.existsSync(path.join(ROOT, 'sitemap.xml')) ? fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8') : '';
const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
const builder = readJson('src/site-builder.json', { pages: [] });
const backlog = readJson('data/sous-vide-p2-backlog.json', { pages: [] });
const packageJson = readJson('package.json', {});

const state = {
  schemaVersion: 1,
  generatedBy: 'tools/generate-ai-current-state.mjs',
  activeControlProfile: 'ai-control-lite-r5',
  project: packageJson.name || 'mospochin-site',
  counts: {
    rootHtml: htmlFiles.length,
    indexable,
    noindex,
    sitemapUrls: sitemapUrls.length,
    uniqueSitemapUrls: new Set(sitemapUrls).size,
    builderPages: Array.isArray(builder.pages) ? builder.pages.length : 0,
    sourcePageModels: fs.existsSync(path.join(ROOT, 'src/pages'))
      ? fs.readdirSync(path.join(ROOT, 'src/pages'), { withFileTypes: true }).filter((entry) => entry.isDirectory() && fs.existsSync(path.join(ROOT, 'src/pages', entry.name, 'page.json'))).length
      : 0,
  },
  activeBacklog: {
    sousVideP2: Array.isArray(backlog.pages) ? backlog.pages.length : 0,
    source: 'data/sous-vide-p2-backlog.json',
  },
  entrypoints: {
    instructions: 'AGENTS.md',
    operatingGuide: 'docs/AI_CONTROL_LITE.md',
    taskBrief: 'npm run ai:brief',
    iterationCheck: 'npm run ai:verify -- --changed',
    releaseCheck: 'npm run ai:release',
  },
  knownLimitations: [
    'Browser-only smoke requires an available Chromium runtime and may be skipped in restricted environments.',
  ],
};

const jsonText = `${JSON.stringify(state, null, 2)}\n`;
const markdown = `# Current Project State\n\nThis file is generated. Do not edit it manually.\n\n- Active AI profile: \`${state.activeControlProfile}\`\n- Root HTML: **${state.counts.rootHtml}**\n- Indexable / noindex: **${state.counts.indexable} / ${state.counts.noindex}**\n- Sitemap URLs: **${state.counts.uniqueSitemapUrls} unique**\n- Builder pages / source models: **${state.counts.builderPages} / ${state.counts.sourcePageModels}**\n- Deferred Sous-vide P2 backlog: **${state.activeBacklog.sousVideP2}**\n\n## Start\n\n\`\`\`bash\nnpm run ai:brief -- --task content --page example.html\nnpm run ai:verify -- --changed\n\`\`\`\n\nBefore a release, run \`npm run ai:release\`.\n\n## Known limitation\n\n${state.knownLimitations.map((item) => `- ${item}`).join('\n')}\n`;

const outputs = [
  ['data/ai-current-state.json', jsonText],
  ['.ai/CURRENT.md', markdown],
];

let stale = false;
for (const [rel, content] of outputs) {
  const full = path.join(ROOT, rel);
  if (checkMode) {
    const existing = fs.existsSync(full) ? normalize(fs.readFileSync(full, 'utf8')) : null;
    if (existing !== normalize(content)) {
      console.error(`❌ ${rel} is stale; run npm run generate:ai-current-state`);
      stale = true;
    } else {
      console.log(`✅ ${rel}`);
    }
  } else {
    fs.mkdirSync(path.dirname(full), { recursive: true });
    fs.writeFileSync(full, content);
    console.log(`✅ wrote ${rel}`);
  }
}

process.exit(stale ? 1 : 0);
