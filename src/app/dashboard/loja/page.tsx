'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  ShoppingBag, Package, TrendingUp, AlertTriangle, Plus, Search, 
  Filter, DollarSign, BarChart3, ArrowUpRight, ArrowDownRight, X, 
  CheckCircle2, Info, Receipt, TrendingDown, Target
} from 'lucide-react'

export default function StorePage() {
  const [products, setProducts] = useState([
    { id: 1, name: 'Kimono GFTeam Gold Edition', category: 'Uniformes', stock: 12, price: 450, cost: 280, status: 'Em Estoque' },
    { id: 2, name: 'Patch Matriz Bordado', category: 'Acessórios', stock: 45, price: 35, cost: 8, status: 'Em Estoque' },
    { id: 3, name: 'Whey Protein Isolado', category: 'Suplementos', stock: 3, price: 180, cost: 110, status: 'Estoque Baixo' },
    { id: 4, name: 'Faixa Preta Premium', category: 'Equipamento', stock: 0, price: 120, cost: 55, status: 'Esgotado' },
  ])

  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [showStockModal, setShowStockModal] = useState(false)
  const [showProfitModal, setShowProfitModal] = useState(false)
  const [stockAdd, setStockAdd] = useState(0)

  const handleStockUpdate = () => {
    setProducts(prev => prev.map(p => 
      p.id === selectedProduct.id ? { ...p, stock: p.stock + stockAdd, status: (p.stock + stockAdd) > 5 ? 'Em Estoque' : (p.stock + stockAdd) > 0 ? 'Estoque Baixo' : 'Esgotado' } : p
    ))
    setShowStockModal(false)
    setStockAdd(0)
  }

  return (
    <div className="p-4 md:p-10 space-y-10 animate-fade-in relative z-10 pointer-events-auto text-left">
      
      {/* Stock Entry Modal */}
      <AnimatePresence>
        {showStockModal && selectedProduct && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowStockModal(false)} />
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-surface-800 border border-white/10 w-full max-w-md rounded-[3rem] p-10 relative z-10 shadow-2xl">
                <h2 className="text-2xl font-display font-black text-text-primary uppercase italic tracking-tighter mb-2">Entrada de <span className="text-accent-primary">Estoque</span></h2>
                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-8">{selectedProduct.name}</p>
                
                <div className="space-y-6">
                   <div className="p-6 bg-surface-900 rounded-2xl border border-white/5 flex justify-between items-center shadow-inner">
                      <div>
                         <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Stock Atual</p>
                         <p className="text-3xl font-display font-black text-text-primary">{selectedProduct.stock} un.</p>
                      </div>
                      <ArrowUpRight className="w-8 h-8 text-accent-primary/20" />
                   </div>
                   
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-2">Quantidade a Adicionar</label>
                      <input 
                        type="number" 
                        value={stockAdd} 
                        onChange={(e) => setStockAdd(Number(e.target.value))}
                        className="w-full bg-surface-900 border border-white/10 rounded-2xl px-6 py-4 text-xl font-bold text-accent-primary outline-none focus:border-accent-primary shadow-inner" 
                        placeholder="0"
                      />
                   </div>
                   
                   <div className="flex gap-4 pt-4">
                      <button onClick={() => setShowStockModal(false)} className="flex-1 py-4 rounded-xl bg-surface-700 text-text-primary font-black uppercase text-xs">Cancelar</button>
                      <button onClick={handleStockUpdate} className="flex-1 py-4 rounded-xl bg-accent-primary text-black font-black uppercase text-xs shadow-lg shadow-accent-primary/20">Confirmar</button>
                   </div>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Profit Analysis Modal */}
      <AnimatePresence>
        {showProfitModal && selectedProduct && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowProfitModal(false)} />
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-surface-800 border border-white/10 w-full max-w-lg rounded-[3.5rem] p-10 md:p-14 relative z-10 shadow-2xl">
                <div className="flex items-center gap-4 mb-10">
                   <div className="w-16 h-16 rounded-2xl bg-accent-primary/10 flex items-center justify-center border border-accent-primary/20 shadow-inner">
                      <BarChart3 className="w-8 h-8 text-accent-primary" />
                   </div>
                   <div>
                      <h2 className="text-3xl font-display font-black text-text-primary uppercase italic tracking-tighter leading-none">Análise de <br/><span className="text-accent-primary italic">Lucratividade</span></h2>
                      <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-2">{selectedProduct.name}</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-10">
                   <div className="p-6 bg-surface-900 rounded-3xl border border-white/5 shadow-inner">
                      <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Preço de Venda</p>
                      <p className="text-2xl font-black text-text-primary italic">R$ {selectedProduct.price.toFixed(2)}</p>
                   </div>
                   <div className="p-6 bg-surface-900 rounded-3xl border border-white/5 shadow-inner">
                      <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">Custo Unitário</p>
                      <p className="text-2xl font-black text-gold-400 italic">R$ {selectedProduct.cost.toFixed(2)}</p>
                   </div>
                </div>

                <div className="space-y-4 mb-10">
                   <div className="flex items-center justify-between p-5 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                      <div className="flex items-center gap-3 font-black text-emerald-400">
                         <TrendingUp className="w-4 h-4" />
                         <span className="text-[10px] uppercase tracking-widest">Lucro por Unidade</span>
                      </div>
                      <p className="text-xl font-black text-emerald-400">R$ {(selectedProduct.price - selectedProduct.cost).toFixed(2)}</p>
                   </div>
                   <div className="flex items-center justify-between p-5 bg-surface-700 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-3 font-black text-text-primary">
                         <Target className="w-4 h-4 text-accent-primary" />
                         <span className="text-[10px] uppercase tracking-widest">Margem Bruta</span>
                      </div>
                      <p className="text-xl font-black text-accent-primary italic"> {(((selectedProduct.price - selectedProduct.cost) / selectedProduct.price) * 100).toFixed(0)}% </p>
                   </div>
                </div>

                <div className="p-8 bg-surface-900 rounded-[2.5rem] border border-white/5 shadow-inner">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4 opacity-40">Potencial Total em Estoque</p>
                    <div className="flex items-end justify-between">
                       <div>
                          <p className="text-xs font-black text-text-primary uppercase mb-1">Faturamento Previsto</p>
                          <p className="text-4xl font-display font-black text-text-primary italic tracking-tight">R$ {(selectedProduct.price * selectedProduct.stock).toLocaleString()}</p>
                       </div>
                       <div className="text-right">
                          <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">ROI Est.</p>
                          <p className="text-2xl font-black text-emerald-400 italic">+{((selectedProduct.price / selectedProduct.cost) * 100 - 100).toFixed(0)}%</p>
                       </div>
                    </div>
                </div>

                <button onClick={() => setShowProfitModal(false)} className="w-full mt-10 py-5 bg-surface-700 hover:bg-surface-600 rounded-2xl font-black uppercase text-xs tracking-widest transition-all">Fechar Relatório</button>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
        <div className="text-left">
          <h1 className="text-4xl md:text-6xl font-display font-black text-text-primary tracking-tighter italic uppercase leading-none">Loja & <span className="text-accent-primary">Estoque</span></h1>
          <p className="text-[11px] text-text-muted font-black uppercase tracking-[0.4em] opacity-40 mt-4">Gerencie produtos, vendas e lucratividade da unidade</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-8 py-4 rounded-2xl bg-surface-800 border border-white/5 text-[11px] font-black text-text-primary uppercase tracking-widest hover:border-accent-primary/50 transition-all flex items-center gap-3 shadow-xl">
            <Package className="w-5 h-5" />
            <span>Entrada em Massa</span>
          </button>
          <button className="px-8 py-4 rounded-2xl bg-accent-primary text-black text-[11px] font-black uppercase tracking-widest shadow-2xl shadow-accent-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
            <Plus className="w-5 h-5 stroke-[3]" />
            <span>Novo Item</span>
          </button>
        </div>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Vendas Mensais', value: 'R$ 12.840', detail: '+8% vs anterior', color: 'text-emerald-400', icon: ArrowUpRight },
          { label: 'CMV Médio', value: '38%', detail: 'Meta: 35%', color: 'text-amber-400', icon: BarChart3 },
          { label: 'Valor Reposição', value: 'R$ 8.200', detail: 'Preço de custo', color: 'text-text-muted', icon: Receipt },
          { label: 'Alertas Críticos', value: '05', detail: 'Reposição Urgente', color: 'text-red-500', icon: AlertTriangle, bg: 'bg-red-500/5 border-red-500/20' }
        ].map((s, i) => (
          <div key={i} className={`kpi-card !rounded-[2.5rem] p-8 bg-surface-800 border-white/5 shadow-2xl text-left ${s.bg || ''}`}>
             <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-6 opacity-60">{s.label}</p>
             <p className="text-4xl font-display font-black text-text-primary italic tracking-tight">{s.value}</p>
             <div className="flex items-center gap-2 mt-4">
                <s.icon className={`w-3.5 h-3.5 ${s.color}`} />
                <span className={`text-[9px] font-black uppercase tracking-widest ${s.color}`}>{s.detail}</span>
             </div>
          </div>
        ))}
      </div>

      {/* Product Table */}
      <div className="kpi-card !rounded-[3.5rem] p-4 bg-surface-800 border border-white/5 shadow-2xl relative">
        <div className="p-8 pb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5">
          <div className="text-left">
             <h2 className="text-2xl font-display font-black text-text-primary uppercase italic tracking-tighter">Inventário Elite</h2>
             <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest mt-1 opacity-40">Listagem detalhada de SKUs e lucratividade</p>
          </div>
          <div className="flex items-center gap-4 bg-surface-900 rounded-[1.5rem] px-6 py-4 border border-white/5 shadow-inner w-full md:w-auto">
            <Search className="w-5 h-5 text-accent-primary opacity-40" />
            <input type="text" placeholder="BUSCAR PRODUTO..." className="bg-transparent outline-none text-[11px] text-text-primary font-black uppercase tracking-widest w-full md:w-48 placeholder:opacity-20" />
          </div>
        </div>
        
        <div className="overflow-x-auto p-4 custom-scrollbar">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em] border-b border-white/5">
                <th className="pb-10 px-6">Produto</th>
                <th className="pb-10 px-6">Categoria</th>
                <th className="pb-10 px-6">Estoque</th>
                <th className="pb-10 px-6">Venda</th>
                <th className="pb-10 px-6">Margem</th>
                <th className="pb-10 px-6">Status</th>
                <th className="pb-10 px-6 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-bold">
              {products.map(prod => {
                const margin = (((prod.price - prod.cost) / prod.price) * 100).toFixed(0)
                const isLow = prod.status === 'Estoque Baixo'
                const isOut = prod.status === 'Esgotado'

                return (
                  <tr key={prod.id} className="group hover:bg-surface-700/30 transition-all pointer-events-auto">
                    <td className="py-8 px-6 text-left">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-[1.1rem] bg-surface-900 flex items-center justify-center border border-white/5 shadow-inner group-hover:bg-accent-primary group-hover:text-black transition-all">
                          <ShoppingBag className="w-5 h-5" />
                        </div>
                        <p className="text-sm font-black text-text-primary uppercase italic tracking-tighter leading-none">{prod.name}</p>
                      </div>
                    </td>
                    <td className="py-8 px-6 text-left border-none">
                      <span className="text-[9px] font-black text-text-muted bg-surface-900 px-3.5 py-1.5 rounded-lg border border-white/5 uppercase tracking-widest">{prod.category}</span>
                    </td>
                    <td className="py-8 px-6 text-left">
                      <div className="flex flex-col gap-2">
                        <span className={`text-base font-black italic ${isOut ? 'text-red-500' : isLow ? 'text-gold-400' : 'text-text-primary'}`}>
                          {prod.stock} UN.
                        </span>
                        <div className="w-16 h-1.5 bg-surface-900 rounded-full overflow-hidden shadow-inner">
                           <div className={`h-full ${isOut ? 'bg-red-500' : isLow ? 'bg-gold-400' : 'bg-accent-primary'} transition-all duration-500`} style={{ width: `${Math.min((prod.stock/20)*100, 100)}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-8 px-6 text-left text-sm font-black text-text-primary italic">R$ {prod.price.toFixed(2)}</td>
                    <td className="py-8 px-6 text-left">
                      <div className="flex items-center gap-2 text-emerald-400 font-black text-[12px] italic">
                        <ArrowUpRight className="w-4 h-4" />
                        {margin}%
                      </div>
                    </td>
                    <td className="py-8 px-6 text-left">
                      <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest inline-flex border-2 shadow-xl ${
                        isOut ? 'bg-red-500/5 text-red-500 border-red-500/20' : 
                        isLow ? 'bg-gold-500/5 text-gold-400 border-gold-500/20' : 
                        'bg-emerald-500/5 text-emerald-400 border-emerald-500/20'
                      }`}>
                         {prod.status}
                      </div>
                    </td>
                    <td className="py-8 px-6">
                      <div className="flex items-center justify-end gap-3">
                        <button 
                          onClick={() => { setSelectedProduct(prod); setShowStockModal(true); }}
                          className="w-12 h-12 rounded-2xl bg-surface-900 border border-white/5 flex items-center justify-center text-accent-primary hover:bg-accent-primary hover:text-black transition-all shadow-xl active:scale-95 pointer-events-auto"
                        >
                          <Plus className="w-5 h-5 stroke-[3]" />
                        </button>
                        <button 
                          onClick={() => { setSelectedProduct(prod); setShowProfitModal(true); }}
                          className="w-12 h-12 rounded-2xl bg-surface-900 border border-white/5 flex items-center justify-center text-text-dim hover:bg-surface-700 hover:text-white transition-all shadow-xl active:scale-95 pointer-events-auto"
                        >
                          <BarChart3 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
