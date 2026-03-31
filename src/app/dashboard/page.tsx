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

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('full_name, role').eq('id', user.id).single()
        if (data?.full_name) setUserName(data.full_name)
        if (data?.role) setUserRole(data.role)
      }
    }
    getProfile()
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
                 <span className="text-[10px] font-black text-accent-primary uppercase tracking-[0.2em]">Sistema Gfteam v1.3.0 • Produção</span>
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
        
        {/* KPIs - 100% Contrast */}
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
                 
                 {/* Avisos QG - Restore Requested */}
                 <div className="kpi-card !p-10 border-white/10 bg-[#121214]">
                    <div className="flex items-center justify-between mb-10">
                       <h2 className="text-2xl font-display font-black text-white tracking-tighter italic uppercase">AVISOS QG</h2>
                       <Info className="w-5 h-5 text-accent-primary" />
                    </div>
                    <div className="space-y-6">
                       {[
                         { title: 'Exame de Faixa', date: 'Dez 15', urgency: 'high' },
                         { title: 'Nova Turma Kids', date: 'Segunda', urgency: 'low' }
                       ].map((news, idx) => (
                         <div key={idx} className="p-6 rounded-3xl bg-surface-900/40 border border-white/5 flex flex-col gap-2">
                            <div className="flex justify-between items-start">
                               <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${news.urgency === 'high' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'}`}>
                                  {news.urgency === 'high' ? 'Importante' : 'Novidade'}
                               </span>
                               <span className="text-[10px] text-[#A1A1AA] font-black">{news.date}</span>
                            </div>
                            <p className="text-sm font-bold text-white uppercase">{news.title}</p>
                         </div>
                       ))}
                    </div>
                    <button className="w-full mt-10 py-5 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/10 font-black">
                       Ver Todos os Avisos
                    </button>
                 </div>

                 {/* Próximas Aulas - Restore Requested */}
                 <div className="kpi-card !p-10 border-white/10 bg-[#121214]">
                    <div className="flex items-center justify-between mb-10">
                       <h2 className="text-2xl font-display font-black text-white tracking-tighter italic uppercase">PRÓXIMAS AULAS</h2>
                       <GraduationCap className="w-5 h-5 text-accent-primary" />
                    </div>
                    <div className="space-y-6">
                       {[
                         { title: 'Iniciação Adulto', time: '18:00', students: '12', color: 'bg-emerald-500' },
                         { title: 'Mestra Frazão', time: '19:30', students: '08', color: 'bg-accent-primary' }
                       ].map((classItem, idx) => (
                         <div key={idx} className="p-6 rounded-3xl bg-surface-900/40 border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                               <div className={`w-1 h-8 rounded-full ${classItem.color}`} />
                               <div>
                                  <p className="text-sm font-bold text-white uppercase">{classItem.title}</p>
                                  <p className="text-[10px] text-[#A1A1AA] font-black uppercase">{classItem.time} • {classItem.students} Check-ins</p>
                               </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-white/20" />
                         </div>
                       ))}
                    </div>
                    <button className="w-full mt-10 py-5 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/10 font-black">
                       Gerenciar Escala
                    </button>
                 </div>

              </div>

              {/* Check-ins Live Grid */}
              <div className="kpi-card !p-10 border-accent-primary/20 bg-[#121214]">
                 <div className="flex items-center justify-between mb-10">
                    <div>
                       <h2 className="text-3xl font-display font-black text-white tracking-tighter italic uppercase">TATAME AGORA</h2>
                       <p className="text-[10px] text-[#A1A1AA] font-black uppercase tracking-widest mt-1">Status de Presença em Tempo Real</p>
                    </div>
                    <button className="flex items-center gap-2 px-8 py-4 bg-accent-primary text-black text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-accent-primary/20 hover:scale-[1.02] transition-all">
                       <Rocket className="w-4 h-4" /> Chamada Rápida
                    </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { id: 1, name: 'Lucas Andrade', belt: 'Azul G3', time: '17:28', beltColor: 'bg-blue-600', img: 'https://i.pravatar.cc/100?u=lucas' },
                      { id: 2, name: 'Ana Silva', belt: 'Branca G2', time: '17:30', beltColor: 'bg-white', img: 'https://i.pravatar.cc/100?u=ana' },
                    ].map((req) => (
                      <div key={req.id} className="p-6 rounded-[2.5rem] bg-[#0A0A0C] border border-white/5 flex items-center justify-between group hover:border-accent-primary/50 transition-all">
                         <div className="flex items-center gap-4">
                            <div className="relative">
                               <div className="w-14 h-14 rounded-2xl bg-surface-700 overflow-hidden border border-white/10 group-hover:border-accent-primary/30 transition-all shadow-xl">
                                  <img src={req.img} alt={req.name} className="w-full h-full object-cover" />
                               </div>
                               <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-lg ${req.beltColor} border-2 border-[#0A0A0C]`} />
                            </div>
                            <div>
                               <p className="text-base font-black text-white tracking-tight uppercase">{req.name}</p>
                               <p className="text-[10px] text-[#A1A1AA] font-black tracking-widest uppercase">{req.belt} • {req.time}</p>
                            </div>
                         </div>
                         <button className="w-12 h-12 rounded-xl bg-surface-800 text-accent-primary flex items-center justify-center hover:bg-accent-primary hover:text-black transition-all border border-white/5 font-black">
                            <Zap className="w-5 h-5 font-black" />
                         </button>
                      </div>
                    ))}
                 </div>
              </div>

           </div>

           {/* Column 2: Growth & Marketing (4 cols) */}
           <div className="lg:col-span-4 h-full">
              
              <div className="kpi-card h-full !p-10 !rounded-[4rem] bg-accent-primary !border-none shadow-[0_40px_80px_rgba(var(--accent-rgb),0.3)] flex flex-col justify-between overflow-hidden relative">
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
