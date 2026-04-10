'use client'

import { useApp } from '@/contexts/AppContext'
import { 
  Users, TrendingUp, DollarSign, Calendar, 
  MapPin, Clock, ArrowUpRight, ChevronRight, 
  Zap, Bell, Search, Plus, Target, Shield,
  Award, Swords, Dumbbell, Play, BookOpen, X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export default function UnifiedPremiumDashboard() {
  const { lang, studentCount = 142, revenue = "18.400" } = useApp()
  const [isNoteOpen, setIsNoteOpen] = useState(false)
  const [activeNotification, setActiveNotification] = useState<number | null>(null)

  const stats = [
    { label: 'Alunos Ativos', value: studentCount, icon: Users, color: 'text-accent-primary', trend: '+12%' },
    { label: 'Receita (MRR)', value: `R$ ${revenue}`, icon: DollarSign, color: 'text-emerald-400', trend: '+5.4%' },
    { label: 'Novos Leads', value: 24, icon: Target, color: 'text-blue-400', trend: '+18%' },
    { label: 'Retenção', value: '94%', icon: Shield, color: 'text-purple-400', trend: 'Estável' },
  ]

  const agendaHoje = [
    { time: '07:00', name: 'Fundamentos JJ', prof: 'Prof. Rafael', color: 'bg-accent-primary' },
    { time: '18:00', name: 'Jiu-Jitsu Kids', prof: 'Mestre Frazão', color: 'bg-accent-primary' },
    { time: '19:30', name: 'Muay Thai Interm.', prof: 'Prof. Marcus', color: 'bg-red-500' },
    { time: '21:00', name: 'Open Mat Elite', prof: 'Graduados', color: 'bg-accent-primary' },
  ]

  return (
    <div className="min-h-screen bg-surface-900 pb-32 text-left relative z-[1] selection:bg-accent-primary selection:text-black overflow-x-hidden">
      
      {/* Header Section */}
      <div className="p-6 md:p-12 space-y-12 animate-fade-in relative z-10 pointer-events-auto">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10">
          <div className="text-left">
            <h1 className="text-5xl md:text-8xl font-display font-black text-text-primary tracking-tighter italic uppercase leading-none mb-4">
              Quartel <br /><span className="text-accent-primary italic tracking-tight">General</span>
            </h1>
            <p className="text-[11px] text-text-muted font-black uppercase tracking-[0.4em] opacity-40">Centro de comando estratégico GFTeam</p>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="bg-surface-800 p-2 rounded-[2.5rem] flex items-center gap-2 border border-white/5 shadow-2xl">
               <button className="w-14 h-14 bg-surface-900 rounded-full flex items-center justify-center text-accent-primary hover:text-white transition-all shadow-xl active:scale-95"><Search className="w-6 h-6" /></button>
               <button onClick={() => setIsNoteOpen(true)} className="px-8 py-4 bg-accent-primary text-black rounded-[2rem] text-[11px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                  <Plus className="w-5 h-5 stroke-[2.5]" /> Postar Aviso
               </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={i} className="kpi-card !rounded-[3.5rem] bg-surface-800 border border-white/5 p-10 flex flex-col justify-between shadow-2xl group transition-all hover:border-accent-primary/20">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl bg-surface-900 border border-white/5 group-hover:scale-110 group-hover:bg-accent-primary group-hover:text-black transition-all shadow-inner`}>
                   <s.icon className={`w-8 h-8 ${s.color} group-hover:text-inherit`} />
                </div>
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-3 py-1.5 rounded-xl border border-emerald-400/20 shadow-inner group-hover:animate-pulse">{s.trend}</span>
              </div>
              <div className="text-left">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 opacity-40">{s.label}</p>
                <p className="text-5xl font-display font-black text-text-primary italic tracking-tighter leading-none">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          {/* Main Content: Agenda Local (The Bridge) */}
          <div className="xl:col-span-8 space-y-10">
            <div className="flex items-center justify-between ml-4">
               <div className="flex items-center gap-4">
                  <Calendar className="w-6 h-6 text-accent-primary" />
                  <h2 className="text-2xl font-display font-black text-text-primary uppercase italic tracking-tighter">Agenda Local</h2>
               </div>
               <button 
                onClick={() => window.location.href='/dashboard/cronograma'}
                className="text-[10px] font-black text-accent-primary uppercase tracking-widest flex items-center gap-2 hover:opacity-100 transition-opacity"
               >
                 Gerenciar Grade <ChevronRight className="w-4 h-4" />
               </button>
            </div>

            <div className="p-10 md:p-14 bg-surface-800 border border-white/5 rounded-[4rem] shadow-2xl space-y-8 pointer-events-auto">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {agendaHoje.map((cls, i) => (
                    <div key={i} className="p-8 bg-surface-900 border border-white/5 rounded-[2.5rem] hover:border-accent-primary group transition-all cursor-pointer flex items-center justify-between shadow-xl">
                       <div className="flex items-center gap-6 text-left">
                          <div className={`w-14 h-14 rounded-2xl ${cls.color} flex items-center justify-center text-black shadow-lg group-hover:scale-110 transition-transform`}>
                             <Clock className="w-7 h-7" />
                          </div>
                          <div>
                             <p className="text-2xl font-display font-black text-text-primary uppercase italic leading-none mb-2">{cls.name}</p>
                             <p className="text-[9px] font-black text-text-muted uppercase tracking-widest opacity-40">{cls.prof}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <span className="text-xl font-display font-black text-accent-primary italic">{cls.time}</span>
                       </div>
                    </div>
                  ))}
               </div>
               
               <button 
                onClick={() => window.location.href='/dashboard/cronograma'}
                className="w-full py-8 border-2 border-dashed border-white/5 bg-surface-900/40 rounded-[2.5rem] flex flex-col items-center justify-center gap-3 group hover:border-accent-primary/20 transition-all pointer-events-auto"
               >
                  <Plus className="w-8 h-8 text-text-muted group-hover:text-accent-primary transition-all" />
                  <p className="text-[11px] font-black text-text-muted uppercase tracking-[0.4em] group-hover:text-accent-primary transition-all">Expandir Visão de Agenda</p>
               </button>
            </div>
          </div>

          {/* Sidebar: Plano de Aula Active Bridge */}
          <div className="xl:col-span-4 space-y-10">
            <div className="flex items-center gap-4 ml-4">
               <Zap className="w-6 h-6 text-accent-primary" />
               <h2 className="text-2xl font-display font-black text-text-primary uppercase italic tracking-tighter">Plano de Aula</h2>
            </div>
            
            <div className="accent-bg p-10 rounded-[3.5rem] shadow-2xl relative overflow-hidden hatched text-black pointer-events-auto flex flex-col justify-between h-full min-h-[500px]">
               <div className="relative z-10 space-y-8 text-left">
                  <div className="space-y-2">
                     <p className="text-[11px] font-black text-black/40 uppercase tracking-[0.2em] italic leading-none">Status Técnico</p>
                     <h3 className="text-3xl font-display font-black uppercase italic tracking-tighter leading-none mb-2">Engenharia de Passagem</h3>
                  </div>

                  <div className="space-y-4">
                     {[
                       { title: 'Pressão no Quadril', dur: '15min' },
                       { title: 'Cruzada de Joelho', dur: '20min' }
                     ].map((item, id) => (
                       <div key={id} className="flex items-center gap-4 p-4 bg-black/5 rounded-2xl border border-black/5">
                          <div className="w-8 h-8 rounded-lg bg-black flex items-center justify-center text-accent-primary text-[10px] font-black">0{id+1}</div>
                          <p className="text-[11px] font-black uppercase italic text-black/70">{item.title}</p>
                       </div>
                     ))}
                  </div>

                  <button 
                    onClick={() => window.location.href='/dashboard/treinos'}
                    className="w-full py-5 bg-black text-accent-primary rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-black/30 hover:scale-105 active:scale-95 transition-all text-center flex items-center justify-center gap-4"
                  >
                    <BookOpen className="w-5 h-5" /> EDITAR CURRÍCULO
                  </button>
               </div>
            </div>
          </div>
        </div>

        {/* Action Center - Stories/Marketing */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pointer-events-auto">
          <div className="kpi-card !rounded-[3rem] p-8 border border-white/5 bg-surface-800 flex items-center justify-between group cursor-pointer hover:border-accent-primary/30 transition-all shadow-2xl">
             <div className="flex items-center gap-6 text-left">
                <div className="w-14 h-14 rounded-2xl bg-surface-900 flex items-center justify-center border border-white/5 shadow-inner">
                   <Target className="w-7 h-7 text-accent-primary" />
                </div>
                <div>
                   <h4 className="text-lg font-display font-black text-text-primary uppercase italic tracking-tighter leading-none mb-1">Dossiê de <br/>Inadimplência</h4>
                   <p className="text-[9px] text-text-muted font-black uppercase tracking-widest opacity-40 italic">Ação financeira elite</p>
                </div>
             </div>
             <ChevronRight className="w-6 h-6 text-text-muted group-hover:translate-x-3 transition-transform" />
          </div>
        </div>

      </div>

      {/* MODAL: POSTAR AVISO (Bug Fix: z-index / Interatividade) */}
      <AnimatePresence>
        {isNoteOpen && (
          <div className="fixed inset-0 z-[60000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl overflow-y-auto">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 30 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               className="bg-surface-800 w-full max-w-lg rounded-[3.5rem] p-10 md:p-14 border border-white/10 shadow-2xl relative text-left my-auto pointer-events-auto"
             >
                <button onClick={() => setIsNoteOpen(false)} className="absolute top-8 right-8 w-12 h-12 rounded-full bg-surface-900 border border-white/5 flex items-center justify-center text-text-muted hover:text-white shadow-xl active:scale-95 transition-all cursor-pointer"><X className="w-5 h-5" /></button>
                <h2 className="text-4xl font-display font-black text-text-primary uppercase italic tracking-tighter mb-10 leading-none">Aviso <br /><span className="text-accent-primary italic">Operacional</span></h2>
                
                <div className="space-y-6 mb-12">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-2 opacity-60">Título do Comunicado</label>
                      <input type="text" className="w-full bg-surface-900 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-text-primary outline-none focus:border-accent-primary shadow-inner" placeholder="Ex: Graduação 2024" />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-2 opacity-60">Conteúdo do Aviso</label>
                      <textarea className="w-full h-32 bg-surface-900 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-text-primary outline-none focus:border-accent-primary shadow-inner resize-none" placeholder="Escreva a mensagem mestre..." />
                   </div>
                </div>

                <div className="flex gap-4">
                   <button onClick={() => setIsNoteOpen(false)} className="flex-1 py-6 bg-surface-700 text-text-primary rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-surface-600 shadow-xl transition-all">CANCELAR</button>
                   <button onClick={() => { setIsNoteOpen(false); alert('Aviso enviado para todos os alunos! 📢'); }} className="flex-1 py-6 bg-accent-primary text-black rounded-2xl font-black uppercase text-[12px] tracking-[0.2em] shadow-2xl shadow-accent-primary/20 hover:scale-[1.05] active:scale-95 transition-all">PUBLICAR NO QG</button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
