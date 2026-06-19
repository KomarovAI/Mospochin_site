#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const OUT_DIR = process.env.MOSPOCHIN_VISUAL_OUT_DIR || 'reports/live-visual-pack';
const OUT_ROOT = path.join(ROOT, OUT_DIR);
const SHEETS_DIR = path.join(OUT_ROOT, 'contact-sheets');
const LLM_DIR = path.join(OUT_ROOT, 'llm');

function argValue(name, fallback = '') {
  const prefix = `--${name}=`;
  const raw = process.argv.slice(2).find((x) => x.startsWith(prefix));
  return raw ? raw.slice(prefix.length) : fallback;
}

const MAX_TILES = Number(argValue('max-tiles', '72'));
const TILE_W = Number(argValue('tile-width', '360'));
const TILE_H = Number(argValue('tile-height', '270'));
const LABEL_H = 58;
const GAP = 18;
const COLS = Number(argValue('cols', '3'));

function xmlEscape(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function csvEscape(value) {
  const s = value == null ? '' : String(value);
  return /[",\n;]/.test(s) ? `"${s.replaceAll('"', '""')}"` : s;
}

function rel(file) {
  return path.relative(OUT_ROOT, file).replaceAll(path.sep, '/');
}

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function walk(dir) {
  const out = [];
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) out.push(...await walk(p));
      else out.push(p);
    }
  } catch {}
  return out;
}

async function readText(file, fallback = '') {
  try {
    return await fs.readFile(file, 'utf8');
  } catch {
    return fallback;
  }
}

async function readJson(file, fallback = null) {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function splitCsvLine(line) {
  const out = [];
  let cur = '';
  let q = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (q) {
      if (ch === '"' && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else if (ch === '"') {
        q = false;
      } else {
        cur += ch;
      }
    } else if (ch === '"') {
      q = true;
    } else if (ch === ',') {
      out.push(cur);
      cur = '';
    } else {
      cur += ch;
    }
  }
  out.push(cur);
  return out;
}

async function readCsv(file) {
  const text = await readText(file, '');
  const lines = text.split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const headers = splitCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cols = splitCsvLine(line);
    const row = {};
    headers.forEach((h, i) => row[h] = cols[i] ?? '');
    return row;
  });
}

function wrapLabel(value, max = 44) {
  const s = String(value || '').replace(/\s+/g, ' ').trim();
  if (s.length <= max) return [s];
  const words = s.split(' ');
  const lines = [];
  let cur = '';
  for (const w of words) {
    if ((cur + ' ' + w).trim().length > max) {
      if (cur) lines.push(cur);
      cur = w;
    } else {
      cur = (cur + ' ' + w).trim();
    }
    if (lines.length >= 2) break;
  }
  if (lines.length < 2 && cur) lines.push(cur);
  return lines.slice(0, 2);
}

function labelSvg(label, width, height) {
  const lines = wrapLabel(label);
  const text = lines.map((line, i) =>
    `<text x="12" y="${22 + i * 18}" font-family="Arial, sans-serif" font-size="14" fill="#111">${xmlEscape(line)}</text>`
  ).join('');
  return Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#ffffff"/>
      ${text}
    </svg>
  `);
}

function textSvg(title, lines, width, height) {
  const body = lines.slice(0, 28).map((line, i) =>
    `<text x="28" y="${76 + i * 24}" font-family="Arial, sans-serif" font-size="16" fill="#222">${xmlEscape(line)}</text>`
  ).join('');
  return Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f7f7f7"/>
      <text x="28" y="42" font-family="Arial, sans-serif" font-size="24" font-weight="700" fill="#111">${xmlEscape(title)}</text>
      ${body}
    </svg>
  `);
}

function pageLabelFromFile(file) {
  const r = rel(file);
  const parts = r.split('/');
  const page = parts.find((p) => /^\d{3}__/.test(p)) || '';
  const vp = parts.includes('desktop') ? 'desktop' : parts.includes('mobile') ? 'mobile' : '';
  const kind = r.includes('/blocks/') ? 'block' : r.includes('/elements/') ? 'element' : r.includes('page-full-numbered') ? 'numbered' : r.includes('viewport') ? 'viewport' : 'image';
  const base = path.basename(file);
  return `${page} ${vp} ${kind} ${base}`.trim();
}

async function createSheet(sharp, name, files, title) {
  await ensureDir(SHEETS_DIR);
  const selected = files.slice(0, MAX_TILES);
  const rows = Math.max(1, Math.ceil(Math.max(1, selected.length) / COLS));
  const width = COLS * TILE_W + (COLS + 1) * GAP;
  const height = 68 + rows * TILE_H + (rows + 1) * GAP;
  const composites = [];

  const titleBuf = textSvg(title, [`tiles: ${selected.length}`, `source: ${OUT_DIR}`], width, 68);
  composites.push({ input: titleBuf, left: 0, top: 0 });

  if (!selected.length) {
    const empty = textSvg(title, ['No matching images in artifact.'], width, 260);
    await sharp({
      create: { width, height: 260, channels: 3, background: '#f7f7f7' }
    }).composite([{ input: empty, left: 0, top: 0 }]).jpeg({ quality: 84 }).toFile(path.join(SHEETS_DIR, name));
    return path.join(SHEETS_DIR, name);
  }

  for (let i = 0; i < selected.length; i++) {
    const file = selected[i];
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const left = GAP + col * (TILE_W + GAP);
    const top = 68 + GAP + row * TILE_H;

    let imgBuf;
    try {
      imgBuf = await sharp(file)
        .rotate()
        .resize({
          width: TILE_W - 16,
          height: TILE_H - LABEL_H - 16,
          fit: 'inside',
          withoutEnlargement: true,
          background: '#ffffff'
        })
        .flatten({ background: '#ffffff' })
        .png()
        .toBuffer();
    } catch {
      imgBuf = textSvg('Image read failed', [rel(file)], TILE_W - 16, TILE_H - LABEL_H - 16);
    }

    const meta = await sharp(imgBuf).metadata().catch(() => ({ width: TILE_W - 16, height: TILE_H - LABEL_H - 16 }));
    const tileBg = await sharp({
      create: { width: TILE_W, height: TILE_H, channels: 3, background: '#ffffff' }
    }).composite([
      {
        input: imgBuf,
        left: Math.max(8, Math.round((TILE_W - (meta.width || 1)) / 2)),
        top: 8
      },
      {
        input: labelSvg(pageLabelFromFile(file), TILE_W, LABEL_H),
        left: 0,
        top: TILE_H - LABEL_H
      }
    ]).jpeg({ quality: 86 }).toBuffer();

    composites.push({ input: tileBg, left, top });
  }

  const outFile = path.join(SHEETS_DIR, name);
  await sharp({
    create: { width, height, channels: 3, background: '#eeeeee' }
  }).composite(composites).jpeg({ quality: 84 }).toFile(outFile);

  return outFile;
}

async function createWarningsSheet(sharp, warnings) {
  const width = 1200;
  const height = Math.max(360, 100 + Math.min(28, warnings.length || 1) * 28);
  const lines = warnings.length
    ? warnings.slice(0, 28).map((w) => `${w.source || 'warnings'} ${w.page_id || ''} ${w.path || ''} ${w.viewport || ''} ${w.code || w.type || ''} ${w.message || ''}`.trim())
    : ['No warnings.'];

  const svg = textSvg('Visual pack warnings', lines, width, height);
  const outFile = path.join(SHEETS_DIR, 'warnings.jpg');
  await sharp(svg).jpeg({ quality: 86 }).toFile(outFile);
  return outFile;
}

async function buildManifest(extraFiles) {
  const files = await walk(OUT_ROOT);
  const statRows = [];
  for (const f of files) {
    const st = await fs.stat(f).catch(() => null);
    if (!st || !st.isFile()) continue;
    statRows.push({
      file: rel(f),
      bytes: st.size,
      kind: f.includes('/contact-sheets/') ? 'contact-sheet'
        : f.endsWith('dom-map.json') ? 'dom-map'
        : f.includes('/blocks/') ? 'block-screenshot'
        : f.includes('/elements/') ? 'element-screenshot'
        : f.endsWith('page-full-numbered.png') ? 'numbered-map'
        : f.endsWith('viewport.png') ? 'viewport-screenshot'
        : f.endsWith('.csv') ? 'csv'
        : f.endsWith('.json') || f.endsWith('.jsonl') ? 'json'
        : f.endsWith('.md') ? 'markdown'
        : 'file'
    });
  }

  const plan = await readJson(path.join(OUT_ROOT, 'capture-plan.json'), {});
  const runSummary = await readText(path.join(OUT_ROOT, 'run-summary.md'), '');

  const manifest = {
    generated_at: new Date().toISOString(),
    base_url: process.env.MOSPOCHIN_SCREENSHOT_BASE_URL || 'https://mospochin.ru',
    commit: process.env.MOSPOCHIN_SCREENSHOT_COMMIT || process.env.GITHUB_SHA || '',
    run_id: process.env.MOSPOCHIN_SCREENSHOT_RUN_ID || process.env.GITHUB_RUN_ID || '',
    run_number: process.env.MOSPOCHIN_SCREENSHOT_RUN_NUMBER || process.env.GITHUB_RUN_NUMBER || '',
    mode: 'visual-contact-sheets-postprocess',
    counts: {
      files: statRows.length,
      contact_sheets: statRows.filter((r) => r.kind === 'contact-sheet').length,
      numbered_maps: statRows.filter((r) => r.kind === 'numbered-map').length,
      block_screenshots: statRows.filter((r) => r.kind === 'block-screenshot').length,
      element_screenshots: statRows.filter((r) => r.kind === 'element-screenshot').length
    },
    plan_summary: {
      pages_planned: plan.pages_planned || plan.summary?.total_pages || plan.rows?.length || plan.pages?.length || 0,
      mode: plan.mode || plan.run?.mode || ''
    },
    important_files: [
      'capture-plan.json',
      'capture-plan.csv',
      'manifest.json',
      'manifest.csv',
      'llm_visual_index.md',
      'errors-and-warnings.md',
      'llm/llm_visual_pages.jsonl',
      'llm/llm_visual_blocks.csv',
      'llm/llm_visual_elements.csv',
      'llm/llm_visual_files.csv',
      'llm/llm_visual_warnings.csv',
      'llm/llm_visual_dom_warnings.csv',
      ...extraFiles.map((f) => rel(f))
    ],
    files: statRows.sort((a, b) => a.file.localeCompare(b.file)),
    run_summary_excerpt: runSummary.split(/\r?\n/).slice(0, 80)
  };

  await fs.writeFile(path.join(OUT_ROOT, 'manifest.json'), JSON.stringify(manifest, null, 2));

  const manifestCsv = [
    ['file', 'kind', 'bytes'].join(','),
    ...manifest.files.map((r) => [r.file, r.kind, r.bytes].map(csvEscape).join(','))
  ].join('\n') + '\n';

  await fs.writeFile(path.join(OUT_ROOT, 'manifest-files.csv'), manifestCsv);

  return manifest;
}

async function buildErrorsAndWarnings(warnings) {
  const md = [];
  md.push('# Errors and warnings');
  md.push('');
  md.push(`Generated: ${new Date().toISOString()}`);
  md.push(`Total warnings: ${warnings.length}`);
  md.push('');
  if (!warnings.length) {
    md.push('No warnings.');
  } else {
    md.push('| Source | Page | Viewport | Code | Message |');
    md.push('| --- | --- | --- | --- | --- |');
    for (const w of warnings.slice(0, 200)) {
      md.push(`| ${w.source || ''} | ${w.path || w.label || ''} | ${w.viewport || ''} | ${w.code || w.type || ''} | ${String(w.message || '').replaceAll('|', '\\|')} |`);
    }
  }

  await fs.writeFile(path.join(OUT_ROOT, 'errors-and-warnings.md'), md.join('\n') + '\n');
}

async function updateLlmFiles(sheetFiles) {
  await ensureDir(LLM_DIR);
  const fileCsv = path.join(LLM_DIR, 'llm_visual_files.csv');
  let text = await readText(fileCsv, '');
  if (!text.trim()) {
    text = 'page_id,path,viewport,kind,file\n';
  }
  for (const f of sheetFiles) {
    const r = rel(f);
    if (!text.includes(r)) {
      text += ['', '', '', 'contact-sheet', r].map(csvEscape).join(',') + '\n';
    }
  }
  for (const f of ['manifest.json', 'manifest-files.csv', 'errors-and-warnings.md']) {
    if (!text.includes(f)) {
      text += ['', '', '', 'meta', f].map(csvEscape).join(',') + '\n';
    }
  }
  await fs.writeFile(fileCsv, text);
}

async function updateRunSummary(manifest, sheetFiles, warnings) {
  const file = path.join(OUT_ROOT, 'run-summary.md');
  let text = await readText(file, '# MosPochin Live Visual Pack\n');
  if (!text.includes('## Contact sheets')) {
    text += '\n## Contact sheets\n\n';
    text += `- contact_sheets: ${sheetFiles.length}\n`;
    text += `- warnings_total: ${warnings.length}\n`;
    text += `- manifest_files: ${manifest.counts.files}\n`;
    for (const f of sheetFiles) text += `- ${rel(f)}\n`;
  }
  await fs.writeFile(file, text);
}

async function main() {
  await ensureDir(OUT_ROOT);
  await ensureDir(SHEETS_DIR);
  await ensureDir(LLM_DIR);

  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch (err) {
    await fs.writeFile(path.join(OUT_ROOT, 'errors-and-warnings.md'), `# Errors and warnings\n\nsharp is not available: ${String(err?.message || err)}\n`);
    console.log('VISUAL_CONTACT_SHEETS_SKIP no_sharp');
    return;
  }

  const all = await walk(path.join(OUT_ROOT, 'pages'));
  const images = all.filter((f) => /\.(png|jpe?g|webp)$/i.test(f));

  const desktopViewports = images.filter((f) => f.endsWith('/desktop/viewport.png'));
  const mobileViewports = images.filter((f) => f.endsWith('/mobile/viewport.png'));
  const numbered = images.filter((f) => f.endsWith('/page-full-numbered.png'));
  const blocks = images.filter((f) => f.includes('/blocks/'));
  const elements = images.filter((f) => f.includes('/elements/'));

  const warningRows = [
    ...(await readCsv(path.join(LLM_DIR, 'llm_visual_warnings.csv'))).map((r) => ({ ...r, source: 'llm_visual_warnings.csv' })),
    ...(await readCsv(path.join(LLM_DIR, 'llm_visual_dom_warnings.csv'))).map((r) => ({ ...r, source: 'llm_visual_dom_warnings.csv' }))
  ].filter((r) => Object.values(r).some(Boolean));

  const sheetFiles = [];
  sheetFiles.push(await createSheet(sharp, 'pages-desktop.jpg', desktopViewports, 'Pages desktop viewport'));
  sheetFiles.push(await createSheet(sharp, 'pages-mobile.jpg', mobileViewports, 'Pages mobile viewport'));
  sheetFiles.push(await createSheet(sharp, 'numbered-maps.jpg', numbered, 'Numbered maps'));
  sheetFiles.push(await createSheet(sharp, 'blocks.jpg', blocks, 'DOM blocks'));
  sheetFiles.push(await createSheet(sharp, 'elements.jpg', elements, 'DOM elements'));
  sheetFiles.push(await createWarningsSheet(sharp, warningRows));

  await buildErrorsAndWarnings(warningRows);
  await updateLlmFiles(sheetFiles);
  const manifest = await buildManifest(sheetFiles);
  await updateRunSummary(manifest, sheetFiles, warningRows);

  console.log(`VISUAL_CONTACT_SHEETS_OK sheets=${sheetFiles.length} files=${manifest.counts.files} warnings=${warningRows.length}`);
}

main().catch((err) => {
  console.error('VISUAL_CONTACT_SHEETS_FAIL');
  console.error(err);
  process.exit(0);
});
