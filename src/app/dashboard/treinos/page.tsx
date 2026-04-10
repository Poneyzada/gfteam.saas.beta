'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  BookOpen, Plus, PlayCircle, X, 
  Clock, Trash2, Megaphone, Save
} from 'lucide-react'

export default function RaizTreinosPage() {
  const [activeTab, setActiveTab] = useState('wod')
  const [isAddLessonModalOpen, setIsAddLessonModalOpen] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<{title: string, url: string} | null>(null)

  const [lessons, setLessons] = useState([
    { id: 1, title: 'Raspagem de Gancho (Hook Sweep)', level: 'Básico', duration: '20 min', instructor: 'Mestre Julio', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    { id: 2, title: 'Passagem de Meia Guarda Profunda', level: 'Avançado', duration: '25 min', instructor: 'Prof. Marcos Freitas', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
  ])

  // New Lesson Form
  const [newLesson, setNewLesson] = useState({
    title: '',
    level: 'Básico',
    duration: '15 min',
    instructor: 'Mestre Julio',
    video: ''
  })

  const handleAddLesson = () => {
    if (!newLesson.title) return
    let videoUrl = newLesson.video
    if (videoUrl.includes('watch?v=')) {
        videoUrl = videoUrl.replace('watch?v=', 'embed/').split('&')[0]
    } else if (videoUrl.includes('youtu.be/')) {
        videoUrl = videoUrl.replace('youtu.be/', 'youtube.com/embed/')
    }
    const lesson = {
      id: Date.now(),
      ...newLesson,
      video: videoUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'
    }
    setLessons([...lessons, lesson])
    setIsAddLessonModalOpen(false)
    setNewLesson({ title: '', level: 'Básico', duration: '15 min', instructor: 'Mestre Julio', video: '' })
  }

  return (
    <div className="p-4 md:p-10 space-y-12 animate-fade-in text-left min-h-screen bg-app selection:bg-accent-primary selection:text-black pb-32">
      {/* Video Player Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-surface-800 rounded-[2rem] shadow-2xl overflow-hidden border border-white/10"
            >
              <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-xl font-display font-black text-white uppercase italic tracking-tighter">{selectedVideo.title}</h3>
                <button onClick={() => setSelectedVideo(null)} className="p-3 rounded-full bg-surface-900 text-white hover:bg-accent-primary hover:text-black transition-all cursor-pointer border-none">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="aspect-video bg-black">
                <iframe className="w-full h-full" src={selectedVideo.url} title={selectedVideo.title} allowFullScreen />
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Lesson Modal */}
      <AnimatePresence>
        {isAddLessonModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
             <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative w-full max-w-xl bg-surface-800 border border-white/10 rounded-[3rem] p-10 text-left shadow-2xl"
            >
              <h2 className="text-3xl font-display font-black text-white mb-8 uppercase italic tracking-tighter leading-none">Novas Técnicas</h2>
              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black text-white uppercase tracking-widest pl-2">Nome da Técnica / Drill</label>
                    <input type="text" value={newLesson.title} onChange={(e) => setNewLesson({...newLesson, title: e.target.value})} className="w-full mt-2 bg-surface-900 border border-white/10 p-5 rounded-2xl text-white font-black uppercase text-sm outline-none focus:border-accent-primary" placeholder="EX: PASSAGEM..." />
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                    <div>
                       <label className="text-[10px] font-black text-white uppercase tracking-widest pl-2">Nível</label>
                       <select value={newLesson.level} onChange={(e) => setNewLesson({...newLesson, level: e.target.value})} className="w-full mt-2 bg-surface-900 border border-white/10 p-5 rounded-2xl text-white font-black text-sm outline-none focus:border-accent-primary appearance-none">
                          <option>Básico</option>
                          <option>Intermediário</option>
                          <option>Avançado</option>
                       </select>
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-white uppercase tracking-widest pl-2">Link YouTube</label>
                        <input type="text" value={newLesson.video} onChange={(e) => setNewLesson({...newLesson, video: e.target.value})} className="w-full mt-2 bg-surface-900 border border-white/10 p-5 rounded-2xl text-white font-black text-sm outline-none focus:border-accent-primary" placeholder="URL..." />
                    </div>
                 </div>

                 <div className="flex gap-4 mt-8">
                    <button onClick={() => setIsAddLessonModalOpen(false)} className="flex-1 py-5 rounded-2xl bg-surface-700 text-white font-black uppercase text-[10px] tracking-widest border-none cursor-pointer">Cancelar</button>
                    <button onClick={handleAddLesson} className="flex-1 py-5 rounded-2xl bg-accent-primary text-black font-black uppercase text-[10px] tracking-widest shadow-xl border-none cursor-pointer">Vincular ao Plano</button>
                 </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
        <div className="text-left">
          <h1 className="text-4xl md:text-6xl font-display font-black text-black dark:text-white tracking-tighter italic uppercase leading-none mb-4">Currículo <br /><span className="text-accent-primary italic">de Treinos</span></h1>
          <p className="text-[11px] text-black dark:text-white font-black uppercase tracking-[0.4em]">Engenharia tática G.F.T</p>
        </div>
        <button 
          onClick={() => setIsAddLessonModalOpen(true)}
          className="px-10 py-5 bg-accent-primary text-black rounded-xl text-[12px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all border-none flex items-center gap-4 cursor-pointer"
        >
          <Plus className="w-7 h-7 stroke-[3]" />
          <span>ADICIONAR TÉCNICA</span>
        </button>
      </div>

      <div className="flex items-center gap-4 border-b border-black/10 dark:border-white/10 pb-4">
        {['TREINO DO DIA', 'BIBLIOTECA TÉCNICA'].map(tab => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab === 'TREINO DO DIA' ? 'wod' : 'library')}
            className={`px-6 py-3 rounded-lg text-[10px] font-black tracking-widest transition-all cursor-pointer border-none ${activeTab === (tab === 'TREINO DO DIA' ? 'wod' : 'library') ? 'bg-accent-primary text-black shadow-lg' : 'bg-transparent text-black dark:text-white opacity-40 hover:opacity-100'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === 'wod' ? (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          {/* List of techniques */}
          <div className="xl:col-span-8 space-y-6">
            <h3 className="text-2xl font-display font-black text-black dark:text-white uppercase italic tracking-tighter mb-8">Grade de Técnicas</h3>
            {lessons.length === 0 ? (
              <p className="text-center py-20 text-black dark:text-white opacity-40 font-black uppercase italic text-xs border-2 border-dashed border-black/10 dark:border-white/10 rounded-3xl tracking-widest">Plano vazio para hoje...</p>
            ) : lessons.map((lesson) => (
              <div key={lesson.id} className="kpi-card !p-6 bg-surface-900 border-black/10 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-accent-primary transition-all shadow-md">
                 <div className="flex items-center gap-6">
                    <button onClick={() => setSelectedVideo({ title: lesson.title, url: lesson.video })} className="w-16 h-16 rounded-xl bg-surface-800 flex items-center justify-center border-none cursor-pointer group hover:bg-accent-primary transition-all">
                       <PlayCircle className="w-10 h-10 text-accent-primary group-hover:text-black" />
                    </button>
                    <div className="text-left">
                       <p className="text-lg font-black text-black dark:text-white uppercase italic leading-none mb-1">{lesson.title}</p>
                       <p className="text-[10px] font-black text-black dark:text-white uppercase tracking-widest">{lesson.level} • {lesson.duration}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4">
                    <button onClick={() => setSelectedVideo({ title: lesson.title, url: lesson.video })} className="px-6 py-3 rounded-xl bg-surface-800 border-none text-[10px] font-black text-black dark:text-white uppercase tracking-widest hover:bg-accent-primary hover:text-black transition-all cursor-pointer shadow">Ver Vídeo</button>
                    <button onClick={() => setLessons(lessons.filter(l => l.id !== lesson.id))} className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all cursor-pointer border-none"><Trash2 className="w-4 h-4" /></button>
                 </div>
              </div>
            ))}
          </div>

          {/* Sidebar Note */}
          <div className="xl:col-span-4 space-y-8 text-left">
             <div className="kpi-card !p-8 bg-surface-800 border-l-4 border-accent-primary border-t-0 border-r-0 border-b-0 shadow-lg">
                <h3 className="text-2xl font-display font-black text-black dark:text-white mb-8 uppercase italic tracking-tighter flex items-center gap-4"><Megaphone className="w-8 h-8 text-accent-primary" /> Diário do Mestre</h3>
                <textarea className="w-full bg-surface-900 border border-black/10 dark:border-white/10 p-6 rounded-2xl text-sm font-bold text-black dark:text-white outline-none focus:border-accent-primary h-40" defaultValue="FOCO NA PRECISÃO TÉCNICA." />
                <button onClick={() => alert('Plano Salvo!')} className="w-full mt-6 py-5 bg-accent-primary text-black rounded-xl font-black uppercase text-[11px] tracking-widest shadow-xl border-none cursor-pointer flex items-center justify-center gap-3"><Save className="w-5 h-5" /> SALVAR PLANO</button>
             </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
           {['GUARDA FECHADA', 'MEIA GUARDA', 'PASSAGENS'].map((cat, i) => (
             <div key={i} className="kpi-card !p-10 bg-surface-800 border-black/10 dark:border-white/10 hover:border-accent-primary transition-all cursor-pointer group text-left h-full flex flex-col justify-between min-h-[250px]">
                <div className="w-16 h-16 rounded-xl bg-surface-900 flex items-center justify-center mb-10 group-hover:bg-accent-primary transition-all border border-black/10"><PlayCircle className="w-10 h-10 text-accent-primary group-hover:text-black" /></div>
                <h4 className="text-2xl md:text-3xl font-display font-black text-black dark:text-white uppercase italic tracking-tighter leading-none">{cat}</h4>
             </div>
           ))}
        </div>
      )}
    </div>
  )
}
