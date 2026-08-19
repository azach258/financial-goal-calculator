/**
 * Lead Storage & CRM Service for Financial Goal Calculator
 * 支援全端離線 LocalStorage + 後端 API 雙軌同步
 * 支援 CSV/Excel (UTF-8 BOM)、JSON、Obsidian Markdown 導出
 */

const STORAGE_KEY = 'fin_calc_leads_db_v1';
const ADMIN_PIN_KEY = 'fin_calc_admin_pin_v1';
const API_LEADS_URL = '/api/leads';

/**
 * 取得當前存儲的所有名單
 */
export function getStoredLeads() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read leads from localStorage:', err);
    return [];
  }
}

/**
 * 儲存新客戶留單（全軌同步）
 */
export async function saveLead(payload) {
  const now = new Date();
  const id = `LEAD-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(Math.floor(1000 + Math.random() * 9000))}`;
  
  const newLead = {
    id,
    createdAt: now.toISOString(),
    createdAtFormatted: now.toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' }),
    status: 'new', // 'new' | 'contacted' | 'closed' | 'archived'
    
    // 客戶個人資訊
    name: payload.consultForm?.name || '匿名客戶',
    phone: payload.consultForm?.phone || '',
    email: payload.consultForm?.email || '',
    lineId: payload.consultForm?.lineId || '',
    preferredTime: payload.consultForm?.preferredTime || '未指定',
    consultTopic: payload.consultForm?.consultTopic || '🏡 聰明買房成家與房貸減壓',
    note: payload.consultForm?.note || '',

    // 財務試算關鍵指標
    currentAge: payload.currentAge || 30,
    targetRetireAge: payload.basicInfo?.targetRetireAge || 55,
    monthlyIncome: payload.basicInfo?.monthlyIncome || 0,
    monthlyBonusAndInvestment: payload.basicInfo?.monthlyBonusAndInvestment || 0,
    monthlyExpense: payload.basicInfo?.monthlyExpense || 0,
    desiredRetireMonthlyExpense: payload.basicInfo?.desiredRetireMonthlyExpense || 0,
    selectedGoals: payload.basicInfo?.selectedGoals || [],

    // 資產與負債數據 (萬元)
    totalAssetsWan: payload.totalAssetsWan || 0,
    totalLiabilitiesWan: payload.totalLiabilitiesWan || 0,
    netWorthWan: payload.netWorthWan || 0,
    retireFundGapWan: payload.retireFundGapWan || 0,
    
    // 完整快照備份
    snapshot: payload
  };

  // 1. 本地 LocalStorage 寫入
  try {
    const existing = getStoredLeads();
    const updated = [newLead, ...existing];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    console.log(`✅ [LeadStorage] 成功保存名單至本地數據庫: ${id}`);
  } catch (err) {
    console.error('❌ [LeadStorage] 本地保存失敗:', err);
  }

  // 2. 嘗試非同步傳輸至後端伺服器 (若有 Node.js 或 API 服務)
  try {
    fetch(API_LEADS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLead)
    }).then(res => {
      if (res.ok) {
        console.log(`✅ [LeadStorage] 成功同步名單至後端服務器: ${id}`);
      }
    }).catch(err => {
      // 靜態託管無後端為正常現象，降級使用 LocalStorage
      console.log('ℹ️ [LeadStorage] 後端端點未啟用，使用本地儲存作為主庫');
    });
  } catch (err) {
    // ignore
  }

  return newLead;
}

/**
 * 更新留單狀態
 */
export function updateLeadStatus(id, newStatus) {
  try {
    const existing = getStoredLeads();
    const updated = existing.map(item => item.id === id ? { ...item, status: newStatus, updatedAt: new Date().toISOString() } : item);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to update lead status:', err);
    return getStoredLeads();
  }
}

/**
 * 刪除指定留單
 */
export function deleteLead(id) {
  try {
    const existing = getStoredLeads();
    const updated = existing.filter(item => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error('Failed to delete lead:', err);
    return getStoredLeads();
  }
}

/**
 * 清空全部名單
 */
export function clearAllLeads() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  } catch (err) {
    console.error('Failed to clear leads:', err);
    return [];
  }
}

/**
 * 匯出 CSV 格式 (支援繁體中文 Excel UTF-8 BOM，不亂碼)
 */
export function exportLeadsToCSV(leads = null) {
  const data = leads || getStoredLeads();
  if (!data || data.length === 0) {
    alert('目前尚無名單數據可供匯出！');
    return false;
  }

  const headers = [
    '留單編號',
    '提交時間',
    '處理狀態',
    '客戶姓名',
    '聯絡電話',
    '電子郵件',
    'LINE ID',
    '諮詢意向主題',
    '方便時段',
    '年齡',
    '月常態收入(元)',
    '月必要支出(元)',
    '家庭總資產(萬)',
    '家庭總負債(萬)',
    '家庭淨資產(萬)',
    '退休缺口(萬)',
    '客戶備註'
  ];

  const rows = data.map(l => [
    `"${l.id || ''}"`,
    `"${l.createdAtFormatted || l.createdAt || ''}"`,
    `"${l.status === 'new' ? '待聯繫' : l.status === 'contacted' ? '已聯繫' : l.status === 'closed' ? '已成交' : '已封存'}"`,
    `"${(l.name || '').replace(/"/g, '""')}"`,
    `"${(l.phone || '').replace(/"/g, '""')}"`,
    `"${(l.email || '').replace(/"/g, '""')}"`,
    `"${(l.lineId || '').replace(/"/g, '""')}"`,
    `"${(l.consultTopic || '').replace(/"/g, '""')}"`,
    `"${(l.preferredTime || '').replace(/"/g, '""')}"`,
    l.currentAge || 0,
    l.monthlyIncome || 0,
    l.monthlyExpense || 0,
    l.totalAssetsWan || 0,
    l.totalLiabilitiesWan || 0,
    l.netWorthWan || 0,
    l.retireFundGapWan || 0,
    `"${(l.note || '').replace(/"/g, '""')}"`
  ]);

  // 加入 UTF-8 BOM (\uFEFF) 防止 Excel 亂碼
  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `理財目標計算機_客戶留單名冊_${dateStr}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
}

/**
 * 匯出 Obsidian Markdown 表格格式
 */
export function exportLeadsToMarkdown(leads = null) {
  const data = leads || getStoredLeads();
  if (!data || data.length === 0) {
    alert('目前尚無名單數據可供匯出！');
    return '';
  }

  const dateStr = new Date().toISOString().split('T')[0];
  let md = `# 📋 理財目標計算機・獲客留單總表 (${dateStr})\n\n`;
  md += `> **總名單數**：${data.length} 筆 ｜ **更新時間**：${new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}\n\n`;
  md += `| 提交時間 | 客戶姓名 | 電話 | LINE ID | 諮詢主題 | 淨資產(萬) | 退休缺口(萬) | 狀態 | 備註 |\n`;
  md += `|:---|:---|:---|:---|:---|:---:|:---:|:---:|:---|\n`;

  data.forEach(l => {
    const statusText = l.status === 'new' ? '🔴 待聯繫' : l.status === 'contacted' ? '🟡 聯繫中' : l.status === 'closed' ? '🟢 已成交' : '⚪ 已封存';
    md += `| ${l.createdAtFormatted || l.createdAt} | **${l.name}** | \`${l.phone || '-'}\` | \`${l.lineId || '-'}\` | ${l.consultTopic} | **$${l.netWorthWan}萬** | $${l.retireFundGapWan}萬 | ${statusText} | ${l.note || '-'} |\n`;
  });

  return md;
}

/**
 * 注入測試範例數據 (Demo 用)
 */
export function injectMockLeads() {
  const mocks = [
    {
      id: 'LEAD-20260818-8821',
      createdAt: '2026-08-18T14:30:00.000Z',
      createdAtFormatted: '2026/8/18 下午10:30:00',
      status: 'new',
      name: '林冠宇 (Alan)',
      phone: '0912-345-678',
      email: 'alan.lin@example.com',
      lineId: 'alanlin_finance',
      preferredTime: '平日晚上 (19:00 - 21:00)',
      consultTopic: '🏡 聰明買房成家與房貸減壓',
      note: '目前看中新北板橋 1800 萬房子，想了解頭期款配置與 30 年房貸如何靠複利減壓。',
      currentAge: 32,
      targetRetireAge: 55,
      monthlyIncome: 95000,
      monthlyBonusAndInvestment: 30000,
      monthlyExpense: 50000,
      desiredRetireMonthlyExpense: 60000,
      selectedGoals: ['1', '4'],
      totalAssetsWan: 380,
      totalLiabilitiesWan: 0,
      netWorthWan: 380,
      retireFundGapWan: 250
    },
    {
      id: 'LEAD-20260818-5432',
      createdAt: '2026-08-18T11:15:00.000Z',
      createdAtFormatted: '2026/8/18 下午7:15:00',
      status: 'contacted',
      name: '陳雅婷 (Emily)',
      phone: '0988-765-432',
      email: 'emily.chen@example.com',
      lineId: 'emily_happy',
      preferredTime: '週末假日 (10:00 - 18:00)',
      consultTopic: '👶 專屬育兒帳戶與教育基金',
      note: '剛生第一胎，想幫女兒設立每月 5000 元的複利成長基金，求配置建議。',
      currentAge: 29,
      targetRetireAge: 50,
      monthlyIncome: 65000,
      monthlyBonusAndInvestment: 10000,
      monthlyExpense: 38000,
      desiredRetireMonthlyExpense: 45000,
      selectedGoals: ['2', '5'],
      totalAssetsWan: 120,
      totalLiabilitiesWan: 20,
      netWorthWan: 100,
      retireFundGapWan: 480
    },
    {
      id: 'LEAD-20260817-1099',
      createdAt: '2026-08-17T08:20:00.000Z',
      createdAtFormatted: '2026/8/17 下午4:20:00',
      status: 'closed',
      name: '張家豪 (David)',
      phone: '0933-112-233',
      email: 'david.chang@example.com',
      lineId: 'david_invest',
      preferredTime: '平日白天 (09:00 - 18:00)',
      consultTopic: '☕ 提早退休與被動收入水龍頭',
      note: '已完成 1-on-1 諮詢，已協助規劃海外高分紅保單與美股指數配置。',
      currentAge: 41,
      targetRetireAge: 52,
      monthlyIncome: 150000,
      monthlyBonusAndInvestment: 50000,
      monthlyExpense: 70000,
      desiredRetireMonthlyExpense: 80000,
      selectedGoals: ['3', '4', '7'],
      totalAssetsWan: 1650,
      totalLiabilitiesWan: 500,
      netWorthWan: 1150,
      retireFundGapWan: 0
    }
  ];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mocks));
    return mocks;
  } catch (err) {
    return [];
  }
}
