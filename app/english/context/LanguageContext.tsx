"use client"
import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { ru } from "../locales/ru"
import { kk } from "../locales/kk"

type Language = "ru" | "kk"
type Translations = typeof ru

interface LanguageContextType {
  lang: Language
  t: Translations
  switchLang: (lang: Language) => void
}

const LanguageContext = createContext<LanguageContextType>({
  lang: "ru",
  t: ru,
  switchLang: () => {},
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("ru")

  useEffect(() => {
    const saved = localStorage.getItem("english_lang") as Language
    if (saved === "ru" || saved === "kk") setLang(saved)
  }, [])

  const switchLang = (newLang: Language) => {
    setLang(newLang)
    localStorage.setItem("english_lang", newLang)
  }

  const t = lang === "ru" ? ru : kk

  return (
    <LanguageContext.Provider value={{ lang, t, switchLang }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => useContext(LanguageContext)
