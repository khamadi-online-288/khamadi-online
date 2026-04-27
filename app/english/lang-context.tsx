'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { T, type Lang } from './translations'

type Translations = typeof T.ru | typeof T.kz

type LangCtx = {
  lang: Lang
  setLang: (l: Lang) => void
  t: Translations
}

const LangContext = createContext<LangCtx>({
  lang: 'ru',
  setLang: () => {},
  t: T.ru as Translations,
})

export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>('ru')

  useEffect(() => {
    const saved = localStorage.getItem('khamadi-lang') as Lang | null
    if (saved === 'kz' || saved === 'ru') setLangState(saved)
  }, [])

  function setLang(l: Lang) {
    setLangState(l)
    localStorage.setItem('khamadi-lang', l)
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t: T[lang] }}>
      {children}
    </LangContext.Provider>
  )
}

export function useLang() {
  return useContext(LangContext)
}

export function LangToggle({ className }: { className?: string }) {
  const { lang, setLang } = useLang()

  return (
    <button
      className={className}
      onClick={() => setLang(lang === 'ru' ? 'kz' : 'ru')}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 2,
        padding: '7px 4px',
        borderRadius: 14,
        border: '1.5px solid rgba(14,165,233,0.16)',
        background: 'rgba(255,255,255,0.82)',
        cursor: 'pointer',
        fontSize: 12,
        fontWeight: 900,
        letterSpacing: '0.04em',
        transition: 'all .2s ease',
        userSelect: 'none',
        backdropFilter: 'blur(10px)',
        minWidth: 70,
        justifyContent: 'center',
      }}
      title="Переключить язык / Тілді ауыстыру"
    >
      <span style={{
        padding: '3px 8px', borderRadius: 10,
        background: lang === 'ru' ? 'linear-gradient(135deg,#38bdf8,#0ea5e9)' : 'transparent',
        color: lang === 'ru' ? '#fff' : '#64748b',
        transition: 'all .2s ease',
      }}>RU</span>
      <span style={{
        padding: '3px 8px', borderRadius: 10,
        background: lang === 'kz' ? 'linear-gradient(135deg,#38bdf8,#0ea5e9)' : 'transparent',
        color: lang === 'kz' ? '#fff' : '#64748b',
        transition: 'all .2s ease',
      }}>KZ</span>
    </button>
  )
}
