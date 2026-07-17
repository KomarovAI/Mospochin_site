#!/usr/bin/env node
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REGISTRY_PATH = path.join(ROOT, 'data/dishwasher-image-library.json');
const CHECK = process.argv.includes('--check');

const sha256 = (buffer) => crypto.createHash('sha256').update(buffer).digest('hex');
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJson = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);

function ffprobe(file) {
  const result = spawnSync('ffprobe', ['-v','error','-select_streams','v:0','-show_entries','stream=width,height','-of','json',file], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`ffprobe failed for ${path.relative(ROOT, file)}: ${result.stderr?.trim()}`);
  const stream = JSON.parse(result.stdout).streams?.[0];
  if (!stream?.width || !stream?.height) throw new Error(`Dimensions unavailable for ${path.relative(ROOT, file)}`);
  return { width: stream.width, height: stream.height };
}

function generateJpeg(source, output, width) {
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const result = spawnSync('ffmpeg', ['-y','-loglevel','error','-i',source,'-vf',`scale=${width}:-2:flags=lanczos`,'-frames:v','1','-map_metadata','-1','-q:v','3',output], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`ffmpeg failed for ${path.relative(ROOT, output)}: ${result.stderr?.trim()}`);
}

function generateWebp(jpeg, output) {
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const result = spawnSync('ffmpeg', ['-y','-loglevel','error','-i',jpeg,'-map_metadata','-1','-c:v','libwebp','-q:v','78',output], { encoding: 'utf8' });
  if (result.status !== 0) throw new Error(`ffmpeg failed for ${path.relative(ROOT, output)}: ${result.stderr?.trim()}`);
}

function getAttr(tag, name) {
  return tag.match(new RegExp(`\\s${name}\\s*=\\s*(["'])(.*?)\\1`, 'i'))?.[2] ?? null;
}

function checkHtmlUsage(registry, errors) {
  const assetById = new Map(registry.assets.map((asset) => [asset.id, asset]));
  for (const [slug, usage] of Object.entries(registry.pageUsage || {})) {
    const page = `${slug}.html`;
    const file = path.join(ROOT, page);
    if (!fs.existsSync(file)) { errors.push(`${page}: production HTML missing`); continue; }
    const html = fs.readFileSync(file, 'utf8');
    if (!html.includes(`data-dishwasher-media="${slug}"`)) errors.push(`${page}: dishwasher media section missing`);
    if (/src\s*=\s*["'][^"']*src\/media-source/i.test(html)) errors.push(`${page}: source media path leaked into production HTML`);
    for (const key of usage.images || []) {
      if (!assetById.has(key)) errors.push(`${page}: registry image ${key} cannot be resolved`);
      else if (!html.includes(`data-dishwasher-image-id="${key}"`)) errors.push(`${page}: image ${key} missing`);
    }
    for (const match of html.matchAll(/<figure\b[^>]*data-dishwasher-image-id[^>]*>[\s\S]*?<img\b[^>]*>/gi)) {
      const img = match[0].match(/<img\b[^>]*>/i)?.[0];
      if (!img) continue;
      for (const attr of ['alt','width','height','loading','decoding','srcset','sizes']) {
        if (!getAttr(img, attr)) errors.push(`${page}: dishwasher image missing ${attr}`);
      }
      if (getAttr(img,'loading') !== 'lazy') errors.push(`${page}: below-fold dishwasher image must use loading=lazy`);
      if (getAttr(img,'decoding') !== 'async') errors.push(`${page}: dishwasher image must use decoding=async`);
    }
    if (!/<meta[^>]+property=["']og:image["'][^>]+dishwasher-/i.test(html)) errors.push(`${page}: responsive dishwasher og:image missing`);
  }
}

function main() {
  if (!fs.existsSync(REGISTRY_PATH)) throw new Error('data/dishwasher-image-library.json is missing');
  const registry = readJson(REGISTRY_PATH);
  const widths = registry.rendering?.widths || [480,768,1080];
  const formats = registry.rendering?.formats || ['jpg','webp'];
  const errors = [];
  if (!CHECK) {
    const rendered = spawnSync('python3', [path.join(ROOT, 'tools/render-dishwasher-images.py')], { encoding: 'utf8' });
    if (rendered.status !== 0) throw new Error(`Pillow renderer failed: ${rendered.stderr?.trim()}`);
    if (rendered.stdout?.trim()) console.log(rendered.stdout.trim());
  }
  for (const asset of registry.assets || []) {
    const source = path.join(ROOT, asset.source);
    if (!fs.existsSync(source)) { errors.push(`${asset.id}: source missing (${asset.source})`); continue; }
    const sourceHash = sha256(fs.readFileSync(source));
    if (CHECK && asset.sourceSha256 !== sourceHash) errors.push(`${asset.id}: source SHA is stale`);
    asset.sourceSha256 = sourceHash;
    const outputs = [];
    for (const width of widths) {
      for (const format of formats) {
        const suffix = format === 'webp' ? 'jpg.webp' : 'jpg';
        const rel = `assets/images/responsive/${asset.base}-${width}w.${suffix}`;
        const output = path.join(ROOT, rel);
        if (!fs.existsSync(output)) { errors.push(`${asset.id}: output missing (${rel})`); continue; }
        const buffer = fs.readFileSync(output);
        if (CHECK) {
          const stored = (asset.outputs || []).find((item) => item.path === rel);
          if (!stored) {
            errors.push(`${asset.id}: registry output missing (${rel})`);
            continue;
          }
          if (stored.width !== width) errors.push(`${rel}: registry width mismatch`);
          if (stored.sha256 !== sha256(buffer)) errors.push(`${rel}: SHA mismatch`);
          if (stored.bytes !== buffer.length) errors.push(`${rel}: byte size mismatch`);
          outputs.push(stored);
        } else {
          const dims = ffprobe(output);
          if (dims.width !== width) errors.push(`${rel}: expected width ${width}, got ${dims.width}`);
          outputs.push({ path: rel, width: dims.width, height: dims.height, format, bytes: buffer.length, sha256: sha256(buffer) });
        }
      }
    }
    asset.outputs = outputs;
    const display = outputs.find((item) => item.width === 1080 && item.format === 'jpg') || outputs.at(-1);
    if (display) asset.display = { width: display.width, height: display.height };
  }
  if (CHECK) checkHtmlUsage(registry, errors); else writeJson(REGISTRY_PATH, registry);
  if (errors.length) { errors.forEach((e) => console.error(`❌ ${e}`)); process.exit(1); }
  console.log(`✅ Dishwasher image library: ${registry.assets.length} source images, ${registry.assets.reduce((s,a)=>s+a.outputs.length,0)} responsive outputs, ${Object.keys(registry.pageUsage || {}).length} integrated pages`);
}
main();
