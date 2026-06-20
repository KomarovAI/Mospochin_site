import fs from 'node:fs';

const baseUrl = process.env.VISUAL_BASE_URL || 'https://mospochin.ru';
const scope = process.env.VISUAL_SCOPE || 'sitemap';
const cluster = process.env.VISUAL_CLUSTER || '';
const pageInput = process.env.VISUAL_PAGE || '';
const viewportsInput = process.env.VISUAL_VIEWPORTS || 'both';
const workersInput = process.env.VISUAL_WORKERS || 'auto';

const outDir = 'reports/visual-audit';
fs.mkdirSync(outDir, { recursive: true });

const viewportDefs = {
  desktop: { name: 'desktop', width: 1440, height: 900 },
  mobile: { name: 'mobile', width: 390, height: 844 },
};

const viewports =
  viewportsInput === 'desktop' ? [viewportDefs.desktop] :
  viewportsInput === 'mobile' ? [viewportDefs.mobile] :
  [viewportDefs.desktop, viewportDefs.mobile];

function normalizePath(p) {
  if (!p) return '/';
  const x = p.startsWith('/') ? p : `/${p}`;
  return x === '/index.html' ? '/' : x;
}

function urlToPath(url) {
  try {
    const u = new URL(url);
    return normalizePath(u.pathname || '/');
  } catch {
    return normalizePath(url);
  }
}

function readSitemapPaths() {
  const xml = fs.existsSync('sitemap.xml') ? fs.readFileSync('sitemap.xml', 'utf8') : '';
  const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1].trim());
  const paths = locs.map(urlToPath);
  if (!paths.includes('/')) paths.unshift('/');
  return [...new Set(paths)].sort();
}

const clusterMatchers = {
  pariki: p => /parokonvektomat|rational|unox|abat|convotherm|electrolux|lainox/i.test(p),
  kettles: p => /pishevarochn|kotel|kotlov|kpem/i.test(p),
  contacts: p => /contact/i.test(p),
  bytovaya: p => /bytovaya/i.test(p),
  commercial: p => !/about|politika|privacy|404/i.test(p),
};

let paths = [];
if (scope === 'page') {
  paths = [normalizePath(pageInput || '/')];
} else {
  paths = readSitemapPaths();
  if (scope === 'smoke') {
    paths = paths.filter(p => ['/', '/contact.html', '/bytovaya-index.html', '/parokonvektomaty.html', '/pishevarochnye-kotly.html'].includes(p));
  }
  if (scope === 'cluster') {
    const match = clusterMatchers[cluster] || (() => true);
    paths = paths.filter(match);
  }
}

paths = [...new Set(paths)];
if (!paths.length) {
  console.error(`No pages selected. scope=${scope} cluster=${cluster} page=${pageInput}`);
  process.exit(1);
}

const tasks = [];
for (const path of paths) {
  for (const vp of viewports) {
    tasks.push({
      path,
      url: `${baseUrl}${path === '/' ? '/' : path}`,
      viewport: vp.name,
      width: vp.width,
      height: vp.height,
    });
  }
}

let workers = workersInput === 'auto'
  ? Math.ceil(tasks.length / 12)
  : Number.parseInt(workersInput, 10);

workers = Math.max(1, Math.min(10, Number.isFinite(workers) ? workers : 4, tasks.length));

const buckets = Array.from({ length: workers }, (_, shard) => ({ shard, total: workers, tasks: [] }));
tasks.forEach((task, i) => buckets[i % workers].tasks.push(task));

const plan = {
  generated_at: new Date().toISOString(),
  base_url: baseUrl,
  scope,
  cluster,
  page: pageInput,
  viewports: viewports.map(v => v.name),
  workers,
  pages: paths.length,
  tasks: tasks.length,
  buckets,
};

fs.writeFileSync(`${outDir}/plan.json`, JSON.stringify(plan, null, 2));
fs.writeFileSync(
  `${outDir}/capture-plan.csv`,
  ['shard,path,url,viewport,width,height']
    .concat(buckets.flatMap(b => b.tasks.map(t => `${b.shard},"${t.path}","${t.url}",${t.viewport},${t.width},${t.height}`)))
    .join('\n') + '\n'
);

const matrix = { include: buckets.map(b => ({ shard: b.shard, total: b.total })) };
console.log(JSON.stringify({ workers, pages: paths.length, tasks: tasks.length, matrix }, null, 2));

if (process.env.GITHUB_OUTPUT) {
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `matrix=${JSON.stringify(matrix)}\n`);
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `workers=${workers}\n`);
  fs.appendFileSync(process.env.GITHUB_OUTPUT, `tasks=${tasks.length}\n`);
}
