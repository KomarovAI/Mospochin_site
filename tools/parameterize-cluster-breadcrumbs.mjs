#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { hashContent, readSectionContent, renderParametricTemplate } from './site-builder-lib.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CLUSTER_ID = 'parokonvektomaty';
const MANIFEST = 'data/parokonvektomat-conversion-pages.json';
const TEMPLATE_DIR = 'src/components/parametric/breadcrumb';
const PROPS_DIR = 'content/components/breadcrumb';
const CONTRACT = `${TEMPLATE_DIR}/cluster-parokonvektomaty.contract.json`;
const checkMode = process.argv.includes('--check');

function abs(relativePath) { return path.join(ROOT, relativePath); }
function read(relativePath) { return readFileSync(abs(relativePath), 'utf8'); }
function readJson(relativePath) { return JSON.parse(read(relativePath)); }
function write(relativePath, content) {
  mkdirSync(path.dirname(abs(relativePath)), { recursive: true });
  writeFileSync(abs(relativePath), content);
}
function writeJson(relativePath, value) { write(relativePath, `${JSON.stringify(value, null, 2)}\n`); }
function attr(tag, name) { return tag.match(new RegExp(`\\b${name}=["']([^"']*)["']`, 'i'))?.[1] || ''; }
function text(html) { return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim(); }

function clusterPages() {
  return readJson(MANIFEST).pages.map((entry) => entry.page);
}

function localNavBreadcrumb(model) {
  return (model.sections || []).find((section) => {
    if (section.component !== 'breadcrumb' || section.componentMode === 'parametric' || !section.file) return false;
    return /<nav\b/i.test(readSectionContent(`src/pages/${model.slug}/page.json`, section));
  }) || null;
}

function breadcrumbProps(page, html) {
  const anchors = [...html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/gi)].map((match) => match[0]);
  const currentMatch = html.match(/(<li\b[^>]*class=["'][^"']*text-brand-orange[^"']*font-semibold[^"']*["'][^>]*>)([\s\S]*?)(<\/li>)/i);
  if (anchors.length < 2 || !currentMatch) throw new Error(`${page}: unsupported breadcrumb structure`);

  const links = anchors.map((anchor, index) => ({
    href: attr(anchor, 'href'),
    ctaId: attr(anchor, 'data-cta-id'),
    ctaGroup: attr(anchor, 'data-cta-group'),
    dataBlock: attr(anchor, 'data-block'),
    label: text(anchor),
    index,
  }));
  if (links.some((link) => !link.href || !link.ctaId || !link.label)) throw new Error(`${page}: incomplete breadcrumb link contract`);
  return {
    schemaVersion: 1,
    component: 'breadcrumb',
    cluster: CLUSTER_ID,
    page,
    links,
    currentLabel: text(currentMatch[2]),
  };
}

function makeTemplate(html, props) {
  let template = html;
  const anchors = [...html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/gi)].map((match) => match[0]);
  for (const [index, anchor] of anchors.entries()) {
    const link = props.links[index];
    let parameterized = anchor
      .replace(`href="${link.href}"`, `href="{{links.${index}.href}}"`)
      .replace(`data-cta-id="${link.ctaId}"`, `data-cta-id="{{links.${index}.ctaId}}"`)
      .replace(`data-cta-group="${link.ctaGroup}"`, `data-cta-group="{{links.${index}.ctaGroup}}"`)
      .replace(`data-block="${link.dataBlock}"`, `data-block="{{links.${index}.dataBlock}}"`);
    const labelOffset = parameterized.lastIndexOf(link.label);
    if (labelOffset === -1) throw new Error(`${props.page}: link label not found in breadcrumb anchor`);
    parameterized = `${parameterized.slice(0, labelOffset)}{{links.${index}.label}}${parameterized.slice(labelOffset + link.label.length)}`;
    template = template.replace(anchor, parameterized);
  }
  const currentPattern = /(<li\b[^>]*class=["'][^"']*text-brand-orange[^"']*font-semibold[^"']*["'][^>]*>)([\s\S]*?)(<\/li>)/i;
  template = template.replace(currentPattern, '$1{{currentLabel}}$3');
  return template;
}

function contractSource() {
  return {
    schemaVersion: 1,
    component: 'breadcrumb',
    cluster: CLUSTER_ID,
    intent: 'Lossless visible breadcrumb navigation for the parokonvektomat pilot cluster.',
    requiredAttributes: ['aria-label="Breadcrumb"', 'data-cta-group="internal_link"'],
    sourceManifest: MANIFEST,
    minimumCoverage: 16,
    references: [
      'https://developers.google.com/search/docs/appearance/structured-data/breadcrumb'
    ]
  };
}

function apply() {
  const templates = new Map();
  let migrated = 0;
  for (const page of clusterPages()) {
    const slug = page.replace(/\.html$/i, '');
    const modelPath = `src/pages/${slug}/page.json`;
    const model = readJson(modelPath);
    const section = localNavBreadcrumb(model);
    if (!section) continue;
    const originalPath = `src/pages/${slug}/${section.file}`;
    const html = readSectionContent(modelPath, section);
    const props = breadcrumbProps(page, html);
    const template = makeTemplate(html, props);
    const rendered = renderParametricTemplate(template, props);
    if (rendered !== html) throw new Error(`${page}: breadcrumb template is not byte-identical`);

    const templateHash = hashContent(template).slice(0, 12);
    const templateRef = `${TEMPLATE_DIR}/cluster-parokonvektomaty-${templateHash}.template.html`;
    const propsRef = `${PROPS_DIR}/${slug}.json`;
    if (templates.has(templateRef) && templates.get(templateRef) !== template) throw new Error(`${page}: template hash collision`);
    templates.set(templateRef, template);
    write(templateRef, template);
    writeJson(propsRef, props);

    section.componentMode = 'parametric';
    section.componentScope = 'parametric';
    section.variant = `cluster-parokonvektomaty-${templateHash}`;
    section.templateRef = templateRef;
    section.propsRef = propsRef;
    section.sourceFile = section.sourceFile || section.file;
    section.bytes = Buffer.byteLength(rendered, 'utf8');
    section.hash = hashContent(rendered).slice(0, 16);
    delete section.file;
    delete section.componentRef;
    writeJson(modelPath, model);
    rmSync(abs(originalPath));
    migrated += 1;
  }
  writeJson(CONTRACT, contractSource());
  console.log(`✅ Breadcrumb pilot migrated: ${migrated} sections, ${templates.size} byte-preserving templates`);
}

function check() {
  const contract = readJson(CONTRACT);
  let coverage = 0;
  const errors = [];
  for (const page of clusterPages()) {
    const slug = page.replace(/\.html$/i, '');
    const modelPath = `src/pages/${slug}/page.json`;
    const model = readJson(modelPath);
    for (const section of model.sections || []) {
      if (section.component !== 'breadcrumb' || !String(section.variant || '').startsWith('cluster-parokonvektomaty-')) continue;
      coverage += 1;
      if (!section.templateRef || !existsSync(abs(section.templateRef))) errors.push(`${page}/${section.id}: template missing`);
      if (!section.propsRef || !existsSync(abs(section.propsRef))) errors.push(`${page}/${section.id}: props missing`);
      if (errors.length) continue;
      const props = readJson(section.propsRef);
      const html = renderParametricTemplate(read(section.templateRef), props);
      if (props.page !== page) errors.push(`${page}/${section.id}: props page mismatch`);
      if (!html.includes('aria-label="Breadcrumb"') || !html.includes('data-cta-group="internal_link"')) errors.push(`${page}/${section.id}: navigation contract missing`);
      if (section.hash !== hashContent(html).slice(0, 16)) errors.push(`${page}/${section.id}: render hash mismatch`);
    }
  }
  if (coverage < contract.minimumCoverage) errors.push(`coverage ${coverage} < ${contract.minimumCoverage}`);
  if (errors.length) {
    console.error(`❌ Breadcrumb pilot failed: ${errors.length} issue(s)`);
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }
  console.log(`✅ Breadcrumb pilot contract: ${coverage} parametric sections`);
}

if (checkMode) check();
else {
  apply();
  check();
}
