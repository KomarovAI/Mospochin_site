#!/usr/bin/env node
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';

const versionPath = 'version.json';

const preserveFiles = [
  'reports/unused-assets.json',
  'reports/unused-assets.md'
];

function run(command, args) {
  console.log(`\n== ${command} ${args.join(' ')} ==`);
  execFileSync(command, args, {
    stdio: 'inherit',
    env: process.env
  });
}

function gitSha() {
  try {
    return execFileSync('git', ['rev-parse', 'HEAD'], {
      encoding: 'utf8'
    }).trim();
  } catch {
    return 'local';
  }
}

function readIfExists(file) {
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file);
}

function restorePreserved(snapshot) {
  for (const [file, content] of Object.entries(snapshot)) {
    if (content === null) {
      if (fs.existsSync(file)) fs.unlinkSync(file);
      continue;
    }

    fs.writeFileSync(file, content);
  }
}

const preserved = Object.fromEntries(
  preserveFiles.map((file) => [file, readIfExists(file)])
);

let createdVersion = false;

try {
  run('npm', ['run', 'check:core']);
  run('npm', ['run', 'check:assets']);

  // check:assets обновляет timestamp в reports/unused-assets.*.
  // Для predeploy-команды это read-only шум, поэтому возвращаем отчёты как были.
  restorePreserved(preserved);

  run('npm', ['run', 'generate:deploy-manifest']);
  run('npm', ['run', 'check:repo-budget']);
  run('npm', ['run', 'hash:deploy-content']);

  if (!fs.existsSync(versionPath)) {
    const payload = {
      commit: gitSha(),
      run_id: 'local-check-deploy',
      run_number: '0',
      deployed_at: new Date().toISOString().replace(/\.\d{3}Z$/, 'Z')
    };

    fs.writeFileSync(versionPath, JSON.stringify(payload, null, 2) + '\n');
    createdVersion = true;
    console.log('\ncreated temporary version.json for deploy:pack dry-run');
  }

  run('npm', ['run', 'deploy:pack']);

  console.log('\n✅ check:deploy passed');
} finally {
  restorePreserved(preserved);

  if (createdVersion && fs.existsSync(versionPath)) {
    fs.unlinkSync(versionPath);
    console.log('\nremoved temporary version.json');
  }
}
