import fs from 'fs';
import os from 'os';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_ROOT = path.resolve(__dirname, '..');
const MANIFEST_PATH = path.join(SITE_ROOT, '.deploy', 'include-files.txt');
const SOURCE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png']);
const DEFAULT_WEBP_QUALITY = 78;
const MIN_SAVING_BYTES = 1024;

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith('--')) {
      args[key] = true;
      continue;
    }
    args[key] = next;
    index += 1;
  }
  return args;
}

function commandExists(command) {
  const probe = spawnSync(command, ['-version'], { encoding: 'utf8' });
  return probe.status === 0;
}

function runNodeScript(scriptName) {
  const result = spawnSync(process.execPath, [path.join(SITE_ROOT, 'tools', scriptName)], {
    cwd: SITE_ROOT,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    throw new Error(result.stderr?.trim() || result.stdout?.trim() || `${scriptName} failed`);
  }
}

function readManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    runNodeScript('generate-deploy-manifest.mjs');
  }

  return fs.readFileSync(MANIFEST_PATH, 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function collectSources(manifestEntries) {
  return manifestEntries
    .filter((entry) => entry.startsWith('assets/'))
    .filter((entry) => SOURCE_EXTENSIONS.has(path.extname(entry).toLowerCase()))
    .filter((entry) => fs.existsSync(path.join(SITE_ROOT, entry)))
    .sort();
}

function generateSidecar(sourcePath, tempDir, webpQuality, dryRun) {
  const absoluteSource = path.join(SITE_ROOT, sourcePath);
  const outputPath = `${absoluteSource}.webp`;
  const relativeOutput = `${sourcePath}.webp`;
  const tempOutput = path.join(tempDir, `${sourcePath.replace(/[\\/]/g, '__')}.webp`);
  const originalSize = fs.statSync(absoluteSource).size;
  const result = spawnSync('ffmpeg', [
    '-y',
    '-loglevel',
    'error',
    '-i',
    absoluteSource,
    '-map_metadata',
    '-1',
    '-c:v',
    'libwebp',
    '-q:v',
    String(webpQuality),
    tempOutput,
  ], { encoding: 'utf8' });

  if (result.status !== 0 || !fs.existsSync(tempOutput)) {
    return { sourcePath, status: 'failed', reason: result.stderr?.trim() || 'ffmpeg failed' };
  }

  const webpSize = fs.statSync(tempOutput).size;
  const savedBytes = originalSize - webpSize;
  if (savedBytes < MIN_SAVING_BYTES) {
    if (fs.existsSync(outputPath)) {
      return { sourcePath, relativeOutput, status: 'unexpected-sidecar', originalSize, webpSize, savedBytes };
    }
    return { sourcePath, status: 'skipped', originalSize, webpSize, savedBytes };
  }

  const previousSize = fs.existsSync(outputPath) ? fs.statSync(outputPath).size : null;
  const current = fs.existsSync(outputPath) ? fs.readFileSync(outputPath) : null;
  const generated = fs.readFileSync(tempOutput);
  if (current && Buffer.compare(current, generated) === 0) {
    return {
      sourcePath,
      relativeOutput,
      status: 'current',
      originalSize,
      previousSize,
      webpSize,
      savedBytes,
    };
  }

  if (!dryRun) {
    fs.copyFileSync(tempOutput, outputPath);
  }

  return {
    sourcePath,
    relativeOutput,
    status: dryRun ? 'would-update' : 'updated',
    originalSize,
    previousSize,
    webpSize,
    savedBytes,
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const check = Boolean(args.check);
  const dryRun = check || Boolean(args['dry-run']);
  const webpQuality = Number.parseInt(String(args['webp-quality'] ?? DEFAULT_WEBP_QUALITY), 10);

  if (!commandExists('ffmpeg')) {
    console.log('generate:webp-sidecars skipped: ffmpeg is not available in PATH');
    return;
  }

  const sources = collectSources(readManifest());
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mospochin-webp-sidecars-'));
  const results = [];
  try {
    sources.forEach((sourcePath) => {
      results.push(generateSidecar(sourcePath, tempDir, webpQuality, dryRun));
    });
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }

  let updatedCount = 0;
  let currentCount = 0;
  let checkFailureCount = 0;
  let totalOriginalBytes = 0;
  let totalWebpBytes = 0;
  results.forEach((item) => {
    if (item.status === 'current') {
      currentCount += 1;
      totalOriginalBytes += item.originalSize ?? 0;
      totalWebpBytes += item.webpSize ?? 0;
      return;
    }
    if (item.status === 'updated' || item.status === 'would-update') {
      updatedCount += 1;
      totalOriginalBytes += item.originalSize ?? 0;
      totalWebpBytes += item.webpSize ?? 0;
      const action = item.status === 'updated' ? 'updated' : 'would update';
      console.log(`${action}: ${item.relativeOutput} (${item.originalSize} -> ${item.webpSize} bytes)`);
      if (check) {
        checkFailureCount += 1;
      }
      return;
    }
    if (item.status === 'unexpected-sidecar') {
      checkFailureCount += 1;
      console.warn(`unexpected sidecar: ${item.relativeOutput} is not at least ${MIN_SAVING_BYTES} bytes smaller than source`);
    }
    if (item.status === 'failed') {
      checkFailureCount += 1;
      console.warn(`failed: ${item.sourcePath} (${item.reason})`);
    }
  });

  const savedBytes = totalOriginalBytes - totalWebpBytes;
  console.log(`generate:webp-sidecars scanned ${sources.length} file(s), current ${currentCount}, improved ${updatedCount}, webp savings ${savedBytes} bytes`);
  if (dryRun) {
    console.log('dry-run mode: no files were modified');
  }
  if (checkFailureCount > 0) {
    console.error(`check:webp-sidecars failed: ${checkFailureCount} sidecar file(s) are missing, stale, or unexpected`);
    process.exit(1);
  }
}

main();
