'use client'

import { useApp } from '@/contexts/AppContext'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Users, DollarSign, Zap, TrendingUp,
  Calendar, Bell, Search,
  ChevronRight, ArrowRight, Clock, Shield,
  QrCode, LayoutDashboard, Share2, Rocket
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
          <p className="text-text-secondary mt-2 font-black uppercase tracking-widest text-[10px]">
            {userRole === 'instructor' ? 'Monitoramento Técnico • Visão Restrita' : 'Comando Central • Gestão de Performance'}
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <button 
            className="btn-primary !rounded-2xl px-8 shadow-2xl flex items-center gap-3"
            onClick={() => alert('Abrir Kit de Marketing')}
          >
            <Rocket className="w-5 h-5 text-black" />
            <span className="font-black">GERAR MAIS ALUNOS</span>
          </button>
        </div>
      </div>

      <div className="px-12 space-y-12 relative z-10">
        
        {/* GROWTH SECTION (Kit Marketing & Leads) - AT THE FRONT (TOP) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
           <div className="xl:col-span-4 h-full">
              {/* QR Marketing Card - HIGH VISIBILITY */}
              <div className="kpi-card h-full !p-10 bg-accent-primary text-black border-none shadow-[0_30px_60px_rgba(var(--accent-rgb),0.3)] hatched animate-fade-up">
                 <div className="flex items-center justify-between mb-6">
                    <h2 className="text-3xl font-display font-black italic tracking-tighter uppercase leading-none">KIT<br/>MARKETING</h2>
                    <Zap className="w-8 h-8 text-black opacity-20" />
                 </div>
                 <p className="text-[11px] font-black uppercase tracking-widest mb-10 text-black/70 italic">Gerador automático de novos alunos</p>
                 
                 <div className="aspect-square bg-white rounded-[2.5rem] p-6 mb-10 shadow-2xl flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-500 cursor-pointer">
                    <QrCode className="w-full h-full text-black" />
                 </div>

                 <div className="space-y-4">
                    <button className="w-full py-5 rounded-2xl bg-black text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-xl hover:scale-105 transition-all text-center">
                       Baixar QR 2.0
                    </button>
                    <button className="w-full py-5 rounded-2xl bg-white/20 text-black text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white/40 transition-all text-center border border-black/10">
                       Compartilhar Link
                    </button>
                 </div>
              </div>
           </div>

           <div className="xl:col-span-8">
              {/* Agenda Experimental / Leads Pipeline */}
              <div className="kpi-card !p-10 border-accent-primary/20 bg-surface-800 shadow-2xl h-full">
                <div className="card-accent" />
                <div className="flex items-center justify-between mb-10">
                   <div>
                    <h2 className="text-3xl font-display font-black text-text-primary tracking-tighter italic uppercase">Experimentais Hoje</h2>
                    <p className="text-[10px] text-text-secondary font-black mt-1 uppercase tracking-widest">Leads em fase de fechamento</p>
                  </div>
                  <div className="w-16 h-16 rounded-[1.5rem] bg-accent-primary/10 flex items-center justify-center border border-accent-primary/20 transition-all group-hover:bg-accent-primary group-hover:text-black">
                    <Calendar className="w-8 h-8 text-accent-primary" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {[
                     { name: 'Ricardo Santos', date: 'Tatame A', time: '19:00', img: 'https://i.pravatar.cc/100?u=richard', phone: '21 99999-9999' },
                     { name: 'Juliana Lima', date: 'Tatame B', time: '18:00', img: 'https://i.pravatar.cc/100?u=juli', phone: '21 98888-8888' },
                     { name: 'Carlos Neto', date: 'Kids Area', time: '17:30', img: 'https://i.pravatar.cc/100?u=car', phone: '21 97777-7777' },
                     { name: 'Beatriz Cruz', date: 'Iniciantes', time: '20:15', img: 'https://i.pravatar.cc/100?u=bea', phone: '21 96666-6666' },
                   ].map((exp, idx) => (
                     <div key={idx} className="p-6 rounded-[2.5rem] bg-surface-900 border border-white/10 group hover:border-accent-primary transition-all flex flex-col justify-between">
                        <div className="flex items-center gap-4 mb-6">
                           <div className="w-14 h-14 rounded-2xl bg-surface-700 overflow-hidden border border-white/10 ring-4 ring-white/5 shadow-xl">
                              <img src={exp.img} alt={exp.name} className="w-full h-full object-cover" />
                           </div>
                           <div>
                              <p className="text-base font-black text-text-primary tracking-tight">{exp.name}</p>
                              <span className="text-[9px] font-black bg-accent-primary text-black px-2 py-0.5 rounded-md uppercase tracking-[0.2em]">{exp.date}</span>
                           </div>
                        </div>
                        <div className="flex items-center justify-between pt-6 border-t border-white/10">
                           <div className="flex items-center gap-2 text-[11px] text-text-primary font-black uppercase tracking-widest">
                              <Clock className="w-4 h-4 text-accent-primary" />
                              {exp.time}
                           </div>
                           <button className="px-5 py-2.5 rounded-xl bg-emerald-500 text-black text-[9px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-lg shadow-emerald-500/20">
                             WhatsApp
                           </button>
                        </div>
                     </div>
                   ))}
                </div>
              </div>
           </div>
        </div>

        {/* KPI Grid - Middle Area */}
        <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-${stats.length} gap-8`}>
          {stats.map((s, i) => (
            <div key={i} className="kpi-card group cursor-pointer active:scale-95 transition-all bg-surface-800 border-white/5">
              <div className="card-accent" />
              <div className="flex items-center justify-between mb-10">
                <div className="w-16 h-16 rounded-3xl bg-surface-700 flex items-center justify-center border border-white/5 group-hover:bg-accent-primary/20 transition-all duration-500">
                  <s.icon className="w-8 h-8 text-accent-primary" />
                </div>
                <div className="text-right">
                   <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full uppercase tracking-tighter">{s.trend}</span>
                   <p className="text-[10px] text-text-secondary font-black uppercase tracking-widest mt-2">{s.label}</p>
                </div>
              </div>
              <p className="text-6xl font-display font-black text-text-primary leading-none tracking-tighter mb-4 italic group-hover:translate-x-2 transition-transform duration-500">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Content Modules (Check-ins & Local Schedule) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 text-contrast-fix">
          
          <div className="xl:col-span-8 kpi-card !p-12 border-white/10 bg-surface-800">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-display font-black text-text-primary tracking-tighter italic uppercase">CHECK-INS NO DIA</h2>
                <p className="text-[10px] text-text-secondary font-black mt-1 uppercase tracking-widest">Atendimento Presencial</p>
              </div>
              <Users className="w-10 h-10 text-accent-primary" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { id: 1, name: 'Lucas Andrade', belt: 'Azul', time: '17:28', beltColor: 'bg-blue-600', img: 'https://i.pravatar.cc/100?u=lucas' },
                { id: 2, name: 'Ana Silva', belt: 'Branca', time: '17:30', beltColor: 'bg-white', img: 'https://i.pravatar.cc/100?u=ana' },
                { id: 3, name: 'Marcos Braz', belt: 'Roxa', time: '18:15', beltColor: 'bg-purple-600', img: 'https://i.pravatar.cc/100?u=marcos' },
                { id: 4, name: 'Tati Mello', belt: 'Marrom', time: '18:45', beltColor: 'bg-amber-900', img: 'https://i.pravatar.cc/100?u=tati' },
              ].map((req) => (
                <div key={req.id} className="flex items-center justify-between p-6 rounded-[2.5rem] bg-surface-900 border border-white/10 group hover:border-accent-primary transition-all">
                  <div className="flex items-center gap-5">
                    <div className="relative">
                       <div className="w-16 h-16 rounded-2xl bg-surface-700 border border-white/10 overflow-hidden shadow-xl ring-4 ring-white/5">
                          <img src={req.img} alt={req.name} className="w-full h-full object-cover transition-all" />
                       </div>
                       <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-lg ${req.beltColor} border-2 border-surface-800 shadow-lg`} />
                    </div>
                    <div>
                       <p className="text-base font-black text-text-primary tracking-tight">{req.name}</p>
                       <p className="text-[10px] text-text-secondary font-black uppercase tracking-widest">{req.belt} • {req.time}</p>
                    </div>
                  </div>
                  <button className="w-12 h-12 flex-shrink-0 rounded-2xl bg-accent-primary text-black flex items-center justify-center shadow-xl group-hover:rotate-12 transition-all">
                    <Zap className="w-6 h-6" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="xl:col-span-4 h-fit">
            <div className="kpi-card !p-12 h-full bg-surface-800">
               <h2 className="text-2xl font-display font-black text-text-primary tracking-tighter italic uppercase mb-10">AVISOS DO QG</h2>
               <div className="space-y-6">
                  {[
                    { title: 'Exame de Faixa', info: 'Inscrições abertas • 12/04', color: 'accent-primary' },
                    { title: 'Seminário Master', info: 'Mestre Julio • No Tatame', color: 'emerald-400' },
                  ].map((ad, idx) => (
                    <div key={idx} className="p-8 rounded-[3rem] bg-surface-900 border border-white/10 group hover:translate-x-2 transition-all cursor-pointer">
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-2 h-2 rounded-full bg-${ad.color} animate-pulse`} />
                        <p className="text-xs text-text-primary font-black uppercase tracking-[0.2em] italic">{ad.title}</p>
                      </div>
                      <p className="text-[10px] text-text-secondary font-black uppercase tracking-widest">{ad.info}</p>
                    </div>
                  ))}
               </div>
               
               <button className="w-full mt-10 py-5 rounded-[2rem] bg-accent-primary/10 border border-accent-primary/20 text-[10px] font-black text-accent-primary uppercase tracking-[0.3em] hover:bg-accent-primary hover:text-black transition-all">
                  Nova Central de Avisos
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
