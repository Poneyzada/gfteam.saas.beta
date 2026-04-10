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
  Activity, Dumbbell, X, Camera
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
  { key: 'dashboard', icon: LayoutDashboard, href: '/dashboard', roles: ['manager', 'instructor', 'master'] },
  { key: 'alunos', icon: Users, href: '/dashboard/alunos', roles: ['manager', 'instructor', 'master'], permission: 'students' },
  { key: 'crm', icon: TrendingUp, href: '/dashboard/crm', roles: ['manager', 'master'], permission: 'students' },
  { key: 'financeiro', icon: DollarSign, href: '/dashboard/financeiro', roles: ['manager', 'master'], permission: 'finance' },
  { key: 'relatorios', icon: Activity, href: '/dashboard/financeiro/relatorios', roles: ['manager', 'master'], permission: 'finance' },
  { key: 'loja', icon: Dumbbell, href: '/dashboard/loja', roles: ['manager', 'master'], permission: 'finance' },
  { key: 'professores', icon: Shield, href: '/dashboard/professores', roles: ['manager', 'master'], permission: 'admin' }, 
  { key: 'treinos', icon: BookOpen, href: '/dashboard/treinos', roles: ['manager', 'instructor', 'master'], permission: 'training' },
  { key: 'graduacoes', icon: Award, href: '/dashboard/graduacoes', roles: ['manager', 'instructor', 'master'], permission: 'training' },
  { key: 'checkin', icon: CheckSquare, href: '/dashboard/checkin', roles: ['manager', 'instructor', 'master'], permission: 'students' },
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

export default function Sidebar({ mobileOpen = false, onMobileClose }: { mobileOpen?: boolean, onMobileClose?: () => void }) {
  const pathname = usePathname()
  const { sidebarCollapsed, setSidebarCollapsed, lang, mode, setMode, accent, setAccent } = useApp()
  const [role, setRole] = useState<string>('manager')
  const [permissions, setPermissions] = useState<any>({})
  const [unitLogo, setUnitLogo] = useState<string | null>(null)
  const [unitName, setUnitName] = useState('GFTEAM')

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('role, permissions, tenant_id').eq('id', user.id).single()
        if (data) {
          setRole(data.role || 'instructor')
          setPermissions(data.permissions || {})
          
          const { data: tenant } = await supabase.from('tenants').select('name, logo_url').eq('id', data.tenant_id).single()
          if (tenant) {
             setUnitName(tenant.name || 'GFTEAM')
             setUnitLogo(tenant.logo_url)
          }
        }
      }
    }
    loadProfile()
  }, [])

  const isActive = (href: string) => pathname === href

  const filteredSettingsNav = settingsNav.filter(item => {
    if (item.key === 'master' && role !== 'master') return false
    return true
  })

  const filteredMainNav = mainNav.filter(item => {
    if (role === 'master') return true
    if (!item.roles.includes(role)) return false
    const hasPermsSet = Object.keys(permissions).length > 0
    if (!hasPermsSet && (role === 'manager' || role === 'master')) return true
    if ((item as any).permission) {
      const p = (item as any).permission
      if (!permissions[p] && !permissions.admin) return false
    }
    return true
  })

  return (
    <aside 
      className={`${mobileOpen ? 'fixed inset-0 w-full h-[100dvh] z-[100] bg-surface-900 overflow-y-auto overflow-x-hidden flex flex-col pb-24' : 'relative h-screen sticky top-0 bg-surface-800 border-r border-white/5 transition-all duration-300 z-50 flex flex-col shrink-0'} ${!mobileOpen && !sidebarCollapsed ? 'w-72' : ''} ${!mobileOpen && sidebarCollapsed ? 'w-24' : ''}`}
    >
      {/* Header / Logo Dinâmica */}
      <div className="h-24 flex items-center justify-between px-6 border-b border-white/5">
        <div className={`flex items-center gap-3 transition-opacity duration-300 pointer-events-auto ${!sidebarCollapsed || mobileOpen ? 'opacity-100' : 'opacity-0 hidden'} group`}>
          <div className="relative">
             <input id="sidebar-logo-upload" type="file" hidden accept="image/*" onChange={(e) => {
               const file = e.target.files?.[0];
               if(file) {
                 const newUrl = URL.createObjectURL(file);
                 setUnitLogo(newUrl);
                 alert('Logo atualizada temporariamente! Em produção, a nova logo da unidade será salva no Supabase Storage. 🥋🚀');
               }
             }} />
             <div 
               onClick={(e) => { e.preventDefault(); e.stopPropagation(); document.getElementById('sidebar-logo-upload')?.click(); }}
               className="w-10 h-10 rounded-xl bg-accent-primary flex items-center justify-center shadow-lg shadow-accent-primary/20 overflow-hidden border border-white/10 hover:scale-105 transition-transform cursor-pointer relative z-50 pointer-events-auto"
             >
               {unitLogo ? (
                 <img src={unitLogo} alt="Logo" className="w-full h-full object-cover" />
               ) : (
                 <span className="font-display font-black text-xl text-black italic">GF</span>
               )}
               <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center text-white pointer-events-none">
                  <Camera className="w-4 h-4" />
               </div>
             </div>
          </div>
          <Link href="/dashboard/configuracoes" className="flex flex-col cursor-pointer hover:opacity-80 transition-opacity">
             <span className="font-display font-black text-lg text-text-primary tracking-tighter italic uppercase leading-tight truncate max-w-[120px]">{unitName}</span>
             <span className="text-[7px] font-black text-accent-primary uppercase tracking-[0.3em] opacity-80 italic">Unidade Oficial</span>
          </Link>
        </div>
        
        {!mobileOpen && (
          <button 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-10 h-10 rounded-xl bg-surface-700 hover:bg-surface-600 border border-white/10 flex items-center justify-center transition-all group"
          >
            {!sidebarCollapsed ? <ChevronLeft className="w-5 h-5 group-hover:scale-110" /> : <ChevronRight className="w-5 h-5 group-hover:scale-110" />}
          </button>
        )}

        {mobileOpen && (
           <button onClick={onMobileClose} className="w-10 h-10 rounded-xl bg-surface-700 flex items-center justify-center border border-white/10 text-text-primary"><X className="w-5 h-5" /></button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden py-8 px-4 space-y-8 scrollbar-hide">
        <div>
          <p className={`text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-6 px-4 transition-opacity ${!sidebarCollapsed || mobileOpen ? 'opacity-100' : 'opacity-0'}`}>
            {t[lang].menu}
          </p>
          <div className="space-y-2">
            {filteredMainNav.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                onClick={() => { if (mobileOpen && onMobileClose) onMobileClose() }}
                className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group relative overflow-hidden ${
                  isActive(item.href) 
                    ? 'bg-accent-primary shadow-xl shadow-accent-primary/20 hatched pointer-events-auto' 
                    : 'text-text-secondary hover:bg-surface-700 hover:text-text-primary'
                }`}
                style={isActive(item.href) ? { color: '#000000' } : {}}
              >
                {isActive(item.href) && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-black" />
                )}
                
                <item.icon className={`w-5 h-5 relative z-10 ${isActive(item.href) ? '!text-black' : 'group-hover:scale-110 transition-transform'}`} style={isActive(item.href) ? { color: '#000000' } : {}} />
                {!sidebarCollapsed || mobileOpen ? (
                  <span className={`font-black text-xs uppercase tracking-widest relative z-10 ${isActive(item.href) ? '!text-black' : ''}`} style={isActive(item.href) ? { color: '#000000' } : {}}>{t[lang][item.key as keyof typeof t.pt]}</span>
                ) : null}
              </Link>
            ))}
          </div>
        </div>

        {/* Branding & Theme */}
        <div>
          <p className={`text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-6 px-4 transition-opacity ${!sidebarCollapsed || mobileOpen ? 'opacity-100' : 'opacity-0'}`}>
            {t[lang].settings}
          </p>
          <div className="space-y-2">
             <div className={`flex items-center gap-2 px-4 py-3 mb-4 bg-surface-900/50 rounded-2xl border border-white/5 transition-all ${!sidebarCollapsed || mobileOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
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
                onClick={() => { if (mobileOpen && onMobileClose) onMobileClose() }}
                className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group relative overflow-hidden ${
                  isActive(item.href) 
                    ? 'bg-accent-primary !text-black shadow-xl shadow-accent-primary/20 hatched pointer-events-auto' 
                    : 'text-text-secondary hover:bg-surface-700 hover:text-text-primary'
                }`}
              >
                <item.icon className={`w-5 h-5 relative z-10 ${isActive(item.href) ? '!text-black' : 'group-hover:scale-110 transition-transform'}`} style={isActive(item.href) ? { color: '#000000' } : {}} />
                {!sidebarCollapsed || mobileOpen ? (
                  <span className={`font-black text-xs uppercase tracking-widest relative z-10 ${isActive(item.href) ? '!text-black' : ''}`} style={isActive(item.href) ? { color: '#000000' } : {}}>{t[lang][item.key as keyof typeof t.pt]}</span>
                ) : null}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-white/5 bg-surface-800/50 backdrop-blur-md">
        <button
           onClick={() => setMode(mode === 'dark' ? 'light' : 'dark')}
           className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group relative bg-surface-900 border border-white/5 mb-2 hover:bg-surface-700 text-text-primary`}
        >
           {mode === 'dark' ? <Sun className="w-5 h-5 text-accent-primary" /> : <Moon className="w-5 h-5 text-accent-primary" />}
           {!sidebarCollapsed || mobileOpen ? <span className="font-black text-[10px] uppercase tracking-widest">{mode} Mode</span> : null}
        </button>
        <button 
          onClick={async () => {
             await supabase.auth.signOut()
             window.location.href = '/login'
          }}
          className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all group relative"
        >
          <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
          {!sidebarCollapsed && <span className="font-black text-[10px] uppercase tracking-[0.2em]">Sair</span>}
        </button>
      </div>
    </aside>
  )
}
