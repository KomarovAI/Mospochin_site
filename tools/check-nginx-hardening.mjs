#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const snippetPath = path.join(ROOT, 'deploy/nginx/mospochin-runtime-hardening.conf');
const applyPath = path.join(ROOT, 'deploy/nginx/apply-nginx.sh');
const errors = [];

if (!fs.existsSync(snippetPath)) errors.push('runtime hardening snippet is missing');
if (!fs.existsSync(applyPath)) errors.push('apply-nginx.sh is missing');

if (!errors.length) {
  const snippet = fs.readFileSync(snippetPath, 'utf8');
  const apply = fs.readFileSync(applyPath, 'utf8');
  const requiredSnippetTokens = [
    'server|tools|deploy|\\.deploy',
    'location = /package.json',
    'styles-combined\\.css',
    'no-cache, no-store, must-revalidate',
    'gzip on;',
  ];
  for (const token of requiredSnippetTokens) if (!snippet.includes(token)) errors.push(`hardening snippet missing: ${token}`);
  if (!apply.includes('mospochin-runtime-hardening.conf')) errors.push('apply-nginx.sh does not install/include runtime hardening');
}

if (errors.length) {
  console.error('❌ nginx hardening check failed');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log('✅ nginx hardening contract verified');
