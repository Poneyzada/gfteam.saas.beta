'use client'

import { useState } from 'react'
import { ShoppingBag, Package, TrendingUp, AlertTriangle, Plus, Search, Filter, DollarSign, BarChart3, ArrowUpRight, ArrowDownRight } from 'lucide-react'

export default function StorePage() {
  const [products] = useState([
    { id: 1, name: 'Kimono GFTeam Gold Edition', category: 'Uniformes', stock: 12, price: 450, cost: 280, status: 'Em Estoque' },
    { id: 2, name: 'Patch Matriz Bordado', category: 'Acessórios', stock: 45, price: 35, cost: 8, status: 'Em Estoque' },
    { id: 3, name: 'Whey Protein Isolado', category: 'Suplementos', stock: 3, price: 180, cost: 110, status: 'Estoque Baixo' },
    { id: 4, name: 'Faixa Preta Premium', category: 'Equipamento', stock: 0, price: 120, cost: 55, status: 'Esgotado' },
  ])

  return (
    <div className="p-10 space-y-10 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-black text-text-primary tracking-tight">Loja & Estoque</h1>
          <p className="text-text-muted font-semibold mt-1">Gerencie produtos, vendas e lucratividade da unidade</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-ghost flex items-center gap-2">
            <Package className="w-4 h-4" />
            Entrada de Estoque
          </button>
          <button className="btn-primary flex items-center gap-2 bg-accent-primary text-surface-900 border-none">
            <Plus className="w-4 h-4" />
            Novo Produto
          </button>
        </div>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="kpi-card !rounded-[2.5rem] p-6">
          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Vendas do Mês</p>
          <p className="text-3xl font-display font-black text-text-primary mt-1">R$ 12.840</p>
          <div className="flex items-center gap-1.5 mt-2 text-emerald-400 text-[10px] font-bold">
            <ArrowUpRight className="w-3 h-3" />
            +8% vs mês ant.
          </div>
        </div>
        <div className="kpi-card !rounded-[2.5rem] p-6">
          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">CMV Médio</p>
          <p className="text-3xl font-display font-black text-text-primary mt-1">38%</p>
          <div className="flex items-center gap-1.5 mt-2 text-gold-400 text-[10px] font-bold">
            <BarChart3 className="w-3 h-3" />
            Meta: 35%
          </div>
        </div>
        <div className="kpi-card !rounded-[2.5rem] p-6">
          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Valor em Estoque</p>
          <p className="text-3xl font-display font-black text-text-primary mt-1">R$ 8.200</p>
          <p className="text-[10px] text-text-muted mt-2 font-semibold">Preço de custo</p>
        </div>
        <div className="kpi-card !rounded-[2.5rem] p-6 border-red-500/20 bg-red-500/5">
          <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Alertas de Reposição</p>
          <p className="text-3xl font-display font-black text-text-primary mt-1">05</p>
          <p className="text-[10px] text-red-500/60 mt-2 font-bold uppercase">Atenção Crítica</p>
        </div>
      </div>

      {/* Product Table */}
      <div className="kpi-card !rounded-[3.5rem] p-4">
        <div className="p-8 flex items-center justify-between border-b border-white/5 mb-4">
          <h2 className="text-2xl font-display font-black text-text-primary">Inventário de Produtos</h2>
          <div className="flex items-center gap-4 bg-surface-600 rounded-2xl px-4 py-2 border border-white/5">
            <Search className="w-4 h-4 text-text-muted" />
            <input type="text" placeholder="Buscar produto..." className="bg-transparent outline-none text-sm text-text-primary font-medium" />
          </div>
        </div>
        
        <div className="overflow-x-auto p-4">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[10px] font-black text-text-muted uppercase tracking-widest border-b border-white/5">
                <th className="pb-6 px-4">Produto</th>
                <th className="pb-6 px-4">Categoria</th>
                <th className="pb-6 px-4">Estoque</th>
                <th className="pb-6 px-4">Preço (Venda)</th>
                <th className="pb-6 px-4">Margem</th>
                <th className="pb-6 px-4">Status</th>
                <th className="pb-6 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map(prod => {
                const margin = (((prod.price - prod.cost) / prod.price) * 100).toFixed(0)
                const isLow = prod.status === 'Estoque Baixo'
                const isOut = prod.status === 'Esgotado'

                return (
                  <tr key={prod.id} className="group hover:bg-surface-600/30 transition-all">
                    <td className="py-6 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-surface-600 flex items-center justify-center border border-white/5">
                          <ShoppingBag className="w-4 h-4 text-text-primary" />
                        </div>
                        <p className="text-sm font-bold text-text-primary">{prod.name}</p>
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <span className="text-xs font-semibold text-text-secondary bg-surface-600 px-3 py-1 rounded-lg border border-white/5 uppercase">{prod.category}</span>
                    </td>
                    <td className="py-6 px-4">
                      <div className="flex flex-col">
                        <span className={`text-sm font-bold ${isOut ? 'text-red-500' : isLow ? 'text-gold-400' : 'text-text-primary'}`}>
                          {prod.stock} un.
                        </span>
                        <div className="w-12 h-1 bg-surface-600 rounded-full mt-1.5 overflow-hidden">
                           <div className={`h-full ${isOut ? 'bg-red-500' : isLow ? 'bg-gold-400' : 'bg-accent-primary'}`} style={{ width: `${Math.min((prod.stock/20)*100, 100)}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="py-6 px-4 text-sm font-bold text-text-primary">R$ {prod.price.toFixed(2)}</td>
                    <td className="py-6 px-4">
                      <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                        <ArrowUpRight className="w-3 h-3" />
                        {margin}%
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest inline-flex border ${
                        isOut ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                        isLow ? 'bg-gold-500/10 text-gold-400 border-gold-500/20' : 
                        'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      }`}>
                         {prod.status}
                      </div>
                    </td>
                    <td className="py-6 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="w-10 h-10 rounded-xl bg-surface-600 flex items-center justify-center text-text-muted hover:text-text-primary transition-all">
                          <Plus className="w-4 h-4" />
                        </button>
                        <button className="w-10 h-10 rounded-xl bg-surface-600 flex items-center justify-center text-text-muted hover:text-text-primary transition-all">
                          <BarChart3 className="w-4 h-4" />
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
