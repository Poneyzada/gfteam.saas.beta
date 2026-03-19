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
    <div className="min-h-screen bg-surface-900 pb-12">
      {/* Header Area */}
      <div className="px-10 py-10 flex items-center justify-between">
        <div>
          <h1 className="text-[2.5rem] font-display font-bold text-text-primary tracking-tight">
            Olá, {userName}
          </h1>
          <p className="text-text-secondary mt-1 font-medium opacity-60">
            {userRole === 'instructor' ? 'Instrutor • Visão Técnica' : 'Gestor • Painel de Controle'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-[1.25rem] bg-surface-700 flex items-center justify-center border border-surface-500 hover:border-accent-primary cursor-pointer transition-all">
            <Search className="w-5 h-5 text-text-primary" />
          </div>
          <div className="w-12 h-12 rounded-[1.25rem] bg-surface-700 flex items-center justify-center border border-surface-500 hover:border-accent-primary cursor-pointer transition-all relative">
            <Bell className="w-5 h-5 text-text-primary" />
            <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-accent-primary" />
          </div>
          <div className="bg-surface-700 border border-surface-500 rounded-[1.25rem] px-5 py-3 flex items-center gap-3">
             <Calendar className="w-5 h-5 accent-text" />
             <span className="text-sm font-bold text-text-primary tracking-tight">Mar 2026</span>
          </div>
          <button 
            onClick={() => { window.location.href = '/login' }} 
            className="bg-red-500/10 border border-red-500/20 text-red-500 rounded-[1.25rem] px-5 py-3 text-sm font-bold hover:bg-red-500/20 transition-all"
          >
            Sair
          </button>
        </div>
      </div>

      <div className="px-10 space-y-10">
        {/* Local Stats Grid */}
        <div className={`grid grid-cols-2 md:grid-cols-${stats.length} gap-6`}>
          {stats.map((s, i) => (
            <div 
              key={i} 
              className="kpi-card p-8 flex flex-col justify-between group cursor-pointer active:scale-95 transition-all overflow-hidden"
              onClick={() => alert(`Abrindo detalhes de ${s.label}...`)}
            >
              <div className="card-accent" />
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-2xl bg-surface-600 flex items-center justify-center">
                  <s.icon className="w-6 h-6 text-text-secondary group-hover:text-accent-primary transition-colors" />
                </div>
                <span className="text-xs font-black text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full">{s.trend}</span>
              </div>
              <div>
                <p className="text-[2.5rem] font-display font-black text-text-primary leading-none tracking-tighter mb-2">{s.value}</p>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-text-muted uppercase tracking-widest">{s.label}</p>
                  <ArrowRight className="w-3 h-3 text-accent-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Content Modules */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          
          {/* Local Schedule (4 cols) */}
          <div className="xl:col-span-4">
            <div className="kpi-card !rounded-[3rem] p-10 h-full relative overflow-hidden">
               <div className="card-accent" />
               <div className="flex items-center justify-between mb-10">
                 <h2 className="text-xl font-display font-bold text-text-primary tracking-tight">Cronograma Local</h2>
                 <p className="text-sm font-semibold text-text-secondary">Hoje</p>
               </div>
               
               <div className="space-y-6">
                 <div className="p-8 rounded-[2rem] bg-accent-primary/5 border border-accent-primary/10 relative overflow-hidden group hover:bg-accent-primary/10 transition-all cursor-pointer">
                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                      <Zap className="w-5 h-5 accent-text" />
                    </div>
                    <p className="text-sm font-bold text-accent-primary uppercase tracking-widest mb-2">Jiu-Jitsu Adulto</p>
                    <h3 className="text-xl font-display font-bold text-text-primary mb-4 leading-tight">Fundamentos: <br/>Passagem de Guarda</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-600 border border-surface-500 flex items-center justify-center font-bold text-[10px] text-text-muted">
                        F
                      </div>
                      <span className="text-xs font-bold text-text-secondary">19:00 - 20:30 (Mestre Frazão)</span>
                    </div>
                 </div>

                 <div className="p-8 rounded-[2rem] bg-surface-600/50 border border-surface-500 relative transition-all hover:translate-x-2 cursor-pointer">
                    <p className="text-sm font-bold text-text-muted uppercase tracking-widest mb-2">Treino Kids</p>
                    <h3 className="text-xl font-display font-bold text-text-primary mb-4">Iniciação & <br/>Coordenação</h3>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-surface-700 flex items-center justify-center">
                        <Users className="w-4 h-4 text-text-muted" />
                      </div>
                      <span className="text-xs font-bold text-text-secondary">18:00 - 19:00</span>
                    </div>
                 </div>
               </div>
            </div>
          </div>

          {/* Right Area (8 cols) */}
          <div className="xl:col-span-8 flex flex-col gap-10">
            {/* Top Row: Check-ins & Social */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               {/* Manual Check-in */}
               <div className="kpi-card !rounded-[3rem] p-10 border-accent-primary/20 bg-accent-primary/5 relative overflow-hidden">
                <div className="card-accent" />
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-display font-black text-text-primary tracking-tight">Check-ins</h2>
                    <p className="text-sm text-text-muted font-medium mt-1">Liberação manual</p>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-accent-primary/20 text-accent-primary text-[10px] font-black uppercase tracking-widest">
                    3 Alunos
                  </div>
                </div>
                
                <div className="space-y-4">
                  {[
                    { id: 1, name: 'Lucas Andrade', belt: 'Azul', time: '17:28', beltColor: 'bg-blue-600' },
                    { id: 2, name: 'Ana Silva', belt: 'Branca', time: '17:30', beltColor: 'bg-white' },
                  ].map((req) => (
                    <div key={req.id} className="flex items-center justify-between p-4 rounded-2xl bg-surface-600 border border-white/5 group hover:border-accent-primary/40 transition-all cursor-pointer">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg ${req.beltColor} flex items-center justify-center font-bold text-[10px]`}>
                          <span className={req.belt === 'Branca' ? 'text-black' : 'text-white'}>{req.name[0]}</span>
                        </div>
                        <div>
                           <p className="text-xs font-bold text-text-primary">{req.name}</p>
                           <p className="text-[8px] text-text-muted font-bold uppercase tracking-widest">{req.belt} • {req.time}</p>
                        </div>
                      </div>
                      <button className="px-3 py-1.5 rounded-lg bg-accent-primary text-surface-900 text-[8px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                        OK
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Info / Social */}
              <div className="kpi-card !rounded-[3rem] p-10 relative overflow-hidden border-white/5 bg-surface-800">
                <div className="card-accent opacity-20" />
                <h3 className="text-xl font-display font-black text-text-primary mb-4">Avisos Grade</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-surface-700/50 border border-white/5">
                    <p className="text-xs text-text-primary font-bold">Exame de Faixa - 12/04</p>
                    <p className="text-[10px] text-text-muted mt-1">Inscrições abertas na secretaria</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-surface-700/50 border border-white/5">
                    <p className="text-xs text-text-primary font-bold">Seminário Mestre Julio</p>
                    <p className="text-[10px] text-text-muted mt-1">Confirmar presença no App</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Experimental & Marketing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
               {/* Agenda Experimental */}
               <div className="md:col-span-2 kpi-card !rounded-[3rem] p-10 relative overflow-hidden border-white/5">
                <div className="card-accent opacity-30" />
                <div className="flex items-center justify-between mb-8">
                   <div>
                    <h2 className="text-2xl font-display font-black text-text-primary tracking-tight">Experimentais</h2>
                    <p className="text-sm text-text-muted font-medium mt-1">Novos Leads</p>
                  </div>
                  <Calendar className="w-5 h-5 text-text-muted" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {[
                     { name: 'Ricardo Santos', date: 'Hoje', time: '19:00' },
                     { name: 'Juliana Lima', date: 'Amanhã', time: '18:00' },
                   ].map((exp, idx) => (
                     <div key={idx} className="p-4 rounded-2xl bg-surface-700/50 border border-white/5">
                        <div className="flex items-center justify-between mb-2">
                           <p className="text-sm font-bold text-text-primary">{exp.name}</p>
                           <span className="text-[8px] font-black bg-accent-primary/10 text-accent-primary px-2 py-0.5 rounded-md uppercase">{exp.date}</span>
                        </div>
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2 text-[10px] text-text-muted font-bold">
                              <Clock className="w-3 h-3" />
                              {exp.time}
                           </div>
                           <button className="text-[10px] font-black text-accent-primary uppercase hover:underline">WhatsApp</button>
                        </div>
                     </div>
                   ))}
                </div>
              </div>

              {/* QR Marketing */}
              <div className="kpi-card !rounded-[3rem] p-8 relative overflow-hidden bg-accent-primary/5 border-accent-primary/20">
                 <div className="card-accent" />
                 <h2 className="text-lg font-display font-black text-text-primary mb-1">QR Marketing</h2>
                 <p className="text-[8px] text-text-muted font-bold uppercase tracking-widest mb-4">Gere novos alunos</p>
                 
                 <div className="aspect-square bg-white rounded-2xl p-3 mb-4 shadow-xl flex items-center justify-center">
                    <QrCode className="w-2/3 h-2/3 text-surface-900" />
                 </div>

                 <button className="w-full py-2.5 rounded-xl bg-accent-primary text-surface-900 text-[10px] font-black uppercase tracking-widest">
                    Baixar Kit
                 </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
