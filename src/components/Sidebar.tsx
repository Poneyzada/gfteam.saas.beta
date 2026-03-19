'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useApp, Mode, Accent } from '@/contexts/AppContext'
import { supabase } from '@/lib/supabase'
import {
  LayoutDashboard, Users, DollarSign, BookOpen, Award,
  CheckSquare, TrendingUp, Trophy, Settings, ChevronLeft,
  ChevronRight, Globe2, Shield, LogOut, Zap, Sun, Moon, Palette,
  Activity, Dumbbell
} from 'lucide-react'

const t = {
  pt: {
    menu: 'MENU PRINCIPAL',
    settings: 'CONFIGURAÇÕES',
    dashboard: 'Dashboard',
    alunos: 'Alunos',
    financeiro: 'Financeiro',
    treinos: 'Plano de Aula',
    graduacoes: 'Graduações',
    checkin: 'Check-in',
    retencao: 'Retenção',
    competicoes: 'Competições',
    settings_label: 'Configurações',
    master: 'Painel Filiais',
    acesso: 'Controle de Acesso',
    sair: 'Sair',
    crm: 'Vendas (Leads)',
    loja: 'Loja & Estoque',
    relatorios: 'DRE & IDR',
    professores: 'Equipe/Prof',
    aluno: 'App (Aluno)',
  },
  en: {
    menu: 'MAIN MENU',
    settings: 'SETTINGS',
    dashboard: 'Dashboard',
    alunos: 'Students',
    financeiro: 'Financial',
    treinos: 'Class Syllabus',
    graduacoes: 'Promotions',
    checkin: 'Check-in',
    retencao: 'Retention',
    competicoes: 'Competitions',
    settings_label: 'Settings',
    master: 'Branches Panel',
    acesso: 'Control',
    sair: 'Sign Out',
    crm: 'Leads (CRM)',
    loja: 'Inventory & Store',
    relatorios: 'DRE & IDR',
    professores: 'Staff/Prof',
    aluno: 'App (Student)',
  },
}

const mainNav = [
  { key: 'dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { key: 'alunos', icon: Users, href: '/dashboard/alunos' },
  { key: 'crm', icon: TrendingUp, href: '/dashboard/crm' },
  { key: 'financeiro', icon: DollarSign, href: '/dashboard/financeiro' },
  { key: 'relatorios', icon: Activity, href: '/dashboard/financeiro/relatorios' },
  { key: 'loja', icon: Dumbbell, href: '/dashboard/loja' },
  { key: 'professores', icon: Shield, href: '/dashboard/professores' },
  { key: 'treinos', icon: BookOpen, href: '/dashboard/treinos' },
  { key: 'graduacoes', icon: Award, href: '/dashboard/graduacoes' },
  { key: 'checkin', icon: CheckSquare, href: '/dashboard/checkin' },
]

const settingsNav = [
  { key: 'acesso', icon: Zap, href: '/dashboard/acesso' },
  { key: 'master', icon: Globe2, href: '/dashboard/master' },
  { key: 'settings_label', icon: Settings, href: '/dashboard/configuracoes' },
]

const accentOptions: { id: Accent, color: string }[] = [
  { id: 'gold', color: '#FFC700' },
  { id: 'green', color: '#00B341' },
  { id: 'blue', color: '#0052CC' },
  { id: 'red', color: '#E63B2E' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { sidebarCollapsed, setSidebarCollapsed, lang, mode, setMode, accent, setAccent } = useApp()
  const [role, setRole] = useState<string>('manager')

  useEffect(() => {
    async function loadRole() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
        if (data?.role) setRole(data.role)
      }
    }
    loadRole()
  }, [])

  const isActive = (href: string) => pathname === href

  // Only show 'master' (Filiais) if role is 'master' (or explicitly configured)
  const filteredSettingsNav = settingsNav.filter(item => {
    if (item.key === 'master' && role !== 'master') return false
    return true
  })

  return (
    <aside 
      className={`relative h-screen sticky top-0 bg-surface-800 border-r border-white/5 transition-all duration-300 z-50 flex flex-col shrink-0 ${
        !sidebarCollapsed ? 'w-72' : 'w-24'
      }`}
    >
      {/* Header / Logo */}
      <div className="h-24 flex items-center justify-between px-6 border-b border-white/5">
        <div className={`flex items-center gap-3 transition-opacity duration-300 ${!sidebarCollapsed ? 'opacity-100' : 'opacity-0 hidden'}`}>
          <div className="w-10 h-10 rounded-xl bg-accent-primary flex items-center justify-center shadow-lg shadow-accent-primary/20 hatched">
            <span className="font-display font-black text-xl text-surface-900 italic">GF</span>
          </div>
          <span className="font-display font-black text-lg text-text-primary tracking-tighter italic uppercase">GFTEAM</span>
        </div>
        <button 
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="w-10 h-10 rounded-xl bg-surface-700 hover:bg-surface-600 border border-white/10 flex items-center justify-center transition-all group"
        >
          {!sidebarCollapsed ? <ChevronLeft className="w-5 h-5 group-hover:scale-110" /> : <ChevronRight className="w-5 h-5 group-hover:scale-110" />}
        </button>
      </div>

      {/* Nav Content */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-8 px-4 space-y-8 scrollbar-hide">
        {/* Main Menu */}
        <div>
          <p className={`text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-6 px-4 transition-opacity ${!sidebarCollapsed ? 'opacity-100' : 'opacity-0'}`}>
            {t[lang].menu}
          </p>
          <div className="space-y-2">
            {mainNav.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group relative overflow-hidden ${
                  isActive(item.href) 
                    ? 'bg-accent-primary text-surface-900 shadow-xl shadow-accent-primary/20 hatched' 
                    : 'text-text-secondary hover:bg-surface-700 hover:text-text-primary'
                }`}
              >
                {/* Accent Line for Active Item */}
                {isActive(item.href) && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-surface-900" />
                )}
                
                <item.icon className={`w-5 h-5 relative z-10 ${isActive(item.href) ? 'text-surface-900' : 'group-hover:scale-110 transition-transform'}`} />
                {!sidebarCollapsed && (
                  <span className="font-black text-xs uppercase tracking-widest relative z-10">{t[lang][item.key as keyof typeof t.pt]}</span>
                )}
                {!!sidebarCollapsed && (
                   <div className="absolute left-full ml-4 px-3 py-2 bg-surface-700 text-text-primary text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all translate-x-[-10px] group-hover:translate-x-0 z-[100] whitespace-nowrap border border-white/10 shadow-2xl">
                     {t[lang][item.key as keyof typeof t.pt]}
                   </div>
                )}
              </Link>
            ))}
          </div>
        </div>

        {/* Branding Options & Theme */}
        <div>
          <p className={`text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-6 px-4 transition-opacity ${!sidebarCollapsed ? 'opacity-100' : 'opacity-0'}`}>
            {t[lang].settings}
          </p>
          <div className="space-y-2">
             {/* Palette Selection (Accent) */}
             <div className={`flex items-center gap-2 px-4 py-3 mb-4 bg-surface-900/50 rounded-2xl border border-white/5 transition-all ${!sidebarCollapsed ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <Palette className="w-4 h-4 text-text-muted" />
                <div className="flex flex-1 justify-around">
                   {accentOptions.map((opt) => (
                      <button
                         key={opt.id}
                         onClick={() => setAccent(opt.id)}
                         className={`w-5 h-5 rounded-full border-2 transition-all ${accent === opt.id ? 'border-white scale-125' : 'border-transparent'}`}
                         style={{ backgroundColor: opt.color }}
                      />
                   ))}
                </div>
             </div>

            {filteredSettingsNav.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group relative overflow-hidden ${
                  isActive(item.href) 
                    ? 'bg-accent-primary text-surface-900 shadow-xl shadow-accent-primary/20 hatched' 
                    : 'text-text-secondary hover:bg-surface-700 hover:text-text-primary'
                }`}
              >
                <item.icon className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform" />
                {!sidebarCollapsed && (
                  <span className="font-black text-xs uppercase tracking-widest relative z-10">{t[lang][item.key as keyof typeof t.pt]}</span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Footer / User Profile Toggle */}
      <div className="p-4 border-t border-white/5 bg-surface-800/50 backdrop-blur-md">
        <button
           onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
           className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group relative bg-surface-900 border border-white/5 mb-2 hover:bg-surface-700`}
        >
           {mode === 'dark' ? <Sun className="w-5 h-5 text-accent-primary animate-pulse" /> : <Moon className="w-5 h-5 text-accent-primary" />}
           {!sidebarCollapsed && <span className="font-black text-[10px] uppercase tracking-widest text-text-primary">{mode} Mode</span>}
        </button>
        <button 
          onClick={async () => {
             await supabase.auth.signOut()
             window.location.href = '/login'
          }}
          className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all group relative group"
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          {!sidebarCollapsed && <span className="font-black text-[10px] uppercase tracking-[0.2em]">Sair</span>}
        </button>
      </div>
    </aside>
  )
}
