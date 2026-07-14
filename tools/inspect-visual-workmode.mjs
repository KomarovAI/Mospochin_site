#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const DEFAULT_DIRS = [
  'reports/visual-p2-final-20260713',
  'reports/visual-p1-final-20260713',
  '.artifacts/screenshots/visual-smoke',
];

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith('--')) args[key] = true;
    else {
      args[key] = next;
      index += 1;
    }
  }
  return args;
}

async function exists(file) {
  try {
    await fs.access(file);
    return true;
  } catch {
    return false;
  }
}

async function listPngs(dir) {
  const result = [];
  const walk = async (current) => {
    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue;
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) await walk(full);
      else if (/\.png$/i.test(entry.name)) result.push(full);
    }
  };
  await walk(dir);
  return result.sort();
}

async function imageMeta(file) {
  const buffer = await fs.readFile(file);
  const isPng = buffer.length >= 24 && buffer.toString('ascii', 1, 4) === 'PNG';
  return {
    file: path.relative(ROOT, file).replaceAll(path.sep, '/'),
    bytes: buffer.length,
    width: isPng ? buffer.readUInt32BE(16) : null,
    height: isPng ? buffer.readUInt32BE(20) : null,
    viewport: /\.mobile(?:\.part-\d+)?\.png$/i.test(file) ? 'mobile' : 'desktop',
  };
}

const args = parseArgs(process.argv.slice(2));
const requested = args.dir ? [String(args.dir)] : DEFAULT_DIRS;
const dirs = [];
for (const dir of requested) {
  const absolute = path.resolve(ROOT, dir);
  if (await exists(absolute)) dirs.push({ path: dir, absolute });
}

const packs = [];
for (const dir of dirs) {
  const files = await listPngs(dir.absolute);
  packs.push({
    directory: dir.path,
    png_count: files.length,
    desktop_count: files.filter((file) => /\.desktop\.png$/i.test(file)).length,
    mobile_count: files.filter((file) => /\.mobile(?:\.part-\d+)?\.png$/i.test(file)).length,
    files: await Promise.all(files.map(imageMeta)),
  });
}

const report = {
  mode: 'workmode-image-review',
  capture_available_here: false,
  viewer_available_here: 'view_image',
  statement: 'This report indexes PNGs that the agent can open and visually inspect in Work Mode. It does not claim to create new screenshots.',
  packs,
  total_pngs: packs.reduce((sum, pack) => sum + pack.png_count, 0),
};

console.log(JSON.stringify(report, null, 2));
