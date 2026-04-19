import http from 'http';
import dns from 'dns';
import https from 'https';

dns.setDefaultResultOrder('ipv4first');

const PORT = Number(process.env.PORT || 3010);
const HOST = process.env.HOST || '127.0.0.1';
const BOT_TOKEN = String(process.env.TELEGRAM_BOT_TOKEN || '').trim();
const CHAT_ID = String(process.env.TELEGRAM_CHAT_ID || '').trim();
const REQUEST_TIMEOUT_MS = Number(process.env.TELEGRAM_REQUEST_TIMEOUT_MS || 10000);
const MAX_BODY_BYTES = Number(process.env.MAX_BODY_BYTES || 16 * 1024);

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

  const payload = await new Promise((resolve, reject) => {
    const req = https.request(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
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
        const raw = Buffer.concat(chunks).toString('utf8');
        try {
          const parsed = raw ? JSON.parse(raw) : null;
          if (res.statusCode !== 200 || !parsed?.ok) {
            const detail = parsed?.description || `telegram_http_${res.statusCode || 0}`;
            reject(new Error(detail));
            return;
          }
          resolve(parsed);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('timeout', () => {
      req.destroy(new Error('telegram_request_timeout'));
    });
    req.on('error', reject);
    req.write(requestBody);
    req.end();
  });

  return payload.result?.message_id ?? null;
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
        sendJson(res, 502, {
          ok: false,
          error: 'telegram_delivery_failed',
          detail: error.message,
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

    sendJson(res, 500, {
      ok: false,
      error: 'internal_error',
      detail: error.message,
    });
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Mospochin telegram API listening on http://${HOST}:${PORT}`);
});
