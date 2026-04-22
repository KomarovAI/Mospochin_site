import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_ROOT = path.resolve(__dirname, '..');
const DOCTOR_PAGE_PATH = path.join(SITE_ROOT, 'tools/doctor-page.mjs');

const result = spawnSync('node', [DOCTOR_PAGE_PATH, ...process.argv.slice(2)], {
  cwd: SITE_ROOT,
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
