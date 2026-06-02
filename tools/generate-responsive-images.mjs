import fs from 'fs';
import os from 'os';
import path from 'path';
import crypto from 'crypto';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_ROOT = path.resolve(__dirname, '..');
const RESPONSIVE_DIR = path.join(SITE_ROOT, 'assets/images/responsive');
const SOURCE_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png']);
const WIDTHS = [768, 1200, 1600];
const MIN_SOURCE_BYTES = 80 * 1024;
const JPEG_QUALITY = 3; // ffmpeg q:v: lower is better quality. 3 keeps a visually safe production derivative.
const PNG_COMPRESSION = 9;
const DEFAULT_IMG_SIZES = '(max-width: 768px) 100vw, 800px';
const CARD_IMG_SIZES = '(max-width: 768px) 100vw, 600px';

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

function commandExists(command, args = ['-version']) {
  const result = spawnSync(command, args, { encoding: 'utf8' });
  return result.status === 0;
}

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function sitePathFromUrl(rawUrl, fromFile) {
  if (!rawUrl) return null;
  const trimmed = rawUrl.trim().replace(/^['"]|['"]$/g, '').split(/[?#]/, 1)[0];
  if (!trimmed || trimmed.startsWith('http:') || trimmed.startsWith('https:') || trimmed.startsWith('//') || trimmed.startsWith('data:')) return null;
  const resolved = trimmed.startsWith('/')
    ? trimmed.slice(1)
    : toPosix(path.normalize(path.join(path.dirname(fromFile), trimmed)));
  if (resolved.startsWith('../')) return null;
  if (!resolved.startsWith('assets/images/')) return null;
  if (resolved.startsWith('assets/images/responsive/')) return null;
  if (resolved.startsWith('assets/images/flags/')) return null;
  if (!SOURCE_EXTENSIONS.has(path.extname(resolved).toLowerCase())) return null;
  return resolved;
}

function responsivePathFromUrl(rawUrl, fromFile) {
  if (!rawUrl) return null;
  const trimmed = rawUrl.trim().replace(/^['"]|['"]$/g, '').split(/[?#]/, 1)[0];
  if (!trimmed || trimmed.startsWith('http:') || trimmed.startsWith('https:') || trimmed.startsWith('//') || trimmed.startsWith('data:')) return null;
  const resolved = trimmed.startsWith('/')
    ? trimmed.slice(1)
    : toPosix(path.normalize(path.join(path.dirname(fromFile), trimmed)));
  if (resolved.startsWith('../')) return null;
  if (!resolved.startsWith('assets/images/responsive/')) return null;
  if (!SOURCE_EXTENSIONS.has(path.extname(resolved).toLowerCase())) return null;
  return resolved;
}

function sourcePathFromResponsive(relativePath) {
  const parsed = path.parse(relativePath);
  const match = parsed.name.match(/^(.*)-(\d+)w$/);
  if (!match) return null;
  const base = match[1];
  const extension = parsed.ext.toLowerCase();
  const candidates = [
    `assets/images/${base}${extension}`,
    extension === '.jpg' ? `assets/images/${base}.jpeg` : null,
    extension === '.jpeg' ? `assets/images/${base}.jpg` : null,
  ].filter(Boolean);
  return candidates.find((candidate) => fs.existsSync(path.join(SITE_ROOT, candidate))) ?? null;
}

function urlFor(sitePath, originalUrl) {
  return originalUrl?.startsWith('/') ? `/${sitePath}` : sitePath;
}

function htmlFiles() {
  return fs.readdirSync(SITE_ROOT, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
    .map((entry) => entry.name)
    .sort();
}

function getDimensions(relativePath) {
  const absolutePath = path.join(SITE_ROOT, relativePath);
  const ffprobe = spawnSync('ffprobe', [
    '-v', 'error',
    '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height',
    '-of', 'json',
    absolutePath,
  ], { encoding: 'utf8' });
  if (ffprobe.status !== 0) {
    throw new Error(`ffprobe failed for ${relativePath}: ${ffprobe.stderr?.trim() || ffprobe.stdout?.trim()}`);
  }
  const data = JSON.parse(ffprobe.stdout);
  const stream = data.streams?.[0];
  if (!stream?.width || !stream?.height) throw new Error(`Unable to read dimensions for ${relativePath}`);
  return { width: stream.width, height: stream.height };
}

function outputPathFor(sourcePath, width) {
  const parsed = path.parse(sourcePath);
  const safeBase = parsed.name.replace(/[^a-z0-9_-]+/gi, '-').replace(/-+/g, '-').toLowerCase();
  const ext = parsed.ext.toLowerCase() === '.jpg' ? '.jpg' : parsed.ext.toLowerCase();
  return `assets/images/responsive/${safeBase}-${width}w${ext}`;
}

function collectImageReferences(files) {
  const references = new Map();
  const usedResponsiveOutputs = new Set();

  function addSourceReference(sourcePath, fileName, kind) {
    if (!sourcePath) return;
    const item = references.get(sourcePath) ?? { usedInImg: false, usedInBackground: false, files: new Set() };
    if (kind === 'img') item.usedInImg = true;
    if (kind === 'background') item.usedInBackground = true;
    item.files.add(fileName);
    references.set(sourcePath, item);
  }

  function addUrl(rawUrl, fileName, kind) {
    const responsivePath = responsivePathFromUrl(rawUrl, fileName);
    if (responsivePath) {
      usedResponsiveOutputs.add(responsivePath);
      addSourceReference(sourcePathFromResponsive(responsivePath), fileName, kind);
      return;
    }
    addSourceReference(sitePathFromUrl(rawUrl, fileName), fileName, kind);
  }

  for (const fileName of files) {
    const content = fs.readFileSync(path.join(SITE_ROOT, fileName), 'utf8');
    for (const match of content.matchAll(/<img\b[^>]*\bsrc\s*=\s*(["'])(.*?)\1[^>]*>/gis)) {
      addUrl(match[2], fileName, 'img');
      const srcset = match[0].match(/\ssrcset\s*=\s*(["'])(.*?)\1/i)?.[2] ?? '';
      for (const candidate of srcset.split(',')) {
        addUrl(candidate.trim().split(/\s+/)[0], fileName, 'img');
      }
    }
    for (const match of content.matchAll(/url\(\s*(["']?)(.*?)\1\s*\)/gis)) {
      addUrl(match[2], fileName, 'background');
    }
  }
  return { references, usedResponsiveOutputs };
}

function generateDerivative(sourcePath, width, check) {
  const absoluteSource = path.join(SITE_ROOT, sourcePath);
  const relativeOutput = outputPathFor(sourcePath, width);
  const absoluteOutput = path.join(SITE_ROOT, relativeOutput);
  if (fs.existsSync(absoluteOutput)) {
    const sourceStat = fs.statSync(absoluteSource);
    const outputStat = fs.statSync(absoluteOutput);
    if (outputStat.mtimeMs >= sourceStat.mtimeMs && outputStat.size < sourceStat.size) {
      return {
        sourcePath,
        relativeOutput,
        width,
        status: 'current',
        sourceSize: sourceStat.size,
        outputSize: outputStat.size,
      };
    }
  }
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'mospochin-responsive-'));
  const tempOutput = path.join(tempDir, path.basename(relativeOutput));
  const extension = path.extname(sourcePath).toLowerCase();
  const args = [
    '-y',
    '-loglevel', 'error',
    '-i', absoluteSource,
    '-vf', `scale=${width}:-2:flags=lanczos`,
    '-map_metadata', '-1',
  ];

  if (extension === '.png') {
    args.push('-compression_level', String(PNG_COMPRESSION));
  } else {
    args.push('-q:v', String(JPEG_QUALITY));
  }
  args.push(tempOutput);

  const result = spawnSync('ffmpeg', args, { encoding: 'utf8' });
  if (result.status !== 0 || !fs.existsSync(tempOutput)) {
    fs.rmSync(tempDir, { recursive: true, force: true });
    throw new Error(`ffmpeg failed for ${sourcePath} ${width}w: ${result.stderr?.trim() || 'no output'}`);
  }

  const sourceSize = fs.statSync(absoluteSource).size;
  const outputSize = fs.statSync(tempOutput).size;
  if (outputSize >= sourceSize) {
    fs.rmSync(tempDir, { recursive: true, force: true });
    return { sourcePath, relativeOutput, width, status: 'skipped-larger', sourceSize, outputSize };
  }

  const previous = fs.existsSync(absoluteOutput) ? fs.readFileSync(absoluteOutput) : null;
  const generated = fs.readFileSync(tempOutput);
  const isCurrent = previous && Buffer.compare(previous, generated) === 0;
  if (!isCurrent && !check) {
    fs.mkdirSync(path.dirname(absoluteOutput), { recursive: true });
    fs.copyFileSync(tempOutput, absoluteOutput);
  }
  fs.rmSync(tempDir, { recursive: true, force: true });
  return {
    sourcePath,
    relativeOutput,
    width,
    sourceSize,
    outputSize,
    status: isCurrent ? 'current' : (check ? 'would-update' : 'updated'),
  };
}

function chooseWidths(sourceDimensions, sourceSize) {
  if (sourceSize < MIN_SOURCE_BYTES) return [];
  return WIDTHS.filter((width) => width < sourceDimensions.width);
}

function addOrReplaceAttr(tag, name, value) {
  const escaped = value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
  const attrPattern = new RegExp(`\\s${name}\\s*=\\s*("[^"]*"|'[^']*')`, 'i');
  if (attrPattern.test(tag)) {
    return tag.replace(attrPattern, ` ${name}="${escaped}"`);
  }
  return tag.replace(/\s*\/?>$/, (ending) => ` ${name}="${escaped}"${ending}`);
}

function removeAttr(tag, name) {
  return tag.replace(new RegExp(`\\s${name}\\s*=\\s*("[^"]*"|'[^']*')`, 'gi'), '');
}

function getAttr(tag, name) {
  const match = tag.match(new RegExp(`\\s${name}\\s*=\\s*(["'])(.*?)\\1`, 'i'));
  return match?.[2] ?? null;
}

function defaultImgSource(variants) {
  const preferred = variants.find((item) => item.width >= 1200) ?? variants.at(-1);
  return preferred?.relativeOutput ?? null;
}

function backgroundSource(variants) {
  return variants.find((item) => item.width >= 1920)?.relativeOutput
    ?? variants.find((item) => item.width >= 1600)?.relativeOutput
    ?? variants.find((item) => item.width >= 1200)?.relativeOutput
    ?? null;
}

function imgSizes(tag) {
  const width = Number.parseInt(getAttr(tag, 'width') ?? '', 10);
  if (Number.isFinite(width) && width > 0 && width <= 640) return CARD_IMG_SIZES;
  if (/loading\s*=\s*["']lazy["']/i.test(tag)) return CARD_IMG_SIZES;
  return DEFAULT_IMG_SIZES;
}

function updateHtmlFiles(files, variantsBySource, check) {
  const changedFiles = [];
  for (const fileName of files) {
    const absolutePath = path.join(SITE_ROOT, fileName);
    const original = fs.readFileSync(absolutePath, 'utf8');
    let content = original;

    // Remove invalid <source type="image/webp"> tags that point to JPEG/PNG files.
    content = content.replace(/\s*<source\b[^>]*\bsrcset\s*=\s*(["'])(.*?)\1[^>]*\btype\s*=\s*(["'])image\/webp\3[^>]*>/gis, (match, quote, srcset) => {
      return /\.webp(?:\s|$|,)/i.test(srcset) ? match : '';
    });

    content = content.replace(/<img\b[^>]*\bsrc\s*=\s*(["'])(.*?)\1[^>]*>/gis, (tag, quote, src) => {
      const sourcePath = sitePathFromUrl(src, fileName);
      if (!sourcePath) return tag;
      const variants = variantsBySource.get(sourcePath) ?? [];
      if (!variants.length) return tag;
      const srcset = variants.map((item) => `${urlFor(item.relativeOutput, src)} ${item.width}w`).join(', ');
      let next = tag;
      next = removeAttr(next, 'srcset');
      next = removeAttr(next, 'sizes');
      const defaultSource = defaultImgSource(variants);
      if (defaultSource) next = addOrReplaceAttr(next, 'src', urlFor(defaultSource, src));
      next = addOrReplaceAttr(next, 'srcset', srcset);
      next = addOrReplaceAttr(next, 'sizes', imgSizes(tag));
      return next;
    });

    content = content.replace(/url\(\s*(["']?)(.*?)\1\s*\)/gis, (full, quote, src) => {
      const sourcePath = sitePathFromUrl(src, fileName);
      if (!sourcePath) return full;
      const variants = variantsBySource.get(sourcePath) ?? [];
      if (!variants.length) return full;
      const replacement = backgroundSource(variants);
      if (!replacement) return full;
      const nextUrl = urlFor(replacement, src);
      const q = quote || "'";
      return `url(${q}${nextUrl}${q})`;
    });

    if (content !== original) {
      changedFiles.push(fileName);
      if (!check) fs.writeFileSync(absolutePath, content);
    }
  }
  return changedFiles;
}

function cleanupStaleResponsiveFiles(validOutputs, check) {
  if (!fs.existsSync(RESPONSIVE_DIR)) return [];
  const stale = [];
  for (const entry of fs.readdirSync(RESPONSIVE_DIR, { withFileTypes: true })) {
    if (!entry.isFile()) continue;
    const relativePath = `assets/images/responsive/${entry.name}`;
    if (validOutputs.has(relativePath)) continue;
    if (!SOURCE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) continue;
    stale.push(relativePath);
    if (!check) fs.rmSync(path.join(SITE_ROOT, relativePath), { force: true });
  }
  return stale;
}

function fingerprint(files) {
  const hash = crypto.createHash('sha256');
  for (const file of files) {
    const absolutePath = path.join(SITE_ROOT, file);
    if (!fs.existsSync(absolutePath)) continue;
    hash.update(file);
    hash.update('\0');
    hash.update(fs.readFileSync(absolutePath));
    hash.update('\0');
  }
  return hash.digest('hex');
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const check = Boolean(args.check);
  if (!commandExists('ffmpeg') || !commandExists('ffprobe')) {
    console.log('generate:responsive-images skipped: ffmpeg/ffprobe is not available in PATH');
    return;
  }

  const files = htmlFiles();
  const beforeFingerprint = fingerprint(files);
  const { references, usedResponsiveOutputs } = collectImageReferences(files);
  const variantsBySource = new Map();
  const validOutputs = new Set(usedResponsiveOutputs);
  const results = [];

  for (const [sourcePath] of [...references.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const absoluteSource = path.join(SITE_ROOT, sourcePath);
    if (!fs.existsSync(absoluteSource)) continue;
    const sourceSize = fs.statSync(absoluteSource).size;
    const dimensions = getDimensions(sourcePath);
    const widths = chooseWidths(dimensions, sourceSize);
    const variants = [];
    for (const width of widths) {
      const result = generateDerivative(sourcePath, width, check);
      results.push(result);
      if (result.status !== 'skipped-larger') {
        variants.push({ relativeOutput: result.relativeOutput, width: result.width });
        validOutputs.add(result.relativeOutput);
      }
    }
    if (variants.length) variantsBySource.set(sourcePath, variants.sort((a, b) => a.width - b.width));
  }

  const changedFiles = updateHtmlFiles(files, variantsBySource, check);
  const staleFiles = cleanupStaleResponsiveFiles(validOutputs, check);
  const afterFingerprint = check ? beforeFingerprint : fingerprint(files);

  const updated = results.filter((item) => item.status === 'updated' || item.status === 'would-update');
  const current = results.filter((item) => item.status === 'current');
  const skipped = results.filter((item) => item.status === 'skipped-larger');
  const savedBytes = results.reduce((sum, item) => sum + Math.max(0, (item.sourceSize ?? 0) - (item.outputSize ?? 0)), 0);

  console.log(`generate:responsive-images scanned ${references.size} source image(s)`);
  console.log(`responsive variants current ${current.length}, ${check ? 'would update' : 'updated'} ${updated.length}, skipped ${skipped.length}`);
  console.log(`estimated variant savings versus originals: ${savedBytes} bytes`);
  if (changedFiles.length) console.log(`${check ? 'would update' : 'updated'} HTML files: ${changedFiles.join(', ')}`);
  if (staleFiles.length) console.log(`${check ? 'would remove' : 'removed'} stale responsive files: ${staleFiles.join(', ')}`);

  if (check && (updated.length || changedFiles.length || staleFiles.length)) {
    console.error('check:responsive-images failed: generated variants or HTML references are stale');
    process.exit(1);
  }

  if (!check && beforeFingerprint !== afterFingerprint) {
    console.log('HTML references were updated to use responsive srcset/background derivatives.');
  }
}

main();
