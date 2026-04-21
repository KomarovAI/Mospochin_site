import http from 'http';
import dns from 'dns';
import https from 'https';
import net from 'net';
import tls from 'tls';
import { URL } from 'url';

dns.setDefaultResultOrder('ipv4first');

const PORT = Number(process.env.PORT || 3010);
const HOST = process.env.HOST || '127.0.0.1';
const BOT_TOKEN = String(process.env.TELEGRAM_BOT_TOKEN || '').trim();
const CHAT_ID = String(process.env.TELEGRAM_CHAT_ID || '').trim();
const REQUEST_TIMEOUT_MS = Number(process.env.TELEGRAM_REQUEST_TIMEOUT_MS || 10000);
const MAX_BODY_BYTES = Number(process.env.MAX_BODY_BYTES || 16 * 1024);
const TELEGRAM_PROXY = String(process.env.TELEGRAM_PROXY || 'socks5h://127.0.0.1:58161').trim();

function sendJson(res, status, payload) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
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
        'Connection: close',
        '',
        requestBody,
      ].join('\r\n');
      tlsSocket.write(request);
    });

    const chunks = [];
    tlsSocket.on('data', (chunk) => chunks.push(chunk));
    tlsSocket.on('end', () => {
      const rawResponse = Buffer.concat(chunks).toString('utf8');
      const separator = rawResponse.indexOf('\r\n\r\n');
      if (separator === -1) {
        finish(new Error('telegram_invalid_http_response'));
        return;
      }

      const headerBlock = rawResponse.slice(0, separator);
      const body = rawResponse.slice(separator + 4);
      const statusLine = headerBlock.split('\r\n')[0] || '';
      const match = statusLine.match(/^HTTP\/\d+\.\d+\s+(\d{3})/);
      if (!match) {
        finish(new Error('telegram_invalid_status_line'));
        return;
      }

      finish(null, {
        statusCode: Number(match[1]),
        raw: body,
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
    parse_mode: 'Markdown',
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
        credentialsConfigured: Boolean(BOT_TOKEN && CHAT_ID),
        telegramProxyConfigured: Boolean(TELEGRAM_PROXY),
      });
      return;
    }

    if (req.method === 'POST' && req.url === '/api/send-telegram') {
      const body = await readJsonBody(req);
      const message = String(body.message || '').trim();

      if (!message) {
        sendJson(res, 400, { ok: false, error: 'message_required' });
        return;
      }

      if (message.length > 4000) {
        sendJson(res, 400, { ok: false, error: 'message_too_long' });
        return;
      }

      try {
        const messageId = await deliverToTelegram(message);
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

server.listen(PORT, HOST, () => {
  console.log(`Mospochin telegram API listening on http://${HOST}:${PORT}`);
});
