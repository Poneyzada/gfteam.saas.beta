'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, Calendar, Clock, Award, 
  Target, Dumbbell, Swords, Trash2,
  ChevronLeft, ChevronRight, Zap, X,
  Edit3, MapPin, Users
} from 'lucide-react'

export default function AntesAntesCronogramaPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingClass, setEditingClass] = useState<any | null>(null)
  const [selectedDayIndex, setSelectedDayIndex] = useState(0)

  const days = [
    { name: 'Segunda', label: 'Seg', date: '06' },
    { name: 'Terça', label: 'Ter', date: '07' },
    { name: 'Quarta', label: 'Qua', date: '08' },
    { name: 'Quinta', label: 'Qui', date: '09' },
    { name: 'Sexta', label: 'Sex', date: '10' },
    { name: 'Sábado', label: 'Sáb', date: '11' },
    { name: 'Domingo', label: 'Dom', date: '12' },
  ]

  const [schedule, setSchedule] = useState<any[]>([
    {
      day: 'Segunda',
      classes: [
        { id: 1, name: 'BJJ Kids', prof: 'Prof. Carlos', sport: 'BJJ', mat: 'Tatame A', time: '18:00', type: 'Gi', tags: ['Kids', 'Iniciante'] },
        { id: 2, name: 'BJJ Adulto', prof: 'Mestre Julio', sport: 'BJJ', mat: 'Principal', time: '19:30', type: 'Gi', tags: ['Avançado', 'Gi'] },
      ]
    },
    { day: 'Terça', classes: [] },
    { day: 'Quarta', classes: [] },
    { day: 'Quinta', classes: [] },
    { day: 'Sexta', classes: [] },
    { day: 'Sábado', classes: [] },
    { day: 'Domingo', classes: [] },
  ])

  const [form, setForm] = useState({
    name: '',
    prof: '',
    sport: 'BJJ',
    mat: 'Principal',
    time: '18:00',
    type: 'Gi',
    tags: ''
  })

  const handleOpenModal = (cls: any = null) => {
    if (cls) {
      setEditingClass(cls)
      setForm({
        name: cls.name,
        prof: cls.prof,
        sport: cls.sport,
        mat: cls.mat,
        time: cls.time,
        type: cls.type,
        tags: cls.tags.join(', ')
      })
    } else {
      setEditingClass(null)
      setForm({ name: '', prof: '', sport: 'BJJ', mat: 'Principal', time: '18:00', type: 'Gi', tags: '' })
    }
    setIsModalOpen(true)
  }

  const handleSave = () => {
    if (!form.name) return
    const updatedSchedule = [...schedule]
    const tagArray = form.tags.split(',').map(t => t.trim()).filter(t => t !== '')
    
    if (editingClass) {
      // Update
      const dayClasses = updatedSchedule[selectedDayIndex].classes
      const index = dayClasses.findIndex((c: any) => c.id === editingClass.id)
      dayClasses[index] = { ...editingClass, ...form, tags: tagArray }
    } else {
      // Create
      updatedSchedule[selectedDayIndex].classes.push({
        id: Date.now(),
        ...form,
        tags: tagArray
      })
    }
    setSchedule(updatedSchedule)
    setIsModalOpen(false)
  }

  return (
    <div className="p-4 md:p-10 space-y-10 animate-fade-in text-left min-h-screen bg-app selection:bg-accent-primary selection:text-black pb-40">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
         <div className="text-left">
            <h1 className="text-4xl md:text-5xl font-display font-black text-black dark:text-white uppercase italic tracking-tighter leading-none">Gestão <span className="text-accent-primary italic">Operacional</span></h1>
            <p className="text-[10px] text-black dark:text-white font-black uppercase tracking-[0.3em] mt-3 opacity-60">Grade Horária • Edição de Turmas</p>
         </div>
         <div className="flex items-center gap-4">
            <button className="px-6 py-4 rounded-xl bg-surface-800 border border-black/10 dark:border-white/10 text-[10px] font-black uppercase text-black dark:text-white hover:bg-surface-700 transition-all cursor-pointer flex items-center gap-3">
               <Zap className="w-4 h-4 text-accent-primary" /> REPETIR SEMANA
            </button>
            <button 
              onClick={() => handleOpenModal()}
              className="px-8 py-4 rounded-xl bg-accent-primary text-black rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all border-none cursor-pointer flex items-center gap-3"
            >
               <Plus className="w-5 h-5 stroke-[3]" /> NOVO HORÁRIO
            </button>
         </div>
      </div>

      {/* "Antes Antes" Calendar Strip */}
      <div className="kpi-card !p-6 bg-surface-800 border-black/10 dark:border-white/10 flex items-center justify-between">
         <button className="p-3 rounded-xl bg-surface-900 border border-black/5 text-black dark:text-white hover:bg-accent-primary hover:text-black transition-all cursor-pointer">
            <ChevronLeft className="w-5 h-5" />
         </button>
         
         <div className="flex gap-3 md:gap-6 overflow-x-auto no-scrollbar py-2">
            {days.map((day, i) => (
               <div 
                 key={i} 
                 onClick={() => setSelectedDayIndex(i)}
                 className={`flex flex-col items-center justify-center min-w-[70px] md:min-w-[100px] h-20 rounded-2xl transition-all cursor-pointer border ${selectedDayIndex === i ? 'bg-accent-primary border-accent-primary shadow-lg shadow-accent-primary/20 text-black' : 'bg-surface-900 border-black/5 text-black dark:text-white'}`}
               >
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-60 mb-1">{day.label}</span>
                  <span className="text-xl font-display font-black leading-none">{day.date}</span>
               </div>
            ))}
         </div>

         <button className="p-3 rounded-xl bg-surface-900 border border-black/5 text-black dark:text-white hover:bg-accent-primary hover:text-black transition-all cursor-pointer">
            <ChevronRight className="w-5 h-5" />
         </button>
      </div>

      {/* Daily Schedule List */}
      <div className="space-y-6">
         <div className="flex items-center gap-4 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent-primary flex items-center justify-center text-black">
               <Calendar className="w-5 h-5" />
            </div>
            <h2 className="text-3xl font-display font-black text-black dark:text-white uppercase italic tracking-tighter">{days[selectedDayIndex].name}</h2>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {schedule[selectedDayIndex].classes.length === 0 ? (
               <div className="col-span-full py-20 bg-surface-900 border border-dashed border-black/10 dark:border-white/10 rounded-[3rem] text-center">
                  <p className="text-[10px] font-black text-black dark:text-white opacity-30 uppercase tracking-[0.4em] italic leading-none">Nenhuma turma cadastrada para {days[selectedDayIndex].name}</p>
                  <button onClick={() => handleOpenModal()} className="mt-8 px-6 py-3 bg-accent-primary/10 text-accent-primary rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-accent-primary hover:text-black transition-all cursor-pointer border border-accent-primary/20">+ Criar Horário</button>
               </div>
            ) : schedule[selectedDayIndex].classes.map((cls: any) => (
               <div key={cls.id} className="kpi-card !p-8 bg-surface-900 border-black/10 dark:border-white/10 hover:border-accent-primary transition-all group relative overflow-visible">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                     <div className="flex items-start gap-6 text-left">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl ${
                          cls.sport === 'BJJ' ? 'bg-accent-primary text-black' : 
                          cls.sport === 'Muay Thai' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                        }`}>
                           {cls.sport === 'BJJ' && <Award className="w-8 h-8" />}
                           {cls.sport === 'Muay Thai' && <Swords className="w-8 h-8" />}
                        </div>
                        <div>
                           <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-2xl font-display font-black text-black dark:text-white uppercase italic tracking-tighter leading-none">{cls.name}</h4>
                              <span className="text-[9px] font-black bg-surface-800 text-black dark:text-white px-2 py-0.5 rounded-md border border-black/5 uppercase tracking-widest">{cls.type}</span>
                           </div>
                           <p className="text-[10px] font-black text-black dark:text-white uppercase tracking-widest opacity-60 mb-4">{cls.prof} • {cls.mat}</p>
                           <div className="flex flex-wrap gap-2">
                              {cls.tags.map((tag: string, tid: number) => (
                                 <span key={tid} className="text-[8px] font-black bg-accent-primary/10 text-accent-primary px-3 py-1 rounded-full uppercase tracking-widest border border-accent-primary/20">#{tag}</span>
                              ))}
                           </div>
                        </div>
                     </div>
                     
                     <div className="flex items-center justify-between md:flex-col md:items-end gap-4 min-w-[120px]">
                        <div className="flex items-center gap-3 px-4 py-2 bg-surface-800 border border-black/10 rounded-xl shadow-sm">
                           <Clock className="w-4 h-4 text-accent-primary" />
                           <span className="text-sm font-black text-black dark:text-white italic">{cls.time}</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <button 
                             onClick={() => handleOpenModal(cls)}
                             className="p-3 rounded-xl bg-surface-800 text-black dark:text-white hover:bg-accent-primary hover:text-black transition-all cursor-pointer border border-black/5 shadow-md"
                           >
                              <Edit3 className="w-4 h-4" />
                           </button>
                           <button 
                             onClick={() => {
                               const updated = [...schedule]
                               updated[selectedDayIndex].classes = updated[selectedDayIndex].classes.filter((c: any) => c.id !== cls.id)
                               setSchedule(updated)
                             }}
                             className="p-3 rounded-xl bg-red-600/10 text-red-600 hover:bg-red-600 hover:text-white transition-all cursor-pointer border border-red-600/20 shadow-md"
                           >
                              <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>

      {/* Modal de Edição/Criação Restaurado */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setIsModalOpen(false)} />
             <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-xl bg-surface-800 border border-black/10 dark:border-white/10 rounded-[3rem] p-10 text-left shadow-2xl"
            >
              <h2 className="text-3xl font-display font-black text-text-primary mb-8 uppercase italic tracking-tighter leading-none">{editingClass ? 'Editar Horário' : 'Novo Horário'}</h2>
              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest pl-2 opacity-80">Nome da Turma</label>
                    <input type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full mt-2 bg-surface-900 border border-black/10 dark:border-white/10 p-5 rounded-2xl text-text-primary font-black uppercase text-sm outline-none focus:border-accent-primary shadow-inner" placeholder="EX: BJJ AVANÇADO..." />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest pl-2 opacity-80">Professor</label>
                       <input type="text" value={form.prof} onChange={(e) => setForm({...form, prof: e.target.value})} className="w-full mt-2 bg-surface-900 border border-black/10 dark:border-white/10 p-5 rounded-2xl text-text-primary font-black text-sm outline-none focus:border-accent-primary" />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest pl-2 opacity-80">Horário</label>
                        <input type="text" value={form.time} onChange={(e) => setForm({...form, time: e.target.value})} className="w-full mt-2 bg-surface-900 border border-black/10 dark:border-white/10 p-5 rounded-2xl text-text-primary font-black text-sm outline-none focus:border-accent-primary" placeholder="19:30" />
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest pl-2 opacity-80">Local / Tatame</label>
                       <input type="text" value={form.mat} onChange={(e) => setForm({...form, mat: e.target.value})} className="w-full mt-2 bg-surface-900 border border-black/10 dark:border-white/10 p-5 rounded-2xl text-text-primary font-black text-sm outline-none focus:border-accent-primary" />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest pl-2 opacity-80">Modalidade</label>
                        <select value={form.sport} onChange={(e) => setForm({...form, sport: e.target.value})} className="w-full mt-2 bg-surface-900 border border-black/10 dark:border-white/10 p-5 rounded-2xl text-text-primary font-black text-sm outline-none focus:border-accent-primary appearance-none">
                           <option className="bg-surface-900 text-text-primary">BJJ</option>
                           <option className="bg-surface-900 text-text-primary">Muay Thai</option>
                           <option className="bg-surface-900 text-text-primary">Boxe</option>
                           <option className="bg-surface-900 text-text-primary">Luta Livre</option>
                        </select>
                     </div>
                 </div>

                 <div>
                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest pl-2 opacity-80">Tags (Separadas por vírgula)</label>
                    <input type="text" value={form.tags} onChange={(e) => setForm({...form, tags: e.target.value})} className="w-full mt-2 bg-surface-900 border border-black/10 dark:border-white/10 p-5 rounded-2xl text-text-primary font-black text-sm outline-none focus:border-accent-primary" placeholder="Avançado, Gi, Competição" />
                 </div>

                 <div className="flex gap-4 mt-8">
                    <button onClick={() => setIsModalOpen(false)} className="flex-1 py-5 rounded-2xl bg-surface-700 text-text-primary font-black uppercase text-[10px] tracking-widest border border-black/10 dark:border-white/10 cursor-pointer">Cancelar</button>
                    <button onClick={handleSave} className="flex-1 py-5 rounded-2xl bg-accent-primary text-black font-black uppercase text-[10px] tracking-widest shadow-xl border-none cursor-pointer">Salvar Grade</button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
