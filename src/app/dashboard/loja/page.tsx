'use client'

import { useState } from 'react'
import { 
  ShoppingBag, Package, TrendingUp, AlertTriangle, 
  Plus, Search, Filter, DollarSign, BarChart3, 
  ArrowUpRight, ArrowDownRight, X, Check, Save 
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function StorePage() {
  const [products, setProducts] = useState([
    { id: 1, name: 'Kimono GFTeam Gold Edition', category: 'Uniformes', stock: 12, price: 450, cost: 280, status: 'Em Estoque' },
    { id: 2, name: 'Patch Matriz Bordado', category: 'Acessórios', stock: 45, price: 35, cost: 8, status: 'Em Estoque' },
    { id: 3, name: 'Whey Protein Isolado', category: 'Suplementos', stock: 3, price: 180, cost: 110, status: 'Estoque Baixo' },
    { id: 4, name: 'Faixa Preta Premium', category: 'Equipamento', stock: 0, price: 120, cost: 55, status: 'Esgotado' },
  ])

  const [activeModal, setActiveModal] = useState<'new' | 'entry' | null>(null)
  const [newProd, setNewProd] = useState({ name: '', price: '', stock: '' })

  const handleAddProduct = () => {
    if (!newProd.name || !newProd.price) return
    setProducts([...products, { 
      id: Date.now(), 
      name: newProd.name, 
      category: 'Geral', 
      stock: Math.max(0, Number(newProd.stock)), 
      price: Number(newProd.price.replace(',', '.')), 
      cost: 0, 
      status: 'Em Estoque' 
    }])
    setActiveModal(null)
    setNewProd({ name: '', price: '', stock: '' })
  }

  return (
    <div className="p-4 md:p-10 space-y-10 animate-fade-in min-h-screen pb-32 text-left bg-surface-900 relative z-30 pointer-events-auto">
      
      {/* Product Management Modals */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-3xl pointer-events-auto">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: 20 }} 
              className="bg-surface-800 w-full max-w-md rounded-[3rem] p-12 border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] relative text-left pointer-events-auto"
            >
               <button onClick={() => setActiveModal(null)} className="absolute top-8 right-8 p-3 text-text-muted hover:text-white border border-white/5 rounded-full bg-surface-900 shadow-xl pointer-events-auto z-50"><X className="w-6 h-6" /></button>
               <h2 className="text-3xl font-display font-black text-text-primary uppercase italic tracking-tighter mb-10 leading-none">
                 {activeModal === 'new' ? 'Novo Produto' : 'Entrada em Estoque'}
               </h2>
               
               <div className="space-y-8 pointer-events-auto">
                  <div className="space-y-3">
                     <label className="text-[11px] font-black text-text-muted uppercase tracking-widest pl-2 opacity-60">DESCRIÇÃO DO ITEM</label>
                     <input 
                      type="text" 
                      value={newProd.name}
                      onChange={(e) => setNewProd({...newProd, name: e.target.value})}
                      className="w-full bg-surface-900 border border-white/10 rounded-2xl px-6 py-5 text-base font-bold text-text-primary focus:border-accent-primary outline-none shadow-inner" 
                      placeholder="Ex: Kimono A2, Whey..." 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-text-muted uppercase tracking-widest pl-2 opacity-60">PREÇO (R$)</label>
                      <input 
                        type="text" 
                        value={newProd.price}
                        onChange={(e) => setNewProd({...newProd, price: e.target.value})}
                        className="w-full bg-surface-900 border border-white/10 rounded-2xl px-6 py-5 text-base font-bold text-text-primary focus:border-accent-primary outline-none shadow-inner" 
                        placeholder="0,00" 
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[11px] font-black text-text-muted uppercase tracking-widest pl-2 opacity-60">QTD NOVO</label>
                      <input 
                        type="text" 
                        value={newProd.stock}
                        onChange={(e) => setNewProd({...newProd, stock: e.target.value})}
                        className="w-full bg-surface-900 border border-white/10 rounded-2xl px-6 py-5 text-base font-bold text-text-primary focus:border-accent-primary outline-none shadow-inner" 
                        placeholder="0" 
                      />
                    </div>
                  </div>
                  <button 
                    onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleAddProduct(); }} 
                    className="w-full py-6 bg-accent-primary text-black rounded-2xl font-black uppercase text-[12px] tracking-[0.2em] shadow-2xl shadow-accent-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 pointer-events-auto"
                  >
                    <Check className="w-6 h-6 stroke-[3]" />
                    <span className="font-black">{activeModal === 'new' ? 'CADASTRAR NA MATRIZ' : 'CONFIRMAR ENTRADA'}</span>
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-10 relative z-40 pointer-events-auto">
        <div className="text-left">
          <h1 className="text-4xl md:text-6xl font-display font-black text-text-primary uppercase italic tracking-tighter leading-none mb-4">Loja <br /><span className="text-accent-primary italic">Matriz Operacional</span></h1>
          <p className="text-[11px] text-text-muted font-black uppercase tracking-[0.4em] opacity-40">Engenharia de estoque e movimentação física unificada</p>
        </div>
        <div className="flex items-center gap-4 relative z-50 pointer-events-auto">
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveModal('entry'); }}
            className="px-10 py-5 bg-surface-700 text-text-primary rounded-[2rem] text-[11px] font-black uppercase tracking-widest hover:bg-surface-600 transition-all border border-white/5 flex items-center gap-4 pointer-events-auto active:scale-95"
          >
            <Package className="w-6 h-6" /> <span className="font-black">ENTRADA</span>
          </button>
          <button 
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setActiveModal('new'); }}
            className="px-10 py-5 bg-accent-primary text-black rounded-[2rem] text-[12px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-accent-primary/20 hover:scale-105 transition-all border-none active:scale-95 pointer-events-auto flex items-center gap-4"
          >
            <Plus className="w-7 h-7 stroke-[3]" /> <span className="font-black">NOVO ITEM</span>
          </button>
        </div>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 relative z-30 pointer-events-auto">
        {[
          { l: 'Faturamento Mês', v: 'R$ 12.840', i: ShoppingBag, c: 'text-accent-primary' },
          { l: 'Profit Bruto', v: '38%', i: DollarSign, c: 'text-emerald-400' },
          { l: 'Valor Imobilizado', v: 'R$ 8.200', i: TrendingUp, c: 'text-blue-400' },
          { l: 'Alerte Estoque', v: '05 Itens', i: AlertTriangle, c: 'text-red-500' },
        ].map((s, i) => (
          <div key={i} className="kpi-card !rounded-[3rem] p-10 bg-surface-800 border border-white/5 shadow-2xl group text-left pointer-events-auto">
             <div className="w-14 h-14 rounded-2xl bg-surface-900 border border-white/5 flex items-center justify-center mb-10 group-hover:bg-accent-primary transition-all shadow-xl">
                <s.i className={`w-7 h-7 ${s.c} group-hover:text-black`} />
             </div>
             <p className="text-3xl md:text-4xl font-display font-black text-text-primary tracking-tighter italic leading-none mb-3">{s.v}</p>
             <p className="text-[11px] text-text-muted font-black uppercase tracking-widest opacity-40 italic">{s.l}</p>
          </div>
        ))}
      </div>

      {/* Product Table */}
      <div className="kpi-card !rounded-[4rem] bg-surface-800 border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.4)] overflow-hidden text-left relative z-40 pointer-events-auto">
        <div className="p-12 flex flex-col md:flex-row items-center justify-between border-b border-white/5 gap-10">
          <h2 className="text-3xl font-display font-black text-text-primary uppercase italic tracking-tighter leading-none">Inventário Estratégico</h2>
          <div className="flex items-center gap-6 bg-surface-900 rounded-[2rem] px-8 py-5 border border-white/5 w-full md:w-[450px] shadow-inner pointer-events-auto">
            <Search className="w-6 h-6 text-text-muted" />
            <input type="text" placeholder="BUSCAR ITEM NO ARMAZÉM..." className="bg-transparent outline-none text-[11px] text-text-primary font-black uppercase tracking-[0.25em] w-full placeholder:text-text-muted/20" />
          </div>
        </div>
        
        <div className="overflow-x-auto p-8 pointer-events-auto">
          <table className="w-full text-left pointer-events-auto">
            <thead>
              <tr className="text-[11px] font-black text-text-muted uppercase tracking-[0.3em] border-b border-white/5">
                <th className="pb-10 px-8">Produto</th>
                <th className="pb-10 px-8 hidden md:table-cell">Categoria</th>
                <th className="pb-10 px-8">Nível de Estoque</th>
                <th className="pb-10 px-8">Preço Final</th>
                <th className="pb-10 px-8 text-right">Ações Rápidas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map(prod => (
                <tr key={prod.id} className="group hover:bg-white/[0.03] transition-all pointer-events-auto">
                  <td className="py-10 px-8">
                    <div className="flex items-center gap-8">
                      <div className="w-16 h-16 rounded-[1.8rem] bg-surface-900 flex items-center justify-center border border-white/10 group-hover:border-accent-primary/40 transition-all shadow-2xl text-text-muted group-hover:text-accent-primary group-hover:scale-110">
                        <ShoppingBag className="w-8 h-8 !text-current" />
                      </div>
                      <div className="text-left">
                        <p className="text-lg font-black text-text-primary uppercase tracking-tighter leading-tight mb-1">{prod.name}</p>
                        <p className="text-[10px] text-text-muted font-black uppercase tracking-widest md:hidden opacity-60">{prod.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-10 px-8 hidden md:table-cell">
                    <span className="text-[10px] font-black text-text-secondary bg-surface-900 border border-white/10 px-5 py-2.5 rounded-xl uppercase tracking-[0.2em] italic shadow-lg">{prod.category}</span>
                  </td>
                  <td className="py-10 px-8">
                    <div className="flex flex-col">
                       <span className="text-lg font-black text-text-primary italic leading-none mb-3">{prod.stock} UNIDADES</span>
                       <div className="w-24 h-2 bg-surface-900 rounded-full overflow-hidden border border-white/5 shadow-inner">
                          <div className={`h-full ${prod.status === 'Esgotado' ? 'bg-red-500' : prod.status === 'Estoque Baixo' ? 'bg-amber-400' : 'bg-accent-primary'}`} style={{ width: `${Math.min((prod.stock/20)*100, 100)}%` }} />
                       </div>
                    </div>
                  </td>
                  <td className="py-10 px-8 text-xl font-black text-text-primary font-display italic tracking-tight">R$ {prod.price.toFixed(2)}</td>
                  <td className="py-10 px-8">
                      <div className="flex items-center justify-end gap-4 relative z-50 pointer-events-auto">
                         <button 
                           onClick={(e) => { e.preventDefault(); e.stopPropagation(); alert(`Iniciando venda: ${prod.name}`); }}
                           className="w-14 h-14 rounded-[1.5rem] bg-surface-900 text-text-muted hover:bg-accent-primary hover:text-black transition-all border border-white/10 shadow-2xl flex items-center justify-center group/btn pointer-events-auto active:scale-90"
                           title="Lançar Venda"
                         >
                            <Plus className="w-6 h-6 group-hover/btn:scale-110 !text-current stroke-[3]" />
                         </button>
                         <button 
                           onClick={(e) => { e.preventDefault(); e.stopPropagation(); alert(`Ver Analytics de ${prod.name}`); }}
                           className="w-14 h-14 rounded-[1.5rem] bg-surface-900 text-text-muted hover:bg-blue-500 hover:text-black transition-all border border-white/10 shadow-2xl flex items-center justify-center group/btn pointer-events-auto active:scale-90"
                           title="Análise de Giro"
                         >
                            <BarChart3 className="w-6 h-6 group-hover/btn:scale-110 !text-current" />
                         </button>
                      </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
