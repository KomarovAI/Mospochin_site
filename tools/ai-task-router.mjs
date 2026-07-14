#!/usr/bin/env node
/** Small AI router: for a task/page, print the source files, do-not-edit files,
 * and the smallest useful command set. This is intentionally read-only.
 */
import { existsSync, readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const ROOT_DIR = path.resolve(path.dirname(__filename), '..');

function parseArgs(argv = process.argv.slice(2)) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token.startsWith('--')) {
      const key = token.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith('--')) args[key] = true;
      else {
        args[key] = next;
        i += 1;
      }
    }
  }
  return args;
}

function readJson(rel) {
  const full = path.join(ROOT_DIR, rel);
  if (!existsSync(full)) return null;
  return JSON.parse(readFileSync(full, 'utf8'));
}

function printList(title, items) {
  console.log(`\n${title}`);
  for (const item of items.filter(Boolean)) console.log(`- ${item}`);
}

const args = parseArgs();
const task = String(args.task || 'content').toLowerCase();
const page = args.page || args.file || null;
const map = readJson('data/project-map.generated.json');
const clusterRegistry = readJson('data/cluster-registry.json') || { clusters: {} };

if (!map) {
  console.error('❌ data/project-map.generated.json отсутствует. Запусти npm run generate:project-map');
  process.exit(1);
}

const pageInfo = page ? map.pages?.[page] : null;
if (page && !pageInfo) {
  console.error(`❌ Страница ${page} не найдена в data/project-map.generated.json`);
  process.exit(1);
}

const commonRead = ['docs/AI_START_HERE.md', 'docs/DOC_INDEX.md', 'data/project-map.generated.json', 'data/file-ownership.json'];
const read = [...commonRead];
const edit = [];
const avoid = ['root *.html напрямую, если есть builder/source путь', 'sitemap.xml вручную', '.ai/digest/** вручную', 'data/ai-project-index.json вручную'];
const commands = [];

if (pageInfo) {
  read.push(pageInfo.source.model, pageInfo.source.sectionsDir, `.ai/digest/pages/${page.replace(/\.html$/, '')}.md`);
  edit.push(pageInfo.source.model, `${pageInfo.source.sectionsDir}/*.html`);
  if (pageInfo.cluster) {
    const cluster = clusterRegistry.clusters?.[pageInfo.cluster];
    if (cluster) {
      read.push('data/cluster-registry.json', cluster.guide, cluster.manifest, cluster.digest, cluster.screenshotManifest);
      commands.push(...(cluster.guardCommands || []));
    }
  }
  if (pageInfo.directLanding) {
    read.push('data/direct-landing-pages.json');
    edit.push('data/direct-landing-pages.json');
    commands.push('npm run generate:direct-landings');
  }
}

const taskProfiles = {
  content: {
    read: ['docs/AI_PROJECT_OPERATING_GUIDE.md'],
    edit: [],
    commands: ['npm run build:site -- --write', 'npm run sync:generated', 'npm run check:core'],
  },
  seo: {
    read: ['data/page-metadata.json', 'sitemap.xml'],
    edit: ['data/page-metadata.json'],
    commands: ['npm run sync:metadata', 'npm run generate:sitemap', 'npm run sync:generated', 'npm run check:handoff'],
  },
  links: {
    read: ['data/project-map.generated.json'],
    edit: pageInfo ? [`${pageInfo.source.sectionsDir}/*.html`, 'data/direct-landing-pages.json if direct links are generated'] : [],
    commands: ['npm run build:site -- --write', 'npm run check:conversion-ui', 'npm run check:core'],
  },
  cluster: {
    read: ['data/cluster-registry.json', 'src/pages/<slug>/sections/*.html'],
    edit: ['data/cluster-registry.json', 'src/pages/<slug>/sections/*.html'],
    commands: ['npm run build:site -- --write', 'npm run sync:generated', 'npm run check:handoff'],
  },
  direct: {
    read: ['data/direct-landing-pages.json', 'tools/generate-direct-landings.mjs'],
    edit: ['data/direct-landing-pages.json'],
    commands: ['npm run generate:direct-landings', 'npm run sync:generated', 'npm run check:handoff'],
  },
  forms: {
    read: ['telegram-form.js', 'server/telegram-api.mjs', 'data/contact-config.json', 'data/runtime-config.json'],
    edit: ['data/contact-config.json', 'data/runtime-config.json', 'src/pages/<slug>/sections/*.html'],
    commands: ['npm run check:conversion-ui', 'npm run check:core'],
  },
  assets: {
    read: ['ASSETS.md', 'data/screenshot-audit.json'],
    edit: ['assets/**'],
    commands: ['npm run check:assets', 'npm run check:images'],
  },
  generator: {
    read: ['docs/AI_PROJECT_OPERATING_GUIDE.md', 'data/file-ownership.json'],
    edit: ['tools/*.mjs'],
    commands: ['npm run sync:generated', 'npm run check:handoff', 'npm run check:doctor'],
  },
  docs: {
    read: ['docs/DOC_INDEX.md'],
    edit: ['docs/**/*.md', 'AGENTS.md', 'CHANGELOG_AI.md'],
    commands: ['npm run sync:generated', 'npm run check:ai'],
  },
  handoff: {
    read: ['docs/AI_CHANGE_CHECKLIST.md'],
    edit: ['CHANGELOG_AI.md'],
    commands: ['npm run handoff:pack'],
  },
};

const profile = taskProfiles[task] || taskProfiles.content;
read.push(...profile.read);
edit.push(...profile.edit);
commands.push(...profile.commands);

console.log(`# AI route`);
console.log(`Task: ${task}`);
if (page) console.log(`Page: ${page}`);
if (pageInfo) {
  console.log(`Cluster: ${pageInfo.cluster || 'none'}`);
  console.log(`Branch: ${pageInfo.metadata.branch || 'unknown'}`);
  console.log(`Direct landing: ${pageInfo.directLanding ? 'yes' : 'no'}`);
}

printList('Read first:', [...new Set(read)]);
printList('Edit candidates:', [...new Set(edit)]);
printList('Do not edit directly:', [...new Set(avoid)]);
printList('Run after changes:', [...new Set(commands)]);
