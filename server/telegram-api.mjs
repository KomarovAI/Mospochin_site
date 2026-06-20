import fs from 'fs';
import http from 'http';
import dns from 'dns';
import { createHash } from 'crypto';
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
const MAX_NAME_LENGTH = 120;
const MAX_TYPE_LENGTH = 200;
const MAX_CONTEXT_LENGTH = 120;
const MAX_EXTRA_FIELDS = 6;
const MAX_EXTRA_FIELD_LENGTH = 200;
const LOG_DIR = String(process.env.MOSPOCHIN_LOG_DIR || '/var/log/mospochin').trim();
const DIRECT_LEAD_LOG_PATH = String(process.env.DIRECT_LEAD_LOG_PATH || path.join(LOG_DIR, 'direct_leads.jsonl')).trim();
const SITE_EVENTS_LOG_PATH = String(process.env.SITE_EVENTS_LOG_PATH || path.join(LOG_DIR, 'site_events.jsonl')).trim();
const SITE_EVENTS_REJECTED_LOG_PATH = String(process.env.SITE_EVENTS_REJECTED_LOG_PATH || path.join(LOG_DIR, 'site_event_rejects.jsonl')).trim();
const ANALYTICS_SALT = String(process.env.MOSPOCHIN_ANALYTICS_SALT || 'mospochin-local-dev-salt').trim();
const EVENT_RATE_LIMIT_WINDOW_MS = Number(process.env.EVENT_RATE_LIMIT_WINDOW_MS || 30 * 1000);
const EVENT_RATE_LIMIT_MAX_REQUESTS = Number(process.env.EVENT_RATE_LIMIT_MAX_REQUESTS || 60);
const MAX_EVENT_EXTRA_FIELDS = 24;
const MAX_EVENT_VALUE_LENGTH = 260;
const ALLOWED_ORIGIN_HOSTS = new Set(['mospochin.ru', 'www.mospochin.ru']);
const ALLOWED_EVENTS = new Set([
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
]);
const SAFE_EVENT_FIELDS = new Set([
  'event',
  'goal',
  'page',
  'page_path',
  'page_slug',
  'page_type',
  'page_intent',
  'equipment',
  'brand',
  'service',
  'commercial_segment',
  'landing_page',
  'session_landing_path',
  'session_started_at',
  'referrer_host',
  'has_yclid',
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'utm_service',
  'utm_landing',
  'utm_geo',
  'metrika_client_id',
  'contact_type',
  'href',
  'text',
  'text_length',
  'cta_id',
  'cta_group',
  'cta_type',
  'contact_goal',
  'block',
  'form_id',
  'form_context',
  'form_class',
  'form_type',
  'has_phone',
  'has_problem',
  'field',
  'reason',
  'error',
  'status',
  'quality',
]);

const ipRateLimit = new Map();
const globalRateLimit = new Map();
const eventRateLimit = new Map();
const RATE_LIMIT_CLEANUP_INTERVAL_MS = Math.max(1000, Math.min(RATE_LIMIT_WINDOW_MS, GLOBAL_RATE_LIMIT_WINDOW_MS));

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

function redactSensitiveText(value, maxLength = MAX_EVENT_VALUE_LENGTH) {
  return sanitizeString(value, maxLength)
    .replace(/(?:\+?7|8)?[\s()\-.]*\d{3}[\s()\-.]*\d{3}[\s()\-.]*\d{2}[\s()\-.]*\d{2}/g, '[phone_redacted]')
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, '[email_redacted]');
}

function sanitizeContactHref(value) {
  const raw = sanitizeString(value, 500);
  if (!raw) return '';
  if (/^tel:/i.test(raw)) return 'tel:[redacted]';
  if (/^mailto:/i.test(raw)) return 'mailto:[redacted]';
  try {
    const parsed = new URL(raw, 'https://mospochin.ru');
    const host = parsed.hostname.toLowerCase();
    if (/wa\.me|whatsapp|t\.me|telegram/i.test(host + parsed.pathname)) {
      return `${parsed.protocol}//${host}${parsed.pathname.replace(/\d{5,}/g, '[id_redacted]')}`.slice(0, 180);
    }
    return `${parsed.protocol}//${host}${parsed.pathname}`.slice(0, 180);
  } catch {
    return '';
  }
}


function sanitizeKey(value, maxLength = 50) {
  return String(value || '')
    .trim()
    .replace(/[^a-zA-Z0-9_.:-]/g, '_')
    .slice(0, maxLength);
}

function sanitizePath(value, maxLength = 240) {
  const safe = sanitizeString(value, maxLength);
  if (!safe) return '';
  if (/^https?:\/\//i.test(safe)) {
    try {
      const parsed = new URL(safe);
      return `${parsed.pathname}${parsed.search ? '?' + parsed.searchParams.toString().slice(0, 160) : ''}`.slice(0, maxLength);
    } catch {
      return '';
    }
  }
  if (!safe.startsWith('/')) return '';
  return safe;
}

function sha256(value) {
  const raw = sanitizeString(value, 1000);
  if (!raw) return '';
  return createHash('sha256').update(`${ANALYTICS_SALT}:${raw}`).digest('hex');
}

function shortHash(value) {
  const digest = sha256(value);
  return digest ? digest.slice(0, 24) : '';
}

function ensureLogDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function appendJsonl(filePath, payload) {
  ensureLogDir(filePath);
  fs.appendFileSync(filePath, `${JSON.stringify(payload)}\n`, { encoding: 'utf8', mode: 0o640 });
}

function parseHeaderHost(value) {
  const raw = sanitizeString(value, 500);
  if (!raw) return '';
  try {
    return new URL(raw).hostname.toLowerCase();
  } catch {
    return '';
  }
}

function getOriginHost(req) {
  return parseHeaderHost(req.headers.origin || req.headers.referer || '');
}

function isAllowedOrigin(req) {
  const host = getOriginHost(req);
  return Boolean(host && ALLOWED_ORIGIN_HOSTS.has(host));
}

function userAgentFlags(req) {
  const ua = String(req.headers['user-agent'] || '');
  const flags = [];
  if (!ua) flags.push('missing_user_agent');
  if (/HeadlessChrome|PhantomJS|SlimerJS|Selenium|Playwright|Puppeteer/i.test(ua)) flags.push('headless_or_automation');
  if (/curl|wget|python-requests|httpclient|scrapy|spider|crawler|bot/i.test(ua)) flags.push('bot_user_agent');
  return flags;
}

function safeUserAgentFamily(req) {
  const ua = String(req.headers['user-agent'] || '');
  if (/YaBrowser/i.test(ua)) return 'yabrowser';
  if (/Chrome/i.test(ua) && !/Chromium/i.test(ua)) return 'chrome';
  if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) return 'safari';
  if (/Firefox/i.test(ua)) return 'firefox';
  if (/Edg\//i.test(ua)) return 'edge';
  if (/bot|crawler|spider/i.test(ua)) return 'bot_like';
  return ua ? 'other' : 'missing';
}

function sanitizeSession(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const sessionId = sanitizeString(value.session_id, 120);
  const result = {
    session_id_hash: shortHash(sessionId),
    started_at: sanitizeString(value.started_at, 40),
    last_seen_at: sanitizeString(value.last_seen_at, 40),
    landing_path: sanitizePath(value.landing_path || value.session_landing_path || '', 240),
    current_path: sanitizePath(value.current_path || '', 240),
    page_count: Number.isFinite(Number(value.page_count)) ? Math.max(0, Math.min(100, Number(value.page_count))) : 0,
  };
  return Object.fromEntries(Object.entries(result).filter(([, item]) => item !== '' && item !== 0));
}

function attributionHashes(attribution) {
  const touch = attribution?.last_touch || attribution?.first_touch || attribution || {};
  return {
    yclid_hash: shortHash(touch.yclid || attribution?.yclid || ''),
    metrika_client_id_hash: shortHash(touch.metrika_client_id || attribution?.metrika_client_id || ''),
  };
}

function cleanPublicAttribution(attribution) {
  const touch = attribution?.last_touch || attribution?.first_touch || attribution || {};
  return {
    landing_page: sanitizePath(attribution?.first_landing_page || touch.landing_page || '', 240),
    referrer_host: sanitizeString(touch.referrer_host || attribution?.last_referrer_host || '', 120),
    utm_source: sanitizeString(touch.utm_source || attribution?.utm_source || '', 160),
    utm_medium: sanitizeString(touch.utm_medium || attribution?.utm_medium || '', 160),
    utm_campaign: sanitizeString(touch.utm_campaign || attribution?.utm_campaign || '', 220),
    utm_content: sanitizeString(touch.utm_content || attribution?.utm_content || '', 220),
    utm_term: sanitizeString(touch.utm_term || attribution?.utm_term || '', 220),
    utm_service: sanitizeString(touch.utm_service || attribution?.utm_service || '', 160),
    utm_landing: sanitizeString(touch.utm_landing || attribution?.utm_landing || '', 160),
    utm_geo: sanitizeString(touch.utm_geo || attribution?.utm_geo || '', 120),
    has_yclid: touch.yclid || attribution?.yclid ? 'yes' : 'no',
  };
}

function compactObject(value) {
  return Object.fromEntries(Object.entries(value).filter(([, item]) => item !== '' && item !== null && item !== undefined));
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
    const allowed = [
      'landing_page',
      'page_url',
      'current_page',
      'current_path',
      'first_landing_page',
      'referrer_host',
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_content',
      'utm_term',
      'utm_service',
      'utm_landing',
      'utm_geo',
      'metrika_client_id',
      'yclid',
      'captured_at',
      'first_seen_at',
      'last_seen_at',
      'updated_at',
    ];
    const result = {};
    for (const key of allowed) {
      const safeValue = sanitizeString(touch[key], 200);
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
    `Источник: ${getSourceLabel(submission.branch)} (${submission.page})`,
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


function sanitizeSiteEvent(body, req) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { error: 'invalid_payload' };
  const event = sanitizeString(body.event || body.goal, 80);
  if (!ALLOWED_EVENTS.has(event)) return { error: 'unknown_event' };

  const originOk = isAllowedOrigin(req);
  if (!originOk) return { error: 'bad_origin' };

  const now = Date.now();
  const clientIp = getClientIp(req);
  const rateKey = `${clientIp}:${event}`;
  const retryAfter = consumeRateLimit(eventRateLimit, rateKey, EVENT_RATE_LIMIT_MAX_REQUESTS, EVENT_RATE_LIMIT_WINDOW_MS, now);
  if (retryAfter > 0) return { error: 'rate_limited', retryAfter };

  const botFlags = userAgentFlags(req);
  const eventData = {};
  let count = 0;
  for (const [key, rawValue] of Object.entries(body)) {
    const safeKey = sanitizeKey(key);
    if (!SAFE_EVENT_FIELDS.has(safeKey)) continue;
    if (safeKey === 'event' || safeKey === 'goal') continue;
    if (count >= MAX_EVENT_EXTRA_FIELDS) break;
    if (safeKey.includes('url')) continue;
    const value = safeKey === 'href'
      ? sanitizeContactHref(rawValue)
      : redactSensitiveText(rawValue, MAX_EVENT_VALUE_LENGTH);
    if (!value) continue;
    eventData[safeKey] = value;
    count += 1;
  }

  const attribution = cleanPublicAttribution(body);
  const sessionId = sanitizeString(body.session_id, 120);
  const session = compactObject({
    session_id_hash: shortHash(sessionId),
    started_at: sanitizeString(body.session_started_at, 40),
    landing_path: sanitizePath(body.session_landing_path || '', 240),
  });
  const hashes = {
    yclid_hash: shortHash(body.yclid || ''),
    metrika_client_id_hash: shortHash(body.metrika_client_id || ''),
    ip_hash: shortHash(clientIp),
  };

  const pagePath = sanitizePath(body.page_path || body.page || '', 240);
  if (!pagePath) return { error: 'invalid_page_path' };

  return {
    event: compactObject({
      ts: new Date().toISOString(),
      event,
      page_path: pagePath,
      page_slug: sanitizeString(body.page_slug, 120),
      page_type: sanitizeString(body.page_type, 40),
      page_intent: sanitizeString(body.page_intent, 80),
      equipment: sanitizeString(body.equipment, 80),
      brand: sanitizeString(body.brand, 80),
      service: sanitizeString(body.service, 80),
      commercial_segment: sanitizeString(body.commercial_segment, 80),
      ...attribution,
      ...eventData,
      ...session,
      ...hashes,
      user_agent_family: safeUserAgentFamily(req),
      quality: botFlags.length ? 'suspicious' : 'human_candidate',
      bot_flags: botFlags,
      is_decision_event: botFlags.length === 0,
    })
  };
}

function buildLeadLogRecord(submission, delivery) {
  const attribution = submission.attribution || null;
  const hashes = attributionHashes(attribution);
  const publicAttribution = cleanPublicAttribution(attribution);
  const session = submission.session || null;

  return compactObject({
    ts: new Date().toISOString(),
    event: 'backend_lead',
    status: delivery.status,
    delivery_error: delivery.error || '',
    telegram_message_id_hash: shortHash(delivery.messageId ? String(delivery.messageId) : ''),
    lead_id_hash: shortHash(`${submission.phone}:${submission.page}:${Date.now()}`),
    phone_hash: shortHash(submission.phone),
    name_hash: shortHash(submission.name),
    page: submission.page,
    page_path: publicAttribution.landing_page || '',
    branch: submission.branch,
    form_context: submission.formContext,
    type: submission.type,
    problem_present: submission.problem ? true : false,
    extra_field_keys: Object.keys(submission.extraFields || {}).slice(0, MAX_EXTRA_FIELDS),
    ...publicAttribution,
    ...hashes,
    ...(session || {}),
  });
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
  const website = sanitizeString(body.website, 80);
  const extraFields = sanitizeExtraFields(body.extraFields);
  const attribution = sanitizeAttribution(body.attribution);
  const session = sanitizeSession(body.session);
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
      extraFields,
      attribution,
      session,
    }
  };
}

const server = http.createServer(async (req, res) => {
  try {
    if (!req.url) {
      sendJson(res, 400, { ok: false, error: 'bad_request' });
      return;
    }

    const pathname = new URL(req.url, 'http://localhost').pathname;

    if (req.method === 'GET' && pathname === '/health') {
      sendJson(res, 200, {
        ok: true,
        service: 'mospochin-telegram-api',
      });
      return;
    }

    if (req.method === 'POST' && pathname === '/api/track-event') {
      const contentType = String(req.headers['content-type'] || '').toLowerCase();
      if (!contentType.startsWith('application/json')) {
        sendJson(res, 415, { ok: false, error: 'content_type_required' });
        return;
      }

      const body = await readJsonBody(req);
      const validation = sanitizeSiteEvent(body, req);
      if (validation.error) {
        appendJsonl(SITE_EVENTS_REJECTED_LOG_PATH, {
          ts: new Date().toISOString(),
          error: validation.error,
          event: sanitizeString(body?.event || body?.goal, 80),
          page_path: sanitizePath(body?.page_path || body?.page || '', 240),
          ip_hash: shortHash(getClientIp(req)),
          user_agent_family: safeUserAgentFamily(req),
        });
        const headers = validation.retryAfter ? { 'Retry-After': String(validation.retryAfter) } : {};
        sendJson(res, validation.error === 'rate_limited' ? 429 : 400, { ok: false, error: validation.error }, headers);
        return;
      }

      appendJsonl(SITE_EVENTS_LOG_PATH, validation.event);
      sendJson(res, 200, { ok: true });
      return;
    }

    if (req.method === 'POST' && pathname === '/api/send-telegram') {
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
        appendJsonl(DIRECT_LEAD_LOG_PATH, buildLeadLogRecord(validation.submission, {
          status: 'delivered',
          messageId,
        }));
        sendJson(res, 200, {
          ok: true,
          delivered: true,
          messageId,
        });
      } catch (error) {
        console.error('Telegram delivery failed:', error.message);
        appendJsonl(DIRECT_LEAD_LOG_PATH, buildLeadLogRecord(validation.submission, {
          status: 'telegram_delivery_failed',
          error: error.message,
        }));
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
  pruneRateLimitMap(eventRateLimit, EVENT_RATE_LIMIT_WINDOW_MS, now);
}, RATE_LIMIT_CLEANUP_INTERVAL_MS);
rateLimitCleanupTimer.unref?.();

server.listen(PORT, HOST, () => {
  console.log(`Mospochin telegram API listening on http://${HOST}:${PORT}`);
});
