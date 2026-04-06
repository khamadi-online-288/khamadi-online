'use client'

import { motion } from 'framer-motion'

export default function LandingPage() {
  return (
    <div style={s.page}>
      
      {/* HEADER */}

      <header style={s.header}>
        <div style={s.logoRow}>
          <div style={s.logo}>K</div>

          <div>
            <div style={s.brand}>KHAMADI ONLINE</div>
            <div style={s.subBrand}>ҰБТ preparation platform</div>
          </div>
        </div>

        <div style={s.nav}>
          <a href="/login" style={s.link}>Кіру</a>
          <a href="/register" style={s.primaryBtn}>Бастау</a>
        </div>
      </header>


      {/* HERO */}

      <section style={s.hero}>

        <div style={s.heroLeft}>
          <div style={s.heroBadge}>
            UBT preparation platform
          </div>

          <h1 style={s.heroTitle}>
            ҰБТ-ға дайындықтың
            <br/>
            жаңа деңгейі
          </h1>

          <p style={s.heroText}>
            KHAMADI ONLINE — толық ҰБТ платформасы.
            AI тьютор, симулятор, пәндер базасы және
            жеке оқу жоспары.
          </p>

          <div style={s.heroButtons}>
            <a href="/register" style={s.ctaBtn}>
              Дайындықты бастау
            </a>

            <a href="/login" style={s.secondaryBtn}>
              Аккаунтқа кіру
            </a>
          </div>
        </div>

        <div style={s.heroRight}>
          <div style={s.dashboardPreview}>
            <div style={s.previewTitle}>Dashboard Preview</div>

            <div style={s.previewCards}>
              <div style={s.previewCard}>XP</div>
              <div style={s.previewCard}>Level</div>
              <div style={s.previewCard}>Progress</div>
              <div style={s.previewCard}>Score</div>
            </div>
          </div>
        </div>

      </section>


      {/* STATS */}

      <section style={s.stats}>

        <Stat value="10000+" label="оқушы дайындалуда"/>
        <Stat value="1000+" label="сабақ пен тест"/>
        <Stat value="120+" label="мақсатты нәтиже"/>
        <Stat value="AI" label="интеллектуалды анализ"/>

      </section>


      {/* FEATURES */}

      <section style={s.features}>

        <h2 style={s.sectionTitle}>
          Платформа мүмкіндіктері
        </h2>

        <div style={s.featureGrid}>

          <Feature
            title="ҰБТ симулятор"
            text="Нағыз тест форматы"
          />

          <Feature
            title="AI Tutor"
            text="Тақырып түсіндіру"
          />

          <Feature
            title="Пәндер базасы"
            text="PDF + тесттер"
          />

          <Feature
            title="Прогресс анализ"
            text="Нәтижені бақылау"
          />

        </div>

      </section>


      {/* SUBJECTS */}

      <section style={s.subjects}>

        <h2 style={s.sectionTitle}>
          ҰБТ пәндері
        </h2>

        <div style={s.subjectGrid}>

          <Subject name="Қазақстан тарихы"/>
          <Subject name="Математика"/>
          <Subject name="Физика"/>
          <Subject name="Химия"/>
          <Subject name="Биология"/>
          <Subject name="География"/>
          <Subject name="Информатика"/>
          <Subject name="Ағылшын тілі"/>

        </div>

      </section>


      {/* AI SECTION */}

      <section style={s.aiSection}>

        <div style={s.aiLeft}>
          <h2 style={s.sectionTitle}>
            AI Tutor
          </h2>

          <p style={s.aiText}>
            Түсінбеген тақырыптарды AI арқылы
            бірден түсінуге болады.
          </p>

          <a href="/dashboard/ai-tutor" style={s.ctaBtn}>
            AI тьюторды ашу
          </a>
        </div>

        <div style={s.aiRight}></div>

      </section>


      {/* CTA */}

      <section style={s.ctaSection}>

        <h2 style={s.ctaTitle}>
          ҰБТ-ға жүйелі дайындал
          <br/>
          KHAMADI ONLINE-мен
        </h2>

        <a href="/register" style={s.bigBtn}>
          Дайындықты бастау
        </a>

      </section>


      {/* FOOTER */}

      <footer style={s.footer}>

        <div style={s.footerBrand}>
          KHAMADI ONLINE
        </div>

        <div style={s.footerLinks}>
          <a href="/subjects">Пәндер</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/login">Кіру</a>
        </div>

      </footer>

    </div>
  )
}


/* COMPONENTS */

function Stat({ value, label }:{value:string,label:string}) {
  return (
    <div style={s.stat}>
      <div style={s.statValue}>{value}</div>
      <div style={s.statLabel}>{label}</div>
    </div>
  )
}

function Feature({ title, text }:{title:string,text:string}) {
  return (
    <div style={s.featureCard}>
      <div style={s.featureTitle}>{title}</div>
      <div style={s.featureText}>{text}</div>
    </div>
  )
}

function Subject({ name }:{name:string}) {
  return (
    <div style={s.subjectCard}>{name}</div>
  )
}


/* STYLES */

const s:any = {

page:{
maxWidth:1200,
margin:'0 auto',
padding:'40px 24px',
fontFamily:'system-ui'
},

header:{
display:'flex',
justifyContent:'space-between',
alignItems:'center',
marginBottom:60
},

logoRow:{
display:'flex',
gap:12,
alignItems:'center'
},

logo:{
width:40,
height:40,
borderRadius:12,
background:'#0EA5E9',
color:'#fff',
display:'flex',
alignItems:'center',
justifyContent:'center',
fontWeight:700
},

brand:{
fontWeight:800
},

subBrand:{
fontSize:12,
color:'#64748B'
},

nav:{
display:'flex',
gap:12
},

link:{
textDecoration:'none',
color:'#0F172A'
},

primaryBtn:{
background:'#0EA5E9',
color:'#fff',
padding:'10px 18px',
borderRadius:10,
textDecoration:'none'
},

hero:{
display:'grid',
gridTemplateColumns:'1fr 1fr',
gap:40,
alignItems:'center',
marginBottom:80
},

heroBadge:{
background:'#F1F5F9',
padding:'8px 14px',
borderRadius:999,
display:'inline-block',
marginBottom:20
},

heroTitle:{
fontSize:48,
fontWeight:900,
lineHeight:1.1,
marginBottom:20
},

heroText:{
color:'#64748B',
lineHeight:1.6,
marginBottom:24
},

heroButtons:{
display:'flex',
gap:12
},

ctaBtn:{
background:'#38BDF8',
color:'#fff',
padding:'12px 20px',
borderRadius:12,
textDecoration:'none'
},

secondaryBtn:{
border:'1px solid #E2E8F0',
padding:'12px 20px',
borderRadius:12,
textDecoration:'none'
},

heroRight:{
display:'flex',
justifyContent:'center'
},

dashboardPreview:{
background:'#0F172A',
color:'#fff',
padding:30,
borderRadius:20,
width:320
},

previewCards:{
display:'grid',
gridTemplateColumns:'1fr 1fr',
gap:12,
marginTop:20
},

previewCard:{
background:'#1E293B',
padding:20,
borderRadius:12
},

stats:{
display:'grid',
gridTemplateColumns:'repeat(4,1fr)',
gap:20,
marginBottom:80
},

stat:{
background:'#F8FAFC',
padding:30,
borderRadius:16,
textAlign:'center'
},

statValue:{
fontSize:28,
fontWeight:900
},

statLabel:{
color:'#64748B'
},

sectionTitle:{
fontSize:32,
fontWeight:900,
marginBottom:40
},

features:{
marginBottom:80
},

featureGrid:{
display:'grid',
gridTemplateColumns:'repeat(4,1fr)',
gap:20
},

featureCard:{
background:'#F8FAFC',
padding:30,
borderRadius:16
},

featureTitle:{
fontWeight:800,
marginBottom:8
},

featureText:{
color:'#64748B'
},

subjects:{
marginBottom:80
},

subjectGrid:{
display:'grid',
gridTemplateColumns:'repeat(4,1fr)',
gap:20
},

subjectCard:{
background:'#0F172A',
color:'#fff',
padding:26,
borderRadius:16,
textAlign:'center'
},

aiSection:{
display:'grid',
gridTemplateColumns:'1fr 1fr',
gap:40,
marginBottom:80
},

aiRight:{
background:'#38BDF8',
borderRadius:20,
height:220
},

ctaSection:{
textAlign:'center',
padding:80,
background:'#0F172A',
color:'#fff',
borderRadius:24,
marginBottom:80
},

ctaTitle:{
fontSize:36,
fontWeight:900,
marginBottom:24
},

bigBtn:{
background:'#38BDF8',
color:'#fff',
padding:'14px 26px',
borderRadius:14,
textDecoration:'none'
},

footer:{
display:'flex',
justifyContent:'space-between',
borderTop:'1px solid #E2E8F0',
paddingTop:30
},

footerBrand:{
fontWeight:800
},

footerLinks:{
display:'flex',
gap:20
}

}