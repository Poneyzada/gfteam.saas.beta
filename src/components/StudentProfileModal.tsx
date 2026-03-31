import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Award, Activity, Calendar, ShieldCheck, CreditCard, ChevronLeft, CheckCircle2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

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
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && student) {
      setShowHistory(false)
      // Mock de histórico por enquanto, mas preparado para Supabase
      setHistory([
        { id: 1, mes: 'Março 2024', valor: 'R$ 180,00', status: 'pago', data: '05/03' },
        { id: 2, mes: 'Fevereiro 2024', valor: 'R$ 180,00', status: 'pago', data: '05/02' },
        { id: 3, mes: 'Janeiro 2024', valor: 'R$ 180,00', status: 'pago', data: '10/01' },
      ])
    }
  }, [isOpen, student])

  if (!student) return null

  const handleGraduation = async () => {
    if (!student.id) return
    setLoading(true)
    // Simulação de graduação
    setTimeout(() => {
      setLoading(false)
      alert(`${student.nome} graduado com sucesso!`)
    }, 1500)
  }

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
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-surface-800 border border-white/10 rounded-[3rem] shadow-2xl overflow-hidden"
          >
            {/* Header / ID Card Style */}
            <div className="relative p-10 overflow-hidden bg-surface-900 border-b border-white/5">
               <div className="absolute inset-0 hatched opacity-20" />
               <div className="absolute top-0 left-0 w-full h-1 bg-accent-primary shadow-[0_0_20px_rgba(var(--accent-rgb),0.5)]" />
               <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full bg-surface-800 text-text-muted hover:text-text-primary transition-all z-10">
                 <X className="w-5 h-5" />
               </button>

               <div className="relative z-10 flex gap-8 items-center">
                  <div className="w-24 h-24 shrink-0 rounded-[2rem] bg-surface-800 border-4 shadow-2xl flex items-center justify-center" style={{ borderColor: beltColor }}>
                      <span className="text-4xl font-black text-text-primary italic">{initials}</span>
                  </div>
                  <div>
                    <h2 className="text-3xl font-display font-black text-text-primary tracking-tighter uppercase italic">{student.nome}</h2>
                    <div className="flex items-center gap-3 mt-3">
                      <span className="px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-surface-800 text-text-primary flex items-center gap-3 border border-white/5">
                        <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_10px_rgba(var(--accent-rgb),0.3)]" style={{ backgroundColor: beltColor }} />
                        {beltName} {beltDegree > 0 && `G${beltDegree}`}
                      </span>
                      {student.status && (
                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
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
            <div className="p-10 space-y-10 bg-surface-800 relative">
               <AnimatePresence mode="wait">
                 {!showHistory ? (
                   <motion.div 
                     key="profile"
                     initial={{ opacity: 0, x: -20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: 20 }}
                     className="space-y-10"
                   >
                     {/* Progress / Graduation Insight */}
                     <div className="space-y-4">
                       <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-text-muted">
                         <span className="flex items-center gap-2"><Award className="w-4 h-4 text-accent-primary" /> Progresso para próxima marca</span>
                         <span className="text-accent-primary text-sm font-black italic">{student.progresso}%</span>
                       </div>
                       <div className="w-full h-4 rounded-full bg-surface-900 overflow-hidden border border-white/5 p-1 shadow-inner">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${student.progresso}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="h-full rounded-full hatched"
                            style={{ backgroundColor: 'var(--accent)' }}
                          />
                       </div>
                     </div>

                     {/* Quick Stats Grid */}
                     <div className="grid grid-cols-2 gap-6">
                        <div className="p-6 rounded-[2rem] bg-surface-900 border border-white/5 flex flex-col gap-2 shadow-lg">
                           <Activity className="w-5 h-5 text-accent-primary mb-1" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-60">Aulas Ativas</span>
                           <span className="text-3xl font-display font-black text-text-primary italic tracking-tighter">{student.aulas || '154'}</span>
                        </div>
                        <div className="p-6 rounded-[2rem] bg-surface-900 border border-white/5 flex flex-col gap-2 shadow-lg">
                           <Calendar className="w-5 h-5 text-accent-primary mb-1" />
                           <span className="text-[10px] font-black uppercase tracking-widest text-text-muted opacity-60">Tempo de Casa</span>
                           <span className="text-3xl font-display font-black text-text-primary italic tracking-tighter">{student.tempo || '18 Mes'}</span>
                        </div>
                     </div>

                     {/* Action Buttons */}
                     <div className="flex gap-4 pt-6">
                        <button 
                          onClick={() => setShowHistory(true)}
                          className="flex-1 py-5 bg-surface-900 hover:bg-surface-700 text-text-primary rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 flex items-center justify-center gap-3 active:scale-95"
                        >
                          <CreditCard className="w-4 h-4" />
                          Histórico Financeiro
                        </button>
                        <button 
                          onClick={handleGraduation}
                          disabled={loading}
                          className="flex-1 py-5 bg-accent-primary hover:brightness-110 text-black rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-accent-primary/20 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                        >
                          {loading ? 'Processando...' : (
                            <>
                              <Award className="w-4 h-4" />
                              Graduar Aluno
                            </>
                          )}
                        </button>
                     </div>
                   </motion.div>
                 ) : (
                   <motion.div 
                     key="history"
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     exit={{ opacity: 0, x: -20 }}
                     className="space-y-8"
                   >
                      <button 
                        onClick={() => setShowHistory(false)}
                        className="flex items-center gap-2 text-[10px] font-black text-accent-primary uppercase tracking-widest hover:translate-x-[-4px] transition-all"
                      >
                        <ChevronLeft className="w-4 h-4" /> Voltar ao Perfil
                      </button>

                      <div className="space-y-4">
                        <h3 className="text-xl font-display font-black text-text-primary uppercase italic tracking-tighter">Últimos Pagamentos</h3>
                        <div className="space-y-3">
                           {history.map((pay) => (
                             <div key={pay.id} className="flex items-center justify-between p-5 bg-surface-900 rounded-[1.5rem] border border-white/5">
                               <div>
                                  <p className="text-xs font-black text-text-primary uppercase tracking-wider">{pay.mes}</p>
                                  <p className="text-[10px] text-text-muted uppercase tracking-widest mt-1">Pago em {pay.data}</p>
                               </div>
                               <div className="text-right">
                                  <p className="text-sm font-black text-accent-primary italic">{pay.valor}</p>
                                  <span className="flex items-center justify-end gap-1.5 text-[9px] font-black text-emerald-400 uppercase tracking-widest mt-1">
                                    <CheckCircle2 className="w-3 h-3" /> {pay.status}
                                  </span>
                               </div>
                             </div>
                           ))}
                        </div>
                      </div>
                   </motion.div>
                 )}
               </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
