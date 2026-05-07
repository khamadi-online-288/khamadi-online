"use client"
import { useLanguage } from "../context/LanguageContext"

export function LanguageSwitcher({ variant = 'dark' }: { variant?: 'dark' | 'light' }) {
  const { lang, switchLang } = useLanguage()
  const isLight = variant === 'light'

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 2,
      background: isLight ? '#f1f5f9' : 'rgba(255,255,255,0.1)',
      borderRadius: 10, padding: 3,
    }}>
      <button
        onClick={() => switchLang("ru")}
        style={{
          padding: '5px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
          fontSize: 12, fontWeight: 800, fontFamily: 'Montserrat, sans-serif',
          transition: 'all 0.18s ease', letterSpacing: '0.04em',
          background: lang === "ru" ? (isLight ? '#0ea5e9' : '#fff') : 'transparent',
          color: lang === "ru" ? (isLight ? '#fff' : '#0f172a') : (isLight ? '#64748b' : 'rgba(255,255,255,0.6)'),
          boxShadow: lang === "ru" ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
        }}
        title="Русский язык"
      >
        РУС
      </button>
      <button
        onClick={() => switchLang("kk")}
        style={{
          padding: '5px 12px', borderRadius: 8, border: 'none', cursor: 'pointer',
          fontSize: 12, fontWeight: 800, fontFamily: 'Montserrat, sans-serif',
          transition: 'all 0.18s ease', letterSpacing: '0.04em',
          background: lang === "kk" ? (isLight ? '#0ea5e9' : '#fff') : 'transparent',
          color: lang === "kk" ? (isLight ? '#fff' : '#0f172a') : (isLight ? '#64748b' : 'rgba(255,255,255,0.6)'),
          boxShadow: lang === "kk" ? '0 2px 8px rgba(0,0,0,0.15)' : 'none',
        }}
        title="Қазақ тілі"
      >
        ҚАЗ
      </button>
    </div>
  )
}
