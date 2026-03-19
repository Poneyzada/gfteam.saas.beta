'use client'

import { Bell, Search, ChevronDown } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'

const t = {
  pt: {
    search: 'Buscar alunos, módulos...',
    unit: 'GFTeam Matriz — Rio de Janeiro',
    notifications: 'Notificações',
  },
  en: {
    search: 'Search students, modules...',
    unit: 'GFTeam Matrix — Rio de Janeiro',
    notifications: 'Notifications',
  },
}

export default function TopBar({ title }: { title: string }) {
  const { lang } = useApp()
  const tx = t[lang]

  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-surface-500 bg-surface-900 sticky top-0 z-40">
      <div>
        <h1 className="font-display font-bold text-xl text-text-primary">{title}</h1>
        <p className="text-xs text-text-muted mt-0.5 font-mono">{tx.unit}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-surface-700 border border-surface-500 rounded-xl px-3 py-2 w-64 hover:border-surface-400 transition-all">
          <Search className="w-4 h-4 text-text-muted flex-shrink-0" />
          <input
            type="text"
            placeholder={tx.search}
            className="bg-transparent text-sm text-text-secondary placeholder:text-text-muted outline-none w-full"
          />
          <kbd className="hidden sm:inline-flex items-center text-[10px] font-mono text-text-muted bg-surface-500 px-1.5 py-0.5 rounded">⌘K</kbd>
        </div>

        {/* Notifications */}
        <button className="relative p-2 rounded-xl bg-surface-700 border border-surface-500 text-text-muted hover:text-text-primary hover:border-surface-400 transition-all">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full accent-bg ring-2 ring-surface-900" />
        </button>

        {/* Unit selector */}
        <button className="hidden md:flex items-center gap-2 bg-surface-700 border border-surface-500 rounded-xl px-3 py-2 hover:border-surface-400 transition-all">
          <div className="w-6 h-6 rounded-full accent-bg flex items-center justify-center flex-shrink-0">
            <span className="text-[9px] font-bold text-surface-900">GF</span>
          </div>
          <span className="text-sm font-medium text-text-secondary">Matriz</span>
          <ChevronDown className="w-3.5 h-3.5 text-text-muted" />
        </button>
      </div>
    </header>
  )
}
