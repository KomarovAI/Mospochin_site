import fs from 'fs';
import crypto from 'crypto';
import http from 'http';
import dns from 'dns';
import https from 'https';
import net from 'net';
import path from 'path';
import tls from 'tls';
import { fileURLToPath } from 'url';
import { URL } from 'url';

dns.setDefaultResultOrder('ipv4first');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_ROOT = path.resolve(__dirname, '..');
const PAGE_METADATA_PATH = path.join(SITE_ROOT, 'data/page-metadata.json');
const PAGE_METADATA = JSON.parse(fs.readFileSync(PAGE_METADATA_PATH, 'utf8'));
const VALID_BRANCHES = new Set(['restaurant', 'household', 'neutral']);

const PORT = Number(process.env.PORT || 3010);
const HOST = process.env.HOST || '127.0.0.1';
const BOT_TOKEN = String(process.env.TELEGRAM_BOT_TOKEN || '').trim();
const CHAT_ID = String(process.env.TELEGRAM_CHAT_ID || '').trim();
const REQUEST_TIMEOUT_MS = Number(process.env.TELEGRAM_REQUEST_TIMEOUT_MS || 10000);
const MAX_BODY_BYTES = Number(process.env.MAX_BODY_BYTES || 16 * 1024);
const TELEGRAM_PROXY = String(process.env.TELEGRAM_PROXY || 'socks5h://127.0.0.1:58161').trim();
const RATE_LIMIT_WINDOW_MS = Number(process.env.RATE_LIMIT_WINDOW_MS || 10 * 60 * 1000);
const RATE_LIMIT_MAX_REQUESTS = Number(process.env.RATE_LIMIT_MAX_REQUESTS || 3);
const GLOBAL_RATE_LIMIT_WINDOW_MS = Number(process.env.GLOBAL_RATE_LIMIT_WINDOW_MS || 60 * 1000);
const GLOBAL_RATE_LIMIT_MAX_REQUESTS = Number(process.env.GLOBAL_RATE_LIMIT_MAX_REQUESTS || 20);
const EVENT_RATE_LIMIT_WINDOW_MS = Number(process.env.EVENT_RATE_LIMIT_WINDOW_MS || 60 * 1000);
const EVENT_RATE_LIMIT_MAX_REQUESTS = Number(process.env.EVENT_RATE_LIMIT_MAX_REQUESTS || 60);
const OUTCOME_TOKEN = String(process.env.MOSPOCHIN_OUTCOME_TOKEN || '').trim();
const BOT_USER_AGENT_RE = /bot\b|crawler|spider|slurp|bingpreview|headlesschrome|phantomjs|prerender|lighthouse/i;
const METRICS_LOG_DIR = String(process.env.MOSPOCHIN_LOG_DIR || path.join(SITE_ROOT, 'var', 'log', 'mospochin'));
const METRICS_HASH_SALT = String(process.env.MOSPOCHIN_METRICS_HASH_SALT || 'mospochin-archive-runtime-v1');
const MAX_NAME_LENGTH = 120;
const MAX_TYPE_LENGTH = 200;
const MAX_CONTEXT_LENGTH = 120;
const MAX_EXTRA_FIELDS = 6;
const MAX_EXTRA_FIELD_LENGTH = 200;

const ipRateLimit = new Map();
const globalRateLimit = new Map();
const eventRateLimit = new Map();
const RATE_LIMIT_CLEANUP_INTERVAL_MS = Math.max(1000, Math.min(RATE_LIMIT_WINDOW_MS, GLOBAL_RATE_LIMIT_WINDOW_MS, EVENT_RATE_LIMIT_WINDOW_MS));
const ALLOWED_EVENTS = new Set([
  'page_view',
  'phone_click',
  'whatsapp_click',
  'telegram_click',
  'email_click',
  'form_open',
  'form_start',
  'form_submit_attempt',
  'form_submit_success',
  'form_submit_error',
  'form_validation_error',
  'form_submit_blocked',
  'cta_view',
  'cta_click',
  'form_submit_click',
]);
const OUTCOME_EVENTS = new Set(['qualified_lead', 'call_answered', 'repair_order_created']);
const METRICS_QUALITY_VALUES = new Set(['human_candidate', 'suspicious', 'bot', 'internal', 'test']);

function sendJson(res, status, payload, extraHeaders = {}) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    ...extraHeaders,
  });
  res.end(JSON.stringify(payload));
}

async function readJsonBody(req) {
  const chunks = [];
  let totalBytes = 0;

  for await (const chunk of req) {
    totalBytes += chunk.length;
    if (totalBytes > MAX_BODY_BYTES) {
      throw new Error('payload_too_large');
    }
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

function parseSocksProxy(proxyUrl) {
  if (!proxyUrl) return null;

  const parsed = new URL(proxyUrl);
  if (parsed.protocol !== 'socks5:' && parsed.protocol !== 'socks5h:') {
    throw new Error('unsupported_proxy_protocol');
  }

  return {
    host: parsed.hostname,
    port: Number(parsed.port || 1080),
  };
}

function connectViaSocks5(proxy, targetHost, targetPort, timeoutMs) {
  return new Promise((resolve, reject) => {
    const socket = net.connect(proxy.port, proxy.host);
    socket.setTimeout(timeoutMs);

    const fail = (error) => {
      socket.destroy();
      reject(error);
    };

    socket.once('error', fail);
    socket.once('timeout', () => fail(new Error('proxy_connect_timeout')));

    socket.once('connect', () => {
      socket.write(Buffer.from([0x05, 0x01, 0x00]));
    });

    socket.once('data', (methodReply) => {
      if (methodReply.length < 2 || methodReply[0] !== 0x05 || methodReply[1] !== 0x00) {
        fail(new Error('proxy_auth_negotiation_failed'));
        return;
      }

      const hostBuffer = Buffer.from(targetHost, 'utf8');
      const request = Buffer.alloc(7 + hostBuffer.length);
      request[0] = 0x05;
      request[1] = 0x01;
      request[2] = 0x00;
      request[3] = 0x03;
      request[4] = hostBuffer.length;
      hostBuffer.copy(request, 5);
      request.writeUInt16BE(targetPort, 5 + hostBuffer.length);
      socket.write(request);

      socket.once('data', (connectReply) => {
        if (connectReply.length < 2 || connectReply[1] !== 0x00) {
          fail(new Error(`proxy_connect_failed_${connectReply[1] ?? 'unknown'}`));
          return;
        }

        socket.removeAllListeners('error');
        socket.removeAllListeners('timeout');
        socket.setTimeout(0);
        resolve(socket);
      });
    });
  });
}

function parseHttpHeaders(headerBlock) {
  const headers = new Map();
  for (const line of headerBlock.split('\r\n').slice(1)) {
    const separator = line.indexOf(':');
    if (separator === -1) continue;
    headers.set(line.slice(0, separator).trim().toLowerCase(), line.slice(separator + 1).trim().toLowerCase());
  }
  return headers;
}

function decodeChunkedBody(bodyBuffer) {
  const decodedChunks = [];
  let offset = 0;

  while (offset < bodyBuffer.length) {
    const lineEnd = bodyBuffer.indexOf('\r\n', offset);
    if (lineEnd === -1) throw new Error('telegram_invalid_chunked_response');

    const sizeLine = bodyBuffer.slice(offset, lineEnd).toString('ascii').split(';', 1)[0].trim();
    const chunkSize = Number.parseInt(sizeLine, 16);
    if (!Number.isFinite(chunkSize)) throw new Error('telegram_invalid_chunk_size');

    offset = lineEnd + 2;
    if (chunkSize === 0) return Buffer.concat(decodedChunks).toString('utf8');
    if (offset + chunkSize > bodyBuffer.length) throw new Error('telegram_incomplete_chunked_response');

    decodedChunks.push(bodyBuffer.slice(offset, offset + chunkSize));
    offset += chunkSize;

    if (bodyBuffer[offset] !== 13 || bodyBuffer[offset + 1] !== 10) {
      throw new Error('telegram_invalid_chunk_separator');
    }
    offset += 2;
  }

  throw new Error('telegram_unfinished_chunked_response');
}

async function postJson(urlString, requestBody) {
  const url = new URL(urlString);
  const proxy = parseSocksProxy(TELEGRAM_PROXY);

  if (!proxy) {
    return await new Promise((resolve, reject) => {
      const req = https.request(urlString, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(requestBody),
        },
        family: 4,
        timeout: REQUEST_TIMEOUT_MS,
      }, (res) => {
        const chunks = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          resolve({
            statusCode: res.statusCode || 0,
            raw: Buffer.concat(chunks).toString('utf8'),
          });
        });
      });

      req.on('timeout', () => {
        req.destroy(new Error('telegram_request_timeout'));
      });
      req.on('error', reject);
      req.write(requestBody);
      req.end();
    });
  }

  const upstreamSocket = await connectViaSocks5(proxy, url.hostname, Number(url.port || 443), REQUEST_TIMEOUT_MS);

  return await new Promise((resolve, reject) => {
    const tlsSocket = tls.connect({
      socket: upstreamSocket,
      servername: url.hostname,
      timeout: REQUEST_TIMEOUT_MS,
    });
    let settled = false;

    const finish = (error, payload) => {
      if (settled) return;
      settled = true;
      tlsSocket.destroy();
      if (error) {
        reject(error);
        return;
      }
      resolve(payload);
    };

    tlsSocket.once('timeout', () => finish(new Error('telegram_request_timeout')));
    tlsSocket.once('error', (error) => finish(error));

    tlsSocket.once('secureConnect', () => {
      const request = [
        `POST ${url.pathname}${url.search} HTTP/1.1`,
        `Host: ${url.hostname}`,
        'Content-Type: application/json',
        `Content-Length: ${Buffer.byteLength(requestBody)}`,
        'Accept-Encoding: identity',
        'Connection: close',
        '',
        requestBody,
      ].join('\r\n');
      tlsSocket.write(request);
    });

    const chunks = [];
    tlsSocket.on('data', (chunk) => chunks.push(chunk));
    tlsSocket.on('end', () => {
      const responseBuffer = Buffer.concat(chunks);
      const separator = responseBuffer.indexOf('\r\n\r\n');
      if (separator === -1) {
        finish(new Error('telegram_invalid_http_response'));
        return;
      }

      const headerBlock = responseBuffer.slice(0, separator).toString('utf8');
      const headers = parseHttpHeaders(headerBlock);
      const bodyBuffer = responseBuffer.slice(separator + 4);
      const statusLine = headerBlock.split('\r\n')[0] || '';
      const match = statusLine.match(/^HTTP\/\d+\.\d+\s+(\d{3})/);
      if (!match) {
        finish(new Error('telegram_invalid_status_line'));
        return;
      }

      let raw;
      try {
        raw = headers.get('transfer-encoding')?.includes('chunked')
          ? decodeChunkedBody(bodyBuffer)
          : bodyBuffer.toString('utf8');
      } catch (error) {
        finish(error);
        return;
      }

      finish(null, {
        statusCode: Number(match[1]),
        raw,
      });
    });
  });
}

async function deliverToTelegram(message) {
  if (!BOT_TOKEN || !CHAT_ID) {
    throw new Error('telegram_credentials_missing');
  }

  const requestBody = JSON.stringify({
    chat_id: CHAT_ID,
    text: message,
    disable_web_page_preview: true,
  });

  const { statusCode, raw } = await postJson(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, requestBody);

  let parsed = null;
  try {
    parsed = raw ? JSON.parse(raw) : null;
  } catch (error) {
    throw error;
  }

  if (statusCode !== 200 || !parsed?.ok) {
    const detail = parsed?.description || `telegram_http_${statusCode || 0}`;
    throw new Error(detail);
  }

  return parsed.result?.message_id ?? null;
}

function isLoopbackAddress(address) {
  return address === '127.0.0.1' || address === '::1' || address === '::ffff:127.0.0.1';
}

function getClientIp(req) {
  const remoteAddress = req.socket.remoteAddress || '';
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  if (forwarded && isLoopbackAddress(remoteAddress)) {
    return forwarded;
  }
  return remoteAddress || 'unknown';
}

function pruneRateLimitMap(map, windowMs, now = Date.now()) {
  for (const [key, timestamps] of map.entries()) {
    const recent = timestamps.filter((timestamp) => now - timestamp < windowMs);
    if (recent.length === 0) {
      map.delete(key);
    } else if (recent.length !== timestamps.length) {
      map.set(key, recent);
    }
  }
}

function consumeRateLimit(map, key, limit, windowMs, now) {
  const recent = (map.get(key) || []).filter((timestamp) => now - timestamp < windowMs);
  if (recent.length >= limit) {
    map.set(key, recent);
    return Math.max(1, Math.ceil((windowMs - (now - recent[0])) / 1000));
  }

  recent.push(now);
  map.set(key, recent);
  return 0;
}

function shortHash(value) {
  return crypto.createHash('sha256').update(`${METRICS_HASH_SALT}:${String(value || '')}`).digest('hex').slice(0, 24);
}

function appendJsonLine(fileName, row) {
  fs.mkdirSync(METRICS_LOG_DIR, { recursive: true, mode: 0o750 });
  fs.appendFileSync(path.join(METRICS_LOG_DIR, fileName), `${JSON.stringify(row)}\n`, { encoding: 'utf8', mode: 0o640 });
}

function userAgentFamily(value) {
  const userAgent = String(value || '').toLowerCase();
  if (/googlebot|yandexbot|bingbot|crawler|spider|bot\b/.test(userAgent)) return 'bot';
  if (/chrome|crios/.test(userAgent)) return 'chrome';
  if (/firefox|fxios/.test(userAgent)) return 'firefox';
  if (/safari/.test(userAgent)) return 'safari';
  if (/edg\//.test(userAgent)) return 'edge';
  return userAgent ? 'other' : 'unknown';
}

function sanitizeContactHref(value) {
  const href = String(value || '').trim().toLowerCase();
  if (href.startsWith('tel:')) return 'tel:[redacted]';
  if (href.startsWith('mailto:')) return 'mailto:[redacted]';
  if (href.includes('wa.me') || href.includes('whatsapp')) return 'whatsapp:[redacted]';
  if (href.includes('telegram') || href.startsWith('tg:')) return 'telegram:[redacted]';
  return href ? '[non-contact-link]' : '';
}

function redactSensitiveText(value) {
  return sanitizeString(value, 160)
    .replace(/(?:\+?\d[\d\s().-]{7,}\d)/g, '[phone:redacted]')
    .replace(/[\w.+-]+@[\w.-]+\.[a-z]{2,}/gi, '[email:redacted]');
}

function isAllowedEventOrigin(req) {
  const origin = String(req.headers.origin || '').trim();
  if (!origin) return true;
  try {
    const parsed = new URL(origin);
    const allowedHosts = new Set(['mospochin.ru', 'www.mospochin.ru', HOST, '127.0.0.1', 'localhost']);
    return allowedHosts.has(parsed.hostname);
  } catch {
    return false;
  }
}

function eventQuality(body, userAgent) {
  if (body?.test_mode === true) return 'test';
  if (body?.navigator_webdriver === true || /bot\b|crawler|spider/i.test(String(userAgent || ''))) return 'bot';
  return METRICS_QUALITY_VALUES.has(body?.quality) ? body.quality : 'human_candidate';
}

function isBotLikeRequest(body, req) {
  const userAgent = String(body?.user_agent || req.headers['user-agent'] || '');
  return body?.navigator_webdriver === true || BOT_USER_AGENT_RE.test(userAgent);
}

function ignoreBotResponse(res) {
  res.writeHead(204, {
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'X-Mospochin-Metrics': 'ignored-bot',
  });
  res.end();
}

function cleanPagePath(value) {
  const page = sanitizeString(value, 240);
  if (!page) return '/';
  try {
    return new URL(page, 'https://mospochin.ru').pathname.slice(0, 240);
  } catch {
    return page.startsWith('/') ? page.slice(0, 240) : `/${page.slice(0, 239)}`;
  }
}

function cleanReferrerHost(value) {
  try {
    return new URL(String(value || '')).hostname.slice(0, 120);
  } catch {
    return sanitizeString(value, 120).replace(/[^a-z0-9.-]/gi, '');
  }
}

function buildMetricRow(body, req) {
  const userAgent = String(body.user_agent || req.headers['user-agent'] || '');
  const attribution = body.attribution && typeof body.attribution === 'object' ? body.attribution : {};
  const leadId = body.lead_id_hash || body.lead_id;
  const row = {
    ts: new Date().toISOString(),
    event: body.event,
    page_path: cleanPagePath(body.page_path || body.page_url),
    page_intent: sanitizeString(body.page_intent, 80),
    page_version: sanitizeString(body.page_version, 80),
    lead_id_hash: leadId ? shortHash(leadId) : '',
    outcome_source: sanitizeString(body.outcome_source, 80),
    order_value_bucket: sanitizeString(body.order_value_bucket, 40),
    equipment: sanitizeString(body.equipment, 80),
    brand: sanitizeString(body.brand, 80),
    service: sanitizeString(body.service, 80),
    commercial_segment: sanitizeString(body.commercial_segment, 80),
    cta_id: sanitizeString(body.cta_id, 120),
    cta_group: sanitizeString(body.cta_group, 120),
    block: sanitizeString(body.block, 120),
    form_id: sanitizeString(body.form_id, 120),
    form_context: sanitizeString(body.form_context, 120),
    cta_text: redactSensitiveText(body.cta_text),
    contact_target: sanitizeContactHref(body.href || body.contact_target),
    field_name: sanitizeString(body.field_name, 80),
    reason: redactSensitiveText(body.reason || body.validation_message),
    referrer_host: cleanReferrerHost(body.referrer || body.referrer_host),
    utm_source: sanitizeString(body.utm_source || attribution.utm_source, 160),
    utm_medium: sanitizeString(body.utm_medium || attribution.utm_medium, 160),
    utm_campaign: sanitizeString(body.utm_campaign || attribution.utm_campaign, 200),
    utm_content: sanitizeString(body.utm_content || attribution.utm_content, 200),
    utm_term: redactSensitiveText(body.utm_term || attribution.utm_term),
    session_id_hash: shortHash(body.session_id),
    yclid_hash: shortHash(body.yclid || attribution.yclid),
    ip_hash: shortHash(getClientIp(req)),
    user_agent_family: userAgentFamily(userAgent),
    quality: eventQuality(body, userAgent),
    bot_flags: body.navigator_webdriver === true ? ['navigator.webdriver'] : [],
  };
  return Object.fromEntries(Object.entries(row).filter(([, value]) => value !== '' && value !== null && !(Array.isArray(value) && value.length === 0)));
}

function hasValidOutcomeToken(req) {
  if (!OUTCOME_TOKEN) return false;
  const header = String(req.headers.authorization || '');
  const actual = header.startsWith('Bearer ') ? header.slice(7).trim() : '';
  const expectedBuffer = Buffer.from(OUTCOME_TOKEN);
  const actualBuffer = Buffer.from(actual);
  return expectedBuffer.length === actualBuffer.length && crypto.timingSafeEqual(expectedBuffer, actualBuffer);
}

function writeRejectedEvent(reason, body, req) {
  appendJsonLine('site_event_rejects.jsonl', {
    ts: new Date().toISOString(),
    reject_reason: reason,
    event: sanitizeString(body?.event, 80),
    page_path: cleanPagePath(body?.page_path || body?.page_url),
    ip_hash: shortHash(getClientIp(req)),
    user_agent_family: userAgentFamily(body?.user_agent || req.headers['user-agent']),
  });
}

function writeDirectLead(submission, req) {
  const touch = submission.attribution?.last_touch || submission.attribution?.first_touch || {};
  appendJsonLine('direct_leads.jsonl', {
    ts: new Date().toISOString(),
    lead_id_hash: shortHash(`${submission.page}:${submission.phone}:${Date.now()}`),
    page_path: `/${submission.page}`,
    page_version: submission.pageVersion,
    branch: submission.branch,
    form_context: submission.formContext,
    phone_hash: shortHash(submission.phone),
    name_hash: shortHash(submission.name),
    problem_hash: shortHash(submission.problem),
    session_id_hash: shortHash(touch.session_id || req.headers['x-session-id']),
    yclid_hash: shortHash(touch.yclid),
    utm_source: sanitizeString(touch.utm_source, 160),
    utm_medium: sanitizeString(touch.utm_medium, 160),
    utm_campaign: sanitizeString(touch.utm_campaign, 200),
    utm_content: sanitizeString(touch.utm_content, 200),
    lead_status: 'lead_created',
    quality: 'human_candidate',
  });
}

function normalizePhone(value) {
  return String(value || '').replace(/[^\d+]/g, '').trim();
}

function isValidPhone(value) {
  const digits = String(value || '').replace(/\D/g, '');
  return digits.length >= 10 && digits.length <= 11;
}

function sanitizeString(value, maxLength) {
  return String(value || '').trim().replace(/\s+/g, ' ').slice(0, maxLength);
}

function sanitizeExtraFields(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};

  const entries = Object.entries(value).slice(0, MAX_EXTRA_FIELDS);
  const sanitized = {};

  for (const [key, rawValue] of entries) {
    const safeKey = sanitizeString(key, 40);
    const safeValue = sanitizeString(rawValue, MAX_EXTRA_FIELD_LENGTH);
    if (!safeKey || !safeValue) continue;
    sanitized[safeKey] = safeValue;
  }

  return sanitized;
}

function sanitizeAttribution(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;

  const sanitizeTouch = (touch) => {
    if (!touch || typeof touch !== 'object' || Array.isArray(touch)) return null;
    const allowed = {
      page_url: 800,
      page_path: 240,
      page_title: 240,
      landing_page: 240,
      referrer_host: 120,
      utm_source: 160,
      utm_medium: 160,
      utm_campaign: 200,
      utm_content: 200,
      utm_term: 200,
      utm_service: 160,
      utm_landing: 240,
      metrika_client_id: 160,
      ym_client_id: 160,
      yclid: 200,
      gclid: 200,
      captured_at: 80,
    };
    const result = {};
    for (const [key, maxLength] of Object.entries(allowed)) {
      const safeValue = sanitizeString(touch[key], maxLength);
      if (safeValue) result[key] = safeValue;
    }
    return Object.keys(result).length ? result : null;
  };

  const firstTouch = sanitizeTouch(value.first_touch);
  const lastTouch = sanitizeTouch(value.last_touch);
  if (!firstTouch && !lastTouch) return null;

  return {
    first_touch: firstTouch,
    last_touch: lastTouch,
  };
}

function getSourceLabel(branch) {
  if (branch === 'household') return 'B2C (Бытовая)';
  if (branch === 'restaurant') return 'B2B (Рестораны)';
  return 'Общий сайт';
}

function formatExtraFieldLabel(name) {
  const labels = {
    district: 'Район',
  };

  return labels[name] || name.replace(/[_-]+/g, ' ');
}

function buildTelegramMessage(submission) {
  const lines = [
    'Новая заявка с сайта MosPochin',
    '',
    `Источник заявки: ${getSourceLabel(submission.branch)} (${submission.page})`,
    `Телефон: ${submission.phone}`,
    `Имя: ${submission.name || 'не указано'}`,
    `Тип техники: ${submission.type || 'не указан'}`,
    `Проблема: ${submission.problem || 'не указана'}`,
  ];

  if (submission.formContext) {
    lines.push(`Контекст формы: ${submission.formContext}`);
  }

  if (submission.attribution?.last_touch) {
    const touch = submission.attribution.last_touch;
    lines.push('');
    lines.push('Рекламная атрибуция:');
    if (touch.utm_source) lines.push(`utm_source: ${touch.utm_source}`);
    if (touch.utm_medium) lines.push(`utm_medium: ${touch.utm_medium}`);
    if (touch.utm_campaign) lines.push(`utm_campaign: ${touch.utm_campaign}`);
    if (touch.utm_content) lines.push(`utm_content: ${touch.utm_content}`);
    if (touch.utm_term) lines.push(`utm_term: ${touch.utm_term}`);
    if (touch.yclid) lines.push(`yclid: ${touch.yclid}`);
    if (touch.metrika_client_id) lines.push(`metrika_client_id: ${touch.metrika_client_id}`);
    if (touch.landing_page) lines.push(`Вход: ${touch.landing_page}`);
    if (touch.referrer_host) lines.push(`Реферер: ${touch.referrer_host}`);
  }

  for (const [name, value] of Object.entries(submission.extraFields)) {
    lines.push(`${formatExtraFieldLabel(name)}: ${value}`);
  }

  lines.push('');
  lines.push(`Время: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}`);

  return lines.join('\n');
}

function validateSubmission(body) {
  const page = sanitizeString(body.page, 80);
  const pageMetadata = PAGE_METADATA.pages?.[page] || null;
  const branch = sanitizeString(body.branch, 20);
  const name = sanitizeString(body.name, MAX_NAME_LENGTH);
  const phone = normalizePhone(body.phone);
  const type = sanitizeString(body.type, MAX_TYPE_LENGTH);
  const problem = sanitizeString(body.problem, 500);
  const formContext = sanitizeString(body.formContext, MAX_CONTEXT_LENGTH);
  const pageVersion = sanitizeString(body.pageVersion, 80);
  const website = sanitizeString(body.website, 80);
  const extraFields = sanitizeExtraFields(body.extraFields);
  const attribution = sanitizeAttribution(body.attribution);
  const consent = body.consent === true;

  if (website) {
    return { error: 'spam_detected' };
  }

  if (!consent) {
    return { error: 'consent_required' };
  }

  if (!page || !pageMetadata || pageMetadata.hasForm !== true) {
    return { error: 'invalid_page' };
  }

  if (!VALID_BRANCHES.has(pageMetadata.branch)) {
    return { error: 'invalid_page_branch' };
  }

  if (branch && branch !== pageMetadata.branch) {
    return { error: 'branch_mismatch' };
  }

  if (!isValidPhone(phone)) {
    return { error: 'invalid_phone' };
  }

  return {
    submission: {
      page,
      branch: pageMetadata.branch,
      name,
      phone,
      type,
      problem,
      formContext,
      pageVersion,
      extraFields,
      attribution,
    }
  };
}

const server = http.createServer(async (req, res) => {
  try {
    if (!req.url) {
      sendJson(res, 400, { ok: false, error: 'bad_request' });
      return;
    }

    if (req.method === 'GET' && req.url === '/health') {
      sendJson(res, 200, {
        ok: true,
        service: 'mospochin-telegram-api',
        metrics: {
          ok: true,
          endpoint: '/api/track-event',
          outcomeEndpoint: '/api/track-outcome',
          outcomeTrackingConfigured: Boolean(OUTCOME_TOKEN),
          botFiltering: true,
        },
      });
      return;
    }

    if (req.method === 'POST' && req.url === '/api/track-outcome') {
      const contentType = String(req.headers['content-type'] || '').toLowerCase();
      if (!contentType.startsWith('application/json')) {
        sendJson(res, 415, { ok: false, error: 'content_type_required' });
        return;
      }
      if (!hasValidOutcomeToken(req)) {
        writeRejectedEvent('outcome_unauthorized', {}, req);
        sendJson(res, OUTCOME_TOKEN ? 403 : 503, { ok: false, error: OUTCOME_TOKEN ? 'outcome_unauthorized' : 'outcome_not_configured' });
        return;
      }
      const body = await readJsonBody(req);
      const event = sanitizeString(body.event, 80);
      if (!OUTCOME_EVENTS.has(event)) {
        writeRejectedEvent('unknown_outcome', body, req);
        sendJson(res, 400, { ok: false, error: 'unknown_outcome' });
        return;
      }
      const retryAfter = consumeRateLimit(
        eventRateLimit,
        getClientIp(req),
        EVENT_RATE_LIMIT_MAX_REQUESTS,
        EVENT_RATE_LIMIT_WINDOW_MS,
        Date.now(),
      );
      if (retryAfter > 0) {
        writeRejectedEvent('outcome_rate_limited', body, req);
        sendJson(res, 429, { ok: false, error: 'rate_limited' }, { 'Retry-After': String(retryAfter) });
        return;
      }
      appendJsonLine('site_events.jsonl', buildMetricRow({ ...body, event, quality: 'internal' }, req));
      sendJson(res, 202, { ok: true, accepted: true, outcome: event });
      return;
    }

    if (req.method === 'POST' && req.url === '/api/track-event') {
      const contentType = String(req.headers['content-type'] || '').toLowerCase();
      if (!contentType.startsWith('application/json')) {
        sendJson(res, 415, { ok: false, error: 'content_type_required' });
        return;
      }

      const contentLength = Number(req.headers['content-length'] || 0);
      if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
        sendJson(res, 413, { ok: false, error: 'payload_too_large' });
        return;
      }

      const body = await readJsonBody(req);
      if (isBotLikeRequest(body, req)) {
        writeRejectedEvent('bot_user_agent', body, req);
        ignoreBotResponse(res);
        return;
      }
      if (!isAllowedEventOrigin(req)) {
        writeRejectedEvent('bad_origin', body, req);
        sendJson(res, 403, { ok: false, error: 'bad_origin' });
        return;
      }

      const event = sanitizeString(body.event, 80);
      if (!ALLOWED_EVENTS.has(event)) {
        writeRejectedEvent('unknown_event', body, req);
        sendJson(res, 400, { ok: false, error: 'unknown_event' });
        return;
      }

      const retryAfter = consumeRateLimit(
        eventRateLimit,
        getClientIp(req),
        EVENT_RATE_LIMIT_MAX_REQUESTS,
        EVENT_RATE_LIMIT_WINDOW_MS,
        Date.now(),
      );
      if (retryAfter > 0) {
        writeRejectedEvent('rate_limited', body, req);
        sendJson(res, 429, { ok: false, error: 'rate_limited' }, { 'Retry-After': String(retryAfter) });
        return;
      }

      appendJsonLine('site_events.jsonl', buildMetricRow(body, req));
      sendJson(res, 202, { ok: true, accepted: true });
      return;
    }

    if (req.method === 'POST' && req.url === '/api/send-telegram') {
      const contentType = String(req.headers['content-type'] || '').toLowerCase();
      if (!contentType.startsWith('application/json')) {
        sendJson(res, 415, { ok: false, error: 'content_type_required' });
        return;
      }

      const contentLength = Number(req.headers['content-length'] || 0);
      if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
        sendJson(res, 413, { ok: false, error: 'payload_too_large' });
        return;
      }

      const now = Date.now();
      const clientIp = getClientIp(req);
      const globalRetryAfter = consumeRateLimit(
        globalRateLimit,
        'global',
        GLOBAL_RATE_LIMIT_MAX_REQUESTS,
        GLOBAL_RATE_LIMIT_WINDOW_MS,
        now
      );

      if (globalRetryAfter > 0) {
        sendJson(
          res,
          429,
          { ok: false, error: 'global_rate_limited' },
          { 'Retry-After': String(globalRetryAfter) }
        );
        return;
      }

      const retryAfter = consumeRateLimit(
        ipRateLimit,
        clientIp,
        RATE_LIMIT_MAX_REQUESTS,
        RATE_LIMIT_WINDOW_MS,
        now
      );

      if (retryAfter > 0) {
        sendJson(
          res,
          429,
          { ok: false, error: 'rate_limited' },
          { 'Retry-After': String(retryAfter) }
        );
        return;
      }

      const body = await readJsonBody(req);
      const validation = validateSubmission(body);
      if (validation.error) {
        sendJson(res, 400, { ok: false, error: validation.error });
        return;
      }

      try {
        const messageId = await deliverToTelegram(buildTelegramMessage(validation.submission));
        try {
          writeDirectLead(validation.submission, req);
        } catch (error) {
          console.error('Lead metrics write failed:', error.message);
        }
        sendJson(res, 200, {
          ok: true,
          delivered: true,
          messageId,
        });
      } catch (error) {
        console.error('Telegram delivery failed:', error.message);
        sendJson(res, 502, {
          ok: false,
          error: 'telegram_delivery_failed',
        });
      }
      return;
    }

    sendJson(res, 404, { ok: false, error: 'not_found' });
  } catch (error) {
    if (error.message === 'payload_too_large') {
      sendJson(res, 413, { ok: false, error: 'payload_too_large' });
      return;
    }

    if (error instanceof SyntaxError) {
      sendJson(res, 400, { ok: false, error: 'invalid_json' });
      return;
    }

    console.error('Unhandled telegram API error:', error.message);
    sendJson(res, 500, {
      ok: false,
      error: 'internal_error',
    });
  }
});

server.requestTimeout = REQUEST_TIMEOUT_MS;
server.headersTimeout = REQUEST_TIMEOUT_MS + 1000;
server.keepAliveTimeout = 5000;
server.setTimeout(REQUEST_TIMEOUT_MS);

const rateLimitCleanupTimer = setInterval(() => {
  const now = Date.now();
  pruneRateLimitMap(ipRateLimit, RATE_LIMIT_WINDOW_MS, now);
  pruneRateLimitMap(globalRateLimit, GLOBAL_RATE_LIMIT_WINDOW_MS, now);
}, RATE_LIMIT_CLEANUP_INTERVAL_MS);
rateLimitCleanupTimer.unref?.();

server.listen(PORT, HOST, () => {
  console.log(`Mospochin telegram API listening on http://${HOST}:${PORT}`);
});
