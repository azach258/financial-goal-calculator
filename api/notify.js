// Vercel / Netlify / Node.js Serverless Function: 安全轉發 Telegram 預約通知
// 依據《核心專案整合藍圖》，Bot Token 與 Chat ID 由後端環境變數持有，絕不暴露至前端。

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { text } = req.body || {};
  if (!text) {
    return res.status(400).json({ error: 'Missing text in payload' });
  }

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    console.error('Server Configuration Error: Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    const telegramRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: text
      })
    });

    if (!telegramRes.ok) {
      const errorDetail = await telegramRes.text();
      return res.status(telegramRes.status).json({ error: errorDetail });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Failed to forward telegram message:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
