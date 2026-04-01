'use client'

import { useApp } from '@/contexts/AppContext'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import {
  Users, DollarSign, Zap, TrendingUp,
  Calendar, Bell, Search, Clock,
  ChevronRight, ArrowRight, Shield, QrCode
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
  const [checkins, setCheckins] = useState<any[]>([
    { id: 1, name: 'Lucas Andrade', belt: 'Azul', time: '17:28', beltColor: 'bg-blue-600', img: 'https://i.pravatar.cc/100?u=lucas' },
    { id: 2, name: 'Ana Silva', belt: 'Branca', time: '17:30', beltColor: 'bg-white', img: 'https://i.pravatar.cc/100?u=ana' },
  ])
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
    { label: 'Frequência', value: '82%', icon: TrendingUp, trend: '+2%', color: 'text-blue-400' },
    { label: 'Faturamento', value: '14.2k', icon: DollarSign, trend: '94% em dia', color: 'text-emerald-400' },
  ]

  return (
    <div className="min-h-screen bg-surface-900 text-text-primary pb-20 relative overflow-hidden stippled">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-primary/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      {/* Header Area */}
      <div className="px-6 md:px-12 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
             <p className="text-[10px] font-black text-accent-primary uppercase tracking-[0.3em]">Sistema de Elite • Online</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-text-primary tracking-tighter italic">
            Olá, <span className="text-accent-primary">{userName.split(' ')[0]}</span>
          </h1>
          <p className="text-text-muted mt-2 font-bold uppercase tracking-widest text-[10px] md:opacity-60">
            {userRole === 'instructor' ? 'Monitoramento Técnico • Visão Restrita' : 'Comando Central • Gestão de Performance'}
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4">
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

      <div className="px-6 md:px-12 space-y-12 relative z-10">
        
        {/* KPI Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div 
              key={i} 
              className="kpi-card group cursor-pointer active:scale-95 transition-all !bg-surface-800"
            >
              <div className="card-accent" />
              <div className="flex items-center justify-between mb-8">
                <div className="w-14 h-14 rounded-3xl bg-surface-700 flex items-center justify-center border border-white/5 group-hover:bg-accent-primary/20 transition-all duration-500">
                  <s.icon className="w-6 h-6 text-accent-primary" />
                </div>
                <div className="text-right">
                   <span className={`text-[10px] font-black ${s.color} bg-surface-700 px-3 py-1 rounded-full uppercase tracking-tighter`}>{s.trend}</span>
                   <p className="text-[10px] text-text-muted font-black uppercase tracking-widest mt-2">{s.label}</p>
                </div>
              </div>
              <div>
                <p className="text-5xl md:text-6xl font-display font-black text-text-primary leading-none tracking-tighter mb-4 italic group-hover:translate-x-2 transition-transform duration-500">{s.value}</p>
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
               <div className="kpi-card !p-8 md:!p-12 border-accent-primary/20 bg-surface-800 relative z-10 overflow-hidden">
                <div className="card-accent" />
                <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-accent-primary/5 blur-[80px] rounded-full" />
                <div className="flex items-center justify-between mb-10 relative z-10">
                  <div>
                    <h2 className="text-2xl md:text-3xl font-display font-black text-text-primary tracking-tighter italic">CHECK-INS</h2>
                    <p className="text-[10px] text-text-muted font-black mt-1 uppercase tracking-widest">Alunos no Tatame</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-accent-primary flex items-center justify-center shadow-xl hatched border border-white/10 hidden md:flex">
                    <Users className="w-6 h-6 text-black" />
                  </div>
                </div>
                
                <div className="space-y-4 relative z-10">
                  {checkins.map((req) => (
                    <div key={req.id} className="flex items-center justify-between p-4 md:p-5 rounded-[2rem] bg-surface-900 border border-white/5 group hover:border-accent-primary/40 transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                           <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-surface-700 border border-white/10 overflow-hidden">
                              <img src={req.img} alt={req.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                           </div>
                           <div className={`absolute -bottom-1 -right-1 w-4 h-4 md:w-5 md:h-5 rounded-lg ${req.beltColor} border-2 border-surface-800`} />
                        </div>
                        <div>
                           <p className="text-sm font-black text-text-primary tracking-tight">{req.name}</p>
                           <p className="text-[9px] md:text-[10px] text-text-muted font-bold uppercase tracking-widest">{req.belt} • {req.time}</p>
                        </div>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          alert(`Presença confirmada para ${req.name}`);
                          setCheckins(checkins.filter(c => c.id !== req.id));
                        }}
                        className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 rounded-2xl bg-black border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:border-accent-primary/50 transition-all"
                      >
                        <Zap className="w-4 h-4 md:w-5 md:h-5 text-accent-primary" />
                      </button>
                    </div>
                  ))}
                  {checkins.length === 0 && (
                     <div className="text-center py-6">
                        <p className="text-xs text-text-muted font-black uppercase tracking-widest opacity-40">Nenhum check-in pendente</p>
                     </div>
                  )}
                </div>
              </div>

              {/* Announcements / Grade */}
              <div className="kpi-card !p-8 md:!p-12 border-white/5 bg-surface-800">
                <div className="card-accent opacity-20" />
                <h3 className="text-2xl md:text-3xl font-display font-black text-text-primary mb-8 tracking-tighter italic">AVISOS DO QG</h3>
                <div className="space-y-4 md:space-y-6">
                  {announcements.length > 0 ? announcements.map((news, idx) => (
                    <div key={idx} className="p-5 md:p-6 rounded-[2rem] bg-surface-900 border border-white/5 relative overflow-hidden group hover:bg-surface-800 transition-all">
                      <div className="absolute top-0 right-0 w-24 h-full hatched opacity-5 group-hover:opacity-10 transition-opacity" />
                      <p className="text-xs md:text-sm text-text-primary font-black uppercase tracking-widest mb-1 italic">{news.title}</p>
                      <p className="text-[10px] text-text-muted font-bold">{new Date(news.created_at).toLocaleDateString()} • {news.urgency === 'high' ? 'Importante' : 'Novidade'}</p>
                    </div>
                  )) : (
                    <div className="text-center py-10 opacity-30 italic text-xs uppercase font-black tracking-widest text-text-muted">
                        Nenhum aviso
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bottom Area: Experimental & Marketing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
               {/* Agenda Experimental */}
               <div className="md:col-span-2 kpi-card !p-8 md:!p-12 border-white/5 bg-surface-800">
                <div className="card-accent opacity-30" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 md:mb-10">
                   <div>
                    <h2 className="text-2xl md:text-3xl font-display font-black text-text-primary tracking-tighter italic text-accent-primary uppercase">Experimentais</h2>
                    <p className="text-[10px] text-text-muted font-black mt-1 uppercase tracking-widest">Aulas CRM • Agendados</p>
                  </div>
                  <div className="hidden md:flex w-14 h-14 rounded-[1.5rem] bg-surface-700 items-center justify-center border border-white/5">
                    <Calendar className="w-6 h-6 text-text-muted" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                   {expLeads.length > 0 ? expLeads.map((exp, idx) => (
                     <div key={idx} className="p-5 md:p-6 rounded-[2.5rem] bg-surface-900 border border-white/5 group hover:border-accent-primary transition-all shadow-md">
                        <div className="flex items-center gap-4 mb-4">
                           <div className="w-12 h-12 rounded-2xl bg-surface-700 overflow-hidden border border-white/10 flex items-center justify-center">
                              <Users className="w-6 h-6 text-text-muted opacity-50" />
                           </div>
                           <div>
                              <p className="text-sm font-black text-text-primary tracking-tight uppercase truncate max-w-[120px]">{exp.name}</p>
                              <span className="text-[8px] font-black bg-accent-primary/10 text-accent-primary px-2 py-0.5 rounded-md uppercase tracking-[0.2em]">Agendou Hoje</span>
                           </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-white/5">
                           <div className="flex items-center gap-2 text-[10px] text-text-muted font-bold uppercase tracking-widest">
                              <Target className="w-3 h-3" />
                              {exp.source}
                           </div>
                           <button onClick={() => window.open(`https://wa.me/${exp.phone.replace(/\D/g, '')}`, '_blank')} className="text-[10px] font-black text-accent-primary uppercase tracking-[0.2em] hover:underline">WhatsApp</button>
                        </div>
                     </div>
                   )) : (
                     <div className="col-span-2 text-center py-6 opacity-40">
                        <p className="text-[10px] font-black uppercase text-text-muted">Nenhuma experimental agendada hj</p>
                     </div>
                   )}
                </div>
              </div>

              {/* QR Marketing - Small version as requested */}
              <div className="kpi-card !p-8 md:!p-10 bg-accent-primary text-black border-none shadow-[0_30px_60px_rgba(var(--accent-rgb),0.3)] hatched animate-fade-up flex flex-col justify-center items-center">
                 <h2 className="text-2xl md:text-3xl font-display font-black mb-1 italic tracking-tighter uppercase leading-none text-center text-black">KIT<br/>MARKETING</h2>
                 <p className="text-[9px] font-black uppercase tracking-widest mb-6 opacity-60 text-black text-center">Gere novos alunos</p>
                 
                 <div className="w-32 h-32 md:w-full md:aspect-square bg-white rounded-[2rem] p-4 mb-6 md:mb-8 shadow-2xl flex items-center justify-center rotate-3 hover:rotate-0 transition-transform duration-500 cursor-pointer">
                    <QrCode className="w-full h-full text-black" />
                 </div>

                 <button className="w-full py-4 md:py-5 rounded-2xl bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] shadow-xl hover:scale-105 transition-all text-center">
                    Baixar App
                 </button>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Local Schedule (4 cols) */}
          <div className="xl:col-span-4 h-fit">
            <div className="kpi-card !p-8 md:!p-12 h-full bg-surface-800">
               <div className="card-accent h-[150px]" />
               <div className="flex items-center justify-between mb-8 md:mb-12 relative z-10">
                 <h2 className="text-2xl font-display font-black text-text-primary tracking-tighter italic uppercase">Próximas Aulas</h2>
                 <p className="text-[10px] font-black text-accent-primary uppercase tracking-widest">{new Date().toLocaleDateString('pt-BR', { month: 'short' })}</p>
               </div>
               
               <div className="space-y-6 md:space-y-8 relative z-10">
                 {upcomingClasses.length > 0 ? upcomingClasses.map((cls, idx) => (
                    <div key={idx} className="p-6 md:p-8 rounded-[3rem] bg-surface-900 border border-white/5 relative overflow-hidden group transition-all hover:border-accent-primary/40 cursor-pointer shadow-md">
                       <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:rotate-12 transition-transform">
                         <Zap className="w-8 h-8 text-white" />
                       </div>
                       <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-3 group-hover:text-accent-primary transition-colors">{cls.class_type}</p>
                       <h3 className="text-xl md:text-2xl font-display font-black text-text-primary mb-6 leading-tight italic tracking-tighter uppercase">{cls.class_name}</h3>
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-full bg-surface-800 flex items-center justify-center border border-white/10 shadow-xl">
                           <Clock className="w-4 h-4 text-text-muted" />
                         </div>
                         <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">{cls.time_start} • {cls.instructor_name}</span>
                       </div>
                    </div>
                 )) : (
                    <div className="p-10 text-center opacity-30 text-text-muted">
                        <p className="font-black text-xs uppercase italic tracking-widest">Nenhuma aula<br/>Hoje</p>
                    </div>
                 )}
               </div>

               <button 
                 onClick={() => window.location.href='/dashboard/cronograma'}
                 className="w-full mt-10 md:mt-12 py-5 rounded-[2rem] border border-dashed border-white/10 text-[10px] font-black text-text-muted uppercase tracking-[0.3em] hover:border-accent-primary hover:text-accent-primary transition-all text-center flex items-center justify-center gap-2"
               >
                  Ver Cronograma
               </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
