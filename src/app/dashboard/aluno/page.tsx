'use client'

import { useState } from 'react'
import { 
  Award, CheckCircle2, BookOpen, ShoppingBag, 
  Calendar, Zap, TrendingUp, Bell, QrCode,
  Play, ChevronRight, User, Shield
} from 'lucide-react'
import { useApp } from '@/contexts/AppContext'

export default function StudentDashboard() {
  const { accent } = useApp()
  const [activeTab, setActiveTab] = useState('home')

  const student = {
    name: 'Henrique Mestre',
    rank: 'Faixa Azul',
    degrees: 3,
    academy: 'GFTeam Matriz',
    attendanceCount: 142,
    nextPromotion: '75%',
  }

  return (
    <div className="min-h-screen bg-surface-900 pb-32">
      {/* Mobile Top Bar */}
      <div className="px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 bg-surface-900/80 backdrop-blur-md z-40 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-accent-primary flex items-center justify-center font-black text-surface-900 border-2 border-surface-900 relative">
            HM
            {/* Dependent Indicator */}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-blue-500 border-2 border-surface-900 flex items-center justify-center">
              <User className="w-2 h-2 text-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-display font-black text-text-primary tracking-tight">{student.name}</h1>
              <span className="text-[8px] font-black px-1.5 py-0.5 bg-accent-primary/20 text-accent-primary rounded-full uppercase tracking-tighter">Pai/Titular</span>
            </div>
            <p className="text-[10px] text-text-muted font-bold flex items-center gap-1">
              Gerenciando: <span className="text-text-primary">GHeorghe (Kids)</span>
              <ChevronRight className="w-3 h-3" />
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-10 h-10 rounded-xl bg-surface-700 border border-white/5 flex items-center justify-center relative">
            <Bell className="w-5 h-5 text-text-secondary" />
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 border-2 border-surface-700" />
          </button>
        </div>
      </div>

      <div className="px-6 mt-8 space-y-8 max-w-lg mx-auto">
        
        {/* Rank Card - Premium Visual */}
        <div className="kpi-card !rounded-[2.5rem] p-8 bg-gradient-to-br from-surface-700 to-surface-800 border-white/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 rounded-full blur-3xl -mr-10 -mt-10" />
          
          <div className="flex items-start justify-between mb-8">
            <div className="flex items-center gap-4">
               <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-500/20 relative">
                  <Shield className="w-8 h-8 text-white" />
                  {/* Degrees */}
                  <div className="absolute -bottom-2 right-0 left-0 flex justify-center gap-1">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-2.5 h-1 bg-white rounded-full" />
                    ))}
                    <div className="w-2.5 h-1 bg-white/30 rounded-full" />
                  </div>
               </div>
               <div>
                  <h3 className="text-xl font-display font-black text-white tracking-tight">{student.rank}</h3>
                  <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">{student.academy}</p>
               </div>
            </div>
            <div className="text-right">
               <p className="text-2xl font-display font-black text-accent-primary">{student.attendanceCount}</p>
               <p className="text-[9px] font-black text-white/40 uppercase tracking-tighter">Treinos Total</p>
            </div>
          </div>

          <div className="space-y-3">
             <div className="flex items-center justify-between">
                <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">Próxima Graduação</p>
                <span className="text-xs font-black text-accent-primary">{student.nextPromotion}</span>
             </div>
             <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-accent-primary transition-all duration-1000" style={{ width: student.nextPromotion }} />
             </div>
          </div>
        </div>

        {/* Action Buttons - 3 Columns to fill space */}
        <div className="grid grid-cols-3 gap-3">
           <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-3xl bg-accent-primary text-surface-900 shadow-xl shadow-accent-primary/20 transition-all active:scale-95">
              <QrCode className="w-6 h-6" />
              <span className="text-[9px] font-black uppercase tracking-widest">Check-in</span>
           </button>
           <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-3xl bg-surface-700 border border-white/5 text-text-primary transition-all active:scale-95">
              <ShoppingBag className="w-6 h-6 text-accent-primary" />
              <span className="text-[9px] font-black uppercase tracking-widest">Loja GF</span>
           </button>
           <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-3xl bg-surface-700 border border-white/5 text-text-primary transition-all active:scale-95">
              <Shield className="w-6 h-6 text-accent-primary" />
              <span className="text-[9px] font-black uppercase tracking-widest">ID Digital</span>
           </button>
        </div>

        {/* Mural da Matriz - New! */}
        <div className="space-y-4">
           <h4 className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em] px-2 flex items-center justify-between">
              <span>Mural da Matriz</span>
              <Bell className="w-3 h-3 text-accent-primary" />
           </h4>
           <div className="kpi-card !rounded-[2rem] p-6 bg-gradient-to-r from-surface-700 to-surface-600 border-accent-primary/10">
              <div className="flex items-center gap-4 mb-3">
                 <div className="w-10 h-10 rounded-full bg-accent-primary/20 flex items-center justify-center font-bold text-accent-primary text-xs">
                    GF
                 </div>
                 <div>
                    <h5 className="text-sm font-bold text-text-primary">Seminário com Mestre Julio</h5>
                    <p className="text-[9px] text-text-muted font-bold uppercase tracking-widest mt-0.5">Sábado, 20 Abr • 10:00</p>
                 </div>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed opacity-80">
                Não percam o seminário especial de graduação. Vagas limitadas no App!
              </p>
           </div>
        </div>

        {/* Treino do Dia (WOD) - Expanded View */}
        <div className="space-y-4">
           <h4 className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em] px-2 flex items-center justify-between">
              <span>Syllabus do Dia</span>
              <span className="text-accent-primary">Semana 12</span>
           </h4>
           <div className="space-y-3">
              {[
                { title: 'Raspagem de Gancho', level: 'Básico', type: 'Técnica 1', time: '20 min' },
                { title: 'Passagem de Meia Profunda', level: 'Avançado', type: 'Técnica 2', time: '25 min' },
                { title: 'Drill: Reposição de Guarda', level: 'Todos', type: 'Aquecimento', time: '15 min' },
              ].map((t, i) => (
                <div key={i} className="group kpi-card !rounded-[1.5rem] p-5 bg-surface-700/50 border-white/5 flex items-center justify-between hover:border-accent-primary/40 transition-all">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-accent-primary flex items-center justify-center shadow-lg shadow-accent-primary/20">
                         <Play className="w-5 h-5 text-surface-900" />
                      </div>
                      <div>
                         <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-[8px] font-black px-1.5 py-0.5 bg-surface-600 text-text-muted rounded uppercase tracking-tighter">
                               {t.level}
                            </span>
                            <span className="text-[8px] font-bold text-accent-primary uppercase tracking-widest italic">{t.type}</span>
                         </div>
                         <h5 className="text-sm font-bold text-text-primary">{t.title}</h5>
                         <p className="text-[9px] text-text-muted font-semibold">{t.time}</p>
                      </div>
                   </div>
                   <button className="w-8 h-8 rounded-full bg-surface-600 flex items-center justify-center text-text-muted group-hover:text-accent-primary transition-colors">
                      <ChevronRight className="w-4 h-4" />
                   </button>
                </div>
              ))}
           </div>
        </div>

        {/* History / Recent Activity */}
        <div className="space-y-4">
           <h4 className="text-[11px] font-black text-text-muted uppercase tracking-[0.2em] px-2">Histórico Recente</h4>
           <div className="space-y-3">
              {[
                { date: 'Hoje', time: '19:30', class: 'Treino Adulto', type: 'Presença' },
                { date: 'Ontem', time: '18:00', class: 'Iniciantes', type: 'Presença' },
                { date: '14 Abr', time: '10:00', class: 'Open Mat', type: 'Presença' },
              ].map((item, i) => (
                <div key={i} className="p-5 rounded-2xl bg-surface-700/50 border border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                         <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                         <p className="text-xs font-bold text-text-primary">{item.class}</p>
                         <p className="text-[9px] text-text-muted font-bold tracking-widest uppercase">{item.date} • {item.time}</p>
                      </div>
                   </div>
                   <ChevronRight className="w-4 h-4 text-text-muted" />
                </div>
              ))}
           </div>
        </div>

      </div>

      {/* Floating Bottom Nav - Mobile Exclusive */}
      <div className="fixed bottom-6 left-6 right-6 h-20 bg-surface-700/90 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl flex items-center justify-around px-8 z-50">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'home' ? 'text-accent-primary scale-110' : 'text-text-muted'}`}
        >
          <Zap className="w-6 h-6" />
        </button>
        <button 
          onClick={() => setActiveTab('trending')}
          className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'trending' ? 'text-accent-primary scale-110' : 'text-text-muted'}`}
        >
          <TrendingUp className="w-6 h-6" />
        </button>
        <div className="w-12 h-12 rounded-full bg-accent-primary flex items-center justify-center shadow-lg shadow-accent-primary/40 -mt-12 border-4 border-surface-900">
           <QrCode className="w-6 h-6 text-surface-900" />
        </div>
        <button 
          onClick={() => setActiveTab('calendar')}
          className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'calendar' ? 'text-accent-primary scale-110' : 'text-text-muted'}`}
        >
          <Calendar className="w-6 h-6" />
        </button>
        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'profile' ? 'text-accent-primary scale-110' : 'text-text-muted'}`}
        >
          <User className="w-6 h-6" />
        </button>
      </div>
    </div>
  )
}
