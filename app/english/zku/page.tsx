'use client'

import { useState } from 'react'
import Link from 'next/link'
import { translations, type Lang } from '@/lib/english/zkuTranslations'

export default function ZKULandingPage() {
  const [lang, setLang] = useState<Lang>('ru')
  const t = translations[lang]

  return (
    <div style={{ fontFamily: "'Montserrat', sans-serif", minHeight: '100vh', background: '#F4F7FB', color: '#1F2937', margin: 0, padding: 0 }}>

      {/* ══════════════════════════════ HEADER ══════════════════════════════ */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.97)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,56,118,0.1)',
        padding: '0 48px',
        height: 68,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 32,
      }}>
        {/* Logo */}
        <Link href="/english/zku" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <div style={{
            width: 42, height: 42, borderRadius: 11,
            background: 'linear-gradient(135deg, #003876 0%, #0055a4 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 900, fontSize: 11, letterSpacing: '-0.5px',
            boxShadow: '0 4px 12px rgba(0,56,118,0.3)',
          }}>{lang === 'ru' ? 'ЗКУ' : lang === 'kz' ? 'БҚУ' : 'WKU'}</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, color: '#003876', lineHeight: 1.15 }}>
              {lang === 'ru' ? 'ЗКУ им. М. Утемісова' : lang === 'kz' ? 'МӨ атындағы БҚУ' : 'WKU · English'}
            </div>
            <div style={{ fontSize: 10, color: '#94A3B8', lineHeight: 1 }}>English · Powered by KHAMADI</div>
          </div>
        </Link>

        {/* Nav links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {[t.nav_about, t.nav_program, t.nav_teachers, t.nav_contacts].map((item) => (
            <a key={item} href="#" style={{
              padding: '7px 15px', borderRadius: 8,
              fontSize: 13, fontWeight: 600, color: '#64748B',
              textDecoration: 'none',
              transition: 'color 0.15s, background 0.15s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#003876'; (e.currentTarget as HTMLElement).style.background = 'rgba(0,56,118,0.06)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#64748B'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
              {item}
            </a>
          ))}
        </nav>

        {/* Right block */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Lang toggle */}
          <div style={{ display: 'flex', background: 'rgba(0,56,118,0.06)', borderRadius: 8, padding: 3, gap: 2 }}>
            {(['ru', 'kz', 'en'] as Lang[]).map(l => (
              <button key={l} onClick={() => setLang(l)} style={{
                padding: '5px 12px', borderRadius: 6, fontSize: 12, fontWeight: 700,
                cursor: 'pointer', border: 'none', transition: 'all 0.15s',
                background: lang === l ? '#003876' : 'transparent',
                color: lang === l ? '#fff' : '#64748B',
                boxShadow: lang === l ? '0 2px 6px rgba(0,56,118,0.25)' : 'none',
              }}>
                {l === 'ru' ? 'РУС' : l === 'kz' ? 'ҚАЗ' : 'ENG'}
              </button>
            ))}
          </div>

          <Link href="/english/zku/login" style={{
            padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700,
            color: '#003876', textDecoration: 'none',
            border: '1.5px solid rgba(0,56,118,0.2)',
          }}>{t.btn_login}</Link>

          <Link href="/english/zku/register" style={{
            padding: '8px 20px', borderRadius: 8, fontSize: 13, fontWeight: 700,
            color: '#fff', textDecoration: 'none',
            background: 'linear-gradient(135deg, #003876 0%, #0055a4 100%)',
            boxShadow: '0 4px 12px rgba(0,56,118,0.3)',
          }}>{t.btn_register}</Link>
        </div>
      </header>

      {/* ══════════════════════════════ HERO ══════════════════════════════ */}
      <section style={{
        background: 'linear-gradient(155deg, #001d45 0%, #003876 45%, #004fa0 100%)',
        padding: '96px 48px 80px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: -120, right: -80, width: 500, height: 500, borderRadius: '50%', background: 'rgba(255,194,44,0.08)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: '30%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 80, left: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(0,150,255,0.08)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,194,44,0.15)', border: '1px solid rgba(255,194,44,0.3)',
            color: '#FFC72C', padding: '7px 18px', borderRadius: 999,
            fontSize: 13, fontWeight: 700, marginBottom: 32,
          }}>
            🎓 {t.hero_badge.replace('🎓 ', '')}
          </div>

          <h1 style={{
            fontSize: 'clamp(36px, 5vw, 58px)',
            fontWeight: 900, color: '#fff',
            lineHeight: 1.13, marginBottom: 24,
            whiteSpace: 'pre-line',
            textShadow: '0 2px 20px rgba(0,0,0,0.2)',
          }}>
            {t.hero_title}
          </h1>

          <p style={{
            fontSize: 18, color: 'rgba(255,255,255,0.72)',
            lineHeight: 1.7, maxWidth: 560, margin: '0 auto 44px',
          }}>
            {t.hero_sub}
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
            <Link href="/english/zku/register" style={{
              padding: '16px 38px', borderRadius: 12,
              background: '#FFC72C', color: '#003876',
              fontWeight: 800, fontSize: 16, textDecoration: 'none',
              display: 'inline-block',
              boxShadow: '0 8px 28px rgba(255,194,44,0.45)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}>{t.btn_start}</Link>
            <Link href="/english/zku/login" style={{
              padding: '16px 38px', borderRadius: 12,
              background: 'rgba(255,255,255,0.1)',
              border: '1.5px solid rgba(255,255,255,0.25)',
              color: '#fff', fontWeight: 700, fontSize: 16,
              textDecoration: 'none', display: 'inline-block',
            }}>{t.btn_enter}</Link>
          </div>

          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
            {t.hero_note}
          </p>
        </div>

        {/* Stats bar */}
        <div style={{
          maxWidth: 900, margin: '64px auto 0',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: 1,
          background: 'rgba(255,255,255,0.08)',
          borderRadius: 16,
          overflow: 'hidden',
          border: '1px solid rgba(255,255,255,0.12)',
        }}>
          {[
            { value: '1 200+', label: t.stats_students },
            { value: '36',     label: t.stats_teachers },
            { value: '600',    label: t.stats_lessons  },
            { value: '340+',   label: t.stats_certs    },
          ].map((s, i) => (
            <div key={i} style={{
              padding: '24px 20px', textAlign: 'center',
              background: 'rgba(255,255,255,0.05)',
              borderRight: i < 3 ? '1px solid rgba(255,255,255,0.1)' : 'none',
            }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: '#FFC72C', marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════ FEATURES ══════════════════════════════ */}
      <section style={{ padding: '80px 48px', maxWidth: 1140, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 52 }}>
          <h2 style={{ fontSize: 32, fontWeight: 900, color: '#003876', marginBottom: 12 }}>{t.features_h}</h2>
          <p style={{ fontSize: 16, color: '#64748B', maxWidth: 500, margin: '0 auto' }}>
            {lang === 'ru' ? 'Всё что нужно для изучения английского в ЗКУ им. М. Утемісова' : lang === 'kz' ? 'МӨ атындағы БҚУ-да ағылшын тілін үйрену үшін қажеттінің бәрі' : 'Everything you need to learn English at West Kazakhstan University'}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 24,
        }}>
          {[
            { icon: '👥', title: t.f1_title, desc: t.f1_desc, color: '#003876', bg: 'rgba(0,56,118,0.08)' },
            { icon: '📊', title: t.f2_title, desc: t.f2_desc, color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)' },
            { icon: '🎓', title: t.f3_title, desc: t.f3_desc, color: '#D97706', bg: 'rgba(255,194,44,0.12)' },
            { icon: '📚', title: t.f4_title, desc: t.f4_desc, color: '#7C3AED', bg: 'rgba(124,58,237,0.1)' },
            { icon: '📋', title: t.f5_title, desc: t.f5_desc, color: '#059669', bg: 'rgba(5,150,105,0.1)' },
            { icon: '📺', title: t.f6_title, desc: t.f6_desc, color: '#DC2626', bg: 'rgba(220,38,38,0.1)' },
          ].map((f) => (
            <div key={f.title} style={{
              background: '#fff',
              borderRadius: 20, padding: '32px 28px',
              border: '1px solid rgba(0,56,118,0.08)',
              boxShadow: '0 2px 8px rgba(0,56,118,0.04)',
              transition: 'box-shadow 0.2s, transform 0.2s',
              cursor: 'default',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(0,56,118,0.12)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,56,118,0.04)'; (e.currentTarget as HTMLElement).style.transform = 'none' }}>
              <div style={{
                width: 56, height: 56, borderRadius: 14, background: f.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 28, marginBottom: 20,
              }}>{f.icon}</div>
              <h3 style={{ fontSize: 17, fontWeight: 800, color: '#003876', marginBottom: 10 }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════ HOW IT WORKS ══════════════════════════════ */}
      <section style={{ background: '#fff', padding: '80px 48px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 32, fontWeight: 900, color: '#003876', marginBottom: 12 }}>{t.how_h}</h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 48,
            textAlign: 'center',
          }}>
            {[
              { n: '1', title: t.step1, desc: t.step1_desc },
              { n: '2', title: t.step2, desc: t.step2_desc },
              { n: '3', title: t.step3, desc: t.step3_desc },
            ].map((s) => (
              <div key={s.n}>
                <div style={{
                  width: 72, height: 72, borderRadius: '50%', margin: '0 auto 24px',
                  background: 'linear-gradient(135deg, #003876 0%, #0055a4 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, fontWeight: 900, color: '#fff',
                  boxShadow: '0 8px 24px rgba(0,56,118,0.3)',
                }}>{s.n}</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#003876', marginBottom: 12 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#64748B', lineHeight: 1.7, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ CTA ══════════════════════════════ */}
      <section style={{ padding: '80px 48px' }}>
        <div style={{
          maxWidth: 820, margin: '0 auto',
          background: 'linear-gradient(135deg, #001d45 0%, #003876 60%, #0050a0 100%)',
          borderRadius: 28, padding: '64px 56px',
          textAlign: 'center',
          boxShadow: '0 24px 64px rgba(0,56,118,0.3)',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, borderRadius: '50%', background: 'rgba(255,194,44,0.08)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: -40, left: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative' }}>
            <div style={{
              display: 'inline-block', background: 'rgba(255,194,44,0.15)',
              border: '1px solid rgba(255,194,44,0.3)', color: '#FFC72C',
              padding: '6px 16px', borderRadius: 999, fontSize: 13, fontWeight: 700, marginBottom: 24,
            }}>
              {lang === 'ru' ? '✨ Для студентов и преподавателей ЗКУ' : lang === 'kz' ? '✨ БҚУ студенттері мен оқытушылары үшін' : '✨ For WKU students and teachers'}
            </div>

            <h2 style={{ fontSize: 30, fontWeight: 900, color: '#fff', marginBottom: 16 }}>
              {t.cta_h}
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.65)', marginBottom: 40 }}>
              {t.cta_sub}
            </p>

            <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/english/zku/register" style={{
                padding: '15px 36px', borderRadius: 12,
                background: '#FFC72C', color: '#003876',
                fontWeight: 800, fontSize: 16, textDecoration: 'none', display: 'inline-block',
                boxShadow: '0 8px 28px rgba(255,194,44,0.5)',
              }}>{t.cta_btn}</Link>
              <Link href="/english/zku/login" style={{
                padding: '15px 36px', borderRadius: 12,
                background: 'rgba(255,255,255,0.1)', color: '#fff',
                border: '1.5px solid rgba(255,255,255,0.25)',
                fontWeight: 600, fontSize: 16, textDecoration: 'none', display: 'inline-block',
              }}>{t.cta_link}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ FOOTER ══════════════════════════════ */}
      <footer style={{
        borderTop: '1px solid rgba(0,56,118,0.1)',
        padding: '32px 48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 16, background: '#fff',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 8,
            background: 'linear-gradient(135deg, #003876, #0055a4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 900, fontSize: 10,
          }}>{lang === 'ru' ? 'ЗКУ' : lang === 'kz' ? 'БҚУ' : 'WKU'}</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#003876' }}>{t.footer_uni}</div>
            <div style={{ fontSize: 12, color: '#94A3B8' }}>KHAMADI English</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#94A3B8' }}>
          <span>{t.footer_powered}</span>
          <Link href="/english" style={{ color: '#0ea5e9', fontWeight: 700, textDecoration: 'none' }}>
            KHAMADI English
          </Link>
        </div>
      </footer>
    </div>
  )
}
