// pages/pagamento-pendente.js
// Usuário cai aqui após ser redirecionado pelo Asaas
// Fica verificando o status até liberar o acesso
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function PagamentoPendente() {
  const router = useRouter()
  const [status, setStatus] = useState('pending') // pending | active | blocked
  const [attempts, setAttempts] = useState(0)
  const MAX_ATTEMPTS = 20 // ~60 segundos de polling

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/payment/status')
        if (!res.ok) { router.push('/login'); return }
        const data = await res.json()

        if (data.accessActive) {
          setStatus('active')
          clearInterval(interval)
          setTimeout(() => router.push('/app'), 2000)
          return
        }

        setAttempts(a => {
          const next = a + 1
          if (next >= MAX_ATTEMPTS) {
            clearInterval(interval)
            setStatus('timeout')
          }
          return next
        })
      } catch {
        // silencia erros de rede
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <Head>
        <title>Processando pagamento — Lunzi Evolution</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,500;0,600&display=swap" rel="stylesheet" />
      </Head>
      <style>{CSS}</style>

      <div className="screen">
        <div className="box">
          <div className="logo">✦</div>
          <div className="brand">Lunzi Evolution</div>

          {status === 'pending' && (
            <>
              <div className="spinner" />
              <h1 className="title">Confirmando pagamento...</h1>
              <p className="sub">Aguarde enquanto processamos seu pagamento. Isso pode levar alguns segundos.</p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${Math.min((attempts / MAX_ATTEMPTS) * 100, 95)}%` }} />
              </div>
              <p className="hint">Não feche essa página.</p>
            </>
          )}

          {status === 'active' && (
            <>
              <div className="check-icon">✓</div>
              <h1 className="title success">Acesso liberado! ✦</h1>
              <p className="sub">Bem-vinda à Lunzi Evolution. Redirecionando para a plataforma...</p>
            </>
          )}

          {status === 'timeout' && (
            <>
              <div className="warn-icon">⏱</div>
              <h1 className="title">Pagamento em processamento</h1>
              <p className="sub">Seu pagamento está sendo processado. Assim que confirmado, seu acesso será liberado automaticamente.</p>
              <p className="sub" style={{ marginTop: '1rem', fontSize: '13px', opacity: '.6' }}>
                Se já realizou o pagamento, aguarde alguns minutos e tente entrar novamente.
              </p>
              <button className="btn-retry" onClick={() => router.push('/login')}>
                Ir para o login
              </button>
              <button className="btn-home" onClick={() => router.push('/')}>
                Voltar para o início
              </button>
            </>
          )}
        </div>
      </div>
    </>
  )
}

const CSS = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{--gold:#B8860B;--gold-l:#CFA022;--gold-d:#8B6409;--cream:#F5EFE6;--cream-d:#EBE3D5;--ff:'Plus Jakarta Sans',system-ui,sans-serif;--serif:'Cormorant Garamond',Georgia,serif}
  html{font-size:16px}
  body{font-family:var(--ff);background:linear-gradient(160deg,#F0E8D8,#EDE0C8,#F5EDD8);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:1.25rem}

  .screen{width:100%;display:flex;align-items:center;justify-content:center;min-height:100vh}
  .box{width:100%;max-width:440px;background:#FFFDF7;border:1.5px solid rgba(184,134,11,.3);border-radius:20px;padding:2.5rem 2rem;text-align:center;box-shadow:0 20px 60px rgba(140,100,10,.12)}

  .logo{width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,var(--gold-d),var(--gold-l));color:#fff;font-size:24px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:1rem;box-shadow:0 0 0 5px rgba(184,134,11,.1)}
  .brand{font-size:12px;font-weight:800;letter-spacing:1px;color:var(--gold-d);margin-bottom:2rem}

  .spinner{width:52px;height:52px;border:3px solid rgba(184,134,11,.15);border-top-color:var(--gold);border-radius:50%;margin:0 auto 1.5rem;animation:spin 1s linear infinite}
  @keyframes spin{to{transform:rotate(360deg)}}

  .check-icon{width:64px;height:64px;border-radius:50%;background:linear-gradient(135deg,#27AE60,#2ECC71);color:#fff;font-size:28px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;margin-bottom:1.25rem;animation:popIn .5s cubic-bezier(.22,1,.36,1)}
  @keyframes popIn{from{opacity:0;transform:scale(.5)}to{opacity:1;transform:scale(1)}}
  .warn-icon{font-size:52px;margin-bottom:1rem}

  .title{font-family:var(--serif);font-size:26px;font-weight:600;color:#2C2010;margin-bottom:.75rem;line-height:1.25}
  .title.success{color:#1A6B3A}
  .sub{font-size:14px;color:#6B5530;line-height:1.7;max-width:360px;margin:0 auto}

  .progress-bar{height:5px;background:var(--cream-d);border-radius:3px;margin:1.5rem 0 .75rem;overflow:hidden}
  .progress-fill{height:100%;background:linear-gradient(90deg,var(--gold-d),var(--gold-l));border-radius:3px;transition:width .5s ease}
  .hint{font-size:11px;color:rgba(139,100,9,.45);letter-spacing:.5px}

  .btn-retry{display:block;width:100%;padding:15px;background:linear-gradient(135deg,var(--gold-d),var(--gold-l));color:#fff;border:none;border-radius:10px;font-family:var(--ff);font-size:14px;font-weight:700;cursor:pointer;margin-top:1.5rem;transition:all .2s;box-shadow:0 4px 16px rgba(184,134,11,.3)}
  .btn-retry:hover{transform:translateY(-1px)}
  .btn-home{display:block;width:100%;padding:13px;background:transparent;color:var(--gold-d);border:1.5px solid rgba(184,134,11,.3);border-radius:10px;font-family:var(--ff);font-size:13px;font-weight:600;cursor:pointer;margin-top:.75rem;transition:all .2s}
  .btn-home:hover{background:rgba(184,134,11,.06);border-color:var(--gold)}
`
