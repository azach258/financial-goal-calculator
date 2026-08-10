import React, { useState, useEffect } from 'react';
import { sendTelegramNotification } from './services/telegramService';
import { 
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
  Compass,
  Users,
  Target,
  Palette,
  Baby,
  Heart,
  Calendar,
  PiggyBank,
  Key
} from 'lucide-react';

export default function App() {
  const [step, setStep] = useState(1);
  const [currentTheme, setCurrentTheme] = useState('theme-blue');

  // Sync theme to body class
  useEffect(() => {
    document.body.className = currentTheme;
  }, [currentTheme]);

  const themes = [
    { id: 'theme-blue', name: '冰川藍 (科技質感)', color: '#3b82f6' },
    { id: 'theme-sage', name: '靜謐綠 (自然文青)', color: '#059669' },
    { id: 'theme-lavender', name: '煙燻紫 (高級奢華)', color: '#8b5cf6' },
    { id: 'theme-coral', name: '暖陽橘 (溫暖活潑)', color: '#ea580c' },
    { id: 'theme-sand', name: '亞麻棕 (大地質感)', color: '#a88250' },
  ];

  // Step 1: Basic Info & Goals
  const [basicInfo, setBasicInfo] = useState({
    birthDate: '1995-06-15',
    familyMembers: 2,
    occupation: '專業高階主管 / 創作者',
    monthlyIncome: 80000,
    monthlyBonusAndInvestment: 20000,
    monthlyExpense: 45000,
    targetRetireAge: 55,
    desiredRetireMonthlyExpense: 55000,
    selectedGoals: ['1', '2', '4']
  });

  const calculateAge = (dobStr) => {
    if (!dobStr) return 30;
    const dob = new Date(dobStr);
    const now = new Date();
    let age = now.getFullYear() - dob.getFullYear();
    const m = now.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < dob.getDate())) {
      age--;
    }
    return isNaN(age) || age <= 0 ? 30 : age;
  };

  const currentAge = calculateAge(basicInfo.birthDate);
  const yearsToRetire = Math.max(1, basicInfo.targetRetireAge - currentAge);

  // Step 2: Assets & Liabilities Sheet (in 萬元)
  const [assets, setAssets] = useState({
    cash: 50,
    deposit: 50,
    stocksShort: 30,
    stocksLong: 80,
    funds: 30,
    bonds: 20,
    insuranceValue: 20,
    educationSavings: 15,
    foreignCurrency: 15,
    crypto: 5,
    realEstateValue: 1200,
    realEstateAddress: '台北市採光質感宅',
    vehicleValue: 40,
    otherAssets: 0
  });

  const [liabilities, setLiabilities] = useState({
    mortgageBalance: 650,
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
    consultTopic: '🏡 聰明買房成家與房貸減壓',
    note: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const goalOptions = [
    { id: '1', icon: '🏡', title: '聰明買房成家', desc: '透過首購頭期評估與房貸輕鬆減壓，擁有屬於自己的專屬城堡' },
    { id: '2', icon: '👶', title: '專屬育兒帳戶', desc: '提早為孩子打造獨立教育與成長基金，輕鬆給寶寶充裕資源' },
    { id: '3', icon: '☕', title: '自由人生', desc: '擁有不必為生活屈就的底氣，享有隨心掌控時間與生活的自由' },
    { id: '4', icon: '🏖️', title: '提早退休', desc: '打造每月被動收入水龍頭，早日解鎖想走就走的自由人生' },
    { id: '5', icon: '💎', title: '圓夢基金', desc: '穩健積累第一筆百萬自由基金，讓理想生活不再遙不可及' },
    { id: '6', icon: '🎓', title: '自我投資', desc: '保留專屬學習預算，持續投資自我成長與多元技能' },
    { id: '7', icon: '✈️', title: '環遊世界', desc: '每年安排高質感的深度跨國旅遊，記錄美好風景' },
    { id: '8', icon: '🛡️', title: '風險防護', desc: '遇到風險休養時也能保持生活品質，讓家庭後防穩如泰山' },
  ];

  const totalMonthlyIncome = Number(basicInfo.monthlyIncome || 0) + Number(basicInfo.monthlyBonusAndInvestment || 0);
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
        alert('至多選擇 3 項最讓你怦然心動的理想目標！✨');
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
    <div style={{ minHeight: '100vh', padding: '20px 12px 60px 12px' }}>
      
      {/* SC-ICG Floating Responsive Header */}
      <header className="header-container" style={{
        maxWidth: '1040px',
        margin: '0 auto 24px auto',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center',
        padding: '14px 24px',
        borderRadius: '999px',
        backgroundColor: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(16px)',
        border: '1.5px solid var(--border-primary)',
        boxShadow: '0 10px 30px rgba(30, 41, 59, 0.08)',
        position: 'sticky',
        top: '12px',
        zIndex: 100,
        gap: '12px'
      }}>
        <div className="header-logo-row" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 6px 16px var(--border-primary)',
            flexShrink: 0
          }}>
            <Compass size={22} />
          </div>
          <div>
            <div style={{ fontWeight: '900', fontSize: '1.15rem', color: 'var(--text-main)', letterSpacing: '0.3px', lineHeight: '1.2' }}>
              理想生活目標計算機
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: '700' }}>
              SC-ICG 頂級視覺 ‧ 聰明買房 ‧ 育兒帳戶
            </div>
          </div>
        </div>

        {/* Dynamic Theme Color Selector */}
        <div className="header-theme-selector" style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'var(--bg-soft-primary)', padding: '6px 12px', borderRadius: '999px', border: '1px solid var(--border-primary)' }}>
          <span style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Palette size={14} /> 主題：
          </span>
          <div style={{ display: 'flex', gap: '6px' }}>
            {themes.map(t => (
              <button
                key={t.id}
                title={t.name}
                onClick={() => setCurrentTheme(t.id)}
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: t.color,
                  border: currentTheme === t.id ? '2px solid #ffffff' : 'none',
                  boxShadow: currentTheme === t.id ? '0 0 0 2px var(--color-primary)' : '0 2px 4px rgba(0,0,0,0.15)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  transform: currentTheme === t.id ? 'scale(1.2)' : 'scale(1)'
                }}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1040px', margin: '0 auto' }}>
        
        {/* SC-ICG Agency Responsive Hero Banner */}
        <div className="glass-panel hero-panel" style={{
          padding: '40px 28px',
          marginBottom: '28px',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98), var(--bg-soft-primary))',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <span className="badge badge-primary" style={{ padding: '6px 16px', fontSize: '0.82rem', marginBottom: '14px', fontWeight: '800' }}>
            💌 獻給追求自由與高質感生活的你
          </span>

          {/* Big Punchy Responsive Title */}
          <h1 className="hero-title gradient-text" style={{ 
            fontSize: '2.2rem', 
            fontWeight: '900', 
            lineHeight: '1.3',
            margin: '10px 0 14px 0',
            letterSpacing: '-0.5px'
          }}>
            遇見未來怦然心動的自己：理想生活與自由資金試算
          </h1>

          <p className="hero-subtitle" style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', maxWidth: '720px', margin: '0 auto 24px auto', lineHeight: '1.6' }}>
            透過 SC-ICG 頂級視覺 3 步驟盤點，算算你離「聰明買房成家、專屬育兒帳戶、被動收入與自由旅行」還有多少距離。
          </p>

          {/* Social Proof Indicator */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            borderRadius: '999px',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid var(--border-primary)',
            fontSize: '0.82rem',
            color: 'var(--text-main)',
            fontWeight: '700',
            marginBottom: '24px',
            maxWidth: '100%'
          }}>
            <Users size={15} color="var(--color-primary)" style={{ flexShrink: 0 }} />
            <span>已有 <strong style={{ color: 'var(--color-primary)' }}>3,620+</strong> 位家庭與創作者完成試算</span>
          </div>

          <div>
            <button 
              className="btn btn-primary pulse-glow" 
              style={{ padding: '15px 32px', fontSize: '1.05rem', fontWeight: '800' }}
              onClick={() => setIsConsultModalOpen(true)}
            >
              <Sparkles size={18} /> 免費預約 1對1 聰明買房/育兒與理財靈感對談
            </button>
          </div>

          {/* Responsive Progress Step Switcher */}
          <div className="step-switcher-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '12px',
            marginTop: '32px',
            paddingTop: '20px',
            borderTop: '1.5px dashed var(--border-primary)'
          }}>
            {[
              { num: 1, title: '1. 描繪心動目標', icon: Target },
              { num: 2, title: '2. 幸福資產盤點', icon: Coffee },
              { num: 3, title: '3. 夢想藍圖與缺口', icon: Sparkles }
            ].map(s => {
              const isActive = step === s.num;
              const isDone = step > s.num;
              return (
                <button
                  key={s.num}
                  className="step-btn"
                  onClick={() => setStep(s.num)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px',
                    borderRadius: '16px',
                    border: isActive ? '2px solid var(--color-primary)' : '1.5px solid var(--border-primary)',
                    backgroundColor: isActive ? 'var(--bg-soft-primary)' : isDone ? 'var(--bg-soft-primary)' : '#ffffff',
                    color: isActive ? 'var(--color-primary)' : isDone ? 'var(--color-primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                  }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    backgroundColor: isActive ? 'var(--color-primary)' : isDone ? 'var(--color-primary)' : 'var(--bg-card-hover)',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '0.8rem',
                    flexShrink: 0
                  }}>
                    {isDone ? '✓' : s.num}
                  </div>
                  <span style={{ fontSize: '0.9rem', fontWeight: '800' }}>{s.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* STEP 1: Basic Info & Goals */}
        {step === 1 && (
          <div className="glass-panel section-panel" style={{ padding: '32px 24px' }}>
            
            {/* Guided Inspiration Banner */}
            <div style={{
              backgroundColor: 'var(--bg-soft-primary)',
              border: '1.5px solid var(--border-primary)',
              borderRadius: '16px',
              padding: '16px 20px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}>
              <Sparkles size={22} color="var(--color-primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', color: 'var(--color-primary)', marginBottom: '4px' }}>
                  ✨ 理想生活畫面引導：
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', lineHeight: '1.55' }}>
                  想像一下 5 ~ 10 年後的某個陽光午後，你過著怎樣的生活？是在自己佈置的溫馨小宅裡陪著可愛寶寶成長、聰明規劃房貸輕鬆無負擔，還是帶著家人隨心安排旅遊？把心放鬆，讓我們一起算算出實現夢想的具體藍圖。
                </p>
              </div>
            </div>

            <h2 style={{ fontSize: '1.3rem', fontWeight: '900', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-primary)' }}>
              <Target size={22} color="var(--color-primary)" /> 步驟 1：關於你的背景與心動目標
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
              
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                  出生年月日 (西元年/月/日) * ✨
                </label>
                <input
                  type="date"
                  className="input-field"
                  value={basicInfo.birthDate}
                  onChange={e => setBasicInfo({ ...basicInfo, birthDate: e.target.value })}
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--color-primary)', marginTop: '4px', display: 'block', fontWeight: '600' }}>
                  精算今年約為 {currentAge} 歲 ✨
                </span>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                  目前職業 / 專業領域
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={basicInfo.occupation}
                  onChange={e => setBasicInfo({ ...basicInfo, occupation: e.target.value })}
                  placeholder="例如：科技高階主管、設計師"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                  常態月本薪收入 (元) 💰
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={basicInfo.monthlyIncome}
                  onChange={e => setBasicInfo({ ...basicInfo, monthlyIncome: Number(e.target.value) })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                  月副業 / 獎金 / 投資收益 (元) ✨
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={basicInfo.monthlyBonusAndInvestment}
                  onChange={e => setBasicInfo({ ...basicInfo, monthlyBonusAndInvestment: Number(e.target.value) })}
                />
                <span style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                  💡 包含副業接案、年終與股息收益。
                </span>
              </div>

              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
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
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
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
                <label style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
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

            {/* Responsive Goal Options */}
            <div style={{ marginTop: '24px' }}>
              <h3 style={{ fontSize: '1.08rem', fontWeight: '900', marginBottom: '14px', color: 'var(--text-main)' }}>
                🌟 選擇最讓你怦然心動的理想目標（至多選 3 項）
              </h3>
              <div className="goals-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '14px' }}>
                {goalOptions.map(g => {
                  const isSelected = basicInfo.selectedGoals.includes(g.id);
                  return (
                    <div
                      key={g.id}
                      onClick={() => toggleGoal(g.id)}
                      className="glass-panel-hover"
                      style={{
                        padding: '16px',
                        borderRadius: '18px',
                        border: isSelected ? '2px solid var(--color-primary)' : '1.5px solid var(--border-primary)',
                        backgroundColor: isSelected ? 'var(--bg-soft-primary)' : '#ffffff',
                        cursor: 'pointer',
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
                        backgroundColor: isSelected ? 'var(--color-primary)' : 'transparent',
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
                        <div style={{ fontWeight: '800', fontSize: '0.96rem', color: isSelected ? 'var(--color-primary)' : 'var(--text-main)' }}>
                          {g.icon} {g.title}
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

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '28px' }}>
              <button className="btn btn-primary" onClick={() => setStep(2)}>
                下一步：資產與負債盤點 <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: Assets & Liabilities Sheet */}
        {step === 2 && (
          <div className="glass-panel section-panel" style={{ padding: '32px 24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-primary)' }}>
                <Coffee size={22} /> 步驟 2：幸福資產與負債盤點 (單位：萬元)
              </h2>
            </div>

            <div className="step2-columns-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              
              {/* Assets Column */}
              <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '18px', border: '1.5px solid var(--border-primary)', boxShadow: 'var(--shadow-card)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1.5px dashed var(--border-primary)', paddingBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '900', color: 'var(--color-primary)' }}>
                    💎 幸福資產積累 (Assets)
                  </h3>
                  <span className="mono" style={{ fontWeight: '900', color: 'var(--color-primary)', fontSize: '1.15rem' }}>
                    合計: {totalAssetsWan} 萬
                  </span>
                </div>

                <div className="step2-input-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {[
                    { key: 'cash', label: '💰 現金與活存款' },
                    { key: 'deposit', label: '🏦 定存 / 數位帳戶' },
                    { key: 'stocksShort', label: '📈 台股 / 美股波段' },
                    { key: 'stocksLong', label: '📊 長期 ETF 組合' },
                    { key: 'funds', label: '💹 穩健基金/債券' },
                    { key: 'insuranceValue', label: '🛡️ 儲蓄險/保單價值' },
                    { key: 'foreignCurrency', label: '💱 外幣儲蓄' },
                    { key: 'realEstateValue', label: '🏠 夢想房產估值' },
                  ].map(item => (
                    <div key={item.key}>
                      <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
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
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
                    🏠 聰明買房城堡備註 / 期望地點 (選填)
                  </label>
                  <input
                    type="text"
                    className="input-field"
                    value={assets.realEstateAddress}
                    onChange={e => setAssets({ ...assets, realEstateAddress: e.target.value })}
                    placeholder="例如：台北採光宅、新竹買房置產"
                  />
                </div>
              </div>

              {/* Liabilities Column */}
              <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '18px', border: '1.5px solid var(--border-primary)', boxShadow: 'var(--shadow-card)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1.5px dashed var(--border-primary)', paddingBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '900', color: 'var(--text-main)' }}>
                    💳 負債項目與輕鬆減壓 (Liabilities)
                  </h3>
                  <span className="mono" style={{ fontWeight: '900', color: 'var(--text-main)', fontSize: '1.15rem' }}>
                    合計: {totalLiabilitiesWan} 萬
                  </span>
                </div>

                <div className="step2-input-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {[
                    { key: 'mortgageBalance', label: '🏠 房貸剩餘本金' },
                    { key: 'carLoanBalance', label: '🚗 車貸剩餘金額' },
                    { key: 'creditCardBalance', label: '💳 信用卡本期消費' },
                    { key: 'personalLoanBalance', label: '📜 信貸 / 學貸餘額' },
                  ].map(item => (
                    <div key={item.key}>
                      <label style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontWeight: '600' }}>
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

                <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1.5px dashed var(--border-primary)' }}>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '8px', fontWeight: '800' }}>
                    📝 房貸減壓備註 (評估降息方案)
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

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '28px', flexWrap: 'wrap', gap: '12px' }}>
              <button className="btn btn-secondary" onClick={() => setStep(1)}>
                <ArrowLeft size={18} /> 上一步
              </button>
              <button className="btn btn-primary" onClick={() => setStep(3)}>
                生成怦然心動的夢想健檢報告 <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: Report Dashboard */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
            
            {/* Responsive Stat Cards */}
            <div className="stat-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '14px' }}>
              <div className="glass-panel glass-panel-hover" style={{ padding: '18px', background: 'linear-gradient(135deg, #ffffff, var(--bg-soft-primary))' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '700' }}>✨ 家庭淨資產</div>
                <div className="mono" style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--color-primary)', marginTop: '4px' }}>
                  ${netWorthWan.toLocaleString()} 萬
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  資產 {totalAssetsWan}萬 - 負債 {totalLiabilitiesWan}萬
                </div>
              </div>

              <div className="glass-panel glass-panel-hover" style={{ padding: '18px', background: 'linear-gradient(135deg, #ffffff, var(--bg-soft-primary))' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '700' }}>💖 每月自由儲蓄</div>
                <div className="mono" style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--color-primary)', marginTop: '4px' }}>
                  ${monthlySavings.toLocaleString()} 元
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  儲蓄率: {totalMonthlyIncome > 0 ? ((monthlySavings / totalMonthlyIncome) * 100).toFixed(1) : 0}%
                </div>
              </div>

              <div className="glass-panel glass-panel-hover" style={{ padding: '18px', background: 'linear-gradient(135deg, #ffffff, var(--bg-soft-primary))' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '700' }}>☕ 自由預備金</div>
                <div className="mono" style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--color-primary)', marginTop: '4px' }}>
                  {emergencyFundMonths} 個月
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  生活隨心無後顧之憂
                </div>
              </div>

              <div className="glass-panel glass-panel-hover" style={{ padding: '18px', background: 'linear-gradient(135deg, #ffffff, var(--bg-soft-primary))' }}>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '700' }}>🌟 槓桿健康度</div>
                <div className="mono" style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main)', marginTop: '4px' }}>
                  {debtRatioPct}%
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {Number(debtRatioPct) < 50 ? '優雅健康比例' : '需適度減壓'}
                </div>
              </div>
            </div>

            {/* Retirement & Dream Simulator */}
            <div className="glass-panel section-panel" style={{ padding: '28px 22px', background: 'linear-gradient(135deg, #ffffff, var(--bg-soft-primary))' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '900', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-primary)' }}>
                <Sparkles size={22} /> 🏖️ 理想自由生活的複利與夢想試算
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px', alignItems: 'center' }}>
                <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '18px', border: '1.5px solid var(--border-primary)', boxShadow: 'var(--shadow-card)' }}>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>當前年齡 / 期望自由年齡</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: '900', marginTop: '4px', color: 'var(--text-main)' }}>
                    {currentAge} 歲 ➔ {basicInfo.targetRetireAge} 歲 (倒數 <span style={{ color: 'var(--color-primary)' }}>{yearsToRetire}</span> 年 ✨)
                  </div>

                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '14px' }}>自由人生所需總水庫 (4%法則估算)</div>
                  <div className="mono" style={{ fontSize: '1.45rem', fontWeight: '900', color: 'var(--text-main)' }}>
                    ${requiredRetireFundWan.toFixed(0)} 萬元
                  </div>

                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '14px' }}>預計 {basicInfo.targetRetireAge} 歲時你累積的總資產 (複利 6%)</div>
                  <div className="mono" style={{ fontSize: '1.45rem', fontWeight: '900', color: 'var(--color-primary)' }}>
                    ${futureNetWorthWan.toFixed(0)} 萬元
                  </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '22px', borderRadius: '18px', border: '2px solid var(--color-primary)', boxShadow: '0 10px 30px var(--border-primary)' }}>
                  <div style={{ fontSize: '0.92rem', color: 'var(--color-primary)', fontWeight: '900' }}>💖 理想生活進度真心評估：</div>
                  
                  {retireFundGapWan <= 0 ? (
                    <div style={{ marginTop: '12px', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <CheckCircle2 size={36} style={{ flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '900' }}>太美好了！你的夢想藍圖完全在軌道上！</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.45' }}>
                          照目前的步調，你可在 {basicInfo.targetRetireAge} 歲時享有每月 ${basicInfo.desiredRetireMonthlyExpense} 元的被動收入，優雅擁抱自由！
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ marginTop: '12px', color: 'var(--color-primary)', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <Sparkles size={34} color="var(--color-primary)" style={{ flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '900' }}>還差一點點！尚有 ${retireFundGapWan.toFixed(0)} 萬元的夢想距離</div>
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: '1.45' }}>
                          只要適度優化資產配置（如聰明買房房貸減壓、獨立育兒帳戶複利），或每月再多投入約 <span style={{ color: 'var(--color-primary)', fontWeight: '900' }}>${((retireFundGapWan * 10000) / (yearsToRetire * 12)).toFixed(0)} 元</span>，就能加速實現理想生活！
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Advisory Points highlighting Smart Home Buying & Child Account */}
            <div className="glass-panel section-panel" style={{ padding: '28px 22px' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '900', marginBottom: '16px', color: 'var(--text-main)' }}>
                🌟 給你的 3 大專屬理財調優策略（包含「聰明買房」與「育兒帳戶」）
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                <div style={{ backgroundColor: '#ffffff', padding: '18px', borderRadius: '16px', borderLeft: '5px solid var(--color-primary)', boxShadow: 'var(--shadow-card)' }}>
                  <div style={{ fontWeight: '900', fontSize: '0.96rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Key size={16} /> 1. 聰明買房與房貸輕鬆減壓
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: '1.5' }}>
                    精算最佳頭期款比例與銀行優質房貸轉貸方案，讓每月房貸輕鬆負擔，省下的利息轉為置產夢想基金。
                  </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '18px', borderRadius: '16px', borderLeft: '5px solid var(--color-primary)', boxShadow: 'var(--shadow-card)' }}>
                  <div style={{ fontWeight: '900', fontSize: '0.96rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <PiggyBank size={16} /> 2. 獨立「專屬育兒複利帳戶」
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: '1.5' }}>
                    從寶寶出生即設立獨立成長與教育專用戶頭，善用時間複利滾動，輕鬆給孩子充足的學習與愛。
                  </div>
                </div>

                <div style={{ backgroundColor: '#ffffff', padding: '18px', borderRadius: '16px', borderLeft: '5px solid var(--color-primary)', boxShadow: 'var(--shadow-card)' }}>
                  <div style={{ fontWeight: '900', fontSize: '0.96rem', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Coffee size={16} /> 3. 被動收入水龍頭與退休防護
                  </div>
                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: '1.5' }}>
                    將閒置資產配置於每月配息的優質 ETF 組合，確保家庭生活隨心，風險來臨時依然穩如泰山。
                  </div>
                </div>
              </div>

              {/* Responsive Advisory CTA Card */}
              <div className="cta-banner" style={{
                marginTop: '24px',
                padding: '24px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-hover))',
                color: '#ffffff',
                boxShadow: '0 12px 35px var(--border-primary)',
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div>
                  <div style={{ fontSize: '1.18rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Sparkles size={20} /> 免費預約「聰明買房 / 育兒帳戶 / 1對1靈感對談」 (價值 $3,000)
                  </div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.95, marginTop: '6px' }}>
                    由專業溫暖的理財顧問親自為你做頭期款試算、育兒戶頭複利規劃與房貸減壓。
                  </div>
                </div>

                <div className="cta-banner-buttons" style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
                  <button className="btn btn-secondary" style={{ color: 'var(--text-main)' }} onClick={() => window.print()}>
                    <Printer size={16} /> 保存報告
                  </button>
                  <button className="btn pulse-glow" style={{ backgroundColor: '#ffffff', color: 'var(--color-primary)', fontWeight: '900' }} onClick={() => setIsConsultModalOpen(true)}>
                    <Send size={18} /> 預約專屬諮詢
                  </button>
                </div>
              </div>

            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <button className="btn btn-secondary" onClick={() => setStep(2)}>
                <ArrowLeft size={18} /> 修改資產與目標
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer style={{ maxWidth: '1040px', margin: '36px auto 16px auto', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        ✨ 理想生活目標計算機 | 聰明買房 ‧ 育兒帳戶 ‧ 獻給追求質感與自由的你 ✨
      </footer>

      {/* Responsive Consultation Modal */}
      {isConsultModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(30, 41, 59, 0.65)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div className="glass-panel modal-container" style={{
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '32px 24px',
            position: 'relative',
            backgroundColor: '#ffffff',
            boxShadow: '0 24px 70px var(--border-primary)',
            border: '2px solid var(--border-primary)'
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
                fontSize: '1.3rem',
                cursor: 'pointer'
              }}
            >
              ✕
            </button>

            {!isSubmitted ? (
              <form onSubmit={handleConsultSubmit}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-primary)', marginBottom: '6px' }}>
                  <Sparkles size={18} color="var(--color-primary)" />
                  <span style={{ fontSize: '0.82rem', fontWeight: '800' }}>限定免費名額</span>
                </div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '900', marginBottom: '6px', color: 'var(--text-main)' }}>
                  預約 1對1 專屬理財靈感對談 ✨
                </h2>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                  請留下你的聯絡方式，顧問將依據你的家庭淨資產(${netWorthWan}萬)與自由缺口，為你量身訂製夢想清單。
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                      你的稱呼 / 姓名 *
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
                    <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
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
                    <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
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
                    <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
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

                  {/* Priority Advisory Topic Selector */}
                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                      最想優先了解的專屬主題 *
                    </label>
                    <select
                      className="input-field"
                      value={consultForm.consultTopic}
                      onChange={e => setConsultForm({ ...consultForm, consultTopic: e.target.value })}
                    >
                      <option value="🏡 聰明買房成家與房貸減壓">🏡 聰明買房成家與房貸輕鬆減壓</option>
                      <option value="👶 專屬育兒帳戶與教育基金">👶 專屬育兒帳戶與成長複利基金</option>
                      <option value="☕ 提早退休與被動收入水龍頭">☕ 提早退休與被動收入水龍頭</option>
                      <option value="🛡️ 家庭全方位資產與保險盤點">🛡️ 家庭全方位資產與保險盤點</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
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
                    <label style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                      你目前最想了解的細節 (選填)
                    </label>
                    <textarea
                      className="input-field"
                      rows={3}
                      placeholder="例如：想了解如何規劃首購頭期款與設立寶寶的育兒複利帳戶..."
                      value={consultForm.note}
                      onChange={e => setConsultForm({ ...consultForm, note: e.target.value })}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary pulse-glow" style={{ width: '100%', padding: '14px', fontSize: '1.05rem', fontWeight: '800', marginTop: '10px' }}>
                    <Send size={18} /> 確認送出靈感預約 ✨
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--bg-soft-primary)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto'
                }}>
                  <Sparkles size={36} color="var(--color-primary)" />
                </div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--text-main)' }}>
                  預約成功！✨
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginTop: '8px', lineHeight: '1.55' }}>
                  我們已收到你的理想生活報告與「{consultForm.consultTopic}」諮詢需求，理財顧問將在 24 小時內親自與你聯繫！
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
