'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Mode = 'light' | 'dark'
export type Accent = 'green' | 'gold' | 'blue' | 'red' | 'purple' | 'orange'

interface AppContextType {
  mode: Mode
  setMode: (m: Mode) => void
  accent: Accent
  setAccent: (a: Accent) => void
  lang: 'pt' | 'en'
  setLang: (l: 'pt' | 'en') => void
  sidebarCollapsed: boolean
  setSidebarCollapsed: (v: boolean) => void
}

const AppContext = createContext<AppContextType>({
  mode: 'light', setMode: () => {},
  accent: 'gold', setAccent: () => {},
  lang: 'pt', setLang: () => {},
  sidebarCollapsed: false, setSidebarCollapsed: () => {},
})

export function AppProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<Mode>('light')
  const [accent, setAccentState] = useState<Accent>('gold')
  const [lang, setLang] = useState<'pt' | 'en'>('pt')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const setMode = (m: Mode) => {
    setModeState(m)
    document.documentElement.setAttribute('data-mode', m)
    localStorage.setItem('gfteam-mode', m)
  }

  const setAccent = (a: Accent) => {
    setAccentState(a)
    document.documentElement.setAttribute('data-accent', a)
    localStorage.setItem('gfteam-accent', a)
  }

  useEffect(() => {
    const savedMode = localStorage.getItem('gfteam-mode') as Mode | null
    const finalMode = savedMode || 'light'
    setModeState(finalMode)
    document.documentElement.setAttribute('data-mode', finalMode)

    const savedAccent = localStorage.getItem('gfteam-accent') as Accent | null
    const finalAccent = savedAccent || 'gold'
    setAccentState(finalAccent)
    document.documentElement.setAttribute('data-accent', finalAccent)
    
    const savedLang = localStorage.getItem('gfteam-lang') as 'pt' | 'en' | null
    if (savedLang) setLang(savedLang)
  }, [])

  return (
    <AppContext.Provider value={{ mode, setMode, accent, setAccent, lang, setLang, sidebarCollapsed, setSidebarCollapsed }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
