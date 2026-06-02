#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { buildAiIndex, parseArgs, ROOT_DIR } from './ai-maintenance-lib.mjs';

const args = parseArgs();
const indexPath = join(ROOT_DIR, 'data', 'ai-project-index.json');
const next = JSON.stringify(buildAiIndex(), null, 2) + '\n';

if (args.check) {
  if (!existsSync(indexPath)) {
    console.error('❌ data/ai-project-index.json отсутствует. Запусти npm run generate:ai-index');
    process.exit(1);
  }
  const current = readFileSync(indexPath, 'utf8');
  if (current !== next) {
    console.error('❌ data/ai-project-index.json устарел. Запусти npm run generate:ai-index');
    process.exit(1);
  }
  console.log('✅ AI index актуален');
  process.exit(0);
}

writeFileSync(indexPath, next);
console.log('✅ data/ai-project-index.json обновлён');
