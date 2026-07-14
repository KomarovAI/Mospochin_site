#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { hashContent, readSectionContent, renderParametricTemplate, ROOT_DIR } from './site-builder-lib.mjs';
import { parseArgs } from './ai-maintenance-lib.mjs';

const args = parseArgs();
const checkMode = Boolean(args.check);
const LEAD_TEMPLATE = 'src/components/parametric/lead-form/restaurant-parokonvektomat-b2b.template.html';
const MOBILE_FOOTER_TEMPLATE = 'src/components/parametric/mobile-contact/mobile-footer-container.template.html';
const WHATSAPP_TEMPLATE = 'src/components/parametric/mobile-contact/whatsapp-float-container.template.html';
const STATIC_CONTRACT = 'src/components/parametric/static/static-core.contract.json';
const PROPS_DIR = 'content/components/lead-form';

function abs(path) { return join(ROOT_DIR, path); }
function read(path) { return readFileSync(abs(path), 'utf8'); }
function write(path, content) { const target = abs(path); mkdirSync(dirname(target), { recursive: true }); writeFileSync(target, content); }
function readJson(path) { return JSON.parse(read(path)); }
function writeJson(path, value) { write(path, `${JSON.stringify(value, null, 2)}\n`); }
function relSectionPath(model, section) {
  return section.file ? `src/pages/${model.slug}/${section.file}` : null;
}
function removeProjectFile(path) {
  if (path && existsSync(abs(path))) rmSync(abs(path));
}
function matchOne(html, re, label) {
  const match = html.match(re);
  if (!match) throw new Error(`Не удалось извлечь ${label}`);
  return match[1];
}
function matchOptional(html, re, fallback) {
  return html.match(re)?.[1] || fallback;
}
function inputAttribute(html, field, attribute, fallback = '') {
  const escapedField = String(field).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const tag = (html.match(/<input\b[^>]*>/gi) || [])
    .find((candidate) => new RegExp(`\\bname=["']${escapedField}["']`, 'i').test(candidate));
  if (!tag) return fallback;
  const match = tag.match(new RegExp(`\\b${attribute}=["']([^"']*)["']`, 'i'));
  return match?.[1] || fallback;
}
function extractB2bProps(page, slug, html) {
  if (!html.includes('data-slot="request-form"', 'data-form-id', 'data-cta-group="form_submit"')) return null;
  if (!html.includes('Модель пароконвектомата')) return null;
  if (!html.includes('name="address"') || !html.includes('name="business_type"')) return null;
  if (html.includes('name="quantity"')) return null;
  if (!html.includes('name="problem"')) return null;
  const props = {
    schemaVersion: 1,
    component: 'lead-form',
    variant: 'restaurant-parokonvektomat-b2b',
    page,
    idPrefix: slug,
    title: matchOne(html, /<h2 class="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-brand-blue mb-3 sm:mb-4 heading-reveal">([\s\S]*?)<\/h2>/, 'title').trim(),
    subtitle: matchOne(html, /<p class="text-slate-600 text-base sm:text-lg max-w-2xl mx-auto">([\s\S]*?)<\/p>/, 'subtitle').trim(),
    formContext: matchOne(html, /data-form-context="([^"]+)"/, 'form context'),
    formId: matchOne(html, /<form[\s\S]*?data-form-id="([^"]+)"/, 'form id'),
    submitCtaId: matchOptional(html, /<button\b[^>]*data-cta-id="([^"]+)"[^>]*>/i, `${slug}-submit`),
    ids: {
      name: inputAttribute(html, 'name', 'id', `${slug}-name`),
      phone: inputAttribute(html, 'phone', 'id', `${slug}-phone`),
      type: inputAttribute(html, 'type', 'id', `${slug}-type`),
      problem: inputAttribute(html, 'problem', 'id', `${slug}-problem`),
      address: inputAttribute(html, 'address', 'id', `${slug}-address`),
      businessType: inputAttribute(html, 'business_type', 'id', `${slug}-business-type`),
    },
    placeholders: {
      type: inputAttribute(html, 'type', 'placeholder'),
      problem: inputAttribute(html, 'problem', 'placeholder'),
      address: inputAttribute(html, 'address', 'placeholder'),
      businessType: inputAttribute(html, 'business_type', 'placeholder'),
    },
    submitText: matchOne(html, /<i class="ri-send-plane-line mr-2"><\/i>([^\n<]+)\n\s*<\/button>/, 'submit text').trim(),
  };
  return props;
}
function makeLeadTemplateFromHtml(html, props) {
  const replacements = [
    [props.title, '{{title}}'],
    [props.subtitle, '{{subtitle}}'],
    [props.formContext, '{{formContext}}'],
    [props.formId, '{{formId}}'],
    [props.submitCtaId, '{{submitCtaId}}'],
    [props.ids.name, '{{ids.name}}'],
    [props.ids.phone, '{{ids.phone}}'],
    [props.ids.type, '{{ids.type}}'],
    [props.ids.problem, '{{ids.problem}}'],
    [props.ids.address, '{{ids.address}}'],
    [props.ids.businessType, '{{ids.businessType}}'],
    [props.placeholders.type, '{{placeholders.type}}'],
    [props.placeholders.problem, '{{placeholders.problem}}'],
    [props.placeholders.address, '{{placeholders.address}}'],
    [props.placeholders.businessType, '{{placeholders.businessType}}'],
    [props.submitText, '{{submitText}}'],
  ].sort((a, b) => b[0].length - a[0].length);
  let template = html;
  for (const [from, to] of replacements) template = template.split(from).join(to);
  return template;
}
function templatePathForHash(component, variant, html) {
  return `src/components/parametric/static/${component}-${variant}-${hashContent(html).slice(0, 12)}.template.html`;
}
function classifyStaticCoreSection(component, html) {
  if (component === 'noscript' && /^\s*<noscript><div><img src="https:\/\/mc\.yandex\.ru\/watch\/[0-9]+"[\s\S]*?<\/noscript>\s*$/.test(html)) {
    return { component: 'noscript', variant: 'yandex-metrika-pixel', templateRef: templatePathForHash('noscript', 'yandex-metrika-pixel', html) };
  }
  if (component === 'runtime-partials' && /^\s*<script src="partials-injector\.js" defer><\/script>\s*$/.test(html)) {
    return { component: 'runtime-partials', variant: 'partials-injector-script', templateRef: templatePathForHash('runtime-partials', 'partials-injector-script', html) };
  }
  if (component === 'footer-anchor' && /^\s*<div id="footer-container"><\/div>\s*$/.test(html)) {
    return { component: 'footer-anchor', variant: 'footer-container-mount', templateRef: templatePathForHash('footer-anchor', 'footer-container-mount', html) };
  }
  if (component === 'breadcrumb' && !/<nav\b/i.test(html) && /BREADCRUMB|Хлебные крошки/i.test(html)) {
    return { component: 'breadcrumb', variant: 'breadcrumb-marker', templateRef: templatePathForHash('breadcrumb', 'breadcrumb-marker', html) };
  }
  return null;
}

function safeVariantSlug(value) {
  const stripped = String(value)
    .replace(/<!--|-->/g, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/[^a-zA-Zа-яА-Я0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
  return stripped.slice(0, 48) || 'technical-fragment';
}

function buildRepeatedRawIndex(models) {
  const counts = new Map();
  for (const { model, path } of models) {
    for (const section of model.sections || []) {
      if (section.component !== 'raw' || section.componentMode === 'parametric' || !section.file) continue;
      const html = readSectionContent(path, section);
      const bytes = Buffer.byteLength(html, 'utf8');
      if (bytes > 256) continue;
      const current = counts.get(html) || { html, bytes, refs: 0 };
      current.refs += 1;
      counts.set(html, current);
    }
  }
  return new Map([...counts.values()].filter((item) => item.refs >= 3).map((item) => [item.html, item]));
}

function classifyRepeatedRawSection(component, html, repeatedRawIndex) {
  if (component !== 'raw') return null;
  const item = repeatedRawIndex.get(html);
  if (!item) return null;
  const hash = hashContent(html).slice(0, 12);
  const variant = `${safeVariantSlug(html)}-${hash}`;
  return {
    component: 'layout-fragment',
    variant,
    templateRef: `src/components/parametric/static/layout-fragment-${variant}.template.html`,
  };
}
function ensureComponentFiles(templateSource = null, firstProps = null) {
  if (!existsSync(abs(LEAD_TEMPLATE)) && templateSource && firstProps) write(LEAD_TEMPLATE, makeLeadTemplateFromHtml(templateSource, firstProps));
  if (!existsSync(abs(LEAD_TEMPLATE))) throw new Error(`${LEAD_TEMPLATE} не создан`);
  write('src/components/parametric/lead-form/restaurant-parokonvektomat-b2b.contract.json', JSON.stringify({
    schemaVersion: 1,
    component: 'lead-form',
    variant: 'restaurant-parokonvektomat-b2b',
    intent: 'B2B форма заявки для страниц ремонта пароконвектоматов',
    requiredFields: ['name', 'phone', 'type', 'problem', 'address', 'business_type'],
    requiredAttributes: ['action="/api/send-telegram"', 'method="post"', 'autocomplete="name"', 'autocomplete="tel"', 'inputmode="tel"', 'data-slot="request-form"', 'data-form-id', 'data-cta-group="form_submit"'],
    aiNotes: [
      'Компонент параметризует одинаковый B2B form layout: менять структуру формы в template, тексты/placeholder/button — в content/components/lead-form/*.json.',
      'После правки запускай npm run check:parameterized-components && npm run check:site-builder.',
    ],
  }, null, 2) + '\n');
  write(MOBILE_FOOTER_TEMPLATE, '\n<div id="mobile-footer-container"></div>');
  write(WHATSAPP_TEMPLATE, '\n<div id="whatsapp-float-container"></div>');
  write('src/components/parametric/mobile-contact/mobile-contact-containers.contract.json', JSON.stringify({
    schemaVersion: 1,
    component: 'mobile-contact',
    variants: ['mobile-footer-container', 'whatsapp-float-container'],
    intent: 'Mount points для runtime partials мобильного footer и floating WhatsApp',
    requiredContainers: ['mobile-footer-container', 'whatsapp-float-container'],
    aiNotes: ['Это параметризованные static mount components: менять HTML только если изменяется runtime partials contract.'],
  }, null, 2) + '\n');
  write(STATIC_CONTRACT, JSON.stringify({
    schemaVersion: 1,
    component: 'static-core',
    variants: ['noscript/yandex-metrika-pixel', 'runtime-partials/partials-injector-script', 'footer-anchor/footer-container-mount', 'breadcrumb/breadcrumb-marker', 'layout-fragment/repeated-static'],
    intent: 'Lossless parametric wrappers for tiny repeated technical and layout sections. They remove page-local section files without changing rendered HTML bytes.',
    editPolicy: 'Do not edit per-page generated root HTML. Change these templates only when the global technical mount/pixel/marker contract intentionally changes.',
    aiNotes: [
      'These templates intentionally preserve whitespace byte-for-byte; similar variants can differ only by surrounding newlines/spaces.',
      'After changes run npm run check:parameterized-components && npm run check:site-builder && npm run ai:check.',
    ],
  }, null, 2) + '\n');
}
function loadModels() {
  const manifest = readJson('src/site-builder.json');
  return manifest.pages.map((entry) => ({ entry, path: entry.model, model: readJson(entry.model) }));
}
function renderSectionFromParam(section) {
  const template = read(section.templateRef);
  const props = section.propsRef ? readJson(section.propsRef) : (section.props || {});
  return renderParametricTemplate(template, props);
}
function checkParameterizedComponents() {
  let errors = 0;
  let total = 0;
  let lead = 0;
  let mobile = 0;
  const staticCounts = new Map();
  for (const { model } of loadModels()) {
    for (const section of model.sections || []) {
      if (section.componentMode !== 'parametric') continue;
      total += 1;
      if (!section.templateRef || !existsSync(abs(section.templateRef))) {
        console.error(`❌ ${model.page} / ${section.id}: templateRef отсутствует или битый`);
        errors += 1;
        continue;
      }
      if (section.propsRef && !existsSync(abs(section.propsRef))) {
        console.error(`❌ ${model.page} / ${section.id}: propsRef отсутствует`);
        errors += 1;
        continue;
      }
      const html = renderSectionFromParam(section);
      const actualHash = hashContent(html).slice(0, 16);
      if (section.hash && section.hash !== actualHash) {
        console.error(`❌ ${model.page} / ${section.id}: hash parametric render mismatch ${actualHash} != ${section.hash}`);
        errors += 1;
      }
      if (section.component === 'lead-form') {
        lead += 1;
        const required = ['<form', 'action="/api/send-telegram"', 'method="post"', 'name="phone"', 'inputmode="tel"'];
        for (const needle of required) {
          if (!html.includes(needle)) {
            console.error(`❌ ${model.page} / ${section.id}: lead-form не содержит ${needle}`);
            errors += 1;
          }
        }
      }
      if (section.component === 'mobile-contact') mobile += 1;
      if (section.componentScope === 'parametric-static') {
        staticCounts.set(section.component, (staticCounts.get(section.component) || 0) + 1);
      }
    }
  }
  // Lead forms intentionally stay page-local: their copy and fields differ by
  // intent, while the shared runtime contract lives in telegram-form.js.
  if (mobile < 70) {
    console.warn(`⚠️ Parametric mobile-contact coverage ниже целевого порога: ${mobile}`);
  }
  const requiredStatic = { 'runtime-partials': 30, 'footer-anchor': 30, breadcrumb: 15 };
  for (const [component, min] of Object.entries(requiredStatic)) {
    const value = staticCounts.get(component) || 0;
    if (value < min) {
      console.warn(`⚠️ Parametric static ${component} coverage ниже целевого порога: ${value} < ${min}`);
    }
  }
  if (!errors) {
    const staticSummary = [...staticCounts.entries()].sort().map(([key, value]) => `${key}=${value}`).join(', ');
    console.log(`✅ Parameterized components OK: total=${total}, lead-form=${lead}, mobile-contact=${mobile}, static={${staticSummary}}`);
  }
  return errors;
}
function applyParameterization() {
  const models = loadModels();
  let migratedLead = 0;
  let migratedMobile = 0;
  let migratedStatic = 0;
  const staticCounts = new Map();
  let firstTemplateHtml = null;
  let firstProps = null;

  // First pass: find base lead template.
  for (const { model, path } of models) {
    for (const section of model.sections || []) {
      if (section.component !== 'lead-form' || section.componentMode === 'parametric') continue;
      const html = readSectionContent(path, section);
      const props = extractB2bProps(model.page, model.slug, html);
      if (props) { firstTemplateHtml = html; firstProps = props; break; }
    }
    if (firstTemplateHtml) break;
  }
  ensureComponentFiles(firstTemplateHtml, firstProps);
  const repeatedRawIndex = buildRepeatedRawIndex(models);

  for (const { model, path } of models) {
    let changed = false;
    for (const section of model.sections || []) {
      if (section.componentMode === 'parametric') continue;
      const originalPath = relSectionPath(model, section);
      const html = readSectionContent(path, section);
      if (section.component === 'lead-form') {
        const props = extractB2bProps(model.page, model.slug, html);
        if (props) {
          const propsPath = `${PROPS_DIR}/${model.slug}.json`;
          const rendered = renderParametricTemplate(read(LEAD_TEMPLATE), props);
          if (rendered !== html) {
            console.warn(`⚠️  ${model.page} / ${section.id}: lead-form не совпал с template, оставлен локальным`);
            continue;
          }
          writeJson(propsPath, props);
          section.componentMode = 'parametric';
          section.componentScope = 'parametric';
          section.variant = 'restaurant-parokonvektomat-b2b';
          section.templateRef = LEAD_TEMPLATE;
          section.propsRef = propsPath;
          section.sourceFile = section.sourceFile || section.file;
          delete section.file;
          delete section.componentRef;
          removeProjectFile(originalPath);
          migratedLead += 1;
          changed = true;
          continue;
        }
      }
      if (section.component === 'mobile-contact') {
        let templateRef = null;
        if (html === '\n<div id="mobile-footer-container"></div>') templateRef = MOBILE_FOOTER_TEMPLATE;
        if (html === '\n<div id="whatsapp-float-container"></div>') templateRef = WHATSAPP_TEMPLATE;
        if (templateRef) {
          section.componentMode = 'parametric';
          section.componentScope = 'parametric';
          section.variant = templateRef.includes('whatsapp') ? 'whatsapp-float-container' : 'mobile-footer-container';
          section.templateRef = templateRef;
          section.props = {};
          section.sourceFile = section.sourceFile || section.file;
          delete section.file;
          delete section.componentRef;
          removeProjectFile(originalPath);
          migratedMobile += 1;
          changed = true;
          continue;
        }
      }
      const repeatedRawSection = classifyRepeatedRawSection(section.component, html, repeatedRawIndex);
      if (repeatedRawSection) {
        write(repeatedRawSection.templateRef, html);
        section.component = repeatedRawSection.component;
        section.componentMode = 'parametric';
        section.componentScope = 'parametric-static';
        section.variant = repeatedRawSection.variant;
        section.templateRef = repeatedRawSection.templateRef;
        section.props = {};
        section.sourceFile = section.sourceFile || section.file;
        delete section.file;
        delete section.componentRef;
        removeProjectFile(originalPath);
        migratedStatic += 1;
        staticCounts.set(section.component, (staticCounts.get(section.component) || 0) + 1);
        changed = true;
        continue;
      }
      const staticSection = classifyStaticCoreSection(section.component, html);
      if (staticSection) {
        write(staticSection.templateRef, html);
        section.componentMode = 'parametric';
        section.componentScope = 'parametric-static';
        section.variant = staticSection.variant;
        section.templateRef = staticSection.templateRef;
        section.props = {};
        section.sourceFile = section.sourceFile || section.file;
        delete section.file;
        delete section.componentRef;
        removeProjectFile(originalPath);
        migratedStatic += 1;
        staticCounts.set(section.component, (staticCounts.get(section.component) || 0) + 1);
        changed = true;
      }
    }
    if (changed) writeJson(path, model);
  }
  const staticSummary = [...staticCounts.entries()].sort().map(([key, value]) => `${key}=${value}`).join(', ');
  console.log(`✅ Parametric migration complete: lead-form=${migratedLead}, mobile-contact=${migratedMobile}, static=${migratedStatic}${staticSummary ? ` (${staticSummary})` : ''}`);
}

if (args.help) {
  console.log(`\n# Core Parameterized Components\n\nКоманды:\n  npm run site-builder:parameterize-core\n  npm run check:parameterized-components\n`);
  process.exit(0);
}

if (checkMode) process.exit(checkParameterizedComponents() ? 1 : 0);
applyParameterization();
process.exit(checkParameterizedComponents() ? 1 : 0);
