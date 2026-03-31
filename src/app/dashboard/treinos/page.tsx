'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Calendar, Clock, Award, PlayCircle, Plus, Search, ChevronRight, ChevronLeft, MapPin, Users, Zap, CheckCircle2, X, CopyPlus, FilePlus, Loader2 } from 'lucide-react'

export default function TrainingPage() {
  const [plans, setPlans] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('wod')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState<{title: string, url: string} | null>(null)

  // Form State
  const [formData, setFormData] = useState({
    week_focus: '',
    notes: '',
  })

  useEffect(() => {
    fetchPlans()
  }, [])

  async function fetchPlans() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('tenant_id').eq('id', user.id).single()
      if (profile) {
        const { data } = await supabase.from('training_plans').select('*').eq('tenant_id', profile.tenant_id).order('created_at', { ascending: false })
        if (data) setPlans(data)
      }
    }
    setLoading(false)
  }

  async function handleAddPlan(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase.from('profiles').select('tenant_id').eq('id', user!.id).single()

    const { error } = await supabase.from('training_plans').insert([
      { ...formData, tenant_id: profile!.tenant_id }
    ])

    if (!error) {
      setIsModalOpen(false)
      setFormData({ week_focus: '', notes: '' })
      fetchPlans()
    }
    setSaving(false)
  }

  const currentPlan = plans[0] || { week_focus: 'Sem Foco Definido', notes: 'Nenhuma anotação para esta semana.' }

  return (
    <div className="p-10 space-y-10 animate-fade-up relative min-h-screen pb-20">
      
      {/* Video Player Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedVideo(null)} className="absolute inset-0 bg-black/95 backdrop-blur-xl" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="relative w-full max-w-4xl bg-surface-800 rounded-[3rem] shadow-2xl overflow-hidden z-10">
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-xl font-display font-black text-white uppercase italic tracking-tighter">{selectedVideo.title}</h3>
                <button onClick={() => setSelectedVideo(null)} className="p-3 rounded-full bg-surface-900 text-[#A1A1AA] hover:text-white transition-all">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="aspect-video bg-black">
                <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${selectedVideo.url}`} title={selectedVideo.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* New training Plan Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-xl bg-surface-800 border border-white/10 rounded-[3rem] shadow-2xl p-10 overflow-visible">
               <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 rounded-full bg-surface-700 text-text-muted hover:text-text-primary transition-all">
                  <X className="w-5 h-5" />
               </button>
               
               <h2 className="text-3xl font-display font-black text-text-primary mb-2 italic uppercase tracking-tighter">Novo Plano Semanal</h2>
               <p className="text-[10px] font-black text-[#A1A1AA] uppercase tracking-widest mb-10 opacity-60 italic">Planeje o foco técnico da sua academia</p>

               <form onSubmit={handleAddPlan} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#A1A1AA] uppercase tracking-widest ml-1">Foco da Semana</label>
                    <input type="text" required placeholder="Ex: Fundamentos de Guarda De La Riva" value={formData.week_focus} onChange={e => setFormData({...formData, week_focus: e.target.value})} className="w-full bg-surface-900 border border-white/5 rounded-2xl py-5 px-6 text-sm font-bold text-text-primary outline-none focus:border-accent-primary transition-all" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#A1A1AA] uppercase tracking-widest ml-1">Anotações do Mestre</label>
                    <textarea rows={4} placeholder="Dicas para os professores sobre as raspagens..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className="w-full bg-surface-900 border border-white/5 rounded-2xl py-5 px-6 text-sm font-bold text-text-primary outline-none focus:border-accent-primary transition-all resize-none" />
                  </div>

                  <button type="submit" disabled={saving} className="btn-primary w-full !rounded-2xl py-5 shadow-2xl mt-4 flex items-center justify-center gap-3">
                    {saving ? <Loader2 className="w-5 h-5 animate-spin text-black" /> : <span className="uppercase tracking-[0.3em] text-[10px] font-black text-black italic">Publicar Planejamento</span>}
                  </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-4xl font-display font-black text-white tracking-tight italic uppercase">Plano de Treino Semanal</h1>
           <p className="text-[10px] text-[#A1A1AA] font-black uppercase tracking-widest mt-2 opacity-60 italic">Gestão de Currículo Técnico e Focos Estratégicos</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-4 bg-accent-primary text-black border-none px-8 py-4 rounded-2xl shadow-xl shadow-accent-primary/20 hover:scale-[1.02] transition-all font-black">
           <Plus className="w-5 h-5" />
           <span className="font-black uppercase tracking-widest text-[10px]">Novo Foco</span>
        </button>
      </div>

      {/* Active Plan Focus Bar */}
      <div className="accent-bg p-12 rounded-[4rem] shadow-2xl shadow-accent-primary/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-[100px]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="flex items-center gap-8">
             <div className="w-24 h-24 rounded-[2.5rem] bg-black/10 flex items-center justify-center backdrop-blur-xl border border-white/10">
                <BookOpen className="w-10 h-10 text-black" />
             </div>
             <div>
                <p className="text-[10px] font-black text-black/60 uppercase tracking-widest italic mb-1">FOCO ATIVO DA SEMANA</p>
                <h2 className="text-4xl font-display font-black text-black italic uppercase tracking-tighter leading-none">{currentPlan.week_focus}</h2>
             </div>
          </div>
          <div className="flex items-center gap-10">
             <div className="text-right">
                <p className="text-[10px] font-black text-black/60 uppercase tracking-widest">Postado em</p>
                <p className="text-xl font-black text-black italic">{currentPlan.created_at ? new Date(currentPlan.created_at).toLocaleDateString() : 'Hoje'}</p>
             </div>
             <div className="w-px h-16 bg-black/10" />
             <button className="px-10 py-5 rounded-2xl bg-black text-accent-primary text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-2xl active:scale-95">
                Imprimir Grade Técnica
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
         
         {/* Training Grid */}
         <div className="xl:col-span-8 space-y-10">
            <div className="kpi-card !p-12 !rounded-[3.5rem] bg-surface-800 border-white/5 shadow-2xl">
               <h3 className="text-2xl font-display font-black text-white italic uppercase tracking-tighter mb-10">Anotações Estratégicas do Mestre</h3>
               <div className="p-10 rounded-[2.5rem] bg-surface-900/60 border border-white/5 relative">
                  <Zap className="absolute top-8 right-8 w-6 h-6 text-accent-primary opacity-20" />
                  <p className="text-lg font-black text-[#A1A1AA] italic leading-relaxed uppercase tracking-tight">
                    &quot;{currentPlan.notes}&quot;
                  </p>
               </div>
            </div>
         </div>

         {/* Side Stats/Info */}
         <div className="xl:col-span-4 space-y-10">
            <div className="kpi-card !p-10 !rounded-[3rem] bg-surface-800 border-white/5 shadow-2xl">
               <h3 className="text-xl font-display font-black text-white italic uppercase tracking-tighter mb-8">Status do Currículo</h3>
               <div className="space-y-6">
                  {[
                    { label: 'Técnicas Gravadas', value: '42', color: 'text-emerald-400' },
                    { label: 'Aulas na Semana', value: '18', color: 'text-accent-primary' },
                    { label: 'Alunos Online', value: '09', color: 'text-blue-400' },
                  ].map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-5 rounded-2xl bg-surface-900/40 border border-white/5">
                       <span className="text-[10px] font-black text-[#A1A1AA] uppercase tracking-widest">{s.label}</span>
                       <span className={`text-xl font-black italic ${s.color}`}>{s.value}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>

      </div>
    </div>
  )
}
