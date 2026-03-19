'use client'

import { useState } from 'react'
import { FileText, TrendingUp, TrendingDown, DollarSign, Activity, PieChart, BarChart3, ArrowDown, ArrowUp, Calendar, Download, Filter } from 'lucide-react'

export default function FinancialReportsPage() {
  const [reportType, setReportType] = useState<'DRE' | 'IDR'>('DRE')

  return (
    <div className="p-10 space-y-10 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-black text-text-primary tracking-tight">Relatórios Financeiros</h1>
          <p className="text-text-muted font-semibold mt-1">Visão analítica de performance e lucratividade (Matriz Style)</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-ghost flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Março 2026
          </button>
          <button className="btn-primary flex items-center gap-2 bg-accent-primary text-surface-900 border-none">
            <Download className="w-4 h-4" />
            Exportar PDF
          </button>
        </div>
      </div>

      {/* Report Type Selector */}
      <div className="flex gap-4">
        {[
          { id: 'DRE', label: 'DRE (Demonstrativo)', icon: FileText },
          { id: 'IDR', label: 'IDR (Índice de Performance)', icon: Activity },
        ].map(item => (
          <button
            key={item.id}
            onClick={() => setReportType(item.id as any)}
            className={`flex items-center gap-3 px-8 py-4 rounded-[1.5rem] border transition-all ${
              reportType === item.id 
              ? 'bg-accent-primary border-accent-primary text-[#09090B] font-bold shadow-lg accent-shadow' 
              : 'bg-surface-600 border-white/5 text-text-muted hover:text-text-primary font-semibold'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </div>

      {reportType === 'DRE' ? (
        <div className="space-y-8">
          {/* DRE Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="kpi-card !rounded-[3rem] p-8 border-emerald-500/20">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Lucro Líquido</p>
              <p className="text-4xl font-display font-black text-text-primary mt-2">R$ 14.280,00</p>
              <div className="flex items-center gap-1.5 mt-4 text-emerald-400 text-xs font-bold bg-emerald-500/10 px-3 py-1 rounded-full w-fit">
                <ArrowUp className="w-3 h-3" />
                22.4% Margem
              </div>
            </div>
            <div className="kpi-card !rounded-[3rem] p-8">
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Receita Bruta</p>
              <p className="text-4xl font-display font-black text-text-primary mt-2">R$ 62.400,00</p>
              <p className="text-[10px] text-text-muted mt-4 font-semibold">Incluindo Mensalidades e Loja</p>
            </div>
            <div className="kpi-card !rounded-[3rem] p-8 border-red-500/20">
              <p className="text-[10px] font-black text-red-400 uppercase tracking-widest">Despesas Totais</p>
              <p className="text-4xl font-display font-black text-text-primary mt-2">R$ 48.120,00</p>
              <div className="flex items-center gap-1.5 mt-4 text-red-500 text-xs font-bold bg-red-500/10 px-3 py-1 rounded-full w-fit">
                <ArrowDown className="w-3 h-3" />
                -2% vs mês ant.
              </div>
            </div>
          </div>

          {/* Detailed DRE Table */}
          <div className="kpi-card !rounded-[3.5rem] p-10 space-y-8">
            <div className="flex items-center justify-between border-b border-white/5 pb-6">
              <h2 className="text-2xl font-display font-black text-text-primary">Demonstrativo Detalhado</h2>
              <div className="flex items-center gap-2 text-text-muted text-xs font-bold uppercase tracking-widest">
                <Filter className="w-4 h-4" />
                Agrupar por Categoria
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-accent-primary uppercase tracking-widest border-b border-accent-primary/20 pb-2">1. Receitas Operacionais</p>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-text-secondary font-semibold">Mensalidades & Matrículas</span>
                   <span className="text-text-primary font-bold">R$ 54.200,00</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-text-secondary font-semibold">Vendas Loja (Bruto)</span>
                   <span className="text-text-primary font-bold">R$ 8.200,00</span>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-red-400 uppercase tracking-widest border-b border-red-400/20 pb-2">2. Custos & Deduções</p>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-text-secondary font-semibold">CMV (Custo de Mercadorias)</span>
                   <span className="text-red-400/80 font-bold">- R$ 3.120,00</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-text-secondary font-semibold">Taxas de Cartão/Asaas</span>
                   <span className="text-red-400/80 font-bold">- R$ 2.400,00</span>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest border-b border-white/5 pb-2">3. Despesas Fixas (Prédio/Staff)</p>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-text-secondary font-semibold">Aluguel & Condomínio</span>
                   <span className="text-text-primary font-bold">- R$ 12.000,00</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-text-secondary font-semibold">Pró-labore & Professores</span>
                   <span className="text-text-primary font-bold">- R$ 25.000,00</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-text-secondary font-semibold">Marketing & Software</span>
                   <span className="text-text-primary font-bold">- R$ 5.600,00</span>
                </div>
              </div>

              <div className="pt-6 border-t border-accent-primary/40 flex justify-between items-center">
                 <span className="text-xl font-display font-black text-text-primary">EBITDA (Lucro Operacional)</span>
                 <span className="text-xl font-display font-black text-accent-primary">R$ 14.280,00</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* IDR Tab - Performance Index */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="kpi-card !rounded-[3.5rem] p-10 space-y-10">
            <h2 className="text-2xl font-display font-black text-text-primary">Índice de Saúde</h2>
            <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
               <svg className="w-full h-full transform -rotate-90">
                 <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-surface-600" />
                 <circle cx="128" cy="128" r="120" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-accent-primary" strokeDasharray="753.6" strokeDashoffset="188.4" /* 75% health */ />
               </svg>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                 <span className="text-5xl font-display font-black text-text-primary">82</span>
                 <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Excelente</span>
               </div>
            </div>
            <div className="grid grid-cols-2 gap-6">
               <div className="p-4 rounded-2xl bg-surface-600 border border-white/5">
                 <p className="text-[10px] font-black text-text-muted uppercase mb-1">ARPU (Ticket Médio)</p>
                 <p className="text-xl font-bold text-text-primary">R$ 245,00</p>
               </div>
               <div className="p-4 rounded-2xl bg-surface-600 border border-white/5">
                 <p className="text-[10px] font-black text-text-muted uppercase mb-1">LTV (Life Time Value)</p>
                 <p className="text-xl font-bold text-text-primary">R$ 3.840,00</p>
               </div>
            </div>
          </div>

          <div className="kpi-card !rounded-[3.5rem] p-10 space-y-10">
            <h2 className="text-2xl font-display font-black text-text-primary">Retenção & Churn</h2>
            <div className="space-y-8">
               <div className="space-y-3">
                 <div className="flex justify-between items-end">
                   <p className="text-sm font-bold text-text-primary">Taxa de Churn</p>
                   <p className="text-xl font-display font-black text-red-400">2.4%</p>
                 </div>
                 <div className="h-2 w-full bg-surface-600 rounded-full overflow-hidden">
                   <div className="h-full bg-red-400" style={{ width: '24%' }} />
                 </div>
                 <p className="text-[10px] text-text-muted font-bold italic">Saudável: abaixo de 5%</p>
               </div>
               
               <div className="space-y-3">
                 <div className="flex justify-between items-end">
                   <p className="text-sm font-bold text-text-primary">Winback (Recuperação)</p>
                   <p className="text-xl font-display font-black text-emerald-400">14%</p>
                 </div>
                 <div className="h-2 w-full bg-surface-600 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-400" style={{ width: '14%' }} />
                 </div>
                 <p className="text-[10px] text-text-muted font-bold italic">Ex-alunos que retornaram este mês</p>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
