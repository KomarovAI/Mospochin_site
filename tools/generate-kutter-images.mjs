#!/usr/bin/env node
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const REGISTRY_PATH = path.join(ROOT, 'data/kutter-image-library.json');
const CHECK = process.argv.includes('--check');

function sha256(buffer) {
  return crypto.createHash('sha256').update(buffer).digest('hex');
}

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function writeJson(file, value) {
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

function ffprobe(file) {
  const result = spawnSync('ffprobe', [
    '-v', 'error',
    '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height',
    '-of', 'json',
    file,
  ], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`ffprobe failed for ${path.relative(ROOT, file)}: ${result.stderr?.trim()}`);
  const stream = JSON.parse(result.stdout).streams?.[0];
  if (!stream?.width || !stream?.height) throw new Error(`Dimensions unavailable for ${path.relative(ROOT, file)}`);
  return { width: stream.width, height: stream.height };
}

function generateJpeg(source, output, width) {
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const result = spawnSync('ffmpeg', [
    '-y', '-loglevel', 'error', '-i', source,
    '-vf', `scale=${width}:-2:flags=lanczos`,
    '-frames:v', '1', '-map_metadata', '-1',
    '-q:v', '3', output,
  ], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`ffmpeg failed for ${path.relative(ROOT, output)}: ${result.stderr?.trim()}`);
}

function generateWebpSidecar(jpeg, output) {
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const result = spawnSync('ffmpeg', [
    '-y', '-loglevel', 'error', '-i', jpeg,
    '-map_metadata', '-1', '-c:v', 'libwebp', '-q:v', '78', output,
  ], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`ffmpeg failed for ${path.relative(ROOT, output)}: ${result.stderr?.trim()}`);
}

function getAttr(tag, name) {
  return tag.match(new RegExp(`\\s${name}\\s*=\\s*(["'])(.*?)\\1`, 'i'))?.[2] ?? null;
}

function checkHtmlUsage(registry, errors) {
  const assetById = new Map(registry.assets.map((asset) => [asset.id, asset]));
  const expectedPages = new Set(Object.keys(registry.pageUsage || {}).map((slug) => `${slug}.html`));

  for (const page of expectedPages) {
    const file = path.join(ROOT, page);
    if (!fs.existsSync(file)) {
      errors.push(`${page}: production HTML missing`);
      continue;
    }
    const html = fs.readFileSync(file, 'utf8');
    if (!html.includes(`data-kutter-media="${page.replace(/\.html$/, '')}"`)) {
      errors.push(`${page}: kutter media section missing`);
    }
    if (/src\s*=\s*["'][^"']*src\/media-source/i.test(html)) {
      errors.push(`${page}: source media path leaked into production HTML`);
    }
    const expectedKeys = registry.pageUsage[page.replace(/\.html$/, '')]?.images || [];
    for (const key of expectedKeys) {
      const resolved = assetById.get(key);
      if (!resolved) {
        errors.push(`${page}: registry image key ${key} cannot be resolved`);
        continue;
      }
      if (!html.includes(`data-kutter-image-id="${resolved.id}"`)) {
        errors.push(`${page}: image ${resolved.id} missing`);
      }
    }

    for (const match of html.matchAll(/<img\b[^>]*data-kutter-image-id[^>]*>|<figure\b[^>]*data-kutter-image-id[^>]*>[\s\S]*?<img\b[^>]*>/gi)) {
      const block = match[0];
      const img = block.match(/<img\b[^>]*>/i)?.[0] || (block.startsWith('<img') ? block : null);
      if (!img) continue;
      for (const attr of ['alt', 'width', 'height', 'loading', 'decoding', 'srcset', 'sizes']) {
        if (!getAttr(img, attr)) errors.push(`${page}: kutter image missing ${attr}`);
      }
      if (getAttr(img, 'loading') !== 'lazy') errors.push(`${page}: below-fold kutter image must use loading=lazy`);
      if (getAttr(img, 'decoding') !== 'async') errors.push(`${page}: kutter image must use decoding=async`);
    }
  }
}

function main() {
  if (!fs.existsSync(REGISTRY_PATH)) throw new Error('data/kutter-image-library.json is missing');
  const registry = readJson(REGISTRY_PATH);
  const widths = registry.rendering?.widths || [480, 768, 1080];
  const formats = registry.rendering?.formats || ['webp', 'jpg'];
  const errors = [];

  for (const asset of registry.assets || []) {
    const source = path.join(ROOT, asset.source);
    if (!fs.existsSync(source)) {
      errors.push(`${asset.id}: source missing (${asset.source})`);
      continue;
    }
    const sourceHash = sha256(fs.readFileSync(source));
    if (CHECK && asset.sourceSha256 !== sourceHash) errors.push(`${asset.id}: source SHA is stale`);
    asset.sourceSha256 = sourceHash;
    const outputs = [];

    for (const width of widths) {
      for (const format of formats) {
        const suffix = format === 'webp' ? 'jpg.webp' : 'jpg';
        const relativeOutput = `assets/images/responsive/${asset.base}-${width}w.${suffix}`;
        const output = path.join(ROOT, relativeOutput);
        if (!CHECK) {
          if (format === 'jpg') generateJpeg(source, output, width);
          else {
            const jpeg = path.join(ROOT, `assets/images/responsive/${asset.base}-${width}w.jpg`);
            if (!fs.existsSync(jpeg)) generateJpeg(source, jpeg, width);
            generateWebpSidecar(jpeg, output);
          }
        }
        if (!fs.existsSync(output)) {
          errors.push(`${asset.id}: output missing (${relativeOutput})`);
          continue;
        }
        const dimensions = ffprobe(output);
        if (dimensions.width !== width) errors.push(`${relativeOutput}: expected ${width}px width, got ${dimensions.width}`);
        const buffer = fs.readFileSync(output);
        const metadata = {
          path: relativeOutput,
          width: dimensions.width,
          height: dimensions.height,
          format,
          bytes: buffer.length,
          sha256: sha256(buffer),
        };
        if (CHECK) {
          const stored = (asset.outputs || []).find((item) => item.path === relativeOutput);
          if (!stored) errors.push(`${asset.id}: registry output missing (${relativeOutput})`);
          else {
            if (stored.sha256 !== metadata.sha256) errors.push(`${relativeOutput}: SHA mismatch`);
            if (stored.bytes !== metadata.bytes) errors.push(`${relativeOutput}: byte size mismatch`);
            if (stored.height && stored.height !== metadata.height) errors.push(`${relativeOutput}: height mismatch`);
          }
        }
        outputs.push(metadata);
      }
    }
    asset.outputs = outputs;
  }

  if (CHECK) checkHtmlUsage(registry, errors);
  else writeJson(REGISTRY_PATH, registry);

  if (errors.length) {
    errors.forEach((error) => console.error(`❌ ${error}`));
    process.exit(1);
  }
  console.log(`✅ Kutter image library: ${registry.assets.length} source images, ${registry.assets.reduce((sum, item) => sum + item.outputs.length, 0)} responsive outputs, ${Object.keys(registry.pageUsage || {}).length} integrated pages`);
}

main();
