'use client'

import { useApp } from '@/contexts/AppContext'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Calendar, Clock, MapPin, Users, Plus, ChevronLeft, ChevronRight, Zap, X, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function CronogramaPage() {
  const { lang } = useApp()
  const [schedules, setSchedules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // Form State
  const [formData, setFormData] = useState({
    weekday: 'Segunda-feira',
    class_name: '',
    instructor_name: '',
    time_start: '18:00',
    time_end: '19:30',
    class_type: 'Gi',
    mat_name: 'Principal'
  })

  const weekdays = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo']

  useEffect(() => {
    fetchSchedules()
  }, [])

  async function fetchSchedules() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('tenant_id').eq('id', user.id).single()
      if (profile) {
        const { data } = await supabase.from('schedules').select('*').eq('tenant_id', profile.tenant_id).order('time_start')
        if (data) setSchedules(data)
      }
    }
    setLoading(false)
  }

  async function handleAddClass(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase.from('profiles').select('tenant_id').eq('id', user!.id).single()

    const { error } = await supabase.from('schedules').insert([
      { ...formData, tenant_id: profile!.tenant_id }
    ])

    if (!error) {
      setIsModalOpen(false)
      setFormData({ weekday: 'Segunda-feira', class_name: '', instructor_name: '', time_start: '18:00', time_end: '19:30', class_type: 'Gi', mat_name: 'Principal' })
      fetchSchedules()
    }
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-surface-900 pb-20">
      
      {/* Add Class Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-xl bg-surface-800 border border-white/10 rounded-[3rem] shadow-2xl p-10 overflow-visible">
               <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 rounded-full bg-surface-700 text-text-muted hover:text-text-primary transition-all">
                  <X className="w-5 h-5" />
               </button>
               
               <h2 className="text-3xl font-display font-black text-text-primary mb-2 italic uppercase">Nova Aula</h2>
               <p className="text-[10px] font-black text-[#A1A1AA] uppercase tracking-widest mb-8 opacity-60 italic">Cadastre um novo horário no cronograma</p>

               <form onSubmit={handleAddClass} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-[#A1A1AA] uppercase tracking-widest ml-1">Dia da Semana</label>
                       <select value={formData.weekday} onChange={e => setFormData({...formData, weekday: e.target.value})} className="w-full bg-surface-900 border border-white/5 rounded-2xl py-4 px-4 text-sm font-bold text-text-primary outline-none focus:border-accent-primary/50">
                          {weekdays.map(d => <option key={d} value={d}>{d}</option>)}
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-[#A1A1AA] uppercase tracking-widest ml-1">Tipo</label>
                       <select value={formData.class_type} onChange={e => setFormData({...formData, class_type: e.target.value})} className="w-full bg-surface-900 border border-white/5 rounded-2xl py-4 px-4 text-sm font-bold text-text-primary outline-none focus:border-accent-primary/50">
                          <option value="Gi">Com Kimono (Gi)</option>
                          <option value="No-Gi">Sem Kimono (No-Gi)</option>
                       </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#A1A1AA] uppercase tracking-widest ml-1">Nome da Turma</label>
                    <input type="text" required placeholder="Ex: Jiu-Jitsu Kids" value={formData.class_name} onChange={e => setFormData({...formData, class_name: e.target.value})} className="w-full bg-surface-900 border border-white/5 rounded-2xl py-4 px-4 text-sm font-bold text-text-primary outline-none focus:border-accent-primary/50" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#A1A1AA] uppercase tracking-widest ml-1">Professor Responsável</label>
                    <input type="text" placeholder="Ex: Mestre Frazão" value={formData.instructor_name} onChange={e => setFormData({...formData, instructor_name: e.target.value})} className="w-full bg-surface-900 border border-white/5 rounded-2xl py-4 px-4 text-sm font-bold text-text-primary outline-none focus:border-accent-primary/50" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-[#A1A1AA] uppercase tracking-widest ml-1">Início</label>
                       <input type="time" value={formData.time_start} onChange={e => setFormData({...formData, time_start: e.target.value})} className="w-full bg-surface-900 border border-white/5 rounded-2xl py-4 px-4 text-sm font-bold text-text-primary outline-none focus:border-accent-primary/50" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-[#A1A1AA] uppercase tracking-widest ml-1">Término</label>
                       <input type="time" value={formData.time_end} onChange={e => setFormData({...formData, time_end: e.target.value})} className="w-full bg-surface-900 border border-white/5 rounded-2xl py-4 px-4 text-sm font-bold text-text-primary outline-none focus:border-accent-primary/50" />
                    </div>
                  </div>

                  <button type="submit" disabled={saving} className="btn-primary w-full !rounded-2xl py-5 shadow-2xl mt-4 flex items-center justify-center gap-3">
                    {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <span className="uppercase tracking-[0.3em] text-[10px] font-black text-black">Cadastrar Aula</span>}
                  </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="px-10 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div>
           <h1 className="text-4xl font-display font-black text-text-primary tracking-tight italic uppercase">Cronograma da Academia</h1>
           <p className="text-[10px] text-[#A1A1AA] font-black uppercase tracking-widest mt-2 opacity-60">Gestão de Horários e Professorado</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-3 bg-accent-primary text-black border-none px-8 py-4 rounded-2xl shadow-xl shadow-accent-primary/20 hover:scale-[1.02] transition-all">
           <Plus className="w-5 h-5 font-black" />
           <span className="font-black uppercase tracking-widest text-[10px]">Adicionar Aula</span>
        </button>
      </div>

      <div className="px-10 space-y-10 relative z-10">
        {weekdays.map((day) => {
          const dayClasses = schedules.filter(s => s.weekday === day)
          return (
            <div key={day} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                 <Calendar className="w-5 h-5 text-accent-primary" />
                 <h2 className="text-xl font-display font-black text-text-primary italic uppercase tracking-tighter">{day}</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                 {dayClasses.length > 0 ? dayClasses.map((cls, idx) => (
                   <div key={idx} className="kpi-card group hover:border-accent-primary/50 transition-all bg-surface-800 p-8 rounded-[2.5rem]">
                      <div className="flex items-start justify-between mb-6">
                         <div>
                            <h3 className="text-lg font-black text-text-primary uppercase tracking-tight">{cls.class_name}</h3>
                            <p className="text-[10px] text-[#A1A1AA] font-black uppercase tracking-widest mt-1 opacity-60">{cls.instructor_name || 'Prof. Responsável'}</p>
                         </div>
                         <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${cls.class_type === 'No-Gi' ? 'bg-accent-primary/10 text-accent-primary border-accent-primary/20' : 'bg-white/10 text-white border-white/10'}`}>
                            {cls.class_type}
                         </div>
                      </div>
                      <div className="flex items-center gap-6 text-[10px] font-black text-[#A1A1AA] uppercase tracking-[0.1em] pt-4 border-t border-white/5">
                         <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-accent-primary" />
                            {cls.time_start} - {cls.time_end}
                         </div>
                         <div className="flex items-center gap-2">
                            <MapPin className="w-3.5 h-3.5 text-accent-primary" />
                            {cls.mat_name}
                         </div>
                      </div>
                   </div>
                 )) : (
                    <div className="col-span-full py-10 bg-surface-900/50 border border-dashed border-white/10 rounded-3xl text-center">
                       <p className="text-[10px] font-black text-[#A1A1AA] uppercase tracking-[0.2em] italic opacity-30">Nenhuma aula cadastrada</p>
                    </div>
                 )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
