#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function parseArgs(argv = process.argv.slice(2)) {
  const out = { positional: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) {
      out.positional.push(token);
      continue;
    }
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) out[key] = true;
    else {
      out[key] = next;
      i += 1;
    }
  }
  return out;
}

function readJson(rel, fallback = null) {
  const full = path.join(ROOT, rel);
  return fs.existsSync(full) ? JSON.parse(fs.readFileSync(full, 'utf8')) : fallback;
}

function unique(items) {
  return [...new Set(items.filter(Boolean))];
}

function printList(title, items) {
  console.log(`\n${title}`);
  for (const item of unique(items)) console.log(`- ${item}`);
}

const args = parseArgs();
const task = String(args.task || 'content').toLowerCase();
const page = args.page || args.file || null;
const clusterArg = args.cluster || null;
const map = readJson('data/project-map.generated.json');
const clusters = readJson('data/cluster-registry.json', { clusters: {} });
const state = readJson('data/ai-current-state.json', {});

if (!map) {
  console.error('❌ Missing data/project-map.generated.json. Run npm run sync:generated.');
  process.exit(1);
}

const pageInfo = page ? map.pages?.[page] : null;
if (page && !pageInfo) {
  console.error(`❌ Unknown page: ${page}`);
  process.exit(2);
}

const clusterKey = pageInfo?.cluster || clusterArg || null;
const cluster = clusterKey ? clusters.clusters?.[clusterKey] : null;
const read = ['AGENTS.md', '.ai/CURRENT.md'];
const edit = [];
const avoid = ['root generated HTML', 'sitemap.xml', '.ai/digest/**', 'data/project-map.generated.json'];
const verify = ['npm run check:instruction-hygiene', 'npm run check:repo-hygiene'];
let risk = 'low';

if (pageInfo) {
  read.push(pageInfo.source.model, `.ai/digest/pages/${page.replace(/\.html$/, '')}.md`);
  edit.push(`${pageInfo.source.sectionsDir}/*`, pageInfo.source.model);
  verify.push(`npm run build:site -- --page ${page} --check`, `npm run doctor:page -- --page ${page}`);
  if (pageInfo.directLanding || pageInfo.metadata?.hasForm) risk = 'medium';
}

if (cluster) {
  read.push('data/cluster-registry.json', cluster.guide, cluster.manifest, cluster.digest);
  verify.push(...(cluster.guardCommands || []));
}

const profiles = {
  content: {
    read: [], edit: [], verify: ['npm run ai:verify -- --changed'],
  },
  seo: {
    read: ['data/page-metadata.json'], edit: ['data/page-metadata.json'], verify: ['npm run check:html-head', 'npm run check:site-crawl'], risk: 'medium',
  },
  forms: {
    read: ['telegram-form.js', 'server/telegram-api.mjs', 'data/contact-config.json'],
    edit: ['telegram-form.js', 'server/telegram-api.mjs', 'data/contact-config.json'],
    verify: ['npm run check:conversion-ui', 'npm run check:paid-p0'], risk: 'high',
  },
  assets: {
    read: ['assets/AGENTS.md', 'ASSETS.md'], edit: ['assets/**'], verify: ['npm run check:images', 'npm run check:assets'], risk: 'medium',
  },
  data: {
    read: ['data/AGENTS.md', 'data/file-ownership.json'], edit: ['data/<relevant-file>.json'], verify: ['npm run validate:data'], risk: 'medium',
  },
  generator: {
    read: ['docs/AI_CONTROL_LITE.md', 'data/file-ownership.json'], edit: ['tools/<relevant-tool>.mjs'], verify: ['npm run check:handoff'], risk: 'high',
  },
  server: {
    read: ['server/AGENTS.md'], edit: ['server/**'], verify: ['npm run test:form-idempotency', 'npm run check:npm-audit'], risk: 'high',
  },
  docs: {
    read: ['docs/AGENTS.md', 'docs/DOC_INDEX.md'], edit: ['docs/<canonical-document>.md'], verify: ['npm run check:instruction-hygiene', 'npm run check:repo-hygiene'], risk: 'low',
  },
  instructions: {
    read: ['data/ai-instruction-policy.json', 'docs/AI_CONTROL_LITE.md'], edit: ['approved instruction file only'], verify: ['npm run check:instruction-hygiene'], risk: 'high',
  },
  release: {
    read: ['docs/AI_CONTROL_LITE.md'], edit: [], verify: ['npm run ai:release'], risk: 'high',
  },
};

const profile = profiles[task] || profiles.content;
read.push(...profile.read);
edit.push(...profile.edit);
verify.push(...profile.verify);
if (profile.risk) risk = profile.risk;

const result = {
  task,
  target: page || clusterKey || 'repository',
  risk,
  currentState: state.counts || null,
  read: unique(read),
  edit: unique(edit),
  doNotEdit: unique(avoid),
  verify: unique(verify),
};

if (args.json) {
  console.log(JSON.stringify(result, null, 2));
  process.exit(0);
}

console.log('# AI task brief');
console.log(`Task: ${task}`);
console.log(`Target: ${result.target}`);
console.log(`Risk: ${risk}`);
if (pageInfo) {
  console.log(`Cluster: ${clusterKey || 'none'}`);
  console.log(`Branch: ${pageInfo.metadata?.branch || 'unknown'}`);
  console.log(`Direct landing: ${pageInfo.directLanding ? 'yes' : 'no'}`);
}
printList('Read', result.read);
printList('Edit candidates', result.edit);
printList('Do not edit directly', result.doNotEdit);
printList('Verify', result.verify);
console.log('\nKeep the task brief in chat or the issue; do not paste it into repository instruction files.');
