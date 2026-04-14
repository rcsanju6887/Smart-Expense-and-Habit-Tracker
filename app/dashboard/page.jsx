'use client';
import { useState, useEffect } from 'react';

/* ─── localStorage helpers ─── */
const load  = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };
const save  = (k, v) => localStorage.setItem(k, JSON.stringify(v));
const uid   = ()     => Date.now().toString(36) + Math.random().toString(36).slice(2);
const today = ()     => new Date().toISOString().slice(0, 10);
const fmt   = (n)    => '৳' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2 });
const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const CATS = [
  { id:'food',      label:'Food',          icon:'🍔', color:'#00ddb5' },
  { id:'transport', label:'Transportation', icon:'🚌', color:'#4f8ef7' },
  { id:'education', label:'Education',      icon:'📚', color:'#b06ef3' },
  { id:'shopping',  label:'Shopping',       icon:'🛍️', color:'#f472b6' },
  { id:'entertainment', label:'Entertainment', icon:'🎮', color:'#f5a623' },
  { id:'others',    label:'Others',         icon:'📦', color:'#34d399' },
];

const NAV = [
  { id:'home',     label:'Dashboard', icon:'🏠' },
  { id:'expenses', label:'Expenses',  icon:'💸' },
  { id:'habits',   label:'Habits',    icon:'🧠' },
  { id:'reports',  label:'Reports',   icon:'📊' },
  { id:'alerts',   label:'Alerts',    icon:'🔔' },
  { id:'profile',  label:'Profile',   icon:'👤' },
];

/* ─── Seed demo data if empty ─── */
function seedData() {
  if (load('se_expenses', []).length) return;
  const now = new Date();
  const expenses = [];
  const catIds = CATS.map(c => c.id);
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now); d.setDate(d.getDate() - i);
    const date = d.toISOString().slice(0, 10);
    if (Math.random() > 0.35) {
      expenses.push({ id: uid(), date, amount: +(Math.random()*800+50).toFixed(2),
        category: catIds[Math.floor(Math.random()*catIds.length)], description: 'Sample expense' });
    }
  }
  save('se_expenses', expenses);
  const habits = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now); d.setDate(d.getDate() - i);
    habits.push({ id: uid(), date: d.toISOString().slice(0,10),
      study: +(Math.random()*6+1).toFixed(1), sleep: +(Math.random()*4+5).toFixed(1),
      exercise: +(Math.random()*60+10).toFixed(0) });
  }
  save('se_habits', habits);
}

/* ─── SVG Donut Chart ─── */
function DonutChart({ data, size = 160 }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (!total) return <div style={{textAlign:'center',color:'var(--text-muted)',padding:'40px 0',fontSize:13}}>No data yet</div>;
  let offset = 0;
  const R = 55, cx = size/2, cy = size/2;
  const circ = 2 * Math.PI * R;
  const slices = data.map(d => {
    const pct = d.value / total;
    const dash = circ * pct;
    const gap  = circ - dash;
    const s = { pct, dash, gap, rotation: offset * 360 };
    offset += pct;
    return { ...d, ...s };
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={18}/>
      {slices.map((s, i) => (
        <circle key={i} cx={cx} cy={cy} r={R} fill="none"
          stroke={s.color} strokeWidth={18}
          strokeDasharray={`${s.dash} ${s.gap}`}
          strokeDashoffset={circ * 0.25 * -1}
          transform={`rotate(${s.rotation - 90}, ${cx}, ${cy})`}
          style={{ transition: 'stroke-dasharray 0.6s ease' }}/>
      ))}
      <text x={cx} y={cy-6}  textAnchor="middle" fill="var(--text)" fontSize="13" fontWeight="700" fontFamily="Syne,sans-serif">Total</text>
      <text x={cx} y={cy+12} textAnchor="middle" fill="var(--accent-teal)" fontSize="11" fontFamily="DM Sans,sans-serif">{fmt(total)}</text>
    </svg>
  );
}

/* ─── SVG Bar Chart ─── */
function BarChart({ bars, height = 100 }) {
  if (!bars.length) return null;
  const max = Math.max(...bars.map(b => b.value), 1);
  const w = 100 / bars.length;
  return (
    <svg viewBox={`0 0 100 ${height}`} style={{ width:'100%', height }} preserveAspectRatio="none">
      {bars.map((b, i) => {
        const bh = (b.value / max) * (height - 18);
        const x  = i * w + w * 0.15;
        const bw = w * 0.7;
        return (
          <g key={i}>
            <rect x={x} y={height - bh - 16} width={bw} height={bh}
              rx="2" fill={b.color || 'url(#tg)'}
              style={{ transition: 'height 0.5s ease, y 0.5s ease' }} opacity="0.85"/>
            <text x={x + bw/2} y={height - 2} textAnchor="middle"
              fontSize="5.5" fill="var(--text-muted)" fontFamily="DM Sans,sans-serif">{b.label}</text>
          </g>
        );
      })}
      <defs>
        <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00ddb5"/>
          <stop offset="100%" stopColor="#4f8ef7"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─── Mini habit sparkline ─── */
function Sparkline({ points, color }) {
  if (!points.length) return null;
  const max = Math.max(...points, 1);
  const w = 100 / (points.length - 1 || 1);
  const pts = points.map((v, i) => `${i * w},${30 - (v / max) * 28}`).join(' ');
  return (
    <svg viewBox="0 0 100 30" style={{ width:'100%', height:36 }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      {points.map((v, i) => (
        <circle key={i} cx={i*w} cy={30-(v/max)*28} r="2.5" fill={color}/>
      ))}
    </svg>
  );
}

/* ════════════════════════════════════════════
   MAIN DASHBOARD COMPONENT
════════════════════════════════════════════ */
export default function DashboardPage() {
  const [dark,    setDark]    = useState(true);
  const [page,    setPage]    = useState('home');
  const [sidebar, setSidebar] = useState(true);
  const [user,    setUser]    = useState({ name:'User', email:'', monthlyBudget: 35000 });
  const [toast,   setToast]   = useState({ show:false, msg:'', type:'info' });

  /* Expense state */
  const [expenses,  setExpenses]  = useState([]);
  const [expForm,   setExpForm]   = useState({ date: today(), amount:'', category:'food', description:'' });
  const [editingExp, setEditingExp] = useState(null);
  const [expFilter,  setExpFilter] = useState('all');

  /* Habit state */
  const [habits,     setHabits]     = useState([]);
  const [habitForm,  setHabitForm]  = useState({ date: today(), study:'', sleep:'', exercise:'' });
  const [editingHabit, setEditingHabit] = useState(null);

  /* Profile state */
  const [profForm, setProfForm] = useState({ name:'', email:'', monthlyBudget:'', newPw:'', curPw:'' });

  /* Modal */
  const [modal, setModal] = useState(null); // { type: 'expense'|'habit', editing: obj|null }

  /* Load data on mount */
  useEffect(() => {
    const session = load('se_session', null);
    if (!session || !session.token) {
      window.location.href = '/login';
      return;
    }
    
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${session.token}` };
        const [uRes, eRes, hRes] = await Promise.all([
          fetch('http://localhost:5000/api/auth/me', { headers }),
          fetch('http://localhost:5000/api/expenses', { headers }),
          fetch('http://localhost:5000/api/habits', { headers }),
        ]);
        const uo = await uRes.json();
        const eo = await eRes.json();
        const ho = await hRes.json();
        
        if (uo.success) {
          setUser(uo.user);
          setProfForm({ name: uo.user.name, email: uo.user.email, monthlyBudget: uo.user.monthlyBudget, newPw:'', curPw:'' });
        } else {
          localStorage.removeItem('se_session');
          window.location.href = '/login';
        }
        
        if (eo.success) {
          setExpenses(eo.expenses.map(e => ({...e, id: e._id})));
        }
        if (ho.success) {
          setHabits(ho.habits.map(h => ({...h, id: h._id})));
        }
      } catch (err) {
        console.error('Failed to load data', err);
      }
    };
    fetchData();

    const savedTheme = localStorage.getItem('se_theme');
    if (savedTheme) setDark(savedTheme === 'dark');
  }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  };

  /* ── Computed stats ── */
  const thisMonth = new Date().toISOString().slice(0, 7);
  const monthExp  = expenses.filter(e => e.date.startsWith(thisMonth));
  const totalSpent = monthExp.reduce((s, e) => s + e.amount, 0);
  const remaining  = user.monthlyBudget - totalSpent;
  const savingsPct = user.monthlyBudget > 0 ? Math.max(0, ((remaining / user.monthlyBudget) * 100)).toFixed(1) : 0;

  /* Category breakdown */
  const catData = CATS.map(c => ({
    ...c,
    value: monthExp.filter(e => e.category === c.id).reduce((s, e) => s + e.amount, 0)
  })).filter(c => c.value > 0);

  /* Monthly bar data (last 6 months) */
  const monthBars = Array.from({ length: 6 }, (_, i) => {
    const d  = new Date(); d.setMonth(d.getMonth() - (5 - i));
    const ym = d.toISOString().slice(0, 7);
    const v  = expenses.filter(e => e.date.startsWith(ym)).reduce((s, e) => s + e.amount, 0);
    return { label: months[d.getMonth()], value: v, color: i === 5 ? '#00ddb5' : '#4f8ef740' };
  });

  /* Smart Alerts */
  const alerts = [];
  if (totalSpent > user.monthlyBudget * 0.9 && user.monthlyBudget > 0)
    alerts.push({ type:'danger', icon:'🚨', msg: `You've used ${((totalSpent/user.monthlyBudget)*100).toFixed(0)}% of your monthly budget!` });
  CATS.forEach(c => {
    const amt = monthExp.filter(e => e.category === c.id).reduce((s,e) => s+e.amount, 0);
    if (amt > user.monthlyBudget * 0.35 && user.monthlyBudget > 0)
      alerts.push({ type:'warning', icon:'⚠️', msg: `High ${c.label} spending: ${fmt(amt)} this month.` });
  });
  const last7Habits = habits.filter(h => {
    const d = new Date(h.date); const now = new Date();
    return (now - d) / 86400000 <= 7;
  });
  const avgStudy = last7Habits.length ? last7Habits.reduce((s,h) => s + h.study, 0) / last7Habits.length : 0;
  const avgSleep = last7Habits.length ? last7Habits.reduce((s,h) => s + h.sleep, 0) / last7Habits.length : 0;
  if (avgStudy < 2 && last7Habits.length >= 3)
    alerts.push({ type:'warning', icon:'📚', msg: `Low study time: avg ${avgStudy.toFixed(1)}h/day this week.` });
  if (avgSleep < 6 && last7Habits.length >= 3)
    alerts.push({ type:'danger', icon:'😴', msg: `Poor sleep: avg ${avgSleep.toFixed(1)}h/night. Aim for 7-8h.` });
  if (!alerts.length)
    alerts.push({ type:'success', icon:'✅', msg: 'All good! Your spending and habits look healthy.' });

  /* ── Expense CRUD ── */
  const saveExpense = async () => {
    if (!expForm.amount || isNaN(expForm.amount) || +expForm.amount <= 0)
      return showToast('Enter a valid amount.', 'error');
    if (!expForm.date) return showToast('Select a date.', 'error');
    
    const session = load('se_session', null);
    if (!session) return;
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` };
    const payload = { ...expForm, amount: +expForm.amount };

    try {
      if (editingExp) {
        const res = await fetch(`http://localhost:5000/api/expenses/${editingExp}`, { method: 'PUT', headers, body: JSON.stringify(payload) });
        const data = await res.json();
        if (data.success) {
          setExpenses(expenses.map(e => e.id === editingExp ? { ...data.expense, id: data.expense._id } : e));
          showToast('Expense updated! ✏️');
        } else {
          showToast(data.message || 'Error updating expense', 'error');
        }
      } else {
        const res = await fetch('http://localhost:5000/api/expenses', { method: 'POST', headers, body: JSON.stringify(payload) });
        const data = await res.json();
        if (data.success) {
          setExpenses([{ ...data.expense, id: data.expense._id }, ...expenses]);
          showToast('Expense added! 💸');
        } else {
          showToast(data.message || 'Error adding expense', 'error');
        }
      }
    } catch (err) {
      showToast('Connection error', 'error');
    }
    setExpForm({ date: today(), amount:'', category:'food', description:'' });
    setEditingExp(null); setModal(null);
  };
  const deleteExpense = async id => {
    const session = load('se_session', null);
    try {
      const res = await fetch(`http://localhost:5000/api/expenses/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${session.token}` } });
      const data = await res.json();
      if (data.success) {
        setExpenses(expenses.filter(e => e.id !== id));
        showToast('Expense deleted.', 'info');
      } else {
        showToast(data.message || 'Error deleting', 'error');
      }
    } catch (e) {
      showToast('Connection error', 'error');
    }
  };
  const startEditExp = e => {
    setExpForm({ date: e.date, amount: e.amount, category: e.category, description: e.description || '' });
    setEditingExp(e.id); setModal('expense');
  };

  /* ── Habit CRUD ── */
  const saveHabit = async () => {
    const { date, study, sleep, exercise } = habitForm;
    if (!date || !study || !sleep || !exercise) return showToast('Fill all habit fields.', 'error');
    
    const session = load('se_session', null);
    if (!session) return;
    const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` };
    const payload = { date, study: +study, sleep: +sleep, exercise: +exercise };

    try {
      if (editingHabit) {
        const res = await fetch(`http://localhost:5000/api/habits/${editingHabit}`, { method: 'PUT', headers, body: JSON.stringify(payload) });
        const data = await res.json();
        if (data.success) {
          setHabits(habits.map(h => h.id === editingHabit ? { ...data.habit, id: data.habit._id } : h));
          showToast('Habit updated! ✏️');
        } else {
          showToast(data.message || 'Error updating habit', 'error');
        }
      } else {
        const res = await fetch('http://localhost:5000/api/habits', { method: 'POST', headers, body: JSON.stringify(payload) });
        const data = await res.json();
        if (data.success) {
          setHabits([{ ...data.habit, id: data.habit._id }, ...habits]);
          showToast('Habits logged! 🧠');
        } else {
          showToast(data.message || 'Error logging habit', 'error');
        }
      }
    } catch (err) {
      showToast('Connection error', 'error');
    }
    setHabitForm({ date: today(), study:'', sleep:'', exercise:'' });
    setEditingHabit(null); setModal(null);
  };
  const deleteHabit = async id => {
    const session = load('se_session', null);
    try {
      const res = await fetch(`http://localhost:5000/api/habits/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${session.token}` } });
      const data = await res.json();
      if (data.success) {
        setHabits(habits.filter(h => h.id !== id));
        showToast('Habit entry deleted.', 'info');
      } else {
        showToast(data.message || 'Error deleting', 'error');
      }
    } catch (e) {
      showToast('Connection error', 'error');
    }
  };
  const startEditHabit = h => {
    setHabitForm({ date: h.date, study: h.study, sleep: h.sleep, exercise: h.exercise });
    setEditingHabit(h.id); setModal('habit');
  };

  /* ── Profile save ── */
  const saveProfile = async () => {
    if (!profForm.name) return showToast('Name is required.', 'error');
    
    const session = load('se_session', null);
    if (!session) return;
    
    try {
      const res = await fetch('http://localhost:5000/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${session.token}` },
        body: JSON.stringify({ name: profForm.name, email: profForm.email, monthlyBudget: +profForm.monthlyBudget || 0 })
      });
      const data = await res.json();
      if (data.success) {
        setUser(data.user);
        // Also update local storage session name just in case
        localStorage.setItem('se_session', JSON.stringify({ ...session, name: data.user.name, email: data.user.email }));
        showToast('Profile saved! 👤');
      } else {
        showToast(data.message || 'Failed to update profile', 'error');
      }
    } catch (err) {
      showToast('Connection error', 'error');
    }
  };

  /* ── Filtered expenses ── */
  const filteredExp = expFilter === 'all' ? expenses
    : expenses.filter(e => e.date.startsWith(expFilter === 'month' ? thisMonth : new Date().toISOString().slice(0,10)));

  const toggleTheme = () => {
    const nd = !dark; setDark(nd);
    localStorage.setItem('se_theme', nd ? 'dark' : 'light');
  };

  const catOf = id => CATS.find(c => c.id === id) || CATS[5];

  /* ── Habit sparkline data ── */
  const last14Habits = [...habits].sort((a,b) => a.date.localeCompare(b.date)).slice(-14);
  const studyPoints   = last14Habits.map(h => h.study);
  const sleepPoints   = last14Habits.map(h => h.sleep);
  const exercisePoints= last14Habits.map(h => h.exercise);

  /* Avg habits */
  const avgStudyAll   = habits.length ? (habits.reduce((s,h)=>s+h.study,0)/habits.length).toFixed(1) : 0;
  const avgSleepAll   = habits.length ? (habits.reduce((s,h)=>s+h.sleep,0)/habits.length).toFixed(1) : 0;
  const avgExerciseAll= habits.length ? (habits.reduce((s,h)=>s+h.exercise,0)/habits.length).toFixed(0) : 0;

  /* ════ RENDER ════ */
  return (
    <div className={dark ? 'db-root' : 'db-root db-light'}>
      <style>{CSS}</style>

      {/* ── SIDEBAR ── */}
      <aside className={`sidebar${sidebar ? '' : ' collapsed'}`}>
        <div className="sb-brand">
          <div className="sb-icon">💹</div>
          {sidebar && <span className="sb-title">SE-HT</span>}
        </div>
        <nav className="sb-nav">
          {NAV.map(n => (
            <button key={n.id}
              className={`sb-btn${page === n.id ? ' sb-active' : ''}`}
              onClick={() => setPage(n.id)}
              title={n.label}>
              <span className="sb-nav-icon">{n.icon}</span>
              {sidebar && <span>{n.label}</span>}
              {n.id === 'alerts' && alerts.filter(a=>a.type!=='success').length > 0 && (
                <span className="sb-badge">{alerts.filter(a=>a.type!=='success').length}</span>
              )}
            </button>
          ))}
        </nav>
        <button className="sb-btn sb-logout" onClick={() => {
          localStorage.removeItem('se_session');
          window.location.href = '/login';
        }} title="Logout">
          <span className="sb-nav-icon">🚪</span>
          {sidebar && <span>Logout</span>}
        </button>
      </aside>

      {/* ── MAIN ── */}
      <div className="db-main">

        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-btn" onClick={() => setSidebar(s => !s)}>☰</button>
            <div className="topbar-page-name">
              {NAV.find(n=>n.id===page)?.icon} {NAV.find(n=>n.id===page)?.label}
            </div>
          </div>
          <div className="topbar-right">
            <button className="icon-btn" onClick={toggleTheme}>{dark ? '🌙' : '☀️'}</button>
            <div className="avatar-btn" onClick={() => setPage('profile')}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="topbar-user">
              <span className="topbar-name">{user.name}</span>
              <span className="topbar-sub">{user.email || 'user'}</span>
            </div>
          </div>
        </header>

        {/* ── Content ── */}
        <main className="db-content">

          {/* ══════════ HOME ══════════ */}
          {page === 'home' && (
            <div className="fade-in">
              <div className="page-header">
                <h2 className="page-title">Welcome back, <span className="grad-text">{user.name.split(' ')[0]}</span> 👋</h2>
                <p className="page-sub">Here's your financial & habit overview for {months[new Date().getMonth()]} {new Date().getFullYear()}</p>
              </div>

              {/* Stat cards */}
              <div className="stat-grid">
                {[
                  { label:'Monthly Budget', val: fmt(user.monthlyBudget), icon:'🏦', color:'#00ddb5', sub:`Set budget` },
                  { label:'Total Spent',    val: fmt(totalSpent),         icon:'💸', color:'#f472b6', sub:`This month` },
                  { label:'Remaining',      val: fmt(Math.max(0,remaining)), icon:'💰', color:'#4f8ef7', sub:`${savingsPct}% left` },
                  { label:'Transactions',  val: monthExp.length,          icon:'📋', color:'#b06ef3', sub:`This month` },
                ].map((s,i) => (
                  <div key={i} className="stat-card" style={{'--accent': s.color}}>
                    <div className="stat-icon">{s.icon}</div>
                    <div>
                      <div className="stat-val">{s.val}</div>
                      <div className="stat-label">{s.label}</div>
                      <div className="stat-sub">{s.sub}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick actions */}
              <div className="section-title">⚡ Quick Actions</div>
              <div className="quick-actions">
                {[
                  { label:'+ Add Expense',  color:'linear-gradient(135deg,#00ddb5,#4f8ef7)', action:()=>{setExpForm({date:today(),amount:'',category:'food',description:''});setEditingExp(null);setModal('expense');} },
                  { label:'📋 Log Habit',    color:'linear-gradient(135deg,#b06ef3,#f472b6)', action:()=>{setHabitForm({date:today(),study:'',sleep:'',exercise:''});setEditingHabit(null);setModal('habit');} },
                  { label:'📊 View Reports', color:'linear-gradient(135deg,#f5a623,#f472b6)', action:()=>setPage('reports') },
                  { label:'🔔 View Alerts',  color:'linear-gradient(135deg,#4f8ef7,#b06ef3)', action:()=>setPage('alerts') },
                ].map((q,i) => (
                  <button key={i} className="quick-btn" style={{background: q.color}} onClick={q.action}>
                    {q.label}
                  </button>
                ))}
              </div>

              {/* Charts row */}
              <div className="charts-row">
                {/* Monthly trend */}
                <div className="card">
                  <div className="card-head">📈 Monthly Spending Trend</div>
                  <BarChart bars={monthBars} height={110}/>
                </div>

                {/* Category donut */}
                <div className="card">
                  <div className="card-head">🥧 This Month by Category</div>
                  <div style={{display:'flex',gap:16,alignItems:'center',flexWrap:'wrap'}}>
                    <DonutChart data={catData}/>
                    <div style={{flex:1,minWidth:100}}>
                      {catData.map(c => (
                        <div key={c.id} className="legend-row">
                          <span className="legend-dot" style={{background:c.color}}/>
                          <span className="legend-label">{c.icon} {c.label}</span>
                          <span className="legend-val">{fmt(c.value)}</span>
                        </div>
                      ))}
                      {!catData.length && <p style={{fontSize:12,color:'var(--text-muted)'}}>No expenses yet</p>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent expenses */}
              <div className="card" style={{marginTop:18}}>
                <div className="card-head" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span>🕐 Recent Expenses</span>
                  <button className="link-btn" onClick={()=>setPage('expenses')}>View All →</button>
                </div>
                <div className="table-wrap">
                  <table className="data-table">
                    <thead><tr><th>Date</th><th>Category</th><th>Description</th><th>Amount</th></tr></thead>
                    <tbody>
                      {expenses.slice(0,5).map(e => {
                        const c = catOf(e.category);
                        return (
                          <tr key={e.id}>
                            <td>{e.date}</td>
                            <td><span className="cat-badge" style={{background:c.color+'22',color:c.color,border:'1px solid '+c.color+'55',padding:'3px 10px',borderRadius:20,fontSize:12,fontWeight:600}}>{c.icon} {c.label}</span></td>
                            <td style={{color:'var(--text-muted)',fontSize:13}}>{e.description||'—'}</td>
                            <td className="amount-cell">{fmt(e.amount)}</td>
                          </tr>
                        );
                      })}
                      {!expenses.length && <tr><td colSpan={4} style={{textAlign:'center',color:'var(--text-muted)',padding:24}}>No expenses yet</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Alerts preview */}
              <div className="card" style={{marginTop:18}}>
                <div className="card-head">🔔 Smart Alerts</div>
                {alerts.slice(0,3).map((a,i) => (
                  <div key={i} className={`alert-row alert-${a.type}`}>
                    <span>{a.icon}</span><span>{a.msg}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════ EXPENSES ══════════ */}
          {page === 'expenses' && (
            <div className="fade-in">
              <div className="page-header" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:12}}>
                <div>
                  <h2 className="page-title">💸 Expense Management</h2>
                  <p className="page-sub">Track, edit and delete your daily expenses</p>
                </div>
                <button className="primary-btn" onClick={()=>{setExpForm({date:today(),amount:'',category:'food',description:''});setEditingExp(null);setModal('expense');}}>
                  + Add Expense
                </button>
              </div>

              {/* Filter */}
              <div className="filter-row">
                {[['all','All Time'],['month','This Month'],['today','Today']].map(([v,l]) => (
                  <button key={v} className={`filter-btn${expFilter===v?' filter-active':''}`} onClick={()=>setExpFilter(v)}>{l}</button>
                ))}
                <span style={{marginLeft:'auto',fontSize:13,color:'var(--text-muted)'}}>{filteredExp.length} records</span>
              </div>

              {/* Summary mini cards */}
              <div className="mini-stats">
                {CATS.map(c => {
                  const total = filteredExp.filter(e=>e.category===c.id).reduce((s,e)=>s+e.amount,0);
                  return total > 0 ? (
                    <div key={c.id} className="mini-card" style={{border:'1px solid '+c.color+'44',background:c.color+'14'}}>
                      <span>{c.icon}</span>
                      <div>
                        <div style={{fontSize:13,fontWeight:600,color:'var(--text)'}}>{fmt(total)}</div>
                        <div style={{fontSize:11,color:'var(--text-muted)'}}>{c.label}</div>
                      </div>
                    </div>
                  ) : null;
                })}
              </div>

              <div className="card">
                <div className="table-wrap">
                  <table className="data-table">
                    <thead><tr><th>Date</th><th>Category</th><th>Description</th><th>Amount</th><th>Actions</th></tr></thead>
                    <tbody>
                      {filteredExp.map(e => {
                        const c = catOf(e.category);
                        return (
                          <tr key={e.id}>
                            <td>{e.date}</td>
                            <td><span className="cat-badge" style={{background:c.color+'22',color:c.color,border:'1px solid '+c.color+'55',padding:'3px 10px',borderRadius:20,fontSize:12,fontWeight:600}}>{c.icon} {c.label}</span></td>
                            <td style={{color:'var(--text-muted)',fontSize:13}}>{e.description||'—'}</td>
                            <td className="amount-cell">{fmt(e.amount)}</td>
                            <td>
                              <div className="action-btns">
                                <button className="act-btn act-edit" onClick={()=>startEditExp(e)}>✏️</button>
                                <button className="act-btn act-del"  onClick={()=>deleteExpense(e.id)}>🗑️</button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {!filteredExp.length && <tr><td colSpan={5} style={{textAlign:'center',color:'var(--text-muted)',padding:28}}>No expenses found</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══════════ HABITS ══════════ */}
          {page === 'habits' && (
            <div className="fade-in">
              <div className="page-header" style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',flexWrap:'wrap',gap:12}}>
                <div>
                  <h2 className="page-title">🧠 Habit Tracker</h2>
                  <p className="page-sub">Monitor your study, sleep, and exercise daily</p>
                </div>
                <button className="primary-btn" style={{background:'linear-gradient(135deg,#b06ef3,#f472b6)'}}
                  onClick={()=>{setHabitForm({date:today(),study:'',sleep:'',exercise:''});setEditingHabit(null);setModal('habit');}}>
                  + Log Today
                </button>
              </div>

              {/* Avg cards */}
              <div className="stat-grid">
                {[
                  { label:'Avg Study',    val:`${avgStudyAll}h`,  icon:'📚', color:'#b06ef3' },
                  { label:'Avg Sleep',    val:`${avgSleepAll}h`,  icon:'😴', color:'#4f8ef7' },
                  { label:'Avg Exercise', val:`${avgExerciseAll}min`, icon:'🏃', color:'#00ddb5' },
                  { label:'Days Logged',  val: habits.length,     icon:'📅', color:'#f5a623' },
                ].map((s,i) => (
                  <div key={i} className="stat-card" style={{'--accent': s.color}}>
                    <div className="stat-icon">{s.icon}</div>
                    <div>
                      <div className="stat-val">{s.val}</div>
                      <div className="stat-label">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sparklines */}
              <div className="charts-row">
                {[
                  { label:'📚 Study Hours (last 14 days)',    points: studyPoints,    color:'#b06ef3' },
                  { label:'😴 Sleep Hours (last 14 days)',    points: sleepPoints,    color:'#4f8ef7' },
                  { label:'🏃 Exercise (min, last 14 days)',  points: exercisePoints, color:'#00ddb5' },
                ].map((s,i) => (
                  <div key={i} className="card spark-card">
                    <div className="card-head">{s.label}</div>
                    <Sparkline points={s.points} color={s.color}/>
                    {!s.points.length && <p style={{fontSize:12,color:'var(--text-muted)',textAlign:'center'}}>No data yet</p>}
                  </div>
                ))}
              </div>

              {/* Habit log table */}
              <div className="card" style={{marginTop:18}}>
                <div className="card-head">📋 Habit Log</div>
                <div className="table-wrap">
                  <table className="data-table">
                    <thead><tr><th>Date</th><th>📚 Study (h)</th><th>😴 Sleep (h)</th><th>🏃 Exercise (min)</th><th>Actions</th></tr></thead>
                    <tbody>
                      {[...habits].sort((a,b)=>b.date.localeCompare(a.date)).map(h => (
                        <tr key={h.id}>
                          <td>{h.date}</td>
                          <td><span className="habit-pill" style={{background:'rgba(176,110,243,0.15)',color:'#b06ef3'}}>{h.study}h</span></td>
                          <td><span className="habit-pill" style={{background:'rgba(79,142,247,0.15)',color:'#4f8ef7'}}>{h.sleep}h</span></td>
                          <td><span className="habit-pill" style={{background:'rgba(0,221,181,0.15)',color:'#00ddb5'}}>{h.exercise}m</span></td>
                          <td>
                            <div className="action-btns">
                              <button className="act-btn act-edit" onClick={()=>startEditHabit(h)}>✏️</button>
                              <button className="act-btn act-del"  onClick={()=>deleteHabit(h.id)}>🗑️</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {!habits.length && <tr><td colSpan={5} style={{textAlign:'center',color:'var(--text-muted)',padding:28}}>No habits logged yet</td></tr>}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══════════ REPORTS ══════════ */}
          {page === 'reports' && (
            <div className="fade-in">
              <div className="page-header">
                <h2 className="page-title">📊 Reports & Analytics</h2>
                <p className="page-sub">Visual insights into your spending and habits</p>
              </div>

              {/* Monthly summary */}
              <div className="stat-grid">
                {[
                  { label:'This Month Spent',  val: fmt(totalSpent),           icon:'💸', color:'#f472b6' },
                  { label:'Budget Remaining',   val: fmt(Math.max(0,remaining)), icon:'💰', color:'#00ddb5' },
                  { label:'Savings Rate',       val: `${savingsPct}%`,          icon:'📈', color:'#4f8ef7' },
                  { label:'Total All Time',     val: fmt(expenses.reduce((s,e)=>s+e.amount,0)), icon:'🏦', color:'#b06ef3' },
                ].map((s,i) => (
                  <div key={i} className="stat-card" style={{'--accent': s.color}}>
                    <div className="stat-icon">{s.icon}</div>
                    <div>
                      <div className="stat-val">{s.val}</div>
                      <div className="stat-label">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="charts-row" style={{marginTop:18}}>
                {/* Big bar chart */}
                <div className="card" style={{flex:2}}>
                  <div className="card-head">📊 6-Month Spending Trend</div>
                  <BarChart bars={monthBars} height={140}/>
                  <div style={{display:'flex',justifyContent:'space-between',marginTop:8}}>
                    {monthBars.map((b,i) => (
                      <div key={i} style={{textAlign:'center',flex:1}}>
                        <div style={{fontSize:11,fontWeight:600,color: i===5?'#00ddb5':'var(--text-muted)'}}>{fmt(b.value).replace('৳','')}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Big donut */}
                <div className="card" style={{flex:1}}>
                  <div className="card-head">🥧 Category Breakdown</div>
                  <div style={{display:'flex',flexDirection:'column',alignItems:'center',gap:12}}>
                    <DonutChart data={catData} size={180}/>
                    {catData.map(c => (
                      <div key={c.id} className="legend-row" style={{width:'100%'}}>
                        <span className="legend-dot" style={{background:c.color}}/>
                        <span className="legend-label">{c.icon} {c.label}</span>
                        <span className="legend-val">{fmt(c.value)}</span>
                        <span style={{fontSize:11,color:'var(--text-muted)',marginLeft:4}}>
                          ({((c.value/Math.max(totalSpent,1))*100).toFixed(0)}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Habit report */}
              <div className="card" style={{marginTop:18}}>
                <div className="card-head">🧠 Habit Trend (Last 14 Days)</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:16}}>
                  {[
                    { label:'📚 Study Hours',   points: studyPoints,    color:'#b06ef3', unit:'h' },
                    { label:'😴 Sleep Hours',   points: sleepPoints,    color:'#4f8ef7', unit:'h' },
                    { label:'🏃 Exercise (min)',points: exercisePoints,  color:'#00ddb5', unit:'m' },
                  ].map((s,i) => (
                    <div key={i}>
                      <div style={{fontSize:13,fontWeight:600,marginBottom:6,color:'var(--text-muted)'}}>{s.label}</div>
                      <Sparkline points={s.points} color={s.color}/>
                      <div style={{fontSize:12,color:'var(--text-muted)',marginTop:4}}>
                        Avg: <span style={{color:s.color,fontWeight:700}}>
                          {s.points.length ? (s.points.reduce((a,b)=>a+b,0)/s.points.length).toFixed(1) : 0}{s.unit}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══════════ ALERTS ══════════ */}
          {page === 'alerts' && (
            <div className="fade-in">
              <div className="page-header">
                <h2 className="page-title">🔔 Smart Alerts</h2>
                <p className="page-sub">Rule-based alerts based on your spending and habits</p>
              </div>

              <div style={{display:'flex',flexDirection:'column',gap:12}}>
                {alerts.map((a,i) => (
                  <div key={i} className={`alert-card alert-card-${a.type}`}>
                    <div className="alert-card-icon">{a.icon}</div>
                    <div>
                      <div className="alert-card-title">
                        {a.type==='danger'?'⛔ Critical Alert':a.type==='warning'?'⚠️ Warning':'✅ All Good'}
                      </div>
                      <div className="alert-card-msg">{a.msg}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* How alerts work */}
              <div className="card" style={{marginTop:24}}>
                <div className="card-head">🤖 How Smart Alerts Work</div>
                {[
                  ['🚨','Budget Exceeded 90%','Triggers when you spend more than 90% of your monthly budget'],
                  ['⚠️','Category Overspend','Triggers when a single category exceeds 35% of your budget'],
                  ['📚','Low Study Alert','Triggers when average study time drops below 2h/day'],
                  ['😴','Poor Sleep Alert','Triggers when average sleep drops below 6h/night'],
                ].map(([icon,title,desc],i) => (
                  <div key={i} className="how-row">
                    <span style={{fontSize:22}}>{icon}</span>
                    <div>
                      <div style={{fontWeight:600,fontSize:14,color:'var(--text)'}}>{title}</div>
                      <div style={{fontSize:12,color:'var(--text-muted)',marginTop:2}}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ══════════ PROFILE ══════════ */}
          {page === 'profile' && (
            <div className="fade-in">
              <div className="page-header">
                <h2 className="page-title">👤 Profile & Settings</h2>
                <p className="page-sub">Manage your personal info and preferences</p>
              </div>

              <div className="profile-grid">
                {/* Profile card */}
                <div className="card" style={{flex:1}}>
                  <div className="card-head">Personal Information</div>
                  <div className="profile-avatar">{(profForm.name||'U').charAt(0).toUpperCase()}</div>

                  <div className="form-group">
                    <label className="form-label">Full Name / Username</label>
                    <input className="form-input" type="text" value={profForm.name}
                      onChange={e=>setProfForm(f=>({...f,name:e.target.value}))} placeholder="Your name"/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input className="form-input" type="email" value={profForm.email}
                      onChange={e=>setProfForm(f=>({...f,email:e.target.value}))} placeholder="you@example.com"/>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Monthly Budget (৳)</label>
                    <input className="form-input" type="number" value={profForm.monthlyBudget}
                      onChange={e=>setProfForm(f=>({...f,monthlyBudget:e.target.value}))} placeholder="5000"/>
                  </div>
                  <button className="primary-btn" style={{width:'100%',marginTop:8}} onClick={saveProfile}>
                    Save Profile
                  </button>
                </div>

                {/* Stats summary */}
                <div style={{flex:1,display:'flex',flexDirection:'column',gap:14}}>
                  <div className="card">
                    <div className="card-head">📊 Your Stats</div>
                    {[
                      ['Total Expenses Added', expenses.length,'💸'],
                      ['Total Habit Logs', habits.length,'🧠'],
                      ['This Month Spent', fmt(totalSpent),'💰'],
                      ['Budget Usage', `${Math.min(100,((totalSpent/Math.max(user.monthlyBudget,1))*100)).toFixed(0)}%`,'📈'],
                    ].map(([l,v,ic],i) => (
                      <div key={i} className="how-row" style={{borderBottom:'1px solid var(--border)',paddingBottom:10,marginBottom:2}}>
                        <span style={{fontSize:20}}>{ic}</span>
                        <div style={{display:'flex',justifyContent:'space-between',flex:1,alignItems:'center'}}>
                          <span style={{fontSize:13,color:'var(--text-muted)'}}>{l}</span>
                          <span style={{fontSize:15,fontWeight:700,color:'var(--accent-teal)'}}>{v}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="card">
                    <div className="card-head">🔐 Security</div>
                    <div style={{fontSize:13,color:'var(--text-muted)',marginBottom:16,lineHeight:1.6}}>
                      To change your password, contact your administrator or update it through the backend API.
                    </div>
                    <button className="danger-btn" onClick={()=>{
                      if(window.confirm('Log out?')){localStorage.removeItem('se_session');window.location.href='/login';}
                    }}>🚪 Logout</button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ══════════ MODALS ══════════ */}
      {modal && (
        <div className="modal-overlay" onClick={e=>{ if(e.target.className==='modal-overlay'){setModal(null);setEditingExp(null);setEditingHabit(null);} }}>
          <div className="modal-box">

            {/* Expense modal */}
            {modal === 'expense' && (
              <>
                <div className="modal-head">
                  <span>{editingExp ? '✏️ Edit Expense' : '💸 Add Expense'}</span>
                  <button className="modal-close" onClick={()=>{setModal(null);setEditingExp(null);}}>✕</button>
                </div>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input className="form-input" type="date" value={expForm.date}
                    onChange={e=>setExpForm(f=>({...f,date:e.target.value}))}/>
                </div>
                <div className="form-group">
                  <label className="form-label">Amount (৳)</label>
                  <input className="form-input" type="number" placeholder="0.00" value={expForm.amount}
                    onChange={e=>setExpForm(f=>({...f,amount:e.target.value}))}/>
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-input" value={expForm.category}
                    onChange={e=>setExpForm(f=>({...f,category:e.target.value}))}>
                    {CATS.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Description (optional)</label>
                  <input className="form-input" type="text" placeholder="What was this for?" value={expForm.description}
                    onChange={e=>setExpForm(f=>({...f,description:e.target.value}))}/>
                </div>
                <div className="modal-footer">
                  <button className="ghost-btn" onClick={()=>{setModal(null);setEditingExp(null);}}>Cancel</button>
                  <button className="primary-btn" onClick={saveExpense}>{editingExp?'Update':'Add Expense'}</button>
                </div>
              </>
            )}

            {/* Habit modal */}
            {modal === 'habit' && (
              <>
                <div className="modal-head">
                  <span>{editingHabit ? '✏️ Edit Habit Log' : '🧠 Log Habits'}</span>
                  <button className="modal-close" onClick={()=>{setModal(null);setEditingHabit(null);}}>✕</button>
                </div>
                <div className="form-group">
                  <label className="form-label">Date</label>
                  <input className="form-input" type="date" value={habitForm.date}
                    onChange={e=>setHabitForm(f=>({...f,date:e.target.value}))}/>
                </div>
                <div className="form-group">
                  <label className="form-label">📚 Study Hours</label>
                  <input className="form-input" type="number" step="0.5" min="0" max="24" placeholder="e.g. 3.5"
                    value={habitForm.study} onChange={e=>setHabitForm(f=>({...f,study:e.target.value}))}/>
                </div>
                <div className="form-group">
                  <label className="form-label">😴 Sleep Hours</label>
                  <input className="form-input" type="number" step="0.5" min="0" max="24" placeholder="e.g. 7"
                    value={habitForm.sleep} onChange={e=>setHabitForm(f=>({...f,sleep:e.target.value}))}/>
                </div>
                <div className="form-group">
                  <label className="form-label">🏃 Exercise (minutes)</label>
                  <input className="form-input" type="number" step="5" min="0" placeholder="e.g. 30"
                    value={habitForm.exercise} onChange={e=>setHabitForm(f=>({...f,exercise:e.target.value}))}/>
                </div>
                <div className="modal-footer">
                  <button className="ghost-btn" onClick={()=>{setModal(null);setEditingHabit(null);}}>Cancel</button>
                  <button className="primary-btn" style={{background:'linear-gradient(135deg,#b06ef3,#f472b6)'}}
                    onClick={saveHabit}>{editingHabit?'Update':'Log Habits'}</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ══════════ TOAST ══════════ */}
      <div className={`toast${toast.show?' toast-show':''} toast-${toast.type}`}>{toast.msg}</div>
    </div>
  );
}

/* ════════════════════════════════════════════
   CSS  (same design language as LoginPage)
════════════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  .db-root {
    --bg:#080b14; --surface:rgba(255,255,255,0.04); --surface-2:rgba(255,255,255,0.08);
    --border:rgba(255,255,255,0.09); --text:#eef0f8; --text-muted:rgba(238,240,248,0.45);
    --accent-teal:#00ddb5; --accent-purple:#b06ef3; --accent-blue:#4f8ef7;
    --card-bg:rgba(12,16,28,0.85); --input-bg:rgba(255,255,255,0.055);
    --input-border:rgba(255,255,255,0.11); --sb-w:220px;
    font-family:'DM Sans',sans-serif; background:var(--bg); color:var(--text);
    min-height:100vh; display:flex; transition:background .4s,color .4s;
  }
  .db-light {
    --bg:#eef2fc; --surface:rgba(0,0,0,0.03); --surface-2:rgba(0,0,0,0.06);
    --border:rgba(0,0,0,0.09); --text:#0d1020; --text-muted:rgba(13,16,32,0.5);
    --card-bg:rgba(255,255,255,0.92); --input-bg:rgba(0,0,0,0.04);
    --input-border:rgba(0,0,0,0.12);
  }
  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }

  /* SIDEBAR */
  .sidebar {
    width:var(--sb-w); min-height:100vh; background:var(--card-bg);
    border-right:1px solid var(--border); display:flex; flex-direction:column;
    padding:18px 12px; position:sticky; top:0; height:100vh;
    backdrop-filter:blur(20px); transition:width .3s; overflow:hidden; flex-shrink:0;
  }
  .sidebar.collapsed { width:64px; }
  .sb-brand {
    display:flex; align-items:center; gap:10px; padding:8px 6px 22px;
    border-bottom:1px solid var(--border); margin-bottom:12px;
  }
  .sb-icon {
    width:38px; height:38px; border-radius:11px; flex-shrink:0;
    background:linear-gradient(135deg,#00ddb5,#b06ef3);
    display:flex; align-items:center; justify-content:center; font-size:20px;
    box-shadow:0 0 18px rgba(0,221,181,.3);
  }
  .sb-title {
    font-family:'Syne',sans-serif; font-weight:800; font-size:17px;
    background:linear-gradient(135deg,#00ddb5,#b06ef3);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
    white-space:nowrap;
  }
  .sb-nav { flex:1; display:flex; flex-direction:column; gap:4px; }
  .sb-btn {
    display:flex; align-items:center; gap:10px; padding:11px 10px;
    border-radius:12px; border:none; background:transparent; cursor:pointer;
    font-family:'DM Sans',sans-serif; font-size:13.5px; font-weight:500;
    color:var(--text-muted); transition:all .25s; white-space:nowrap;
    position:relative; text-align:left;
  }
  .sb-btn:hover { background:var(--surface-2); color:var(--text); }
  .sb-active { background:linear-gradient(135deg,rgba(0,221,181,.14),rgba(79,142,247,.14)) !important;
    color:var(--accent-teal) !important; }
  .sb-nav-icon { font-size:18px; flex-shrink:0; width:22px; text-align:center; }
  .sb-badge {
    background:#f472b6; color:#fff; font-size:10px; font-weight:700;
    padding:2px 6px; border-radius:20px; margin-left:auto;
  }
  .sb-logout { margin-top:auto; color:rgba(244,114,182,0.7) !important; }
  .sb-logout:hover { background:rgba(244,114,182,.1) !important; color:#f472b6 !important; }

  /* MAIN */
  .db-main { flex:1; display:flex; flex-direction:column; min-width:0; }

  /* TOPBAR */
  .topbar {
    position:sticky; top:0; z-index:50; height:62px;
    background:var(--card-bg); border-bottom:1px solid var(--border);
    backdrop-filter:blur(20px);
    display:flex; align-items:center; justify-content:space-between; padding:0 22px;
  }
  .topbar-left { display:flex; align-items:center; gap:14px; }
  .topbar-right { display:flex; align-items:center; gap:12px; }
  .topbar-page-name { font-family:'Syne',sans-serif; font-weight:700; font-size:16px; }
  .icon-btn {
    width:38px; height:38px; border-radius:10px; border:1px solid var(--border);
    background:var(--surface); cursor:pointer; font-size:17px; color:var(--text);
    display:flex; align-items:center; justify-content:center; transition:all .25s;
  }
  .icon-btn:hover { background:var(--surface-2); border-color:var(--accent-teal); }
  .avatar-btn {
    width:36px; height:36px; border-radius:50%; cursor:pointer;
    background:linear-gradient(135deg,#00ddb5,#b06ef3);
    display:flex; align-items:center; justify-content:center;
    font-weight:800; font-family:'Syne',sans-serif; font-size:16px; color:#fff;
    box-shadow:0 0 14px rgba(0,221,181,.3);
  }
  .topbar-name { display:block; font-size:13.5px; font-weight:600; color:var(--text); }
  .topbar-sub  { display:block; font-size:11px; color:var(--text-muted); }

  /* CONTENT */
  .db-content { padding:24px; flex:1; overflow-y:auto; }
  .fade-in { animation:fadeIn .35s ease; }
  @keyframes fadeIn { from{opacity:0;transform:translateY(8px);} to{opacity:1;transform:translateY(0);} }

  .page-header { margin-bottom:22px; }
  .page-title { font-family:'Syne',sans-serif; font-size:24px; font-weight:800; margin-bottom:4px; }
  .page-sub  { font-size:13px; color:var(--text-muted); }
  .grad-text { background:linear-gradient(135deg,#00ddb5,#b06ef3);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text; }
  .section-title { font-family:'Syne',sans-serif; font-weight:700; font-size:15px;
    color:var(--text-muted); margin:18px 0 10px; }

  /* STAT CARDS */
  .stat-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(180px,1fr)); gap:14px; margin-bottom:20px; }
  .stat-card {
    background:var(--card-bg); border:1px solid var(--border); border-radius:18px;
    padding:18px; display:flex; align-items:center; gap:14px;
    backdrop-filter:blur(12px); transition:transform .2s,box-shadow .2s;
    border-top:2px solid var(--accent);
  }
  .stat-card:hover { transform:translateY(-2px); box-shadow:0 8px 24px rgba(0,0,0,.25); }
  .stat-icon { font-size:28px; flex-shrink:0; }
  .stat-val { font-family:'Syne',sans-serif; font-size:20px; font-weight:800; color:var(--accent); }
  .stat-label { font-size:12px; color:var(--text-muted); margin-top:2px; }
  .stat-sub { font-size:11px; color:var(--text-muted); opacity:.7; margin-top:2px; }

  /* QUICK ACTIONS */
  .quick-actions { display:flex; gap:10px; flex-wrap:wrap; margin-bottom:20px; }
  .quick-btn {
    padding:11px 20px; border-radius:12px; border:none; cursor:pointer;
    font-family:'Syne',sans-serif; font-size:13px; font-weight:700; color:#fff;
    transition:all .25s; box-shadow:0 4px 16px rgba(0,0,0,.2);
  }
  .quick-btn:hover { transform:translateY(-2px); filter:brightness(1.1); }

  /* CARD */
  .card {
    background:var(--card-bg); border:1px solid var(--border); border-radius:18px;
    padding:20px; backdrop-filter:blur(12px);
  }
  .card-head {
    font-family:'Syne',sans-serif; font-weight:700; font-size:14.5px;
    margin-bottom:16px; color:var(--text);
  }

  /* CHARTS ROW */
  .charts-row { display:grid; grid-template-columns:1fr 1fr; gap:14px; }
  @media(max-width:700px){ .charts-row{grid-template-columns:1fr;} }

  /* LEGEND */
  .legend-row { display:flex; align-items:center; gap:8px; margin-bottom:8px; font-size:12.5px; }
  .legend-dot { width:10px; height:10px; border-radius:50%; flex-shrink:0; }
  .legend-label { flex:1; color:var(--text-muted); }
  .legend-val { font-weight:600; color:var(--text); }

  /* TABLE */
  .table-wrap { overflow-x:auto; }
  .data-table { width:100%; border-collapse:collapse; font-size:13px; }
  .data-table th {
    text-align:left; padding:10px 12px; font-size:11px; font-weight:600;
    text-transform:uppercase; letter-spacing:.06em; color:var(--text-muted);
    border-bottom:1px solid var(--border);
  }
  .data-table td { padding:12px 12px; border-bottom:1px solid var(--border); vertical-align:middle; }
  .data-table tr:last-child td { border-bottom:none; }
  .data-table tr:hover td { background:var(--surface); }
  .amount-cell { font-weight:700; color:var(--accent-teal); font-family:'Syne',sans-serif; }
  .cat-badge {
    padding:4px 10px; border-radius:20px; font-size:12px; font-weight:600;
  }
  .habit-pill { padding:3px 10px; border-radius:20px; font-size:12px; font-weight:600; }
  .action-btns { display:flex; gap:6px; }
  .act-btn {
    width:30px; height:30px; border-radius:8px; border:1px solid var(--border);
    background:var(--surface); cursor:pointer; font-size:14px; transition:all .2s;
    display:flex; align-items:center; justify-content:center;
  }
  .act-edit:hover { background:rgba(79,142,247,.15); border-color:#4f8ef7; }
  .act-del:hover  { background:rgba(244,114,182,.15); border-color:#f472b6; }

  /* ALERTS */
  .alert-row {
    display:flex; align-items:center; gap:10px; padding:10px 12px;
    border-radius:10px; margin-bottom:8px; font-size:13px;
  }
  .alert-success { background:rgba(52,211,153,.09); border:1px solid rgba(52,211,153,.25); color:#34d399; }
  .alert-warning { background:rgba(245,166,35,.09);  border:1px solid rgba(245,166,35,.25);  color:#f5a623; }
  .alert-danger  { background:rgba(244,114,182,.09); border:1px solid rgba(244,114,182,.25); color:#f472b6; }

  .alert-card {
    display:flex; align-items:flex-start; gap:16px; padding:18px 20px;
    border-radius:16px; transition:transform .2s;
  }
  .alert-card:hover { transform:translateX(4px); }
  .alert-card-success { background:rgba(52,211,153,.07); border:1px solid rgba(52,211,153,.2); }
  .alert-card-warning { background:rgba(245,166,35,.07); border:1px solid rgba(245,166,35,.2); }
  .alert-card-danger  { background:rgba(244,114,182,.07);border:1px solid rgba(244,114,182,.2);}
  .alert-card-icon { font-size:28px; flex-shrink:0; }
  .alert-card-title { font-family:'Syne',sans-serif; font-weight:700; font-size:15px; margin-bottom:4px; }
  .alert-card-msg { font-size:13px; color:var(--text-muted); line-height:1.5; }

  /* FILTERS */
  .filter-row { display:flex; align-items:center; gap:8px; margin-bottom:14px; flex-wrap:wrap; }
  .filter-btn {
    padding:7px 16px; border-radius:20px; border:1px solid var(--border);
    background:transparent; cursor:pointer; font-size:12.5px; font-weight:600;
    color:var(--text-muted); transition:all .25s;
  }
  .filter-btn:hover { border-color:var(--accent-teal); color:var(--accent-teal); }
  .filter-active { background:rgba(0,221,181,.12); border-color:var(--accent-teal); color:var(--accent-teal); }

  /* MINI STATS */
  .mini-stats { display:flex; flex-wrap:wrap; gap:10px; margin-bottom:16px; }
  .mini-card {
    display:flex; align-items:center; gap:10px; padding:10px 16px;
    border-radius:12px; font-size:20px;
  }

  /* SPARKLINE */
  .spark-card { flex:1; min-width:180px; }

  /* HOW ROW */
  .how-row { display:flex; align-items:flex-start; gap:14px; padding:10px 0;
    border-bottom:1px solid var(--border); }
  .how-row:last-child { border-bottom:none; }

  /* PROFILE */
  .profile-grid { display:flex; gap:18px; flex-wrap:wrap; }
  .profile-avatar {
    width:72px; height:72px; border-radius:50%; margin:0 auto 20px;
    background:linear-gradient(135deg,#00ddb5,#b06ef3);
    display:flex; align-items:center; justify-content:center;
    font-size:30px; font-weight:800; font-family:'Syne',sans-serif; color:#fff;
    box-shadow:0 0 24px rgba(0,221,181,.35);
  }

  /* FORMS */
  .form-group { margin-bottom:14px; }
  .form-label {
    display:block; font-size:11px; font-weight:600; text-transform:uppercase;
    letter-spacing:.07em; color:var(--text-muted); margin-bottom:6px;
  }
  .form-input {
    width:100%; padding:11px 13px; background:var(--input-bg);
    border:1.5px solid var(--input-border); border-radius:11px;
    font-family:'DM Sans',sans-serif; font-size:13.5px; color:var(--text);
    outline:none; transition:all .25s;
  }
  .form-input::placeholder { color:var(--text-muted); }
  .form-input:focus { border-color:#00ddb5; box-shadow:0 0 0 3px rgba(0,221,181,.12); background:rgba(0,221,181,.04); }
  select.form-input { cursor:pointer; }
  option { background:#0d111f; color:#eef0f8; }

  /* BUTTONS */
  .primary-btn {
    padding:11px 22px; border-radius:12px; border:none; cursor:pointer;
    font-family:'Syne',sans-serif; font-size:13.5px; font-weight:700; color:#fff;
    background:linear-gradient(135deg,#00ddb5,#4f8ef7);
    box-shadow:0 4px 18px rgba(0,221,181,.25); transition:all .25s;
  }
  .primary-btn:hover { transform:translateY(-2px); box-shadow:0 8px 26px rgba(0,221,181,.35); }
  .ghost-btn {
    padding:11px 22px; border-radius:12px; border:1px solid var(--border);
    background:transparent; cursor:pointer; font-family:'DM Sans',sans-serif;
    font-size:13.5px; font-weight:600; color:var(--text-muted); transition:all .25s;
  }
  .ghost-btn:hover { border-color:var(--text-muted); color:var(--text); }
  .danger-btn {
    padding:11px 22px; border-radius:12px; border:none; cursor:pointer;
    font-family:'Syne',sans-serif; font-size:13.5px; font-weight:700; color:#fff;
    background:linear-gradient(135deg,#f472b6,#f87171); transition:all .25s;
  }
  .danger-btn:hover { transform:translateY(-1px); }
  .link-btn {
    background:none; border:none; cursor:pointer; color:var(--accent-teal);
    font-family:'DM Sans',sans-serif; font-size:13px; font-weight:600;
    transition:opacity .2s;
  }
  .link-btn:hover { opacity:.75; }

  /* MODAL */
  .modal-overlay {
    position:fixed; inset:0; background:rgba(0,0,0,.6); backdrop-filter:blur(6px);
    z-index:200; display:flex; align-items:center; justify-content:center; padding:18px;
    animation:fadeIn .2s ease;
  }
  .modal-box {
    background:var(--card-bg); border:1px solid var(--border); border-radius:22px;
    padding:28px; width:100%; max-width:440px;
    box-shadow:0 32px 80px rgba(0,0,0,.5); backdrop-filter:blur(28px);
    animation:cardIn .3s cubic-bezier(.34,1.56,.64,1);
  }
  @keyframes cardIn { from{opacity:0;transform:scale(.94);} to{opacity:1;transform:scale(1);} }
  .modal-head {
    display:flex; justify-content:space-between; align-items:center;
    font-family:'Syne',sans-serif; font-weight:800; font-size:17px;
    margin-bottom:20px;
  }
  .modal-close {
    width:30px; height:30px; border-radius:8px; border:1px solid var(--border);
    background:var(--surface); cursor:pointer; font-size:14px; color:var(--text-muted);
    display:flex; align-items:center; justify-content:center; transition:all .2s;
  }
  .modal-close:hover { background:rgba(244,114,182,.15); color:#f472b6; border-color:#f472b6; }
  .modal-footer { display:flex; justify-content:flex-end; gap:10px; margin-top:20px; }

  /* TOAST */
  .toast {
    position:fixed; bottom:26px; left:50%; transform:translateX(-50%) translateY(80px);
    background:var(--card-bg); border:1px solid var(--border); border-radius:12px;
    padding:12px 24px; font-size:13.5px; font-weight:500; z-index:999;
    transition:transform .4s cubic-bezier(.34,1.56,.64,1), opacity .4s;
    opacity:0; white-space:nowrap; backdrop-filter:blur(20px);
    box-shadow:0 8px 32px rgba(0,0,0,.4);
  }
  .toast-show { transform:translateX(-50%) translateY(0); opacity:1; }
  .toast-success { border-color:rgba(0,221,181,.5);  color:#00ddb5; }
  .toast-error   { border-color:rgba(244,114,182,.5);color:#f472b6; }
  .toast-info    { border-color:rgba(79,142,247,.5);  color:#4f8ef7; }

  @media(max-width:640px) {
    .db-content { padding:14px; }
    .stat-grid  { grid-template-columns:1fr 1fr; }
    .sidebar    { width:64px; }
    .sb-title, .sb-btn span:not(.sb-nav-icon):not(.sb-badge) { display:none; }
  }
`;