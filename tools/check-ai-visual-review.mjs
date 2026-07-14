#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

function parseArgs(argv) {
  const result = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[index + 1];
    if (!next || next.startsWith('--')) {
      result[key] = true;
      continue;
    }
    result[key] = next;
    index += 1;
  }
  return result;
}

const args = parseArgs(process.argv.slice(2));
const reviewPath = path.resolve(ROOT_DIR, String(args.review || 'reports/visual-ai-review/latest/review.json'));
const errors = [];

if (!fs.existsSync(reviewPath)) {
  errors.push(`Missing AI visual review file: ${path.relative(ROOT_DIR, reviewPath)}`);
} else {
  let data = null;
  try {
    data = JSON.parse(fs.readFileSync(reviewPath, 'utf8'));
  } catch (error) {
    errors.push(`Invalid JSON in ${path.relative(ROOT_DIR, reviewPath)}: ${error.message}`);
  }

  if (data) {
    if (data.finalStatus !== 'pass') {
      errors.push(`finalStatus must be "pass" after AI screenshot review, got "${data.finalStatus}"`);
    }

    if (!Array.isArray(data.items) || data.items.length === 0) {
      errors.push('items must be a non-empty array');
    } else {
      for (const [index, item] of data.items.entries()) {
        const context = `items[${index}] ${item?.page || ''} ${item?.viewport || ''}`.trim();
        if (item.status !== 'pass') {
          errors.push(`${context}: status must be "pass", got "${item.status}"`);
        }
        if (!item.file || typeof item.file !== 'string') {
          errors.push(`${context}: file is required`);
        } else if (!fs.existsSync(path.resolve(ROOT_DIR, item.file))) {
          errors.push(`${context}: screenshot file missing: ${item.file}`);
        }
      }
    }

    if (data.requiredRecheckAfterFix !== true) {
      errors.push('requiredRecheckAfterFix must stay true');
    }
  }
}

console.log('# check-ai-visual-review');
if (errors.length) {
  console.error('❌ AI visual review is not complete:');
  for (const error of errors) console.error(`- ${error}`);
  console.error('\nRun screenshots, have the AI reviewer inspect images, fill review.json, fix issues, rerun screenshots, then set finalStatus=pass.');
  process.exit(1);
}

console.log('✅ AI visual review passed');
