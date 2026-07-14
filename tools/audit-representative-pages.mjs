import path from 'path';
import { spawnSync } from 'child_process';
import {
  getAuditContractSummary,
  getDefaultArtifactDir,
  getSiteRoot,
} from './screenshot-audit-lib.mjs';

const SITE_ROOT = getSiteRoot();

function runNodeScript(scriptPath, args) {
  const result = spawnSync('node', [scriptPath, ...args], {
    cwd: SITE_ROOT,
    encoding: 'utf8',
  });

  if (result.status !== 0) {
    const output = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim();
    throw new Error(output || `${scriptPath} failed`);
  }

  return result.stdout.trim();
}

try {
  const args = process.argv.slice(2);
  const manifestFlagIndex = args.indexOf('--manifest');
  const manifestPath =
    manifestFlagIndex >= 0 && args[manifestFlagIndex + 1]
      ? args[manifestFlagIndex + 1]
      : undefined;
  const { manifest, errors } = getAuditContractSummary(manifestPath);
  if (errors.length) {
    throw new Error(`Representative audit contract failed:\n- ${errors.join('\n- ')}`);
  }

  for (const entry of manifest.pages) {
    runNodeScript('tools/doctor-page.mjs', ['--page', entry.page]);
  }

  const artifactDir = getDefaultArtifactDir(manifest);
  const screenshotArgs = ['--mode', 'manifest', '--output', path.relative(SITE_ROOT, artifactDir)];
  if (manifestPath) {
    screenshotArgs.push('--manifest', manifestPath);
  }
  runNodeScript('tools/visual-local-capture.mjs', screenshotArgs);

  console.log('Audit complete');
  console.log(`- pages checked: ${manifest.pages.map((entry) => entry.page).join(', ')}`);
  console.log(`- artifact folder: ${path.relative(SITE_ROOT, artifactDir)}`);
  console.log('- next step: review screenshots and record only confirmed issues in reports/manual-review-backlog.md');
  process.exit(0);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
