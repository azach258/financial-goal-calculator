import React, { useState } from 'react';
import { sendTelegramNotification } from './services/telegramService';
import { 
  Heart, 
  Sparkles, 
  Coffee, 
  Home, 
  Plane, 
  Smile, 
  CheckCircle2, 
  Send, 
  Printer, 
  ArrowRight, 
  ArrowLeft, 
  ShieldCheck,
  Award,
  Flower2
} from 'lucide-react';

export default function App() {
  const [step, setStep] = useState(1);

  // Step 1: Basic Info & Goals
  const [basicInfo, setBasicInfo] = useState({
    birthYear: 1995,
    familyMembers: 2,
    occupation: '質感自媒體 / 設計師',
    monthlyIncome: 65000,
    monthlyBonus: 15000,
    monthlyExpense: 38000,
    targetRetireAge: 55,
    desiredRetireMonthlyExpense: 45000,
    selectedGoals: ['1', '2', '3']
  });

  // Step 2: Assets & Liabilities Sheet (in 萬元)
  const [assets, setAssets] = useState({
    cash: 40,
    deposit: 30,
    stocksShort: 20,
    stocksLong: 60,
    funds: 25,
    bonds: 10,
    insuranceValue: 15,
    educationSavings: 10,
    foreignCurrency: 10,
    crypto: 0,
    realEstateValue: 800,
    realEstateAddress: '台北市採光溫馨小宅',
    vehicleValue: 0,
    otherAssets: 0
  });

  const [liabilities, setLiabilities] = useState({
    mortgageBalance: 450,
    mortgageBank: '國泰世華',
    mortgageYears: 30,
    mortgageRate: 2.15,
    carLoanBalance: 0,
    creditCardBalance: 0,
    personalLoanBalance: 0,
    personalLoanBank: '',
    personalLoanRate: 0,
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
    { id: '1', title: '☕ 自由人生', desc: '擁有不必為生活屈就的底氣，隨心享受下午茶與咖啡誌' },
    { id: '2', title: '🏖️ 理想退休', desc: '打造每月被動收入，早日解鎖想走就走的自由人生' },
    { id: '3', title: '🏡 夢想小屋', desc: '擁有一間採光極佳、佈置溫馨、屬於自己的專屬小城堡' },
    { id: '4', title: '💎 圓夢基金', desc: '穩健積累第一筆百萬基金，讓理想生活不再遙不可及' },
    { id: '5', title: '🌸 優雅保障', desc: '遇到風險休養時也能保持生活品質，優雅不被打擾' },
    { id: '6', title: '🎓 質感進修', desc: '保留專屬學習預算，投資花藝、繪畫與質感技能' },
    { id: '7', title: '✈️ 環遊世界', desc: '每年安排一趟高質感的深度旅遊，記錄美好風景' },
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
        alert('至多選擇 3 項最讓你怦然心動的理想目標唷！🌸');
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
    <div style={{ minHeight: '100vh', padding: '24px 16px' }}>
      
      {/* Navbar */}
      <header style={{
        maxWidth: '960px',
        margin: '0 auto 28px auto',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        padding: '18px 28px',
        borderRadius: '999px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        border: '1.5px solid var(--border-pink)',
        boxShadow: '0 4px 20px rgba(255, 117, 140, 0.12)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ff758c, #ff7eb3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(255, 117, 140, 0.4)'
          }}>
            <Flower2 size={24} />
          </div>
          <div>
            <div style={{ fontWeight: '800', fontSize: '1.2rem', color: 'var(--text-main)', letterSpacing: '0.5px' }}>
              理想生活目標計算機
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-pink-primary)', fontWeight: '600' }}>
              🌸 專屬妳的甜美理財與夢想藍圖
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <span className="badge badge-pink">
            <Sparkles size={13} /> 30秒極速試算
          </span>
          <span className="badge badge-lavender">
            <ShieldCheck size={13} /> 100% 匿名隱私
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '960px', margin: '0 auto' }}>
        
        {/* Banner Hero Card */}
        <div className="glass-panel" style={{
          padding: '32px 28px',
          marginBottom: '28px',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 240, 243, 0.9))',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div className="animate-float" style={{ position: 'absolute', top: '15px', right: '25px', color: '#ff758c', opacity: 0.6 }}>
            ✨
          </div>
          <div className="animate-float" style={{ position: 'absolute', bottom: '15px', left: '25px', color: '#ff7eb3', opacity: 0.6 }}>
            🌸
          </div>

          <span className="badge badge-pink" style={{ padding: '6px 14px', fontSize: '0.85rem', marginBottom: '12px' }}>
            💌 給追求自由與高質感生活的妳
          </span>

          <h1 style={{ 
            fontSize: '2.1rem', 
            fontWeight: '900', 
            lineHeight: '1.35',
            background: 'linear-gradient(135deg, #4a3b3c, #ff758c)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            margin: '8px 0 12px 0'
          }}>
            遇見未來怦然心動的自己：理想生活與自由資金試算
          </h1>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '680px', margin: '0 auto 24px auto' }}>
            透過溫馨靈感的 3 步驟盤點，算算出妳離「隨心旅遊、擁有一間溫馨小屋與被動收入」還有多少距離。
          </p>

          <button 
            className="btn btn-primary" 
            style={{ padding: '14px 32px', fontSize: '1.05rem', fontWeight: '700' }}
            onClick={() => setIsConsultModalOpen(true)}
          >
            <Sparkles size={18} /> 免費預約 1對1 幸福理財顧問靈感對談
          </button>

          {/* Progress Steps */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '14px',
            marginTop: '32px',
            paddingTop: '20px',
            borderTop: '1.5px dashed var(--border-pink)'
          }}>
            {[
              { num: 1, title: '描繪心動目標', icon: Heart },
              { num: 2, title: '幸福資產盤點', icon: Coffee },
              { num: 3, title: '夢想藍圖與缺口', icon: Sparkles }
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
                    justifyContent: 'center',
                    gap: '10px',
                    padding: '12px',
                    borderRadius: '16px',
                    border: isActive ? '2px solid var(--color-pink-primary)' : '1.5px solid var(--border-pink)',
                    backgroundColor: isActive ? 'var(--bg-soft-pink)' : isDone ? '#fff0f5' : '#ffffff',
                    color: isActive ? 'var(--color-pink-primary)' : isDone ? '#e84393' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease'
                  }}
                >
                  <div style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: isActive ? 'var(--color-pink-primary)' : isDone ? '#e84393' : '#f0e6eb',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.85rem'
                  }}>
                    {isDone ? '✓' : s.num}
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: '700' }}>{s.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 1: Basic Info & Goals */}
        {step === 1 && (
          <div className="glass-panel" style={{ padding: '32px 28px' }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-pink-primary)' }}>
              <Heart size={22} fill="var(--color-pink-primary)" /> 步驟 1：關於妳的現在與理想生活的模樣
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '18px', marginBottom: '28px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                  出生年份 (西元) 🌸
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={basicInfo.birthYear}
                  onChange={e => setBasicInfo({ ...basicInfo, birthYear: Number(e.target.value) })}
                  placeholder="例如 1995"
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--color-pink-primary)', marginTop: '4px', display: 'block', fontWeight: '500' }}>
                  今年正值燦爛的 {currentAge} 歲 ✨
                </span>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                  目前職業 / 質感領域
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={basicInfo.occupation}
                  onChange={e => setBasicInfo({ ...basicInfo, occupation: e.target.value })}
                  placeholder="例如：行銷企劃、軟體工程師、自媒體"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                  常態月收入 (元) 💰
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={basicInfo.monthlyIncome}
                  onChange={e => setBasicInfo({ ...basicInfo, monthlyIncome: Number(e.target.value) })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                  副業 / 平均獎金 (元) ✨
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={basicInfo.monthlyBonus}
                  onChange={e => setBasicInfo({ ...basicInfo, monthlyBonus: Number(e.target.value) })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                  每月必要生活花費 (元) ☕
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={basicInfo.monthlyExpense}
                  onChange={e => setBasicInfo({ ...basicInfo, monthlyExpense: Number(e.target.value) })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                  期望開啟自由生活的年齡 (歲) 🏖️
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={basicInfo.targetRetireAge}
                  onChange={e => setBasicInfo({ ...basicInfo, targetRetireAge: Number(e.target.value) })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                  自由生活後的每月心動預算 (元) 💖
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
            <div style={{ marginTop: '24px' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '14px', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                🌸 選擇最讓妳怦然心動的理想目標（至多選 3 項）
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
                {goalOptions.map(g => {
                  const isSelected = basicInfo.selectedGoals.includes(g.id);
                  return (
                    <div
                      key={g.id}
                      onClick={() => toggleGoal(g.id)}
                      style={{
                        padding: '16px',
                        borderRadius: '16px',
                        border: isSelected ? '2px solid var(--color-pink-primary)' : '1.5px solid var(--border-pink)',
                        backgroundColor: isSelected ? 'var(--bg-soft-pink)' : '#ffffff',
                        boxShadow: isSelected ? '0 6px 18px rgba(255, 117, 140, 0.18)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.25s ease',
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '12px'
                      }}
                    >
                      <div style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '50%',
                        border: isSelected ? 'none' : '1.5px solid var(--text-muted)',
                        backgroundColor: isSelected ? 'var(--color-pink-primary)' : 'transparent',
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
                        <div style={{ fontWeight: '700', fontSize: '0.95rem', color: isSelected ? 'var(--color-pink-primary)' : 'var(--text-main)' }}>
                          {g.title}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.4' }}>
                          {g.desc}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '32px' }}>
              <button className="btn btn-primary" onClick={() => setStep(2)}>
                下一步：溫馨資產盤點 <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Assets & Liabilities Sheet */}
        {step === 2 && (
          <div className="glass-panel" style={{ padding: '32px 28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-pink-primary)' }}>
                <Coffee size={22} /> 步驟 2：幸福資產與負債盤點 (單位：萬元)
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
              
              {/* Assets Column */}
              <div style={{ backgroundColor: '#ffffff', padding: '22px', borderRadius: '18px', border: '1.5px solid var(--border-pink)', boxShadow: 'var(--shadow-soft)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1.5px dashed var(--border-pink)', paddingBottom: '10px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--color-pink-primary)' }}>
                    💎 幸福資產積累 (Assets)
                  </h3>
                  <span className="mono" style={{ fontWeight: '800', color: 'var(--color-pink-primary)', fontSize: '1.2rem' }}>
                    合計: {totalAssetsWan} 萬元
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[
                    { key: 'cash', label: '💰 現金與活期存款' },
                    { key: 'deposit', label: '🏦 定期存款 / 數位帳戶' },
                    { key: 'stocksShort', label: '📈 台股 / 美股波段' },
                    { key: 'stocksLong', label: '📊 長期 ETF (如 0050/00878)' },
                    { key: 'funds', label: '💹 穩健基金與債券' },
                    { key: 'insuranceValue', label: '🛡️ 儲蓄險與保單價值' },
                    { key: 'foreignCurrency', label: '💱 外幣儲蓄 (美金/日幣)' },
                    { key: 'realEstateValue', label: '🏠 夢想房產估值' },
                  ].map(item => (
                    <div key={item.key}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontWeight: '500' }}>
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

                <div style={{ marginTop: '14px' }}>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontWeight: '500' }}>
                    🏠 夢想小屋備註 / 期望地點 (選填)
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={assets.realEstateAddress}
                    onChange={e => setAssets({ ...assets, realEstateAddress: e.target.value })}
                    placeholder="例如：台北採光小宅、台中溫馨兩房"
                  />
                </div>
              </div>

              {/* Liabilities Column */}
              <div style={{ backgroundColor: '#ffffff', padding: '22px', borderRadius: '18px', border: '1.5px solid rgba(255, 182, 193, 0.4)', boxShadow: 'var(--shadow-soft)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1.5px dashed rgba(255, 182, 193, 0.4)', paddingBottom: '10px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: '800', color: '#e84393' }}>
                    💳 負債項目與減壓 (Liabilities)
                  </h3>
                  <span className="mono" style={{ fontWeight: '800', color: '#e84393', fontSize: '1.2rem' }}>
                    合計: {totalLiabilitiesWan} 萬元
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  {[
                    { key: 'mortgageBalance', label: '🏠 房貸剩餘本金' },
                    { key: 'carLoanBalance', label: '🚗 車貸剩餘金額' },
                    { key: 'creditCardBalance', label: '💳 信用卡本期消費' },
                    { key: 'personalLoanBalance', label: '📜 信貸 / 學貸餘額' },
                  ].map(item => (
                    <div key={item.key}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontWeight: '500' }}>
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

                <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px dashed var(--border-pink)' }}>
                  <h4 style={{ fontSize: '0.88rem', color: 'var(--text-main)', marginBottom: '8px', fontWeight: '700' }}>
                    📝 房貸 / 信貸減壓諮詢備註 (幫助顧問評估降息方案)
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
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>房貸利率 (%)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="input-field"
                        value={liabilities.mortgageRate}
                        onChange={e => setLiabilities({ ...liabilities, mortgageRate: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '32px' }}>
              <button className="btn btn-secondary" onClick={() => setStep(1)}>
                <ArrowLeft size={16} /> 上一步
              </button>
              <button className="btn btn-primary" onClick={() => setStep(3)}>
                生成怦然心動的夢想健檢報告 <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Report Dashboard */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            
            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <div className="glass-panel" style={{ padding: '20px', background: 'linear-gradient(135deg, #ffffff, #fff0f3)' }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: '600' }}>🌸 當前家庭淨資產</div>
                <div className="mono" style={{ fontSize: '1.7rem', fontWeight: '900', color: 'var(--color-pink-primary)', marginTop: '4px' }}>
                  ${netWorthWan.toLocaleString()} 萬
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  資產 {totalAssetsWan}萬 - 負債 {totalLiabilitiesWan}萬
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '20px', background: 'linear-gradient(135deg, #ffffff, #f7f0fa)' }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: '600' }}>💖 每月自由儲蓄額</div>
                <div className="mono" style={{ fontSize: '1.7rem', fontWeight: '900', color: '#8e44ad', marginTop: '4px' }}>
                  ${monthlySavings.toLocaleString()} 元
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  儲蓄率: {totalMonthlyIncome > 0 ? ((monthlySavings / totalMonthlyIncome) * 100).toFixed(1) : 0}%
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '20px', background: 'linear-gradient(135deg, #ffffff, #eafaf1)' }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: '600' }}>☕ 寵愛自己預備金</div>
                <div className="mono" style={{ fontSize: '1.7rem', fontWeight: '900', color: '#27ae60', marginTop: '4px' }}>
                  {emergencyFundMonths} 個月
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  生活隨心無後顧之憂
                </div>
              </div>

              <div className="glass-panel" style={{ padding: '20px', background: 'linear-gradient(135deg, #ffffff, #fff8dc)' }}>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: '600' }}>✨ 槓桿健康指數</div>
                <div className="mono" style={{ fontSize: '1.7rem', fontWeight: '900', color: '#d35400', marginTop: '4px' }}>
                  {debtRatioPct}%
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {Number(debtRatioPct) < 50 ? '優雅健康比例' : '需適度減壓'}
                </div>
              </div>
            </div>

            {/* Retirement & Dream Simulator */}
            <div className="glass-panel" style={{ padding: '28px', background: 'linear-gradient(135deg, #ffffff, #fff5f7)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '900', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-pink-primary)' }}>
                <Sparkles size={24} /> 🏖️ 理想自由生活的複利與夢想試算
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'center' }}>
                <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '16px', border: '1.5px solid var(--border-pink)' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>當前年齡 / 期望自由年齡</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: '800', marginTop: '2px', color: 'var(--text-main)' }}>
                    {currentAge} 歲 ➔ {basicInfo.targetRetireAge} 歲 (倒數 <span style={{ color: 'var(--color-pink-primary)' }}>{yearsToRetire}</span> 年 ✨)
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '14px' }}>自由人生所需總水庫 (4%法則估算)</div>
                  <div className="mono" style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>
                    ${requiredRetireFundWan.toFixed(0)} 萬元
                  </div>

                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '14px' }}>預計 {basicInfo.targetRetireAge} 歲時妳累積的總資產 (複利 6%)</div>
                  <div className="mono" style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--color-pink-primary)' }}>
                    ${futureNetWorthWan.toFixed(0)} 萬元
                  </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '22px', borderRadius: '16px', border: '1.5px solid var(--color-pink-primary)', boxShadow: '0 8px 25px rgba(255, 117, 140, 0.15)' }}>
                  <div style={{ fontSize: '0.92rem', color: 'var(--color-pink-primary)', fontWeight: '800' }}>💖 理想生活進度真心評估：</div>
                  
                  {retireFundGapWan <= 0 ? (
                    <div style={{ marginTop: '12px', color: '#27ae60', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <CheckCircle2 size={36} />
                      <div>
                        <div style={{ fontSize: '1.15rem', fontWeight: '800' }}>太美好了！妳的夢想藍圖完全在軌道上！</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          照目前的步調，妳可在 {basicInfo.targetRetireAge} 歲時享有每月 ${basicInfo.desiredRetireMonthlyExpense} 元的被動收入，優雅擁抱自由！
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ marginTop: '12px', color: 'var(--color-pink-primary)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <Heart size={32} fill="var(--color-pink-primary)" style={{ flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '1.15rem', fontWeight: '800' }}>還差一點點！尚有 ${retireFundGapWan.toFixed(0)} 萬元的夢想距離</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                          只要適度優化資產配置（如提升高股息 ETF 比例），或每月再多投入約 <span style={{ color: 'var(--color-pink-primary)', fontWeight: '800' }}>${((retireFundGapWan * 10000) / (yearsToRetire * 12)).toFixed(0)} 元</span>，就能加速實現理想生活！
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Advisory Points */}
            <div className="glass-panel" style={{ padding: '28px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '18px', color: 'var(--text-main)' }}>
                🌸 給妳的 3 個專屬質感理財調優建議
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '18px' }}>
                <div style={{ backgroundColor: '#ffffff', padding: '18px', borderRadius: '14px', borderLeft: '4px solid var(--color-pink-primary)', boxShadow: 'var(--shadow-soft)' }}>
                  <div style={{ fontWeight: '800', fontSize: '0.98rem', color: 'var(--color-pink-primary)' }}>
                    1. 打造自動化「被動收入水龍頭」
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: '1.5' }}>
                    將閒置的低收益定存轉為每月派息的台股 ETF 組合，讓被動收入幫妳支付下午茶與咖啡誌。
                  </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '18px', borderRadius: '14px', borderLeft: '4px solid #8e44ad', boxShadow: 'var(--shadow-soft)' }}>
                  <div style={{ fontWeight: '800', fontSize: '0.98rem', color: '#8e44ad' }}>
                    2. 房貸負債降息與輕鬆減壓
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: '1.5' }}>
                    透過跨行轉貸試算與利息節省，每月多省下 $3,000 ~ $8,000 元，轉為圓夢旅遊基金。
                  </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '18px', borderRadius: '14px', borderLeft: '4px solid #27ae60', boxShadow: 'var(--shadow-soft)' }}>
                  <div style={{ fontWeight: '800', fontSize: '0.98rem', color: '#27ae60' }}>
                    3. 優雅保障與自主圓夢
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: '1.5' }}>
                    盤點保單保障，確保自己在衝刺事業與愛自己的同時，後防線穩如泰山。
                  </div>
                </div>
              </div>

              {/* Advisory CTA Card */}
              <div style={{
                marginTop: '28px',
                padding: '24px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #ff758c, #ff7eb3)',
                color: '#ffffff',
                boxShadow: '0 10px 30px rgba(255, 117, 140, 0.4)',
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '18px'
              }}>
                <div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={20} /> 專屬禮遇：免費領取「1對1 幸福理財靈感對談」 (價值 $3,000)
                  </div>
                  <div style={{ fontSize: '0.88rem', opacity: 0.95, marginTop: '6px' }}>
                    由專業溫暖的女性理財顧問親自為妳做資產優化、房貸減壓與夢想藍圖規劃。
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button className="btn btn-secondary" style={{ color: 'var(--text-main)' }} onClick={() => window.print()}>
                    <Printer size={16} /> 保存報告
                  </button>
                  <button className="btn" style={{ backgroundColor: '#ffffff', color: 'var(--color-pink-primary)', fontWeight: '800' }} onClick={() => setIsConsultModalOpen(true)}>
                    <Send size={18} /> 預約靈感對談
                  </button>
                </div>
              </div>

            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <button className="btn btn-secondary" onClick={() => setStep(2)}>
                <ArrowLeft size={16} /> 修改資產與目標
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer style={{ maxWidth: '960px', margin: '40px auto 20px auto', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem' }}>
        🌸 理想生活目標計算機 | 獻給追求質感與自由的每一位女性 ✨
      </footer>

      {/* Consultation Modal */}
      {isConsultModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(74, 59, 60, 0.5)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '500px',
            padding: '32px 28px',
            position: 'relative',
            backgroundColor: '#ffffff',
            boxShadow: '0 20px 60px rgba(255, 117, 140, 0.25)',
            border: '2px solid var(--border-pink)'
          }}>
            <button
              onClick={() => { setIsConsultModalOpen(false); setIsSubmitted(false); }}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '1.3rem',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>

            {!isSubmitted ? (
              <form onSubmit={handleConsultSubmit}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-pink-primary)', marginBottom: '6px' }}>
                  <Heart size={18} fill="var(--color-pink-primary)" />
                  <span style={{ fontSize: '0.85rem', fontWeight: '800' }}>限定免費名額</span>
                </div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '900', marginBottom: '8px', color: 'var(--text-main)' }}>
                  預約 1對1 幸福理財靈感對談 🌸
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '22px' }}>
                  請留下妳的聯絡方式，顧問將依據妳的家庭淨資產(${netWorthWan}萬)與自由缺口，為妳量身訂製夢想清單。
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                      妳的稱呼 / 姓名 *
                    </label>
                    <input
                      type="text"
                      required
                      className="input-field"
                      placeholder="例如：林小姐 / Emily"
                      value={consultForm.name}
                      onChange={e => setConsultForm({ ...consultForm, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
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
                    <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                      電子信箱 Email (接收報告與試算) *
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
                    <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                      LINE ID (方便發送檔案)
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
                    <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                      方便諮詢的時段
                    </label>
                    <select
                      className="input-field"
                      value={consultForm.preferredTime}
                      onChange={e => setConsultForm({ ...consultForm, preferredTime: e.target.value })}
                    >
                      <option value="平日晚上 (19:00 - 21:00)">平日晚上 (19:00 - 21:00)</option>
                      <option value="平日白天 (09:00 - 18:00)">平日白天 (09:00 - 18:00)</option>
                      <option value="週末假日 (10:00 - 18:00)">週末假日 (10:00 - 18:00)</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                      妳目前最想實現的夢想 (選填)
                    </label>
                    <textarea
                      className="input-field"
                      rows={3}
                      placeholder="例如：想了解如何規劃擁有一間自己的採光溫馨小宅..."
                      value={consultForm.note}
                      onChange={e => setConsultForm({ ...consultForm, note: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '13px', fontSize: '1.05rem', fontWeight: '700', marginTop: '10px' }}>
                    <Send size={18} /> 確認送出靈感預約 ✨
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-soft-pink)',
                  color: 'var(--color-pink-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 18px auto'
                }}>
                  <Heart size={36} fill="var(--color-pink-primary)" />
                </div>
                <h3 style={{ fontSize: '1.45rem', fontWeight: '900', color: 'var(--text-main)' }}>
                  預約成功！🌸
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: '1.5' }}>
                  我們已收到妳的理想生活報告與諮詢需求，理財顧問將在 24 小時內親自與妳聯繫！
                </p>

                <button
                  className="btn btn-secondary"
                  style={{ marginTop: '28px', width: '100%', padding: '12px' }}
                  onClick={() => { setIsConsultModalOpen(false); setIsSubmitted(false); }}
                >
                  返回靈感計算機
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
