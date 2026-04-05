'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

type Analysis = {
  overview: string
  subjectLevels: string
  weakTopics: string
  scorePrediction: string
  studyPlan: string
  parentReport: string
}

type Profile = {
  id: string
  full_name?: string | null
  profile_subject_1?: string | null
  profile_subject_2?: string | null
}

export default function AiAnalysisPage() {
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [simulatorData, setSimulatorData] = useState<any[]>([])
  const [examData, setExamData] = useState<any[]>([])
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const {
          data: { user }
        } = await supabase.auth.getUser()

        if (!user) {
          setDataLoading(false)
          return
        }

        const { data: profileData } = await supabase
          .from('profiles')
          .select('id, full_name, profile_subject_1, profile_subject_2')
          .eq('id', user.id)
          .single()

        setProfile(profileData)

        const { data: simResults } = await supabase
          .from('simulator_results')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5)

        setSimulatorData(simResults || [])

        const { data: examResults } = await supabase
          .from('exam_attempts')
          .select('*')
          .eq('student_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20)

        setExamData(examResults || [])
      } catch (e) {
        console.error(e)
      } finally {
        setDataLoading(false)
      }
    }

    loadData()
  }, [])

  const runAnalysis = async () => {
    if (!profile) return

    setLoading(true)
    setError('')
    setAnalysis(null)

    try {
      const res = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: profile.full_name,
          profileSubject1: profile.profile_subject_1,
          profileSubject2: profile.profile_subject_2,
          simulatorResults: simulatorData,
          examResults: examData
        })
      })

      const data = await res.json()
      setAnalysis(data)
    } catch {
      setError('Қате орын алды. Қайта көріңіз.')
    }

    setLoading(false)
  }

  if (dataLoading) {
    return (
      <div style={s.loadingPage}>
        <div style={{ textAlign: 'center' }}>
          <div style={s.loader} />
          <p style={s.loadingText}>Деректер жүктелуде...</p>
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    )
  }

  const hasData = simulatorData.length > 0 || examData.length > 0
  const firstName = profile?.full_name?.trim()?.split(' ')[0] || 'Оқушы'

  return (
    <div style={s.page}>
      <div style={s.wrap}>
        <div style={s.hero}>
          <div style={s.heroLeft}>
            <div style={s.badge}>AI АНАЛИЗ</div>
            <div style={s.hello}>
              Сәлем, <span style={s.helloName}>{firstName}</span>
            </div>
            <h1 style={s.heroTitle}>Білім анализі</h1>
            <p style={s.heroText}>
              AI сенің симулятор және тақырыптық тест нәтижелеріңді талдап,
              әлсіз тұстарды анықтап, жеке оқу жоспарын ұсынады.
            </p>
          </div>

          <div style={s.heroRight}>
            <div style={s.miniStatCard}>
              <div style={s.miniStatIcon}>📊</div>
              <div style={s.miniStatValue}>{simulatorData.length}</div>
              <div style={s.miniStatLabel}>Симулятор</div>
            </div>

            <div style={s.miniStatCard}>
              <div style={s.miniStatIcon}>📝</div>
              <div style={s.miniStatValue}>{examData.length}</div>
              <div style={s.miniStatLabel}>Тақырып тесті</div>
            </div>

            <div style={s.miniStatCard}>
              <div style={s.miniStatIcon}>📚</div>
              <div style={s.miniStatValueSmall}>{profile?.profile_subject_1 || '-'}</div>
              <div style={s.miniStatLabel}>Бейінді пән 1</div>
            </div>

            <div style={s.miniStatCard}>
              <div style={s.miniStatIcon}>📚</div>
              <div style={s.miniStatValueSmall}>{profile?.profile_subject_2 || '-'}</div>
              <div style={s.miniStatLabel}>Бейінді пән 2</div>
            </div>
          </div>
        </div>

        {!hasData ? (
          <div style={s.emptyBox}>
            <div style={s.emptyIcon}>📊</div>
            <h2 style={s.emptyTitle}>Деректер жоқ</h2>
            <p style={s.emptyText}>
              AI анализ жасау үшін алдымен симулятор немесе тақырыптық тест тапсыру қажет.
            </p>
            <a href="/dashboard/simulator" style={s.primaryLink}>
              Симуляторға өту
            </a>
          </div>
        ) : !analysis ? (
          <div style={s.startCard}>
            <div style={s.startIcon}>🤖</div>
            <h2 style={s.startTitle}>AI анализге дайынмын</h2>
            <p style={s.startText}>
              {simulatorData.length} симулятор және {examData.length} тақырыптық тест
              нәтижесін талдап, саған нақты ұсыныс, болжам және оқу жоспарын дайындаймын.
            </p>

            <button
              onClick={runAnalysis}
              disabled={loading}
              style={{
                ...s.analyzeBtn,
                opacity: loading ? 0.75 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Анализ жасалуда...' : 'AI Анализді бастау'}
            </button>

            {error ? <p style={s.errorText}>{error}</p> : null}
          </div>
        ) : (
          <div style={s.analysisWrap}>
            <Section
              number="1"
              title="Жалпы білім деңгейі"
              content={analysis.overview}
            />

            <Section
              number="2"
              title="Пәндер бойынша деңгей"
              content={analysis.subjectLevels}
              variant="levels"
            />

            <Section
              number="3"
              title="Әлсіз тақырыптар"
              content={analysis.weakTopics}
            />

            <Section
              number="4"
              title="ҰБТ баллын болжау"
              content={analysis.scorePrediction}
              tone="blue"
            />

            <Section
              number="5"
              title="Персоналды оқу жоспары"
              content={analysis.studyPlan}
            />

            <Section
              number="6"
              title="Ата-анаға есеп"
              content={analysis.parentReport}
              tone="green"
            />

            <button
              onClick={runAnalysis}
              disabled={loading}
              style={{
                ...s.analyzeBtn,
                marginTop: 4,
                opacity: loading ? 0.75 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Жаңартылуда...' : 'Қайта анализ жасау'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function Section({
  number,
  title,
  content,
  tone = 'default',
  variant = 'default'
}: {
  number: string
  title: string
  content: string
  tone?: 'default' | 'blue' | 'green'
  variant?: 'default' | 'levels'
}) {
  const toneStyles =
    tone === 'blue'
      ? {
          box: {
            background: '#EFF6FF',
            border: '1px solid #BFDBFE'
          },
          circle: {
            background: '#0EA5E9'
          },
          text: {
            color: '#1D4ED8'
          }
        }
      : tone === 'green'
      ? {
          box: {
            background: '#F0FDF4',
            border: '1px solid #BBF7D0'
          },
          circle: {
            background: '#16A34A'
          },
          text: {
            color: '#166534'
          }
        }
      : {
          box: {
            background: '#FFFFFF',
            border: '1px solid #E2E8F0'
          },
          circle: {
            background: '#0F172A'
          },
          text: {
            color: '#334155'
          }
        }

  return (
    <div
      style={{
        ...s.section,
        ...toneStyles.box
      }}
    >
      <div style={s.sectionHeader}>
        <span
          style={{
            ...s.sectionNum,
            ...toneStyles.circle
          }}
        >
          {number}
        </span>
        <h2 style={s.sectionTitle}>{title}</h2>
      </div>

      <div>
        {content.split('\n').filter(Boolean).map((line, i) => {
          const isStrong = line.toLowerCase().includes('күшті')
          const isWeak = line.toLowerCase().includes('әлсіз')
          const isMedium = line.toLowerCase().includes('орташа')

          if (variant === 'levels') {
            return (
              <div key={i} style={s.levelRow}>
                <div style={s.levelIconWrap}>
                  {isStrong ? '✅' : isWeak ? '❌' : isMedium ? '⚠️' : '•'}
                </div>
                <p
                  style={{
                    ...s.sectionParagraph,
                    ...toneStyles.text,
                    margin: 0
                  }}
                >
                  {line}
                </p>
              </div>
            )
          }

          return (
            <p
              key={i}
              style={{
                ...s.sectionParagraph,
                ...toneStyles.text
              }}
            >
              {line}
            </p>
          )
        })}
      </div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#F8FAFC',
    padding: '24px 20px 40px'
  },

  wrap: {
    maxWidth: 980,
    margin: '0 auto'
  },

  loadingPage: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#F8FAFC'
  },

  loader: {
    width: 52,
    height: 52,
    border: '4px solid #0EA5E9',
    borderTopColor: 'transparent',
    borderRadius: '50%',
    margin: '0 auto 16px',
    animation: 'spin 1s linear infinite'
  },

  loadingText: {
    color: '#64748B',
    fontSize: 15,
    margin: 0
  },

  hero: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: 20,
    background: 'linear-gradient(135deg, #E0F2FE 0%, #F0F9FF 100%)',
    border: '1px solid #E2E8F0',
    borderRadius: 28,
    padding: 28,
    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)',
    marginBottom: 22
  },

  heroLeft: {},

  heroRight: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    alignContent: 'start'
  },

  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '9px 13px',
    borderRadius: 999,
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    color: '#0EA5E9',
    fontSize: 12,
    fontWeight: 800,
    marginBottom: 16
  },

  hello: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 8
  },

  helloName: {
    color: '#0F172A',
    fontWeight: 800
  },

  heroTitle: {
    fontSize: 34,
    fontWeight: 800,
    lineHeight: 1.12,
    letterSpacing: '-0.03em',
    color: '#0F172A',
    margin: 0,
    marginBottom: 12
  },

  heroText: {
    fontSize: 16,
    lineHeight: 1.8,
    color: '#64748B',
    margin: 0
  },

  miniStatCard: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: 18,
    padding: 18,
    textAlign: 'center',
    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)'
  },

  miniStatIcon: {
    fontSize: 24,
    marginBottom: 8
  },

  miniStatValue: {
    fontSize: 24,
    fontWeight: 800,
    color: '#0F172A',
    lineHeight: 1.15,
    marginBottom: 4
  },

  miniStatValueSmall: {
    fontSize: 16,
    fontWeight: 700,
    color: '#0F172A',
    lineHeight: 1.35,
    marginBottom: 4
  },

  miniStatLabel: {
    fontSize: 12,
    color: '#64748B'
  },

  emptyBox: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: 24,
    padding: 48,
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)'
  },

  emptyIcon: {
    fontSize: 52,
    marginBottom: 14
  },

  emptyTitle: {
    fontSize: 22,
    fontWeight: 800,
    color: '#0F172A',
    margin: '0 0 8px 0'
  },

  emptyText: {
    color: '#64748B',
    fontSize: 15,
    lineHeight: 1.7,
    margin: '0 0 22px 0'
  },

  primaryLink: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '14px 24px',
    borderRadius: 14,
    background: '#0EA5E9',
    color: '#FFFFFF',
    fontWeight: 800,
    textDecoration: 'none',
    fontSize: 15,
    boxShadow: '0 10px 24px rgba(14,165,233,0.20)'
  },

  startCard: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: 24,
    padding: 48,
    textAlign: 'center',
    boxShadow: '0 10px 30px rgba(15,23,42,0.05)'
  },

  startIcon: {
    fontSize: 58,
    marginBottom: 14
  },

  startTitle: {
    fontSize: 28,
    fontWeight: 800,
    color: '#0F172A',
    margin: '0 0 10px 0'
  },

  startText: {
    color: '#64748B',
    fontSize: 15,
    lineHeight: 1.75,
    margin: '0 auto 28px auto',
    maxWidth: 520
  },

  analyzeBtn: {
    padding: '16px 32px',
    borderRadius: 16,
    border: 'none',
    background: '#0EA5E9',
    color: '#FFFFFF',
    fontWeight: 800,
    fontSize: 16,
    boxShadow: '0 10px 24px rgba(14,165,233,0.25)'
  },

  errorText: {
    color: '#DC2626',
    marginTop: 14,
    marginBottom: 0,
    fontSize: 14
  },

  analysisWrap: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16
  },

  section: {
    borderRadius: 22,
    padding: 24,
    boxShadow: '0 6px 20px rgba(15,23,42,0.04)'
  },

  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16
  },

  sectionNum: {
    width: 34,
    height: 34,
    borderRadius: '50%',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 900,
    fontSize: 14,
    flexShrink: 0
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: 800,
    color: '#0F172A',
    margin: 0
  },

  sectionParagraph: {
    margin: '0 0 9px 0',
    fontSize: 15,
    lineHeight: 1.8
  },

  levelRow: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 8
  },

  levelIconWrap: {
    width: 22,
    flexShrink: 0,
    fontSize: 15,
    lineHeight: '24px'
  }
}