import React, { useState } from 'react';
import { sendTelegramNotification } from './services/telegramService';
import { 
  Calculator, 
  Target, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  User, 
  Send, 
  Printer, 
  Sparkles,
  ArrowRight,
  ArrowLeft,
  AlertCircle
} from 'lucide-react';

export default function App() {
  const [step, setStep] = useState(1);

  // Step 1: Basic Info & Goals
  const [basicInfo, setBasicInfo] = useState({
    birthYear: 1992,
    familyMembers: 3,
    occupation: '科技業 / 工程師',
    monthlyIncome: 80000,
    monthlyBonus: 20000,
    monthlyExpense: 45000,
    targetRetireAge: 60,
    desiredRetireMonthlyExpense: 50000,
    selectedGoals: ['2', '3']
  });

  // Step 2: Assets & Liabilities Sheet (in 萬元)
  const [assets, setAssets] = useState({
    cash: 50,
    deposit: 30,
    stocksShort: 40,
    stocksLong: 80,
    funds: 30,
    bonds: 10,
    insuranceValue: 20,
    educationSavings: 15,
    foreignCurrency: 10,
    crypto: 5,
    realEstateValue: 1500,
    realEstateAddress: '台北市信義區',
    vehicleValue: 40,
    otherAssets: 0
  });

  const [liabilities, setLiabilities] = useState({
    mortgageBalance: 900,
    mortgageBank: '中國信託',
    mortgageYears: 30,
    mortgageRate: 2.15,
    carLoanBalance: 20,
    creditCardBalance: 0,
    personalLoanBalance: 30,
    personalLoanBank: '玉山銀行',
    personalLoanRate: 3.5,
    consumerLoanBalance: 0,
    familyBorrowBalance: 0,
    otherLiabilities: 0
  });

  // Modal State for 1-on-1 Consultation
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [consultForm, setConsultForm] = useState({
    name: '',
    phone: '',
    email: '',
    lineId: '',
    preferredTime: '平日晚上 (19:00 - 21:00)',
    note: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const goalOptions = [
    { id: '1', title: '收入保障', desc: '生老病死殘仍能維持日常生活' },
    { id: '2', title: '退休規劃', desc: '非工資收入大於總支出，享有財務自由' },
    { id: '3', title: '投資理財', desc: '用最省力最輕鬆的方式穩健累積財富' },
    { id: '4', title: '買房置產', desc: '低成本準備頭期款與房貸減壓規劃' },
    { id: '5', title: '財富傳承', desc: '將一輩子的資產順利平穩移轉給下一代' },
    { id: '6', title: '稅務諮詢', desc: '運用稅務優惠合法合規節省稅務支出' },
    { id: '7', title: '重大議題', desc: '結婚、創業、移民、贈與、繼承、海外資產' },
  ];

  const currentAge = new Date().getFullYear() - basicInfo.birthYear;
  const yearsToRetire = Math.max(1, basicInfo.targetRetireAge - currentAge);

  const totalMonthlyIncome = Number(basicInfo.monthlyIncome || 0) + Number(basicInfo.monthlyBonus || 0);
  const monthlySavings = totalMonthlyIncome - Number(basicInfo.monthlyExpense || 0);
  const annualSavingsWan = (monthlySavings * 12) / 10000;

  const totalAssetsWan = Object.entries(assets).reduce((sum, [key, val]) => {
    if (typeof val === 'number') return sum + val;
    return sum;
  }, 0);

  const totalLiabilitiesWan = Object.entries(liabilities).reduce((sum, [key, val]) => {
    if (typeof val === 'number') return sum + val;
    return sum;
  }, 0);

  const netWorthWan = totalAssetsWan - totalLiabilitiesWan;
  const debtRatioPct = totalAssetsWan > 0 ? ((totalLiabilitiesWan / totalAssetsWan) * 100).toFixed(1) : 0;
  const liquidCashWan = Number(assets.cash || 0) + Number(assets.deposit || 0);
  const emergencyFundMonths = basicInfo.monthlyExpense > 0 
    ? ((liquidCashWan * 10000) / basicInfo.monthlyExpense).toFixed(1) 
    : 0;

  const requiredRetireFundWan = (basicInfo.desiredRetireMonthlyExpense * 12 / 0.04) / 10000;
  const returnRate = 0.06;
  const futureNetWorthWan = (netWorthWan * Math.pow(1 + returnRate, yearsToRetire)) + 
    (annualSavingsWan * ((Math.pow(1 + returnRate, yearsToRetire) - 1) / returnRate));

  const retireFundGapWan = Math.max(0, requiredRetireFundWan - futureNetWorthWan);

  const toggleGoal = (id) => {
    if (basicInfo.selectedGoals.includes(id)) {
      setBasicInfo(prev => ({
        ...prev,
        selectedGoals: prev.selectedGoals.filter(g => g !== id)
      }));
    } else {
      if (basicInfo.selectedGoals.length >= 3) {
        alert('至多選擇 3 項主要財務目標！');
        return;
      }
      setBasicInfo(prev => ({
        ...prev,
        selectedGoals: [...prev.selectedGoals, id]
      }));
    }
  };

  const handleConsultSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    const payload = {
      consultForm,
      basicInfo,
      currentAge,
      totalAssetsWan,
      totalLiabilitiesWan,
      netWorthWan,
      retireFundGapWan
    };

    console.log('正在送出諮詢資料與發送 Telegram 推播...', payload);
    await sendTelegramNotification(payload);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-darker)', color: 'var(--text-primary)', padding: '20px' }}>
      
      {/* Top Navbar */}
      <header style={{
        maxWidth: '1100px',
        margin: '0 auto 24px auto',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        borderRadius: '12px',
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #388bfd, #a371f7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '1.2rem',
            boxShadow: '0 0 14px rgba(56, 139, 253, 0.4)'
          }}>
            🎯
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '1.15rem' }}>個人理財目標計算機</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }} className="mono">
              FINANCIAL GOAL CALCULATOR v1.0
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <span className="badge badge-purple">
            <Sparkles size={13} /> 免費工具
          </span>
          <span className="badge badge-blue">
            <ShieldCheck size={13} /> 匿名隱私防護
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1100px', margin: '0 auto' }}>
        
        {/* Banner Card */}
        <div className="glass-panel" style={{
          padding: '24px',
          marginBottom: '24px',
          background: 'linear-gradient(135deg, rgba(22, 27, 34, 0.95), rgba(56, 139, 253, 0.15))',
          border: '1px solid var(--border-glow)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: '800', background: 'linear-gradient(90deg, #fff, #58a6ff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                精算您的家庭淨資產、負債比與退休缺口
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
                只需 30 秒填寫，即時生成專屬財務健檢報告與客製化顧問調優方案。
              </p>
            </div>

            <button 
              className="btn btn-primary" 
              style={{ padding: '12px 24px', fontSize: '1rem' }}
              onClick={() => setIsConsultModalOpen(true)}
            >
              <Send size={18} /> 免費預約 1對1 理財顧問諮詢
            </button>
          </div>

          {/* Progress Step Bar */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginTop: '24px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-subtle)'
          }}>
            {[
              { num: 1, title: '基本背景與財務目標', icon: User },
              { num: 2, title: '家庭資產負債盤點', icon: Calculator },
              { num: 3, title: '健檢報告與退休模擬', icon: TrendingUp }
            ].map(s => {
              const isActive = step === s.num;
              const isDone = step > s.num;
              return (
                <button
                  key={s.num}
                  onClick={() => setStep(s.num)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: isActive ? '1px solid var(--color-accent)' : '1px solid var(--border-subtle)',
                    backgroundColor: isActive ? 'var(--color-accent-bg)' : isDone ? 'rgba(0, 185, 107, 0.1)' : 'var(--bg-darker)',
                    color: isActive ? 'var(--color-accent)' : isDone ? 'var(--color-down)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: isActive ? 'var(--color-accent)' : isDone ? 'var(--color-down)' : 'var(--bg-panel)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.85rem'
                  }}>
                    {isDone ? '✓' : s.num}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{s.title}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 1: Basic Info & Goals */}
        {step === 1 && (
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={20} color="var(--color-accent)" /> 步驟 1：填寫基本收支與理財目標
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  出生年份 (西元)
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={basicInfo.birthYear}
                  onChange={e => setBasicInfo({ ...basicInfo, birthYear: Number(e.target.value) })}
                  placeholder="例如 1992"
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  今年約 {currentAge} 歲
                </span>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  家庭成員人數 (人)
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={basicInfo.familyMembers}
                  onChange={e => setBasicInfo({ ...basicInfo, familyMembers: Number(e.target.value) })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  工作職業 / 產業
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={basicInfo.occupation}
                  onChange={e => setBasicInfo({ ...basicInfo, occupation: e.target.value })}
                  placeholder="例如：金融業、軟體工程師、自媒體"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  月常態收入 (元)
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={basicInfo.monthlyIncome}
                  onChange={e => setBasicInfo({ ...basicInfo, monthlyIncome: Number(e.target.value) })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  月平均獎金/副業 (元)
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={basicInfo.monthlyBonus}
                  onChange={e => setBasicInfo({ ...basicInfo, monthlyBonus: Number(e.target.value) })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  月必要性總支出 (元)
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={basicInfo.monthlyExpense}
                  onChange={e => setBasicInfo({ ...basicInfo, monthlyExpense: Number(e.target.value) })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  預計退休年齡 (歲)
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={basicInfo.targetRetireAge}
                  onChange={e => setBasicInfo({ ...basicInfo, targetRetireAge: Number(e.target.value) })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  期望退休後月生活費 (元/現值)
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={basicInfo.desiredRetireMonthlyExpense}
                  onChange={e => setBasicInfo({ ...basicInfo, desiredRetireMonthlyExpense: Number(e.target.value) })}
                />
              </div>
            </div>

            {/* Goal Options */}
            <div style={{ marginTop: '20px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '8px' }}>
                🎯 選擇您的核心財務目標（至多可選 3 項）
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '12px' }}>
                {goalOptions.map(g => {
                  const isSelected = basicInfo.selectedGoals.includes(g.id);
                  return (
                    <div
                      key={g.id}
                      onClick={() => toggleGoal(g.id)}
                      style={{
                        padding: '14px',
                        borderRadius: '10px',
                        border: isSelected ? '1.5px solid var(--color-accent)' : '1px solid var(--border-subtle)',
                        backgroundColor: isSelected ? 'var(--color-accent-bg)' : 'var(--bg-darker)',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px'
                      }}
                    >
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '4px',
                        border: isSelected ? 'none' : '1px solid var(--text-muted)',
                        backgroundColor: isSelected ? 'var(--color-accent)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '0.75rem',
                        marginTop: '2px',
                        flexShrink: 0
                      }}>
                        {isSelected && '✓'}
                      </div>
                      <div>
                        <div style={{ fontWeight: '600', fontSize: '0.9rem', color: isSelected ? 'var(--color-accent)' : 'var(--text-primary)' }}>
                          {g.id}. {g.title}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                          {g.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <button className="btn btn-primary" onClick={() => setStep(2)}>
                下一步：盤點資產負債 <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Assets & Liabilities Sheet */}
        {step === 2 && (
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calculator size={20} color="var(--color-accent)" /> 步驟 2：家庭資產負債盤點 (單位：萬元)
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))', gap: '24px' }}>
              
              {/* Assets Column */}
              <div style={{ backgroundColor: 'var(--bg-darker)', padding: '18px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--color-accent)' }}>
                    💎 資產項目 (Assets)
                  </h3>
                  <span className="mono" style={{ fontWeight: '700', color: 'var(--color-accent)', fontSize: '1.1rem' }}>
                    合計: {totalAssetsWan} 萬元
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[
                    { key: 'cash', label: '💰 現金及活期存款' },
                    { key: 'deposit', label: '🏦 定期存款/大額存單' },
                    { key: 'stocksShort', label: '📈 股票 (短線波段)' },
                    { key: 'stocksLong', label: '📊 股票 (長期持有)' },
                    { key: 'funds', label: '💹 基金 / ETF' },
                    { key: 'bonds', label: '💎 理財產品 / 債券' },
                    { key: 'insuranceValue', label: '🛡️ 保險現金價值' },
                    { key: 'educationSavings', label: '🎓 教育金 / 儲蓄險' },
                    { key: 'foreignCurrency', label: '💱 外幣資產' },
                    { key: 'crypto', label: '🌐 數位資產 (Crypto/NFT)' },
                    { key: 'realEstateValue', label: '🏠 房產估值' },
                    { key: 'vehicleValue', label: '🚗 車輛估值' },
                  ].map(item => (
                    <div key={item.key}>
                      <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                        {item.label}
                      </label>
                      <input
                        type="number"
                        className="input-field"
                        value={assets[item.key]}
                        onChange={e => setAssets({ ...assets, [item.key]: Number(e.target.value) })}
                      />
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '12px' }}>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    🏠 房產備註 / 地址 (選填)
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={assets.realEstateAddress}
                    onChange={e => setAssets({ ...assets, realEstateAddress: e.target.value })}
                    placeholder="例如：台北市信義區三房"
                  />
                </div>
              </div>

              {/* Liabilities Column */}
              <div style={{ backgroundColor: 'var(--bg-darker)', padding: '18px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: 'var(--color-up)' }}>
                    💳 負債項目 (Liabilities)
                  </h3>
                  <span className="mono" style={{ fontWeight: '700', color: 'var(--color-up)', fontSize: '1.1rem' }}>
                    合計: {totalLiabilitiesWan} 萬元
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[
                    { key: 'mortgageBalance', label: '🏠 房貸餘額' },
                    { key: 'carLoanBalance', label: '🚗 車貸餘額' },
                    { key: 'creditCardBalance', label: '💳 信用卡待繳' },
                    { key: 'personalLoanBalance', label: '📜 信貸 / 學貸' },
                    { key: 'consumerLoanBalance', label: '🛍️ 消費貸 / 分期' },
                    { key: 'familyBorrowBalance', label: '🤝 親友借款' },
                  ].map(item => (
                    <div key={item.key}>
                      <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                        {item.label}
                      </label>
                      <input
                        type="number"
                        className="input-field"
                        value={liabilities[item.key]}
                        onChange={e => setLiabilities({ ...liabilities, [item.key]: Number(e.target.value) })}
                      />
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px dashed var(--border-subtle)' }}>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '8px', fontWeight: '600' }}>
                    📝 信貸 / 房貸細節備註 (有助於顧問評估調降利率與房貸減壓)
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>房貸銀行</label>
                      <input
                        type="text"
                        className="input-field"
                        value={liabilities.mortgageBank}
                        onChange={e => setLiabilities({ ...liabilities, mortgageBank: e.target.value })}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>房貸年利率 (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="input-field"
                        value={liabilities.mortgageRate}
                        onChange={e => setLiabilities({ ...liabilities, mortgageRate: Number(e.target.value) })}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>信貸銀行</label>
                      <input
                        type="text"
                        className="input-field"
                        value={liabilities.personalLoanBank}
                        onChange={e => setLiabilities({ ...liabilities, personalLoanBank: e.target.value })}
                      />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>信貸年利率 (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="input-field"
                        value={liabilities.personalLoanRate}
                        onChange={e => setLiabilities({ ...liabilities, personalLoanRate: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
              <button className="btn btn-secondary" onClick={() => setStep(1)}>
                <ArrowLeft size={16} /> 上一步
              </button>
              <button className="btn btn-primary" onClick={() => setStep(3)}>
                生成財務健檢報告與退休計算結果 <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Report Dashboard */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Net Worth Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '18px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>家庭淨資產 (Net Worth)</div>
                <div className="mono" style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--color-accent)', marginTop: '4px' }}>
                  ${netWorthWan.toLocaleString()} 萬
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  總資產 {totalAssetsWan}萬 - 總負債 {totalLiabilitiesWan}萬
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '18px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>每月淨儲蓄金額</div>
                <div className="mono" style={{ fontSize: '1.6rem', fontWeight: '800', color: monthlySavings >= 0 ? 'var(--color-down)' : 'var(--color-up)', marginTop: '4px' }}>
                  ${monthlySavings.toLocaleString()} 元
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  儲蓄率: {totalMonthlyIncome > 0 ? ((monthlySavings / totalMonthlyIncome) * 100).toFixed(1) : 0}%
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '18px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>緊急預備金水準</div>
                <div className="mono" style={{ fontSize: '1.6rem', fontWeight: '800', color: emergencyFundMonths >= 6 ? 'var(--color-down)' : 'var(--color-warning)', marginTop: '4px' }}>
                  {emergencyFundMonths} 個月
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  建議維持 6~12 個月開銷
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '18px' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>總負債資產比率</div>
                <div className="mono" style={{ fontSize: '1.6rem', fontWeight: '800', color: Number(debtRatioPct) < 50 ? 'var(--color-down)' : 'var(--color-up)', marginTop: '4px' }}>
                  {debtRatioPct}%
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {Number(debtRatioPct) < 50 ? '健康槓桿比率' : '負債比例偏高需調優'}
                </div>
              </div>
            </div>

            {/* Retirement Simulator */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={22} color="var(--color-accent)" /> 🏖️ 退休金目標與投資複利成長模擬
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'center' }}>
                <div style={{ backgroundColor: 'var(--bg-darker)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>當前年齡 / 目標退休年齡</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '700', marginTop: '2px' }}>
                    {currentAge} 歲 ➔ {basicInfo.targetRetireAge} 歲 (還剩 <span style={{ color: 'var(--color-accent)' }}>{yearsToRetire}</span> 年)
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '12px' }}>預估退休金總庫需求 (4%法則)</div>
                  <div className="mono" style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--text-primary)' }}>
                    ${requiredRetireFundWan.toFixed(0)} 萬元
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '12px' }}>預計 60 歲時累積總資產 (複利6%估算)</div>
                  <div className="mono" style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--color-down)' }}>
                    ${futureNetWorthWan.toFixed(0)} 萬元
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-darker)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-glow)' }}>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '600' }}>🎯 退休目標達成狀況評估：</div>
                  
                  {retireFundGapWan <= 0 ? (
                    <div style={{ marginTop: '12px', color: 'var(--color-down)', display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <CheckCircle2 size={32} />
                      <div>
                        <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>太棒了！您的退休目標完全在軌道上！</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          按照當前積蓄與投資進度，您可在 {basicInfo.targetRetireAge} 歲順利達成財務自由，享有每月 ${basicInfo.desiredRetireMonthlyExpense} 被動收入！
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ marginTop: '12px', color: 'var(--color-up)', display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <AlertCircle size={32} style={{ flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>警示：尚有 ${retireFundGapWan.toFixed(0)} 萬元缺口！</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          若要補齊此缺口，建議調整資產配置比例（將低收益定存轉為穩健 ETF），或每月再增加高約 <span style={{ color: 'var(--color-accent)', fontWeight: '700' }}>${((retireFundGapWan * 10000) / (yearsToRetire * 12)).toFixed(0)} 元</span> 的投資注碼。
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Advisory Points */}
            <div className="glass-panel" style={{ padding: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '16px' }}>
                💡 理財顧問客製化調優方案預覽
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                <div style={{ backgroundColor: 'var(--bg-darker)', padding: '16px', borderRadius: '10px', borderLeft: '4px solid var(--color-accent)' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--color-accent)' }}>
                    1. 資產配置優化與抗通膨
                  </div>
                  <div style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                    目前活存/定存占比 {((liquidCashWan / (totalAssetsWan || 1)) * 100).toFixed(0)}%，建議保留 {emergencyFundMonths} 個月預備金後，將剩餘閒置資金佈局低波高息標的。
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-darker)', padding: '16px', borderRadius: '10px', borderLeft: '4px solid var(--color-warning)' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--color-warning)' }}>
                    2. 負債減壓與利率調降
                  </div>
                  <div style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                    針對目前信貸 ({liabilities.personalLoanRate}%) 與房貸 ({liabilities.mortgageRate}%)，顧問可提供跨銀行轉貸與減壓試算，幫助您節省利息支出。
                  </div>
                </div>

                <div style={{ backgroundColor: 'var(--bg-darker)', padding: '16px', borderRadius: '10px', borderLeft: '4px solid var(--color-purple)' }}>
                  <div style={{ fontWeight: '700', fontSize: '0.95rem', color: 'var(--color-purple)' }}>
                    3. 專屬傳承與稅務規劃
                  </div>
                  <div style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                    針對選定的財務目標，運用保單槓桿、贈與免稅額與信託工具，達到合法避稅與極致保障防護網。
                  </div>
                </div>
              </div>

              {/* Advisory CTA */}
              <div style={{
                marginTop: '24px',
                padding: '20px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, rgba(56, 139, 253, 0.2), rgba(163, 113, 247, 0.2))',
                border: '1px solid var(--color-accent)',
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div>
                  <div style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fff' }}>
                    🎁 專屬福利：免費領取「1對1理財顧問調優諮詢」 (價值 $3,000)
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    由專業理財顧問親自為您做全方位資產健檢、稅務節省與房貸減壓規劃。
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn btn-secondary" onClick={() => window.print()}>
                    <Printer size={16} /> 列印/下載報告
                  </button>
                  <button className="btn btn-primary" style={{ padding: '10px 24px', fontSize: '1rem' }} onClick={() => setIsConsultModalOpen(true)}>
                    <Send size={18} /> 立即預約諮詢
                  </button>
                </div>
              </div>

            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <button className="btn btn-secondary" onClick={() => setStep(2)}>
                <ArrowLeft size={16} /> 修改資產負債數據
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer style={{ maxWidth: '1100px', margin: '40px auto 20px auto', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        © {new Date().getFullYear()} 個人理財目標計算機 | 專屬理財健檢與 1對1 理財顧問諮詢轉化系統
      </footer>

      {/* Consultation Modal */}
      {isConsultModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '520px',
            padding: '28px',
            position: 'relative',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
            border: '1px solid var(--border-glow)'
          }}>
            <button
              onClick={() => { setIsConsultModalOpen(false); setIsSubmitted(false); }}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '1.2rem',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>

            {!isSubmitted ? (
              <form onSubmit={handleConsultSubmit}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-accent)', marginBottom: '4px' }}>
                  <Sparkles size={18} />
                  <span style={{ fontSize: '0.85rem', fontWeight: '700' }}>限定免費名額</span>
                </div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '800', marginBottom: '8px' }}>
                  預約 1對1 理財顧問諮詢
                </h2>
                <p style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                  請填寫您的聯絡方式，顧問將依據您的淨資產(${netWorthWan}萬)與退休缺口，為您訂製調優方案。
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      您的稱呼 / 姓名 *
                    </label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      placeholder="例如：陳先生 / 林小姐"
                      value={consultForm.name}
                      onChange={e => setConsultForm({ ...consultForm, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      聯絡電話 *
                    </label>
                    <input
                      type="tel"
                      required
                      className="input-field"
                      placeholder="例如：0912-345-678"
                      value={consultForm.phone}
                      onChange={e => setConsultForm({ ...consultForm, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      電子信箱 Email (自動發送試算報告與週報) *
                    </label>
                    <input
                      type="email"
                      required
                      className="input-field"
                      placeholder="例如：yourname@email.com"
                      value={consultForm.email}
                      onChange={e => setConsultForm({ ...consultForm, email: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      LINE ID (方便發送報告)
                    </label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="例如：my_line_id"
                      value={consultForm.lineId}
                      onChange={e => setConsultForm({ ...consultForm, lineId: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      方便諮詢的時段
                    </label>
                    <select
                      className="input-field"
                      value={consultForm.preferredTime}
                      onChange={e => setConsultForm({ ...consultForm, preferredTime: e.target.value })}
                    >
                      <option value="平日白天 (09:00 - 18:00)">平日白天 (09:00 - 18:00)</option>
                      <option value="平日晚上 (19:00 - 21:00)">平日晚上 (19:00 - 21:00)</option>
                      <option value="週末假日 (10:00 - 18:00)">週末假日 (10:00 - 18:00)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                      特別想詢問的問題 (選填)
                    </label>
                    <textarea
                      className="input-field"
                      rows={3}
                      placeholder="例如：想了解如何做房貸轉貸減壓，或節省所得稅..."
                      value={consultForm.note}
                      onChange={e => setConsultForm({ ...consultForm, note: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', fontSize: '1rem', marginTop: '10px' }}>
                    <Send size={18} /> 確認送出預約
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-down-bg)',
                  color: 'var(--color-down)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto'
                }}>
                  <CheckCircle2 size={36} />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff' }}>
                  預約成功！
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
                  感謝您的預約。我們已收到您的理財目標試算報告與諮詢需求，專業理財顧問將在 24 小時內與您聯繫！
                </p>

                <button
                  className="btn btn-secondary"
                  style={{ marginTop: '24px', width: '100%' }}
                  onClick={() => { setIsConsultModalOpen(false); setIsSubmitted(false); }}
                >
                  返回計算機報告
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
