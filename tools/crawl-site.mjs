#!/usr/bin/env node
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPORT_JSON = path.join(ROOT, 'reports', 'site-crawl.json');
const REPORT_MD = path.join(ROOT, 'reports', 'site-crawl.md');
const SITE_HOST = 'mospochin.ru';
const DEFAULT_PORT = 9876;

function parseArgs(argv) {
  const args = { check: false, json: false, port: DEFAULT_PORT };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--check') args.check = true;
    else if (token === '--json') args.json = true;
    else if (token === '--port') args.port = Number(argv[++i] || DEFAULT_PORT);
  }
  return args;
}

function decodeHtml(value) {
  return String(value || '')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>');
}

function attr(tag, name) {
  const pattern = new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i');
  const match = String(tag).match(pattern);
  return decodeHtml(match?.[1] ?? match?.[2] ?? match?.[3] ?? '');
}

function tags(html, name) {
  return [...String(html).matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map((match) => match[0]);
}

function normalizePathname(rawPath) {
  let pathname = rawPath || '/';
  try { pathname = decodeURIComponent(pathname); } catch { /* keep raw */ }
  pathname = pathname.replace(/\\/g, '/');
  if (!pathname.startsWith('/')) pathname = `/${pathname}`;
  pathname = path.posix.normalize(pathname);
  if (pathname === '/') return '/index.html';
  if (pathname.endsWith('/')) return `${pathname}index.html`;
  return pathname;
}

function resolveInternal(raw, fromPage) {
  const value = decodeHtml(raw).trim();
  if (!value || value.startsWith('#')) {
    return value.startsWith('#')
      ? { internal: true, pathname: `/${fromPage}`, fragment: value.slice(1), query: '' }
      : null;
  }
  if (/^(?:tel:|mailto:|sms:|tg:|javascript:|data:)/i.test(value)) return null;
  if (value.startsWith('//')) {
    const parsed = new URL(`https:${value}`);
    if (parsed.hostname !== SITE_HOST && parsed.hostname !== 'www.mospochin.ru') return null;
    return { internal: true, pathname: normalizePathname(parsed.pathname), fragment: parsed.hash.slice(1), query: parsed.search };
  }
  try {
    const base = `https://${SITE_HOST}/${fromPage}`;
    const parsed = new URL(value, base);
    if (parsed.hostname !== SITE_HOST && parsed.hostname !== 'www.mospochin.ru') return null;
    return { internal: true, pathname: normalizePathname(parsed.pathname), fragment: parsed.hash.slice(1), query: parsed.search };
  } catch {
    return { internal: true, malformed: true, raw: value };
  }
}

function pageFileFromPath(pathname) {
  return normalizePathname(pathname).replace(/^\//, '');
}

function pageIds(html) {
  const ids = new Set();
  for (const tag of String(html).match(/<[^>]+>/g) || []) {
    const id = attr(tag, 'id');
    const name = attr(tag, 'name');
    if (id) ids.add(id);
    if (name) ids.add(name);
  }
  return ids;
}

function robotsContent(html) {
  const tag = tags(html, 'meta').find((item) => attr(item, 'name').toLowerCase() === 'robots');
  return attr(tag || '', 'content').toLowerCase();
}

function canonicalHref(html) {
  const canonicalTags = tags(html, 'link').filter((item) => attr(item, 'rel').toLowerCase().split(/\s+/).includes('canonical'));
  return { count: canonicalTags.length, href: attr(canonicalTags[0] || '', 'href') };
}

function extractResources(html) {
  const resources = [];
  for (const tag of tags(html, 'script')) {
    const src = attr(tag, 'src');
    if (src) resources.push({ kind: 'script', value: src });
  }
  for (const tag of tags(html, 'img')) {
    const src = attr(tag, 'src');
    if (src) resources.push({ kind: 'image', value: src });
    const srcset = attr(tag, 'srcset');
    for (const item of srcset.split(',').map((part) => part.trim().split(/\s+/)[0]).filter(Boolean)) {
      resources.push({ kind: 'image-srcset', value: item });
    }
  }
  for (const tag of tags(html, 'source')) {
    const src = attr(tag, 'src');
    if (src) resources.push({ kind: 'source', value: src });
    const srcset = attr(tag, 'srcset');
    for (const item of srcset.split(',').map((part) => part.trim().split(/\s+/)[0]).filter(Boolean)) {
      resources.push({ kind: 'source-srcset', value: item });
    }
  }
  for (const tag of tags(html, 'link')) {
    const rel = attr(tag, 'rel').toLowerCase();
    const href = attr(tag, 'href');
    if (href && /(?:stylesheet|preload|icon|manifest)/.test(rel)) resources.push({ kind: `link:${rel}`, value: href });
  }
  return resources;
}

function listRootHtml() {
  return fs.readdirSync(ROOT)
    .filter((name) => name.endsWith('.html') && fs.statSync(path.join(ROOT, name)).isFile())
    .sort();
}

function readSitemapPaths() {
  const xml = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map((match) => {
      try { return pageFileFromPath(new URL(decodeHtml(match[1])).pathname); }
      catch { return null; }
    })
    .filter(Boolean)
    .sort();
}

function waitForServer(child, port) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('dev_server_start_timeout')), 10000);
    const onData = (chunk) => {
      const text = chunk.toString();
      if (text.includes(`127.0.0.1:${port}`)) {
        clearTimeout(timer);
        resolve();
      }
    };
    child.stdout.on('data', onData);
    child.stderr.on('data', (chunk) => process.stderr.write(chunk));
    child.once('exit', (code) => {
      clearTimeout(timer);
      reject(new Error(`dev_server_exited_${code}`));
    });
  });
}

async function request(base, pathname, method = 'GET') {
  const response = await fetch(`${base}${pathname}`, { method, redirect: 'manual' });
  return {
    status: response.status,
    location: response.headers.get('location') || '',
    contentType: response.headers.get('content-type') || '',
    text: method === 'HEAD' ? '' : await response.text(),
  };
}

function deterministicReport(report) {
  return `${JSON.stringify(report, null, 2)}\n`;
}

function markdown(report) {
  const issueLines = report.issues.length
    ? report.issues.map((issue) => `- **${issue.code}** ${issue.page ? `\`${issue.page}\`: ` : ''}${issue.message}`).join('\n')
    : '- Ошибок не обнаружено.';
  return `# Site crawl report\n\n` +
    `## Summary\n\n` +
    `- Root HTML: **${report.summary.rootHtml}**\n` +
    `- Indexable HTML: **${report.summary.indexableHtml}**\n` +
    `- Noindex HTML: **${report.summary.noindexHtml}**\n` +
    `- Sitemap URLs: **${report.summary.sitemapUrls}**\n` +
    `- Internal page edges: **${report.summary.internalPageEdges}**\n` +
    `- Unique checked resources: **${report.summary.uniqueResources}**\n` +
    `- Broken links/resources: **${report.summary.brokenTargets}**\n` +
    `- Indexable orphans: **${report.summary.indexableOrphans}**\n` +
    `- Issues: **${report.summary.issues}**\n\n` +
    `## Issues\n\n${issueLines}\n`;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const base = `http://127.0.0.1:${args.port}`;
  const child = spawn(process.execPath, ['tools/dev-server.mjs'], {
    cwd: ROOT,
    env: { ...process.env, PORT: String(args.port) },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  try {
    await waitForServer(child, args.port);
    const rootPages = listRootHtml();
    const pageMap = new Map();
    const issues = [];
    const addIssue = (code, page, message, target = '') => issues.push({ code, page, message, ...(target ? { target } : {}) });

    for (const page of rootPages) {
      const response = await request(base, `/${page}`);
      if (response.status !== 200) addIssue('html_status', page, `HTTP ${response.status}`, `/${page}`);
      const robots = robotsContent(response.text);
      const canonical = canonicalHref(response.text);
      const noindex = robots.includes('noindex');
      const links = tags(response.text, 'a').map((tag) => ({ href: attr(tag, 'href'), text: String(tag).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() }));
      pageMap.set(page, {
        page,
        html: response.text,
        status: response.status,
        noindex,
        robots,
        canonical,
        ids: pageIds(response.text),
        links,
        resources: extractResources(response.text),
      });
    }

    const sitemap = readSitemapPaths();
    const sitemapSet = new Set(sitemap);
    const indexable = rootPages.filter((page) => page !== '404.html' && !pageMap.get(page)?.noindex);
    const noindexPages = rootPages.filter((page) => pageMap.get(page)?.noindex);
    const indexableSet = new Set(indexable);

    for (const page of rootPages) {
      const info = pageMap.get(page);
      if (page !== '404.html') {
        if (info.canonical.count !== 1) addIssue('canonical_count', page, `Ожидался один canonical, найдено ${info.canonical.count}`);
        if (info.canonical.href) {
          try {
            const canonical = new URL(info.canonical.href, `https://${SITE_HOST}/${page}`);
            const expected = page === 'index.html' ? '/index.html' : `/${page}`;
            if (normalizePathname(canonical.pathname) !== expected) {
              addIssue('canonical_mismatch', page, `Canonical ведёт на ${canonical.pathname}, ожидался ${expected}`, info.canonical.href);
            }
          } catch {
            addIssue('canonical_malformed', page, 'Некорректный canonical URL', info.canonical.href);
          }
        }
      }
      if (info.noindex && sitemapSet.has(page)) addIssue('noindex_in_sitemap', page, 'Noindex-страница присутствует в sitemap');
      if (!info.noindex && page !== '404.html' && !sitemapSet.has(page)) addIssue('indexable_missing_sitemap', page, 'Индексируемая страница отсутствует в sitemap');
    }
    for (const page of sitemap) {
      if (!pageMap.has(page)) addIssue('sitemap_missing_html', page, 'URL из sitemap не существует как root HTML');
    }

    const incoming = new Map(rootPages.map((page) => [page, new Set()]));
    const resourceTargets = new Map();
    const checkedPageTargets = new Map();
    let internalPageEdges = 0;

    for (const page of rootPages) {
      const info = pageMap.get(page);
      for (const link of info.links) {
        const resolved = resolveInternal(link.href, page);
        if (!resolved) continue;
        if (resolved.malformed) {
          addIssue('malformed_link', page, `Некорректная внутренняя ссылка: ${link.href}`, link.href);
          continue;
        }
        const targetFile = pageFileFromPath(resolved.pathname);
        if (targetFile.endsWith('.html')) {
          internalPageEdges += 1;
          incoming.get(targetFile)?.add(page);
          if (!checkedPageTargets.has(targetFile)) {
            checkedPageTargets.set(targetFile, await request(base, `/${targetFile}`));
          }
          const targetResponse = checkedPageTargets.get(targetFile);
          if (targetResponse.status !== 200) addIssue('broken_internal_link', page, `Ссылка ведёт на HTTP ${targetResponse.status}`, link.href);
          if (resolved.fragment && pageMap.has(targetFile) && !pageMap.get(targetFile).ids.has(resolved.fragment)) {
            addIssue('missing_fragment', page, `Не найден fragment #${resolved.fragment} в ${targetFile}`, link.href);
          }
          if (indexableSet.has(page) && pageMap.get(targetFile)?.noindex) {
            addIssue('indexable_to_noindex', page, `Индексируемая страница ссылается на noindex ${targetFile}`, link.href);
          }
        } else {
          resourceTargets.set(resolved.pathname, { page, raw: link.href, kind: 'anchor-resource' });
        }
      }
      for (const resource of info.resources) {
        const resolved = resolveInternal(resource.value, page);
        if (!resolved || resolved.malformed) continue;
        resourceTargets.set(resolved.pathname, { page, raw: resource.value, kind: resource.kind });
      }
    }

    let brokenTargets = 0;
    for (const [pathname, source] of [...resourceTargets.entries()].sort()) {
      const response = await request(base, pathname, 'HEAD');
      if (response.status !== 200) {
        brokenTargets += 1;
        addIssue('broken_resource', source.page, `${source.kind}: HTTP ${response.status}`, source.raw);
      }
    }

    const orphans = indexable.filter((page) => page !== 'index.html' && (incoming.get(page)?.size || 0) === 0);
    for (const page of orphans) addIssue('indexable_orphan', page, 'Нет входящих внутренних ссылок');

    const missingResponse = await request(base, '/__mp_missing_k9__.html');
    if (missingResponse.status !== 404) addIssue('missing_route_status', '', `Несуществующий URL вернул HTTP ${missingResponse.status}`);
    const robotsResponse = await request(base, '/robots.txt');
    if (robotsResponse.status !== 200) addIssue('robots_status', '', `robots.txt вернул HTTP ${robotsResponse.status}`);
    if (!/Sitemap:\s*https:\/\/mospochin\.ru\/sitemap\.xml/i.test(robotsResponse.text)) {
      addIssue('robots_sitemap', '', 'robots.txt не содержит канонический Sitemap directive');
    }
    const sitemapResponse = await request(base, '/sitemap.xml');
    if (sitemapResponse.status !== 200) addIssue('sitemap_status', '', `sitemap.xml вернул HTTP ${sitemapResponse.status}`);

    const report = {
      schemaVersion: 1,
      scope: 'root-html-and-internal-resources',
      summary: {
        rootHtml: rootPages.length,
        indexableHtml: indexable.length,
        noindexHtml: noindexPages.length,
        sitemapUrls: sitemap.length,
        internalPageEdges,
        uniqueResources: resourceTargets.size,
        brokenTargets,
        indexableOrphans: orphans.length,
        issues: issues.length,
      },
      issues: issues.sort((a, b) => `${a.code}:${a.page}:${a.target || ''}`.localeCompare(`${b.code}:${b.page}:${b.target || ''}`)),
      pages: rootPages.map((page) => ({
        page,
        status: pageMap.get(page).status,
        indexable: page !== '404.html' && !pageMap.get(page).noindex,
        robots: pageMap.get(page).robots,
        canonical: pageMap.get(page).canonical.href,
        incoming: [...(incoming.get(page) || [])].sort(),
      })),
    };

    const jsonText = deterministicReport(report);
    const mdText = markdown(report);
    if (args.check) {
      if (!fs.existsSync(REPORT_JSON) || fs.readFileSync(REPORT_JSON, 'utf8') !== jsonText) {
        console.error('❌ reports/site-crawl.json is stale. Run npm run crawl:site');
        process.exitCode = 1;
      }
      if (!fs.existsSync(REPORT_MD) || fs.readFileSync(REPORT_MD, 'utf8') !== mdText) {
        console.error('❌ reports/site-crawl.md is stale. Run npm run crawl:site');
        process.exitCode = 1;
      }
    } else {
      fs.mkdirSync(path.dirname(REPORT_JSON), { recursive: true });
      fs.writeFileSync(REPORT_JSON, jsonText);
      fs.writeFileSync(REPORT_MD, mdText);
    }

    if (args.json) console.log(jsonText.trim());
    else console.log(`Site crawl: ${rootPages.length} HTML, ${sitemap.length} sitemap URLs, ${issues.length} issues`);
    if (issues.length) {
      for (const issue of issues.slice(0, 50)) console.error(`- ${issue.code}${issue.page ? ` ${issue.page}` : ''}: ${issue.message}${issue.target ? ` (${issue.target})` : ''}`);
      if (issues.length > 50) console.error(`... ещё ${issues.length - 50}`);
      process.exitCode = 1;
    }
  } finally {
    child.kill('SIGTERM');
    setTimeout(() => child.kill('SIGKILL'), 1000).unref();
  }
}

main().catch((error) => {
  console.error(`crawl-site failed: ${error.stack || error.message}`);
  process.exit(1);
});
