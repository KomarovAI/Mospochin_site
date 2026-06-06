#!/usr/bin/env node

const baseUrl = (process.env.PUBLIC_BASE_URL || 'https://mospochin.ru').replace(/\/+$/, '');
const expectedCommit = process.env.EXPECT_DEPLOY_COMMIT || '';
const requireCommit = process.env.REQUIRE_DEPLOY_COMMIT === 'true';

const checks = [];
const errors = [];

function ok(label, details = '') {
  checks.push({ label, ok: true, details });
  console.log(`✅ ${label}${details ? `: ${details}` : ''}`);
}

function fail(label, details = '') {
  checks.push({ label, ok: false, details });
  errors.push(`${label}${details ? `: ${details}` : ''}`);
  console.error(`❌ ${label}${details ? `: ${details}` : ''}`);
}

async function request(path, options = {}) {
  const url = `${baseUrl}${path}`;
  const attempts = Number(options.attempts || 5);
  const method = options.method || 'GET';

  let lastError = null;

  for (let i = 1; i <= attempts; i += 1) {
    try {
      const res = await fetch(url, {
        method,
        headers: options.headers || {},
        redirect: 'follow'
      });

      if (res.ok) {
        return res;
      }

      lastError = new Error(`${method} ${url} -> HTTP ${res.status}`);

      if (i < attempts) {
        await new Promise((resolve) => setTimeout(resolve, i * 1000));
        continue;
      }
    } catch (error) {
      lastError = error;

      if (i < attempts) {
        await new Promise((resolve) => setTimeout(resolve, i * 1000));
        continue;
      }
    }
  }

  throw lastError;
}

function hasHeader(headers, name, pattern) {
  const value = headers.get(name) || '';
  return pattern.test(value);
}

async function checkHead(path, label, expectations = []) {
  const res = await request(path, { method: 'HEAD' });

  ok(`${label} reachable`, `HTTP ${res.status}`);

  for (const exp of expectations) {
    const value = res.headers.get(exp.name) || '';
    if (exp.pattern.test(value)) {
      ok(`${label} header ${exp.name}`, value);
    } else {
      fail(`${label} header ${exp.name}`, `got "${value}", expected ${exp.pattern}`);
    }
  }
}

async function checkVersion() {
  const res = await request('/version.json');
  const text = await res.text();

  let version;
  try {
    version = JSON.parse(text);
  } catch {
    fail('version.json parse', text.slice(0, 200));
    return null;
  }

  ok('version.json reachable', `commit=${version.commit || 'missing'} run=${version.run_id || 'missing'}`);

  if (!version.commit) fail('version.json commit present');
  if (!version.run_id) fail('version.json run_id present');
  if (!version.run_number) fail('version.json run_number present');
  if (!version.deployed_at) fail('version.json deployed_at present');

  if (requireCommit) {
    if (!expectedCommit) {
      fail('expected commit configured', 'EXPECT_DEPLOY_COMMIT is empty');
    } else if (!String(version.commit || '').startsWith(expectedCommit)) {
      fail('version.json commit matches deploy commit', `got=${version.commit} expected=${expectedCommit}`);
    } else {
      ok('version.json commit matches deploy commit', version.commit);
    }
  } else {
    ok('version.json commit strict match skipped', 'hash-skip compatible mode');
  }

  return version;
}

async function main() {
  console.log('# Public deploy check');
  console.log(`baseUrl=${baseUrl}`);
  console.log(`requireCommit=${requireCommit}`);
  if (expectedCommit) console.log(`expectedCommit=${expectedCommit}`);

  await checkVersion();

  await checkHead('/', 'home html', [
    { name: 'cache-control', pattern: /no-cache/i },
    { name: 'cache-control', pattern: /no-store/i },
    { name: 'strict-transport-security', pattern: /max-age=31536000/i },
    { name: 'referrer-policy', pattern: /strict-origin-when-cross-origin/i }
  ]);

  await checkHead('/styles-combined.css', 'styles css', [
    { name: 'content-type', pattern: /text\/css/i },
    { name: 'cache-control', pattern: /max-age=/i },
    { name: 'cache-control', pattern: /immutable/i }
  ]);

  await checkHead('/main.js', 'main js', [
    { name: 'content-type', pattern: /(javascript|ecmascript)/i },
    { name: 'cache-control', pattern: /max-age=/i },
    { name: 'cache-control', pattern: /immutable/i }
  ]);

  await checkHead('/data/runtime-config.json', 'runtime config', [
    { name: 'content-type', pattern: /(json|octet-stream|text\/plain)/i }
  ]);

  console.log('');
  console.log(`checks=${checks.length}`);
  console.log(`errors=${errors.length}`);

  if (errors.length) {
    console.error('\nPublic deploy check failed:');
    for (const error of errors) console.error(`- ${error}`);
    process.exit(1);
  }

  console.log('\n✅ Public deploy check passed');
}

main().catch((error) => {
  console.error('❌ Public deploy check crashed');
  console.error(error && error.stack ? error.stack : error);
  process.exit(1);
});
