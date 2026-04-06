'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

function getDaysToUBT() {
  const target = new Date('2026-06-20T00:00:00')
  const now = new Date()
  const diff = target.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export default function HomePage() {
  const [days, setDays] = useState(0)

  useEffect(() => {
    setDays(getDaysToUBT())
  }, [])

  return (
    <main style={s.page}>
      
      {/* HEADER */}
      <header style={s.header}>
        <div style={s.logoBox}>
          <div style={s.logo}>K</div>
          <div>
            <div style={s.logoTitle}>KHAMADI ONLINE</div>
            <div style={s.logoSub}>ҰБТ preparation platform</div>
          </div>
        </div>

        <div style={s.nav}>
          <a href="/login" style={s.navBtn}>Кіру</a>
          <a href="/register" style={s.navPrimary}>Бастау</a>
        </div>
      </header>

      {/* HERO */}
      <section style={s.hero}>

        <motion.div
          initial={{opacity:0, y:60}}
          animate={{opacity:1, y:0}}
          transition={{duration:0.8}}
        >
          <div style={s.badge}>ҰБТ 2026</div>

          <h1 style={s.heroTitle}>
            ҰБТ-ға дайындықтың
            <br/>
            жаңа деңгейі
          </h1>

          <p style={s.heroSub}>
            AI тьютор, толық тест симуляторы,
            пәндер базасы және ата-ана кабинеті —
            барлығы бір платформада.
          </p>

          <div style={s.heroButtons}>
            <a href="/register" style={s.primaryBtn}>Дайындықты бастау</a>
            <a href="/login" style={s.secondaryBtn}>Аккаунтқа кіру</a>
          </div>
        </motion.div>

        <motion.div
          initial={{opacity:0, scale:0.9}}
          animate={{opacity:1, scale:1}}
          transition={{duration:0.9}}
          style={s.countCard}
        >
          <div style={s.countLabel}>ҰБТ-ға дейін</div>
          <div style={s.countNumber}>{days}</div>
          <div style={s.countSub}>күн қалды</div>
        </motion.div>

      </section>

      {/* FEATURES */}
      <section style={s.section}>
        <motion.h2
          initial={{opacity:0,y:40}}
          whileInView={{opacity:1,y:0}}
          transition={{duration:0.6}}
          viewport={{once:true}}
          style={s.sectionTitle}
        >
          Платформа мүмкіндіктері
        </motion.h2>

        <div style={s.grid4}>

          <Feature title="ҰБТ симулятор" text="Нағыз тест форматы" />

          <Feature title="AI Tutor" text="Тақырып түсіндіру" />

          <Feature title="Пәндер" text="PDF + тесттер" />

          <Feature title="Прогресс" text="Нәтижені бақылау" />

        </div>
      </section>

      {/* DARK SECTION */}
      <section style={s.darkSection}>

        <motion.h2
          initial={{opacity:0}}
          whileInView={{opacity:1}}
          viewport={{once:true}}
          style={s.darkTitle}
        >
          120+ баллға бірге жетеміз
        </motion.h2>

        <p style={s.darkText}>
          Дұрыс стратегия, жүйелі оқу және толық анализ
          арқылы гранттық нәтижеге жету мүмкін.
        </p>

        <a href="/register" style={s.ctaBtn}>
          Қазір бастау
        </a>

      </section>

      {/* FOOTER */}
      <footer style={s.footer}>
        <div>KHAMADI ONLINE</div>
        <div style={s.footerSub}>© 2026</div>
      </footer>

    </main>
  )
}

function Feature({title,text}:{title:string,text:string}) {
  return (
    <motion.div
      initial={{opacity:0,y:40}}
      whileInView={{opacity:1,y:0}}
      transition={{duration:0.5}}
      viewport={{once:true}}
      style={s.feature}
    >
      <div style={s.featureTitle}>{title}</div>
      <div style={s.featureText}>{text}</div>
    </motion.div>
  )
}

const s:any={

page:{
fontFamily:'Montserrat, sans-serif',
background:'#FFFFFF'
},

header:{
maxWidth:1200,
margin:'0 auto',
padding:24,
display:'flex',
justifyContent:'space-between',
alignItems:'center'
},

logoBox:{display:'flex',gap:12,alignItems:'center'},

logo:{
width:40,
height:40,
borderRadius:12,
background:'#0EA5E9',
color:'#fff',
display:'flex',
alignItems:'center',
justifyContent:'center',
fontWeight:900
},

logoTitle:{fontWeight:900},
logoSub:{fontSize:12,color:'#64748B'},

nav:{display:'flex',gap:10},

navBtn:{
padding:'10px 16px',
border:'1px solid #E2E8F0',
borderRadius:12
},

navPrimary:{
padding:'10px 16px',
borderRadius:12,
background:'#0F172A',
color:'#fff'
},

hero:{
maxWidth:1200,
margin:'0 auto',
padding:60,
display:'grid',
gridTemplateColumns:'1fr 1fr',
gap:40,
alignItems:'center'
},

badge:{
background:'#E0F2FE',
padding:'8px 14px',
borderRadius:999,
color:'#0369A1',
fontWeight:800,
width:'fit-content'
},

heroTitle:{
fontSize:64,
fontWeight:900,
margin:'20px 0'
},

heroSub:{
fontSize:18,
color:'#64748B'
},

heroButtons:{
display:'flex',
gap:12,
marginTop:20
},

primaryBtn:{
padding:'14px 22px',
background:'#0EA5E9',
color:'#fff',
borderRadius:14
},

secondaryBtn:{
padding:'14px 22px',
border:'1px solid #E2E8F0',
borderRadius:14
},

countCard:{
background:'#0F172A',
color:'#fff',
borderRadius:20,
padding:40,
textAlign:'center'
},

countNumber:{
fontSize:80,
fontWeight:900
},

section:{
maxWidth:1200,
margin:'100px auto',
padding:20,
textAlign:'center'
},

sectionTitle:{
fontSize:42,
fontWeight:900,
marginBottom:40
},

grid4:{
display:'grid',
gridTemplateColumns:'repeat(4,1fr)',
gap:20
},

feature:{
padding:30,
borderRadius:20,
border:'1px solid #E2E8F0'
},

featureTitle:{fontWeight:900},
featureText:{color:'#64748B'},

darkSection:{
background:'#0F172A',
color:'#fff',
padding:100,
textAlign:'center'
},

darkTitle:{
fontSize:48,
fontWeight:900,
marginBottom:20
},

darkText:{
color:'rgba(255,255,255,0.7)',
marginBottom:30
},

ctaBtn:{
padding:'16px 26px',
background:'#0EA5E9',
borderRadius:16
},

footer:{
padding:40,
textAlign:'center',
borderTop:'1px solid #E2E8F0'
},

footerSub:{
fontSize:12,
color:'#64748B'
}

}