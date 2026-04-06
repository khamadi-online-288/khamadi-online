'use client'

import { motion } from 'framer-motion'

export default function HomePage() {
  return (
    <main style={s.page}>

      <Header />

      <Hero />

      <Stats />

      <Features />

      <Subjects />

      <AISection />

      <Simulator />

      <Universities />

      <Parents />

      <Testimonials />

      <CTA />

      <Footer />

    </main>
  )
}

/* ---------- HEADER ---------- */

function Header(){
return(
<header style={s.header}>

<div style={s.logoWrap}>
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
)
}

/* ---------- HERO ---------- */

function Hero(){
return(
<section style={s.hero}>

<motion.div
initial={{opacity:0,y:60}}
animate={{opacity:1,y:0}}
transition={{duration:0.8}}
>

<div style={s.badge}>UBT preparation platform</div>

<h1 style={s.heroTitle}>
ҰБТ-ға дайындықтың
<br/>
жаңа деңгейі
</h1>

<p style={s.heroText}>
KHAMADI ONLINE — бұл ҰБТ дайындық платформасы.
AI тьютор, толық симулятор, пәндер базасы,
жеке оқу жоспары және ата-ана кабинеті.
</p>

<div style={s.heroButtons}>
<a href="/register" style={s.primaryBtn}>Дайындықты бастау</a>
<a href="/login" style={s.secondaryBtn}>Аккаунтқа кіру</a>
</div>

</motion.div>

<div style={s.heroCard}>
<div style={s.heroCardTitle}>Premium UBT Platform</div>
<div style={s.heroCardBig}>120+</div>
<div style={s.heroCardText}>
Жоғары нәтиже — жүйелі дайындықпен
</div>
</div>

</section>
)
}

/* ---------- STATS ---------- */

function Stats(){
return(
<section style={s.statsSection}>

<div style={s.statsGrid}>

<Stat title="10000+" text="оқушы дайындалуда"/>

<Stat title="1000+" text="сабақ пен тест"/>

<Stat title="120+" text="мақсатты нәтиже"/>

<Stat title="AI" text="интеллектуалды анализ"/>

</div>

</section>
)
}

function Stat({title,text}:any){
return(
<div style={s.statCard}>
<div style={s.statNumber}>{title}</div>
<div style={s.statText}>{text}</div>
</div>
)
}

/* ---------- FEATURES ---------- */

function Features(){
return(
<section style={s.section}>

<h2 style={s.sectionTitle}>
Платформа мүмкіндіктері
</h2>

<div style={s.grid4}>

<Feature title="ҰБТ симулятор" text="Нағыз тест форматы"/>

<Feature title="AI Tutor" text="Тақырып түсіндіру"/>

<Feature title="Пәндер базасы" text="PDF + тесттер"/>

<Feature title="Прогресс анализ" text="Нәтижені бақылау"/>

</div>

</section>
)
}

function Feature({title,text}:any){
return(
<motion.div
initial={{opacity:0,y:40}}
whileInView={{opacity:1,y:0}}
viewport={{once:true}}
style={s.featureCard}
>
<div style={s.featureTitle}>{title}</div>
<div style={s.featureText}>{text}</div>
</motion.div>
)
}

/* ---------- SUBJECTS ---------- */

function Subjects(){
return(
<section style={s.darkSection}>

<h2 style={s.darkTitle}>ҰБТ пәндері</h2>

<div style={s.grid3}>

<Subject title="Қазақстан тарихы"/>
<Subject title="Математика"/>
<Subject title="Физика"/>
<Subject title="Биология"/>
<Subject title="Химия"/>
<Subject title="География"/>

</div>

</section>
)
}

function Subject({title}:any){
return <div style={s.subjectCard}>{title}</div>
}

/* ---------- AI ---------- */

function AISection(){
return(
<section style={s.section}>

<div style={s.split}>

<div>
<h2 style={s.sectionTitle}>AI Tutor</h2>

<p style={s.sectionText}>
Түсінбеген тақырыптарды AI арқылы
бірден түсінуге болады.
</p>

<a href="/dashboard/ai-tutor" style={s.primaryBtn}>
AI тьюторды ашу
</a>

</div>

<div style={s.aiCard}/>
</div>

</section>
)
}

/* ---------- SIMULATOR ---------- */

function Simulator(){
return(
<section style={s.section}>

<div style={s.split}>

<div style={s.simCard}>140</div>

<div>

<h2 style={s.sectionTitle}>ҰБТ симуляторы</h2>

<p style={s.sectionText}>
Нағыз ҰБТ форматындағы тест.
</p>

<a href="/dashboard/simulator" style={s.primaryBtn}>
Симулятор
</a>

</div>

</div>

</section>
)
}

/* ---------- UNIVERSITIES ---------- */

function Universities(){
return(
<section style={s.section}>

<h2 style={s.sectionTitle}>Университеттер</h2>

<p style={s.sectionText}>
Платформа арқылы университеттер туралы
ақпарат алуға болады.
</p>

</section>
)
}

/* ---------- PARENTS ---------- */

function Parents(){
return(
<section style={s.darkSection}>

<h2 style={s.darkTitle}>Ата-ана кабинеті</h2>

<p style={s.darkText}>
Ата-аналар баланың прогресін көре алады.
</p>

<a href="/parent/login" style={s.primaryBtn}>
Ата-ана кіруі
</a>

</section>
)
}

/* ---------- TESTIMONIALS ---------- */

function Testimonials(){
return(
<section style={s.section}>

<h2 style={s.sectionTitle}>Пікірлер</h2>

<div style={s.grid3}>

<Testimonial name="Аружан" text="Платформа өте ыңғайлы."/>

<Testimonial name="Нұрсұлтан" text="Симулятор жақсы."/>

<Testimonial name="Айбек" text="AI тьютор көмектесті."/>

</div>

</section>
)
}

function Testimonial({name,text}:any){
return(
<div style={s.testCard}>
<div style={s.testText}>{text}</div>
<div style={s.testName}>{name}</div>
</div>
)
}

/* ---------- CTA ---------- */

function CTA(){
return(
<section style={s.cta}>

<h2 style={s.ctaTitle}>
ҰБТ-ға бірге дайындалайық
</h2>

<a href="/register" style={s.ctaBtn}>
Қазір бастау
</a>

</section>
)
}

/* ---------- FOOTER ---------- */

function Footer(){
return(
<footer style={s.footer}>
<div>KHAMADI ONLINE</div>
<div style={s.footerSub}>© 2026</div>
</footer>
)
}

const s:any={

page:{fontFamily:'Montserrat'},

header:{maxWidth:1200,margin:'0 auto',padding:24,display:'flex',justifyContent:'space-between',alignItems:'center'},

logoWrap:{display:'flex',gap:12,alignItems:'center'},

logo:{width:40,height:40,borderRadius:12,background:'#0EA5E9',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:900},

nav:{display:'flex',gap:10},

navBtn:{padding:'10px 16px',border:'1px solid #E2E8F0',borderRadius:12},

navPrimary:{padding:'10px 16px',borderRadius:12,background:'#0F172A',color:'#fff'},

hero:{maxWidth:1200,margin:'0 auto',padding:80,display:'grid',gridTemplateColumns:'1fr 1fr',gap:40},

badge:{background:'#E0F2FE',padding:'8px 14px',borderRadius:999},

heroTitle:{fontSize:64,fontWeight:900},

heroButtons:{display:'flex',gap:12},

primaryBtn:{padding:'14px 22px',background:'#0EA5E9',borderRadius:14,color:'#fff'},

secondaryBtn:{padding:'14px 22px',border:'1px solid #E2E8F0',borderRadius:14},

statsSection:{maxWidth:1200,margin:'0 auto',padding:40},

statsGrid:{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:20},

statCard:{padding:30,border:'1px solid #E2E8F0',borderRadius:20,textAlign:'center'},

statNumber:{fontSize:36,fontWeight:900},

section:{maxWidth:1200,margin:'80px auto',textAlign:'center'},

grid4:{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:20},

grid3:{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:20},

featureCard:{padding:30,border:'1px solid #E2E8F0',borderRadius:20},

darkSection:{background:'#0F172A',color:'#fff',padding:80,textAlign:'center'},

subjectCard:{padding:30,background:'#111827',borderRadius:20},

split:{display:'grid',gridTemplateColumns:'1fr 1fr',gap:40,alignItems:'center'},

aiCard:{height:200,background:'#0EA5E9',borderRadius:20},

simCard:{height:200,background:'#111827',color:'#fff',borderRadius:20,display:'flex',alignItems:'center',justifyContent:'center',fontSize:60},

cta:{padding:100,textAlign:'center'},

ctaTitle:{fontSize:48,fontWeight:900},

ctaBtn:{padding:'16px 26px',background:'#0EA5E9',borderRadius:16,color:'#fff'},

footer:{padding:40,textAlign:'center',borderTop:'1px solid #E2E8F0'},

footerSub:{fontSize:12,color:'#64748B'}

}