'use client';

import { useState, useEffect } from 'react';

const ADMIN_EMAIL = 'admin@smartexpense.com';
const ADMIN_PASS  = 'Admin@2026';

const css = `
  :root {
    --bg: #080b14;
    --surface: rgba(255,255,255,0.04);
    --surface-2: rgba(255,255,255,0.08);
    --border: rgba(255,255,255,0.1);
    --text: #eef0f8;
    --text-muted: rgba(238,240,248,0.45);
    --accent-teal: #00ddb5;
    --accent-purple: #b06ef3;
    --accent-blue: #4f8ef7;
    --accent-pink: #f472b6;
    --error: #f87171;
    --success: #34d399;
    --card-bg: rgba(12,16,28,0.9);
    --input-bg: rgba(255,255,255,0.055);
    --input-border: rgba(255,255,255,0.11);
    --input-focus: #00ddb5;
    --shadow: 0 32px 72px rgba(0,0,0,0.6), 0 2px 4px rgba(0,221,181,0.08);
  }
  .light {
    --bg: #eef2fc;
    --surface: rgba(0,0,0,0.03);
    --surface-2: rgba(0,0,0,0.06);
    --border: rgba(0,0,0,0.09);
    --text: #0d1020;
    --text-muted: rgba(13,16,32,0.48);
    --card-bg: rgba(255,255,255,0.94);
    --input-bg: rgba(0,0,0,0.04);
    --input-border: rgba(0,0,0,0.11);
    --shadow: 0 24px 60px rgba(80,100,200,0.16), 0 2px 8px rgba(0,221,181,0.1);
  }
  * { margin:0; padding:0; box-sizing:border-box; }
  html, body { height:100%; }
  .page-body {
    font-family:'DM Sans',sans-serif;
    background:var(--bg);
    color:var(--text);
    min-height:100vh;
    display:flex; align-items:center; justify-content:center;
    overflow:hidden;
    transition:background .4s, color .4s;
    position:relative;
  }
  .bg-canvas { position:fixed; inset:0; z-index:0; pointer-events:none; }
  .orb { position:absolute; border-radius:50%; filter:blur(90px); opacity:.3; animation:drift 9s ease-in-out infinite; }
  .orb-1 { width:560px; height:560px; background:radial-gradient(circle,#00ddb555,transparent 70%); top:-140px; left:-140px; animation-delay:0s; }
  .orb-2 { width:440px; height:440px; background:radial-gradient(circle,#b06ef355,transparent 70%); bottom:-100px; right:-100px; animation-delay:-3.5s; }
  .orb-3 { width:320px; height:320px; background:radial-gradient(circle,#4f8ef740,transparent 70%); top:45%; left:55%; animation-delay:-6s; }
  .light .orb { opacity:.14; }
  @keyframes drift {
    0%,100% { transform:translate(0,0) scale(1); }
    33%      { transform:translate(28px,-18px) scale(1.04); }
    66%      { transform:translate(-18px,14px) scale(.97); }
  }
  .grid-overlay {
    position:fixed; inset:0; z-index:0; pointer-events:none;
    background-image:linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),
                     linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px);
    background-size:52px 52px;
  }
  .light .grid-overlay {
    background-image:linear-gradient(rgba(0,0,0,.035) 1px,transparent 1px),
                     linear-gradient(90deg,rgba(0,0,0,.035) 1px,transparent 1px);
  }
  .theme-btn {
    position:fixed; top:22px; right:22px; z-index:200;
    width:44px; height:44px; border-radius:12px;
    border:1px solid var(--border);
    background:var(--surface-2);
    backdrop-filter:blur(18px);
    cursor:pointer; display:flex; align-items:center; justify-content:center;
    font-size:19px; transition:all .3s; color:var(--text);
  }
  .theme-btn:hover { transform:scale(1.12); border-color:var(--accent-teal); box-shadow:0 0 18px rgba(0,221,181,.25); }
  .card-wrapper { position:relative; z-index:10; width:100%; max-width:476px; padding:18px; }
  .brand { text-align:center; margin-bottom:22px; }
  .brand-logo {
    display:inline-flex; align-items:center; gap:10px;
    font-family:'Syne',sans-serif; font-weight:800; font-size:27px;
    background:linear-gradient(135deg,var(--accent-teal),var(--accent-purple));
    -webkit-background-clip:text; -webkit-text-fill-color:transparent; background-clip:text;
  }
  .brand-icon {
    width:42px; height:42px; border-radius:13px;
    background:linear-gradient(135deg,var(--accent-teal),var(--accent-purple));
    display:flex; align-items:center; justify-content:center;
    font-size:22px; -webkit-text-fill-color:white; color:white;
    box-shadow:0 0 22px rgba(0,221,181,.38); flex-shrink:0;
  }
  .brand-sub { margin-top:5px; font-size:12.5px; color:var(--text-muted); letter-spacing:.04em; }
  .float-tags { display:flex; flex-wrap:wrap; gap:7px; justify-content:center; margin-bottom:22px; }
  .tag { padding:4px 12px; border-radius:20px; font-size:11px; font-weight:600; letter-spacing:.035em;
    background:var(--surface-2); border:1px solid var(--border); color:var(--text-muted); }
  .tag.t { border-color:rgba(0,221,181,.38); color:var(--accent-teal); background:rgba(0,221,181,.06); }
  .tag.p { border-color:rgba(176,110,243,.38); color:var(--accent-purple); background:rgba(176,110,243,.06); }
  .tag.b { border-color:rgba(79,142,247,.38); color:var(--accent-blue); background:rgba(79,142,247,.06); }
  .card {
    background:var(--card-bg);
    border:1px solid var(--border);
    border-radius:26px;
    padding:34px 34px 30px;
    backdrop-filter:blur(28px);
    box-shadow:var(--shadow);
    transition:all .4s;
    animation:cardIn .55s cubic-bezier(.34,1.56,.64,1) both;
  }
  @keyframes cardIn { from{opacity:0;transform:translateY(26px) scale(.97);} to{opacity:1;transform:translateY(0) scale(1);} }
  .mode-switch {
    display:grid; grid-template-columns:1fr 1fr;
    background:var(--input-bg); border:1px solid var(--input-border);
    border-radius:14px; padding:4px; margin-bottom:26px; gap:4px;
  }
  .mode-btn {
    padding:10px 8px; border-radius:10px; border:none;
    background:transparent; cursor:pointer;
    font-family:'DM Sans',sans-serif; font-size:13.5px; font-weight:600;
    color:var(--text-muted); transition:all .3s;
    display:flex; align-items:center; justify-content:center; gap:6px;
  }
  .mode-btn.active {
    background:linear-gradient(135deg,var(--accent-teal),var(--accent-blue));
    color:#fff; box-shadow:0 4px 18px rgba(0,221,181,.28);
  }
  .tab-row { display:flex; margin-bottom:22px; border-bottom:1.5px solid var(--border); }
  .tab-btn {
    flex:1; padding:9px 6px; border:none; background:transparent; cursor:pointer;
    font-family:'DM Sans',sans-serif; font-size:13.5px; font-weight:600;
    color:var(--text-muted); border-bottom:2.5px solid transparent;
    margin-bottom:-1.5px; transition:all .25s;
  }
  .tab-btn.active { color:var(--accent-teal); border-bottom-color:var(--accent-teal); }
  .form-group { margin-bottom:16px; }
  label { display:block; font-size:11.5px; font-weight:600; text-transform:uppercase; letter-spacing:.08em; color:var(--text-muted); margin-bottom:7px; }
  .input-wrap { position:relative; }
  .input-icon { position:absolute; left:13px; top:50%; transform:translateY(-50%); font-size:15px; color:var(--text-muted); pointer-events:none; line-height:1; }
  .input-wrap input {
    width:100%; padding:12px 13px 12px 40px;
    background:var(--input-bg);
    border:1.5px solid var(--input-border);
    border-radius:11px; font-family:'DM Sans',sans-serif;
    font-size:13.5px; color:var(--text); outline:none; transition:all .25s;
  }
  .input-wrap input::placeholder { color:var(--text-muted); }
  .input-wrap input:focus {
    border-color:var(--input-focus);
    background:rgba(0,221,181,.045);
    box-shadow:0 0 0 3px rgba(0,221,181,.13);
  }
  .eye-btn {
    position:absolute; right:12px; top:50%; transform:translateY(-50%);
    background:none; border:none; cursor:pointer; color:var(--text-muted);
    font-size:15px; transition:color .2s; line-height:1;
  }
  .eye-btn:hover { color:var(--accent-teal); }
  .admin-badge {
    display:flex; align-items:center; gap:10px;
    background:linear-gradient(135deg,rgba(176,110,243,.09),rgba(79,142,247,.09));
    border:1px solid rgba(176,110,243,.22);
    border-radius:11px; padding:11px 14px; margin-bottom:20px;
    font-size:12.5px; color:var(--accent-purple); line-height:1.4;
  }
  .dot {
    width:8px; height:8px; border-radius:50%;
    background:var(--accent-purple); flex-shrink:0;
    animation:pulse 2s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100%{opacity:1;transform:scale(1);} 50%{opacity:.45;transform:scale(1.5);} }
  .submit-btn {
    width:100%; padding:13px;
    background:linear-gradient(135deg,var(--accent-teal),var(--accent-blue));
    border:none; border-radius:13px; cursor:pointer;
    font-family:'Syne',sans-serif; font-size:14.5px; font-weight:700;
    color:#fff; letter-spacing:.03em; transition:all .3s; margin-top:6px;
    position:relative; overflow:hidden;
    box-shadow:0 6px 26px rgba(0,221,181,.28);
  }
  .submit-btn:hover { transform:translateY(-2px); box-shadow:0 10px 34px rgba(0,221,181,.38); }
  .submit-btn:active { transform:translateY(0); }
  .submit-btn:disabled { pointer-events:none; opacity:.8; }
  .admin-submit-btn {
    background:linear-gradient(135deg,#b06ef3,#4f8ef7);
    box-shadow:0 6px 26px rgba(176,110,243,.3);
  }
  .spinner {
    display:inline-block; width:15px; height:15px;
    border:2px solid rgba(255,255,255,.38); border-top-color:#fff;
    border-radius:50%; animation:spin .7s linear infinite;
    vertical-align:middle; margin-right:7px;
  }
  @keyframes spin { to { transform:rotate(360deg); } }
  .msg {
    padding:10px 13px; border-radius:9px; font-size:12.5px; font-weight:500;
    margin-top:12px; align-items:center; gap:7px; line-height:1.4;
  }
  .msg.error   { background:rgba(248,113,113,.09); border:1px solid rgba(248,113,113,.28); color:var(--error); display:flex; }
  .msg.success { background:rgba(52,211,153,.09);  border:1px solid rgba(52,211,153,.28);  color:var(--success); display:flex; }
  .msg.hidden  { display:none; }
  .card-footer { text-align:center; margin-top:18px; font-size:12.5px; color:var(--text-muted); }
  .card-footer span { color:var(--accent-teal); text-decoration:none; font-weight:600; cursor:pointer; }
  .card-footer span:hover { text-decoration:underline; }
  .divider { display:flex; align-items:center; gap:10px; margin:14px 0; color:var(--text-muted); font-size:11.5px; }
  .divider::before,.divider::after { content:''; flex:1; height:1px; background:var(--border); }
  .redirect-screen { text-align:center; padding:8px 0; }
  .avatar-circle {
    width:76px; height:76px; border-radius:50%; margin:0 auto 18px;
    background:linear-gradient(135deg,var(--accent-teal),var(--accent-purple));
    display:flex; align-items:center; justify-content:center;
    font-size:34px; box-shadow:0 0 34px rgba(0,221,181,.38);
    animation:popIn .5s cubic-bezier(.34,1.56,.64,1) both;
  }
  @keyframes popIn { from{transform:scale(0);opacity:0;} to{transform:scale(1);opacity:1;} }
  .welcome-text { font-family:'Syne',sans-serif; font-size:22px; font-weight:800; margin-bottom:7px; }
  .redirect-sub { color:var(--text-muted); font-size:13px; margin-bottom:22px; }
  .redirect-bar { height:4px; border-radius:4px; background:var(--input-bg); overflow:hidden; }
  .redirect-fill {
    height:100%; width:0%; border-radius:4px;
    background:linear-gradient(90deg,var(--accent-teal),var(--accent-purple));
    animation:fillBar 2.1s linear forwards;
  }
  @keyframes fillBar { to { width:100%; } }
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');
`;

// Database functions now replaced with API calls

export default function LoginPage() {
  const [dark,      setDark]      = useState(true);
  const [mode,      setMode]      = useState('user');   // 'user' | 'admin'
  const [tab,       setTab]       = useState('login');  // 'login' | 'signup'
  const [loading,   setLoading]   = useState(false);
  const [redirectData, setRedirectData] = useState(null); // { emoji, name, sub }

  // Login fields
  const [loginId,   setLoginId]   = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [showLP,    setShowLP]    = useState(false);

  // Signup fields
  const [regName,   setRegName]   = useState('');
  const [regEmail,  setRegEmail]  = useState('');
  const [regPass,   setRegPass]   = useState('');
  const [showRP,    setShowRP]    = useState(false);

  // Admin fields
  const [admEmail,  setAdmEmail]  = useState('');
  const [admPass,   setAdmPass]   = useState('');
  const [showAP,    setShowAP]    = useState(false);

  // Messages
  const [loginMsg,  setLoginMsg]  = useState(null);   // { type, text }
  const [signupMsg, setSignupMsg] = useState(null);
  const [adminMsg,  setAdminMsg]  = useState(null);

  // Removed seed demo user as we use real backend now
  useEffect(() => {
    // Left intentionally blank
  }, []);

  // Enter key
  useEffect(() => {
    const handler = (e) => {
      if (e.key !== 'Enter') return;
      if (mode === 'admin') doAdmin();
      else if (tab === 'login') doLogin();
      else doSignup();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  });

  const clearMsgs = () => { setLoginMsg(null); setSignupMsg(null); setAdminMsg(null); };

  const switchMode = (m) => { setMode(m); clearMsgs(); };
  const switchTab  = (t) => { setTab(t);  clearMsgs(); };

  // ── Redirect screen ──
  const redirectTo = (emoji, name, sub) => {
    setRedirectData({ emoji, name, sub });
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 2000);
  };

  // ── Login ──
  const doLogin = async () => {
    if (!loginId || !loginPass) { setLoginMsg({ type: 'error', text: 'Please fill in all fields.' }); return; }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginId, password: loginPass })
      });
      const data = await res.json();
      setLoading(false);
      
      if (data.success) {
        localStorage.setItem('se_session', JSON.stringify({ 
          name: data.user.name, 
          email: data.user.email, 
          role: 'user', 
          token: data.token,
          id: data.user.id
        }));
        redirectTo('👤', 'Welcome back, ' + data.user.name.split(' ')[0] + '!', 'Loading your dashboard…');
      } else {
        setLoginMsg({ type: 'error', text: data.message || 'Invalid credentials.' });
      }
    } catch (err) {
      setLoading(false);
      setLoginMsg({ type: 'error', text: 'Failed to connect to server.' });
    }
  };

  // ── Signup ──
  const doSignup = async () => {
    if (!regName || !regEmail || !regPass) { setSignupMsg({ type: 'error', text: 'All fields are required.' }); return; }
    if (!/\S+@\S+\.\S+/.test(regEmail))    { setSignupMsg({ type: 'error', text: 'Please enter a valid email address.' }); return; }
    if (regPass.length < 6)                 { setSignupMsg({ type: 'error', text: 'Password must be at least 6 characters.' }); return; }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: regName, email: regEmail, password: regPass })
      });
      const data = await res.json();
      setLoading(false);

      if (data.success) {
        setSignupMsg({ type: 'success', text: 'Account created! Redirecting...' });
        setTimeout(() => {
          localStorage.setItem('se_session', JSON.stringify({ 
            name: data.user.name, 
            email: data.user.email, 
            role: 'user', 
            token: data.token,
            id: data.user.id
          }));
          redirectTo('🎉', 'Welcome, ' + data.user.name.split(' ')[0] + '!', 'Setting up your dashboard…');
        }, 1600);
      } else {
        const errorMsg = data.errors ? data.errors[0].msg : data.message || 'Signup failed.';
        setSignupMsg({ type: 'error', text: errorMsg });
      }
    } catch (err) {
      setLoading(false);
      setSignupMsg({ type: 'error', text: 'Failed to connect to server.' });
    }
  };

  // ── Admin ──
  const doAdmin = () => {
    if (!admEmail || !admPass) { setAdminMsg({ type: 'error', text: 'Please enter admin credentials.' }); return; }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (admEmail === ADMIN_EMAIL && admPass === ADMIN_PASS) {
        localStorage.setItem('se_session', JSON.stringify({ name: 'Administrator', email: admEmail, role: 'admin' }));
        redirectTo('🛡️', 'Admin Access Granted', 'Loading admin panel…');
      } else {
        setAdminMsg({ type: 'error', text: 'Invalid admin credentials. Please try again.' });
      }
    }, 900);
  };

  const Msg = ({ msg }) => {
    if (!msg) return null;
    return (
      <div className={`msg ${msg.type}`}>
        {msg.type === 'error' ? '⚠️ ' : '✅ '}{msg.text}
      </div>
    );
  };

  return (
    <div className={`page-body${dark ? '' : ' light'}`}>
      <style dangerouslySetInnerHTML={{ __html: css }} />

      {/* BG */}
      <div className="bg-canvas">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>
      <div className="grid-overlay" />

      {/* Theme toggle */}
      <button className="theme-btn" onClick={() => setDark(d => !d)}>
        {dark ? '🌙' : '☀️'}
      </button>

      <div className="card-wrapper">

        {/* Brand */}
        <div className="brand">
          <div className="brand-logo">
            <div className="brand-icon">💹</div>
            SmartExpense
          </div>
          <p className="brand-sub">Smart Expense &amp; Habit Tracker · Byte_Builders</p>
        </div>

        {/* Float tags */}
        <div className="float-tags">
          <span className="tag t">💰 Expenses</span>
          <span className="tag p">🧠 Habits</span>
          <span className="tag b">📊 Analytics</span>
          <span className="tag">🔔 Smart Alerts</span>
        </div>

        {/* Card */}
        <div className="card">

          {/* Redirect screen */}
          {redirectData ? (
            <div className="redirect-screen">
              <div className="avatar-circle">{redirectData.emoji}</div>
              <div className="welcome-text">{redirectData.name}</div>
              <p className="redirect-sub">{redirectData.sub}</p>
              <div className="redirect-bar">
                <div className="redirect-fill" />
              </div>
            </div>
          ) : (
            <>
              {/* Mode switch */}
              <div className="mode-switch">
                <button className={`mode-btn${mode === 'user'  ? ' active' : ''}`} onClick={() => switchMode('user')}>
                  👤 &nbsp;User
                </button>
                <button className={`mode-btn${mode === 'admin' ? ' active' : ''}`} onClick={() => switchMode('admin')}>
                  🛡️ &nbsp;Admin
                </button>
              </div>

              {/* ── USER SECTION ── */}
              {mode === 'user' && (
                <div>
                  <div className="tab-row">
                    <button className={`tab-btn${tab === 'login'  ? ' active' : ''}`} onClick={() => switchTab('login')}>Sign In</button>
                    <button className={`tab-btn${tab === 'signup' ? ' active' : ''}`} onClick={() => switchTab('signup')}>Create Account</button>
                  </div>

                  {/* Login form */}
                  {tab === 'login' && (
                    <div>
                      <div className="form-group">
                        <label>Username or Email</label>
                        <div className="input-wrap">
                          <span className="input-icon">📧</span>
                          <input type="text" placeholder="Enter username or email" autoComplete="username"
                            value={loginId} onChange={e => setLoginId(e.target.value)} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Password</label>
                        <div className="input-wrap">
                          <span className="input-icon">🔒</span>
                          <input type={showLP ? 'text' : 'password'} placeholder="Enter your password" autoComplete="current-password"
                            value={loginPass} onChange={e => setLoginPass(e.target.value)} />
                          <button className="eye-btn" onClick={() => setShowLP(v => !v)}>{showLP ? '🙈' : '👁️'}</button>
                        </div>
                      </div>
                      <button className="submit-btn" onClick={doLogin} disabled={loading}>
                        {loading ? <><span className="spinner" />Processing…</> : 'Sign In →'}
                      </button>
                      <Msg msg={loginMsg} />
                      <div className="card-footer">
                        No account yet? <span onClick={() => switchTab('signup')}>Create one for free</span>
                      </div>
                    </div>
                  )}

                  {/* Signup form */}
                  {tab === 'signup' && (
                    <div>
                      <div className="form-group">
                        <label>Full Name / Username</label>
                        <div className="input-wrap">
                          <span className="input-icon">🙍</span>
                          <input type="text" placeholder="e.g. Tushar Sarker" autoComplete="name"
                            value={regName} onChange={e => setRegName(e.target.value)} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Email Address</label>
                        <div className="input-wrap">
                          <span className="input-icon">📧</span>
                          <input type="email" placeholder="you@example.com" autoComplete="email"
                            value={regEmail} onChange={e => setRegEmail(e.target.value)} />
                        </div>
                      </div>
                      <div className="form-group">
                        <label>Password</label>
                        <div className="input-wrap">
                          <span className="input-icon">🔒</span>
                          <input type={showRP ? 'text' : 'password'} placeholder="Minimum 6 characters" autoComplete="new-password"
                            value={regPass} onChange={e => setRegPass(e.target.value)} />
                          <button className="eye-btn" onClick={() => setShowRP(v => !v)}>{showRP ? '🙈' : '👁️'}</button>
                        </div>
                      </div>
                      <button className="submit-btn" onClick={doSignup} disabled={loading}>
                        {loading ? <><span className="spinner" />Processing…</> : 'Create Account ✨'}
                      </button>
                      <Msg msg={signupMsg} />
                      <div className="card-footer">
                        Already have an account? <span onClick={() => switchTab('login')}>Sign in here</span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── ADMIN SECTION ── */}
              {mode === 'admin' && (
                <div>
                  <div className="admin-badge">
                    <div className="dot" />
                    Admin access is restricted. Use your predefined admin credentials to continue.
                  </div>
                  <div className="form-group">
                    <label>Admin Email</label>
                    <div className="input-wrap">
                      <span className="input-icon">🛡️</span>
                      <input type="email" placeholder="admin@smartexpense.com" autoComplete="off"
                        value={admEmail} onChange={e => setAdmEmail(e.target.value)} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Admin Password</label>
                    <div className="input-wrap">
                      <span className="input-icon">🔑</span>
                      <input type={showAP ? 'text' : 'password'} placeholder="Admin password" autoComplete="off"
                        value={admPass} onChange={e => setAdmPass(e.target.value)} />
                      <button className="eye-btn" onClick={() => setShowAP(v => !v)}>{showAP ? '🙈' : '👁️'}</button>
                    </div>
                  </div>
                  <button className="submit-btn admin-submit-btn" onClick={doAdmin} disabled={loading}>
                    {loading ? <><span className="spinner" />Processing…</> : 'Admin Sign In →'}
                  </button>
                  <Msg msg={adminMsg} />
                  <div className="divider">Hint for testing</div>
                  <div style={{ fontSize: '11.5px', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.7 }}>
                    Email: <code style={{ color: 'var(--accent-teal)' }}>admin@smartexpense.com</code><br />
                    Password: <code style={{ color: 'var(--accent-purple)' }}>Admin@2024</code>
                  </div>
                </div>
              )}
            </>
          )}

        </div>{/* /card */}
      </div>{/* /wrapper */}
    </div>
  );
}