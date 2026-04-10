'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, Calendar, Clock, Award, PlayCircle, Plus, 
  Search, ChevronRight, ChevronLeft, MapPin, Users, 
  Zap, CheckCircle2, X, CopyPlus, FilePlus, Megaphone,
  Phone, Send
} from 'lucide-react'

export default function TrainingPage() {
  const [currentWeek, setCurrentWeek] = useState('Semana 12: Fundamentos de Guarda')
  const [activeTab, setActiveTab] = useState('wod')
  const [isNewTrainingModalOpen, setIsNewTrainingModalOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<{title: string, url: string} | null>(null)

  const [lessons, setLessons] = useState([
    { id: 1, title: 'Raspagem de Gancho (Hook Sweep)', level: 'Básico', type: 'Técnica Principal', duration: '20 min', instructor: 'Mestre Julio', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    { id: 2, title: 'Passagem de Meia Guarda Profunda', level: 'Avançado', type: 'Técnica Principal', duration: '25 min', instructor: 'Prof. Marcos Freitas', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    { id: 3, title: 'Drills de Movimentação Lateral', level: 'Todos os Níveis', type: 'Drill/Aquecimento', duration: '15 min', instructor: 'Equipe Técnica', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  ])

  const handleCreateNew = () => {
    setLessons([])
    setCurrentWeek('Nova Semana: Defina o Foco')
    setIsNewTrainingModalOpen(false)
    alert('Novo cronograma em branco criado! 🥋🏗️')
  }

  const handleDuplicate = () => {
    setLessons([...lessons])
    setIsNewTrainingModalOpen(false)
    alert('Cronograma anterior duplicado com sucesso! 🥋📋')
  }

  return (
    <div className="p-4 md:p-10 space-y-8 relative min-h-screen pb-32 z-30 pointer-events-auto">
      {/* Video Player Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl pointer-events-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-surface-800 rounded-[3rem] shadow-2xl overflow-hidden border border-white/5 flex flex-col pointer-events-auto"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between pointer-events-auto">
                <h3 className="text-xl font-display font-black text-text-primary uppercase italic tracking-tighter">{selectedVideo.title}</h3>
                <button 
                  onClick={() => setSelectedVideo(null)} 
                  className="p-4 rounded-full bg-surface-900 text-text-muted hover:text-white transition-all border border-white/5 pointer-events-auto z-50 shadow-xl"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="aspect-video bg-black relative z-10">
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
          <div className="fixed inset-0 z-[10000] flex items-start md:items-center justify-center p-4 bg-black/90 backdrop-blur-3xl overflow-y-auto pointer-events-auto shadow-inner">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-2xl bg-surface-800 border border-white/10 rounded-[3.5rem] shadow-[0_0_100px_rgba(0,0,0,1)] p-10 my-auto pointer-events-auto"
            >
              <button 
                onClick={() => setIsNewTrainingModalOpen(false)} 
                className="absolute top-8 right-8 p-3 rounded-full bg-surface-700 text-text-muted hover:text-white transition-all z-50 border border-white/10 shadow-xl pointer-events-auto"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-3xl font-display font-black text-text-primary mb-2 uppercase italic text-left tracking-tighter leading-none">Gestão de Cronograma</h2>
              <p className="text-text-muted mb-10 text-[11px] uppercase tracking-widest font-black opacity-60 text-left">Como você deseja iniciar o ciclo de treinamento?</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-4">
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleDuplicate(); }}
                  className="group p-10 rounded-[2.5rem] bg-surface-900 border border-white/5 hover:border-accent-primary transition-all cursor-pointer relative overflow-hidden active:scale-95 pointer-events-auto hover:bg-surface-800 text-left shadow-2xl flex flex-col justify-between min-h-[220px]"
                >
                  <div className="w-16 h-16 rounded-2xl bg-surface-800 flex items-center justify-center mb-6 group-hover:bg-accent-primary transition-all border border-white/5 shadow-inner">
                    <CopyPlus className="w-8 h-8 text-accent-primary group-hover:text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-black text-text-primary mb-3 uppercase italic tracking-tighter leading-tight">Duplicar <br />Anterior</h3>
                    <p className="text-[10px] text-text-muted font-black opacity-40 uppercase tracking-widest">Copia toda a estrutura da semana anterior.</p>
                  </div>
                </button>
 
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleCreateNew(); }}
                  className="group p-10 rounded-[2.5rem] bg-surface-900 border border-white/5 hover:border-accent-primary transition-all cursor-pointer relative overflow-hidden active:scale-95 pointer-events-auto hover:bg-surface-800 text-left shadow-2xl flex flex-col justify-between min-h-[220px]"
                >
                  <div className="w-16 h-16 rounded-2xl bg-surface-800 flex items-center justify-center mb-6 group-hover:bg-accent-primary transition-all border border-white/5 shadow-inner">
                    <FilePlus className="w-8 h-8 text-text-muted group-hover:text-black" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-black text-text-primary mb-3 uppercase italic tracking-tighter leading-tight">Criar <br />do Zero</h3>
                    <p className="text-[10px] text-text-muted font-black opacity-40 uppercase tracking-widest">Inicia um quadro tático totalmente em branco.</p>
                  </div>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 relative z-30 pointer-events-auto">
        <div className="text-left">
          <h1 className="text-4xl md:text-6xl font-display font-black text-text-primary tracking-tighter italic uppercase leading-none mb-4">Cronograma <br /><span className="text-accent-primary italic">de Treinos</span></h1>
          <p className="text-[11px] text-text-muted font-black uppercase tracking-[0.4em] opacity-40">Engenharia de currículo tático G.F.T</p>
        </div>
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsNewTrainingModalOpen(true); }}
          className="px-10 py-5 bg-accent-primary text-black rounded-[2rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-accent-primary/20 hover:scale-105 active:scale-95 transition-all border-none relative z-40 pointer-events-auto flex items-center gap-4"
        >
          <Plus className="w-7 h-7 stroke-[3]" />
          <span>Novo Treino</span>
        </button>
      </div>

      {/* Tabs Controller */}
      <div className="flex items-center gap-3 p-2 bg-surface-700/50 backdrop-blur-3xl rounded-[2rem] w-full md:w-fit border border-white/5 relative z-40 pointer-events-auto shadow-2xl overflow-x-auto scrollbar-hide">
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveTab('wod'); }}
          className={`flex-1 md:flex-none px-10 py-5 rounded-[1.8rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all relative z-10 pointer-events-auto cursor-pointer ${
            activeTab === 'wod' ? 'bg-accent-primary text-black dark:text-black shadow-xl' : 'text-text-muted hover:text-text-primary dark:text-text-muted/60'
          }`}
        >
          Treino do Dia
        </button>
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveTab('library'); }}
          className={`flex-1 md:flex-none px-10 py-5 rounded-[1.8rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all relative z-10 pointer-events-auto cursor-pointer ${
            activeTab === 'library' ? 'bg-accent-primary text-black dark:text-black shadow-xl' : 'text-text-muted hover:text-text-primary dark:text-text-muted/60'
          }`}
        >
          Biblioteca Técnica
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
           key={activeTab}
           initial={{ opacity: 0, y: 15 }}
           animate={{ opacity: 1, y: 0 }}
           exit={{ opacity: 0, y: -15 }}
           transition={{ duration: 0.2 }}
           className="relative z-30 pointer-events-auto"
        >
          {activeTab === 'wod' ? (
            <div className="space-y-12 animate-fade-in text-left pointer-events-auto">
              {/* Highlight Hero */}
              <div className="accent-bg p-10 md:p-16 rounded-[4rem] shadow-2xl shadow-accent-primary/20 relative overflow-hidden hatched pointer-events-auto">
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                  <div className="flex items-center gap-10 text-left">
                     <div className="w-20 h-20 md:w-32 md:h-32 rounded-3xl md:rounded-[3rem] bg-surface-900/10 flex items-center justify-center backdrop-blur-2xl border border-surface-900/10 shadow-inner">
                        <BookOpen className="w-10 h-10 md:w-16 md:h-16 text-surface-900" />
                     </div>
                     <div className="text-left">
                        <p className="text-[11px] font-black text-surface-900/60 uppercase tracking-[0.3em] italic mb-2">Foco Tático da Semana</p>
                        <h2 className="text-3xl md:text-5xl font-display font-black text-surface-900 italic uppercase tracking-tighter leading-none">{currentWeek}</h2>
                     </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-12 border-t border-surface-900/10 pt-10 lg:border-t-0 lg:pt-0">
                     <div className="text-right">
                        <p className="text-[11px] font-black text-surface-900/60 uppercase tracking-widest">Matriculados Hoje</p>
                        <p className="text-3xl md:text-5xl font-black text-surface-900 italic uppercase tracking-tighter">12 Elite</p>
                     </div>
                     <button className="px-10 py-6 rounded-[2rem] bg-surface-900 text-accent-primary text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-black/40 hover:scale-105 active:scale-95 transition-all pointer-events-auto">
                        Chamada Ativa
                     </button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 pointer-events-auto">
                {/* Lesson List */}
                <div className="xl:col-span-8 space-y-12">
                  <div className="kpi-card !rounded-[3.5rem] p-10 md:p-14 bg-surface-800 border border-white/5 shadow-2xl text-left pointer-events-auto">
                    <h2 className="text-3xl font-display font-black text-text-primary mb-12 uppercase italic tracking-tighter flex items-center gap-5">Grade de Treino do Dia <span className="text-[10px] bg-accent-primary/10 text-accent-primary px-4 py-1.5 rounded-xl border border-accent-primary/20">ESTRATEGISTA</span></h2>
                    <div className="space-y-8">
                      {lessons.length === 0 ? (
                        <div className="py-32 text-center text-[12px] font-black uppercase text-text-muted opacity-30 italic tracking-[0.4em]">Nenhum plano traçado para hoje...</div>
                      ) : lessons.map((lesson) => (
                        <div key={lesson.id} className="group p-8 md:p-12 rounded-[3.5rem] bg-surface-900 border border-white/5 hover:border-accent-primary/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-10 relative overflow-hidden shadow-2xl pointer-events-auto">
                          <div className="flex items-center gap-10 relative z-10 text-left pointer-events-auto">
                            <button 
                              onClick={() => setSelectedVideo({ title: lesson.title, url: lesson.video })}
                              className="w-20 h-20 md:w-28 md:h-28 rounded-[2.5rem] bg-surface-800 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-primary transition-all border border-white/5 shadow-xl group-hover:scale-110 active:scale-90 pointer-events-auto"
                            >
                               <PlayCircle className="w-10 h-10 md:w-14 md:h-14 text-text-muted group-hover:text-black stroke-[1.5]" />
                            </button>
                            <div className="text-left">
                               <div className="flex items-center gap-4 mb-4">
                                  <span className={`text-[10px] font-black px-4 py-1.5 rounded-xl uppercase tracking-widest shadow-lg ${
                                    lesson.level === 'Avançado' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-accent-primary/10 text-accent-primary border border-accent-primary/20'
                                  }`}>
                                    {lesson.level}
                                  </span>
                                  <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] opacity-40 italic">{lesson.duration}</span>
                               </div>
                               <h4 className="text-2xl md:text-3xl font-display font-black text-text-primary uppercase italic tracking-tighter leading-none mb-2">{lesson.title}</h4>
                               <p className="text-[11px] text-text-muted font-black uppercase tracking-[0.35em] opacity-40 italic">{lesson.instructor}</p>
                            </div>
                          </div>
                          <button 
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSelectedVideo({ title: lesson.title, url: lesson.video }); }}
                            className="w-full md:w-auto px-10 py-5 rounded-[2rem] bg-surface-800 text-text-primary text-[11px] font-black uppercase tracking-[0.2em] hover:bg-accent-primary hover:text-black transition-all relative z-10 shadow-2xl border border-white/5 active:scale-95 pointer-events-auto"
                          >
                             Assistir Aula
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar Info */}
                <div className="xl:col-span-4 space-y-12">
                   {/* Schedule Card */}
                   <div className="kpi-card !rounded-[3.5rem] p-10 bg-surface-800 border border-white/5 shadow-2xl text-left pointer-events-auto">
                     <h3 className="text-2xl font-display font-black text-text-primary mb-12 uppercase italic tracking-tighter flex items-center gap-4"><Clock className="w-7 h-7 text-accent-primary" /> Grade de Saída</h3>
                     <div className="space-y-6">
                        {[
                          { time: '18:00', class: 'Iniciantes', coach: 'Prof. Marcos', students: 12 },
                          { time: '19:30', class: 'Avançado No-Gi', coach: 'Prof. Marcos', students: 18 },
                          { time: '21:00', class: 'Open Mat', coach: 'Prof. Marcos', students: 8 },
                        ].map((c, i) => (
                          <div key={i} className="flex items-center justify-between p-8 rounded-[2.5rem] bg-surface-900 border border-white/5 shadow-inner">
                             <div className="flex items-center gap-6 text-left">
                                <span className="text-xl font-black text-accent-primary italic">{c.time}</span>
                                <div className="text-left">
                                   <p className="text-sm font-black text-text-primary uppercase tracking-tight leading-none mb-1">{c.class}</p>
                                   <p className="text-[10px] text-text-muted font-black uppercase tracking-widest opacity-40">{c.coach}</p>
                                </div>
                             </div>
                             <div className="px-4 py-2 rounded-xl bg-surface-800 text-[11px] font-black text-text-muted flex items-center gap-2 border border-white/5 shadow-2xl">
                                <Users className="w-4 h-4" />
                                {c.students}
                             </div>
                          </div>
                        ))}
                     </div>
                   </div>

                   {/* Master Diary */}
                   <div className="kpi-card !rounded-[3.5rem] p-12 bg-surface-800 border-l-4 border-accent-primary shadow-2xl relative overflow-hidden text-left pointer-events-auto">
                      <h3 className="text-2xl font-display font-black text-text-primary mb-10 uppercase italic tracking-tighter flex items-center gap-5">
                        <Megaphone className="w-8 h-8 text-accent-primary" /> Diário de Bordo
                      </h3>
                      <textarea 
                        className="w-full bg-white dark:bg-surface-900 border border-white/10 dark:border-white/10 border-black/10 rounded-3xl p-8 text-sm font-bold text-black dark:text-white outline-none focus:border-accent-primary transition-all min-h-[250px] placeholder:text-black/30 dark:placeholder:text-text-muted/20 text-left leading-relaxed shadow-inner mb-10"
                        placeholder="Instruções estratégicas para o dia..."
                        defaultValue="Foco absoluto na precisão da raspagem de gancho. Muitos alunos cedendo espaço na transição lateral."
                      />
                      <div className="flex items-center justify-end">
                         <button 
                           onClick={(e) => { e.preventDefault(); alert('Instruções salvas na rede G.F.T! 🚀'); }}
                           className="w-full py-6 bg-accent-primary text-black rounded-[2rem] font-black uppercase text-[11px] tracking-[0.25em] shadow-2xl shadow-accent-primary/20 hover:scale-105 active:scale-95 transition-all pointer-events-auto"
                         >
                           SALVAR INSTRUÇÕES
                         </button>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12 animate-fade-in pointer-events-auto">
              {['Guarda Fechada', 'Meia Guarda Profunda', 'Passagem de Toureando', 'Montada e Pressão', 'Tomada de Costas', 'Finalizações Elite'].map((cat, i) => (
                <div key={i} className="kpi-card !rounded-[3.5rem] p-12 group hover:border-accent-primary transition-all cursor-pointer bg-surface-800 shadow-2xl relative overflow-hidden border border-white/5 text-left pointer-events-auto h-full min-h-[300px] flex flex-col justify-between">
                   <div className="w-20 h-20 md:w-24 md:h-24 rounded-[2.5rem] bg-surface-900 flex items-center justify-center mb-12 group-hover:bg-accent-primary transition-all border border-white/5 shadow-2xl group-hover:scale-110 active:scale-90 pointer-events-auto">
                      <PlayCircle className="w-10 md:w-12 h-10 md:h-12 text-text-muted group-hover:text-black transition-colors" />
                   </div>
                   <div>
                      <h4 className="text-2xl md:text-4xl font-display font-black text-text-primary mb-3 uppercase italic tracking-tighter leading-none">{cat}</h4>
                      <p className="text-[11px] text-text-muted font-black tracking-[0.3em] uppercase opacity-40 italic">12 Aulas Estratégicas</p>
                   </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
