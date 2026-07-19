import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_ROOT = path.resolve(__dirname, '..');
const METADATA_PATH = path.join(SITE_ROOT, 'data/page-metadata.json');

const metadata = JSON.parse(fs.readFileSync(METADATA_PATH, 'utf8'));

function upsertTag(html, matcher, replacement, anchor) {
  if (matcher.test(html)) {
    return html.replace(matcher, replacement);
  }

  if (!anchor) {
    return html;
  }

  return html.replace(anchor, `${replacement}\n${anchor.source === '<\\/head>' ? '' : ''}`);
}

function replaceOrInsert(html, regex, replacement, fallbackNeedle) {
  if (regex.test(html)) {
    return html.replace(regex, replacement);
  }

  if (!fallbackNeedle) {
    return html;
  }

  return html.replace(fallbackNeedle, `${replacement}\n${fallbackNeedle}`);
}

function removeTag(html, regex) {
  return html.replace(regex, '');
}

for (const [fileName, page] of Object.entries(metadata.pages)) {
  const rootPagePath = path.join(SITE_ROOT, fileName);
  if (!fs.existsSync(rootPagePath)) {
    throw new Error(`Missing page file: ${fileName}`);
  }

  const slug = fileName.replace(/\.html$/i, '');
  const sourceHeadPath = path.join(SITE_ROOT, 'src', 'pages', slug, 'head.html');
  const targetPaths = [rootPagePath];
  if (fs.existsSync(sourceHeadPath)) targetPaths.push(sourceHeadPath);

  for (const filePath of targetPaths) {
    let html = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

  html = replaceOrInsert(
    html,
    /<title>[\s\S]*?<\/title>/i,
    `<title>${page.title}</title>`,
    '<meta name="description"'
  );

  const descriptionTag = `<meta name="description" content="${page.description}">`;
  const descriptionMatcher = /<meta\b(?=[^>]*\bname=["']description["'])(?=[^>]*\bcontent=["'][^"']*["'])[^>]*>/i;
  if (descriptionMatcher.test(html)) {
    html = html.replace(descriptionMatcher, descriptionTag);
  } else {
    html = html.replace(/<\/title>/i, `</title>\n${descriptionTag}`);
  }

  if (page.canonical) {
    html = html.replace(/\s*<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>\s*/gi, '\n');
    html = html.replace('</head>', `<link rel="canonical" href="${page.canonical}">\n</head>`);
  } else {
    html = removeTag(html, /\s*<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>\s*/gi);
  }

  if (page.ogUrl) {
    html = html.replace(/\s*<meta\b(?=[^>]*\bproperty=["']og:url["'])[^>]*>\s*/gi, '\n');
    html = html.replace('</head>', `<meta property="og:url" content="${page.ogUrl}">\n</head>`);
  } else {
    html = removeTag(html, /\n?\s*<meta[^>]+property="og:url"[^>]*>\s*/i);
  }

  if (page.robots) {
    html = html.replace(/\s*<meta\b(?=[^>]*\bname=["']robots["'])[^>]*>\s*/gi, '\n');
    html = html.replace('</head>', `<meta name="robots" content="${page.robots}">\n</head>`);
  }

    fs.writeFileSync(filePath, `${html.replace(/\n{3,}/g, '\n\n').trim()}\n`);
  }
}

console.log(`Synced metadata for ${Object.keys(metadata.pages).length} pages.`);
