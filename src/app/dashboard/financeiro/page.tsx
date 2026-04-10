'use client'

import { useState, useEffect } from 'react'
import { 
  DollarSign, TrendingUp, TrendingDown, AlertCircle, 
  Plus, Download, MessageCircle, Zap, Check, 
  CreditCard, ShoppingBag, X, BarChart3, PieChart
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type FinanceTab = 'resumo' | 'dre' | 'idr'

export default function FinanceiroPage() {
  const [activeTab, setActiveTab] = useState<FinanceTab>('resumo')
  const [quickItem, setQuickItem] = useState('')
  const [quickValue, setQuickValue] = useState('')
  const [launching, setLaunching] = useState(false)
  const [isNewLaunchModalOpen, setIsNewLaunchModalOpen] = useState(false)
  
  const [kpis, setKpis] = useState({ revenue: 42500, expenses: 18200, profit: 24300, overdue: 1250, overdueCount: 5 })

  const handleQuickLaunch = async () => {
    if (!quickItem || !quickValue) return
    setLaunching(true)
    setTimeout(() => {
      setLaunching(false)
      setIsNewLaunchModalOpen(false)
      setQuickItem('')
      setQuickValue('')
      alert('Lançamento realizado com sucesso!')
    }, 1000)
  }

  const tabs = [
    { id: 'resumo', label: 'Resumo Operacional', icon: BarChart3 },
    { id: 'dre', label: 'DRE (Resultados)', icon: PieChart },
    { id: 'idr', label: 'IDR (Indicadores)', icon: TrendingUp },
  ]

  return (
    <div className="min-h-screen bg-surface-900 pb-32 text-left relative z-30 pointer-events-auto">
      {/* Modal Novo Lançamento */}
      <AnimatePresence>
        {isNewLaunchModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-3xl pointer-events-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="bg-surface-800 w-full max-w-xl rounded-[3rem] p-12 border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.8)] relative text-left pointer-events-auto"
            >
               <button onClick={() => setIsNewLaunchModalOpen(false)} className="absolute top-8 right-8 p-3 text-text-muted hover:text-white border border-white/5 rounded-full bg-surface-900 shadow-xl pointer-events-auto z-50"><X className="w-6 h-6" /></button>
               <h2 className="text-3xl font-display font-black text-text-primary uppercase italic tracking-tighter mb-10 leading-none">Novo Lançamento <br /><span className="text-accent-primary italic">Financeiro</span></h2>
               <div className="space-y-8">
                  <div className="space-y-3 pointer-events-auto">
                     <label className="text-[11px] font-black text-text-muted uppercase tracking-widest pl-2 opacity-60">DESCRIÇÃO DO ITEM / CATEGORIA</label>
                     <input 
                       type="text" 
                       value={quickItem} 
                       onChange={(e) => setQuickItem(e.target.value)} 
                       className="w-full bg-surface-900 border border-white/10 rounded-2xl px-6 py-5 text-base font-bold text-text-primary focus:border-accent-primary outline-none shadow-inner pointer-events-auto" 
                       placeholder="Ex: Aluguel, Kit Faixas, Suplementos..." 
                     />
                  </div>
                  <div className="space-y-3 pointer-events-auto">
                     <label className="text-[11px] font-black text-text-muted uppercase tracking-widest pl-2 opacity-60">VALOR DA OPERAÇÃO (R$)</label>
                     <input 
                       type="text" 
                       value={quickValue} 
                       onChange={(e) => setQuickValue(e.target.value)} 
                       className="w-full bg-surface-900 border border-white/10 rounded-2xl px-6 py-5 text-base font-bold text-text-primary focus:border-accent-primary outline-none shadow-inner pointer-events-auto" 
                       placeholder="0,00" 
                     />
                  </div>
                  <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleQuickLaunch(); }} 
                    disabled={launching}
                    className="w-full py-6 bg-accent-primary text-black rounded-2xl font-black uppercase text-[12px] tracking-[0.2em] shadow-2xl shadow-accent-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-40 pointer-events-auto"
                  >
                     {launching ? <Zap className="w-6 h-6 animate-spin" /> : <><span>SINCRONIZAR NO CAIXA</span><Check className="w-6 h-6 stroke-[3]" /></>}
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="p-4 md:p-10 space-y-12 animate-fade-in text-left pointer-events-auto">
        {/* Header Hero */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 relative z-40 pointer-events-auto">
           <div className="text-left">
              <h1 className="text-4xl md:text-6xl font-display font-black text-text-primary uppercase italic tracking-tighter leading-none mb-4">Financeiro <br /><span className="text-accent-primary italic underline underline-offset-8">Matriz de Comando</span></h1>
              <p className="text-[11px] text-text-muted font-black uppercase tracking-[0.4em] opacity-40">Gestão estratégica de fluxo e DRE unificado</p>
           </div>
           <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setIsNewLaunchModalOpen(true); }} 
                className="px-10 py-5 bg-accent-primary text-black rounded-[2rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-accent-primary/20 hover:scale-105 transition-all border-none active:scale-95 pointer-events-auto flex items-center gap-4 relative z-50"
              >
                 <Plus className="w-7 h-7 stroke-[3]" /> <span className="font-black">NOVO LANÇAMENTO</span>
              </button>
           </div>
        </div>

        {/* Navigation Tabs (DRE & IDR) */}
        <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-hide relative z-40 pointer-events-auto shadow-2xl">
          {tabs.map((tab) => (
            <button 
              key={tab.id}
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveTab(tab.id as FinanceTab); }}
              className={`flex items-center gap-4 px-10 py-5 rounded-[2rem] cursor-pointer transition-all whitespace-nowrap border border-white/5 relative z-10 pointer-events-auto hover:bg-surface-800 active:scale-95 group ${
                activeTab === tab.id 
                  ? 'bg-accent-primary text-black dark:text-black shadow-2xl font-black uppercase text-[10px] tracking-[0.25em] translate-y-[-2px]' 
                  : 'bg-surface-800/50 text-text-muted font-black uppercase text-[10px] tracking-[0.25em]'
              }`}
            >
              <tab.icon className={`w-5 h-5 ${activeTab === tab.id ? 'text-black' : 'group-hover:text-text-primary transition-colors'}`} />
              <span className={activeTab === tab.id ? 'text-black font-black' : ''}>{tab.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="space-y-12 relative z-30 pointer-events-auto"
          >
            {activeTab === 'resumo' && (
              <>
                {/* Action Cards Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pointer-events-auto">
                   {[
                     { label: 'Carteirinha', icon: CreditCard, color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
                     { label: 'Kit Balcão', icon: ShoppingBag, color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
                     { label: 'Estoque', icon: Zap, color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
                     { label: 'Saques', icon: DollarSign, color: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
                   ].map((btn, i) => (
                     <button 
                       key={i} 
                       onClick={(e) => { e.preventDefault(); e.stopPropagation(); alert(`Acessando ${btn.label}... 🚀`); }}
                       className={`p-10 rounded-[3.5rem] border transition-all flex flex-col items-start justify-between gap-10 group active:scale-95 ${btn.color} hover:bg-accent-primary hover:text-black hover:border-accent-primary shadow-2xl pointer-events-auto relative overflow-hidden text-left h-full min-h-[220px] shadow-inner`}
                     >
                        <div className="w-16 h-16 rounded-[1.8rem] bg-surface-900 border border-white/5 flex items-center justify-center group-hover:bg-black/10 transition-colors shadow-2xl">
                           <btn.icon className="w-8 h-8 group-hover:scale-110 transition-transform opacity-100" />
                        </div>
                        <span className="text-[14px] font-black uppercase tracking-[0.23em] group-hover:text-black italic leading-none">{btn.label}</span>
                     </button>
                   ))}
                </div>

                {/* KPI Row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pointer-events-auto">
                  {[
                    { l: 'Receita Bruta', v: `R$ ${kpis.revenue.toLocaleString()}`, icon: TrendingUp, color: 'text-accent-primary' },
                    { l: 'Despesas Gerais', v: `R$ ${kpis.expenses.toLocaleString()}`, icon: TrendingDown, color: 'text-red-400' },
                    { l: 'Profit Líquido', v: `R$ ${kpis.profit.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-400' },
                    { l: 'Inadimplência', v: `R$ ${kpis.overdue.toLocaleString()}`, icon: AlertCircle, color: 'text-red-500' },
                  ].map((k, i) => (
                    <div key={i} className="kpi-card !rounded-[3rem] p-12 bg-surface-800 border border-white/5 shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative overflow-hidden group text-left pointer-events-auto">
                      <div className="p-5 w-fit rounded-2xl bg-surface-900 border border-white/5 mb-10 group-hover:bg-accent-primary transition-all shadow-2xl">
                        <k.icon className={`w-8 h-8 ${k.color} group-hover:text-black`} />
                      </div>
                      <p className="text-3xl md:text-5xl font-display font-black text-text-primary tracking-tighter italic leading-none mb-4">{k.v}</p>
                      <p className="text-[12px] text-text-muted font-black uppercase tracking-[0.3em] opacity-40 italic">{k.l}</p>
                    </div>
                  ))}
                </div>
              </>
            )}

            {(activeTab === 'dre' || activeTab === 'idr') && (
              <div className="kpi-card !rounded-[4rem] p-16 bg-surface-800 border border-white/10 shadow-2xl text-left min-h-[500px] flex flex-col items-center justify-center space-y-10 pointer-events-auto backdrop-blur-3xl">
                 <div className="w-32 h-32 rounded-[4rem] bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center shadow-[0_0_50px_rgba(var(--accent-rgb),0.1)]">
                    <BarChart3 className="w-16 h-16 text-accent-primary animate-pulse" />
                 </div>
                 <div className="text-center space-y-4">
                    <h2 className="text-4xl font-display font-black text-text-primary uppercase italic tracking-tighter leading-none">Demonstrativo de <br /><span className="text-accent-primary">Performance Unificada</span></h2>
                    <p className="text-[13px] text-text-muted font-black uppercase tracking-[0.4em] opacity-40">Sincronizando registros com o Banco de Dados Central...</p>
                 </div>
                 <button 
                  onClick={(e) => { e.preventDefault(); alert('Gerando PDF Estratégico... 📄🥋'); }}
                  className="px-12 py-6 bg-surface-700 text-text-primary rounded-[2rem] text-[11px] font-black uppercase tracking-[0.3em] hover:bg-accent-primary hover:text-black transition-all border border-white/5 shadow-2xl active:scale-95 pointer-events-auto"
                 >
                    GERAR RELATÓRIO PDF EXECUTIVO
                 </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
