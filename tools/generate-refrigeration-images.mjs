#!/usr/bin/env node
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REGISTRY_PATH = path.join(ROOT, 'data/refrigeration-image-library.json');
const CHECK = process.argv.includes('--check');
const FORCE_RENDER = process.argv.includes('--render');
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
    if (!html.includes(`data-refrigeration-media="${slug}"`)) errors.push(`${page}: refrigeration media section missing`);
    if (/src\s*=\s*["'][^"']*src\/media-source/i.test(html)) errors.push(`${page}: source media path leaked into production HTML`);
    const brandContext = usage.brandContext || null;
    for (const id of usage.images || []) {
      const asset = assetById.get(id);
      if (!asset) { errors.push(`${page}: registry image ${id} cannot be resolved`); continue; }
      if (!html.includes(`data-refrigeration-image-id="${id}"`)) errors.push(`${page}: image ${id} missing`);
      if (brandContext && !(asset.brandEvidence || []).includes(brandContext)) errors.push(`${page}: ${id} does not confirm brand ${brandContext}`);
    }
    for (const match of html.matchAll(/<figure\b[^>]*data-refrigeration-image-id[^>]*>[\s\S]*?<img\b[^>]*>/gi)) {
      const img = match[0].match(/<img\b[^>]*>/i)?.[0];
      if (!img) continue;
      for (const attr of ['alt','width','height','loading','decoding','srcset','sizes']) {
        if (!getAttr(img, attr)) errors.push(`${page}: refrigeration image missing ${attr}`);
      }
      if (getAttr(img,'loading') !== 'lazy') errors.push(`${page}: below-fold refrigeration image must use loading=lazy`);
      if (getAttr(img,'decoding') !== 'async') errors.push(`${page}: refrigeration image must use decoding=async`);
    }
    if (!/<source[^>]+type=["']image\/webp["'][^>]+srcset=/i.test(html)) errors.push(`${page}: WebP source missing`);
    if (!/<meta[^>]+property=["']og:image["'][^>]+refrigeration-/i.test(html)) errors.push(`${page}: responsive refrigeration og:image missing`);
  }
}
function main() {
  if (!fs.existsSync(REGISTRY_PATH)) throw new Error('data/refrigeration-image-library.json is missing');
  const registry = readJson(REGISTRY_PATH);
  const widths = registry.rendering?.widths || [480,768,1080];
  const formats = registry.rendering?.formats || ['jpg','webp'];
  const errors = [];
  const quarantine = new Set(registry.safety?.quarantinedArchiveIds || []);
  for (const asset of registry.assets || []) {
    if (quarantine.has(asset.archiveId)) errors.push(`${asset.id}: quarantined archive ID ${asset.archiveId} is registered`);
  }
  if (!CHECK) {
    const allOutputsExist = (registry.assets || []).every((asset) => widths.every((width) => formats.every((format) => {
      const suffix = format === 'webp' ? 'jpg.webp' : 'jpg';
      return fs.existsSync(path.join(ROOT, `assets/images/responsive/${asset.base}-${width}w.${suffix}`));
    })));
    if (FORCE_RENDER || !allOutputsExist) {
      const rendered = spawnSync('python3', [path.join(ROOT, 'tools/render-refrigeration-images.py')], { encoding: 'utf8' });
      if (rendered.status !== 0) throw new Error(`Pillow renderer failed: ${rendered.stderr?.trim()}`);
      if (rendered.stdout?.trim()) console.log(rendered.stdout.trim());
    } else {
      console.log('responsive outputs already exist; refreshing registry metadata');
    }
  }
  for (const asset of registry.assets || []) {
    const source = path.join(ROOT, asset.source);
    if (!fs.existsSync(source)) { errors.push(`${asset.id}: source missing (${asset.source})`); continue; }
    const sourceHash = sha256(fs.readFileSync(source));
    if (CHECK && asset.sourceSha256 !== sourceHash) errors.push(`${asset.id}: source SHA is stale`);
    asset.sourceSha256 = sourceHash;
    const sourceDims = ffprobe(source);
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
          if (!stored) { errors.push(`${asset.id}: registry output missing (${rel})`); continue; }
          if (stored.width !== width) errors.push(`${rel}: registry width mismatch`);
          if (stored.sha256 !== sha256(buffer)) errors.push(`${rel}: SHA mismatch`);
          if (stored.bytes !== buffer.length) errors.push(`${rel}: byte size mismatch`);
          outputs.push(stored);
        } else {
          let height = Math.round(sourceDims.height * width / sourceDims.width);
          if (height % 2) height += 1;
          outputs.push({ path: rel, width, height, format, bytes: buffer.length, sha256: sha256(buffer) });
        }
      }
    }
    asset.outputs = outputs;
    const display = outputs.find((item) => item.width === 1080 && item.format === 'jpg') || outputs.at(-1);
    if (display) asset.display = { width: display.width, height: display.height };
  }
  if (CHECK) checkHtmlUsage(registry, errors); else writeJson(REGISTRY_PATH, registry);
  if (errors.length) { errors.forEach((e) => console.error(`❌ ${e}`)); process.exit(1); }
  console.log(`✅ Refrigeration image library: ${registry.assets.length} sources, ${registry.assets.reduce((s,a)=>s+(a.outputs?.length||0),0)} responsive outputs, ${Object.keys(registry.pageUsage || {}).length} integrated pages`);
}
main();
