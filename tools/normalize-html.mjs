import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_ROOT = path.resolve(__dirname, '..');

const HOUSEHOLD_PAGES = new Set([
  'bytovaya-index.html',
  'bytovaya-uslugi.html',
  'bytovaya-about.html',
  'bytovaya-contact.html',
  'holodilniki.html',
  'stiralnye-mashiny.html',
  'posudomoyki.html',
  'kompyutery.html',
  'routery.html',
  'microwaves.html',
  'airconditioners.html',
  'water-heaters.html',
]);

const PROD_PAGES = fs
  .readdirSync(SITE_ROOT)
  .filter((file) => file.endsWith('.html'))
  .sort();

function ensureSingleBlankLines(input) {
  return input
    .replace(/\r\n/g, '\n')
    .replace(/\n[ \t]*\n(?=<)/g, '\n\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function normalizeHeadAssets(fileName, originalHead, hasForm) {
  const usesManrope = HOUSEHOLD_PAGES.has(fileName);
  const cleanedHead = originalHead
    .replace(/\s*<link[^>]+href="(?:styles-built\.css|styles\.css|\/assets\/fonts\/manrope\.css|\/assets\/fonts\/remixicon\.css|favicon\.svg|https:\/\/fonts\.gstatic\.com|https:\/\/cdnjs\.cloudflare\.com)[^"]*"[^>]*>\s*/gi, '\n')
    .replace(/\s*<link[^>]+rel="preload"[^>]+href="(?:styles-built\.css|styles\.css|main\.js|\/assets\/fonts\/manrope\.css|\/assets\/fonts\/remixicon\.css)"[^>]*>\s*/gi, '\n')
    .replace(/\s*<script[^>]+src="(?:main\.js|telegram-form\.js|\/assets\/js\/telegram-form\.js)"[^>]*><\/script>\s*/gi, '\n')
    .replace(/^\s*<!--\s*(?:Meta|SEO|Open Graph|Twitter|Favicon|Fonts \(Local\)|CSS \(Local\)|JS \(Local, deferred\)|Structured Data \(JSON-LD\))\s*-->\s*$/gim, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const assetBlock = [
    '<meta charset="UTF-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1.0">',
    '<link rel="icon" href="favicon.svg" type="image/svg+xml">',
    usesManrope ? '<link rel="preload" href="/assets/fonts/manrope.css" as="style">' : null,
    usesManrope ? '<link rel="stylesheet" href="/assets/fonts/manrope.css">' : null,
    '<link rel="preload" href="/assets/fonts/remixicon.css" as="style">',
    '<link rel="stylesheet" href="/assets/fonts/remixicon.css">',
    '<link rel="preload" href="styles-built.css" as="style">',
    '<link rel="stylesheet" href="styles-built.css">',
    '<link rel="preload" href="styles.css" as="style">',
    '<link rel="stylesheet" href="styles.css">',
    '<script src="main.js" defer></script>',
    hasForm ? '<script src="telegram-form.js" defer></script>' : null,
  ]
    .filter(Boolean)
    .join('\n    ');

  const withoutCoreMeta = cleanedHead
    .replace(/\s*<meta[^>]+charset="[^"]+"[^>]*>\s*/i, '\n')
    .replace(/\s*<meta[^>]+name="viewport"[^>]*>\s*/i, '\n')
    .trim();

  return `    ${assetBlock}\n\n    ${withoutCoreMeta}`.replace(/\n{3,}/g, '\n\n');
}

function normalizeBody(fileName, originalBody) {
  const cleanedBody = originalBody
    .replace(/\s*<!--\s*Normalized layout shell:[\s\S]*?-->\s*/gi, '\n')
    .replace(/\s*<script[^>]+src="(?:telegram-form\.js|\/assets\/js\/telegram-form\.js)"[^>]*><\/script>\s*/gi, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return [
    '<body class="font-sans text-slate-800 antialiased bg-white">',
    `    <!-- Normalized layout shell: ${fileName} -->`,
    cleanedBody.replace(/^<body[^>]*>/i, '').replace(/<\/body>$/i, '').trim(),
    '</body>',
  ].join('\n');
}

for (const fileName of PROD_PAGES) {
  const filePath = path.join(SITE_ROOT, fileName);
  const source = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

  const headMatch = source.match(/<head>([\s\S]*?)<\/head>/i);
  const bodyMatch = source.match(/<body[\s\S]*?<\/body>/i);

  if (!headMatch || !bodyMatch) {
    throw new Error(`Cannot normalize ${fileName}: missing <head> or <body>.`);
  }

  const hasForm = /class="telegram-form\b/.test(source);
  const normalizedHead = normalizeHeadAssets(fileName, headMatch[1], hasForm);
  const normalizedBody = normalizeBody(fileName, bodyMatch[0]);

  const rewritten = ensureSingleBlankLines([
    '<!DOCTYPE html>\n<html lang="ru" class="scroll-smooth">',
    `<head>\n${normalizedHead}\n</head>`,
    normalizedBody,
    '</html>',
  ].join('\n\n'));

  fs.writeFileSync(filePath, `${rewritten}\n`);
}

console.log(`Normalized ${PROD_PAGES.length} HTML pages.`);
