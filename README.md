# 💰 個人理財目標計算機 (Personal Financial Goal Calculator) ✕ 顧問 CRM 後台

> **專案定位**：【產品 B】對外獲客個人理財目標計算機（獨立單頁引流落地頁 ＋ 安全 Telegram 留單通知 ＋ 離線/雲端雙軌 CRM 管理後台 ＋ 一鍵 Excel/Markdown 數據導出）。  
> **線上發布網址**：[`https://azach258.github.io/financial-goal-calculator/`](https://azach258.github.io/financial-goal-calculator/)  
> **GitHub 倉庫**：[`https://github.com/azach258/financial-goal-calculator.git`](https://github.com/azach258/financial-goal-calculator.git)

---

## ✨ 核心特色與架構

### 1. 🎯 前台引流與試算體驗
- **3 步驟理財盤點**：基本資訊與 8 大心動目標、資產負債結構盤點、複利與退休缺口試算。
- **1-on-1 諮詢預約彈窗**：收集客戶姓名、電話、Email、LINE ID、優先諮詢主題、方便時段與具體提問備註。
- **雙通道即時通知**：提交瞬間透過安全代理發送結構化 Telegram 業務推播至手機。

### 2. 🔐 顧問管理後台 (CRM Dashboard)
- **安全存取保護**：
  - 預設管理員 PIN 碼：`8888`（亦支援 `Raymond888`）。
  - 支援「記住此裝置登入狀態」，省去重複輸入。
  - 入口：頂部導覽列「🛡️ 顧問後台」按鈕、頁尾專屬連結、或全局快捷鍵 `Alt + A` / `Ctrl + Shift + A`。
- **統計數據看板**：
  - 總留單數 (Total Leads)
  - 待聯繫名單數 (New Leads)
  - 客戶平均家庭淨資產 (Avg Net Worth)
  - 已成交/諮詢名單數 (Closed Leads)
- **全功能客戶名單管理**：
  - 即時關鍵字搜尋（姓名、電話、LINE ID、備註）。
  - 狀態分流標籤（🔴 待聯繫 ➔ 🟡 聯繫中 ➔ 🟢 已成交 ➔ ⚪ 已封存）。
  - 單一客戶財務畫像明細抽屜（查看收入、支出、資產負債與退休缺口）。

### 3. 📥 數據導出與輸出能力 (Data Output & Export)
- **📊 匯出 Excel (CSV 檔)**：內建 UTF-8 BOM，繁體中文在 Windows / Mac Excel 開啟 100% 正確不亂碼。
- **📑 複製 Obsidian Markdown**：一鍵產生標準 Markdown 表格，無縫貼入 Obsidian 筆記庫歸檔。
- **📋 複製 JSON**：便於工程分析或串接其他自動化工具。
- **🧪 測試資料注入**：提供一鍵注入 3 筆真實情境測試名單功能，方便展示與排查。

### 4. 🔄 雙軌數據持久化
- **靜態端 (GitHub Pages)**：100% 依賴瀏覽器 `LocalStorage`，斷網或靜態伺服器依然完整運作。
- **後端 (Node.js `server.js`)**：提供 `/api/leads` (GET/POST)，自動將名單寫入本地 `data/leads.json`。

---

## 🚀 本地開發與部署指令

```bash
# 1. 啟動 Vite 開發伺服器
npm run dev

# 2. 編譯生產環境檔案 (輸出至 dist/)
npm run build

# 3. 啟動 Node 後端伺服器 (支援 /api/notify 與 /api/leads)
npm run start

# 4. 發布部署至 GitHub Pages
npm run deploy
```
