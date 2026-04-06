'use client'

import { useEffect, useRef, useState } from 'react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

const SUBJECTS = [
  'Қазақстан тарихы',
  'Математика',
  'Физика',
  'Химия',
  'Биология',
  'География',
  'Дүниежүзі тарихы',
  'Шет тілі',
  'Қазақ тілі',
  'Қазақ әдебиеті',
  'Информатика',
  'Құқық негіздері'
]

const MODES = [
  { key: 'simple', label: 'Қарапайым түсіндір' },
  { key: 'example', label: 'Мысалмен көрсет' },
  { key: 'quiz', label: 'Mini test' },
  { key: 'mistake', label: 'Қате талдау' }
]

export default function AITutorPage() {

  const [messages,setMessages] = useState<Message[]>([
    {
      role:'assistant',
      content:'Сәлем! Мен KHAMADI ONLINE AI Tutor-мын. Сұрағыңды жаз.'
    }
  ])

  const [input,setInput] = useState('')
  const [subject,setSubject] = useState('Математика')
  const [mode,setMode] = useState('simple')
  const [loading,setLoading] = useState(false)

  const bottomRef = useRef<HTMLDivElement|null>(null)

  useEffect(()=>{
    bottomRef.current?.scrollIntoView({behavior:'smooth'})
  },[messages])

  async function sendMessage(text?:string){

    const message = (text ?? input).trim()

    if(!message) return

    setMessages(prev=>[
      ...prev,
      {role:'user',content:message}
    ])

    setInput('')
    setLoading(true)

    try{

      const res = await fetch('/api/ai-tutor',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify({
          subject,
          mode,
          messages:[
            ...messages,
            {role:'user',content:message}
          ]
        })
      })

      const data = await res.json()

      setMessages(prev=>[
        ...prev,
        {role:'assistant',content:data.reply}
      ])

    }catch{

      setMessages(prev=>[
        ...prev,
        {role:'assistant',content:'Қате орын алды'}
      ])

    }

    setLoading(false)

  }

  function handleEnter(e:any){
    if(e.key==='Enter' && !e.shiftKey){
      e.preventDefault()
      sendMessage()
    }
  }

  return (

    <div style={s.page}>

      <div style={s.container}>

        <div style={s.header}>
          <div style={s.badge}>AI TUTOR</div>
          <h1 style={s.title}>KHAMADI AI Tutor</h1>
        </div>


        {/* SUBJECTS */}

        <div style={s.subjectRow}>

          {SUBJECTS.map(sub=>(
            <button
              key={sub}
              onClick={()=>setSubject(sub)}
              style={{
                ...s.subjectBtn,
                ...(subject===sub ? s.subjectActive : {})
              }}
            >
              {sub}
            </button>
          ))}

        </div>


        {/* MODES */}

        <div style={s.modeRow}>

          {MODES.map(m=>(
            <button
              key={m.key}
              onClick={()=>setMode(m.key)}
              style={{
                ...s.modeBtn,
                ...(mode===m.key ? s.modeActive : {})
              }}
            >
              {m.label}
            </button>
          ))}

        </div>


        {/* CHAT */}

        <div style={s.chat}>

          {messages.map((m,i)=>(
            <div
              key={i}
              style={{
                ...s.messageRow,
                justifyContent:
                  m.role==='user'
                  ? 'flex-end'
                  : 'flex-start'
              }}
            >

              <div
                style={{
                  ...s.bubble,
                  ...(m.role==='user'
                    ? s.userBubble
                    : s.aiBubble)
                }}
              >
                {m.content}
              </div>

            </div>
          ))}

          {loading && (
            <div style={s.messageRow}>
              <div style={s.aiBubble}>
                AI жазып жатыр...
              </div>
            </div>
          )}

          <div ref={bottomRef}/>

        </div>


        {/* INPUT */}

        <div style={s.inputWrap}>

          <textarea
            value={input}
            onChange={(e)=>setInput(e.target.value)}
            onKeyDown={handleEnter}
            placeholder="Сұрағыңды толық жаз..."
            style={s.textarea}
          />

          <button
            onClick={()=>sendMessage()}
            style={s.sendBtn}
          >
            ↑
          </button>

        </div>

      </div>

    </div>

  )

}

const s:Record<string,React.CSSProperties>={

page:{
  minHeight:'100vh',
  background:'linear-gradient(180deg,#F8FCFF,#EEF7FF)',
  padding:40
},

container:{
  maxWidth:1200,
  margin:'0 auto',
  display:'flex',
  flexDirection:'column',
  gap:20
},

header:{
  marginBottom:6
},

badge:{
  fontSize:12,
  fontWeight:800,
  color:'#0EA5E9',
  letterSpacing:1
},

title:{
  fontSize:42,
  fontWeight:900,
  margin:0,
  letterSpacing:-1
},

subjectRow:{
  display:'flex',
  flexWrap:'wrap',
  gap:10
},

subjectBtn:{
  padding:'10px 16px',
  borderRadius:999,
  border:'1px solid #E2E8F0',
  background:'#FFFFFF',
  fontWeight:600,
  cursor:'pointer',
  boxShadow:'0 4px 10px rgba(0,0,0,0.03)'
},

subjectActive:{
  background:'linear-gradient(135deg,#38BDF8,#0EA5E9)',
  color:'#FFFFFF',
  border:'none',
  boxShadow:'0 10px 20px rgba(14,165,233,0.25)'
},

modeRow:{
  display:'flex',
  gap:10
},

modeBtn:{
  padding:'8px 16px',
  borderRadius:999,
  border:'1px solid #E2E8F0',
  background:'#FFFFFF',
  cursor:'pointer',
  fontWeight:600
},

modeActive:{
  background:'#0F172A',
  color:'#FFFFFF',
  border:'none'
},

chat:{
  background:'rgba(255,255,255,0.9)',
  border:'1px solid #E2E8F0',
  borderRadius:26,
  padding:24,
  height:'65vh',
  overflowY:'auto',
  display:'flex',
  flexDirection:'column',
  gap:14,
  backdropFilter:'blur(12px)',
  boxShadow:'0 20px 40px rgba(15,23,42,0.05)'
},

messageRow:{
  display:'flex'
},

bubble:{
  maxWidth:'88%',
  padding:'16px 20px',
  borderRadius:22,
  lineHeight:1.8,
  fontSize:15
},

userBubble:{
  background:'linear-gradient(135deg,#38BDF8,#0EA5E9)',
  color:'#FFFFFF',
  boxShadow:'0 10px 20px rgba(14,165,233,0.2)'
},

aiBubble:{
  background:'#F1F5F9'
},

inputWrap:{
  display:'flex',
  gap:12
},

textarea:{
  flex:1,
  borderRadius:18,
  border:'1px solid #CBD5E1',
  padding:16,
  minHeight:90,
  fontSize:15
},

sendBtn:{
  width:60,
  borderRadius:18,
  border:'none',
  background:'#0F172A',
  color:'#FFFFFF',
  fontSize:22,
  cursor:'pointer',
  boxShadow:'0 10px 20px rgba(15,23,42,0.2)'
}

}