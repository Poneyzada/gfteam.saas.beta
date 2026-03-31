'use client'

import { useApp } from '@/contexts/AppContext'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Users, DollarSign, Zap, TrendingUp,
  Calendar, Bell, Search,
  ChevronRight, ArrowRight, Clock, Shield,
  QrCode, LayoutDashboard, Rocket, Activity,
  LogOut, Settings, BarChart3, Target, Share2
} from 'lucide-react'

export default function PremiumDashboard() {
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
      {/* Background Orbs - Subtle Premium Glow */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent-primary/5 blur-[180px] rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/5 blur-[150px] rounded-full translate-y-1/2 -translate-x-1/2" />
      
      {/* Top Header Section */}
      <div className="px-10 py-10 flex items-center justify-between relative z-10">
        <div>
           <div className="flex items-center gap-3 mb-3">
              <div className="px-3 py-1 bg-accent-primary/10 border border-accent-primary/20 rounded-full flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
                 <span className="text-[10px] font-black text-accent-primary uppercase tracking-[0.2em]">Sistema Gfteam v1.2.6 • Live</span>
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
             Logoff
           </button>
        </div>
      </div>

      <div className="px-10 space-y-12 relative z-10">
        
        {/* KPI Row - Balanced & Readable */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div key={i} className="kpi-card !p-8 group bg-[#121214] border-white/5 hover:border-accent-primary/30 transition-all">
              <div className="flex items-center justify-between mb-8">
                 <div className="w-14 h-14 rounded-2xl bg-surface-700/40 flex items-center justify-center group-hover:bg-accent-primary/10 transition-colors">
                    <s.icon className="w-7 h-7 text-accent-primary" />
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-[#A1A1AA] uppercase tracking-widest">{s.label}</p>
                    <span className={`text-[10px] font-black ${s.color} uppercase tracking-tighter`}>{s.trend}</span>
                 </div>
              </div>
              <p className="text-5xl font-display font-black text-white italic tracking-tighter leading-none">{s.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
           
           {/* Left Column: Management (8 cols) */}
           <div className="xl:col-span-8 space-y-10">
              
              {/* Leitura e Presença - Premium Style */}
              <div className="kpi-card !p-10 border-accent-primary/20 bg-[#121214]">
                 <div className="flex items-center justify-between mb-10">
                    <div>
                       <h2 className="text-3xl font-display font-black text-white tracking-tighter italic uppercase">Check-ins Ativos</h2>
                       <p className="text-[10px] text-[#A1A1AA] font-black uppercase tracking-widest mt-1">Tatame em Tempo Real</p>
                    </div>
                    <button className="flex items-center gap-2 px-6 py-3 bg-accent-primary text-black text-[10px] font-black uppercase tracking-widest rounded-xl shadow-xl shadow-accent-primary/20 hover:scale-105 transition-all">
                       <Rocket className="w-4 h-4" /> Chamada Rápida
                    </button>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { id: 1, name: 'Lucas Andrade', belt: 'Azul', time: '17:28', beltColor: 'bg-blue-600', img: 'https://i.pravatar.cc/100?u=lucas' },
                      { id: 2, name: 'Ana Silva', belt: 'Branca', time: '17:30', beltColor: 'bg-white', img: 'https://i.pravatar.cc/100?u=ana' },
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
                         <button className="w-12 h-12 rounded-xl bg-surface-800 text-accent-primary flex items-center justify-center hover:bg-accent-primary hover:text-black transition-all border border-white/5">
                            <Zap className="w-5 h-5" />
                         </button>
                      </div>
                    ))}
                 </div>
              </div>

              {/* Experimentais Section */}
              <div className="kpi-card !p-10 border-white/5 bg-[#121214]/60">
                 <div className="flex items-center justify-between mb-10">
                    <h2 className="text-3xl font-display font-black text-white tracking-tighter italic uppercase">Aulas Experimentais</h2>
                    <Target className="w-6 h-6 text-[#A1A1AA] opacity-40" />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { name: 'Ricardo Santos', time: '19:00', icon: Calendar },
                      { name: 'Juliana Lima', time: '18:00', icon: Calendar },
                      { name: 'Carlos Neto', time: '17:30', icon: Calendar },
                    ].map((lead, idx) => (
                      <div key={idx} className="p-8 rounded-[2.5rem] bg-[#0A0A0C] border border-white/5 relative overflow-hidden group hover:scale-[1.05] transition-all">
                         <p className="text-sm font-black text-white tracking-tight mb-2 uppercase">{lead.name}</p>
                         <div className="flex items-center gap-2 text-[10px] text-[#A1A1AA] font-black uppercase tracking-widest">
                            <Clock className="w-3 h-3 text-accent-primary" /> {lead.time}
                         </div>
                         <button className="w-full mt-6 py-3 bg-accent-primary/10 hover:bg-accent-primary hover:text-black text-[9px] font-black uppercase tracking-widest rounded-xl transition-all border border-accent-primary/20 text-accent-primary">
                            Ver Lead
                         </button>
                      </div>
                    ))}
                 </div>
              </div>

           </div>

           {/* Right Column: Growth & Marketing (4 cols) */}
           <div className="xl:col-span-4 h-full">
              {/* Marketing Tool - The "Kit" requested "Na Frente" */}
              <div className="kpi-card h-full !p-10 !rounded-[4rem] bg-accent-primary border-none shadow-[0_40px_80px_rgba(var(--accent-rgb),0.3)] hatched animate-fade-up flex flex-col justify-between">
                 <div>
                    <div className="flex items-center justify-between mb-8">
                       <h2 className="text-4xl font-display font-black text-black italic tracking-tighter uppercase leading-none">KIT<br/>MARKETING</h2>
                       <div className="w-16 h-16 rounded-[2rem] bg-black flex items-center justify-center shadow-2xl">
                          <Rocket className="w-8 h-8 text-accent-primary" />
                       </div>
                    </div>
                    <p className="text-[11px] font-black text-black/80 uppercase tracking-widest mb-12">Capture novos alunos instantaneamente</p>
                    
                    <div className="relative group mx-auto mb-12">
                       <div className="absolute inset-0 bg-black/10 blur-xl rounded-full scale-110 group-hover:scale-150 transition-all duration-700" />
                       <div className="relative aspect-square bg-white rounded-[3rem] p-4 flex items-center justify-center transform group-hover:rotate-6 transition-all duration-500 shadow-2xl">
                          <QrCode className="w-full h-full text-black" />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <button className="w-full py-6 rounded-2xl bg-black text-white text-xs font-black uppercase tracking-[0.3em] shadow-2xl hover:scale-[1.02] active:scale-95 transition-all">
                       Baixar Material
                    </button>
                    <button className="w-full py-6 rounded-2xl bg-white/20 hover:bg-white/40 text-black text-xs font-black uppercase tracking-[0.3em] transition-all border border-black/10 flex items-center justify-center gap-3">
                       <Share2 className="w-4 h-4" /> Link de Convite
                    </button>
                 </div>
              </div>
           </div>

        </div>

      </div>
    </div>
  )
}
