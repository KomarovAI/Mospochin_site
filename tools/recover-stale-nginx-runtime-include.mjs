#!/usr/bin/env node
// MOSPOCHIN_STALE_NGINX_INCLUDE_BOOTSTRAP_V5

import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';
import { pathToFileURL } from 'url';

const DEFAULT_SITE_CONFIG =
  '/etc/nginx/sites-available/mospochin.conf';
const DEFAULT_NGINX_BIN = 'nginx';
const INCLUDE_PATTERN =
  /^[ \t]*include[ \t]+(?:\/etc\/nginx\/)?snippets\/mospochin-runtime-hardening\.conf;[ \t]*(?:\r?\n|$)/gm;
const KNOWN_ERROR_PATTERN =
  /location\s+"\/package\.json"\s+is outside location[\s\S]*mospochin-runtime-hardening\.conf/i;

function runNginxTest(nginxBin) {
  const result = spawnSync(nginxBin, ['-t'], {
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  return {
    status:
      typeof result.status === 'number'
        ? result.status
        : 127,
    stdout: result.stdout ?? '',
    stderr:
      result.stderr ??
      (result.error ? String(result.error) : ''),
  };
}

function writeAtomicPreservingMetadata(filePath, content, metadata) {
  const directory = path.dirname(filePath);
  const temporary = path.join(
    directory,
    `.${path.basename(filePath)}.bootstrap-v5-${process.pid}.tmp`,
  );

  fs.writeFileSync(temporary, content, {
    encoding: 'utf8',
    mode: metadata.mode,
  });

  try {
    fs.chownSync(temporary, metadata.uid, metadata.gid);
  } catch (error) {
    if (typeof process.getuid === 'function' && process.getuid() === 0) {
      throw error;
    }
  }

  fs.chmodSync(temporary, metadata.mode);
  fs.renameSync(temporary, filePath);
}

export function recoverStaleNginxRuntimeInclude(options = {}) {
  const siteConfig =
    options.siteConfig ??
    process.env.MOSPOCHIN_NGINX_SITE_CONFIG ??
    DEFAULT_SITE_CONFIG;
  const nginxBin =
    options.nginxBin ??
    process.env.MOSPOCHIN_NGINX_BIN ??
    DEFAULT_NGINX_BIN;

  if (!fs.existsSync(siteConfig)) {
    return {
      status: 'site-config-missing',
      changed: false,
    };
  }

  const initial = runNginxTest(nginxBin);

  if (initial.status === 0) {
    return {
      status: 'nginx-already-valid',
      changed: false,
    };
  }

  const initialOutput =
    `${initial.stdout}\n${initial.stderr}`;

  if (!KNOWN_ERROR_PATTERN.test(initialOutput)) {
    console.error(
      'MOSPOCHIN_EARLY_NGINX_BOOTSTRAP_V5=SKIP_UNKNOWN_ERROR',
    );
    console.error(initialOutput.trim());
    return {
      status: 'unknown-nginx-error',
      changed: false,
    };
  }

  const original = fs.readFileSync(siteConfig, 'utf8');
  const matches = original.match(INCLUDE_PATTERN) ?? [];

  if (matches.length === 0) {
    throw new Error(
      'Known stale Nginx error detected, but runtime-hardening include line was not found',
    );
  }

  const metadata = fs.statSync(siteConfig);
  const repaired = original.replace(INCLUDE_PATTERN, '');

  if (repaired === original) {
    throw new Error(
      'Runtime-hardening include removal produced no change',
    );
  }

  const backup =
    `${siteConfig}.bootstrap-v5-${new Date()
      .toISOString()
      .replace(/[:.]/g, '-')}.bak`;

  fs.copyFileSync(siteConfig, backup);
  fs.chmodSync(backup, metadata.mode);

  try {
    fs.chownSync(backup, metadata.uid, metadata.gid);
  } catch (error) {
    if (typeof process.getuid === 'function' && process.getuid() === 0) {
      throw error;
    }
  }

  writeAtomicPreservingMetadata(
    siteConfig,
    repaired,
    metadata,
  );

  const after = runNginxTest(nginxBin);

  if (after.status !== 0) {
    writeAtomicPreservingMetadata(
      siteConfig,
      original,
      metadata,
    );

    throw new Error(
      [
        'Nginx remained invalid after exact stale include removal.',
        `stdout: ${after.stdout}`,
        `stderr: ${after.stderr}`,
        `backup: ${backup}`,
      ].join('\n'),
    );
  }

  console.log(
    'MOSPOCHIN_EARLY_NGINX_BOOTSTRAP_V5=REPAIRED',
  );
  console.log(
    `MOSPOCHIN_EARLY_NGINX_BOOTSTRAP_REMOVED=${matches.length}`,
  );
  console.log(
    `MOSPOCHIN_EARLY_NGINX_BOOTSTRAP_BACKUP=${backup}`,
  );

  return {
    status: 'repaired',
    changed: true,
    removed: matches.length,
    backup,
  };
}

const invokedDirectly =
  process.argv[1] &&
  import.meta.url === pathToFileURL(
    path.resolve(process.argv[1]),
  ).href;

if (invokedDirectly) {
  recoverStaleNginxRuntimeInclude();
}
