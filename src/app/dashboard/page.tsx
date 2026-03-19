'use client'

import { useApp } from '@/contexts/AppContext'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Users, DollarSign, Zap, TrendingUp,
  Calendar, Bell, Search,
  ChevronRight, ArrowRight, Clock, Shield,
  QrCode, LayoutDashboard
} from 'lucide-react'

export default function PremiumDashboard() {
  const { lang } = useApp()
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

  // Filter stats based on role: Instructors don't see financial data
  const allStats = [
    { label: 'Alunos Ativos', value: '185', icon: Users, trend: '+8%', roles: ['manager', 'master', 'instructor'] },
    { label: 'Novos Leads', value: '12', icon: Zap, trend: '+3 hoje', roles: ['manager', 'master'] },
    { label: 'Frequência', value: '82%', icon: TrendingUp, trend: '+2%', roles: ['manager', 'master', 'instructor'] },
    { label: 'Mensalidades', value: '94%', icon: DollarSign, trend: 'Em dia', roles: ['manager', 'master'] },
  ]

  const stats = allStats.filter(s => s.roles.includes(userRole))

  return (
    <div className="min-h-screen bg-surface-900 pb-20 relative overflow-hidden stippled">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-primary/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      {/* Header Area */}
      <div className="px-12 py-12 flex items-center justify-between relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
             <p className="text-[10px] font-black text-accent-primary uppercase tracking-[0.3em]">Sistema de Elite • Online</p>
          </div>
          <h1 className="text-5xl font-display font-black text-text-primary tracking-tighter italic">
            Olá, <span className="text-accent-primary">{userName.split(' ')[0]}</span>
          </h1>
          <p className="text-text-muted mt-2 font-bold uppercase tracking-widest text-[10px] opacity-60">
            {userRole === 'instructor' ? 'Monitoramento Técnico • Visão Restrita' : 'Comando Central • Gestão de Performance'}
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex -space-x-3">
             {[1,2,3].map(i => (
               <div key={i} className="w-10 h-10 rounded-full border-2 border-surface-900 bg-surface-700 overflow-hidden shadow-xl">
                  <img src={`https://i.pravatar.cc/100?u=gfteam${i}`} alt="user" className="w-full h-full object-cover" />
               </div>
             ))}
             <div className="w-10 h-10 rounded-full border-2 border-surface-900 bg-accent-primary flex items-center justify-center text-[10px] font-black text-surface-900 shadow-xl">
                +12
             </div>
          </div>
          <div className="h-10 w-[1px] bg-white/10" />
          <div className="flex items-center gap-4">
            <button className="w-12 h-12 rounded-2xl bg-surface-800 border border-white/5 flex items-center justify-center hover:border-accent-primary/50 transition-all group">
              <Search className="w-5 h-5 text-text-muted group-hover:text-accent-primary transition-colors" />
            </button>
            <button className="w-12 h-12 rounded-2xl bg-surface-800 border border-white/5 flex items-center justify-center hover:border-accent-primary/50 transition-all group relative">
              <Bell className="w-5 h-5 text-text-muted group-hover:text-accent-primary transition-colors" />
              <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-accent-primary accent-shadow" />
            </button>
            <button 
              onClick={() => { window.location.href = '/login' }} 
              className="px-6 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all"
            >
              Logoff
            </button>
          </div>
        </div>
      </div>

      <div className="px-12 space-y-12 relative z-10">
        {/* KPI Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-${stats.length} gap-8`}>
          {stats.map((s, i) => (
            <div 
              key={i} 
              className="kpi-card group cursor-pointer active:scale-95 transition-all"
              onClick={() => alert(`Detalhes: ${s.label}`)}
            >
              <div className="card-accent" />
              <div className="flex items-center justify-between mb-10">
                <div className="w-16 h-16 rounded-3xl bg-surface-700 flex items-center justify-center border border-white/5 group-hover:bg-accent-primary/20 transition-all duration-500">
                  <s.icon className="w-8 h-8 text-accent-primary" />
                </div>
                <div className="text-right">
                   <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full uppercase tracking-tighter">{s.trend}</span>
                   <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mt-2">{s.label}</p>
                </div>
              </div>
              <div>
                <p className="text-6xl font-display font-black text-text-primary leading-none tracking-tighter mb-4 italic group-hover:translate-x-2 transition-transform duration-500">{s.value}</p>
                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                   <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Performance Semanal</p>
                   <ArrowRight className="w-4 h-4 text-accent-primary opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Modules */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          
          {/* Main Content (8 cols) */}
          <div className="xl:col-span-8 space-y-12">
            
            {/* Top Area: Check-ins & Social */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               {/* Manual Check-in */}
               <div className="kpi-card !p-12 border-accent-primary/20 bg-accent-primary/5">
                <div className="card-accent" />
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <h2 className="text-3xl font-display font-black text-text-primary tracking-tighter italic">CHECK-INS</h2>
                    <p className="text-[10px] text-text-muted font-black mt-1 uppercase tracking-widest">Alunos no Tatame</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-accent-primary flex items-center justify-center shadow-xl hatched border border-white/10">
                    <Users className="w-6 h-6 text-surface-900" />
                  </div>
                </div>
                
                <div className="space-y-4">
                  {[
                    { id: 1, name: 'Lucas Andrade', belt: 'Azul', time: '17:28', beltColor: 'bg-blue-600', img: 'https://i.pravatar.cc/100?u=lucas' },
                    { id: 2, name: 'Ana Silva', belt: 'Branca', time: '17:30', beltColor: 'bg-white', img: 'https://i.pravatar.cc/100?u=ana' },
                  ].map((req) => (
                    <div key={req.id} className="flex items-center justify-between p-5 rounded-[2rem] bg-surface-800 border border-white/5 group hover:border-accent-primary/40 transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                           <div className="w-14 h-14 rounded-2xl bg-surface-700 border border-white/10 overflow-hidden">
                              <img src={req.img} alt={req.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                           </div>
                           <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-lg ${req.beltColor} border-2 border-surface-800`} />
                        </div>
                        <div>
                           <p className="text-sm font-black text-text-primary tracking-tight">{req.name}</p>
                           <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">{req.belt} • {req.time}</p>
                        </div>
                      </div>
                      <button className="w-12 h-12 rounded-2xl bg-accent-primary text-surface-900 flex items-center justify-center shadow-lg group-hover:scale-110 transition-all hatched">
                        <Zap className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Announcements / Grade */}
              <div className="kpi-card !p-12 border-white/5">
                <div className="card-accent opacity-20" />
                <h3 className="text-2xl font-display font-black text-text-primary mb-8 tracking-tighter italic">AVISOS DO QG</h3>
                <div className="space-y-6">
                  <div className="p-6 rounded-[2rem] bg-surface-800 border border-white/5 relative overflow-hidden group hover:bg-surface-800/80 transition-all">
                    <div className="absolute top-0 right-0 w-24 h-full hatched opacity-5 group-hover:opacity-10 transition-opacity" />
                    <p className="text-xs text-text-primary font-black uppercase tracking-widest mb-1 italic">Exame de Faixa</p>
                    <p className="text-[10px] text-text-muted font-bold">Inscrições abertas • 12/04</p>
                  </div>
                  <div className="p-6 rounded-[2rem] bg-surface-800 border border-white/5 relative overflow-hidden group hover:bg-surface-800/80 transition-all">
                    <div className="absolute top-0 right-0 w-24 h-full hatched opacity-5 group-hover:opacity-10 transition-opacity" />
                    <p className="text-xs text-text-primary font-black uppercase tracking-widest mb-1 italic">Seminário Mestre Julio</p>
                    <p className="text-[10px] text-text-muted font-bold">Confirmar presença no App</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Area: Experimental & Marketing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {/* Agenda Experimental */}
               <div className="md:col-span-2 kpi-card !p-12 border-white/5 bg-surface-800/40">
                <div className="card-accent opacity-30" />
                <div className="flex items-center justify-between mb-10">
                   <div>
                    <h2 className="text-3xl font-display font-black text-text-primary tracking-tighter italic text-accent-primary uppercase">Experimentais</h2>
                    <p className="text-[10px] text-text-muted font-black mt-1 uppercase tracking-widest">Novos Leads • Pipeline</p>
                  </div>
                  <div className="w-14 h-14 rounded-[1.5rem] bg-surface-700 flex items-center justify-center border border-white/5">
                    <Calendar className="w-6 h-6 text-text-muted" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   {[
                     { name: 'Ricardo Santos', date: 'Hoje', time: '19:00', img: 'https://i.pravatar.cc/100?u=richard' },
                     { name: 'Juliana Lima', date: 'Amanhã', time: '18:00', img: 'https://i.pravatar.cc/100?u=juli' },
                   ].map((exp, idx) => (
                     <div key={idx} className="p-6 rounded-[2.5rem] bg-surface-900 border border-white/5 group hover:border-accent-primary transition-all">
                        <div className="flex items-center gap-4 mb-4">
                           <div className="w-12 h-12 rounded-2xl bg-surface-700 overflow-hidden border border-white/10">
                              <img src={exp.img} alt={exp.name} className="w-full h-full object-cover" />
                           </div>
                           <div>
                              <p className="text-sm font-black text-text-primary tracking-tight">{exp.name}</p>
                              <span className="text-[8px] font-black bg-accent-primary/10 text-accent-primary px-2 py-0.5 rounded-md uppercase tracking-[0.2em]">{exp.date}</span>
                           </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                           <div className="flex items-center gap-2 text-[10px] text-text-muted font-bold uppercase tracking-widest">
                              <Clock className="w-3 h-3" />
                              {exp.time}
                           </div>
                           <button className="text-[10px] font-black text-accent-primary uppercase tracking-[0.2em] hover:underline">WhatsApp</button>
                        </div>
                     </div>
                   ))}
                </div>
              </div>

              {/* QR Marketing */}
              <div className="kpi-card !p-10 bg-accent-primary text-surface-900 border-none shadow-[0_30px_60px_rgba(var(--accent-rgb),0.3)] hatched animate-fade-up">
                 <h2 className="text-2xl font-display font-black mb-1 italic tracking-tighter uppercase leading-none">KIT<br/>MARKETING</h2>
                 <p className="text-[10px] font-bold uppercase tracking-widest mb-8 opacity-60">Gere novos alunos</p>
                 
                 <div className="aspect-square bg-white rounded-[2rem] p-4 mb-8 shadow-2xl flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-500 cursor-pointer">
                    <QrCode className="w-full h-full text-surface-900" />
                 </div>

                 <button className="w-full py-5 rounded-2xl bg-surface-900 text-accent-primary text-[10px] font-black uppercase tracking-[0.3em] shadow-xl hover:scale-105 transition-all">
                    Baixar QR 2.0
                 </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Local Schedule (4 cols) */}
          <div className="xl:col-span-4 h-fit">
            <div className="kpi-card !p-12 h-full bg-surface-800/60">
               <div className="card-accent h-[150px]" />
               <div className="flex items-center justify-between mb-12 relative z-10">
                 <h2 className="text-2xl font-display font-black text-text-primary tracking-tighter italic uppercase">Agenda Local</h2>
                 <p className="text-[10px] font-black text-accent-primary uppercase tracking-widest">Março 2026</p>
               </div>
               
               <div className="space-y-8 relative z-10">
                 <div className="p-8 rounded-[3rem] bg-accent-primary/10 border border-accent-primary/20 relative overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer">
                    <div className="absolute top-0 right-0 p-6 opacity-30 group-hover:rotate-12 transition-transform">
                      <Zap className="w-8 h-8 text-accent-primary" />
                    </div>
                    <p className="text-[10px] font-black text-accent-primary uppercase tracking-[0.3em] mb-3">Treino Adulto</p>
                    <h3 className="text-2xl font-display font-black text-text-primary mb-6 leading-tight italic tracking-tighter uppercase">FUNDAMENTOS: <br/>PASSAGEM DE GUARDA</h3>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-surface-900 border border-accent-primary/30 flex items-center justify-center font-black text-[10px] text-accent-primary shadow-xl">
                        F
                      </div>
                      <span className="text-[10px] font-black text-text-primary uppercase tracking-widest">19:00 • Mestre Frazão</span>
                    </div>
                 </div>

                 <div className="p-8 rounded-[3rem] bg-surface-700/50 border border-white/5 relative transition-all hover:translate-x-3 cursor-pointer group">
                    <div className="absolute top-0 right-0 w-32 h-full hatched opacity-5" />
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 group-hover:text-text-primary transition-colors">Treino Kids</p>
                    <h3 className="text-2xl font-display font-black text-text-primary mb-6 leading-tight italic tracking-tighter uppercase">INICIAÇÃO & <br/>COORDENAÇÃO</h3>
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-surface-800 flex items-center justify-center border border-white/10 shadow-xl">
                        <Users className="w-5 h-5 text-text-muted" />
                      </div>
                      <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">18:00 • 1h de treino</span>
                    </div>
                 </div>
               </div>

               <button className="w-full mt-12 py-5 rounded-[2rem] border border-dashed border-white/10 text-[10px] font-black text-text-muted uppercase tracking-[0.3em] hover:border-accent-primary hover:text-accent-primary transition-all">
                  + Nova Aula
               </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
