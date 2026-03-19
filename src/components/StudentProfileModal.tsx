'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Award, Activity, Calendar, ShieldCheck, CreditCard } from 'lucide-react'

export interface StudentData {
  id?: number
  nome: string
  faixa?: string
  atual?: string
  grau?: number
  progresso: number
  turma?: string
  status?: string
  aulas?: number
  tempo?: string
  avatar?: string
  ultima?: string
}

const beltColors: Record<string, string> = {
  'Branca': '#E5E7EB',
  'Azul': '#3B82F6',
  'Roxa': '#8B5CF6',
  'Marrom': '#92400E',
  'Preta': '#111827',
}

interface Props {
  isOpen: boolean
  onClose: () => void
  student: StudentData | null
}

export default function StudentProfileModal({ isOpen, onClose, student }: Props) {
  if (!student) return null

  // Normalize belt data
  let beltName = student.faixa || 'Branca'
  let beltDegree = student.grau || 0
  
  if (student.atual) {
    const parts = student.atual.split(' G')
    beltName = parts[0]
    if (parts[1]) beltDegree = parseInt(parts[1])
  }

  const beltColor = beltColors[beltName] || beltColors['Branca']
  const initials = student.avatar || student.nome.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-surface-800 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            {/* Header / ID Card Style */}
            <div className="relative p-8 overflow-hidden bg-surface-900 border-b border-white/5">
               <div className="absolute inset-0 hatched opacity-20" />
               <div className="absolute top-0 left-0 w-full h-1 bg-accent-primary shadow-[0_0_20px_rgba(var(--accent-rgb),0.5)]" />
               <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-full bg-surface-800 text-text-muted hover:text-white transition-all z-10">
                 <X className="w-5 h-5" />
               </button>

               <div className="relative z-10 flex gap-6 mt-4">
                  <div className="w-24 h-24 shrink-0 rounded-[1.5rem] bg-surface-800 border-2 shadow-2xl flex items-center justify-center" style={{ borderColor: beltColor }}>
                      <span className="text-3xl font-black text-white">{initials}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-display font-black text-text-primary tracking-tight">{student.nome}</h2>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-surface-800 text-white flex items-center gap-2 border border-white/5">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: beltColor }} />
                        {beltName} {beltDegree > 0 && `G${beltDegree}`}
                      </span>
                      {student.status && (
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                          student.status === 'Ativo' ? 'bg-accent-primary/10 text-accent-primary' :
                          student.status === 'Inadimplente' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-500'
                        }`}>
                          {student.status}
                        </span>
                      )}
                    </div>
                  </div>
               </div>
            </div>

            {/* Content Body */}
            <div className="p-8 space-y-8 bg-surface-800">
               {/* Progress / Graduation Insight */}
               <div className="space-y-3">
                 <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-text-muted">
                   <span className="flex items-center gap-2"><Award className="w-4 h-4 text-accent-primary" /> Progresso para próxima faixa</span>
                   <span className="text-accent-primary text-sm">{student.progresso}%</span>
                 </div>
                 <div className="w-full h-3 rounded-full bg-surface-900 overflow-hidden border border-white/5 p-0.5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${student.progresso}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: 'var(--accent)' }}
                    />
                 </div>
               </div>

               {/* Quick Stats Grid */}
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-surface-900 border border-white/5 flex flex-col gap-1">
                     <Activity className="w-4 h-4 text-text-muted mb-1" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Aulas Ativas</span>
                     <span className="text-xl font-display font-bold text-white">{student.aulas || '154'}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-surface-900 border border-white/5 flex flex-col gap-1">
                     <Calendar className="w-4 h-4 text-text-muted mb-1" />
                     <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">Tempo de Treino</span>
                     <span className="text-xl font-display font-bold text-white">{student.tempo || '18 Meses'}</span>
                  </div>
               </div>

               {/* Action Buttons */}
               <div className="flex gap-3 pt-4 border-t border-white/5">
                  <button className="flex-1 py-4 bg-surface-900 hover:bg-surface-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5">
                    Histórico Financeiro
                  </button>
                  <button className="flex-1 py-4 bg-accent-primary hover:brightness-110 text-surface-900 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-accent-primary/20">
                    Graduar Aluno
                  </button>
               </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
