/**
 * Telegram Bot Notification Service
 * 自動發送理財目標計算機預約名單至使用者手機 Telegram
 */

const BOT_TOKEN = '7789811491:AAG2c7qWuhB2yIacI6_KSsZrXjRCcvClWcI';
const CHAT_ID = '1890470289';

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
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message
      })
    });
    return res.ok;
  } catch (err) {
    console.error('Telegram notification error:', err);
    return false;
  }
}
