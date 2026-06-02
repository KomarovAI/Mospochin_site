#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import {
  ROOT_DIR,
  SHARED_COMPONENTS_DIR,
  hashContent,
  loadBuilderManifest,
  readJsonFile,
  readSectionContent,
  readProjectFile,
  writeProjectFile,
} from './site-builder-lib.mjs';
import { parseArgs } from './ai-maintenance-lib.mjs';

const args = parseArgs();
const checkMode = Boolean(args.check);
const minBytes = Number(args.minBytes || args['min-bytes'] || 512);
const minRefs = Number(args.minRefs || args['min-refs'] || 2);
const manifest = loadBuilderManifest();

function help() {
  console.log(`\n# Site Builder Shared Components\n\nВытаскивает одинаковые section HTML-фрагменты из src/pages/* в src/components/shared/* без изменения итогового HTML.\n\nИспользование:\n  npm run site-builder:extract-shared\n  npm run check:shared-components\n  npm run site-builder:extract-shared -- --min-bytes 1024 --min-refs 3\n\nПо умолчанию: minBytes=512, minRefs=2.\n`);
}

if (args.help || !manifest) {
  if (!manifest) console.error('❌ src/site-builder.json не найден. Сначала: npm run site-builder:bootstrap');
  help();
  process.exit(manifest ? 0 : 1);
}

function safeStem(text, fallback) {
  const map = { а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y', к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f', х: 'h', ц: 'c', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya' };
  const stem = String(text || '')
    .toLowerCase()
    .replace(/[а-яё]/g, (ch) => map[ch] ?? ch)
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 58);
  return stem || fallback;
}

function normalizeComponentName(name) {
  return safeStem(String(name || 'raw'), 'raw');
}

function readCurrentManifestText() {
  return readProjectFile('src/site-builder.json');
}

function collectSections() {
  const records = [];
  for (const pageEntry of manifest.pages || []) {
    const modelPath = pageEntry.model;
    const model = readJsonFile(modelPath);
    for (const [index, section] of (model.sections || []).entries()) {
      const content = readSectionContent(modelPath, section);
      const hash = hashContent(content);
      records.push({
        page: pageEntry.page,
        modelPath,
        model,
        index,
        section,
        content,
        hash,
        bytes: Buffer.byteLength(content),
        component: section.component || 'raw',
        label: section.label || section.id || 'section',
      });
    }
  }
  return records;
}

function buildPlan() {
  const records = collectSections();
  const groups = new Map();
  for (const record of records) {
    if (!groups.has(record.hash)) groups.set(record.hash, []);
    groups.get(record.hash).push(record);
  }

  const candidates = [...groups.values()]
    .filter((group) => group.length >= minRefs && group[0].bytes >= minBytes)
    .sort((a, b) => (b.length * b[0].bytes) - (a.length * a[0].bytes) || a[0].hash.localeCompare(b[0].hash));

  const sharedByHash = new Map();
  for (const group of candidates) {
    const first = group[0];
    const componentDir = normalizeComponentName(first.component);
    const stem = safeStem(`${first.component}-${first.label}`, `${first.component}-${first.hash.slice(0, 12)}`);
    const sharedPath = `${SHARED_COMPONENTS_DIR}/${componentDir}/${stem}--${first.hash.slice(0, 16)}.html`;
    sharedByHash.set(first.hash, { sharedPath, group, content: first.content, component: first.component, label: first.label });
  }

  const projectedModels = new Map();
  const removedLocalFiles = new Set();
  const sharedFiles = new Map();

  for (const pageEntry of manifest.pages || []) {
    const model = readJsonFile(pageEntry.model);
    const next = JSON.parse(JSON.stringify(model));
    let refs = 0;
    for (const section of next.sections || []) {
      const currentRecord = records.find((record) => record.modelPath === pageEntry.model && record.section.id === section.id && record.index === (next.sections || []).indexOf(section));
      if (!currentRecord) continue;
      const shared = sharedByHash.get(currentRecord.hash);
      if (!shared) continue;
      if (section.file) {
        const localPath = `${dirname(pageEntry.model)}/${section.file}`.replace(/\\/g, '/');
        removedLocalFiles.add(localPath);
      }
      section.componentRef = shared.sharedPath;
      section.componentScope = 'shared';
      section.componentSignature = currentRecord.hash.slice(0, 16);
      section.sourceFile ||= section.file || null;
      delete section.file;
      refs += 1;
    }
    next.componentStats = {
      ...(next.componentStats || {}),
      sharedSectionRefs: refs,
      sharedSectionMinBytes: minBytes,
      sharedSectionMinRefs: minRefs,
    };
    projectedModels.set(pageEntry.model, `${JSON.stringify(next, null, 2)}\n`);
  }

  for (const shared of sharedByHash.values()) sharedFiles.set(shared.sharedPath, shared.content);

  const nextManifest = JSON.parse(readCurrentManifestText());
  nextManifest.status = 'shared-component-baseline';
  nextManifest.componentMode = 'shared-section-components-v1';
  nextManifest.sharedComponents = {
    directory: SHARED_COMPONENTS_DIR,
    minBytes,
    minRefs,
    componentFiles: sharedFiles.size,
    sharedSectionRefs: candidates.reduce((sum, group) => sum + group.length, 0),
    estimatedDuplicateBytesRemoved: candidates.reduce((sum, group) => sum + ((group.length - 1) * group[0].bytes), 0),
    note: 'Identical repeated section fragments are stored once in src/components/shared and referenced from page.json. Builder output remains byte-identical.',
  };
  nextManifest.workflow = {
    ...(nextManifest.workflow || {}),
    extractSharedComponents: 'npm run site-builder:extract-shared',
    checkSharedComponents: 'npm run check:shared-components',
    editSharedComponent: 'edit src/components/shared/*, then run npm run build:site -- --page <affected.html> --write and npm run check:site-builder',
  };

  return {
    candidates,
    projectedModels,
    sharedFiles,
    removedLocalFiles,
    nextManifestText: `${JSON.stringify(nextManifest, null, 2)}\n`,
    stats: nextManifest.sharedComponents,
  };
}

function applyPlan(plan) {
  for (const [path, content] of plan.sharedFiles) {
    mkdirSync(dirname(join(ROOT_DIR, path)), { recursive: true });
    writeFileSync(join(ROOT_DIR, path), content);
  }
  for (const [modelPath, json] of plan.projectedModels) writeProjectFile(modelPath, json);
  writeProjectFile('src/site-builder.json', plan.nextManifestText);
  for (const path of plan.removedLocalFiles) {
    if (existsSync(join(ROOT_DIR, path))) rmSync(join(ROOT_DIR, path));
  }
}

function verifyPlan(plan) {
  const mismatches = [];
  for (const [path, content] of plan.sharedFiles) {
    const abs = join(ROOT_DIR, path);
    if (!existsSync(abs)) mismatches.push(`${path}: отсутствует shared component file`);
    else if (readFileSync(abs, 'utf8') !== content) mismatches.push(`${path}: содержимое отличается от ожидаемого`);
  }
  for (const [modelPath, json] of plan.projectedModels) {
    const abs = join(ROOT_DIR, modelPath);
    if (!existsSync(abs)) mismatches.push(`${modelPath}: отсутствует page model`);
    else if (readFileSync(abs, 'utf8') !== json) mismatches.push(`${modelPath}: page model не соответствует shared-component projection`);
  }
  if (readCurrentManifestText() !== plan.nextManifestText) mismatches.push('src/site-builder.json: manifest не соответствует shared-component projection');
  for (const path of plan.removedLocalFiles) {
    if (existsSync(join(ROOT_DIR, path))) mismatches.push(`${path}: локальный дубль секции должен быть удалён после вынесения в shared component`);
  }
  return mismatches;
}

const plan = buildPlan();

if (checkMode) {
  const mismatches = verifyPlan(plan);
  if (mismatches.length) {
    console.error('❌ Shared components устарели. Запусти npm run site-builder:extract-shared');
    for (const item of mismatches.slice(0, 30)) console.error(`- ${item}`);
    if (mismatches.length > 30) console.error(`... ещё ${mismatches.length - 30}`);
    process.exit(1);
  }
  console.log(`✅ shared components актуальны: ${plan.stats.componentFiles} файлов, ${plan.stats.sharedSectionRefs} refs, duplicate bytes removed≈${(plan.stats.estimatedDuplicateBytesRemoved / 1024).toFixed(1)} KB`);
  process.exit(0);
}

applyPlan(plan);
console.log(`✅ Shared components extracted → ${SHARED_COMPONENTS_DIR}`);
console.log(`- shared component files: ${plan.stats.componentFiles}`);
console.log(`- shared section refs: ${plan.stats.sharedSectionRefs}`);
console.log(`- removed local duplicate files: ${plan.removedLocalFiles.size}`);
console.log(`- estimated duplicate source bytes removed: ${(plan.stats.estimatedDuplicateBytesRemoved / 1024).toFixed(1)} KB`);
console.log('Дальше: npm run check:shared-components && npm run check:site-builder');
