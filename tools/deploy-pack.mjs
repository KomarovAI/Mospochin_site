#!/usr/bin/env node
/**
 * Production deploy packer for MosPochin.
 *
 * Builds a public/runtime-only ZIP from .deploy/include-files.txt.
 * This intentionally differs from handoff:pack: docs/src/reports/.ai stay out
 * of the production artifact. version.json may be generated at pack time.
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { spawnSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const MANIFEST_PATH = path.join(ROOT_DIR, '.deploy/include-files.txt');
const DIST_DIR = path.join(ROOT_DIR, '.deploy/dist');
const STAGE_DIR = path.join(DIST_DIR, 'public-runtime');
const REPORT_DIR = path.join(ROOT_DIR, 'reports/deploy');
const PACKAGE_JSON = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'package.json'), 'utf8'));

function argValue(name, fallback = null) {
  const idx = process.argv.indexOf(name);
  if (idx < 0) return fallback;
  return process.argv[idx + 1] ?? fallback;
}

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function rel(...parts) {
  return toPosix(path.join(...parts));
}

function ensureInsideRoot(relativePath) {
  const resolved = path.resolve(ROOT_DIR, relativePath);
  if (!resolved.startsWith(ROOT_DIR + path.sep) && resolved !== ROOT_DIR) {
    throw new Error(`Path escapes project root: ${relativePath}`);
  }
  return resolved;
}

function readManifest() {
  if (!fs.existsSync(MANIFEST_PATH)) {
    throw new Error('Missing .deploy/include-files.txt. Run npm run generate:deploy-manifest first.');
  }

  const files = fs.readFileSync(MANIFEST_PATH, 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !line.startsWith('#'));

  return [...new Set(files)].sort();
}

function sha256File(filePath) {
  return crypto.createHash('sha256').update(fs.readFileSync(filePath)).digest('hex');
}

function sha256Text(text) {
  return crypto.createHash('sha256').update(text).digest('hex');
}

function mkdirClean(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
}

function copyRuntimeFile(relativePath) {
  const src = ensureInsideRoot(relativePath);
  const dest = path.join(STAGE_DIR, relativePath);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function buildVersionJson(files, copiedFiles) {
  const manifestHash = sha256Text(files.join('\n') + '\n');
  const runtimeHashes = {};
  for (const file of copiedFiles) {
    runtimeHashes[file] = sha256File(path.join(STAGE_DIR, file));
  }
  const runtimeHash = sha256Text(
    Object.entries(runtimeHashes)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([file, hash]) => `${hash}  ${file}`)
      .join('\n') + '\n'
  );

  return {
    project: 'mospochin-site',
    artifact: 'public-runtime',
    packageVersion: PACKAGE_JSON.version || '0.0.0',
    generatedAt: new Date().toISOString(),
    source: {
      githubSha: process.env.GITHUB_SHA || '',
      githubRef: process.env.GITHUB_REF || '',
      node: process.version,
    },
    manifest: {
      path: '.deploy/include-files.txt',
      files: files.length,
      sha256: manifestHash,
    },
    runtime: {
      files: copiedFiles.length + 1,
      sha256: runtimeHash,
    },
  };
}

function runZip(zipPath) {
  fs.rmSync(zipPath, { force: true });
  const result = spawnSync('zip', ['-qr', zipPath, '.'], {
    cwd: STAGE_DIR,
    stdio: 'inherit',
  });
  if (result.status !== 0) {
    throw new Error('zip command failed. Make sure the system zip binary is available.');
  }
}

function fileSize(filePath) {
  return fs.statSync(filePath).size;
}

function humanSize(bytes) {
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let idx = 0;
  while (value >= 1024 && idx < units.length - 1) {
    value /= 1024;
    idx += 1;
  }
  return `${value.toFixed(idx === 0 ? 0 : 2)} ${units[idx]}`;
}

function writeReport({ name, files, copiedFiles, generatedFiles, zipPath, shaPath, sha, version }) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
  const reportName = `${name.replace(/\.zip$/, '')}.md`;
  const reportPath = path.join(REPORT_DIR, reportName);
  const stageRelative = toPosix(path.relative(ROOT_DIR, STAGE_DIR));
  const zipRelative = toPosix(path.relative(ROOT_DIR, zipPath));
  const shaRelative = toPosix(path.relative(ROOT_DIR, shaPath));

  const byExt = new Map();
  for (const file of [...copiedFiles, ...generatedFiles]) {
    const ext = path.extname(file) || '(no ext)';
    byExt.set(ext, (byExt.get(ext) || 0) + 1);
  }
  const extRows = [...byExt.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([ext, count]) => `| ${ext} | ${count} |`)
    .join('\n');

  const text = `# MosPochin public deploy pack\n\n` +
    `Дата: **${new Date().toISOString()}**\n\n` +
    `## Результат\n\n` +
    `- ZIP: \`${zipRelative}\`\n` +
    `- SHA256: \`${shaRelative}\`\n` +
    `- ZIP size: **${humanSize(fileSize(zipPath))}**\n` +
    `- SHA256: \`${sha}\`\n` +
    `- Staging dir: \`${stageRelative}\`\n\n` +
    `## Состав\n\n` +
    `- Manifest entries: **${files.length}**\n` +
    `- Copied existing files: **${copiedFiles.length}**\n` +
    `- Generated runtime files: **${generatedFiles.length}** (${generatedFiles.join(', ')})\n` +
    `- Runtime files in version.json: **${version.runtime.files}**\n\n` +
    `## Распределение по расширениям\n\n` +
    `| Extension | Count |\n|---|---:|\n${extRows}\n\n` +
    `## Важные решения\n\n` +
    `- Production ZIP собирается строго по \`.deploy/include-files.txt\`.\n` +
    `- \`version.json\` генерируется на этапе pack, если отсутствует в root проекта.\n` +
    `- Docs/src/reports/.ai не входят в public runtime artifact.\n` +
    `- Для полного AI handoff использовать \`npm run handoff:pack\`, для production — \`npm run deploy:pack\`.\n`;

  fs.writeFileSync(reportPath, text);
  return reportPath;
}

function main() {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const name = argValue('--name', `mospochin-public-deploy-${date}.zip`);
  fs.mkdirSync(DIST_DIR, { recursive: true });
  mkdirClean(STAGE_DIR);

  const files = readManifest();
  const copiedFiles = [];
  const missing = [];

  for (const file of files) {
    if (file === 'version.json' && !fs.existsSync(path.join(ROOT_DIR, file))) {
      continue;
    }
    const abs = ensureInsideRoot(file);
    if (!fs.existsSync(abs)) {
      missing.push(file);
      continue;
    }
    if (fs.statSync(abs).isDirectory()) {
      missing.push(`${file} (directory is not deployable)`);
      continue;
    }
    copyRuntimeFile(file);
    copiedFiles.push(file);
  }

  if (missing.length) {
    throw new Error(`Missing deploy files:\n- ${missing.join('\n- ')}`);
  }

  const version = buildVersionJson(files, copiedFiles);
  fs.writeFileSync(path.join(STAGE_DIR, 'version.json'), `${JSON.stringify(version, null, 2)}\n`);
  const generatedFiles = ['version.json'];

  const zipPath = path.join(DIST_DIR, name);
  runZip(zipPath);
  const sha = sha256File(zipPath);
  const shaPath = `${zipPath}.sha256`;
  fs.writeFileSync(shaPath, `${sha}  ${path.basename(zipPath)}\n`);

  const reportPath = writeReport({ name, files, copiedFiles, generatedFiles, zipPath, shaPath, sha, version });

  console.log('\n✅ public deploy pack ready');
  console.log(`ZIP: ${toPosix(path.relative(ROOT_DIR, zipPath))}`);
  console.log(`SHA256: ${toPosix(path.relative(ROOT_DIR, shaPath))}`);
  console.log(`REPORT: ${toPosix(path.relative(ROOT_DIR, reportPath))}`);
  console.log(`FILES: ${copiedFiles.length + generatedFiles.length}`);
}

try {
  main();
} catch (error) {
  console.error(`❌ deploy:pack failed: ${error.message}`);
  process.exit(1);
}
