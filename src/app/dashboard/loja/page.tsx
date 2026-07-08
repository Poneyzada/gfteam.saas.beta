'use client'

import { useState } from 'react'
import { 
  ShoppingBag, Package, Plus, Search, 
  DollarSign, BarChart3, ArrowUpRight, 
  Info, ShoppingCart, X, CheckCircle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function StorePage() {
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null)
  const [showSuccessToast, setShowSuccessToast] = useState(false)
  const [products] = useState([
    { id: 1, name: 'Kimono GFTeam Gold Edition', category: 'Uniformes', stock: 12, price: 450, status: 'Em Estoque', description: 'Kimono trançado 450g de alta resistência com patches oficiais bordados.' },
    { id: 2, name: 'Patch Matriz Bordado', category: 'Acessórios', stock: 45, price: 35, status: 'Em Estoque', description: 'Patch oficial GFTeam para personalização de uniformes e acessórios.' },
    { id: 3, name: 'Whey Protein Isolado', category: 'Suplementos', stock: 3, price: 180, status: 'Estoque Baixo', description: 'Suplemento proteico isolado de rápida absorção para recuperação muscular.' },
    { id: 4, name: 'Faixa Preta Premium', category: 'Equipamento', stock: 0, price: 120, status: 'Esgotado', description: 'Faixa de alta qualidade com ponteira e bordado personalizado.' },
  ])

  const handleAddToCart = (name: string) => {
    setShowSuccessToast(true)
    setTimeout(() => setShowSuccessToast(false), 3000)
    console.log(`Adicionado ao carrinho: ${name}`)
  }

  return (
    <div className="p-4 md:p-10 space-y-10 animate-fade-in bg-app min-h-screen text-left relative z-30">
      {/* Toast de Sucesso */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 right-10 z-[500] bg-emerald-600 text-white px-8 py-5 rounded-2xl shadow-2xl flex items-center gap-4 border border-emerald-400/20"
          >
            <CheckCircle className="w-6 h-6" />
            <span className="font-black uppercase text-xs tracking-widest">Produto adicionado controlado!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-black dark:text-white uppercase italic tracking-tighter leading-none">Loja <span className="text-accent-primary italic">GFTeam</span></h1>
          <p className="text-[10px] text-black dark:text-white font-black uppercase tracking-[0.3em] mt-3 opacity-60">Gestão de Inventário e Suprimentos</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-6 py-4 rounded-xl bg-surface-800 border border-black/10 dark:border-white/10 text-[10px] font-black uppercase text-black dark:text-white hover:bg-surface-700 transition-all cursor-pointer flex items-center gap-3">
            <Package className="w-4 h-4" /> ENTRADA
          </button>
          <button className="px-8 py-4 rounded-xl bg-accent-primary text-black text-[10px] font-black uppercase tracking-widest shadow-xl border-none cursor-pointer flex items-center gap-3">
            <Plus className="w-5 h-5 stroke-[3]" /> NOVO PRODUTO
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Vendas (Mês)', value: 'R$ 12.840', trend: '+8%', icon: DollarSign },
          { label: 'Lucro Médio', value: '42%', trend: 'Meta: 40%', icon: BarChart3 },
          { label: 'Valor em Estoque', value: 'R$ 8.200', trend: 'Custo', icon: Package },
          { label: 'Alertas', value: '05', trend: 'Crítico', icon: ShoppingBag, color: 'text-red-500' }
        ].map((s, i) => (
          <div key={i} className="kpi-card !p-6 bg-surface-900 border-black/10 dark:border-white/10">
            <div className="flex justify-between items-start mb-4">
               <p className="text-[9px] font-black text-black dark:text-white uppercase tracking-widest opacity-60">{s.label}</p>
               <s.icon className={`w-4 h-4 text-accent-primary ${s.color}`} />
            </div>
            <p className="text-3xl font-display font-black text-black dark:text-white italic tracking-tighter">{s.value}</p>
            <p className="text-[9px] font-black text-accent-primary uppercase mt-2">{s.trend}</p>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="kpi-card !p-0 overflow-hidden bg-surface-900 border-black/10 dark:border-white/10 shadow-2xl relative z-[40]">
        <div className="p-8 border-b border-black/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <h2 className="text-2xl font-display font-black text-black dark:text-white uppercase italic tracking-tighter">Inventário Matriz</h2>
           <div className="flex items-center gap-4 bg-surface-800 rounded-xl px-5 py-3 border border-black/10 w-full md:max-w-xs">
              <Search className="w-4 h-4 text-accent-primary" />
              <input type="text" placeholder="BUSCAR PRODUTO..." className="bg-transparent border-none outline-none text-[10px] font-black text-black dark:text-white uppercase tracking-widest w-full" />
           </div>
        </div>

        <div className="overflow-x-auto">
           <table className="w-full text-left">
              <thead>
                 <tr className="bg-surface-800/50 text-[10px] font-black text-black dark:text-white uppercase tracking-[0.2em] border-b border-black/10">
                    <th className="p-6">Produto</th>
                    <th className="p-6">Categoria</th>
                    <th className="p-6">Estoque</th>
                    <th className="p-6">Preço</th>
                    <th className="p-6 text-right">Ações</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-black/10 dark:divide-white/10">
                {products.map(prod => (
                  <tr key={prod.id} className="hover:bg-accent-primary/5 transition-all group">
                    <td className="p-6">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-surface-800 flex items-center justify-center border border-black/10 group-hover:border-accent-primary transition-all">
                             <ShoppingBag className="w-5 h-5 text-accent-primary" />
                          </div>
                          <p className="text-sm font-black text-black dark:text-white uppercase italic">{prod.name}</p>
                       </div>
                    </td>
                    <td className="p-6">
                       <span className="text-[9px] font-black bg-surface-800 text-black dark:text-white px-3 py-1.5 rounded-lg border border-black/10 uppercase">{prod.category}</span>
                    </td>
                    <td className="p-6">
                       <div className="flex flex-col gap-1.5">
                          <span className={`text-[11px] font-black uppercase ${prod.stock === 0 ? 'text-red-500' : prod.stock < 10 ? 'text-accent-primary' : 'text-black dark:text-white'}`}>{prod.stock} UN</span>
                          <div className="w-16 h-1 bg-surface-800 rounded-full overflow-hidden">
                             <div className={`h-full ${prod.stock === 0 ? 'bg-red-500' : 'bg-accent-primary'}`} style={{ width: `${Math.min((prod.stock/20)*100, 100)}%` }} />
                          </div>
                       </div>
                    </td>
                    <td className="p-6">
                       <p className="text-sm font-black text-black dark:text-white">R$ {prod.price.toFixed(2)}</p>
                    </td>
                    <td className="p-6">
                       <div className="flex items-center justify-end gap-3">
                          <button 
                            onClick={() => setSelectedProduct(prod)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-800 border border-black/10 text-[9px] font-black text-black dark:text-white uppercase tracking-widest hover:border-accent-primary hover:bg-surface-700 transition-all cursor-pointer relative z-50 pointer-events-auto"
                          >
                             <Info className="w-3.5 h-3.5" /> DETALHES
                          </button>
                          <button 
                            onClick={() => handleAddToCart(prod.name)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all cursor-pointer border-none shadow-lg relative z-50 pointer-events-auto ${prod.stock === 0 ? 'bg-red-500/10 text-red-500 cursor-not-allowed' : 'bg-accent-primary text-black hover:scale-105 active:scale-95'}`} 
                            disabled={prod.stock === 0}
                          >
                             <ShoppingCart className="w-4 h-4" /> ADICIONAR
                          </button>
                       </div>
                    </td>
                  </tr>
                ))}
              </tbody>
           </table>
        </div>
      </div>

      {/* Modal de Detalhes do Produto */}
      <AnimatePresence>
        {selectedProduct && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setSelectedProduct(null)} />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-surface-800 w-full max-w-lg rounded-[3rem] p-10 border border-black/10 dark:border-white/10 shadow-2xl relative z-[1010] text-left"
            >
              <button 
                onClick={() => setSelectedProduct(null)} 
                className="absolute top-8 right-8 w-12 h-12 rounded-full bg-surface-900 border border-black/10 dark:border-white/10 flex items-center justify-center text-text-primary hover:bg-red-600 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="w-20 h-20 rounded-[2rem] bg-accent-primary flex items-center justify-center text-black mb-8 shadow-xl">
                 <ShoppingBag className="w-10 h-10" />
              </div>
              
              <p className="text-[10px] font-black text-accent-primary uppercase tracking-[0.4em] mb-4">Detalhes do Produto</p>
              <h2 className="text-4xl font-display font-black text-text-primary uppercase italic tracking-tighter leading-none mb-6">{selectedProduct.name}</h2>
              
              <div className="p-6 bg-surface-900 border border-black/10 dark:border-white/10 rounded-2xl mb-10">
                <p className="text-sm font-bold text-text-secondary leading-relaxed">{selectedProduct.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-10">
                <div>
                  <p className="text-[10px] font-black text-text-secondary opacity-70 uppercase mb-2">Preço Unitário</p>
                  <p className="text-3xl font-display font-black text-text-primary">R$ {selectedProduct.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-text-secondary opacity-70 uppercase mb-2">Estoque Disponível</p>
                  <p className={`text-3xl font-display font-black ${selectedProduct.stock === 0 ? 'text-red-500' : 'text-emerald-500'}`}>{selectedProduct.stock} Un</p>
                </div>
              </div>

              <button 
                onClick={() => {
                  handleAddToCart(selectedProduct.name)
                  setSelectedProduct(null)
                }}
                disabled={selectedProduct.stock === 0}
                className={`w-full py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all border-none cursor-pointer flex items-center justify-center gap-3 ${selectedProduct.stock === 0 ? 'bg-surface-700 text-text-secondary/25 cursor-not-allowed' : 'bg-accent-primary text-black hover:scale-105 active:scale-95 shadow-xl shadow-accent-primary/20'}`}
              >
                <ShoppingCart className="w-5 h-5" /> {selectedProduct.stock === 0 ? 'INDISPONÍVEL' : 'ADICIONAR AO CARRINHO'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
