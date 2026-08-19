import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const DIST_DIR = path.join(__dirname, 'dist');
const DATA_DIR = path.join(__dirname, 'data');
const LEADS_FILE = path.join(DATA_DIR, 'leads.json');

// 確保 data 目錄與 leads.json 存在
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(LEADS_FILE)) {
  fs.writeFileSync(LEADS_FILE, JSON.stringify([], null, 2), 'utf-8');
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const urlPath = req.url.split('?')[0];

  // 1. Handle Telegram notification API endpoint
  if (urlPath === '/api/notify' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      try {
        const { text } = JSON.parse(body || '{}');
        const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '7789811491:AAG2c7qWuhB2yIacI6_KSsZrXjRCcvClWcI';
        const CHAT_ID = process.env.TELEGRAM_CHAT_ID || '1890470289';

        if (!BOT_TOKEN || !CHAT_ID) {
          console.error('❌ Server Error: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is missing');
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Server configuration error: missing env variables' }));
          return;
        }

        const tgUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        const tgRes = await fetch(tgUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chat_id: CHAT_ID, text: text })
        });

        const tgData = await tgRes.json();
        if (!tgRes.ok) {
          console.error('❌ Telegram API error:', tgData);
          res.writeHead(tgRes.status, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(tgData));
          return;
        }

        console.log('✅ Telegram notification forwarded successfully!');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (err) {
        console.error('❌ Notification processing error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // 2. Handle Leads CRM API endpoints (GET & POST)
  if (urlPath === '/api/leads') {
    if (req.method === 'GET') {
      try {
        const data = fs.existsSync(LEADS_FILE) ? fs.readFileSync(LEADS_FILE, 'utf-8') : '[]';
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
        res.end(data);
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Failed to read leads file' }));
      }
      return;
    }

    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const newLead = JSON.parse(body || '{}');
          let leads = [];
          if (fs.existsSync(LEADS_FILE)) {
            leads = JSON.parse(fs.readFileSync(LEADS_FILE, 'utf-8') || '[]');
          }
          leads.unshift(newLead);
          fs.writeFileSync(LEADS_FILE, JSON.stringify(leads, null, 2), 'utf-8');
          console.log(`✅ [Server] 留單已持久化寫入檔案: ${newLead.id || '新名單'}`);
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: true, lead: newLead }));
        } catch (err) {
          console.error('❌ Failed to save lead:', err);
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: err.message }));
        }
      });
      return;
    }
  }

  // 3. Serve static files from dist/
  let filePath = path.join(DIST_DIR, urlPath);
  if (filePath.endsWith(path.sep) || !path.extname(filePath)) {
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    } else if (!fs.existsSync(filePath)) {
      filePath = path.join(DIST_DIR, 'index.html'); // SPA fallback
    }
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    fs.createReadStream(filePath).pipe(res);
  } else {
    // SPA Fallback
    const fallbackPath = path.join(DIST_DIR, 'index.html');
    if (fs.existsSync(fallbackPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(fallbackPath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found. Please build the project first (npm run build).');
    }
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Financial Goal Calculator Server running on port ${PORT}`);
});
