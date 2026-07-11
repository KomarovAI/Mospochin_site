#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';

const root = process.cwd();
const port = 3400 + (process.pid % 500);
const logDir = path.join(os.tmpdir(), `mospochin-bot-smoke-${process.pid}`);
fs.rmSync(logDir, { recursive: true, force: true });
fs.mkdirSync(logDir, { recursive: true });

const child = spawn(process.execPath, ['server/telegram-api.mjs'], {
  cwd: root,
  env: { ...process.env, PORT: String(port), MOSPOCHIN_LOG_DIR: logDir },
  stdio: 'ignore',
});

async function request(url, options = {}) {
  const response = await fetch(`http://127.0.0.1:${port}${url}`, options);
  return {
    status: response.status,
    headers: response.headers,
    body: await response.text(),
  };
}

async function waitForHealth() {
  for (let attempt = 0; attempt < 30; attempt += 1) {
    try {
      const response = await request('/health');
      if (response.status === 200) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  throw new Error('metrics API did not become healthy');
}

function jsonBody(value) {
  return JSON.stringify(value);
}

try {
  await waitForHealth();
  const common = {
    event: 'page_view',
    page_path: '/parokonvektomat-kod-oshibki.html',
    page_intent: 'error_code',
    page_version: 'bot-smoke-v1',
    session_id: 'bot-smoke-session',
    quality: 'human_candidate',
  };
  const headers = {
    'Content-Type': 'application/json',
    Origin: `http://localhost:${port}`,
  };

  const botUa = await request('/api/track-event', {
    method: 'POST',
    headers: { ...headers, 'User-Agent': 'Googlebot/2.1 (+http://www.google.com/bot.html)' },
    body: jsonBody({ ...common, user_agent: 'Googlebot/2.1' }),
  });
  if (botUa.status !== 204 || botUa.headers.get('x-mospochin-metrics') !== 'ignored-bot') {
    throw new Error(`Googlebot was not ignored: status=${botUa.status}`);
  }

  const webdriver = await request('/api/track-event', {
    method: 'POST',
    headers,
    body: jsonBody({ ...common, navigator_webdriver: true, user_agent: 'Mozilla/5.0' }),
  });
  if (webdriver.status !== 204) throw new Error(`webdriver event was not ignored: status=${webdriver.status}`);

  const human = await request('/api/track-event', {
    method: 'POST',
    headers: { ...headers, 'User-Agent': 'Mozilla/5.0 Chrome/131.0.0.0 Safari/537.36' },
    body: jsonBody({ ...common, session_id: 'human-smoke-session', user_agent: 'Mozilla/5.0 Chrome/131.0.0.0 Safari/537.36' }),
  });
  if (human.status !== 202) throw new Error(`human event was not accepted: status=${human.status}`);

  const accepted = fs.readFileSync(path.join(logDir, 'site_events.jsonl'), 'utf8')
    .trim().split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
  if (accepted.length !== 1 || accepted[0].event !== 'page_view' || accepted[0].session_id_hash === '') {
    throw new Error(`unexpected accepted event rows: ${JSON.stringify(accepted)}`);
  }
  const rejected = fs.readFileSync(path.join(logDir, 'site_event_rejects.jsonl'), 'utf8')
    .trim().split(/\r?\n/).filter(Boolean).map((line) => JSON.parse(line));
  if (rejected.filter((row) => row.reject_reason === 'bot_user_agent').length !== 2) {
    throw new Error(`bot reject rows missing: ${JSON.stringify(rejected)}`);
  }

  console.log('Metrics bot smoke passed: Googlebot/webdriver ignored before accepted log; human event accepted.');
} finally {
  child.kill('SIGTERM');
}
