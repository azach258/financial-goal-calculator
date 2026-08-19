# 📋 專案版本更新日誌 (Project Changelog)

所有關於本專案的架構升級、UI/UX 調優、精算邏輯與 Bug 修復均嚴格記錄於此。

---

## 🏷️ [v2.1.0] - 2026-08-19 (當前最新版)

### 🚀 核心功能與升級 (Features & Upgrades)
- **100% 全站純淨動態幣別引擎 (Dynamic Currency Engine)**：
  - 徹底移除靜態混雜括號，點擊 `USD 美元` / `TWD 台幣 (萬)` 時，表格每一格數據、手機速查卡片、頂部 4 大 KPI、提領標題與折線圖 Y 軸座標**毫秒級即時換算重繪**。
  - 匯率錨定 `1 USD ≈ 32 TWD`。
- **免 404 智慧路由防禦 (Intelligent 404 Fallback)**：
  - 新增 `public/404.html` 與 `.nojekyll`，在 GitHub Pages 無論訪問 `/comparison`、`/comparison/` 或任何子路徑，均自動秒級轉發至目標對比頁面，徹底杜絕 404 破圖。
- **直通導航列 (Top Navigation Integration)**：
  - 在主計算機落地頁頂部加入「🌸 富衛 vs 安達精算對比」專屬快速入口。

### 🎨 視覺與排版修復 (RWD & Layout Bug Fixes)
- **消除孤字換行 (Anti-Orphan Wrap)**：
  - 引入 `clamp()` 流體響應式字級與 `white-space: nowrap;`，修復 iPhone SE (375px) 與 iPad Mini (768px) 上「`規模放大 1.11` / `倍`」與「`富衛 FWD 領` / `先`」斷字問題。
- **表格響應式水平捲軸容器 (Responsive Table Container)**：
  - 為平板/電腦大表格包裝 `.table-responsive` 容器，消除因寬度不足引起的行動端整頁左右搖晃跑版問題。
- **版本資訊標籤 (Version Badge)**：
  - 頂部與頁尾明確標註 `v2.1.0 (2026-08-19)` 與版權資訊。

---

## 🏷️ [v2.0.0] - 2026-08-19
- **視覺全面轉型為「韓系甜美奶霜風」**：採用奶油杏白 (`#fdfbf8`)、蜜桃珊瑚粉 (`#f75f54`)、冰淇淋粉藍 (`#1d8cb8`) 與黑咖啡高對比字體 (`#1f1610`)。
- **零外部依賴 (Zero Dependency)**：移除 Tailwind 與 Chart.js CDN，自主研發純原生輕量級 SVG 向量圖表引擎。
- **雙保費折扣精算模型 (Dual Discount Modes)**：上線「模式 A: 直接 9 折省現金」與「模式 B: 實繳 1.2 萬放大保額」。

---

## 🏷️ [v1.0.0] - 2026-08-10
- 初始化專案，整合 Vite + React 理財目標計算機與 Telegram Webhook 業務推播通知。
