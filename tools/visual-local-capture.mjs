#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { getAuditContractSummary, getDefaultArtifactDir, getSiteRoot } from './screenshot-audit-lib.mjs';
import { probePillowStitcher, resolveSystemChromium } from './visual-local-runtime.mjs';

const ROOT = getSiteRoot();
const NODE = process.execPath;
const SELF_DIR = path.dirname(fileURLToPath(import.meta.url));
const AUDIT_SCRIPT = path.join(SELF_DIR, 'audit-screenshots.mjs');
const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith('--')) {
      result[key] = true;
    } else {
      result[key] = next;
      index += 1;
    }
  }
  return result;
}

function usage() {
  console.log(`Usage:
  node tools/visual-local-capture.mjs --manifest data/visual-smoke-audit.json [options]

Options:
  --mode first-view|full-page|manifest|both   Capture mode (default: manifest)
  --output <dir>                              Artifact directory
  --page a.html,b.html                        Limit capture to selected manifest pages
  --workers <n>                               Parallel isolated page workers (default: 2)
  --worker-timeout-ms <n>                     Timeout for one page process (default: 120000)
  --retries <n>                               Retries after a page worker failure (default: 1)
  --fresh                                     Delete existing output before capture
  --json                                      Print machine-readable summary

Default behavior is resumable. A page is skipped only when its PNG files and visual fingerprint
match the current HTML, manifest and local visual assets. The command uses preinstalled system
Chromium plus Playwright local-content routing; it never downloads a browser or navigates localhost.`);
}

function sha256Buffer(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function sha256File(filePath) {
  return sha256Buffer(fs.readFileSync(filePath));
}

function listFilesRecursively(rootDir) {
  if (!fs.existsSync(rootDir)) return [];
  const files = [];
  const stack = [rootDir];
  while (stack.length) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(fullPath);
      else if (entry.isFile()) files.push(fullPath);
    }
  }
  return files.sort();
}

function computeVisualBaseFingerprint(manifestPath) {
  const candidates = [
    path.resolve(ROOT, manifestPath),
    ...listFilesRecursively(path.join(ROOT, 'assets')),
    ...fs.readdirSync(ROOT)
      .filter((name) => /\.(?:css|js|mjs)$/i.test(name))
      .map((name) => path.join(ROOT, name)),
  ];
  const unique = [...new Set(candidates.filter((filePath) => fs.existsSync(filePath)))].sort();
  const hash = crypto.createHash('sha256');
  for (const filePath of unique) {
    hash.update(path.relative(ROOT, filePath));
    hash.update('\0');
    hash.update(fs.readFileSync(filePath));
    hash.update('\0');
  }
  return hash.digest('hex');
}

function computePageFingerprint(baseFingerprint, pageName) {
  const pagePath = path.join(ROOT, pageName);
  const hash = crypto.createHash('sha256');
  hash.update(baseFingerprint);
  hash.update('\0');
  hash.update(pageName);
  hash.update('\0');
  hash.update(fs.readFileSync(pagePath));
  return hash.digest('hex');
}

function isValidPng(filePath) {
  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) return false;
  const data = fs.readFileSync(filePath);
  return data.length > PNG_SIGNATURE.length && data.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE);
}

function expectedFile(outputDir, pageName, viewportId) {
  return path.join(outputDir, `${pageName.replace(/\.html$/, '')}.${viewportId}.png`);
}

function pageStatePath(outputDir, pageName) {
  return path.join(outputDir, '.state', `${pageName.replace(/\.html$/, '')}.json`);
}

function readJson(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch {
    return null;
  }
}

function isPageCurrent({ outputDir, pageName, viewportIds, mode, fingerprint }) {
  const state = readJson(pageStatePath(outputDir, pageName));
  if (!state || state.mode !== mode || state.fingerprint !== fingerprint || state.page !== pageName) return false;
  return viewportIds.every((viewportId) => isValidPng(expectedFile(outputDir, pageName, viewportId)));
}

function writePageState({ outputDir, pageName, viewportIds, mode, fingerprint }) {
  const stateDir = path.join(outputDir, '.state');
  fs.mkdirSync(stateDir, { recursive: true });
  const screenshots = viewportIds.map((viewportId) => {
    const filePath = expectedFile(outputDir, pageName, viewportId);
    return {
      viewport: viewportId,
      file: path.relative(ROOT, filePath),
      bytes: fs.statSync(filePath).size,
      sha256: sha256File(filePath),
    };
  });
  fs.writeFileSync(pageStatePath(outputDir, pageName), `${JSON.stringify({
    schemaVersion: 1,
    page: pageName,
    mode,
    fingerprint,
    capturedAt: new Date().toISOString(),
    screenshots,
  }, null, 2)}\n`);
}

function safeLogName(pageName) {
  return pageName.replace(/[^a-zA-Z0-9_.-]+/g, '_').replace(/\.html$/, '');
}

function runChild(args, { timeoutMs, label, logDir, attempt }) {
  return new Promise((resolve) => {
    fs.mkdirSync(logDir, { recursive: true });
    const child = spawn(NODE, [AUDIT_SCRIPT, ...args], {
      cwd: ROOT,
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGTERM');
      setTimeout(() => {
        if (child.exitCode == null) child.kill('SIGKILL');
      }, 1500).unref();
    }, timeoutMs);

    child.stdout.on('data', (chunk) => { stdout += chunk.toString(); });
    child.stderr.on('data', (chunk) => {
      const text = chunk.toString();
      stderr += text;
      process.stderr.write(`[${label}] ${text}`);
    });
    child.on('close', (code, signal) => {
      clearTimeout(timer);
      const stem = `${safeLogName(label)}.attempt-${attempt}`;
      fs.writeFileSync(path.join(logDir, `${stem}.stdout.log`), stdout);
      fs.writeFileSync(path.join(logDir, `${stem}.stderr.log`), stderr);
      resolve({ code, signal, stdout, stderr, timedOut });
    });
  });
}

async function runQueue(items, workers, handler) {
  const queue = [...items];
  const results = [];
  const pool = Array.from({ length: Math.min(workers, queue.length) }, async () => {
    while (queue.length) {
      const item = queue.shift();
      results.push(await handler(item));
    }
  });
  await Promise.all(pool);
  return results;
}

function resolveModes(mode) {
  if (mode === 'both') return ['first-view', 'full-page'];
  if (['first-view', 'full-page', 'manifest'].includes(mode)) return [mode];
  throw new Error(`Unsupported --mode: ${mode}`);
}

function clearPageArtifacts(outputDir, pageName, viewportIds) {
  const stem = pageName.replace(/\.html$/, '');
  for (const viewportId of viewportIds) {
    fs.rmSync(expectedFile(outputDir, pageName, viewportId), { force: true });
    for (const fileName of fs.existsSync(outputDir) ? fs.readdirSync(outputDir) : []) {
      if (fileName.startsWith(`${stem}.${viewportId}.part-`) && fileName.endsWith('.png')) {
        fs.rmSync(path.join(outputDir, fileName), { force: true });
      }
    }
  }
}

async function captureMode({
  manifestPath,
  manifest,
  pages,
  outputDir,
  mode,
  workers,
  workerTimeoutMs,
  retries,
  pageFingerprints,
  jsonMode,
}) {
  fs.mkdirSync(outputDir, { recursive: true });
  const viewportIds = manifest.viewports.map((viewport) => viewport.id);
  const pendingPages = [];
  const skippedPages = [];
  for (const pageName of pages) {
    if (isPageCurrent({ outputDir, pageName, viewportIds, mode, fingerprint: pageFingerprints[pageName] })) skippedPages.push(pageName);
    else pendingPages.push(pageName);
  }

  if (!jsonMode) {
    console.error(`[visual-local] ${mode}: pending=${pendingPages.length}, current=${skippedPages.length}, workers=${workers}`);
  }

  const modeArgs = mode === 'first-view'
    ? ['--viewport-only']
    : mode === 'full-page'
      ? ['--full-page']
      : [];
  const logDir = path.join(outputDir, '.logs');
  const startedAt = new Date().toISOString();

  const workerResults = await runQueue(pendingPages, workers, async (pageName) => {
    const args = [
      '--browser', 'chromium',
      '--local-content',
      '--browser-page-batch', '1',
      '--manifest', manifestPath,
      '--page', pageName,
      '--output', path.relative(ROOT, outputDir),
      ...modeArgs,
    ];

    let lastResult = null;
    for (let attempt = 1; attempt <= retries + 1; attempt += 1) {
      clearPageArtifacts(outputDir, pageName, viewportIds);
      if (!jsonMode) console.error(`[visual-local] ${mode}: ${pageName} (attempt ${attempt}/${retries + 1})`);
      lastResult = await runChild(args, {
        timeoutMs: workerTimeoutMs,
        label: `${mode}-${pageName}`,
        logDir,
        attempt,
      });
      const artifactsValid = viewportIds.every((viewportId) => isValidPng(expectedFile(outputDir, pageName, viewportId)));
      if (artifactsValid && (lastResult.code === 0 || lastResult.timedOut)) {
        writePageState({ outputDir, pageName, viewportIds, mode, fingerprint: pageFingerprints[pageName] });
        const stem = pageName.replace(/\.html$/, '');
        for (const fileName of fs.readdirSync(outputDir)) {
          if (fileName.startsWith(`${stem}.`) && fileName.includes('.part-') && fileName.endsWith('.png')) {
            fs.rmSync(path.join(outputDir, fileName), { force: true });
          }
        }
        if (lastResult.timedOut && !jsonMode) {
          console.error(`[visual-local] accepted ${pageName}: PNG complete; worker timed out only during browser teardown`);
        }
        return {
          page: pageName,
          attempts: attempt,
          skipped: false,
          artifactsValid: true,
          teardownTimedOut: Boolean(lastResult.timedOut),
          ...lastResult,
          code: 0,
          timedOut: false,
        };
      }
      if (!jsonMode) {
        console.error(`[visual-local] retrying ${pageName}: code=${lastResult.code}, signal=${lastResult.signal || 'none'}, timeout=${lastResult.timedOut}`);
      }
    }
    return { page: pageName, attempts: retries + 1, skipped: false, artifactsValid: false, ...lastResult };
  });

  const failures = workerResults.filter((result) => result.code !== 0 || result.timedOut || !result.artifactsValid);
  if (failures.length) {
    for (const failure of failures) {
      console.error(`\n❌ visual worker failed: ${failure.page} (code=${failure.code}, signal=${failure.signal || 'none'}, timeout=${failure.timedOut})`);
      if (failure.stderr.trim()) console.error(failure.stderr.trim());
      if (failure.stdout.trim()) console.error(failure.stdout.trim());
    }
    throw new Error(`${failures.length} visual worker(s) failed in ${mode} mode`);
  }

  const screenshots = [];
  const errors = [];
  for (const pageName of pages) {
    for (const viewport of manifest.viewports) {
      const filePath = expectedFile(outputDir, pageName, viewport.id);
      if (!isValidPng(filePath)) {
        errors.push(`${pageName}/${viewport.id}: invalid or missing ${path.relative(ROOT, filePath)}`);
        continue;
      }
      screenshots.push({
        page: pageName,
        viewport: viewport.id,
        file: path.relative(ROOT, filePath),
        bytes: fs.statSync(filePath).size,
        sha256: sha256File(filePath),
      });
    }
  }
  if (errors.length) throw new Error(`Screenshot artifact validation failed:\n- ${errors.join('\n- ')}`);

  const summary = {
    schemaVersion: 1,
    startedAt,
    completedAt: new Date().toISOString(),
    runtime: {
      browser: 'system-chromium',
      executable: resolveSystemChromium(),
      transport: 'playwright-local-content',
      navigation: 'page.setContent + route.fulfill',
      platform: `${os.platform()} ${os.release()} ${os.arch()}`,
      node: process.version,
    },
    fingerprint: sha256Buffer(Buffer.from(pages.map((pageName) => pageFingerprints[pageName]).join('\n'))),
    pageFingerprints,
    manifest: manifestPath,
    mode,
    workers,
    workerTimeoutMs,
    retries,
    resumedPages: skippedPages,
    capturedPages: workerResults.map((result) => result.page),
    artifactDir: path.relative(ROOT, outputDir),
    pages,
    viewports: viewportIds,
    screenshots,
  };
  fs.writeFileSync(path.join(outputDir, 'visual-run.json'), `${JSON.stringify(summary, null, 2)}\n`);
  return summary;
}

try {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    usage();
    process.exit(0);
  }
  const manifestPath = String(args.manifest || 'data/visual-smoke-audit.json');
  const { manifest, errors } = getAuditContractSummary(manifestPath);
  if (errors.length) throw new Error(`Screenshot audit contract failed:\n- ${errors.join('\n- ')}`);
  if (manifest.status === 'planned' && manifest.pages.length === 0) {
    const summary = { schemaVersion: 1, manifest: manifestPath, status: 'planned', screenshots: [], message: 'No published pages yet; activate in K3.' };
    if (args.json) console.log(JSON.stringify(summary, null, 2));
    else console.log('✅ local native visual capture skipped: planned manifest has no published pages (activate in K3)');
    process.exit(0);
  }

  const systemChromium = resolveSystemChromium();
  if (!systemChromium) throw new Error('System Chromium is unavailable; run npm run check:visual-env for diagnostics.');

  const requestedPages = args.page
    ? String(args.page).split(',').map((value) => value.trim()).filter(Boolean)
    : manifest.pages.map((entry) => entry.page);
  const knownPages = new Set(manifest.pages.map((entry) => entry.page));
  const unknownPages = requestedPages.filter((page) => !knownPages.has(page));
  if (unknownPages.length) throw new Error(`Pages are not present in ${manifestPath}: ${unknownPages.join(', ')}`);

  const explicitWorkersRaw = args.workers || process.env.VISUAL_LOCAL_WORKERS || null;
  const explicitWorkers = explicitWorkersRaw == null
    ? null
    : Math.max(1, Math.min(8, Number(explicitWorkersRaw) || 1));
  const workerTimeoutMs = Math.max(15000, Number(args['worker-timeout-ms'] || process.env.VISUAL_WORKER_TIMEOUT_MS || 60000) || 60000);
  const retries = Math.max(0, Math.min(3, Number(args.retries || process.env.VISUAL_LOCAL_RETRIES || 1) || 0));
  const mode = String(args.mode || 'manifest');
  const modes = resolveModes(mode);
  if (modes.includes('full-page')) {
    const pillow = probePillowStitcher();
    if (!pillow.available) {
      throw new Error(`Full-page capture requires Python Pillow for deterministic mobile stitching: ${pillow.error || 'not installed'}`);
    }
  }
  const defaultRoot = path.resolve(ROOT, getDefaultArtifactDir(manifest), 'native');
  const requestedOutput = path.resolve(ROOT, String(args.output || defaultRoot));
  const baseFingerprint = computeVisualBaseFingerprint(manifestPath);
  const pageFingerprints = Object.fromEntries(
    requestedPages.map((pageName) => [pageName, computePageFingerprint(baseFingerprint, pageName)]),
  );
  const fingerprint = sha256Buffer(Buffer.from(requestedPages.map((pageName) => pageFingerprints[pageName]).join('\n')));

  if (args.fresh) fs.rmSync(requestedOutput, { recursive: true, force: true });
  const summaries = [];
  for (const currentMode of modes) {
    const modeOutput = modes.length > 1 ? path.join(requestedOutput, currentMode) : requestedOutput;
    summaries.push(await captureMode({
      manifestPath,
      manifest,
      pages: requestedPages,
      outputDir: modeOutput,
      mode: currentMode,
      workers: explicitWorkers ?? (currentMode === 'full-page' ? 1 : 2),
      workerTimeoutMs,
      retries,
      pageFingerprints,
      jsonMode: Boolean(args.json),
    }));
  }

  const finalSummary = {
    schemaVersion: 1,
    primaryExecution: 'local-native',
    githubFallback: 'manual-workflow-dispatch-only',
    manifest: manifestPath,
    fingerprint,
    modes: summaries,
  };
  fs.mkdirSync(requestedOutput, { recursive: true });
  fs.writeFileSync(path.join(requestedOutput, 'visual-capture-summary.json'), `${JSON.stringify(finalSummary, null, 2)}\n`);

  if (args.json) {
    console.log(JSON.stringify(finalSummary, null, 2));
  } else {
    const count = summaries.reduce((total, item) => total + item.screenshots.length, 0);
    const resumed = summaries.reduce((total, item) => total + item.resumedPages.length, 0);
    console.log(`\n✅ local native visual capture passed: ${count} PNG file(s)`);
    console.log(`- Chromium: ${systemChromium}`);
    console.log('- transport: Playwright setContent + local route.fulfill');
    console.log(`- resumed pages: ${resumed}`);
    console.log(`- artifacts: ${path.relative(ROOT, requestedOutput)}`);
    console.log('- GitHub: manual fallback only');
  }
} catch (error) {
  console.error(`❌ local native visual capture failed\n${String(error?.stack || error)}`);
  process.exit(1);
}
