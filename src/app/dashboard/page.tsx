'use client'

import { useApp } from '@/contexts/AppContext'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Users, DollarSign, Zap, TrendingUp,
  Calendar, Bell, Search,
  ChevronRight, ArrowRight, Clock, Shield,
  QrCode, LayoutDashboard, Rocket, Activity,
  LogOut, Settings, BarChart3, Target, Share,
  GraduationCap, ClipboardList, Info
} from 'lucide-react'

export default function CompletePerformanceDashboard() {
  const { lang, mode } = useApp()
  const [userName, setUserName] = useState<string>('Mestre')
  const [userRole, setUserRole] = useState<string>('manager')
  const [tenantId, setTenantId] = useState<string | null>(null)
  
  // Real-time Data States
  const [expLeads, setExpLeads] = useState<any[]>([])
  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function getData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('full_name, role, tenant_id').eq('id', user.id).single()
        if (profile) {
          setUserName(profile.full_name || 'Mestre')
          setUserRole(profile.role)
          setTenantId(profile.tenant_id)
          
          // Fetch Real Data
          const [leadsRes, classesRes, newsRes] = await Promise.all([
            supabase.from('leads').select('*').eq('tenant_id', profile.tenant_id).eq('status', 'agendado').order('created_at', { ascending: false }).limit(3),
            supabase.from('schedules').select('*').eq('tenant_id', profile.tenant_id).limit(3),
            supabase.from('notifications').select('*').limit(2).order('created_at', { ascending: false })
          ])

          if (leadsRes.data) setExpLeads(leadsRes.data)
          if (classesRes.data) setUpcomingClasses(classesRes.data)
          if (newsRes.data) setAnnouncements(newsRes.data)
        }
      }
      setLoading(false)
    }
    getData()
  }, [])

  const stats = [
    { label: 'Alunos Ativos', value: '185', icon: Users, trend: '+8%', color: 'text-emerald-400' },
    { label: 'Novos Leads', value: '12', icon: Zap, trend: '+3 hoje', color: 'text-amber-400' },
    { label: 'Frequência', value: '82%', icon: BarChart3, trend: '+2%', color: 'text-blue-400' },
    { label: 'Faturamento', value: 'R$ 14.2k', icon: DollarSign, trend: '94% em dia', color: 'text-emerald-400' },
  ]

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-white pb-20 relative overflow-hidden stippled">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-primary/5 blur-[180px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2" />
      
      {/* Header Section */}
      <div className="px-10 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div>
           <div className="flex items-center gap-3 mb-3">
              <div className="px-3 py-1 bg-accent-primary/10 border border-accent-primary/20 rounded-full flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
                 <span className="text-[10px] font-black text-accent-primary uppercase tracking-[0.2em]">Sistema Gfteam v1.3.1 • Live Syncing</span>
              </div>
           </div>
           <h1 className="text-5xl font-display font-black tracking-tighter italic uppercase text-white">
             Olá, <span className="text-accent-primary underline decoration-accent-primary/20">{userName.split(' ')[0]}</span>
           </h1>
           <p className="text-[#A1A1AA] mt-2 font-bold uppercase tracking-widest text-[10px]">
             {userRole === 'master' ? 'Visão Consolidada • Painel Administrativo' : 'Comando Central • Gestão de Performance'}
           </p>
        </div>
        
        <div className="flex items-center gap-6 bg-surface-800/40 p-3 rounded-[2rem] border border-white/5 backdrop-blur-xl">
           <div className="flex items-center gap-3 px-4">
              <button className="w-10 h-10 rounded-xl bg-surface-700/50 flex items-center justify-center text-text-muted hover:text-accent-primary transition-all">
                 <Bell className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 rounded-xl bg-surface-700/50 flex items-center justify-center text-text-muted hover:text-accent-primary transition-all">
                 <Search className="w-5 h-5" />
              </button>
           </div>
           <div className="w-px h-8 bg-white/10" />
           <button 
             onClick={() => window.location.href='/login'}
             className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-red-500/10"
           >
             Sair
           </button>
        </div>
      </div>

      <div className="px-10 space-y-12 relative z-10">
        
        {/* KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="kpi-card !p-8 group bg-[#121214] border-white/5 hover:border-accent-primary/40 transition-all">
              <div className="flex items-center justify-between mb-8">
                 <div className="w-14 h-14 rounded-2xl bg-surface-700/40 flex items-center justify-center group-hover:bg-accent-primary/20 transition-colors">
                    <s.icon className="w-7 h-7 text-accent-primary" />
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-white uppercase tracking-widest opacity-80">{s.label}</p>
                    <span className={`text-[10px] font-black ${s.color} uppercase tracking-tighter`}>{s.trend}</span>
                 </div>
              </div>
              <p className="text-5xl font-display font-black text-white italic tracking-tighter leading-none">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           
           {/* Column 1: Tatame & QG (8 cols) */}
           <div className="lg:col-span-8 space-y-10">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                 
                 {/* Avisos QG - Real Data from Support/Matriz */}
                 <div className="kpi-card !p-10 border-white/10 bg-[#121214]">
                    <div className="flex items-center justify-between mb-10">
                       <h2 className="text-2xl font-display font-black text-white tracking-tighter italic uppercase">AVISOS QG</h2>
                       <Info className="w-5 h-5 text-accent-primary" />
                    </div>
                    <div className="space-y-6">
                       {announcements.length > 0 ? announcements.map((news, idx) => (
                         <div key={idx} className="p-6 rounded-3xl bg-surface-900/40 border border-white/5 flex flex-col gap-2">
                            <div className="flex justify-between items-start">
                               <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${news.urgency === 'high' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}>
                                  {news.urgency === 'high' ? 'Importante' : 'Novidade'}
                               </span>
                               <span className="text-[10px] text-[#A1A1AA] font-black">{new Date(news.created_at).toLocaleDateString()}</span>
                            </div>
                            <p className="text-sm font-bold text-white uppercase">{news.title}</p>
                         </div>
                       )) : (
                         <div className="text-center py-10 opacity-30 italic text-xs uppercase font-black tracking-widest">
                            Nenhum aviso no momento
                         </div>
                       )}
                    </div>
                 </div>

                 {/* Próximas Aulas - Real Data from Schedules */}
                 <div className="kpi-card !p-10 border-white/10 bg-[#121214]">
                    <div className="flex items-center justify-between mb-10">
                       <h2 className="text-2xl font-display font-black text-white tracking-tighter italic uppercase">PRÓXIMAS AULAS</h2>
                       <GraduationCap className="w-5 h-5 text-accent-primary" />
                    </div>
                    <div className="space-y-6">
                       {upcomingClasses.length > 0 ? upcomingClasses.map((clItem, idx) => (
                         <div key={idx} className="p-6 rounded-3xl bg-surface-900/40 border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <div className={`w-1 h-8 rounded-full ${clItem.class_type === 'No-Gi' ? 'bg-accent-primary' : 'bg-emerald-500'}`} />
                               <div>
                                  <p className="text-sm font-bold text-white uppercase">{clItem.class_name}</p>
                                  <p className="text-[10px] text-[#A1A1AA] font-black uppercase">{clItem.time_start} • {clItem.instructor_name}</p>
                               </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-white/20" />
                         </div>
                       )) : (
                         <div className="text-center py-10 opacity-30 italic text-xs uppercase font-black tracking-widest">
                            Nenhuma aula agendada hj
                         </div>
                       )}
                    </div>
                    <button 
                      onClick={() => window.location.href='/dashboard/cronograma'}
                      className="w-full mt-10 py-5 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/10 font-black"
                    >
                       Ajustar Cronograma
                    </button>
                 </div>

              </div>

              {/* Aulas Experimentais - BACK FROM THE CRM (STATUS 'AGENDADO') */}
              <div className="kpi-card !p-10 border-accent-primary/20 bg-[#121214]">
                 <div className="flex items-center justify-between mb-10">
                    <div>
                       <h2 className="text-3xl font-display font-black text-white tracking-tighter italic uppercase underline decoration-accent-primary/30">Agendamentos CRM</h2>
                       <p className="text-[10px] text-[#A1A1AA] font-black uppercase tracking-widest mt-1">Aulas Experimentais vindas da Landing Page/Wpp</p>
                    </div>
                    {expLeads.length > 0 && (
                      <div className="px-4 py-2 rounded-full bg-accent-primary/10 border border-accent-primary/30 text-accent-primary text-[9px] font-black uppercase tracking-widest animate-pulse">
                        {expLeads.length} Agendado(s)
                      </div>
                    )}
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {expLeads.length > 0 ? expLeads.map((lead) => (
                      <div key={lead.id} className="p-8 rounded-[2.5rem] bg-[#0A0A0C] border border-white/5 relative overflow-hidden group hover:scale-[1.03] hover:border-accent-primary/50 transition-all shadow-xl">
                         {/* High contrast text for the user */}
                         <p className="text-lg font-black text-white tracking-tight uppercase mb-1">{lead.name}</p>
                         <div className="flex flex-col gap-2">
                           <div className="flex items-center gap-2 text-[10px] text-accent-primary font-black uppercase tracking-widest">
                               <Clock className="w-3.5 h-3.5" /> Agendado em: {new Date(lead.created_at).toLocaleDateString()}
                           </div>
                           <div className="flex items-center gap-2 text-[9px] text-[#A1A1AA] font-black uppercase tracking-widest opacity-60">
                               <Target className="w-3.5 h-3.5" /> Origem: {lead.source}
                           </div>
                         </div>
                         <div className="flex items-center gap-3 mt-8">
                            <button className="flex-1 py-4 bg-accent-primary hover:bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-95">
                               Confirmar Presença
                            </button>
                            <button 
                              onClick={() => window.open(`https://wa.me/${lead.phone.replace(/\D/g, '')}`, '_blank')}
                              className="w-14 h-14 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-black flex items-center justify-center rounded-xl border border-emerald-500/20 transition-all font-black text-xs"
                            >
                               WPP
                            </button>
                         </div>
                      </div>
                    )) : (
                      <div className="col-span-2 p-16 rounded-[3rem] bg-surface-900/50 border border-dashed border-white/10 text-center flex flex-col items-center gap-4">
                         <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                            <Users className="w-8 h-8 text-text-muted opacity-20" />
                         </div>
                         <div>
                            <p className="text-sm font-black text-text-muted uppercase tracking-widest italic opacity-40">Nenhuma experimental agendada hj</p>
                            <p className="text-[10px] text-text-muted font-bold uppercase tracking-tighter mt-2">DICA: Envie o link do Kit Marketing para novos leads!</p>
                         </div>
                      </div>
                    )}
                 </div>
              </div>

           </div>

           {/* Column 2: Growth & Marketing (4 cols) */}
           <div className="lg:col-span-4 h-full">
              
              <div className="kpi-card h-full !p-10 !rounded-[4rem] bg-accent-primary !border-none shadow-[0_40px_80px_rgba(var(--accent-rgb),0.3)] flex flex-col justify-between overflow-hidden relative min-h-[600px]">
                 <div className="absolute inset-0 bg-accent-primary z-0" />
                 
                 <div className="relative z-10">
                    <div className="flex items-center justify-between mb-8">
                       <h2 className="text-4xl font-display font-black text-black italic tracking-tighter uppercase leading-none">KIT<br/>MARKETING</h2>
                       <div className="w-16 h-16 rounded-[2rem] bg-black flex items-center justify-center shadow-2xl">
                          <Rocket className="w-8 h-8 text-accent-primary" />
                       </div>
                    </div>
                    <p className="text-[11px] font-black text-black/90 uppercase tracking-widest mb-12">Capture novos alunos instantaneamente</p>
                    
                    <div className="relative group mx-auto mb-12 flex justify-center">
                       <div className="relative w-48 h-48 bg-white rounded-[3rem] p-6 flex items-center justify-center transform group-hover:rotate-6 transition-all duration-500 shadow-2xl">
                          <QrCode className="w-full h-full text-black" />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4 relative z-10">
                    {/* BUTTONS WITH 100% CONTRAST (BLACK ON SOLID YELLOW/BACKGROUND) */}
                    <button className="w-full py-6 rounded-2xl bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] transition-all font-black">
                       Baixar Material
                    </button>
                    <button className="w-full py-6 rounded-2xl bg-black/10 hover:bg-black/20 text-black text-[10px] font-black uppercase tracking-[0.3em] transition-all border border-black/10 flex items-center justify-center gap-3 font-black">
                       <Share className="w-4 h-4" /> Link de Convite
                    </button>
                 </div>
              </div>

           </div>

        </div>

      </div>
    </div>
  )
}
