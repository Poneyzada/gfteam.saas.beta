'use client'

import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import { 
  Play, Clock, BookOpen, ChevronRight, Search, Plus, 
  CopyPlus, FilePlus, X, Award, Swords, Target, Dumbbell, Zap, Check,
  Trash2, ExternalLink, Filter, Save, LayoutGrid
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Lesson {
  id: string
  title: string
  category: string
  level: string
  youtubeUrl: string
  duration: string
}

interface TrainingPlan {
  id: string
  weekFocus: string
  lessons: Lesson[]
  notes: string
}

export default function CurriculoTecnicoPage() {
  const [activeTab, setActiveTab] = useState<'plan' | 'library'>('plan')
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  
  // Library State
  const [library, setLibrary] = useState<Lesson[]>([
    { id: '1', title: 'Passagem de Meia Emborrachada', category: 'Passagem', level: 'Todos', youtubeUrl: 'https://youtu.be/demo1', duration: '15:00' },
    { id: '2', title: 'Ataque de Costas via Lapela', category: 'Finalização', level: 'Avançado', youtubeUrl: 'https://youtu.be/demo2', duration: '10:00' }
  ])

  // Current Plan State
  const [currentPlan, setCurrentPlan] = useState<TrainingPlan>({
    id: 'plan-1',
    weekFocus: 'Exploração de Meia-Guarda e Antecipação',
    lessons: [],
    notes: 'Focar na pressão do ombro e controle do quadril oposto.'
  })

  // Form State for Adding to Library
  const [newLessonForm, setNewLessonForm] = useState({
    title: '',
    youtubeUrl: '',
    level: 'Todos',
    category: 'Técnica'
  })

  const handleAddToLibrary = () => {
    if (!newLessonForm.title) return
    const id = Math.random().toString(36).substr(2, 9)
    setLibrary([...library, { ...newLessonForm, id, duration: '10:00' }])
    setNewLessonForm({ title: '', youtubeUrl: '', level: 'Todos', category: 'Técnica' })
    alert('Vídeo adicionado ao acervo com sucesso!')
  }

  const addLessonToPlan = (lesson: Lesson) => {
    if (currentPlan.lessons.find(l => l.id === lesson.id)) return
    setCurrentPlan({
      ...currentPlan,
      lessons: [...currentPlan.lessons, lesson]
    })
  }

  const removeLessonFromPlan = (id: string) => {
    setCurrentPlan({
      ...currentPlan,
      lessons: currentPlan.lessons.filter(l => l.id !== id)
    })
  }

  return (
    <div className="min-h-screen bg-surface-900 pb-40 text-left relative z-[1] selection:bg-accent-primary selection:text-black">
      
      {/* FULL SCREEN PLAN BUILDER EDITOR */}
      <AnimatePresence>
        {isEditorOpen && (
          <div className="fixed inset-0 z-[50000] bg-surface-900 overflow-y-auto">
             <div className="max-w-7xl mx-auto p-6 md:p-12 space-y-12">
                <div className="flex items-center justify-between">
                   <div>
                      <h2 className="text-4xl font-display font-black text-text-primary uppercase italic tracking-tighter leading-none mb-2">Construtor de <br/><span className="text-accent-primary italic">Plano de Aula</span></h2>
                      <p className="text-[11px] text-text-muted font-black uppercase tracking-[0.4em] opacity-40">Assembleia de técnicas para o QG</p>
                   </div>
                   <button 
                    onClick={() => setIsEditorOpen(false)}
                    className="w-16 h-16 rounded-full bg-surface-800 border border-white/5 flex items-center justify-center text-text-muted hover:text-white transition-all shadow-2xl active:scale-95"
                   >
                     <X className="w-8 h-8" />
                   </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                   {/* Left: Plan Preview */}
                   <div className="lg:col-span-7 space-y-8">
                      <div className="p-10 bg-surface-800 rounded-[3rem] border border-white/5 shadow-2xl space-y-8">
                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-accent-primary uppercase tracking-[0.2em] italic">Foco da Semana / Título do Plano</label>
                            <input 
                              type="text" 
                              value={currentPlan.weekFocus}
                              onChange={(e) => setCurrentPlan({...currentPlan, weekFocus: e.target.value})}
                              className="w-full bg-surface-900 border border-white/5 rounded-2xl px-6 py-5 text-2xl font-display font-black text-text-primary outline-none focus:border-accent-primary shadow-inner uppercase italic"
                            />
                         </div>

                         <div className="space-y-4">
                            <label className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">Técnicas Selecionadas ({currentPlan.lessons.length})</label>
                            <div className="space-y-4">
                               {currentPlan.lessons.length === 0 ? (
                                 <div className="py-20 border-2 border-dashed border-white/5 rounded-[2rem] flex flex-col items-center justify-center opacity-20 italic text-[11px] font-black uppercase tracking-widest text-text-muted">Selecione vídeos da biblioteca à direita</div>
                               ) : currentPlan.lessons.map((l, i) => (
                                 <div key={l.id} className="flex items-center justify-between p-6 bg-surface-900 border border-white/5 rounded-2xl group shadow-lg">
                                    <div className="flex items-center gap-6">
                                       <span className="text-2xl font-display font-black text-accent-primary opacity-20">0{i+1}</span>
                                       <div>
                                          <p className="text-sm font-black text-text-primary uppercase italic leading-none mb-2">{l.title}</p>
                                          <p className="text-[9px] font-black text-text-muted uppercase tracking-widest opacity-40">{l.category} • {l.level}</p>
                                       </div>
                                    </div>
                                    <button onClick={() => removeLessonFromPlan(l.id)} className="w-10 h-10 rounded-xl bg-surface-800 text-text-muted hover:text-red-500 flex items-center justify-center"><Trash2 className="w-5 h-5" /></button>
                                 </div>
                               ))}
                            </div>
                         </div>
                         
                         <button onClick={() => { setIsEditorOpen(false); alert('Plano de Aula Publicado no QG!'); }} className="w-full py-6 bg-accent-primary text-black rounded-[2rem] font-black uppercase tracking-[0.3em] shadow-2xl shadow-accent-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-4">
                            <Save className="w-6 h-6" /> PUBLICAR E SALVAR PLANO
                         </button>
                      </div>
                   </div>

                   {/* Right: Library Selector */}
                   <div className="lg:col-span-5 space-y-6">
                      <div className="p-8 bg-surface-800 rounded-[3rem] border border-white/5 shadow-2xl flex flex-col h-full overflow-hidden">
                         <h3 className="text-xl font-display font-black text-text-primary uppercase italic tracking-tighter mb-6">Acervo de Vídeos</h3>
                         <div className="relative mb-6">
                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted opacity-40" />
                            <input type="text" placeholder="Buscar no acervo..." className="w-full bg-surface-900 border border-white/5 rounded-xl pl-14 pr-6 py-4 text-xs font-bold text-text-primary outline-none" />
                         </div>
                         <div className="space-y-3 overflow-y-auto max-h-[500px] pr-2 custom-scrollbar">
                            {library.map(l => (
                              <button 
                                key={l.id}
                                onClick={() => addLessonToPlan(l)}
                                className={`w-full p-5 rounded-2xl border text-left transition-all flex items-center justify-between group h-24 ${currentPlan.lessons.find(lp => lp.id === l.id) ? 'bg-accent-primary/5 border-accent-primary' : 'bg-surface-900 border-white/10 hover:border-accent-primary/40'}`}
                              >
                                 <div>
                                    <p className="text-xs font-black text-text-primary uppercase italic leading-none mb-1">{l.title}</p>
                                    <p className="text-[8px] font-black text-text-muted uppercase tracking-widest opacity-40">{l.category}</p>
                                 </div>
                                 <div className="w-10 h-10 rounded-full bg-surface-800 border border-white/5 flex items-center justify-center group-hover:bg-accent-primary transition-all">
                                    {currentPlan.lessons.find(lp => lp.id === l.id) ? <Check className="w-5 h-5 text-accent-primary" /> : <Plus className="w-5 h-5 text-text-muted group-hover:text-black" />}
                                 </div>
                              </button>
                            ))}
                         </div>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        )}
      </AnimatePresence>

      <div className="p-6 md:p-12 space-y-12 animate-fade-in text-left">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="text-left">
            <h1 className="text-5xl md:text-7xl font-display font-black text-text-primary tracking-tighter italic uppercase leading-none mb-4">Plano de <br /><span className="text-accent-primary italic tracking-tight">Aula</span></h1>
            <p className="text-[11px] text-text-muted font-black uppercase tracking-[0.4em] opacity-40">Engenharia de treinamento para o tatame</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => { setCurrentPlan({...currentPlan, id: Math.random().toString(), lessons: []}); setIsEditorOpen(true); }}
              className="px-10 py-6 bg-accent-primary text-black rounded-[2.5rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-accent-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-4 cursor-pointer"
            >
              <FilePlus className="w-7 h-7 stroke-[3]" /> NOVO PLANO (DO ZERO)
            </button>
          </div>
        </div>

        {/* Library Input Section */}
        <div className="kpi-card !rounded-[3.5rem] p-10 md:p-14 bg-surface-800 border border-white/5 shadow-2xl space-y-10">
           <div className="flex items-center gap-4">
              <BookOpen className="w-7 h-7 text-accent-primary" />
              <h2 className="text-2xl font-display font-black text-text-primary uppercase italic tracking-tighter">Acervo de Conhecimento</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
              <div className="md:col-span-5 space-y-3">
                 <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-2 opacity-60">Título da Técnica/Vídeo</label>
                 <input 
                  type="text" 
                  value={newLessonForm.title}
                  onChange={(e) => setNewLessonForm({...newLessonForm, title: e.target.value})}
                  className="w-full bg-surface-900 border border-white/5 rounded-2xl px-6 py-5 text-sm font-bold text-text-primary outline-none focus:border-accent-primary shadow-inner" 
                  placeholder="Ex: Passagem de Guarda..." 
                 />
              </div>
              <div className="md:col-span-5 space-y-3">
                 <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-2 opacity-60">Link do YouTube/Vimeo</label>
                 <input 
                  type="text" 
                  value={newLessonForm.youtubeUrl}
                  onChange={(e) => setNewLessonForm({...newLessonForm, youtubeUrl: e.target.value})}
                  className="w-full bg-surface-900 border border-white/5 rounded-2xl px-6 py-5 text-xs font-mono text-accent-primary outline-none focus:border-accent-primary shadow-inner italic" 
                  placeholder="https://youtube.com/..." 
                 />
              </div>
              <div className="md:col-span-2">
                 <button onClick={handleAddToLibrary} className="w-full h-[64px] bg-surface-700 text-text-primary border border-white/5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-accent-primary hover:text-black transition-all active:scale-95 flex items-center justify-center gap-3">
                    ADD <Plus className="w-4 h-4" />
                 </button>
              </div>
           </div>
        </div>

        {/* Integration Row: Current Lessons & Unified Agenda */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
           {/* Current Live Plan View */}
           <div className="xl:col-span-8 space-y-8">
              <div className="flex items-center justify-between ml-4">
                 <p className="text-[11px] font-black text-text-muted uppercase tracking-[0.4em] opacity-40 italic">Plano de Aula Vigente</p>
                 <button onClick={() => setIsEditorOpen(true)} className="text-[10px] font-black text-accent-primary uppercase tracking-widest flex items-center gap-2 hover:opacity-100 transition-opacity">EDITAR PLANO <ChevronRight className="w-4 h-4" /></button>
              </div>
              <div className="p-10 md:p-14 bg-accent-primary rounded-[4rem] shadow-2xl relative overflow-hidden hatched text-black">
                 <div className="relative z-10 space-y-8">
                    <div className="space-y-3 text-left">
                       <p className="text-[11px] font-black text-black/40 uppercase tracking-[0.2em] italic">Foco Estratégico do Tatame</p>
                       <h2 className="text-4xl md:text-6xl font-display font-black uppercase italic tracking-tighter leading-none mb-6">{currentPlan.weekFocus}</h2>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {currentPlan.lessons.slice(0, 2).map((l, i) => (
                         <div key={l.id} className="p-6 bg-black/10 backdrop-blur-xl border border-black/5 rounded-3xl flex items-center gap-6 group hover:bg-black/20 transition-all cursor-pointer">
                            <div className="w-14 h-14 rounded-[1.2rem] bg-black flex items-center justify-center text-accent-primary shadow-2xl shadow-black/30 group-hover:scale-110 transition-transform">
                               <Play className="w-6 h-6 fill-current ml-1" />
                            </div>
                            <div>
                               <p className="text-sm font-black uppercase italic leading-none mb-2">{l.title}</p>
                               <span className="text-[9px] font-bold text-black/50 uppercase tracking-widest">{l.duration} • {l.category}</span>
                            </div>
                         </div>
                       ))}
                       {currentPlan.lessons.length > 2 && (
                         <div className="p-6 border-2 border-dashed border-black/10 rounded-3xl flex items-center justify-center italic text-[10px] font-black uppercase tracking-widest text-black/30">+{currentPlan.lessons.length - 2} técnicas no roteiro</div>
                       )}
                       {currentPlan.lessons.length === 0 && (
                         <div onClick={() => setIsEditorOpen(true)} className="p-8 border-2 border-dashed border-black/20 rounded-3xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-black/5 transition-all">
                            <Plus className="w-6 h-6 opacity-40" />
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-40 leading-none">Vincular técnicas ao plano</p>
                         </div>
                       )}
                    </div>
                 </div>
              </div>
           </div>

           {/* Agenda Local Unified - The "Bridge" the user wanted */}
           <div className="xl:col-span-4 space-y-8">
              <div className="flex items-center gap-3 ml-4">
                 <Clock className="w-5 h-5 text-accent-primary" />
                 <p className="text-[11px] font-black text-text-muted uppercase tracking-[0.4em] opacity-40 italic text-left">Aulas Utilizando este Plano</p>
              </div>
              <div className="p-8 bg-surface-800 border border-white/5 rounded-[3.2rem] shadow-2xl space-y-6">
                 {[
                   { time: '18:00', name: 'Adulto Iniciante', prof: 'Prof. Rafael' },
                   { time: '19:30', name: 'Adulto Avançado', prof: 'Prof. Marcus' }
                 ].map((cls, i) => (
                   <div key={i} className="flex items-center justify-between p-6 rounded-2xl bg-surface-900 border border-white/5 hover:border-accent-primary/20 transition-all group">
                      <div className="text-left">
                         <p className="text-sm font-black text-text-primary uppercase tracking-tighter italic mb-1 leading-none">{cls.name}</p>
                         <p className="text-[9px] font-black text-text-muted uppercase tracking-widest opacity-40">{cls.prof}</p>
                      </div>
                      <div className="text-right">
                         <p className="text-xl font-display font-black text-accent-primary italic tracking-tight">{cls.time}</p>
                         <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest opacity-60 flex items-center gap-1 justify-end">SYNC <Check className="w-3 h-3" /></p>
                      </div>
                   </div>
                 ))}
                 <button 
                  onClick={() => window.location.href='/dashboard/cronograma'}
                  className="w-full mt-6 py-6 border-2 border-dashed border-white/10 rounded-2xl text-[10px] font-black text-text-muted uppercase tracking-[0.4em] hover:text-accent-primary transition-all flex items-center justify-center gap-4 active:scale-95 italic"
                 >
                   VER TODA AGENDA LOCAL
                 </button>
              </div>
           </div>
        </div>

      </div>
    </div>
  )
}

