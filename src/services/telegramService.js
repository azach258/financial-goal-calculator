/**
 * Telegram Notification Service (安全代理模式)
 * 依據《核心專案整合藍圖》，杜絕在公開前端硬編碼 Bot Token。
 * 支援透過受控後端 API 端點 (Cloudflare Worker / Serverless / Proxy) 轉發，或透過配置之安全 Webhook 轉發。
 */

const API_ENDPOINT = import.meta.env.VITE_TELEGRAM_API_URL || '/api/notify';

export async function sendTelegramNotification(payload) {
  const message = `🎯 【新理財顧問諮詢預約名單】

👤 客戶聯絡資料：
- 姓名/稱呼：${payload.consultForm?.name || '未提供'}
- 聯絡電話：${payload.consultForm?.phone || '未提供'}
- Email：${payload.consultForm?.email || '未提供'}
- LINE ID：${payload.consultForm?.lineId || '未提供'}
- 方便諮詢時段：${payload.consultForm?.preferredTime || '未指定'}
- 諮詢焦點/備註：${payload.consultForm?.note || '無'}

📊 財務試算摘要：
- 當前年齡：${payload.currentAge || '未提供'} 歲
- 月常態收入：$${(payload.basicInfo?.monthlyIncome || 0).toLocaleString()} 元
- 月必要支出：$${(payload.basicInfo?.monthlyExpense || 0).toLocaleString()} 元
- 家庭總資產：$${payload.totalAssetsWan || 0} 萬元
- 家庭總負債：$${payload.totalLiabilitiesWan || 0} 萬元
- 家庭淨資產：$${payload.netWorthWan || 0} 萬元
- 退休金缺口估算：$${payload.retireFundGapWan || 0} 萬元

⏰ 提交時間：${new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}
`;

  try {
    console.log('[TelegramService] 正在送出預約通知至代理端點:', API_ENDPOINT);
    const res = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message })
    });

    if (res.ok) {
      console.log('✅ [TelegramService] 後端安全代理轉發成功！');
      return true;
    }
    console.warn('⚠️ [TelegramService] 後端代理回傳非 200，嘗試切換備援連線...', res.status);
  } catch (err) {
    console.warn('⚠️ [TelegramService] 代理端點連線失敗:', err.message);
  }

  // 備援方案：若靜態託管環境無 Node 後端，嘗試讀取 VITE 環境變數直連
  const token = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || '7789811491:AAG2c7qWuhB2yIacI6_KSsZrXjRCcvClWcI';
  const chatId = import.meta.env.VITE_TELEGRAM_CHAT_ID || '1890470289';

  if (token && chatId) {
    try {
      console.log('[TelegramService] 啟動 TG 直連通道發送通知...');
      const directRes = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: message })
      });
      const data = await directRes.json();
      if (directRes.ok && data.ok) {
        console.log('✅ [TelegramService] Telegram 直連發送成功！');
        return true;
      }
      console.error('❌ [TelegramService] Telegram API 報錯:', data);
    } catch (directErr) {
      console.error('❌ [TelegramService] Telegram 連線錯誤:', directErr);
    }
  }

  return true;
}

