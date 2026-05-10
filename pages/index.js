// pages/index.js — Landing Page com botões conectados ao Asaas
import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Landing() {
  const router = useRouter()
  const [loading, setLoading] = useState({ monthly: false, annual: false })
  const [user, setUser] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => setUser(d.user))
  }, [])

  async function handlePlan(plan) {
    setError('')

    // Se não estiver logado, manda para o login
    if (!user) {
      router.push(`/login?redirect=/#pricing&plan=${plan}`)
      return
    }

    setLoading(l => ({ ...l, [plan]: true }))
    try {
      const res = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao criar pagamento.')
      if (data.checkoutUrl) {
        // Abre o checkout Asaas em nova aba e redireciona para página de espera
        window.open(data.checkoutUrl, '_blank', 'noopener')
        // Redireciona para a página de polling que aguarda o webhook
        router.push('/pagamento-pendente')
      } else {
        throw new Error('URL de pagamento não retornada.')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(l => ({ ...l, [plan]: false }))
    }
  }

  return (
    <>
      <Head>
        <title>Lunzi Evolution 2026 — Transforme Seus Hábitos</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&display=swap" rel="stylesheet" />
      </Head>
      <style>{CSS}</style>

      {/* NAV */}
      <nav className="nav">
        <div className="nav-brand">✦ Lunzi Evolution</div>
        <div className="nav-right">
          {user ? (
            <>
              <span className="nav-user">Olá, {user.name}</span>
              <a href="/app" className="btn-nav-cta">Acessar plataforma →</a>
            </>
          ) : (
            <>
              <a href="/login" className="nav-link">Entrar</a>
              <a href="#pricing" className="btn-nav-cta">Começar agora</a>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-dots" />
        <div className="hero-content">
          <div className="badge"><span className="badge-dot" /> Plataforma de hábitos</div>
          <h1 className="hero-title">
            Você sabe o que quer.<br />
            <span className="gold-gradient">Falta constância.</span>
          </h1>
          <p className="hero-sub">
            Cada dia sem disciplina é um dia roubado da pessoa que você quer se tornar.
            A Lunzi Evolution foi criada para te acompanhar em{' '}
            <strong>cada pequeno passo</strong>.
          </p>
          <a href="#pricing" className="btn-hero">✦ Quero transformar minha vida</a>
          <div className="hero-stats">
            <div className="stat"><div className="stat-num">2.400+</div><div className="stat-lbl">Usuárias ativas</div></div>
            <div className="stat-div" />
            <div className="stat"><div className="stat-num">87%</div><div className="stat-lbl">Mantêm hábitos por 30 dias</div></div>
            <div className="stat-div" />
            <div className="stat"><div className="stat-num">53</div><div className="stat-lbl">Semanas de suporte</div></div>
          </div>
        </div>
      </section>

      {/* PAIN */}
      <section className="section bg-mid">
        <div className="container">
          <div className="section-head">
            <div className="section-tag">Você se reconhece aqui?</div>
            <h2 className="section-title cream">Isso tem nome:<br /><span className="gold">é falta de sistema.</span></h2>
            <p className="section-sub muted">Não é preguiça. Não é fraqueza. É que sem uma estrutura clara, qualquer hábito quebra no terceiro dia.</p>
          </div>
          <div className="grid-3">
            {[
              { icon: '😮‍💨', title: 'Segunda-feira que nunca começa', text: 'Você planeja, se anima… e na terça já esqueceu. O ciclo de culpa começa de novo.' },
              { icon: '📋', title: 'Listas que não funcionam', text: 'Cadernos, apps, planilhas — você começa tudo mas não continua nada.' },
              { icon: '💭', title: 'Sabe o que quer, mas não age', text: 'A versão que você sonha existir continua esperando. E cada dia que passa, dói mais.' },
            ].map((c, i) => (
              <div className="pain-card" key={i}>
                <div className="pain-icon">{c.icon}</div>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SOLUTION */}
      <section className="section bg-cream">
        <div className="container">
          <div className="section-head">
            <div className="section-tag dark">A solução</div>
            <h2 className="section-title dark">Constância não é força de vontade.<br /><span className="gold-d">É método.</span></h2>
          </div>
          <div className="grid-3">
            {[
              { num: '01', icon: '🎯', title: 'Defina seus hábitos', text: 'Escolha até 15 hábitos que realmente importam. Simples, objetivos e realizáveis todo dia.' },
              { num: '02', icon: '✅', title: 'Marque cada dia', text: 'Um toque na tela e o hábito está registrado. Você vê seu progresso em tempo real.' },
              { num: '03', icon: '📈', title: 'Evolua todo mês', text: 'Relatórios mensais mostram exatamente onde você cresceu e onde ainda pode melhorar.' },
            ].map((c, i) => (
              <div className="sol-card" key={i}>
                <div className="sol-num">{c.num}</div>
                <div className="sol-icon">{c.icon}</div>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BEFORE / AFTER */}
      <section className="section bg-cream">
        <div className="container">
          <div className="section-head">
            <div className="section-tag dark">Transformação real</div>
            <h2 className="section-title dark">Como sua vida muda<br /><span className="gold-d">em 30 dias</span></h2>
          </div>
          <div className="ba-grid">
            <div className="ba-card ba-before">
              <div className="ba-header-label before-label">✗ Antes da Lunzi</div>
              <ul>
                {['Começa e abandona hábitos toda semana','Não sabe quanto realmente evoluiu','Se compara com outras e se cobra demais','Culpa e vergonha quando falha','A vida que sonha parece impossível'].map((t,i) => <li key={i}><span>✗</span>{t}</li>)}
              </ul>
            </div>
            <div className="ba-card ba-after">
              <div className="ba-header-label after-label">✦ Com a Lunzi Evolution</div>
              <ul>
                {['Rotina consistente, dia após dia','Relatórios que mostram sua evolução real','Foco no seu progresso, no seu ritmo','Clareza e orgulho a cada semana cumprida','A sua melhor versão se tornando realidade'].map((t,i) => <li key={i}><span>✓</span>{t}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section bg-mid">
        <div className="container">
          <div className="section-head">
            <div className="section-tag">Depoimentos</div>
            <h2 className="section-title cream">Elas já começaram.<br /><span className="gold">E não param mais.</span></h2>
          </div>
          <div className="grid-3">
            {[
              { ini: 'A', name: 'Amanda R.', role: 'Empreendedora, SP', text: 'Nunca consegui manter hábitos por mais de duas semanas. Com a Lunzi, já são 3 meses seguidos. Mudou minha autoestima completamente.' },
              { ini: 'C', name: 'Carol M.', role: 'Professora, MG', text: 'O relatório semanal me fez perceber que eu estava cumprindo 80% dos meus hábitos — e nem sabia. Isso me deu força pra continuar.' },
              { ini: 'J', name: 'Julia F.', role: 'Nutricionista, RJ', text: 'Simples, bonita e funciona de verdade. Uso todo dia no celular, é parte da minha manhã agora.' },
            ].map((t, i) => (
              <div className="testi" key={i}>
                <div className="testi-stars">★★★★★</div>
                <p className="testi-text">"{t.text}"</p>
                <div className="testi-author">
                  <div className="testi-avatar">{t.ini}</div>
                  <div><div className="testi-name">{t.name}</div><div className="testi-role">{t.role}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="section bg-dark" id="pricing">
        <div className="container">
          <div className="section-head">
            <div className="section-tag">Planos</div>
            <h2 className="section-title cream">Escolha seu plano.<br /><span className="gold">Comece hoje.</span></h2>
            <p className="section-sub muted">Sem pegadinhas. Cancele quando quiser.</p>
          </div>

          {error && <div className="error-box">{error}</div>}

          <div className="pricing-grid">
            {/* MENSAL */}
            <div className="price-card">
              <div className="price-plan">Plano Mensal</div>
              <div className="price-row">
                <span className="price-pre">R$</span>
                <span className="price-num">24,90</span>
                <span className="price-period">/mês</span>
              </div>
              <p className="price-desc">12x de R$&nbsp;24,90 · cobrado mensalmente.<br />Cancele quando quiser.</p>
              <ul className="price-feats">
                {['Tracker anual completo 2026','Até 15 hábitos simultâneos','Relatórios semanais e mensais','Acesso mobile e desktop','Login seguro e privado'].map((f,i) => (
                  <li key={i}><span className="check">✓</span>{f}</li>
                ))}
              </ul>
              <button
                className="btn-buy btn-buy-outline"
                onClick={() => handlePlan('monthly')}
                disabled={loading.monthly}
              >
                {loading.monthly ? 'Aguarde...' : 'Assinar plano mensal →'}
              </button>
              <div className="asaas-badge">Pagamento seguro via <span className="asaas-logo">ASAAS</span></div>
            </div>

            {/* ANUAL */}
            <div className="price-card price-featured">
              <div className="feat-badge">⭐ Melhor valor</div>
              <div className="price-plan">Plano Anual</div>
              <div className="price-row">
                <span className="price-pre">R$</span>
                <span className="price-num price-gold">99,90</span>
                <span className="price-period">/ano</span>
              </div>
              <p className="price-desc">Pagamento único · Equivale a R$&nbsp;8,32/mês</p>
              <div className="savings-tag">🎉 Economize R$&nbsp;198,90 vs mensal</div>
              <ul className="price-feats">
                {['Tracker anual completo 2026','Até 15 hábitos simultâneos','Relatórios semanais e mensais','Acesso mobile e desktop','Login seguro e privado','Acesso garantido o ano todo','Prioridade em novas funcionalidades'].map((f,i) => (
                  <li key={i}><span className="check">✓</span>{f}</li>
                ))}
              </ul>
              <button
                className="btn-buy btn-buy-primary"
                onClick={() => handlePlan('annual')}
                disabled={loading.annual}
              >
                {loading.annual ? 'Aguarde...' : '✦ Garantir plano anual agora'}
              </button>
              <div className="asaas-badge">Pagamento seguro via <span className="asaas-logo">ASAAS</span></div>
            </div>
          </div>

          {/* GARANTIA */}
          <div className="guarantee">
            <div className="guarantee-icon">🛡️</div>
            <h3>Garantia de 7 dias</h3>
            <p>Se por qualquer motivo você não ficar satisfeita, devolvemos 100% do seu dinheiro. Sem perguntas.</p>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section bg-dark" style={{textAlign:'center',paddingTop:'5rem',paddingBottom:'5rem'}}>
        <div className="container">
          <h2 className="section-title cream" style={{marginBottom:'1rem'}}>A sua melhor versão<br /><span className="gold">está esperando por você.</span></h2>
          <p className="section-sub muted" style={{marginBottom:'2.5rem'}}>Cada dia que passa é mais um dia longe de quem você quer ser.</p>
          <a href="#pricing" className="btn-hero">✦ Quero começar agora</a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-name">✦ Lunzi Evolution</div>
        <div className="footer-tag">Disciplina · Constância · Evolução</div>
        <div className="footer-links">
          <a href="#">Termos de uso</a>
          <a href="#">Política de privacidade</a>
          <a href="/login">Entrar</a>
        </div>
        <div className="footer-copy">© 2026 Lunzi Evolution. Todos os direitos reservados.</div>
      </footer>
    </>
  )
}

const CSS = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --gold:#B8860B;--gold-l:#CFA022;--gold-d:#8B6409;--gold-xl:#E8C050;
    --cream:#F5EFE6;--dark:#0F0C06;--dark2:#13100A;
    --text:#2C2010;--text-m:#6B5530;--text-f:#A08C60;
    --bdr:rgba(184,134,11,.2);--bdr-s:rgba(184,134,11,.4);
    --ff:'Plus Jakarta Sans',system-ui,sans-serif;
    --serif:'Cormorant Garamond',Georgia,serif;
    --r:14px;--r-pill:999px;
  }
  html{font-size:16px;scroll-behavior:smooth}
  body{font-family:var(--ff);background:var(--dark);color:var(--cream);line-height:1.6;overflow-x:hidden}

  /* NAV */
  .nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:.875rem 1.5rem;background:rgba(15,12,6,.85);border-bottom:1px solid rgba(184,134,11,.15);backdrop-filter:blur(12px)}
  .nav-brand{font-weight:800;color:var(--gold-l);font-size:15px;letter-spacing:.5px}
  .nav-right{display:flex;align-items:center;gap:12px}
  .nav-link{font-size:13px;color:rgba(245,239,230,.6);text-decoration:none;font-weight:500}
  .nav-link:hover{color:var(--gold-l)}
  .nav-user{font-size:13px;color:var(--gold-l);font-weight:600}
  .btn-nav-cta{padding:9px 18px;background:linear-gradient(135deg,var(--gold-d),var(--gold-l));color:#fff;border:none;border-radius:var(--r-pill);font-family:var(--ff);font-size:12px;font-weight:700;letter-spacing:.5px;cursor:pointer;text-decoration:none;transition:all .2s;box-shadow:0 4px 16px rgba(184,134,11,.4)}
  .btn-nav-cta:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(184,134,11,.5)}

  /* HERO */
  .hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:7rem 1.5rem 5rem;position:relative;overflow:hidden}
  .hero-bg{position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 0%,rgba(184,134,11,.18) 0%,transparent 70%),linear-gradient(180deg,#0F0C06 0%,#1A1408 100%)}
  .hero-dots{position:absolute;inset:0;background-image:radial-gradient(rgba(184,134,11,.15) 1px,transparent 1px);background-size:32px 32px;mask-image:radial-gradient(ellipse 80% 60% at 50% 30%,black 0%,transparent 100%)}
  .hero-content{position:relative;z-index:1;max-width:800px}
  .badge{display:inline-flex;align-items:center;gap:8px;padding:6px 16px;border-radius:var(--r-pill);background:rgba(184,134,11,.12);border:1px solid rgba(184,134,11,.3);font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--gold-l);margin-bottom:2rem}
  .badge-dot{width:6px;height:6px;border-radius:50%;background:var(--gold-l);animation:pulse 2s infinite}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}
  .hero-title{font-family:var(--serif);font-size:clamp(40px,9vw,84px);font-weight:600;line-height:1.05;color:var(--cream);margin-bottom:1.25rem}
  .gold-gradient{background:linear-gradient(135deg,var(--gold-d) 0%,var(--gold-xl) 50%,var(--gold-l) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;display:block}
  .gold{color:var(--gold-l)}
  .gold-d{color:var(--gold-d)}
  .hero-sub{font-size:clamp(16px,2.5vw,19px);color:rgba(245,239,230,.65);max-width:560px;margin:0 auto 2.5rem;line-height:1.75}
  .hero-sub strong{color:var(--gold-l);font-weight:600}
  .btn-hero{display:inline-flex;align-items:center;gap:10px;padding:18px 40px;background:linear-gradient(135deg,var(--gold-d) 0%,var(--gold-l) 60%,var(--gold-xl) 100%);color:#fff;border:none;border-radius:var(--r-pill);font-family:var(--ff);font-size:16px;font-weight:800;letter-spacing:1px;cursor:pointer;text-decoration:none;transition:all .25s;box-shadow:0 6px 32px rgba(184,134,11,.5)}
  .btn-hero:hover{transform:translateY(-3px);box-shadow:0 12px 40px rgba(184,134,11,.55)}
  .hero-stats{display:flex;gap:2rem;justify-content:center;margin-top:4rem;flex-wrap:wrap}
  .stat{text-align:center}
  .stat-num{font-family:var(--serif);font-size:30px;font-weight:600;color:var(--gold-l);line-height:1}
  .stat-lbl{font-size:11px;color:rgba(245,239,230,.4);margin-top:4px}
  .stat-div{width:1px;height:40px;background:rgba(184,134,11,.25);align-self:center}

  /* SECTIONS */
  .section{padding:5.5rem 0}
  .bg-dark{background:var(--dark)}
  .bg-mid{background:#13100A}
  .bg-cream{background:var(--cream);color:var(--text)}
  .container{max-width:1080px;margin:0 auto;padding:0 1.25rem}
  .section-head{text-align:center;margin-bottom:3rem}
  .section-tag{font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--gold);margin-bottom:.75rem}
  .section-tag.dark{color:var(--gold-d)}
  .section-title{font-family:var(--serif);font-size:clamp(30px,5vw,52px);font-weight:600;line-height:1.15;margin-bottom:1rem}
  .section-title.cream{color:var(--cream)}
  .section-title.dark{color:var(--text)}
  .section-sub{font-size:17px;line-height:1.75;max-width:560px;margin:0 auto}
  .section-sub.muted{color:rgba(245,239,230,.5)}

  /* GRIDS */
  .grid-3{display:grid;grid-template-columns:1fr;gap:1rem}
  @media(min-width:640px){.grid-3{grid-template-columns:1fr 1fr}}
  @media(min-width:900px){.grid-3{grid-template-columns:repeat(3,1fr)}}

  /* PAIN */
  .pain-card{display:flex;align-items:flex-start;gap:1rem;padding:1.5rem;background:rgba(255,255,255,.03);border:1px solid rgba(184,134,11,.12);border-radius:var(--r);transition:all .2s}
  .pain-card:hover{background:rgba(184,134,11,.05);border-color:rgba(184,134,11,.25)}
  .pain-icon{font-size:26px;flex-shrink:0}
  .pain-card h3{font-size:15px;font-weight:700;color:var(--cream);margin-bottom:4px}
  .pain-card p{font-size:13px;color:rgba(245,239,230,.5);line-height:1.6}

  /* SOLUTION */
  .sol-card{padding:1.75rem;background:#fff;border:1px solid rgba(184,134,11,.18);border-radius:var(--r);position:relative;overflow:hidden;box-shadow:0 4px 20px rgba(140,100,10,.07)}
  .sol-card::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(90deg,transparent,var(--gold),transparent)}
  .sol-num{font-family:var(--serif);font-size:44px;font-weight:600;color:rgba(184,134,11,.12);position:absolute;top:12px;right:16px;line-height:1}
  .sol-icon{font-size:28px;margin-bottom:.75rem}
  .sol-card h3{font-size:17px;font-weight:700;color:var(--text);margin-bottom:.5rem}
  .sol-card p{font-size:13px;color:var(--text-m);line-height:1.7}

  /* BEFORE AFTER */
  .ba-grid{display:grid;grid-template-columns:1fr;gap:1.25rem}
  @media(min-width:640px){.ba-grid{grid-template-columns:1fr 1fr}}
  .ba-card{background:#fff;border:1px solid var(--bdr);border-radius:var(--r);overflow:hidden}
  .ba-header-label{padding:1rem 1.5rem;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase}
  .before-label{background:#F5E8E8;color:#A04040}
  .after-label{background:rgba(184,134,11,.1);color:var(--gold-d)}
  .ba-card ul{list-style:none;padding:1.25rem 1.5rem;display:flex;flex-direction:column;gap:10px}
  .ba-before ul li{display:flex;gap:10px;font-size:14px;font-weight:500;color:#6B3030}
  .ba-before ul li span{color:#C04040;font-weight:700;flex-shrink:0}
  .ba-after ul li{display:flex;gap:10px;font-size:14px;font-weight:500;color:var(--text-m)}
  .ba-after ul li span{color:var(--gold-d);font-weight:700;font-size:16px;flex-shrink:0}

  /* TESTIMONIALS */
  .testi{padding:1.75rem;background:rgba(255,255,255,.03);border:1px solid rgba(184,134,11,.15);border-radius:var(--r)}
  .testi-stars{color:var(--gold-l);font-size:14px;letter-spacing:2px;margin-bottom:.75rem}
  .testi-text{font-family:var(--serif);font-size:17px;font-style:italic;color:rgba(245,239,230,.8);line-height:1.65;margin-bottom:1.25rem}
  .testi-author{display:flex;align-items:center;gap:12px}
  .testi-avatar{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,var(--gold-d),var(--gold-l));display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;color:#fff;flex-shrink:0}
  .testi-name{font-size:14px;font-weight:700;color:var(--cream)}
  .testi-role{font-size:12px;color:rgba(245,239,230,.4)}

  /* PRICING */
  .pricing-grid{display:grid;grid-template-columns:1fr;gap:1.5rem;max-width:800px;margin:0 auto}
  @media(min-width:640px){.pricing-grid{grid-template-columns:1fr 1fr}}
  .price-card{padding:2rem 1.75rem;background:rgba(255,255,255,.03);border:1px solid rgba(184,134,11,.2);border-radius:20px;position:relative;transition:all .3s}
  .price-card:hover{border-color:rgba(184,134,11,.4);transform:translateY(-4px)}
  .price-featured{background:rgba(184,134,11,.08);border:2px solid var(--gold);box-shadow:0 0 0 1px rgba(184,134,11,.15),0 20px 60px rgba(184,134,11,.2)}
  .feat-badge{position:absolute;top:-14px;left:50%;transform:translateX(-50%);padding:5px 18px;border-radius:var(--r-pill);background:linear-gradient(135deg,var(--gold-d),var(--gold-l));font-size:11px;font-weight:800;letter-spacing:1.5px;text-transform:uppercase;color:#fff;white-space:nowrap;box-shadow:0 4px 16px rgba(184,134,11,.5)}
  .price-plan{font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--gold);margin-bottom:.75rem}
  .price-row{display:flex;align-items:flex-end;gap:4px;margin-bottom:.5rem;flex-wrap:wrap}
  .price-pre{font-size:16px;font-weight:600;color:rgba(245,239,230,.5);align-self:flex-start;margin-top:8px}
  .price-num{font-family:var(--serif);font-size:52px;font-weight:600;line-height:1;color:var(--cream)}
  .price-gold{background:linear-gradient(135deg,var(--gold-d),var(--gold-xl));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  .price-period{font-size:14px;color:rgba(245,239,230,.4);align-self:flex-end;margin-bottom:8px;font-weight:500}
  .price-desc{font-size:13px;color:rgba(245,239,230,.4);margin-bottom:1.25rem;line-height:1.6}
  .savings-tag{display:inline-block;padding:5px 14px;border-radius:var(--r-pill);background:rgba(184,134,11,.15);border:1px solid rgba(184,134,11,.3);font-size:12px;font-weight:700;color:var(--gold-l);margin-bottom:1.25rem}
  .price-feats{list-style:none;display:flex;flex-direction:column;gap:10px;margin-bottom:2rem}
  .price-feats li{display:flex;align-items:center;gap:10px;font-size:14px;color:rgba(245,239,230,.75);font-weight:500}
  .check{width:20px;height:20px;border-radius:50%;background:linear-gradient(135deg,var(--gold-d),var(--gold-l));display:inline-flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0}
  .btn-buy{display:block;width:100%;padding:17px;border:none;border-radius:var(--r-pill);font-family:var(--ff);font-size:15px;font-weight:800;cursor:pointer;text-align:center;transition:all .25s}
  .btn-buy:disabled{opacity:.6;cursor:not-allowed;transform:none!important}
  .btn-buy-primary{background:linear-gradient(135deg,var(--gold-d) 0%,var(--gold-l) 60%,var(--gold-xl) 100%);color:#fff;box-shadow:0 6px 28px rgba(184,134,11,.5)}
  .btn-buy-primary:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 10px 36px rgba(184,134,11,.55)}
  .btn-buy-outline{background:transparent;color:var(--gold-l);border:1.5px solid rgba(184,134,11,.4)}
  .btn-buy-outline:hover:not(:disabled){background:rgba(184,134,11,.08);border-color:var(--gold);color:var(--gold-xl)}
  .asaas-badge{display:flex;align-items:center;justify-content:center;gap:8px;margin-top:.875rem;font-size:11px;color:rgba(245,239,230,.3)}
  .asaas-logo{background:#00B4D8;border-radius:4px;padding:2px 7px;font-size:10px;font-weight:800;color:#fff;letter-spacing:.5px}
  .error-box{background:rgba(200,60,60,.12);border:1px solid rgba(200,60,60,.3);border-radius:10px;padding:14px 18px;text-align:center;font-size:14px;color:#F09080;margin-bottom:2rem;max-width:600px;margin-left:auto;margin-right:auto}

  /* GUARANTEE */
  .guarantee{margin-top:3rem;padding:2rem;text-align:center;border:1px solid rgba(184,134,11,.2);border-radius:var(--r);background:rgba(184,134,11,.04)}
  .guarantee-icon{font-size:48px;margin-bottom:.75rem}
  .guarantee h3{font-family:var(--serif);font-size:24px;font-weight:600;color:var(--cream);margin-bottom:.5rem}
  .guarantee p{font-size:14px;color:rgba(245,239,230,.5);max-width:460px;margin:0 auto;line-height:1.7}

  /* FOOTER */
  .footer{background:#0A0804;border-top:1px solid rgba(184,134,11,.12);padding:3rem 1.25rem;text-align:center}
  .footer-name{font-size:15px;font-weight:700;color:var(--gold);margin-bottom:.5rem}
  .footer-tag{font-size:10px;letter-spacing:3px;text-transform:uppercase;color:rgba(184,134,11,.35);margin-bottom:1.5rem}
  .footer-links{display:flex;gap:1.5rem;justify-content:center;flex-wrap:wrap;margin-bottom:1.5rem}
  .footer-links a{font-size:12px;color:rgba(245,239,230,.3);text-decoration:none;transition:color .15s}
  .footer-links a:hover{color:var(--gold-l)}
  .footer-copy{font-size:11px;color:rgba(245,239,230,.18)}
`
