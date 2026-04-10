'use client'

import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import { 
  Calendar, Clock, MapPin, Users, Plus, 
  ChevronLeft, ChevronRight, Zap, Award,
  Dumbbell, Target, Swords, X, Check
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Class {
  time: string
  name: string
  prof: string
  type: string
  mat: string
  sport?: 'BJJ' | 'Muay Thai' | 'Boxe' | 'Judô'
}

const schedule = [
  { day: 'Segunda-feira', classes: [
    { time: '06:30 - 08:00', name: 'Jiu-Jitsu Adulto', prof: 'Prof. Julio', type: 'Gi', mat: 'Principal', sport: 'BJJ' },
    { time: '09:00 - 10:30', name: 'Muay Thai Matutino', prof: 'Prof. Marcus', type: 'Striking', mat: 'B', sport: 'Muay Thai' },
    { time: '17:00 - 18:00', name: 'Judô Infantil', prof: 'Profa. Ana', type: 'Gi', mat: 'Principal', sport: 'Judô' },
    { time: '19:00 - 20:30', name: 'Boxe Profissional', prof: 'Prof. Julio', type: 'Striking', mat: 'B', sport: 'Boxe' },
  ]},
  { day: 'Terça-feira', classes: [
    { time: '07:00 - 08:30', name: 'Fundamentos Jiu-Jitsu', prof: 'Prof. Rafael', type: 'Gi', mat: 'Principal', sport: 'BJJ' },
    { time: '18:00 - 19:00', name: 'Muay Thai Feminino', prof: 'Profa. Ana', type: 'Striking', mat: 'B', sport: 'Muay Thai' },
    { time: '19:30 - 21:00', name: 'Jiu-Jitsu Iniciante', prof: 'Prof. Rafael', type: 'Gi', mat: 'Principal', sport: 'BJJ' },
  ]},
]

export default function CronogramaPage() {
  const { lang } = useApp()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="min-h-screen bg-surface-900 pb-32 text-left relative z-10 pointer-events-auto">
      
      {/* Modal Adicionar Aula */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-3xl pointer-events-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }} 
              className="bg-surface-800 w-full max-w-xl rounded-[3rem] p-12 border border-white/10 shadow-2xl relative text-left"
            >
               <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 p-3 text-text-muted hover:text-white border border-white/5 rounded-full bg-surface-900 shadow-xl"><X className="w-6 h-6" /></button>
               <h2 className="text-3xl font-display font-black text-text-primary uppercase italic tracking-tighter mb-10 leading-none">Nova Grade <br /><span className="text-accent-primary italic">de Treinamento</span></h2>
               
               <div className="space-y-8">
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-2 opacity-60">TIPO DE MODALIDADE</label>
                     <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {['Jiu-Jitsu', 'Muay Thai', 'Boxe', 'Judô'].map((tag) => (
                          <button key={tag} className="py-3 px-2 rounded-xl bg-surface-900 border border-white/5 text-[9px] font-black uppercase text-text-muted hover:border-accent-primary hover:text-accent-primary transition-all pointer-events-auto cursor-pointer">{tag}</button>
                        ))}
                     </div>
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-2 opacity-60">NOME DO TREINO</label>
                     <input type="text" className="w-full bg-surface-900 border border-white/10 rounded-2xl px-6 py-4 text-base font-bold text-text-primary outline-none focus:border-accent-primary shadow-inner" placeholder="Ex: Graduação Adulto G1..." />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-2 opacity-60">PROFESSOR</label>
                        <select className="w-full bg-surface-900 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-text-primary outline-none focus:border-accent-primary shadow-inner appearance-none">
                           <option>Prof. Julio</option>
                           <option>Prof. Marcos</option>
                           <option>Profa. Ana</option>
                           <option>Prof. Rafael</option>
                        </select>
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-2 opacity-60">TATAME</label>
                        <select className="w-full bg-surface-900 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-text-primary outline-none focus:border-accent-primary shadow-inner appearance-none">
                           <option>Tatame Principal</option>
                           <option>Tatame B (Strike)</option>
                           <option>Tatame C (Infantil)</option>
                        </select>
                     </div>
                  </div>

                  <div className="space-y-3">
                     <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-2 opacity-60">DIAS DA SEMANA</label>
                     <div className="flex flex-wrap gap-2">
                        {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, i) => (
                          <button key={day} className={`py-3 px-4 rounded-xl border border-white/5 text-[10px] font-black uppercase transition-all pointer-events-auto cursor-pointer ${i === 0 || i === 2 ? 'bg-accent-primary text-black shadow-xl shadow-accent-primary/20' : 'bg-surface-900 text-text-muted hover:border-accent-primary hover:text-accent-primary'}`}>{day}</button>
                        ))}
                     </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-surface-900 border border-white/5 rounded-2xl">
                     <div className="flex items-center gap-3">
                        <Zap className="w-5 h-5 text-accent-primary" />
                        <div>
                           <p className="text-xs font-black text-text-primary uppercase tracking-widest">Auto-Repetir</p>
                           <p className="text-[9px] text-text-muted font-bold">Replicar essa aula para as próximas semanas</p>
                        </div>
                     </div>
                     <div className="w-12 h-6 rounded-full bg-accent-primary flex items-center p-1 cursor-pointer pointer-events-auto shadow-inner shadow-black/20">
                        <div className="w-4 h-4 rounded-full bg-black translate-x-6 shadow-md" />
                     </div>
                  </div>
                  <div className="flex gap-4 pt-6 border-t border-white/5">
                    <button onClick={() => setIsModalOpen(false)} className="flex-1 py-5 bg-surface-700 text-text-primary rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-surface-600 transition-all">CANCELAR</button>
                    <button onClick={() => { setIsModalOpen(false); alert('Grade Atualizada! 🥋🚀'); }} className="flex-1 py-5 bg-accent-primary text-black rounded-2xl font-black uppercase text-[12px] tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3"><span>SALVAR AULA</span><Check className="w-6 h-6 stroke-[3]" /></button>
                  </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="p-4 md:p-10 space-y-12 animate-fade-in text-left">
        {/* Header Hero */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
           <div className="text-left">
              <h1 className="text-4xl md:text-6xl font-display font-black text-text-primary uppercase italic tracking-tighter leading-none mb-4">Cronograma <br /><span className="text-accent-primary italic">Operacional</span></h1>
              <p className="text-[11px] text-text-muted font-black uppercase tracking-[0.4em] opacity-40">Grade de horários e ocupação de tatames</p>
           </div>
           <button 
             onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsModalOpen(true); }}
             className="px-10 py-5 bg-accent-primary text-black rounded-[2rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-accent-primary/20 hover:scale-105 transition-all border-none active:scale-95 pointer-events-auto flex items-center gap-4 relative z-20"
           >
              <Plus className="w-6 h-6 stroke-[3]" /> <span className="font-black">ADICIONAR AULA</span>
           </button>
        </div>

        {/* Calendar Strip */}
        <div className="kpi-card !rounded-[3rem] bg-surface-800 border border-white/5 shadow-2xl p-6 flex items-center justify-between group">
           <button className="w-14 h-14 rounded-2xl bg-surface-900 border border-white/5 flex items-center justify-center text-text-muted hover:bg-accent-primary hover:text-black transition-all shadow-xl"><ChevronLeft className="w-7 h-7" /></button>
           <div className="flex gap-4 overflow-x-auto scrollbar-hide py-4 px-4 mask-fade-edges">
              {['SEGUNDA', 'TERÇA', 'QUARTA', 'QUINTA', 'SEXTA', 'SÁBADO'].map((day, i) => (
                <div key={i} className={`flex flex-col items-center gap-2 min-w-[100px] p-4 rounded-[2rem] transition-all cursor-pointer shadow-lg group/item ${i === 0 ? 'bg-accent-primary shadow-accent-primary/20 scale-105' : 'bg-surface-900 border border-white/5 hover:border-accent-primary/40'}`}>
                  <span className={`text-[10px] font-black tracking-widest ${i === 0 ? 'text-black' : 'text-text-muted group-hover/item:text-text-primary'}`}>{day}</span>
                  <span className={`text-xl font-display font-black italic ${i === 0 ? 'text-black' : 'text-white'}`}>{16 + i} MAR</span>
                </div>
              ))}
           </div>
           <button className="w-14 h-14 rounded-2xl bg-surface-900 border border-white/5 flex items-center justify-center text-text-muted hover:bg-accent-primary hover:text-black transition-all shadow-xl"><ChevronRight className="w-7 h-7" /></button>
        </div>

        {/* Schedule grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          {schedule.map((day, i) => (
            <div key={i} className="space-y-8 animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-5">
                   <div className="w-12 h-12 rounded-2xl bg-surface-800 border border-white/5 flex items-center justify-center text-accent-primary"><Calendar className="w-6 h-6" /></div>
                   <h2 className="text-2xl font-display font-black text-text-primary uppercase italic tracking-tighter leading-none">{day.day}</h2>
                </div>
                <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); alert('Automação ativada para esta grade! ⚡'); }} className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-surface-800/50 border border-white/5 text-[9px] font-black uppercase tracking-widest text-text-muted hover:text-accent-primary hover:border-accent-primary transition-all pointer-events-auto relative z-50 cursor-pointer">
                  <Zap className="w-4 h-4" /> AUTO-REPETIR
                </button>
              </div>

              <div className="grid grid-cols-1 gap-5">
                {day.classes.map((cls, j) => (
                  <div key={j} className="kpi-card !rounded-[2.5rem] p-8 bg-surface-800 border border-white/5 hover:border-accent-primary/20 group hover:bg-surface-700/30 transition-all pointer-events-auto cursor-pointer relative z-10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                       <div className={`w-16 h-16 rounded-[1.8rem] flex items-center justify-center shadow-xl group-hover:scale-110 transition-all ${
                         cls.sport === 'BJJ' ? 'bg-accent-primary text-black' : 
                         cls.sport === 'Muay Thai' ? 'bg-red-500 text-white shadow-red-500/20' : 
                         cls.sport === 'Boxe' ? 'bg-blue-500 text-white shadow-blue-500/20' : 
                         'bg-emerald-500 text-white shadow-emerald-500/20'
                       }`}>
                          {cls.sport === 'BJJ' && <Award className="w-8 h-8 stroke-[2.5]" />}
                          {cls.sport === 'Muay Thai' && <Swords className="w-8 h-8 stroke-[2.5]" />}
                          {cls.sport === 'Boxe' && <Target className="w-8 h-8 stroke-[2.5]" />}
                          {cls.sport === 'Judô' && <Dumbbell className="w-8 h-8 stroke-[2.5]" />}
                       </div>
                       <div className="text-left">
                          <p className="text-xl font-black text-text-primary uppercase tracking-tighter leading-none mb-2 italic">{cls.name}</p>
                          <div className="flex items-center gap-3 opacity-60">
                             <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">{cls.prof}</span>
                             <span className="w-1 h-1 rounded-full bg-text-muted/30" />
                             <span className="text-[10px] font-black text-accent-primary uppercase tracking-widest">Tatame {cls.mat}</span>
                          </div>
                       </div>
                    </div>
                    
                    <div className="flex items-center justify-between md:flex-col md:items-end gap-3 min-w-[120px]">
                       <div className="flex items-center gap-2 px-4 py-2 bg-surface-900 border border-white/5 rounded-xl shadow-inner">
                          <Clock className="w-4 h-4 text-accent-primary" />
                          <span className="text-xs font-black text-text-primary italic tracking-tight">{cls.time}</span>
                       </div>
                       <span className={`text-[9px] font-black px-4 py-1.5 rounded-lg border-2 uppercase tracking-widest shadow-xl transition-all ${
                         cls.type === 'Gi' ? 'bg-accent-primary/10 text-accent-primary border-accent-primary/20' : 'bg-surface-900 text-text-muted border-white/5'
                       }`}>
                          {cls.type}
                       </span>
                    </div>
                  </div>
                ))}
                
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsModalOpen(true); }}
                  className="w-full py-6 rounded-[2rem] border-2 border-dashed border-white/5 bg-surface-900/50 text-text-muted hover:text-accent-primary hover:border-accent-primary/40 transition-all flex items-center justify-center gap-5 text-[11px] font-white uppercase tracking-[0.3em] pointer-events-auto cursor-pointer relative z-50 group mt-4 italic shadow-inner"
                >
                  <Plus className="w-7 h-7 stroke-[3] group-hover:rotate-90 transition-transform" /> 
                  <span className="group-hover:translate-x-2 transition-transform">ADICIONAR NOVA AULA</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
