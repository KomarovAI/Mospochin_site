#!/usr/bin/env node
import fs from 'node:fs/promises';

function env(name, fallback = '') {
  return process.env[name] || fallback;
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n));
}

function normalizePage(p) {
  p = String(p || '').trim();
  if (!p) return '';
  if (!p.startsWith('/')) p = '/' + p;
  return p;
}

const eventName = env('GITHUB_EVENT_NAME', 'push');
const scope = env('MOSPOCHIN_VISUAL_SCOPE', 'auto') || 'auto';
const depth = env('MOSPOCHIN_VISUAL_DEPTH', 'layout') || 'layout';
const page = normalizePage(env('MOSPOCHIN_VISUAL_PAGE', ''));
const cluster = env('MOSPOCHIN_VISUAL_CLUSTER', '');

const corePages = [
  '/',
  '/contact.html',
  '/bytovaya-contact.html',
  '/pishevarochnye-kotly.html',
  '/pishevarochnyj-kotel-abat-kpem.html',
  '/pishevarochnyj-kotel-ne-greet.html',
  '/remont-pishevarochnyh-kotlov-abat.html'
];

const clusters = {
  kettles: [
    '/pishevarochnye-kotly.html',
    '/pishevarochnyj-kotel-abat-kpem.html',
    '/pishevarochnyj-kotel-ne-greet.html',
    '/remont-pishevarochnyh-kotlov-abat.html'
  ],
  contacts: ['/contact.html', '/bytovaya-contact.html'],
  pariki: [
    '/parokonvektomaty.html',
    '/parokonvektomat-rational.html',
    '/parokonvektomat-unox.html',
    '/parokonvektomat-kod-oshibki.html'
  ]
};

let mode = 'postdeploy';
let pages = corePages;
let viewports = ['desktop', 'mobile'];
let targetUnitsPerWorker = 30;

if (eventName === 'workflow_dispatch' && scope === 'page' && page && depth === 'atomic') {
  mode = 'atomic';
  pages = [page];
  targetUnitsPerWorker = 12;
} else if (eventName === 'workflow_dispatch' && scope === 'cluster') {
  mode = 'cluster';
  pages = clusters[cluster] || corePages;
  targetUnitsPerWorker = 24;
} else if (eventName === 'workflow_dispatch' && scope === 'all') {
  mode = 'all';
  pages = corePages;
  targetUnitsPerWorker = 18;
}

const tasks = [];
let pageIndex = 0;

for (const p of pages) {
  for (const viewport of viewports) {
    const weight = mode === 'atomic' ? 18 : mode === 'cluster' ? 8 : 6;
    tasks.push({
      task_index: tasks.length,
      page_index: mode === 'atomic' ? 999 : pageIndex,
      path: p,
      viewport,
      mode,
      depth: mode === 'atomic' ? 'atomic' : 'layout-deep',
      class: mode === 'atomic' ? 'MANUAL_ATOMIC' : 'CORE_ALWAYS',
      reason: mode === 'atomic' ? 'manual_workflow_dispatch' : `parallel_${mode}`,
      weight
    });
  }
  pageIndex += 1;
}

const totalUnits = tasks.reduce((sum, t) => sum + t.weight, 0);
let workerCount = clamp(Math.ceil(totalUnits / targetUnitsPerWorker), 2, 10);
workerCount = Math.min(workerCount, Math.max(1, tasks.length));

const buckets = Array.from({ length: workerCount }, (_, shard) => ({
  shard,
  total: workerCount,
  mode,
  tasks: []
}));

for (const task of tasks) {
  let lightest = 0;
  for (let i = 1; i < buckets.length; i++) {
    const a = buckets[i].tasks.reduce((s, t) => s + t.weight, 0);
    const b = buckets[lightest].tasks.reduce((s, t) => s + t.weight, 0);
    if (a < b) lightest = i;
  }
  buckets[lightest].tasks.push(task);
}

const matrix = {
  include: buckets.map((b) => ({
    shard: b.shard,
    total: b.total,
    mode: b.mode,
    task_count: b.tasks.length,
    units: b.tasks.reduce((s, t) => s + t.weight, 0),
    tasks: JSON.stringify(b.tasks)
  }))
};

const summary = {
  eventName,
  scope,
  depth,
  page,
  cluster,
  mode,
  pages,
  tasks: tasks.length,
  totalUnits,
  workerCount,
  matrix
};

await fs.mkdir('reports/visual-debug', { recursive: true });
await fs.writeFile('reports/visual-debug/visual-shard-plan.json', JSON.stringify(summary, null, 2));

if (process.env.GITHUB_OUTPUT) {
  await fs.appendFile(process.env.GITHUB_OUTPUT, `enabled=true\n`);
  await fs.appendFile(process.env.GITHUB_OUTPUT, `worker_count=${workerCount}\n`);
  await fs.appendFile(process.env.GITHUB_OUTPUT, `mode=${mode}\n`);
  await fs.appendFile(process.env.GITHUB_OUTPUT, `matrix=${JSON.stringify(matrix)}\n`);
}

console.log(`VISUAL_SHARD_PLAN_OK mode=${mode} workers=${workerCount} tasks=${tasks.length} units=${totalUnits}`);
