'use client'

import { useApp } from '@/contexts/AppContext'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { BookOpen, Play, Star, Search, Plus, X, Loader2, PlayCircle, Clock, Award } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export default function TecnicasPage() {
  const { lang } = useApp()
  const [lessons, setLessons] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  
  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Guarda',
    level: 'Iniciante',
    youtube_id: '',
  })

  const categories = ['Guarda', 'Passagem', 'Montada', 'Costas', 'Quedas', 'Finalização']
  const levels = ['Iniciante', 'Intermediário', 'Avançado']

  const nivelColor: Record<string, string> = {
    'Iniciante': '#10B981', 'Intermediário': '#FFC700', 'Avançado': '#EF4444',
  }

  useEffect(() => {
    fetchLessons()
  }, [])

  async function fetchLessons() {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data: profile } = await supabase.from('profiles').select('tenant_id').eq('id', user.id).single()
      if (profile) {
        const { data } = await supabase.from('lessons').select('*').eq('tenant_id', profile.tenant_id).order('created_at', { ascending: false })
        if (data) setLessons(data)
      }
    }
    setLoading(false)
  }

  async function handleAddLesson(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    const { data: profile } = await supabase.from('profiles').select('tenant_id').eq('id', user!.id).single()

    // Helper: Extract YouTube ID from link
    let finalId = formData.youtube_id
    if (formData.youtube_id.includes('v=')) {
      finalId = formData.youtube_id.split('v=')[1].split('&')[0]
    } else if (formData.youtube_id.includes('youtu.be/')) {
      finalId = formData.youtube_id.split('youtu.be/')[1].split('?')[0]
    }

    const { error } = await supabase.from('lessons').insert([
      { ...formData, youtube_id: finalId, tenant_id: profile!.tenant_id }
    ])

    if (!error) {
      setIsModalOpen(false)
      setFormData({ title: '', category: 'Guarda', level: 'Iniciante', youtube_id: '' })
      fetchLessons()
    }
    setSaving(false)
  }

  return (
    <div className="min-h-screen bg-surface-900 pb-20">
      
      {/* Add Lesson Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-xl bg-surface-800 border border-white/10 rounded-[3rem] shadow-2xl p-10 overflow-visible">
               <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 rounded-full bg-surface-700 text-text-muted hover:text-text-primary transition-all">
                  <X className="w-5 h-5" />
               </button>
               
               <h2 className="text-3xl font-display font-black text-text-primary mb-2 italic uppercase tracking-tighter">Nova Técnica</h2>
               <p className="text-[10px] font-black text-[#A1A1AA] uppercase tracking-widest mb-10 opacity-60 italic">Cadastre um vídeo na biblioteca técnica</p>

               <form onSubmit={handleAddLesson} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#A1A1AA] uppercase tracking-widest ml-1">Título da Posição</label>
                    <input type="text" required placeholder="Ex: Raspagem de Gancho" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-surface-900 border border-white/5 rounded-2xl py-5 px-6 text-sm font-bold text-text-primary outline-none focus:border-accent-primary transition-all" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-[#A1A1AA] uppercase tracking-widest ml-1">Categoria</label>
                       <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-surface-900 border border-white/5 rounded-2xl py-4 px-4 text-sm font-bold text-text-primary outline-none focus:border-accent-primary">
                          {categories.map(c => <option key={c} value={c}>{c}</option>)}
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-[#A1A1AA] uppercase tracking-widest ml-1">Nível</label>
                       <select value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} className="w-full bg-surface-900 border border-white/5 rounded-2xl py-4 px-4 text-sm font-bold text-text-primary outline-none focus:border-accent-primary">
                          {levels.map(l => <option key={l} value={l}>{l}</option>)}
                       </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-[#A1A1AA] uppercase tracking-widest ml-1">Link do YouTube</label>
                    <input type="text" required placeholder="youtube.com/watch?v=..." value={formData.youtube_id} onChange={e => setFormData({...formData, youtube_id: e.target.value})} className="w-full bg-surface-900 border border-white/5 rounded-2xl py-5 px-6 text-sm font-bold text-text-primary outline-none focus:border-accent-primary transition-all" />
                  </div>

                  <button type="submit" disabled={saving} className="btn-primary w-full !rounded-2xl py-5 shadow-2xl mt-4 flex items-center justify-center gap-3">
                    {saving ? <Loader2 className="w-5 h-5 animate-spin text-black" /> : <span className="uppercase tracking-[0.3em] text-[10px] font-black text-black italic">Cadastrar na Biblioteca</span>}
                  </button>
               </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="px-10 py-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
        <div>
           <h1 className="text-4xl font-display font-black text-text-primary tracking-tight italic uppercase">Biblioteca Técnica</h1>
           <p className="text-[10px] text-[#A1A1AA] font-black uppercase tracking-widest mt-2 opacity-60 italic">Currículo Oficial de Faixas e Posições</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-4 bg-accent-primary text-black border-none px-8 py-4 rounded-2xl shadow-xl shadow-accent-primary/20 hover:scale-[1.02] transition-all font-black">
           <Plus className="w-5 h-5" />
           <span className="font-black uppercase tracking-widest text-[10px]">Nova Técnica</span>
        </button>
      </div>

      <div className="px-10 space-y-8 relative z-10">
        
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row items-center gap-4">
           <div className="flex items-center gap-3 bg-surface-800 border border-white/5 rounded-2xl px-6 py-4 flex-1 shadow-inner">
              <Search className="w-5 h-5 text-[#A1A1AA] opacity-40" />
              <input type="text" placeholder="Buscar técnica..." className="bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none w-full font-bold" />
           </div>
           <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 max-w-full">
              {['Todas', ...categories].map((pos, i) => (
                <button key={pos} className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border ${i === 0 ? 'bg-accent-primary text-black border-accent-primary' : 'bg-surface-800 text-[#A1A1AA] border-white/5 hover:border-accent-primary/30'}`}>
                  {pos}
                </button>
              ))}
           </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
           {loading ? (
             <div className="col-span-full py-20 flex flex-col items-center gap-4 opacity-50">
                <Loader2 className="w-10 h-10 animate-spin text-accent-primary" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Carregando Biblioteca...</span>
             </div>
           ) : lessons.length > 0 ? lessons.map((t, i) => (
             <div key={i} className="kpi-card group hover:border-accent-primary/50 cursor-pointer bg-surface-800 p-6 rounded-[2.5rem] !border-white/5 shadow-2xl transition-all">
                <div className="aspect-video bg-surface-900 rounded-[2rem] mb-6 relative overflow-hidden flex items-center justify-center border border-white/5">
                   <img 
                     src={`https://img.youtube.com/vi/${t.youtube_id}/maxresdefault.jpg`} 
                     alt={t.title} 
                     className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-500 scale-105 group-hover:scale-110" 
                   />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                   <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-accent-primary flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                         <PlayCircle className="w-8 h-8 text-black ml-1" />
                      </div>
                   </div>
                   <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between z-10 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
                      <span className="text-[9px] font-black text-white uppercase tracking-widest">{t.category}</span>
                      <span className="flex items-center gap-1.5 text-[9px] font-black text-accent-primary uppercase tracking-widest"><Play className="w-3 h-3"/> Aula Online</span>
                   </div>
                </div>
                
                <div className="flex items-start justify-between gap-4 px-2">
                   <div>
                      <h3 className="text-lg font-black text-text-primary uppercase tracking-tight italic group-hover:text-accent-primary transition-colors leading-tight line-clamp-1">{t.title}</h3>
                      <p className="text-[9px] text-[#A1A1AA] font-black uppercase tracking-[0.2em] mt-1 opacity-60">{t.category} • GFTeam Academy</p>
                   </div>
                   <span className="text-[9px] font-black px-3 py-1 rounded-full flex-shrink-0 border uppercase tracking-widest" style={{ color: nivelColor[t.level], borderColor: `${nivelColor[t.level]}40`, backgroundColor: `${nivelColor[t.level]}10` }}>
                      {t.level}
                   </span>
                </div>
             </div>
           )) : (
             <div className="col-span-full py-20 bg-surface-800/50 border border-dashed border-white/10 rounded-[3rem] text-center flex flex-col items-center gap-4">
                <BookOpen className="w-12 h-12 text-[#A1A1AA] opacity-10" />
                <p className="text-[10px] font-black text-[#A1A1AA] uppercase tracking-[0.3em] italic opacity-30">Biblioteca vazia • Adicione sua primeira técnica</p>
             </div>
           )}
        </div>
      </div>
    </div>
  )
}
