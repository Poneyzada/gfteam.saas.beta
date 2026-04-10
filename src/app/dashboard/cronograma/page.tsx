'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Calendar, Clock, Award, 
  Target, Dumbbell, Swords, Trash2,
  ChevronLeft, ChevronRight, Zap, X
} from 'lucide-react'

export default function RaizCronogramaPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [schedule, setSchedule] = useState([
    {
      day: 'Segunda-Feira',
      classes: [
        { id: 1, name: 'BJJ Iniciante', prof: 'Prof. Marcos', sport: 'BJJ', mat: 'A', time: '18:00', type: 'Gi' },
        { id: 2, name: 'Muay Thai', prof: 'Prof. Silva', sport: 'Muay Thai', mat: 'B', time: '19:30', type: 'No-Gi' },
      ]
    },
    {
      day: 'Terça-Feira',
      classes: [
        { id: 3, name: 'BJJ Competição', prof: 'Mestre Julio', sport: 'BJJ', mat: 'A', time: '20:00', type: 'Gi' },
      ]
    },
    {
      day: 'Quarta-Feira',
      classes: []
    },
    {
      day: 'Quinta-Feira',
      classes: []
    }
  ])

  const [newClass, setNewClass] = useState<{
    name: string,
    prof: string,
    type: string,
    mat: string,
    sport: 'BJJ' | 'Muay Thai' | 'Boxe' | 'Judô',
    time: string
  }>({
    name: '',
    prof: 'Prof. Julio',
    type: 'Gi',
    mat: 'Principal',
    sport: 'BJJ',
    time: '18:00'
  })

  const [selectedDayIndex, setSelectedDayIndex] = useState(0)

  const handleAddClass = () => {
    if (!newClass.name) return
    const updatedSchedule = [...schedule]
    updatedSchedule[selectedDayIndex].classes.push({
      id: Date.now(),
      ...newClass,
    })
    setSchedule(updatedSchedule)
    setIsModalOpen(false)
    setNewClass({ name: '', prof: 'Prof. Julio', type: 'Gi', mat: 'Principal', sport: 'BJJ', time: '18:00' })
  }

  return (
    <div className="p-4 md:p-10 space-y-12 animate-fade-in text-left min-h-screen bg-app selection:bg-accent-primary selection:text-black pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
         <div className="text-left">
            <h1 className="text-4xl md:text-6xl font-display font-black text-black dark:text-white uppercase italic tracking-tighter leading-none mb-4">Cronograma <br /><span className="text-accent-primary italic">Operacional</span></h1>
            <p className="text-[11px] text-black dark:text-white font-black uppercase tracking-[0.4em]">Grade de horários e ocupação de tatames</p>
         </div>
         <button 
           onClick={() => setIsModalOpen(true)}
           className="px-10 py-5 bg-accent-primary text-black rounded-xl text-[12px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all border-none cursor-pointer flex items-center gap-4"
         >
            <Plus className="w-6 h-6 stroke-[3]" /> <span className="font-black">ADICIONAR AULA</span>
         </button>
      </div>

      {/* Grid Layout Raiz (Two Columns of Days) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
        {schedule.map((day, i) => (
          <div key={i} className="space-y-8 text-left">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-5">
                 <div className="w-12 h-12 rounded-xl bg-surface-800 border border-black/10 dark:border-white/10 flex items-center justify-center text-accent-primary shadow-sm">
                    <Calendar className="w-6 h-6" />
                 </div>
                 <h2 className="text-2xl font-display font-black text-black dark:text-white uppercase italic tracking-tighter">{day.day}</h2>
              </div>
              <button 
                onClick={() => setSelectedDayIndex(i)}
                className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-surface-800 border border-black/10 dark:border-white/10 text-[9px] font-black uppercase text-black dark:text-white hover:border-accent-primary transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> NOVO HORÁRIO
              </button>
            </div>

            <div className="grid grid-cols-1 gap-5">
              {day.classes.length === 0 ? (
                <div className="py-10 text-center border-2 border-dashed border-black/10 dark:border-white/10 rounded-2xl opacity-40 font-black uppercase text-[10px] italic">Nenhuma aula agendada</div>
              ) : day.classes.map((cls) => (
                <div key={cls.id} className="kpi-card !p-8 bg-surface-900 border-black/10 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-accent-primary transition-all">
                  <div className="flex items-center gap-6">
                     <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
                       cls.sport === 'BJJ' ? 'bg-accent-primary text-black' : 
                       cls.sport === 'Muay Thai' ? 'bg-red-500 text-white' : 
                       cls.sport === 'Boxe' ? 'bg-blue-500 text-white' : 
                       'bg-emerald-500 text-white'
                     }`}>
                        {cls.sport === 'BJJ' && <Award className="w-8 h-8" />}
                        {cls.sport === 'Muay Thai' && <Swords className="w-8 h-8" />}
                        {cls.sport === 'Boxe' && <Target className="w-8 h-8" />}
                        {cls.sport === 'Judô' && <Dumbbell className="w-8 h-8" />}
                     </div>
                     <div className="text-left">
                        <p className="text-xl font-black text-black dark:text-white uppercase italic leading-none mb-2">{cls.name}</p>
                        <div className="flex items-center gap-3">
                           <span className="text-[10px] font-black text-black dark:text-white uppercase tracking-widest">{cls.prof}</span>
                           <span className="text-[10px] font-black text-accent-primary uppercase tracking-widest">Mat: {cls.mat}</span>
                        </div>
                     </div>
                  </div>
                  
                  <div className="flex items-center justify-between md:items-end md:flex-col gap-4">
                     <div className="flex items-center gap-2 px-4 py-2 bg-surface-800 border border-black/10 rounded-xl">
                        <Clock className="w-4 h-4 text-accent-primary" />
                        <span className="text-xs font-black text-black dark:text-white italic">{cls.time}</span>
                     </div>
                     <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black px-4 py-1.5 rounded-lg border-2 border-black/10 dark:border-white/10 uppercase text-black dark:text-white">
                           {cls.type}
                        </span>
                        <button 
                          onClick={() => {
                            const updated = [...schedule]
                            updated[i].classes = updated[i].classes.filter(c => c.id !== cls.id)
                            setSchedule(updated)
                          }}
                          className="p-2.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer border-none"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                     </div>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={() => { setSelectedDayIndex(i); setIsModalOpen(true); }}
                className="w-full py-6 border-2 border-dashed border-black/10 dark:border-white/10 rounded-2xl bg-transparent text-black dark:text-white hover:text-accent-primary hover:border-accent-primary transition-all font-black uppercase text-[11px] tracking-widest cursor-pointer mt-4"
              >
                + ADICIONAR AULA PARA {day.day.toUpperCase()}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal - Raiz High Contrast */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
             <div className="bg-surface-800 w-full max-w-lg rounded-[3rem] p-10 relative z-10 shadow-2xl border border-white/10 text-left">
                <h2 className="text-3xl font-display font-black text-black dark:text-white tracking-tighter italic uppercase mb-8">Novo Horário</h2>
                
                <div className="space-y-6">
                   <div>
                      <label className="text-[10px] font-black text-black dark:text-white uppercase tracking-widest pl-2">Nome da Aula</label>
                      <input type="text" value={newClass.name} onChange={(e) => setNewClass({...newClass, name: e.target.value})} className="w-full mt-2 bg-surface-900 border border-black/10 p-5 rounded-2xl text-black dark:text-white font-black uppercase text-sm outline-none focus:border-accent-primary" placeholder="Ex: BJJ KIDS..." />
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black text-black dark:text-white uppercase tracking-widest pl-2">Horário</label>
                        <input type="text" value={newClass.time} onChange={(e) => setNewClass({...newClass, time: e.target.value})} className="w-full mt-2 bg-surface-900 border border-black/10 p-5 rounded-2xl text-black dark:text-white font-black text-sm outline-none focus:border-accent-primary" placeholder="18:00" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-black dark:text-white uppercase tracking-widest pl-2">Modalidade</label>
                        <select value={newClass.sport} onChange={(e) => setNewClass({...newClass, sport: e.target.value as any})} className="w-full mt-2 bg-surface-900 border border-black/10 p-5 rounded-2xl text-black dark:text-white font-black text-sm outline-none focus:border-accent-primary appearance-none">
                           <option>BJJ</option>
                           <option>Muay Thai</option>
                           <option>Boxe</option>
                           <option>Judô</option>
                        </select>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black text-black dark:text-white uppercase tracking-widest pl-2">Instrutor</label>
                        <input type="text" value={newClass.prof} onChange={(e) => setNewClass({...newClass, prof: e.target.value})} className="w-full mt-2 bg-surface-900 border border-black/10 p-5 rounded-2xl text-black dark:text-white font-black text-sm outline-none focus:border-accent-primary" />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-black dark:text-white uppercase tracking-widest pl-2">Uniforme</label>
                        <select value={newClass.type} onChange={(e) => setNewClass({...newClass, type: e.target.value})} className="w-full mt-2 bg-surface-900 border border-black/10 p-5 rounded-2xl text-black dark:text-white font-black text-sm outline-none focus:border-accent-primary appearance-none">
                           <option>Gi</option>
                           <option>No-Gi</option>
                           <option>Livre</option>
                        </select>
                      </div>
                   </div>
                </div>

                <div className="flex gap-4 mt-10">
                   <button onClick={() => setIsModalOpen(false)} className="flex-1 py-5 rounded-2xl bg-surface-700 text-black dark:text-white font-black uppercase text-[10px] tracking-widest border-none cursor-pointer">Cancelar</button>
                   <button onClick={handleAddClass} className="flex-1 py-5 rounded-2xl bg-accent-primary text-black font-black uppercase text-[10px] tracking-widest shadow-xl border-none cursor-pointer">Salvar Grade</button>
                </div>
             </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
