'use client'

import { useApp } from '@/contexts/AppContext'
import TopBar from '@/components/TopBar'
import { Calendar, Clock, MapPin, Users, Plus, ChevronLeft, ChevronRight, Zap } from 'lucide-react'

const schedule = [
  { day: 'Segunda-feira', classes: [
    { time: '06:30 - 08:00', name: 'Jiu-Jitsu Adulto', prof: 'Prof. Julio', type: 'Gi', mat: 'Principal' },
    { time: '09:00 - 10:30', name: 'Jiu-Jitsu No-Gi', prof: 'Prof. Marcus', type: 'No-Gi', mat: 'B' },
    { time: '17:00 - 18:00', name: 'Jiu-Jitsu Kids', prof: 'Profa. Ana', type: 'Gi', mat: 'Principal' },
    { time: '19:00 - 20:30', name: 'Jiu-Jitsu Avançado', prof: 'Prof. Julio', type: 'Gi', mat: 'Principal' },
  ]},
  { day: 'Terça-feira', classes: [
    { time: '07:00 - 08:30', name: 'Fundamentos', prof: 'Prof. Rafael', type: 'Gi', mat: 'Principal' },
    { time: '12:00 - 13:30', name: 'Treino Meio-Dia', prof: 'Prof. Carlos', type: 'Gi', mat: 'Principal' },
    { time: '18:00 - 19:30', name: 'Jiu-Jitsu Feminino', prof: 'Profa. Ana', type: 'Gi', mat: 'B' },
    { time: '19:30 - 21:00', name: 'Jiu-Jitsu Iniciante', prof: 'Prof. Rafael', type: 'Gi', mat: 'Principal' },
  ]},
  // ... more days can be added
]

export default function CronogramaPage() {
  const { lang } = useApp()

  return (
    <div className="min-h-screen bg-surface-900">
      <TopBar title={lang === 'pt' ? 'Cronograma de Aulas' : 'Class Schedule'} />
      <div className="p-6 space-y-6">
        {/* Calendar Strip */}
        <div className="kpi-card flex items-center justify-between py-4">
          <button className="p-2 rounded-xl bg-surface-600 hover:bg-surface-500 transition-all">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-4 overflow-x-auto no-scrollbar py-2">
            {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, i) => (
              <div key={i} className={`flex flex-col items-center gap-1 min-w-[60px] p-2 rounded-xl transition-all cursor-pointer ${i === 0 ? 'accent-bg text-surface-900' : 'bg-surface-600'}`}>
                <span className="text-[10px] font-bold uppercase">{day}</span>
                <span className="text-sm font-bold">{16 + i}</span>
              </div>
            ))}
          </div>
          <button className="p-2 rounded-xl bg-surface-600 hover:bg-surface-500 transition-all">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Schedule grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {schedule.slice(0, 2).map((day, i) => (
            <div key={i} className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-5 h-5" style={{ color: 'var(--accent)' }} />
                <h2 className="font-display font-bold text-text-primary">{day.day}</h2>
              </div>
              <button className="flex items-center gap-2 group mb-4 px-4 py-2 rounded-xl bg-accent-primary/5 border border-accent-primary/10 hover:border-accent-primary/50 transition-all">
                <Zap className="w-3.5 h-3.5 text-accent-primary" />
                <span className="text-[10px] font-black uppercase text-text-muted group-hover:text-text-primary tracking-widest transition-colors">Repetir na próxima semana</span>
              </button>
              <div className="space-y-3">
                {day.classes.map((cls, j) => (
                  <div key={j} className="kpi-card group hover:border-surface-400 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-text-primary">{cls.name}</p>
                        <p className="text-xs text-text-muted mt-0.5">{cls.prof}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${cls.type === 'Gi' ? 'accent-bg text-surface-900' : 'bg-surface-500 text-text-primary'}`}>
                        {cls.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] text-text-muted">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> {cls.time}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" /> Tatame {cls.mat}
                      </div>
                    </div>
                  </div>
                ))}
                <button className="w-full py-3 rounded-2xl border-2 border-dashed border-surface-500 text-text-muted hover:text-text-primary hover:border-surface-400 transition-all flex items-center justify-center gap-2 text-sm font-semibold">
                  <Plus className="w-4 h-4" /> {lang === 'pt' ? 'Adicionar Aula' : 'Add Class'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
