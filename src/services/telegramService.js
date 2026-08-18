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
    const res = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: message })
    });
    return res.ok;
  } catch (err) {
    console.warn('Telegram 安全代理通知連線提示:', err.message);
    // 降級保護：若本機或無後端環境，不阻塞前台使用者提交體驗
    return true;
  }
}

