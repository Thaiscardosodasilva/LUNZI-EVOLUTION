// pages/app.js — Área protegida: só usuários com assinatura ativa acessam
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

// ── Dados de semanas (53 semanas de 2026) ──────────────────────────────
const ALL_WEEKS=[
  {wi:0,month:1,label:'Week 01',dates:'01/01-04/01',days:['Q 01','S 02','S 03','D 04']},
  {wi:1,month:1,label:'Week 02',dates:'05/01-11/01',days:['S 05','T 06','Q 07','Q 08','S 09','S 10','D 11']},
  {wi:2,month:1,label:'Week 03',dates:'12/01-18/01',days:['S 12','T 13','Q 14','Q 15','S 16','S 17','D 18']},
  {wi:3,month:1,label:'Week 04',dates:'19/01-25/01',days:['S 19','T 20','Q 21','Q 22','S 23','S 24','D 25']},
  {wi:4,month:1,label:'Week 05',dates:'26/01-01/02',days:['S 26','T 27','Q 28','Q 29','S 30','S 31','D 01']},
  {wi:5,month:2,label:'Week 06',dates:'02/02-08/02',days:['S 02','T 03','Q 04','Q 05','S 06','S 07','D 08']},
  {wi:6,month:2,label:'Week 07',dates:'09/02-15/02',days:['S 09','T 10','Q 11','Q 12','S 13','S 14','D 15']},
  {wi:7,month:2,label:'Week 08',dates:'16/02-22/02',days:['S 16','T 17','Q 18','Q 19','S 20','S 21','D 22']},
  {wi:8,month:2,label:'Week 09',dates:'23/02-01/03',days:['S 23','T 24','Q 25','Q 26','S 27','S 28','D 01']},
  {wi:9,month:3,label:'Week 10',dates:'02/03-08/03',days:['S 02','T 03','Q 04','Q 05','S 06','S 07','D 08']},
  {wi:10,month:3,label:'Week 11',dates:'09/03-15/03',days:['S 09','T 10','Q 11','Q 12','S 13','S 14','D 15']},
  {wi:11,month:3,label:'Week 12',dates:'16/03-22/03',days:['S 16','T 17','Q 18','Q 19','S 20','S 21','D 22']},
  {wi:12,month:3,label:'Week 13',dates:'23/03-29/03',days:['S 23','T 24','Q 25','Q 26','S 27','S 28','D 29']},
  {wi:13,month:4,label:'Week 14',dates:'30/03-05/04',days:['S 30','T 31','Q 01','Q 02','S 03','S 04','D 05']},
  {wi:14,month:4,label:'Week 15',dates:'06/04-12/04',days:['S 06','T 07','Q 08','Q 09','S 10','S 11','D 12']},
  {wi:15,month:4,label:'Week 16',dates:'13/04-19/04',days:['S 13','T 14','Q 15','Q 16','S 17','S 18','D 19']},
  {wi:16,month:4,label:'Week 17',dates:'20/04-26/04',days:['S 20','T 21','Q 22','Q 23','S 24','S 25','D 26']},
  {wi:17,month:4,label:'Week 18',dates:'27/04-03/05',days:['S 27','T 28','Q 29','Q 30','S 01','S 02','D 03']},
  {wi:18,month:5,label:'Week 19',dates:'04/05-10/05',days:['S 04','T 05','Q 06','Q 07','S 08','S 09','D 10']},
  {wi:19,month:5,label:'Week 20',dates:'11/05-17/05',days:['S 11','T 12','Q 13','Q 14','S 15','S 16','D 17']},
  {wi:20,month:5,label:'Week 21',dates:'18/05-24/05',days:['S 18','T 19','Q 20','Q 21','S 22','S 23','D 24']},
  {wi:21,month:5,label:'Week 22',dates:'25/05-31/05',days:['S 25','T 26','Q 27','Q 28','S 29','S 30','D 31']},
  {wi:22,month:6,label:'Week 23',dates:'01/06-07/06',days:['S 01','T 02','Q 03','Q 04','S 05','S 06','D 07']},
  {wi:23,month:6,label:'Week 24',dates:'08/06-14/06',days:['S 08','T 09','Q 10','Q 11','S 12','S 13','D 14']},
  {wi:24,month:6,label:'Week 25',dates:'15/06-21/06',days:['S 15','T 16','Q 17','Q 18','S 19','S 20','D 21']},
  {wi:25,month:6,label:'Week 26',dates:'22/06-28/06',days:['S 22','T 23','Q 24','Q 25','S 26','S 27','D 28']},
  {wi:26,month:7,label:'Week 27',dates:'29/06-05/07',days:['S 29','T 30','Q 01','Q 02','S 03','S 04','D 05']},
  {wi:27,month:7,label:'Week 28',dates:'06/07-12/07',days:['S 06','T 07','Q 08','Q 09','S 10','S 11','D 12']},
  {wi:28,month:7,label:'Week 29',dates:'13/07-19/07',days:['S 13','T 14','Q 15','Q 16','S 17','S 18','D 19']},
  {wi:29,month:7,label:'Week 30',dates:'20/07-26/07',days:['S 20','T 21','Q 22','Q 23','S 24','S 25','D 26']},
  {wi:30,month:7,label:'Week 31',dates:'27/07-02/08',days:['S 27','T 28','Q 29','Q 30','S 31','S 01','D 02']},
  {wi:31,month:8,label:'Week 32',dates:'03/08-09/08',days:['S 03','T 04','Q 05','Q 06','S 07','S 08','D 09']},
  {wi:32,month:8,label:'Week 33',dates:'10/08-16/08',days:['S 10','T 11','Q 12','Q 13','S 14','S 15','D 16']},
  {wi:33,month:8,label:'Week 34',dates:'17/08-23/08',days:['S 17','T 18','Q 19','Q 20','S 21','S 22','D 23']},
  {wi:34,month:8,label:'Week 35',dates:'24/08-30/08',days:['S 24','T 25','Q 26','Q 27','S 28','S 29','D 30']},
  {wi:35,month:9,label:'Week 36',dates:'31/08-06/09',days:['S 31','T 01','Q 02','Q 03','S 04','S 05','D 06']},
  {wi:36,month:9,label:'Week 37',dates:'07/09-13/09',days:['S 07','T 08','Q 09','Q 10','S 11','S 12','D 13']},
  {wi:37,month:9,label:'Week 38',dates:'14/09-20/09',days:['S 14','T 15','Q 16','Q 17','S 18','S 19','D 20']},
  {wi:38,month:9,label:'Week 39',dates:'21/09-27/09',days:['S 21','T 22','Q 23','Q 24','S 25','S 26','D 27']},
  {wi:39,month:10,label:'Week 40',dates:'28/09-04/10',days:['S 28','T 29','Q 30','Q 01','S 02','S 03','D 04']},
  {wi:40,month:10,label:'Week 41',dates:'05/10-11/10',days:['S 05','T 06','Q 07','Q 08','S 09','S 10','D 11']},
  {wi:41,month:10,label:'Week 42',dates:'12/10-18/10',days:['S 12','T 13','Q 14','Q 15','S 16','S 17','D 18']},
  {wi:42,month:10,label:'Week 43',dates:'19/10-25/10',days:['S 19','T 20','Q 21','Q 22','S 23','S 24','D 25']},
  {wi:43,month:10,label:'Week 44',dates:'26/10-01/11',days:['S 26','T 27','Q 28','Q 29','S 30','S 31','D 01']},
  {wi:44,month:11,label:'Week 45',dates:'02/11-08/11',days:['S 02','T 03','Q 04','Q 05','S 06','S 07','D 08']},
  {wi:45,month:11,label:'Week 46',dates:'09/11-15/11',days:['S 09','T 10','Q 11','Q 12','S 13','S 14','D 15']},
  {wi:46,month:11,label:'Week 47',dates:'16/11-22/11',days:['S 16','T 17','Q 18','Q 19','S 20','S 21','D 22']},
  {wi:47,month:11,label:'Week 48',dates:'23/11-29/11',days:['S 23','T 24','Q 25','Q 26','S 27','S 28','D 29']},
  {wi:48,month:12,label:'Week 49',dates:'30/11-06/12',days:['S 30','T 01','Q 02','Q 03','S 04','S 05','D 06']},
  {wi:49,month:12,label:'Week 50',dates:'07/12-13/12',days:['S 07','T 08','Q 09','Q 10','S 11','S 12','D 13']},
  {wi:50,month:12,label:'Week 51',dates:'14/12-20/12',days:['S 14','T 15','Q 16','Q 17','S 18','S 19','D 20']},
  {wi:51,month:12,label:'Week 52',dates:'21/12-27/12',days:['S 21','T 22','Q 23','Q 24','S 25','S 26','D 27']},
  {wi:52,month:12,label:'Week 53',dates:'28/12-31/12',days:['S 28','T 29','Q 30','Q 31']},
]
const MONTHS=[
  {m:1,name:'Janeiro',abbr:'Jan',weeks:[0,1,2,3,4]},
  {m:2,name:'Fevereiro',abbr:'Fev',weeks:[5,6,7,8]},
  {m:3,name:'Março',abbr:'Mar',weeks:[9,10,11,12]},
  {m:4,name:'Abril',abbr:'Abr',weeks:[13,14,15,16,17]},
  {m:5,name:'Maio',abbr:'Mai',weeks:[18,19,20,21]},
  {m:6,name:'Junho',abbr:'Jun',weeks:[22,23,24,25]},
  {m:7,name:'Julho',abbr:'Jul',weeks:[26,27,28,29,30]},
  {m:8,name:'Agosto',abbr:'Ago',weeks:[31,32,33,34]},
  {m:9,name:'Setembro',abbr:'Set',weeks:[35,36,37,38]},
  {m:10,name:'Outubro',abbr:'Out',weeks:[39,40,41,42,43]},
  {m:11,name:'Novembro',abbr:'Nov',weeks:[44,45,46,47]},
  {m:12,name:'Dezembro',abbr:'Dez',weeks:[48,49,50,51,52]},
]

function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')}
function lsGet(k,fb=null){try{const v=localStorage.getItem(k);return v?JSON.parse(v):fb}catch{return fb}}
function lsSet(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}

export default function App() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [tab, setTab] = useState('tracker')
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()+1)
  const [currentWi, setCurrentWi] = useState(0)
  const [habits, setHabits] = useState([])
  const [checks, setChecks] = useState({})
  const [habitInput, setHabitInput] = useState('')

  // ── Auth guard ──
  useEffect(() => {
    fetch('/api/auth/me').then(r=>r.json()).then(d=>{
      if (!d.user) { router.replace('/login'); return }
      if (!d.user.accessActive) { router.replace('/#pricing'); return }
      setUser(d.user)
      // Load data from localStorage keyed by userId
      const savedHabits = lsGet(`lz_habits_${d.user.id}`, [])
      const savedChecks = lsGet(`lz_checks_${d.user.id}`, {})
      setHabits(savedHabits)
      setChecks(savedChecks)
      // default week
      const mo = MONTHS.find(m=>m.m===currentMonth)
      if(mo) setCurrentWi(mo.weeks[0])
      setAuthLoading(false)
    })
  }, [])

  function saveHabits(h){ setHabits(h); if(user) lsSet(`lz_habits_${user.id}`, h) }
  function saveChecks(c){ setChecks(c); if(user) lsSet(`lz_checks_${user.id}`, c) }

  function addHabit(){
    const v=habitInput.trim()
    if(!v||habits.length>=15)return
    const next=[...habits,v]; saveHabits(next); setHabitInput('')
  }
  function removeHabit(i){ const next=habits.filter((_,idx)=>idx!==i); saveHabits(next) }

  function isChecked(wi,di,hi){ return !!(checks[wi]&&checks[wi][di]&&checks[wi][di][hi]) }
  function toggleCheck(wi,di,hi){
    const c={...checks}
    if(!c[wi])c[wi]={}
    if(!c[wi][di])c[wi][di]={}
    c[wi][di][hi]=!c[wi][di][hi]
    saveChecks(c)
  }

  function selectMonth(m){
    setCurrentMonth(m)
    const mo=MONTHS.find(x=>x.m===m)
    if(mo) setCurrentWi(mo.weeks[0])
  }

  async function logout(){
    await fetch('/api/auth/logout',{method:'POST'})
    router.push('/')
  }

  if(authLoading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',minHeight:'100vh',background:'#F5EFE6',fontFamily:'system-ui',color:'#B8860B',fontSize:'16px'}}>Carregando...</div>

  const curMo = MONTHS.find(m=>m.m===currentMonth)
  const curWk = ALL_WEEKS[currentWi]

  // Compute week summary
  const nH=habits.length, nD=curWk?.days?.length||0
  let weekTotal=0
  habits.forEach((_,hi)=>curWk?.days?.forEach((_,di)=>{if(isChecked(currentWi,di,hi))weekTotal++}))
  const possible=nH*nD
  const pct=possible>0?Math.round((weekTotal/possible)*100):0

  // Month report
  const monthWeekData=(curMo?.weeks||[]).map(wi=>{
    const wk=ALL_WEEKS[wi]; const nd=wk.days.length; const pos=nH*nd
    let tot=0
    habits.forEach((_,hi)=>wk.days.forEach((_,di)=>{if(isChecked(wi,di,hi))tot++}))
    return{wi,label:wk.label,dates:wk.dates,total:tot,possible:pos,nd}
  })
  const mTotal=monthWeekData.reduce((a,w)=>a+w.total,0)
  const mPossible=monthWeekData.reduce((a,w)=>a+w.possible,0)
  const mPct=mPossible>0?Math.round((mTotal/mPossible)*100):0

  return (
    <>
      <Head>
        <title>Lunzi Evolution 2026 — Plataforma</title>
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,500;0,600&display=swap" rel="stylesheet"/>
      </Head>
      <style>{APP_CSS}</style>

      {/* TOPBAR */}
      <header className="topbar">
        <div className="tb-logo"><span className="tb-star">✦</span><span className="tb-name">Lunzi Evolution</span></div>
        <div className="tb-right">
          <span className="tb-greet">Olá, {user?.name?.split(' ')[0]} ✦</span>
          <button className="btn-logout" onClick={logout}>Sair</button>
        </div>
      </header>

      {/* MONTH PILLS */}
      <div className="month-scroller">
        <div className="month-strip">
          {MONTHS.map(m=>(
            <button key={m.m} className={`month-pill${m.m===currentMonth?' active':''}`} onClick={()=>selectMonth(m.m)}>{m.abbr}</button>
          ))}
        </div>
      </div>

      {/* MAIN */}
      <main className="main">

        {/* BOTTOM NAV */}
        <nav className="bottom-nav">
          {[{id:'tracker',icon:'◻',lbl:'Tracker'},{id:'habits',icon:'✦',lbl:'Hábitos'},{id:'report',icon:'◈',lbl:'Relatório'}].map(b=>(
            <button key={b.id} className={`bnav${tab===b.id?' active':''}`} onClick={()=>setTab(b.id)}>
              <div className="bnav-bar"/>
              <span className="bnav-icon">{b.icon}</span>
              <span className="bnav-lbl">{b.lbl}</span>
            </button>
          ))}
        </nav>

        <div className="content">

          {/* ── TRACKER ── */}
          {tab==='tracker' && (
            <div>
              <div className="panel-header">
                <div>
                  <div className="panel-month">{curMo?.name} 2026</div>
                  <div className="panel-week">{curWk?.label} · {curWk?.dates}</div>
                </div>
                <div className="week-pills">
                  {curMo?.weeks?.map((wi,idx)=>(
                    <button key={wi} className={`wpill${wi===currentWi?' active':''}`} onClick={()=>setCurrentWi(wi)}>Sem {idx+1}</button>
                  ))}
                </div>
              </div>

              {!nH ? (
                <div className="empty">Adicione hábitos na aba "Hábitos" primeiro ✦</div>
              ) : (
                <div className="table-wrap">
                  <table className="tracker-table">
                    <thead>
                      <tr>
                        <th className="th-habit">Hábito</th>
                        {curWk?.days?.map((d,i)=><th key={i}>{d.split(' ')[0]}<br/>{d.split(' ')[1]}</th>)}
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {habits.map((h,hi)=>{
                        let rowTot=0
                        return(
                          <tr key={hi}>
                            <td className="td-habit" title={h}>{h}</td>
                            {curWk?.days?.map((_,di)=>{
                              const on=isChecked(currentWi,di,hi)
                              if(on)rowTot++
                              return <td key={di}><button className={`chk${on?' on':''}`} onClick={()=>toggleCheck(currentWi,di,hi)}/></td>
                            })}
                            <td className="td-total">{rowTot}/{nD}</td>
                          </tr>
                        )
                      })}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td>Total do dia</td>
                        {curWk?.days?.map((_,di)=>{let col=0;habits.forEach((_,hi)=>{if(isChecked(currentWi,di,hi))col++});return<td key={di}>{col}/{nH}</td>})}
                        <td>{weekTotal}/{possible}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}

              <div className="sum-grid">
                <div className="sum-card">
                  <div className="sum-lbl">Total da semana</div>
                  <div className="sum-val">{weekTotal}</div>
                  <div className="sum-sub">de {possible} pontos</div>
                  <div className="pbar"><div className="pfill" style={{width:pct+'%'}}/></div>
                </div>
                <div className="sum-card">
                  <div className="sum-lbl">Percentual</div>
                  <div className="sum-val">{pct}%</div>
                  <div className="sum-sub">{pct>=90?'Semana perfeita! ✦':pct>=70?'Indo muito bem! ✦':pct>=50?'Na metade ✦':pct>=30?'Não desista! ✦':'Comece hoje! ✦'}</div>
                  <div className="pbar"><div className="pfill" style={{width:pct+'%'}}/></div>
                </div>
              </div>
            </div>
          )}

          {/* ── HÁBITOS ── */}
          {tab==='habits' && (
            <div>
              <div className="section-title-sm">Meus Hábitos</div>
              <div className="add-row">
                <input className="add-input" type="text" placeholder="Ex: Beber água, Treinar..." value={habitInput} onChange={e=>setHabitInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addHabit()} maxLength={50}/>
                <button className="btn-add" onClick={addHabit}>+ Add</button>
              </div>
              {!habits.length ? (
                <div className="empty">Adicione seus hábitos diários acima ✦</div>
              ) : (
                <div className="habits-list">
                  {habits.map((h,i)=>(
                    <div className="habit-item" key={i}>
                      <span className="h-num">{i+1}</span>
                      <span className="h-name">{h}</span>
                      <button className="btn-rm" onClick={()=>removeHabit(i)}>×</button>
                    </div>
                  ))}
                </div>
              )}
              <div className="quote-box">
                <div className="quote-text">"Constância cria identidade."</div>
                <div className="quote-sub">Pequenas ações repetidas constroem grandes transformações</div>
              </div>
            </div>
          )}

          {/* ── RELATÓRIO ── */}
          {tab==='report' && (
            <div>
              <div className="section-title-sm">Relatório — {curMo?.name} 2026</div>
              <div className="kpi-grid">
                <div className="kpi-card"><div className="kpi-val">{mPossible}</div><div className="kpi-lbl">Possível</div></div>
                <div className="kpi-card"><div className="kpi-val">{mTotal}</div><div className="kpi-lbl">Obtido</div></div>
                <div className="kpi-card"><div className="kpi-val">{mPct}%</div><div className="kpi-lbl">Desempenho</div></div>
              </div>
              {!nH ? (
                <div className="empty">Adicione hábitos para ver o relatório ✦</div>
              ) : (
                monthWeekData.map(wd=>{
                  const p=wd.possible>0?Math.round((wd.total/wd.possible)*100):0
                  return(
                    <details key={wd.wi} className="rpt-week">
                      <summary className="rpt-head">
                        <span className="rpt-ttl">{wd.label} · {wd.dates}</span>
                        <span className="rpt-pct">{wd.total}/{wd.possible} · {p}%</span>
                      </summary>
                      <div className="rpt-body">
                        {habits.map((h,hi)=>{
                          let tot=0;ALL_WEEKS[wd.wi].days.forEach((_,di)=>{if(isChecked(wd.wi,di,hi))tot++});
                          const hp=wd.nd>0?Math.round((tot/wd.nd)*100):0
                          return(
                            <div className="rh-row" key={hi}>
                              <div className="rh-name">{h}</div>
                              <div className="rh-bar"><div className="rh-fill" style={{width:hp+'%'}}/></div>
                              <div className="rh-score">{tot}/{wd.nd} · {hp}%</div>
                            </div>
                          )
                        })}
                      </div>
                    </details>
                  )
                })
              )}
            </div>
          )}

        </div>
      </main>
    </>
  )
}

const APP_CSS=`
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent}
  :root{--gold:#B8860B;--gold-l:#CFA022;--gold-d:#8B6409;--gold-p:rgba(184,134,11,.1);--cream:#F5EFE6;--cream-d:#EBE3D5;--white:#FFFDF9;--text:#2C2010;--text-m:#6B5530;--text-f:#A08C60;--bdr:rgba(184,134,11,.2);--bdr-s:rgba(184,134,11,.38);--ff:'Plus Jakarta Sans',system-ui,sans-serif;--serif:'Cormorant Garamond',Georgia,serif;--r:14px;--r-pill:999px}
  html{font-size:16px}
  body{font-family:var(--ff);background:var(--cream);color:var(--text);min-height:100vh;overflow-x:hidden}

  /* TOPBAR */
  .topbar{display:flex;align-items:center;justify-content:space-between;padding:.875rem 1.25rem;background:var(--white);border-bottom:1px solid var(--bdr);position:sticky;top:0;z-index:50;box-shadow:0 1px 8px rgba(28,18,0,.06)}
  .tb-logo{display:flex;align-items:center;gap:8px}
  .tb-star{color:var(--gold);font-size:16px}
  .tb-name{font-size:14px;font-weight:800;color:var(--gold-d)}
  .tb-right{display:flex;align-items:center;gap:10px}
  .tb-greet{font-size:12px;color:var(--text-m);font-weight:500;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .btn-logout{padding:7px 14px;background:var(--gold-p);border:1px solid var(--bdr-s);border-radius:var(--r-pill);font-family:var(--ff);font-size:11px;font-weight:700;color:var(--gold-d);cursor:pointer;transition:all .15s}
  .btn-logout:hover{background:var(--gold);color:#fff}

  /* MONTH PILLS */
  .month-scroller{overflow-x:auto;scrollbar-width:none;background:var(--white);border-bottom:1px solid var(--bdr)}
  .month-scroller::-webkit-scrollbar{display:none}
  .month-strip{display:flex;gap:6px;padding:.625rem 1rem;width:max-content}
  .month-pill{flex-shrink:0;padding:7px 16px;background:var(--cream);border:1px solid var(--bdr);border-radius:var(--r-pill);font-family:var(--ff);font-size:11px;font-weight:700;color:var(--text-m);cursor:pointer;transition:all .2s;min-height:34px}
  .month-pill.active{background:var(--gold);color:#fff;border-color:var(--gold);box-shadow:0 3px 10px rgba(184,134,11,.3)}
  .month-pill:hover:not(.active){background:var(--gold-p);color:var(--gold-d)}

  /* MAIN LAYOUT */
  .main{display:flex;flex-direction:column;min-height:calc(100vh - 100px)}
  .content{padding:1.25rem 1rem 100px;max-width:860px;margin:0 auto;width:100%}

  /* BOTTOM NAV */
  .bottom-nav{position:fixed;bottom:0;left:0;right:0;z-index:40;background:var(--white);border-top:1px solid var(--bdr);display:flex;box-shadow:0 -4px 20px rgba(28,18,0,.08);padding-bottom:env(safe-area-inset-bottom,0)}
  .bnav{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:.65rem .5rem;background:none;border:none;cursor:pointer;font-family:var(--ff);font-size:9px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:var(--text-f);transition:all .2s;gap:4px;min-height:58px;position:relative}
  .bnav-bar{position:absolute;top:0;left:50%;transform:translateX(-50%);width:28px;height:3px;border-radius:0 0 3px 3px;background:var(--gold);opacity:0;transition:opacity .2s}
  .bnav.active{color:var(--gold-d)}
  .bnav.active .bnav-bar{opacity:1}
  .bnav-icon{font-size:20px;line-height:1;transition:transform .2s}
  .bnav.active .bnav-icon{transform:scale(1.15)}
  .bnav-lbl{font-size:9px}

  /* TRACKER */
  .panel-header{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:1.25rem;flex-wrap:wrap}
  .panel-month{font-family:var(--serif);font-size:26px;font-weight:600;color:var(--text);line-height:1.1}
  .panel-week{font-size:12px;color:var(--text-f);margin-top:2px;font-weight:500}
  .week-pills{display:flex;gap:6px;flex-wrap:wrap}
  .wpill{padding:7px 14px;background:var(--white);border:1px solid var(--bdr);border-radius:var(--r-pill);font-family:var(--ff);font-size:11px;font-weight:700;color:var(--text-m);cursor:pointer;transition:all .2s;min-height:34px}
  .wpill.active{background:var(--gold);color:#fff;border-color:var(--gold);box-shadow:0 3px 10px rgba(184,134,11,.3)}
  .wpill:hover:not(.active){background:var(--gold-p);color:var(--gold-d)}

  .table-wrap{overflow-x:auto;-webkit-overflow-scrolling:touch;border-radius:var(--r);border:1px solid var(--bdr);background:var(--white);margin-bottom:1.25rem;box-shadow:0 2px 12px rgba(28,18,0,.06)}
  .tracker-table{width:100%;border-collapse:collapse;font-size:12px;min-width:380px}
  .tracker-table thead th{font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--gold-d);padding:11px 7px;text-align:center;border-bottom:2px solid var(--cream-d);background:var(--cream);white-space:nowrap}
  .th-habit{text-align:left!important;min-width:110px;padding-left:14px!important}
  .tracker-table tbody td{padding:11px 7px;border-bottom:1px solid var(--cream-d);text-align:center;vertical-align:middle;background:var(--white)}
  .tracker-table tbody tr:hover td{background:var(--cream)}
  .td-habit{text-align:left!important;font-size:12px;font-weight:500;color:var(--text);max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;padding-left:14px!important}
  .td-total{font-size:11px;color:var(--gold-d);font-weight:700}
  .tracker-table tfoot td{padding:10px 7px;background:var(--cream);font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--gold-d);border-top:2px solid var(--cream-d);text-align:center}
  .tracker-table tfoot td:first-child{text-align:left;padding-left:14px}
  .chk{width:26px;height:26px;border-radius:6px;border:2px solid var(--bdr-s);background:transparent;cursor:pointer;display:inline-flex;align-items:center;justify-content:center;transition:all .12s;vertical-align:middle}
  .chk.on{background:linear-gradient(135deg,var(--gold-d),var(--gold-l));border-color:var(--gold);box-shadow:0 2px 8px rgba(184,134,11,.3)}
  .chk.on::after{content:'✓';color:#fff;font-size:13px;line-height:1;font-weight:700}
  .chk:hover:not(.on){border-color:var(--gold);background:var(--gold-p)}

  .sum-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:1.25rem}
  .sum-card{background:var(--white);border:1px solid var(--bdr);border-radius:var(--r);padding:1.25rem;box-shadow:0 2px 8px rgba(28,18,0,.05)}
  .sum-lbl{font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--gold-d);margin-bottom:6px}
  .sum-val{font-family:var(--serif);font-size:34px;font-weight:600;color:var(--text);line-height:1}
  .sum-sub{font-size:11px;color:var(--text-f);margin-top:4px;font-weight:500}
  .pbar{height:4px;background:var(--cream-d);border-radius:2px;margin-top:10px;overflow:hidden}
  .pfill{height:100%;background:linear-gradient(90deg,var(--gold-d),var(--gold-l));border-radius:2px;transition:width .5s ease}

  /* HÁBITOS */
  .section-title-sm{font-family:var(--serif);font-size:22px;font-weight:600;color:var(--text);margin-bottom:1.25rem}
  .add-row{display:flex;gap:10px;margin-bottom:1.25rem}
  .add-input{flex:1;padding:13px 15px;border:1.5px solid var(--bdr-s);border-radius:10px;font-family:var(--ff);font-size:14px;color:var(--text);background:var(--white);outline:none;transition:border-color .2s;min-height:48px}
  .add-input:focus{border-color:var(--gold)}
  .add-input::placeholder{color:var(--text-f)}
  .btn-add{padding:13px 18px;background:linear-gradient(135deg,var(--gold-d),var(--gold-l));color:#fff;border:none;border-radius:10px;font-family:var(--ff);font-size:13px;font-weight:700;cursor:pointer;min-height:48px;transition:all .2s;box-shadow:0 3px 12px rgba(184,134,11,.3)}
  .btn-add:hover{transform:translateY(-1px)}
  .habits-list{display:flex;flex-direction:column;gap:8px;margin-bottom:1.5rem}
  .habit-item{display:flex;align-items:center;gap:12px;padding:13px 15px;background:var(--white);border:1px solid var(--bdr);border-radius:10px;transition:all .2s;min-height:50px}
  .habit-item:hover{border-color:var(--gold);box-shadow:0 2px 8px rgba(184,134,11,.12)}
  .h-num{font-family:var(--serif);font-size:16px;color:var(--gold);min-width:22px;font-weight:600}
  .h-name{flex:1;font-size:14px;font-weight:500;color:var(--text)}
  .btn-rm{background:none;border:none;cursor:pointer;color:var(--text-f);font-size:22px;min-width:36px;min-height:36px;display:flex;align-items:center;justify-content:center;transition:color .12s}
  .btn-rm:hover{color:#C04030}
  .empty{text-align:center;padding:2.5rem 1rem;color:var(--text-f);font-family:var(--serif);font-size:18px;font-style:italic;background:var(--white);border:1px solid var(--bdr);border-radius:var(--r);margin-bottom:1.25rem}
  .quote-box{text-align:center;padding:1.75rem;background:var(--white);border:1px solid var(--bdr);border-radius:var(--r);box-shadow:0 2px 8px rgba(28,18,0,.05)}
  .quote-text{font-family:var(--serif);font-size:20px;font-style:italic;color:var(--text);margin-bottom:.5rem}
  .quote-sub{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--gold-d)}

  /* REPORT */
  .kpi-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin-bottom:1.25rem}
  .kpi-card{background:var(--white);border:1px solid var(--bdr);border-radius:10px;padding:1rem .75rem;text-align:center;box-shadow:0 2px 8px rgba(28,18,0,.05)}
  .kpi-val{font-family:var(--serif);font-size:26px;font-weight:600;color:var(--text)}
  .kpi-lbl{font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--gold-d);margin-top:4px}
  .rpt-week{background:var(--white);border:1px solid var(--bdr);border-radius:10px;margin-bottom:10px;overflow:hidden;box-shadow:0 2px 8px rgba(28,18,0,.05)}
  .rpt-week[open] .rpt-head{background:var(--cream-d)}
  .rpt-head{display:flex;align-items:center;justify-content:space-between;padding:13px 16px;background:var(--cream);cursor:pointer;list-style:none;min-height:50px;gap:10px}
  .rpt-head::-webkit-details-marker{display:none}
  .rpt-ttl{font-size:11px;font-weight:700;letter-spacing:.5px;text-transform:uppercase;color:var(--text-m)}
  .rpt-pct{font-family:var(--serif);font-size:18px;color:var(--gold);font-weight:600;white-space:nowrap}
  .rpt-body{padding:.5rem 1rem 1rem}
  .rh-row{display:flex;align-items:center;gap:12px;padding:8px 0;border-bottom:1px solid var(--cream-d)}
  .rh-row:last-child{border-bottom:none}
  .rh-name{font-size:12px;font-weight:500;color:var(--text-m);flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .rh-bar{width:52px;height:4px;background:var(--cream-d);border-radius:2px;overflow:hidden;flex-shrink:0}
  .rh-fill{height:100%;background:linear-gradient(90deg,var(--gold-d),var(--gold-l));border-radius:2px}
  .rh-score{font-size:11px;color:var(--text);font-weight:700;white-space:nowrap}

  @media(min-width:640px){
    .content{padding:1.5rem 1.5rem 80px}
    .tracker-table{min-width:480px}
  }
  @media(min-width:900px){
    .bottom-nav{display:none}
    .content{padding:2rem 2rem 3rem}
  }
`
