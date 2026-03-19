'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BookOpen, Calendar, Clock, Award, PlayCircle, Plus, Search, ChevronRight, ChevronLeft, MapPin, Users, Zap, CheckCircle2, X, CopyPlus, FilePlus } from 'lucide-react'

export default function TrainingPage() {
  const [currentWeek] = useState('Semana 12: Fundamentos de Guarda')
  const [activeTab, setActiveTab] = useState('wod')
  const [isNewTrainingModalOpen, setIsNewTrainingModalOpen] = useState(false)

  const [lessons] = useState([
    { id: 1, title: 'Raspagem de Gancho (Hook Sweep)', level: 'Básico', type: 'Técnica Principal', duration: '20 min', instructor: 'Mestre Julio' },
    { id: 2, title: 'Passagem de Meia Guarda Profunda', level: 'Avançado', type: 'Técnica Principal', duration: '25 min', instructor: 'Prof. Marcos Freitas' },
    { id: 3, title: 'Drills de Movimentação Lateral', level: 'Todos os Níveis', type: 'Drill/Aquecimento', duration: '15 min', instructor: 'Equipe Técnica' },
  ])

  return (
    <div className="p-10 space-y-8 animate-fade-up relative min-h-screen">
      
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
                {/* Option 1: Duplicate */}
                <div className="group p-6 rounded-3xl bg-surface-900 border border-white/5 hover:border-accent-primary transition-all cursor-pointer relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent-primary/5 rounded-full blur-2xl group-hover:bg-accent-primary/20 transition-all" />
                  <div className="w-14 h-14 rounded-2xl bg-surface-800 flex items-center justify-center mb-6 group-hover:bg-accent-primary group-hover:text-surface-900 transition-all">
                    <CopyPlus className="w-6 h-6 text-accent-primary group-hover:text-surface-900" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-text-primary mb-2">Duplicar Semana Anterior</h3>
                  <p className="text-sm text-text-muted">Copia toda a estrutura de aquecimento, drills e técnicas da semana passada para você apenas ajustar os detalhes.</p>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-muted group-hover:text-accent-primary transition-colors">Mais rápido</span>
                    <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-accent-primary transition-colors" />
                  </div>
                </div>

                {/* Option 2: Scratch */}
                <div className="group p-6 rounded-3xl bg-surface-900 border border-white/5 hover:border-text-primary transition-all cursor-pointer relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-all" />
                  <div className="w-14 h-14 rounded-2xl bg-surface-800 flex items-center justify-center mb-6 group-hover:bg-text-primary group-hover:text-surface-900 transition-all">
                    <FilePlus className="w-6 h-6 text-text-secondary group-hover:text-surface-900" />
                  </div>
                  <h3 className="text-xl font-display font-bold text-text-primary mb-2">Criar do Zero</h3>
                  <p className="text-sm text-text-muted">Começa com um quadro em branco. Ideal para planejar um ciclo totalmente novo de treinamentos e posições.</p>
                  <div className="mt-6 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-text-muted group-hover:text-text-primary transition-colors">100% Personalizado</span>
                    <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-text-primary transition-colors" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-black text-text-primary tracking-tight">Cronograma de Treinos</h1>
          <p className="text-text-muted font-semibold mt-1">Gestão de currículo técnico e planos de aula (Syllabus)</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsNewTrainingModalOpen(true)}
            className="btn-primary flex items-center gap-2 bg-accent-primary text-surface-900 border-none px-6 py-3.5 rounded-2xl shadow-xl shadow-accent-primary/20"
          >
            <Plus className="w-5 h-5" />
            <span className="font-bold tracking-tight">Novo Treino</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-surface-700/50 rounded-2xl w-fit">
        <button 
          onClick={() => setActiveTab('wod')}
          className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            activeTab === 'wod' ? 'bg-accent-primary text-surface-900 shadow-lg' : 'text-text-muted hover:text-text-primary'
          }`}
        >
          Treino do Dia (WOD)
        </button>
        <button 
          onClick={() => setActiveTab('library')}
          className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            activeTab === 'library' ? 'bg-accent-primary text-surface-900 shadow-lg' : 'text-text-muted hover:text-text-primary'
          }`}
        >
          Biblioteca Técnica
        </button>
      </div>

      {activeTab === 'wod' ? (
        <>
          {/* Week Focus Bar */}
          <div className="accent-bg p-8 rounded-[3rem] shadow-xl accent-shadow relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                 <div className="w-16 h-16 rounded-2xl bg-surface-900/20 flex items-center justify-center backdrop-blur-md">
                    <BookOpen className="w-8 h-8 text-surface-900" />
                 </div>
                 <div>
                    <p className="text-[10px] font-black text-surface-900/60 uppercase tracking-widest">Foco da Semana</p>
                    <h2 className="text-2xl font-display font-black text-surface-900">{currentWeek}</h2>
                 </div>
              </div>
              <div className="flex items-center gap-6">
                 <div className="text-right">
                    <p className="text-[10px] font-black text-surface-900/60 uppercase tracking-widest">Status de Hoje</p>
                    <p className="text-xl font-bold text-surface-900">12 Alunos Atendidos</p>
                 </div>
                 <div className="w-px h-10 bg-surface-900/20" />
                 <button className="px-6 py-3 rounded-2xl bg-surface-900 text-accent-primary text-xs font-black uppercase tracking-widest hover:scale-105 transition-all">
                    Registrar Presença
                 </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
            {/* Left: Classes of the Day */}
            <div className="xl:col-span-8 space-y-8">
              <div className="kpi-card !rounded-[3rem] p-8">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-display font-black text-text-primary">Grade de Técnicas</h2>
                </div>

                <div className="space-y-6">
                  {lessons.map((lesson) => (
                    <div key={lesson.id} className="group p-6 rounded-[2rem] bg-surface-600 border border-white/5 hover:border-accent-primary/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 rounded-2xl bg-surface-700 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-primary transition-colors">
                           <PlayCircle className="w-6 h-6 text-text-muted group-hover:text-surface-900" />
                        </div>
                        <div>
                           <div className="flex items-center gap-2 mb-1">
                              <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter ${
                                lesson.level === 'Avançado' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'
                              }`}>
                                {lesson.level}
                              </span>
                              <span className="text-[9px] font-black text-text-muted uppercase tracking-widest italic">{lesson.type}</span>
                           </div>
                           <h4 className="text-lg font-bold text-text-primary">{lesson.title}</h4>
                           <div className="flex items-center gap-4 mt-1 text-text-muted text-[10px] font-semibold">
                              <span className="flex items-center gap-1"><Clock className="w-3 h-3"/> {lesson.duration}</span>
                              <span className="flex items-center gap-1"><Award className="w-3 h-3"/> {lesson.instructor}</span>
                           </div>
                        </div>
                      </div>
                      <button className="px-5 py-2.5 rounded-xl bg-surface-700 text-text-primary text-xs font-black uppercase tracking-widest hover:bg-accent-primary hover:text-surface-900 transition-all">
                         Ver Técnica
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Instructor Notes & Schedule */}
            <div className="xl:col-span-4 space-y-8">
              <div className="kpi-card !rounded-[2.5rem] p-8 space-y-6">
                <h3 className="text-xl font-display font-black text-text-primary">Próximas Turmas</h3>
                <div className="space-y-4">
                   {[
                     { time: '18:00', class: 'Iniciantes', coach: 'Prof. Marcos', students: 12 },
                     { time: '19:30', class: 'Avançado (No-Gi)', coach: 'Prof. Marcos', students: 18 },
                     { time: '21:00', class: 'Open Mat', coach: 'Prof. Marcos', students: 8 },
                   ].map((c, i) => (
                     <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-surface-600/50 border border-white/5">
                        <div className="flex items-center gap-3">
                           <span className="text-sm font-black text-accent-primary">{c.time}</span>
                           <div>
                              <p className="text-xs font-bold text-text-primary">{c.class}</p>
                              <p className="text-[10px] text-text-muted">{c.coach}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-bold text-text-muted">
                           <Users className="w-3 h-3" />
                           {c.students}
                        </div>
                     </div>
                   ))}
                </div>
              </div>

              <div className="kpi-card !rounded-[2.5rem] p-8 bg-surface-600 border-surface-500">
                 <div className="flex items-center gap-3 mb-4">
                    <Zap className="w-5 h-5 text-accent-primary" />
                    <h3 className="text-xl font-display font-black text-text-primary">Anotações do Professor</h3>
                 </div>
                  <p className="text-sm text-text-secondary leading-relaxed italic opacity-80">
                    &quot;Focar na distribuição de peso durante a raspagem. O gancho deve ser ativo e não deixar o colega pesar a perna esquerda.&quot;
                  </p>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {['Guarda Fechada', 'Meia Guarda', 'Passagem de Guarda', 'Montada', 'Costas', 'Finalizações'].map((cat, i) => (
            <div key={i} className="kpi-card !rounded-[2.5rem] p-8 group hover:border-accent-primary transition-all cursor-pointer">
               <div className="w-12 h-12 rounded-2xl bg-surface-600 flex items-center justify-center mb-6 group-hover:bg-accent-primary transition-colors">
                  <PlayCircle className="w-6 h-6 text-text-muted group-hover:text-surface-900" />
               </div>
               <h4 className="text-xl font-display font-black text-text-primary mb-2">{cat}</h4>
               <p className="text-xs text-text-muted font-bold tracking-widest uppercase">12 Vídeos de Técnicas</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
