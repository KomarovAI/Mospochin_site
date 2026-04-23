import fs from 'fs';
import os from 'os';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_ROOT = path.resolve(__dirname, '..');
const RASTER_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const DEFAULT_JPEG_QUALITY = 4;
const DEFAULT_WEBP_QUALITY = 80;
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

function runGit(args) {
  const result = spawnSync('git', args, {
    cwd: SITE_ROOT,
    encoding: 'utf8',
  });
  if (result.status !== 0) {
    throw new Error(result.stderr?.trim() || result.stdout?.trim() || 'git command failed');
  }
  return result.stdout.trim();
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isZeroSha(value) {
  return isNonEmptyString(value) && /^0+$/.test(value.trim());
}

function normalizeDiffPath(rawPath) {
  if (!isNonEmptyString(rawPath)) return null;
  const trimmed = rawPath.trim();
  if (!trimmed) return null;
  if (trimmed.includes(' -> ')) {
    return trimmed.split(' -> ').pop()?.trim() ?? null;
  }
  return trimmed;
}

function toRasterPaths(files) {
  return [...new Set(files
    .map((item) => normalizeDiffPath(item))
    .filter(Boolean)
    .filter((filePath) => RASTER_EXTENSIONS.has(path.extname(filePath).toLowerCase()))
    .filter((filePath) => fs.existsSync(path.join(SITE_ROOT, filePath))))].sort();
}

function getCandidateFiles(args) {
  if (args.all) {
    const tracked = runGit(['ls-files']).split('\n').filter(Boolean);
    return toRasterPaths(tracked);
  }

  const base = isNonEmptyString(args.base) ? String(args.base) : process.env.GITHUB_BASE_SHA;
  const head = isNonEmptyString(args.head) ? String(args.head) : process.env.GITHUB_SHA;
  if (isNonEmptyString(base) && isNonEmptyString(head) && !isZeroSha(base) && !isZeroSha(head)) {
    const diff = runGit(['diff', '--name-only', '--diff-filter=ACMR', base, head])
      .split('\n')
      .filter(Boolean);
    return toRasterPaths(diff);
  }

  const porcelain = runGit(['status', '--porcelain'])
    .split('\n')
    .filter(Boolean)
    .map((line) => line.slice(3))
    .filter(Boolean);
  return toRasterPaths(porcelain);
}

function commandExists(command) {
  const probe = spawnSync(command, ['-version'], { encoding: 'utf8' });
  return probe.status === 0;
}

function buildFfmpegArgs(inputPath, outputPath, extension, jpegQuality, webpQuality) {
  if (extension === '.jpg' || extension === '.jpeg') {
    return ['-y', '-loglevel', 'error', '-i', inputPath, '-map_metadata', '-1', '-q:v', String(jpegQuality), outputPath];
  }

  if (extension === '.png') {
    return ['-y', '-loglevel', 'error', '-i', inputPath, '-map_metadata', '-1', '-compression_level', '100', outputPath];
  }

  return ['-y', '-loglevel', 'error', '-i', inputPath, '-map_metadata', '-1', '-compression_level', '6', '-q:v', String(webpQuality), outputPath];
}

function optimizeFile(filePath, tempDir, jpegQuality, webpQuality, dryRun) {
  const absolutePath = path.join(SITE_ROOT, filePath);
  const extension = path.extname(filePath).toLowerCase();
  const originalSize = fs.statSync(absolutePath).size;
  const safeFileName = filePath.replace(/[\\/]/g, '__');
  const tmpOutput = path.join(tempDir, `${safeFileName}.optimized${extension}`);
  const ffmpegArgs = buildFfmpegArgs(absolutePath, tmpOutput, extension, jpegQuality, webpQuality);
  const result = spawnSync('ffmpeg', ffmpegArgs, { encoding: 'utf8' });

  if (result.status !== 0 || !fs.existsSync(tmpOutput)) {
    return { filePath, status: 'failed', reason: result.stderr?.trim() || 'ffmpeg failed' };
  }

  const optimizedSize = fs.statSync(tmpOutput).size;
  const savedBytes = originalSize - optimizedSize;
  if (savedBytes < MIN_SAVING_BYTES) {
    return { filePath, status: 'skipped', originalSize, optimizedSize, savedBytes };
  }

  if (!dryRun) {
    fs.copyFileSync(tmpOutput, absolutePath);
  }

  return { filePath, status: dryRun ? 'would-update' : 'updated', originalSize, optimizedSize, savedBytes };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const dryRun = Boolean(args['dry-run']);
  const jpegQuality = Number.parseInt(String(args['jpeg-quality'] ?? DEFAULT_JPEG_QUALITY), 10);
  const webpQuality = Number.parseInt(String(args['webp-quality'] ?? DEFAULT_WEBP_QUALITY), 10);

  if (!commandExists('ffmpeg')) {
    console.log('optimize:images skipped: ffmpeg is not available in PATH');
    return;
  }

  const files = getCandidateFiles(args);
  if (files.length === 0) {
    console.log('optimize:images: no changed raster files found');
    return;
  }

  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mospochin-image-opt-'));
  const results = [];
  try {
    files.forEach((filePath) => {
      results.push(optimizeFile(filePath, tempDir, jpegQuality, webpQuality, dryRun));
    });
  } finally {
    fs.rmSync(tempDir, { recursive: true, force: true });
  }

  let totalSaved = 0;
  let updatedCount = 0;
  results.forEach((item) => {
    if (item.status === 'updated' || item.status === 'would-update') {
      updatedCount += 1;
      totalSaved += item.savedBytes ?? 0;
      const action = item.status === 'updated' ? 'updated' : 'would update';
      console.log(`${action}: ${item.filePath} (-${item.savedBytes} bytes)`);
      return;
    }
    if (item.status === 'failed') {
      console.warn(`failed: ${item.filePath} (${item.reason})`);
    }
  });

  console.log(`optimize:images scanned ${files.length} file(s), improved ${updatedCount}, saved ${totalSaved} bytes`);
  if (dryRun) {
    console.log('dry-run mode: no files were modified');
  }
}

main();
