import fs from 'fs';
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
const MAX_NAME_LENGTH = 120;
const MAX_TYPE_LENGTH = 200;
const MAX_CONTEXT_LENGTH = 120;
const MAX_EXTRA_FIELDS = 16;
const MAX_EXTRA_FIELD_LENGTH = 200;

const ipRateLimit = new Map();
const globalRateLimit = new Map();
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
      'page_path',
      'page_title',
      'referrer',
      'referrer_host',
      'utm_source',
      'utm_medium',
      'utm_campaign',
      'utm_content',
      'utm_term',
      'utm_service',
      'utm_landing',
      'metrika_client_id',
      'ym_client_id',
      'yclid',
      'gclid',
      'captured_at',
    ];
    const result = {};
    const maxLengthByKey = {
      page_url: 800,
      referrer: 800,
      page_title: 240,
      utm_campaign: 240,
      utm_content: 240,
      utm_term: 240,
      yclid: 240,
      gclid: 240,
    };

    for (const key of allowed) {
      const safeValue = sanitizeString(touch[key], maxLengthByKey[key] || 200);
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

function sanitizePageIntent(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const result = {
    cluster: sanitizeString(value.cluster, 80),
    intent: sanitizeString(value.intent, 80),
    label: sanitizeString(value.label, 120),
  };
  return Object.values(result).some(Boolean) ? result : null;
}

function sanitizeLeadQuality(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const level = sanitizeString(value.level, 20).toUpperCase();
  const score = Number(value.score || 0);
  const reasons = Array.isArray(value.reasons)
    ? value.reasons.slice(0, 8).map((reason) => sanitizeString(reason, 60)).filter(Boolean)
    : [];
  if (!level && !Number.isFinite(score) && reasons.length === 0) return null;
  return {
    level: ['HIGH', 'MEDIUM', 'LOW'].includes(level) ? level : 'UNKNOWN',
    score: Number.isFinite(score) ? Math.max(0, Math.min(20, Math.round(score))) : 0,
    reasons,
  };
}

function sanitizeDevice(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const result = {
    device_type: sanitizeString(value.device_type, 40),
    viewport: sanitizeString(value.viewport, 40),
    user_agent: sanitizeString(value.user_agent, 240),
  };
  return Object.values(result).some(Boolean) ? result : null;
}

function getSourceLabel(branch) {
  if (branch === 'household') return 'B2C (Бытовая)';
  if (branch === 'restaurant') return 'B2B (Рестораны)';
  return 'Общий сайт';
}

function formatExtraFieldLabel(name) {
  const labels = {
    address: 'Адрес/район',
    business_type: 'Формат кухни',
    district: 'Район',
    quantity: 'Количество',
    equipment_model: 'Модель оборудования',
    equipment_brand: 'Бренд из мини-диагностики',
    problem_type: 'Симптом из мини-диагностики',
    error_code: 'Код ошибки из мини-диагностики',
  };

  return labels[name] || name.replace(/[_-]+/g, ' ');
}

function buildTelegramMessage(submission) {
  const touch = submission.attribution?.last_touch || null;
  const firstTouch = submission.attribution?.first_touch || null;
  const pageIntent = submission.pageIntent || null;
  const quality = submission.leadQuality || null;
  const qualityPrefix = quality?.level === 'HIGH' ? '🔥' : quality?.level === 'MEDIUM' ? '🟠' : '⚪';
  const lines = [
    `${qualityPrefix} Новая заявка MosPochin`,
    '',
    `Качество: ${quality?.level || 'UNKNOWN'}${quality ? ` / score=${quality.score}` : ''}`,
    quality?.reasons?.length ? `Почему: ${quality.reasons.join(', ')}` : '',
    `Источник: ${getSourceLabel(submission.branch)} (${submission.page})`,
    pageIntent ? `Интент: ${pageIntent.label || pageIntent.intent || 'не указан'}${pageIntent.cluster ? ` / cluster=${pageIntent.cluster}` : ''}` : '',
    `Контекст формы: ${submission.formContext || 'не указан'}`,
    '',
    `Телефон: ${submission.phone}`,
    `Имя: ${submission.name || 'не указано'}`,
    `Техника/бренд: ${submission.type || 'не указано'}`,
    `Проблема: ${submission.problem || 'не указана'}`,
  ].filter(Boolean);

  const extraEntries = Object.entries(submission.extraFields || {});
  if (extraEntries.length) {
    lines.push('', 'Детали из формы:');
    for (const [name, value] of extraEntries) {
      lines.push(`${formatExtraFieldLabel(name)}: ${value}`);
    }
  }

  if (submission.timeToSubmitMs || submission.device) {
    lines.push('', 'UX-сигналы:');
    if (submission.timeToSubmitMs) lines.push(`Время до отправки: ${Math.round(submission.timeToSubmitMs / 1000)} сек.`);
    if (submission.device?.device_type) lines.push(`Устройство: ${submission.device.device_type}`);
    if (submission.device?.viewport) lines.push(`Viewport: ${submission.device.viewport}`);
  }

  if (touch) {
    lines.push('', 'Источник заявки:');
    if (touch.page_path || touch.landing_page) lines.push(`page: ${touch.page_path || touch.landing_page}`);
    if (touch.page_url) lines.push(`url: ${touch.page_url}`);
    if (touch.page_title) lines.push(`title: ${touch.page_title}`);
    if (touch.referrer) lines.push(`referrer: ${touch.referrer}`);
    if (touch.referrer_host) lines.push(`referrer_host: ${touch.referrer_host}`);

    lines.push('', 'Рекламная атрибуция:');
    if (touch.utm_source) lines.push(`utm_source: ${touch.utm_source}`);
    if (touch.utm_medium) lines.push(`utm_medium: ${touch.utm_medium}`);
    if (touch.utm_campaign) lines.push(`utm_campaign: ${touch.utm_campaign}`);
    if (touch.utm_content) lines.push(`utm_content: ${touch.utm_content}`);
    if (touch.utm_term) lines.push(`utm_term: ${touch.utm_term}`);
    if (touch.utm_service) lines.push(`utm_service: ${touch.utm_service}`);
    if (touch.utm_landing) lines.push(`utm_landing: ${touch.utm_landing}`);
    if (touch.yclid) lines.push(`yclid: ${touch.yclid}`);
    if (touch.gclid) lines.push(`gclid: ${touch.gclid}`);
    if (touch.metrika_client_id) lines.push(`metrika_client_id: ${touch.metrika_client_id}`);
    if (touch.ym_client_id) lines.push(`ym_client_id: ${touch.ym_client_id}`);
  }

  if (firstTouch && firstTouch !== touch) {
    lines.push('', 'Первое касание:');
    if (firstTouch.landing_page || firstTouch.page_path) lines.push(`landing: ${firstTouch.landing_page || firstTouch.page_path}`);
    if (firstTouch.utm_campaign) lines.push(`first_utm_campaign: ${firstTouch.utm_campaign}`);
    if (firstTouch.utm_term) lines.push(`first_utm_term: ${firstTouch.utm_term}`);
    if (firstTouch.yclid) lines.push(`first_yclid: ${firstTouch.yclid}`);
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
  const website = sanitizeString(body.website, 80);
  const pageIntent = sanitizePageIntent(body.pageIntent);
  const leadQuality = sanitizeLeadQuality(body.leadQuality);
  const rawTimeToSubmitMs = Number(body.timeToSubmitMs || 0);
  const timeToSubmitMs = Number.isFinite(rawTimeToSubmitMs) ? Math.max(0, Math.min(30 * 60 * 1000, Math.round(rawTimeToSubmitMs))) : 0;
  const device = sanitizeDevice(body.device);
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
      pageIntent,
      leadQuality,
      timeToSubmitMs,
      device,
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
      });
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
