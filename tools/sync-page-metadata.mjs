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
  const filePath = path.join(SITE_ROOT, fileName);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing page file: ${fileName}`);
  }

  let html = fs.readFileSync(filePath, 'utf8').replace(/\r\n/g, '\n');

  html = replaceOrInsert(
    html,
    /<title>[\s\S]*?<\/title>/i,
    `<title>${page.title}</title>`,
    '<meta name="description"'
  );

  html = replaceOrInsert(
    html,
    /<meta[^>]+name="description"[^>]+content="[^"]*"[^>]*>/i,
    `<meta name="description" content="${page.description}">`,
    '</title>'
  );

  if (page.canonical) {
    html = replaceOrInsert(
      html,
      /<link[^>]+rel="canonical"[^>]+href="[^"]*"[^>]*>/i,
      `<link rel="canonical" href="${page.canonical}">`,
      '</head>'
    );
  } else {
    html = removeTag(html, /\n?\s*<link[^>]+rel="canonical"[^>]*>\s*/i);
  }

  if (page.ogUrl) {
    html = replaceOrInsert(
      html,
      /<meta[^>]+property="og:url"[^>]+content="[^"]*"[^>]*>/i,
      `<meta property="og:url" content="${page.ogUrl}">`,
      '</head>'
    );
  } else {
    html = removeTag(html, /\n?\s*<meta[^>]+property="og:url"[^>]*>\s*/i);
  }

  if (page.robots) {
    html = replaceOrInsert(
      html,
      /<meta[^>]+name="robots"[^>]+content="[^"]*"[^>]*>/i,
      `<meta name="robots" content="${page.robots}">`,
      '</head>'
    );
  }

  fs.writeFileSync(filePath, `${html.replace(/\n{3,}/g, '\n\n').trim()}\n`);
}

console.log(`Synced metadata for ${Object.keys(metadata.pages).length} pages.`);
