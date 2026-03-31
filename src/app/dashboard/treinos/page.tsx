'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Calendar, Clock, Award, PlayCircle, Plus, Search, ChevronRight, ChevronLeft, MapPin, Users, Zap, CheckCircle2, X, CopyPlus, FilePlus } from 'lucide-react'

export default function TrainingPage() {
  const [currentWeek] = useState('Semana 12: Fundamentos de Guarda')
  const [activeTab, setActiveTab] = useState('wod')
  const [isNewTrainingModalOpen, setIsNewTrainingModalOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<{title: string, url: string} | null>(null)

  const [lessons] = useState([
    { id: 1, title: 'Raspagem de Gancho (Hook Sweep)', level: 'Básico', type: 'Técnica Principal', duration: '20 min', instructor: 'Mestre Julio', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    { id: 2, title: 'Passagem de Meia Guarda Profunda', level: 'Avançado', type: 'Técnica Principal', duration: '25 min', instructor: 'Prof. Marcos Freitas', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    { id: 3, title: 'Drills de Movimentação Lateral', level: 'Todos os Níveis', type: 'Drill/Aquecimento', duration: '15 min', instructor: 'Equipe Técnica', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  ])

  return (
    <div className="p-10 space-y-8 animate-fade-up relative min-h-screen">
      {/* Video Player Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedVideo(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-surface-800 rounded-[3rem] shadow-2xl overflow-hidden z-10"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-xl font-display font-black text-text-primary uppercase italic tracking-tighter">{selectedVideo.title}</h3>
                <button 
                  onClick={() => setSelectedVideo(null)} 
                  className="p-3 rounded-full bg-surface-900 text-text-muted hover:text-text-primary transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="aspect-video bg-black">
                <iframe 
                  className="w-full h-full"
                  src={selectedVideo.url}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* New Training Modal */}
      <AnimatePresence>
        {isNewTrainingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNewTrainingModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-surface-800 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden p-8"
            >
              <button 
                onClick={() => setIsNewTrainingModalOpen(false)} 
                className="absolute top-6 right-6 p-2 rounded-full bg-surface-700 text-text-muted hover:text-text-primary transition-all z-10"
              >
                <X className="w-5 h-5" />
              </button>

              <h2 className="text-3xl font-display font-black text-text-primary mb-2">Novo Treino</h2>
              <p className="text-text-secondary mb-8">Como você deseja montar o cronograma desta semana?</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group p-6 rounded-3xl bg-surface-900 border border-white/5 hover:border-accent-primary transition-all cursor-pointer relative overflow-hidden">
                  <div className="w-14 h-14 rounded-2xl bg-surface-800 flex items-center justify-center mb-6 group-hover:bg-accent-primary group-hover:text-surface-900 transition-all">
                    <CopyPlus className="w-6 h-6 text-accent-primary group-hover:text-surface-900" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-text-primary mb-2">Duplicar Anterior</h3>
                  <p className="text-sm text-text-muted">Copia toda a estrutura da semana passada.</p>
                </div>

                <div className="group p-6 rounded-3xl bg-surface-900 border border-white/5 hover:border-text-primary transition-all cursor-pointer relative overflow-hidden">
                  <div className="w-14 h-14 rounded-2xl bg-surface-800 flex items-center justify-center mb-6 group-hover:bg-text-primary group-hover:text-surface-900 transition-all">
                    <FilePlus className="w-6 h-6 text-text-secondary group-hover:text-surface-900" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-text-primary mb-2">Criar do Zero</h3>
                  <p className="text-sm text-text-muted">Começa com um quadro em branco.</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-black text-text-primary tracking-tight italic uppercase">Cronograma de Treinos</h1>
          <p className="text-text-muted font-bold mt-1 uppercase tracking-tighter opacity-60">Gestão de currículo técnico e planos de aula</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsNewTrainingModalOpen(true)}
            className="btn-primary flex items-center gap-3 bg-accent-primary text-surface-900 border-none px-8 py-4 rounded-2xl shadow-xl shadow-accent-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5" />
            <span className="font-black uppercase tracking-widest text-[10px]">Novo Treino</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-surface-700/50 rounded-2xl w-fit border border-white/5">
        <button 
          onClick={() => setActiveTab('wod')}
          className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            activeTab === 'wod' ? 'bg-accent-primary text-surface-900 shadow-lg' : 'text-text-muted hover:text-text-primary'
          }`}
        >
          Treino do Dia
        </button>
        <button 
          onClick={() => setActiveTab('library')}
          className={`px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            activeTab === 'library' ? 'bg-accent-primary text-surface-900 shadow-lg' : 'text-text-muted hover:text-text-primary'
          }`}
        >
          Biblioteca
        </button>
      </div>

      {activeTab === 'wod' ? (
        <div className="space-y-10">
          {/* Week Focus Bar */}
          <div className="accent-bg p-10 rounded-[3.5rem] shadow-2xl shadow-accent-primary/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-32 -mt-32 blur-[100px]" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
              <div className="flex items-center gap-6">
                 <div className="w-20 h-20 rounded-3xl bg-surface-900/10 flex items-center justify-center backdrop-blur-xl border border-white/10">
                    <BookOpen className="w-10 h-10 text-surface-900" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-surface-900/60 uppercase tracking-widest italic">Foco da Semana</p>
                    <h2 className="text-3xl font-display font-black text-surface-900 italic uppercase">{currentWeek}</h2>
                 </div>
              </div>
              <div className="flex items-center gap-8">
                 <div className="text-right">
                    <p className="text-[10px] font-black text-surface-900/60 uppercase tracking-widest">Atendimento Hoje</p>
                    <p className="text-2xl font-black text-surface-900 italic">12 Alunos</p>
                 </div>
                 <div className="w-px h-12 bg-surface-900/20" />
                 <button className="px-8 py-4 rounded-2xl bg-surface-900 text-accent-primary text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-black/20 active:scale-95">
                    Registrar Presença
                 </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
            <div className="xl:col-span-8 space-y-8">
              <div className="kpi-card !rounded-[3.5rem] p-10 bg-surface-800 border border-white/5 shadow-2xl">
                <h2 className="text-2xl font-display font-black text-text-primary mb-10 uppercase italic tracking-tighter">Grade Técnica</h2>
                <div className="space-y-6">
                  {lessons.map((lesson) => (
                    <div key={lesson.id} className="group p-8 rounded-[2.5rem] bg-surface-900/40 border border-white/5 hover:border-accent-primary/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden">
                      <div className="flex items-center gap-8 relative z-10">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-surface-800 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-primary transition-all shadow-xl border border-white/5 group-hover:scale-110">
                           <PlayCircle className="w-8 h-8 text-text-muted group-hover:text-surface-900" />
                        </div>
                        <div>
                           <div className="flex items-center gap-3 mb-2">
                              <span className={`text-[9px] font-black px-3 py-1 rounded-lg uppercase tracking-widest ${
                                lesson.level === 'Avançado' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20'
                              }`}>
                                {lesson.level}
                              </span>
                              <span className="text-[9px] font-black text-text-muted uppercase tracking-widest italic opacity-50">{lesson.type}</span>
                           </div>
                           <h4 className="text-xl font-display font-black text-text-primary uppercase italic tracking-tight">{lesson.title}</h4>
                           <div className="flex items-center gap-6 mt-2 text-text-muted text-[10px] font-black uppercase tracking-widest opacity-60">
                              <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-accent-primary"/> {lesson.duration}</span>
                              <span className="flex items-center gap-2"><Award className="w-4 h-4 text-accent-primary"/> {lesson.instructor}</span>
                           </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setSelectedVideo({ title: lesson.title, url: lesson.video })}
                        className="px-8 py-4 rounded-2xl bg-surface-800 text-text-primary text-[10px] font-black uppercase tracking-widest hover:bg-accent-primary hover:text-surface-900 transition-all relative z-10 shadow-xl border border-white/10 active:scale-95"
                      >
                         Ver Técnica
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="xl:col-span-4 space-y-8">
              <div className="kpi-card !rounded-[3rem] p-10 bg-surface-800 border border-white/5 shadow-2xl">
                <h3 className="text-xl font-display font-black text-text-primary mb-8 uppercase italic tracking-tighter">Grade do Dia</h3>
                <div className="space-y-4">
                   {[
                     { time: '18:00', class: 'Iniciantes', coach: 'Prof. Marcos', students: 12 },
                     { time: '19:30', class: 'Avançado (No-Gi)', coach: 'Prof. Marcos', students: 18 },
                     { time: '21:00', class: 'Open Mat', coach: 'Prof. Marcos', students: 8 },
                   ].map((c, i) => (
                     <div key={i} className="flex items-center justify-between p-5 rounded-[1.5rem] bg-surface-900 shadow-inner border border-white/5">
                        <div className="flex items-center gap-4">
                           <span className="text-sm font-black text-accent-primary italic">{c.time}</span>
                           <div>
                              <p className="text-xs font-black text-text-primary uppercase tracking-wider">{c.class}</p>
                              <p className="text-[10px] text-text-muted font-bold uppercase tracking-tighter">{c.coach}</p>
                           </div>
                        </div>
                        <div className="px-3 py-1 rounded-lg bg-surface-800 text-[10px] font-black text-text-muted flex items-center gap-2 border border-white/5">
                           <Users className="w-3 h-3" />
                           {c.students}
                        </div>
                     </div>
                   ))}
                </div>
              </div>

              <div className="kpi-card !rounded-[2.5rem] p-8 bg-accent-primary shadow-xl shadow-accent-primary/10 border-none group">
                 <div className="flex items-center gap-3 mb-4">
                    <Zap className="w-5 h-5 text-surface-900" />
                    <h3 className="text-lg font-display font-black text-surface-900 uppercase italic tracking-tighter">Anotações do Mestre</h3>
                 </div>
                  <p className="text-xs text-surface-900 font-bold leading-relaxed italic opacity-80">
                    &quot;Focar na distribuição de peso durante a raspagem. O gancho deve ser ativo e não deixar o colega pesar a perna esquerda.&quot;
                  </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {['Guarda Fechada', 'Meia Guarda', 'Passagem de Guarda', 'Montada', 'Costas', 'Finalizações'].map((cat, i) => (
            <div key={i} className="kpi-card !rounded-[3rem] p-10 group hover:border-accent-primary transition-all cursor-pointer bg-surface-800 shadow-2xl relative overflow-hidden">
               <div className="w-16 h-16 rounded-[1.5rem] bg-surface-900 flex items-center justify-center mb-8 group-hover:bg-accent-primary transition-all border border-white/5 shadow-xl group-hover:scale-110">
                  <PlayCircle className="w-8 h-8 text-text-muted group-hover:text-surface-900 transition-colors" />
               </div>
               <h4 className="text-2xl font-display font-black text-text-primary mb-2 uppercase italic tracking-tighter">{cat}</h4>
               <p className="text-[10px] text-text-muted font-black tracking-widest uppercase opacity-60">12 Aulas Gravadas</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
