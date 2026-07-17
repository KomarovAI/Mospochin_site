#!/usr/bin/env node
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { renderParametricTemplate } from './site-builder-lib.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REGISTRY = JSON.parse(fs.readFileSync(path.join(ROOT,'data/dishwasher-image-library.json'),'utf8'));
const TEMPLATE = fs.readFileSync(path.join(ROOT,'src/components/parametric/dishwasher-media/section.template.html'),'utf8');
const assetById = new Map(REGISTRY.assets.map((asset)=>[asset.id,asset]));
const sha = (text) => crypto.createHash('sha256').update(text).digest('hex').slice(0,16);

function esc(value) { return String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function srcset(asset, format) {
  return asset.outputs.filter((o)=>o.format===format).sort((a,b)=>a.width-b.width).map((o)=>`${o.path} ${o.width}w`).join(', ');
}
function card(asset, layout) {
  const display = asset.display;
  const jpg = asset.outputs.find((o)=>o.format==='jpg' && o.width===768) || asset.outputs.find((o)=>o.format==='jpg');
  const sizes = layout === 'single' ? '(max-width: 767px) 100vw, 544px' : layout === 'gallery' ? '(max-width: 767px) 100vw, (max-width: 1179px) 50vw, 25vw' : '(max-width: 767px) 100vw, 50vw';
  return `      <figure class="dishwasher-media-card" data-dishwasher-image-id="${asset.id}" data-image-processing="generative-enhancement" data-orientation="${asset.orientation}">\n`+
    `        <picture>\n`+
    `          <source type="image/webp" srcset="${srcset(asset,'webp')}" sizes="${sizes}">\n`+
    `          <img src="${jpg.path}" srcset="${srcset(asset,'jpg')}" sizes="${sizes}" width="${display.width}" height="${display.height}" loading="lazy" decoding="async" alt="${esc(asset.alt)}">\n`+
    `        </picture>\n`+
    `        <figcaption>${esc(asset.caption)}</figcaption>\n`+
    `      </figure>`;
}
function renderSection(slug, usage) {
  return renderParametricTemplate(TEMPLATE, {
    slug, eyebrow:usage.eyebrow, heading:usage.heading, text:usage.text, layout:usage.layout,
    cardsHtml: usage.images.map((id)=>card(assetById.get(id),usage.layout)).join('\n')
  }).trim();
}
function stripExisting(html) {
  return html.replace(/\s*<section class="dishwasher-media-section"[\s\S]*?<\/section>\s*/g,'');
}
function injectIntoSource(slug, mediaHtml) {
  const modelPath = path.join(ROOT,'src/pages',slug,'page.json');
  const model = JSON.parse(fs.readFileSync(modelPath,'utf8'));
  let selected = null;
  for (const section of model.sections || []) {
    if (!section.file) continue;
    const abs = path.join(path.dirname(modelPath),section.file);
    if (!fs.existsSync(abs)) continue;
    const html = fs.readFileSync(abs,'utf8');
    if (html.includes('<h1')) { selected={section,abs,html}; break; }
  }
  if (!selected) throw new Error(`${slug}: source section with h1 not found`);
  let html = stripExisting(selected.html);
  const h1 = html.indexOf('<h1');
  const close = html.indexOf('</section>', h1);
  if (close < 0) throw new Error(`${slug}: hero closing section not found`);
  html = `${html.slice(0,close+10)}\n${mediaHtml}\n${html.slice(close+10)}`;
  fs.writeFileSync(selected.abs,html);
  selected.section.bytes = Buffer.byteLength(html);
  selected.section.hash = sha(html);
  model.source.hash = crypto.createHash('sha256').update(html).digest('hex');
  fs.writeFileSync(modelPath,`${JSON.stringify(model,null,2)}\n`);
}
function updateHead(slug, asset) {
  const file = path.join(ROOT,'src/pages',slug,'head.html');
  let html = fs.readFileSync(file,'utf8');
  html = html.replace(/<meta[^>]+(?:property|name)=["'](?:og:image(?::(?:width|height|alt))?|twitter:image(?::alt)?)["'][^>]*>/gi,'');
  const display = asset.display;
  const path1080 = asset.outputs.find((o)=>o.format==='jpg' && o.width===1080)?.path || asset.outputs.find((o)=>o.format==='jpg')?.path;
  const tags = `<meta property="og:image" content="https://mospochin.ru/${path1080}"><meta property="og:image:width" content="${display.width}"><meta property="og:image:height" content="${display.height}"><meta property="og:image:alt" content="${esc(asset.alt)}"><meta name="twitter:image" content="https://mospochin.ru/${path1080}"><meta name="twitter:image:alt" content="${esc(asset.alt)}">`;
  const anchor = html.match(/<meta[^>]+property=["']og:url["'][^>]*>/i)?.[0];
  if (anchor) html = html.replace(anchor,`${tags}${anchor}`);
  else html = html.replace('</head>',`${tags}</head>`);
  fs.writeFileSync(file,html);
}

let count=0;
for (const [slug,usage] of Object.entries(REGISTRY.pageUsage || {})) {
  for (const id of usage.images) if (!assetById.has(id)) throw new Error(`${slug}: unknown image ${id}`);
  injectIntoSource(slug,renderSection(slug,usage));
  updateHead(slug,assetById.get(usage.images[0]));
  count++;
}
console.log(`✅ Applied dishwasher media to ${count} source pages`);
