import fs from 'fs';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SITE_ROOT = path.resolve(__dirname, '..');
const PORT = Number(process.env.PORT || 9999);

const CONTENT_TYPES = new Map([
  ['.html', 'text/html; charset=utf-8'],
  ['.css', 'text/css; charset=utf-8'],
  ['.js', 'application/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.svg', 'image/svg+xml'],
  ['.png', 'image/png'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.webp', 'image/webp'],
  ['.woff2', 'font/woff2'],
  ['.woff', 'font/woff'],
  ['.ttf', 'font/ttf'],
  ['.xml', 'application/xml; charset=utf-8'],
  ['.txt', 'text/plain; charset=utf-8'],
]);

function send(res, status, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, {
    'Content-Type': type,
    'Cache-Control': 'no-store',
  });
  res.end(body);
}

function safePathFromUrl(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const pathname = decoded === '/' ? '/index.html' : decoded;
  const absolutePath = path.resolve(SITE_ROOT, `.${pathname}`);
  if (!absolutePath.startsWith(SITE_ROOT)) return null;
  return absolutePath;
}

async function readJsonBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

const server = http.createServer(async (req, res) => {
  try {
    if (!req.url) {
      send(res, 400, 'Bad request');
      return;
    }

    if (req.method === 'POST' && req.url === '/api/send-telegram') {
      const body = await readJsonBody(req);
      const payload = {
        ok: true,
        mocked: true,
        receivedAt: new Date().toISOString(),
        page: String(body.page || ''),
        branch: String(body.branch || ''),
        phone: String(body.phone || ''),
        type: String(body.type || ''),
        problemPreview: String(body.problem || '').slice(0, 200),
        extraFields: body.extraFields && typeof body.extraFields === 'object' ? body.extraFields : {},
      };
      send(res, 200, JSON.stringify(payload, null, 2), 'application/json; charset=utf-8');
      return;
    }

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      send(res, 405, 'Method not allowed');
      return;
    }

    const absolutePath = safePathFromUrl(req.url);
    if (!absolutePath) {
      send(res, 403, 'Forbidden');
      return;
    }

    let filePath = absolutePath;
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      const notFound = path.join(SITE_ROOT, '404.html');
      const body = fs.readFileSync(notFound);
      res.writeHead(404, {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'no-store',
      });
      if (req.method === 'HEAD') {
        res.end();
        return;
      }
      res.end(body);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = CONTENT_TYPES.get(ext) || 'application/octet-stream';
    const body = fs.readFileSync(filePath);
    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-store',
    });
    if (req.method === 'HEAD') {
      res.end();
      return;
    }
    res.end(body);
  } catch (error) {
    send(res, 500, `Server error: ${error.message}`);
  }
});

server.listen(PORT, () => {
  console.log(`MosPochin dev server running at http://127.0.0.1:${PORT}`);
});
