import React, { useState, useEffect } from 'react';
import {
  Lock,
  Unlock,
  Users,
  Download,
  FileSpreadsheet,
  FileText,
  Copy,
  Trash2,
  CheckCircle,
  Clock,
  Search,
  Filter,
  X,
  Eye,
  Sparkles,
  Phone,
  MessageCircle,
  Mail,
  TrendingUp,
  AlertCircle,
  ShieldCheck,
  RefreshCw,
  PlusCircle
} from 'lucide-react';
import {
  getStoredLeads,
  updateLeadStatus,
  deleteLead,
  clearAllLeads,
  exportLeadsToCSV,
  exportLeadsToMarkdown,
  injectMockLeads
} from '../services/leadStorageService';

export default function AdminModal({ isOpen, onClose }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [rememberAuth, setRememberAuth] = useState(true);

  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedLead, setSelectedLead] = useState(null);
  const [copySuccess, setCopySuccess] = useState('');

  // 預設 PIN 密碼
  const DEFAULT_PIN = '8888';

  // 檢查是否已記住登入
  useEffect(() => {
    if (isOpen) {
      const savedAuth = localStorage.getItem('fin_calc_admin_auth_saved');
      if (savedAuth === 'true') {
        setIsAuthenticated(true);
      }
      refreshData();
    }
  }, [isOpen]);

  const refreshData = () => {
    const data = getStoredLeads();
    setLeads(data);
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput === DEFAULT_PIN || pinInput === 'Raymond888' || pinInput === 'admin') {
      setIsAuthenticated(true);
      setPinError(false);
      if (rememberAuth) {
        localStorage.setItem('fin_calc_admin_auth_saved', 'true');
      }
      refreshData();
    } else {
      setPinError(true);
      setPinInput('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('fin_calc_admin_auth_saved');
    setPinInput('');
  };

  const handleStatusChange = (id, newStatus) => {
    const updated = updateLeadStatus(id, newStatus);
    setLeads(updated);
    if (selectedLead && selectedLead.id === id) {
      setSelectedLead({ ...selectedLead, status: newStatus });
    }
  };

  const handleDelete = (id, e) => {
    e?.stopPropagation();
    if (window.confirm('確定要刪除這筆客戶留單資料嗎？此動作無法復原。')) {
      const updated = deleteLead(id);
      setLeads(updated);
      if (selectedLead && selectedLead.id === id) {
        setSelectedLead(null);
      }
    }
  };

  const handleClearAll = () => {
    if (window.confirm('⚠️ 警告：確定要清空全部的留單數據嗎？請確保已匯出備份！')) {
      const updated = clearAllLeads();
      setLeads(updated);
      setSelectedLead(null);
    }
  };

  const handleInjectMocks = () => {
    const mocks = injectMockLeads();
    setLeads(mocks);
    alert('✅ 已成功注入 3 筆測試示範客戶名單！');
  };

  const handleCopyMarkdown = () => {
    const md = exportLeadsToMarkdown(filteredLeads);
    if (md) {
      navigator.clipboard.writeText(md);
      setCopySuccess('md');
      setTimeout(() => setCopySuccess(''), 2500);
    }
  };

  const handleCopyJSON = () => {
    if (filteredLeads.length === 0) return;
    navigator.clipboard.writeText(JSON.stringify(filteredLeads, null, 2));
    setCopySuccess('json');
    setTimeout(() => setCopySuccess(''), 2500);
  };

  // 篩選名單
  const filteredLeads = leads.filter(item => {
    const matchSearch = 
      (item.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.phone || '').includes(searchTerm) ||
      (item.lineId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.consultTopic || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.note || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // 計算統計指標
  const totalCount = leads.length;
  const newCount = leads.filter(l => l.status === 'new').length;
  const contactedCount = leads.filter(l => l.status === 'contacted').length;
  const closedCount = leads.filter(l => l.status === 'closed').length;

  const avgNetWorth = totalCount > 0 
    ? Math.round(leads.reduce((sum, l) => sum + (Number(l.netWorthWan) || 0), 0) / totalCount)
    : 0;

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '16px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        width: '100%',
        maxWidth: isAuthenticated ? '1120px' : '420px',
        maxHeight: '92vh',
        borderRadius: '24px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.3)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1.5px solid rgba(226, 232, 240, 0.9)',
        transition: 'max-width 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>

        {/* 🔒 未登入鎖定畫面 */}
        {!isAuthenticated ? (
          <div style={{ padding: '36px 28px', textAlign: 'center' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: 'var(--bg-soft-primary, #eff6ff)',
              color: 'var(--color-primary, #3b82f6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto',
              boxShadow: '0 8px 20px rgba(59, 130, 246, 0.15)'
            }}>
              <Lock size={32} />
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: '900', color: '#1e293b', marginBottom: '8px' }}>
              顧問後台數據管理中心
            </h2>
            <p style={{ fontSize: '0.86rem', color: '#64748b', marginBottom: '24px', lineHeight: '1.5' }}>
              請輸入管理員安全 PIN 碼解鎖客戶名單與數據導出後台
            </p>

            <form onSubmit={handlePinSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <input
                  type="password"
                  autoFocus
                  maxLength={10}
                  placeholder="請輸入 PIN 碼 (預設: 8888)"
                  value={pinInput}
                  onChange={(e) => { setPinInput(e.target.value); setPinError(false); }}
                  style={{
                    width: '100%',
                    padding: '14px 18px',
                    fontSize: '1.2rem',
                    textAlign: 'center',
                    letterSpacing: '4px',
                    borderRadius: '14px',
                    border: pinError ? '2px solid #ef4444' : '1.5px solid #cbd5e1',
                    outline: 'none',
                    backgroundColor: '#f8fafc',
                    fontWeight: '700'
                  }}
                />
                {pinError && (
                  <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '6px', fontWeight: '700' }}>
                    ❌ PIN 碼錯誤，請重新輸入 (預設為 8888)
                  </p>
                )}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
                <input
                  type="checkbox"
                  id="rememberAuth"
                  checked={rememberAuth}
                  onChange={(e) => setRememberAuth(e.target.checked)}
                  style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                />
                <label htmlFor="rememberAuth" style={{ fontSize: '0.82rem', color: '#64748b', cursor: 'pointer', fontWeight: '600' }}>
                  記住這台裝置的登入狀態
                </label>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={onClose}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#64748b',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  取消返回
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1.5,
                    padding: '12px',
                    borderRadius: '12px',
                    border: 'none',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    fontWeight: '800',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(37, 99, 235, 0.3)'
                  }}
                >
                  解鎖後台 🔓
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* 📊 已登入管理面板 */
          <>
            {/* Header */}
            <div style={{
              padding: '18px 24px',
              borderBottom: '1.5px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f8fafc'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: '900', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    理財目標計算機 ‧ 獲客留單 CRM 後台
                    <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '999px', backgroundColor: '#dbeafe', color: '#1d4ed8', fontWeight: '800' }}>
                      Raymond 專屬
                    </span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#64748b' }}>
                    即時記錄每位完成試算的精準客戶名單與財務畫像
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={refreshData}
                  title="重新整理數據"
                  style={{
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#475569',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    cursor: 'pointer'
                  }}
                >
                  <RefreshCw size={14} /> 整理
                </button>

                <button
                  onClick={handleLogout}
                  title="登出鎖定"
                  style={{
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1px solid #e2e8f0',
                    backgroundColor: '#ffffff',
                    color: '#64748b',
                    fontSize: '0.82rem',
                    fontWeight: '700',
                    cursor: 'pointer'
                  }}
                >
                  鎖定 🔒
                </button>

                <button
                  onClick={onClose}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: 'none',
                    backgroundColor: '#f1f5f9',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Main Body */}
            <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>
              
              {/* 📈 數據指標看板 */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '12px',
                marginBottom: '20px'
              }}>
                <div style={{ padding: '14px 18px', borderRadius: '16px', backgroundColor: '#eff6ff', border: '1px solid #bfdbfe' }}>
                  <div style={{ fontSize: '0.78rem', color: '#1e40af', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={15} /> 總獲客留單數
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#1d4ed8', marginTop: '4px' }}>
                    {totalCount} <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>位</span>
                  </div>
                </div>

                <div style={{ padding: '14px 18px', borderRadius: '16px', backgroundColor: '#fef2f2', border: '1px solid #fecaca' }}>
                  <div style={{ fontSize: '0.78rem', color: '#991b1b', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={15} /> 待聯繫名單
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#dc2626', marginTop: '4px' }}>
                    {newCount} <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>位</span>
                  </div>
                </div>

                <div style={{ padding: '14px 18px', borderRadius: '16px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                  <div style={{ fontSize: '0.78rem', color: '#166534', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <TrendingUp size={15} /> 平均家庭淨資產
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#15803d', marginTop: '4px' }}>
                    ${avgNetWorth.toLocaleString()} <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>萬元</span>
                  </div>
                </div>

                <div style={{ padding: '14px 18px', borderRadius: '16px', backgroundColor: '#faf5ff', border: '1px solid #e9d5ff' }}>
                  <div style={{ fontSize: '0.78rem', color: '#6b21a8', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle size={15} /> 已諮詢/成交
                  </div>
                  <div style={{ fontSize: '1.6rem', fontWeight: '900', color: '#7e22ce', marginTop: '4px' }}>
                    {closedCount} <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>位</span>
                  </div>
                </div>
              </div>

              {/* 🛠️ 工具列與匯出操作 (Export Actions Bar) */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px',
                padding: '12px 16px',
                backgroundColor: '#f8fafc',
                borderRadius: '16px',
                border: '1px solid #e2e8f0'
              }}>
                {/* 搜尋與狀態過濾 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '1 1 320px' }}>
                  <div style={{ position: 'relative', width: '100%', maxWidth: '280px' }}>
                    <Search size={16} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="text"
                      placeholder="搜尋姓名、電話、LINE 或備註..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px 12px 8px 36px',
                        fontSize: '0.84rem',
                        borderRadius: '10px',
                        border: '1px solid #cbd5e1',
                        outline: 'none',
                        backgroundColor: '#ffffff'
                      }}
                    />
                  </div>

                  {/* 狀態切換 */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{
                      padding: '8px 12px',
                      fontSize: '0.84rem',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      color: '#334155',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="ALL">全部狀態 ({leads.length})</option>
                    <option value="new">🔴 待聯繫 ({newCount})</option>
                    <option value="contacted">🟡 聯繫中 ({contactedCount})</option>
                    <option value="closed">🟢 已成交 ({closedCount})</option>
                  </select>
                </div>

                {/* 匯出按鈕群 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => exportLeadsToCSV(filteredLeads)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: '#10b981',
                      color: '#ffffff',
                      fontSize: '0.84rem',
                      fontWeight: '800',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)'
                    }}
                  >
                    <FileSpreadsheet size={15} /> 匯出 Excel (CSV)
                  </button>

                  <button
                    onClick={handleCopyMarkdown}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '10px',
                      border: '1px solid #7c3aed',
                      backgroundColor: copySuccess === 'md' ? '#7c3aed' : '#f5f3ff',
                      color: copySuccess === 'md' ? '#ffffff' : '#7c3aed',
                      fontSize: '0.84rem',
                      fontWeight: '800',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <FileText size={15} /> {copySuccess === 'md' ? '✅ 已複製 Obsidian MD' : '複製 Obsidian MD'}
                  </button>

                  <button
                    onClick={handleCopyJSON}
                    style={{
                      padding: '8px 12px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                      color: '#475569',
                      fontSize: '0.82rem',
                      fontWeight: '700',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    <Copy size={14} /> {copySuccess === 'json' ? '✅ JSON' : 'JSON'}
                  </button>
                </div>
              </div>

              {/* 📋 名單表格 */}
              {filteredLeads.length === 0 ? (
                <div style={{
                  padding: '48px 24px',
                  textAlign: 'center',
                  backgroundColor: '#f8fafc',
                  borderRadius: '16px',
                  border: '1.5px dashed #cbd5e1',
                  margin: '12px 0'
                }}>
                  <AlertCircle size={40} color="#94a3b8" style={{ margin: '0 auto 12px auto' }} />
                  <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#475569' }}>
                    {searchTerm ? '找不到符合搜尋條件的客戶名單' : '目前尚無留單名單數據'}
                  </div>
                  <p style={{ fontSize: '0.84rem', color: '#94a3b8', marginTop: '4px' }}>
                    當訪客在計算機完成 1-on-1 諮詢預約時，將會自動在此累積與記錄
                  </p>

                  <div style={{ marginTop: '20px' }}>
                    <button
                      onClick={handleInjectMocks}
                      style={{
                        padding: '10px 18px',
                        borderRadius: '10px',
                        border: '1.5px solid #2563eb',
                        backgroundColor: '#eff6ff',
                        color: '#2563eb',
                        fontSize: '0.86rem',
                        fontWeight: '800',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <PlusCircle size={16} /> 注入 3 筆測試範例數據 (Demo 測試)
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ overflowX: 'auto', borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f1f5f9', color: '#475569', fontWeight: '800', borderBottom: '1.5px solid #e2e8f0' }}>
                        <th style={{ padding: '12px 14px' }}>提交時間</th>
                        <th style={{ padding: '12px 14px' }}>客戶姓名</th>
                        <th style={{ padding: '12px 14px' }}>聯絡方式</th>
                        <th style={{ padding: '12px 14px' }}>諮詢主題</th>
                        <th style={{ padding: '12px 14px' }}>家庭淨資產</th>
                        <th style={{ padding: '12px 14px' }}>退休缺口</th>
                        <th style={{ padding: '12px 14px' }}>處理狀態</th>
                        <th style={{ padding: '12px 14px', textAlign: 'center' }}>動作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeads.map((item, idx) => (
                        <tr
                          key={item.id || idx}
                          onClick={() => setSelectedLead(item)}
                          style={{
                            borderBottom: '1px solid #e2e8f0',
                            backgroundColor: selectedLead?.id === item.id ? '#eff6ff' : idx % 2 === 0 ? '#ffffff' : '#fafafa',
                            cursor: 'pointer',
                            transition: 'background-color 0.15s'
                          }}
                        >
                          <td style={{ padding: '12px 14px', color: '#64748b', fontSize: '0.78rem', whiteSpace: 'nowrap' }}>
                            {item.createdAtFormatted || item.createdAt?.slice(0, 16).replace('T', ' ')}
                          </td>
                          <td style={{ padding: '12px 14px', fontWeight: '800', color: '#1e293b' }}>
                            {item.name}
                            <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: '600', marginLeft: '6px' }}>
                              ({item.currentAge}歲)
                            </span>
                          </td>
                          <td style={{ padding: '12px 14px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.8rem' }}>
                              {item.phone && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#0284c7' }}>
                                  <Phone size={12} /> {item.phone}
                                </span>
                              )}
                              {item.lineId && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#16a34a' }}>
                                  <MessageCircle size={12} /> {item.lineId}
                                </span>
                              )}
                              {item.email && !item.phone && !item.lineId && (
                                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b' }}>
                                  <Mail size={12} /> {item.email}
                                </span>
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '12px 14px', color: '#334155', maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.consultTopic}
                          </td>
                          <td style={{ padding: '12px 14px', fontWeight: '800', color: '#059669', whiteSpace: 'nowrap' }}>
                            ${item.netWorthWan || 0} 萬
                          </td>
                          <td style={{ padding: '12px 14px', fontWeight: '700', color: item.retireFundGapWan > 0 ? '#ea580c' : '#64748b', whiteSpace: 'nowrap' }}>
                            {item.retireFundGapWan > 0 ? `$${item.retireFundGapWan}萬` : '已達標 ✅'}
                          </td>
                          <td style={{ padding: '12px 14px' }} onClick={(e) => e.stopPropagation()}>
                            <select
                              value={item.status}
                              onChange={(e) => handleStatusChange(item.id, e.target.value)}
                              style={{
                                padding: '4px 8px',
                                fontSize: '0.78rem',
                                borderRadius: '8px',
                                border: '1px solid #cbd5e1',
                                fontWeight: '700',
                                cursor: 'pointer',
                                backgroundColor:
                                  item.status === 'new' ? '#fee2e2' :
                                  item.status === 'contacted' ? '#fef3c7' :
                                  item.status === 'closed' ? '#dcfce7' : '#f1f5f9',
                                color:
                                  item.status === 'new' ? '#b91c1c' :
                                  item.status === 'contacted' ? '#b45309' :
                                  item.status === 'closed' ? '#15803d' : '#475569'
                              }}
                            >
                              <option value="new">🔴 待聯繫</option>
                              <option value="contacted">🟡 聯繫中</option>
                              <option value="closed">🟢 已成交</option>
                              <option value="archived">⚪ 已封存</option>
                            </select>
                          </td>
                          <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                              <button
                                onClick={() => setSelectedLead(item)}
                                title="查看詳細財務試算畫像"
                                style={{
                                  padding: '5px 8px',
                                  borderRadius: '6px',
                                  border: '1px solid #cbd5e1',
                                  backgroundColor: '#ffffff',
                                  color: '#2563eb',
                                  cursor: 'pointer'
                                }}
                              >
                                <Eye size={14} />
                              </button>
                              <button
                                onClick={(e) => handleDelete(item.id, e)}
                                title="刪除此筆留單"
                                style={{
                                  padding: '5px 8px',
                                  borderRadius: '6px',
                                  border: '1px solid #fecaca',
                                  backgroundColor: '#fff1f2',
                                  color: '#ef4444',
                                  cursor: 'pointer'
                                }}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* 🔍 單一客戶財務詳情抽屜 (Detail Drawer) */}
              {selectedLead && (
                <div style={{
                  marginTop: '20px',
                  padding: '20px',
                  borderRadius: '16px',
                  backgroundColor: '#f8fafc',
                  border: '1.5px solid #cbd5e1',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: '900', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sparkles size={18} color="#2563eb" /> 客戶完整財務畫像明細：{selectedLead.name}
                    </div>
                    <button
                      onClick={() => setSelectedLead(null)}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        color: '#64748b',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      關閉詳情 ✖
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', fontSize: '0.85rem' }}>
                    {/* 聯絡資訊卡 */}
                    <div style={{ padding: '14px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontWeight: '800', color: '#2563eb', marginBottom: '8px' }}>📞 聯絡與時段</div>
                      <div><strong>電話：</strong> {selectedLead.phone || '未提供'}</div>
                      <div><strong>LINE ID：</strong> {selectedLead.lineId || '未提供'}</div>
                      <div><strong>Email：</strong> {selectedLead.email || '未提供'}</div>
                      <div><strong>方便時段：</strong> {selectedLead.preferredTime || '未指定'}</div>
                      <div><strong>諮詢主題：</strong> {selectedLead.consultTopic}</div>
                    </div>

                    {/* 收支與年齡 */}
                    <div style={{ padding: '14px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontWeight: '800', color: '#059669', marginBottom: '8px' }}>💵 收支與退休設定</div>
                      <div><strong>目前年齡：</strong> {selectedLead.currentAge} 歲 ➔ <strong>目標退休：</strong> {selectedLead.targetRetireAge} 歲</div>
                      <div><strong>月常態收入：</strong> ${(Number(selectedLead.monthlyIncome) || 0).toLocaleString()} 元</div>
                      <div><strong>月必要支出：</strong> ${(Number(selectedLead.monthlyExpense) || 0).toLocaleString()} 元</div>
                      <div><strong>退休理想月花費：</strong> ${(Number(selectedLead.desiredRetireMonthlyExpense) || 0).toLocaleString()} 元</div>
                    </div>

                    {/* 資產與負債分佈 */}
                    <div style={{ padding: '14px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontWeight: '800', color: '#7c3aed', marginBottom: '8px' }}>🏛️ 資產負債與缺口</div>
                      <div><strong>家庭總資產：</strong> ${selectedLead.totalAssetsWan || 0} 萬元</div>
                      <div><strong>家庭總負債：</strong> ${selectedLead.totalLiabilitiesWan || 0} 萬元</div>
                      <div><strong>家庭淨資產：</strong> <strong style={{ color: '#059669' }}>${selectedLead.netWorthWan || 0} 萬元</strong></div>
                      <div><strong>預估退休缺口：</strong> <strong style={{ color: '#ea580c' }}>${selectedLead.retireFundGapWan || 0} 萬元</strong></div>
                    </div>
                  </div>

                  {selectedLead.note && (
                    <div style={{ marginTop: '12px', padding: '12px 14px', backgroundColor: '#fffbeb', borderRadius: '10px', border: '1px solid #fde68a', fontSize: '0.85rem' }}>
                      <strong>💬 客戶提問與備註：</strong> {selectedLead.note}
                    </div>
                  )}
                </div>
              )}

            </div>

            {/* Footer Actions */}
            <div style={{
              padding: '14px 24px',
              borderTop: '1.5px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f8fafc',
              fontSize: '0.8rem',
              color: '#64748b'
            }}>
              <div>
                共 <strong>{filteredLeads.length}</strong> 筆留單紀錄 ｜ 儲存模式：本地 LocalStorage + 雙軌後端
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleInjectMocks}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#475569',
                    fontSize: '0.78rem',
                    cursor: 'pointer'
                  }}
                >
                  + 測試假資料
                </button>

                {leads.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: '1px solid #fecaca',
                      backgroundColor: '#fff1f2',
                      color: '#dc2626',
                      fontSize: '0.78rem',
                      cursor: 'pointer'
                    }}
                  >
                    清空名單
                  </button>
                )}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}
