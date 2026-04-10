'use client'

import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import { 
  Calendar, Clock, Users, Plus, 
  ChevronLeft, ChevronRight, Zap, Award,
  Dumbbell, Target, Swords, X, Check, BookOpen,
  LayoutGrid, List, Filter, Save
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface ClassRecord {
  id: string
  time: string
  name: string
  prof: string
  type: string
  mat: string
  sport: string
}

const initialSchedule: Record<string, ClassRecord[]> = {
  'SEGUNDA': [
    { id: '1', time: '06:30 - 08:00', name: 'Jiu-Jitsu Adulto', prof: 'Prof. Julio', type: 'Gi', mat: 'Principal', sport: 'Jiu-Jitsu' },
    { id: '2', time: '19:00 - 20:30', name: 'Boxe Profissional', prof: 'Prof. Julio', type: 'Striking', mat: 'B', sport: 'Boxe' },
  ],
  'TERÇA': [
    { id: '3', time: '07:00 - 08:30', name: 'Fundamentos JJ', prof: 'Prof. Rafael', type: 'Gi', mat: 'Principal', sport: 'Jiu-Jitsu' },
    { id: '4', time: '19:30 - 21:00', name: 'Jiu-Jitsu Iniciante', prof: 'Prof. Rafael', type: 'Gi', mat: 'Principal', sport: 'Jiu-Jitsu' },
  ],
  'QUARTA': [],
  'QUINTA': [],
  'SEXTA': [],
  'SÁBADO': []
}

export default function GradeOperacionalPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDayTab, setSelectedDayTab] = useState('SEGUNDA')
  const [schedule, setSchedule] = useState(initialSchedule)
  
  // Modal State
  const [newClass, setNewClass] = useState<Partial<ClassRecord>>({
    name: '',
    prof: '',
    sport: 'Jiu-Jitsu',
    type: 'Gi',
    mat: 'Principal',
    time: '18:00 - 19:30'
  })

  const daysLabels = ['SEGUNDA', 'TERÇA', 'QUARTA', 'QUINTA', 'SEXTA', 'SÁBADO']

  const handleAddClass = () => {
    if (!newClass.name) return
    const id = Math.random().toString(36).substr(2, 9)
    const record = { ...newClass, id } as ClassRecord
    
    setSchedule(prev => ({
      ...prev,
      [selectedDayTab]: [...prev[selectedDayTab], record]
    }))
    setIsModalOpen(false)
    setNewClass({ name: '', prof: '', sport: 'Jiu-Jitsu', type: 'Gi', mat: 'Principal', time: '18:00 - 19:30' })
  }

  return (
    <div className="min-h-screen bg-surface-900 pb-32 text-left relative z-[1] selection:bg-accent-primary selection:text-black overflow-x-hidden">
      
      {/* ADD CLASS MODAL - Fixed Interactivity */}
      <AnimatePresence>
        {isModalOpen && (
          <div 
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl overflow-y-auto"
            style={{ pointerEvents: 'auto' }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              className="bg-surface-800 w-full max-w-lg rounded-[3rem] p-8 md:p-12 border border-white/10 shadow-2xl relative text-left my-auto pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="absolute top-6 right-6 w-12 h-12 rounded-full bg-surface-900 border border-white/5 flex items-center justify-center text-text-muted hover:text-white transition-all shadow-xl active:scale-95 cursor-pointer z-[100]"
                >
                  <X className="w-5 h-5" />
                </button>

                <h2 className="text-3xl font-display font-black text-text-primary uppercase italic tracking-tighter mb-8 leading-none">Nova Aula <br /><span className="text-accent-primary italic">{selectedDayTab}</span></h2>
                
                <div className="space-y-6">
                   <div className="space-y-2">
                       <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-2 opacity-60">Nome da Aula</label>
                       <input 
                         type="text" 
                         value={newClass.name}
                         onChange={(e) => setNewClass({...newClass, name: e.target.value})}
                         className="w-full bg-surface-900 border border-white/10 rounded-2xl px-6 py-4 text-base font-bold text-text-primary outline-none focus:border-accent-primary shadow-inner" 
                         placeholder="Ex: Jiu-Jitsu Kids" 
                       />
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-2 opacity-60">Horário</label>
                          <input 
                            type="text" 
                            value={newClass.time}
                            onChange={(e) => setNewClass({...newClass, time: e.target.value})}
                            className="w-full bg-surface-900 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-text-primary outline-none focus:border-accent-primary shadow-inner" 
                            placeholder="18:00 - 19:30" 
                          />
                      </div>
                      <div className="space-y-2">
                          <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-2 opacity-60">Professor</label>
                          <input 
                            type="text" 
                            value={newClass.prof}
                            onChange={(e) => setNewClass({...newClass, prof: e.target.value})}
                            className="w-full bg-surface-900 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-text-primary outline-none focus:border-accent-primary shadow-inner" 
                            placeholder="Mestre..." 
                          />
                      </div>
                   </div>

                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-2 opacity-60">Modalidade</label>
                      <div className="flex flex-wrap gap-2">
                         {['Jiu-Jitsu', 'Muay Thai', 'Boxe', 'No-Gi'].map((s) => (
                           <button 
                             key={s}
                             onClick={() => setNewClass({...newClass, sport: s})}
                             className={`px-4 py-3 rounded-xl border text-[10px] font-black uppercase transition-all active:scale-95 ${newClass.sport === s ? 'bg-accent-primary border-accent-primary text-black' : 'bg-surface-900 border-white/5 text-text-muted'}`}
                           >
                             {s}
                           </button>
                         ))}
                      </div>
                   </div>

                   <div className="flex gap-4 pt-8">
                      <button onClick={() => setIsModalOpen(false)} className="flex-1 py-5 bg-surface-700 text-text-primary rounded-2xl font-black uppercase text-[11px] tracking-widest">CANCELAR</button>
                      <button onClick={handleAddClass} className="flex-1 py-5 bg-accent-primary text-black rounded-2xl font-black uppercase text-[12px] tracking-[0.2em] shadow-xl shadow-accent-primary/20 hover:scale-105 active:scale-95 transition-all">SALVAR GRADE</button>
                   </div>
                </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="p-6 md:p-12 space-y-12 animate-fade-in text-left">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="text-left">
            <h1 className="text-5xl md:text-7xl font-display font-black text-text-primary tracking-tighter italic uppercase leading-none mb-4">Grade <br /><span className="text-accent-primary italic tracking-tight">Operacional</span></h1>
            <p className="text-[11px] text-text-muted font-black uppercase tracking-[0.4em] opacity-40">Gestão de horários e ocupação de tatames</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-10 py-6 bg-accent-primary text-black rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-accent-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-4 cursor-pointer"
          >
            <Plus className="w-7 h-7 stroke-[3]" /> Adicionar Aula
          </button>
        </div>

        {/* Days Navigation Strip */}
        <div className="flex items-center gap-3 p-2 bg-surface-800 border border-white/5 rounded-[2.8rem] w-full overflow-x-auto scrollbar-hide shadow-2xl">
           {daysLabels.map((day) => (
             <button 
               key={day}
               onClick={() => setSelectedDayTab(day)}
               className={`px-10 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap cursor-pointer ${selectedDayTab === day ? 'bg-accent-primary text-black shadow-xl shadow-accent-primary/10' : 'text-text-muted hover:text-white'}`}
             >
               {day}
             </button>
           ))}
        </div>

        {/* Schedule List for Selected Day */}
        <div className="space-y-6">
           {schedule[selectedDayTab].length === 0 ? (
             <div className="py-32 rounded-[4rem] border-2 border-dashed border-white/5 bg-surface-800/20 flex flex-col items-center justify-center gap-6 opacity-30">
                <Calendar className="w-16 h-16 text-text-muted" />
                <p className="text-[11px] font-black uppercase tracking-[0.4em]">Nenhuma aula programada</p>
             </div>
           ) : (
             <div className="grid grid-cols-1 gap-6">
                {schedule[selectedDayTab].map((cls) => (
                  <div key={cls.id} className="kpi-card !rounded-[3rem] p-8 bg-surface-800 border-white/5 hover:border-accent-primary/30 group transition-all shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-8 pointer-events-auto">
                     <div className="flex items-center gap-8 text-left">
                        <div className="w-16 h-16 rounded-[1.8rem] bg-accent-primary flex items-center justify-center text-black shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all">
                           {cls.sport === 'Jiu-Jitsu' ? <Award className="w-8 h-8" /> : <Swords className="w-8 h-8" />}
                        </div>
                        <div>
                           <div className="flex items-center gap-3 mb-2">
                             <span className="text-[9px] font-black text-accent-primary px-3 py-1 bg-accent-primary/10 rounded-lg border border-accent-primary/20 uppercase tracking-widest italic">{cls.sport}</span>
                             <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] opacity-40">Mestre: {cls.prof || 'A Definir'}</span>
                           </div>
                           <h3 className="text-3xl font-display font-black text-text-primary tracking-tighter uppercase italic leading-none">{cls.name}</h3>
                        </div>
                     </div>
                     <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 px-6 py-4 bg-surface-900 border border-white/5 rounded-2xl shadow-inner group-hover:border-accent-primary/20 transition-all font-display font-black text-text-primary italic text-xl">
                           <Clock className="w-5 h-5 text-accent-primary" />
                           {cls.time}
                        </div>
                        <button className="w-14 h-14 rounded-2xl bg-surface-700 border border-white/5 text-text-muted hover:text-red-500 transition-all flex items-center justify-center group/del">
                           <X className="w-6 h-6 group-hover/del:scale-110 transition-transform" />
                        </button>
                     </div>
                  </div>
                ))}
                
                <button 
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-10 rounded-[3rem] border-2 border-dashed border-white/5 bg-surface-800/40 text-text-muted hover:text-accent-primary hover:border-accent-primary/20 transition-all flex items-center justify-center gap-4 text-[11px] font-black uppercase tracking-[0.3em] cursor-pointer group"
                >
                  <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform" /> ADICIONAR NOVA AULA
                </button>
             </div>
           )}
        </div>
      </div>
    </div>
  )
}
