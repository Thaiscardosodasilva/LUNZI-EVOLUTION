// pages/login.js
import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function Login() {
  const router = useRouter()
  const { redirect, plan } = router.query

  const [tab, setTab] = useState('login') // 'login' | 'signup' | 'forgot'
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Login
  const [lUser, setLUser] = useState('')
  const [lPass, setLPass] = useState('')

  // Signup
  const [sName, setSName] = useState('')
  const [sUser, setSUser] = useState('')
  const [sEmail, setSEmail] = useState('')
  const [sPass, setSPass] = useState('')
  const [sPass2, setSPass2] = useState('')

  // Forgot
  const [fEmail, setFEmail] = useState('')

  function clearMessages() { setError(''); setSuccess('') }
  function goTo(t) { clearMessages(); setTab(t) }

  async function handleLogin(e) {
    e.preventDefault(); clearMessages()
    if (!lUser || !lPass) return setError('Preencha usuário e senha.')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: lUser, password: lPass }),
      })
      const data = await res.json()
      if (!res.ok) return setError(data.error)
      if (redirect) router.push(decodeURIComponent(redirect))
      else router.push(data.user.accessStatus === 'active' ? '/app' : '/#pricing')
    } catch { setError('Erro de conexão.') }
    finally { setLoading(false) }
  }

  async function handleSignup(e) {
    e.preventDefault(); clearMessages()
    if (!sName || !sUser || !sEmail || !sPass || !sPass2) return setError('Preencha todos os campos.')
    if (sPass !== sPass2) return setError('As senhas não coincidem.')
    setLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: sName, username: sUser, email: sEmail, password: sPass }),
      })
      const data = await res.json()
      if (!res.ok) return setError(data.error)
      setSuccess('Conta criada! Redirecionando...')
      setTimeout(() => router.push('/#pricing'), 1500)
    } catch { setError('Erro de conexão.') }
    finally { setLoading(false) }
  }

  async function handleForgot(e) {
    e.preventDefault(); clearMessages()
    if (!fEmail) return setError('Informe seu e-mail.')
    setLoading(true)
    // Demo: apenas confirma que recebeu
    setTimeout(() => {
      setLoading(false)
      setSuccess('Se esse e-mail estiver cadastrado, você receberá instruções em breve.')
    }, 1000)
  }

  function strengthColor(p) {
    if (p.length < 6) return '#E07060'
    if (p.length < 10) return '#D4C060'
    return '#5CB85C'
  }
  function strengthPct(p) {
    if (!p) return '0%'
    if (p.length < 4) return '20%'
    if (p.length < 6) return '40%'
    if (p.length < 10) return '65%'
    return '100%'
  }

  return (
    <>
      <Head>
        <title>Login — Lunzi Evolution</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,500;0,600&display=swap" rel="stylesheet" />
      </Head>
      <style>{CSS}</style>

      <div className="screen">
        <div className="box">
          {/* LOGO + BRAND */}
          <div className="brand-block">
            <div className="logo-circle">✦</div>
            <div className="brand-name">Lunzi Evolution</div>
            <div className="orn"><div className="orn-l"/><div className="orn-s">✦</div><div className="orn-l"/></div>
            <div className="brand-tag">DISCIPLINA · CONSTÂNCIA · EVOLUÇÃO</div>
          </div>

          {/* TAB SWITCHER */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} autoComplete="on">
              <div className="field">
                <label>Usuário</label>
                <input type="text" placeholder="seu usuário" value={lUser} onChange={e => setLUser(e.target.value)} autoComplete="username" />
              </div>
              <div className="field">
                <label>Senha</label>
                <input type="password" placeholder="••••••••" value={lPass} onChange={e => setLPass(e.target.value)} autoComplete="current-password" />
              </div>
              {error && <div className="err">{error}</div>}
              {success && <div className="ok">{success}</div>}
              <button type="submit" className="btn-submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</button>
              <div className="divider"><div className="div-line"/><span>ou</span><div className="div-line"/></div>
              <div className="toggle">Não tem conta? <button type="button" onClick={() => goTo('signup')}>Criar conta</button></div>
              <div className="toggle" style={{marginTop:'6px'}}><button type="button" onClick={() => goTo('forgot')} style={{fontSize:'11px',color:'rgba(139,100,9,.5)',borderColor:'transparent'}}>Esqueci minha senha</button></div>
            </form>
          )}

          {tab === 'signup' && (
            <form onSubmit={handleSignup} autoComplete="on">
              <div className="field">
                <label>Nome completo</label>
                <input type="text" placeholder="Seu nome" value={sName} onChange={e => setSName(e.target.value)} autoComplete="name" />
              </div>
              <div className="field">
                <label>Usuário</label>
                <input type="text" placeholder="como quer ser chamada" value={sUser} onChange={e => setSUser(e.target.value)} autoComplete="username" />
              </div>
              <div className="field">
                <label>E-mail</label>
                <input type="email" placeholder="seu@email.com" value={sEmail} onChange={e => setSEmail(e.target.value)} autoComplete="email" />
              </div>
              <div className="field">
                <label>Senha</label>
                <input type="password" placeholder="mínimo 6 caracteres" value={sPass} onChange={e => setSPass(e.target.value)} autoComplete="new-password" />
                <div className="strength-bar"><div style={{height:'100%',borderRadius:'2px',transition:'all .3s',width:strengthPct(sPass),background:strengthColor(sPass)}}/></div>
              </div>
              <div className="field">
                <label>Confirmar senha</label>
                <input type="password" placeholder="repita a senha" value={sPass2} onChange={e => setSPass2(e.target.value)} autoComplete="new-password" />
              </div>
              {error && <div className="err">{error}</div>}
              {success && <div className="ok">{success}</div>}
              <button type="submit" className="btn-submit" disabled={loading}>{loading ? 'Criando...' : 'Criar conta'}</button>
              <div className="divider"><div className="div-line"/><span>ou</span><div className="div-line"/></div>
              <div className="toggle">Já tem conta? <button type="button" onClick={() => goTo('login')}>Entrar</button></div>
            </form>
          )}

          {tab === 'forgot' && (
            <form onSubmit={handleForgot}>
              <p className="forgot-intro">Informe seu e-mail cadastrado para recuperar o acesso.</p>
              <div className="field">
                <label>E-mail</label>
                <input type="email" placeholder="seu@email.com" value={fEmail} onChange={e => setFEmail(e.target.value)} />
              </div>
              {error && <div className="err">{error}</div>}
              {success && <div className="ok">{success}</div>}
              <button type="submit" className="btn-submit" disabled={loading}>{loading ? 'Enviando...' : 'Recuperar acesso'}</button>
              <div className="divider"><div className="div-line"/><span>ou</span><div className="div-line"/></div>
              <div className="toggle"><button type="button" onClick={() => goTo('login')}>Voltar ao login</button></div>
            </form>
          )}
        </div>
      </div>
    </>
  )
}

const CSS = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{--gold:#B8860B;--gold-l:#CFA022;--gold-d:#8B6409;--cream:#F5EFE6;--cream-d:#EBE3D5;--text:#2C2010;--text-m:#6B5530;--text-f:#A08C60;--ff:'Plus Jakarta Sans',system-ui,sans-serif;--serif:'Cormorant Garamond',Georgia,serif}
  html{font-size:16px}
  body{font-family:var(--ff);background:linear-gradient(160deg,#F0E8D8 0%,#EDE0C8 50%,#F5EDD8 100%);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:1.25rem}

  .screen{width:100%;display:flex;align-items:center;justify-content:center;min-height:100vh}
  .box{width:100%;max-width:420px;background:#FFFDF7;border:1.5px solid rgba(184,134,11,.3);border-radius:20px;padding:2.5rem 2rem;box-shadow:0 2px 0 rgba(184,134,11,.15),0 20px 60px rgba(140,100,10,.12)}
  .box::before{content:'';display:block;height:3px;background:linear-gradient(90deg,transparent,var(--gold),transparent);margin:-2.5rem -2rem 2rem;border-radius:20px 20px 0 0}

  .brand-block{text-align:center;margin-bottom:2rem}
  .logo-circle{width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,var(--gold-d),var(--gold-l));color:#fff;font-size:28px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:1rem;box-shadow:0 0 0 5px rgba(184,134,11,.12),0 8px 24px rgba(140,100,10,.2)}
  .brand-name{font-size:13px;font-weight:800;letter-spacing:.5px;color:var(--gold-d);margin-bottom:4px}
  .orn{display:flex;align-items:center;justify-content:center;gap:12px;margin:.5rem 0}
  .orn-l{flex:0 0 36px;height:1px;background:linear-gradient(90deg,transparent,rgba(184,134,11,.4),transparent)}
  .orn-s{color:var(--gold);font-size:11px}
  .brand-tag{font-size:8px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:rgba(139,100,9,.6);margin-top:4px}

  .field{margin-bottom:14px}
  .field label{display:block;font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--gold-d);margin-bottom:7px;opacity:.8}
  .field input{width:100%;padding:13px 15px;background:var(--cream);border:1.5px solid rgba(184,134,11,.25);border-radius:10px;font-family:var(--ff);font-size:15px;color:var(--text);outline:none;transition:all .2s}
  .field input:focus{border-color:var(--gold);background:#fff;box-shadow:0 0 0 3px rgba(184,134,11,.1)}
  .field input::placeholder{color:var(--text-f);font-size:14px}

  .strength-bar{height:4px;background:var(--cream-d);border-radius:2px;margin-top:8px;overflow:hidden}

  .err{font-size:12px;color:#C0392B;margin-bottom:10px;text-align:center;font-weight:600;background:rgba(192,57,43,.06);padding:8px;border-radius:8px}
  .ok{font-size:12px;color:#27AE60;margin-bottom:10px;text-align:center;font-weight:600;background:rgba(39,174,96,.06);padding:8px;border-radius:8px}

  .btn-submit{width:100%;padding:16px;background:linear-gradient(135deg,var(--gold-d) 0%,var(--gold-l) 60%,#E8C050 100%);color:#fff;border:none;border-radius:10px;font-family:var(--ff);font-size:14px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;cursor:pointer;transition:all .2s;margin-top:6px;box-shadow:0 4px 20px rgba(184,134,11,.35)}
  .btn-submit:hover:not(:disabled){transform:translateY(-1px);box-shadow:0 6px 24px rgba(184,134,11,.45)}
  .btn-submit:disabled{opacity:.6;cursor:not-allowed}

  .divider{display:flex;align-items:center;gap:12px;margin:1.25rem 0;font-size:11px;color:var(--text-f)}
  .div-line{flex:1;height:1px;background:rgba(184,134,11,.15)}

  .toggle{text-align:center;font-size:13px;color:var(--text-m)}
  .toggle button{background:none;border:none;border-bottom:1.5px solid rgba(139,100,9,.3);color:var(--gold-d);font-family:var(--ff);font-size:13px;font-weight:700;cursor:pointer;padding-bottom:1px;transition:all .15s}
  .toggle button:hover{color:var(--gold);border-bottom-color:var(--gold)}

  .forgot-intro{font-size:14px;color:var(--text-m);text-align:center;margin-bottom:1.25rem;line-height:1.6;font-style:italic}
`
