'use client'

import { useApp } from '@/contexts/AppContext'
import TopBar from '@/components/TopBar'
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, Plus, Download, MessageCircle, Zap } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const monthlyData = [
  { m: 'Jan', r: 18400, d: 9200 }, { m: 'Fev', r: 20100, d: 9800 },
  { m: 'Mar', r: 19600, d: 10100 }, { m: 'Abr', r: 22300, d: 9600 },
  { m: 'Mai', r: 21800, d: 10400 }, { m: 'Jun', r: 24100, d: 10900 },
  { m: 'Jul', r: 23600, d: 11200 }, { m: 'Ago', r: 25800, d: 10700 },
]

const inadimplentes = [
  { nome: 'Eduardo Faria', valor: 'R$ 180', venc: '01/02/2025', dias: 43, faixa: 'Azul' },
  { nome: 'Natalia Gomes', valor: 'R$ 180', venc: '01/02/2025', dias: 43, faixa: 'Branca' },
  { nome: 'Bruno Cardoso', valor: 'R$ 180', venc: '15/02/2025', dias: 29, faixa: 'Azul' },
  { nome: 'Marcos Torres', valor: 'R$ 200', venc: '01/03/2025', dias: 15, faixa: 'Roxa' },
]

const texts = {
  pt: { title: 'Financeiro', revenue: 'Receita do mês', expenses: 'Despesas', profit: 'Lucro líquido', overdue: 'Em aberto', chart: 'Receita vs Despesas', late: 'Inadimplentes', name: 'Aluno', amount: 'Valor', due: 'Vencimento', days: 'Dias', contact: 'WhatsApp', newLaunch: 'Novo Lançamento', export: 'Exportar DRE' },
  en: { title: 'Financial', revenue: 'Monthly Revenue', expenses: 'Expenses', profit: 'Net Profit', overdue: 'Overdue', chart: 'Revenue vs Expenses', late: 'Late Payments', name: 'Student', amount: 'Amount', due: 'Due Date', days: 'Days', contact: 'WhatsApp', newLaunch: 'New Entry', export: 'Export P&L' },
}

export default function FinanceiroPage() {
  const { lang } = useApp()
  const tx = texts[lang]

  return (
    <div className="min-h-screen bg-surface-900">
      <TopBar title={tx.title} />
      <div className="p-6 space-y-5">
        {/* KPI Row */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {[
            { l: tx.revenue, v: 'R$ 25.800', icon: TrendingUp, trend: '+8.4%', up: true },
            { l: tx.expenses, v: 'R$ 10.700', icon: TrendingDown, trend: '-2.1%', up: true },
            { l: tx.profit, v: 'R$ 15.100', icon: DollarSign, trend: '+14.2%', up: true },
            { l: tx.overdue, v: 'R$ 3.240', icon: AlertCircle, trend: '18 alunos', up: false },
          ].map((k, i) => (
            <div key={i} className="kpi-card">
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.12)' }}>
                  <k.icon className="w-4.5 h-4.5" style={{ color: i === 3 ? '#EF4444' : 'var(--accent)' }} />
                </div>
                <span className={`text-xs font-semibold ${k.up && i !== 3 ? 'text-emerald-400' : i === 3 ? 'text-red-400' : 'text-emerald-400'}`}>{k.trend}</span>
              </div>
              <p className="text-xl font-display font-bold text-text-primary">{k.v}</p>
              <p className="text-xs text-text-muted mt-1">{k.l}</p>
            </div>
          ))}
        </div>
        
        {/* Quick Actions (Expediente/Limpeza) */}
        <div className="kpi-card !rounded-[2.5rem] bg-accent-primary/5 border-accent-primary/20 p-6 shadow-xl shadow-accent-primary/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-shrink-0">
              <h2 className="text-sm font-black text-text-primary uppercase tracking-widest flex items-center gap-2">
                <Zap className="w-4 h-4 text-accent-primary animate-pulse" />
                Lançamento Rápido
              </h2>
              <p className="text-[10px] text-text-muted font-bold mt-1 uppercase tracking-tighter">Sabão, Cândida, Pano, Café — Lançou, tá pago!</p>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 flex-1 justify-end">
              {[
                { label: 'Sabão', icon: '🧼' },
                { label: 'Cândida', icon: '🧪' },
                { label: 'Pano', icon: '🧹' },
                { label: 'Café', icon: '☕' },
                { label: 'Água', icon: '💧' },
              ].map((item) => (
                <button 
                  key={item.label}
                  className="bg-surface-800 border border-white/5 hover:border-accent-primary/50 py-2.5 px-5 rounded-[1.2rem] flex items-center gap-2.5 transition-all group active:scale-95 shadow-lg hover:shadow-accent-primary/10"
                  onClick={() => alert(`Lançado: ${item.label} (R$ 15,00)`)}
                >
                  <span className="text-sm scale-110">{item.icon}</span>
                  <span className="text-[10px] font-black uppercase text-text-primary group-hover:text-accent-primary tracking-wider">{item.label}</span>
                </button>
              ))}
              
              <div className="h-10 w-px bg-white/10 mx-3 hidden md:block" />
              
              <div className="flex items-center gap-3 bg-surface-700/50 border border-white/10 rounded-[1.2rem] px-4 py-2 flex-1 md:max-w-[220px] focus-within:border-accent-primary/50 transition-all shadow-inner">
                <Plus className="w-4 h-4 text-text-muted" />
                <input 
                  type="text" 
                  placeholder="item, valor..."
                  className="bg-transparent text-[11px] font-bold text-text-primary placeholder:text-text-muted outline-none w-full"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Chart */}
          <div className="xl:col-span-2 kpi-card">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-semibold text-text-primary">{tx.chart}</h2>
              <div className="flex gap-2">
                <button className="btn-ghost text-xs py-1.5 px-3 flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" /> {tx.export}
                </button>
                <button className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" /> {tx.newLaunch}
                </button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#2E2E3A" vertical={false} />
                <XAxis dataKey="m" tick={{ fill: '#71717A', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#71717A', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
                <Tooltip contentStyle={{ background: '#18181F', border: '1px solid #2E2E3A', borderRadius: '12px', fontSize: '12px' }} formatter={(v: any) => [`R$ ${v.toLocaleString('pt-BR')}`, '']} />
                <Bar dataKey="r" name="Receita" fill="var(--accent)" radius={[6, 6, 0, 0]} />
                <Bar dataKey="d" name="Despesa" fill="#E63B2E" radius={[6, 6, 0, 0]} opacity={0.7} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Inadimplentes */}
          <div className="kpi-card">
            <h2 className="font-display font-semibold text-text-primary mb-4">{tx.late}</h2>
            <div className="space-y-3">
              {inadimplentes.map((a, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-600 transition-colors">
                  <div className="w-8 h-8 rounded-xl bg-red-500/10 flex items-center justify-center text-[10px] font-bold text-red-400">
                    {a.nome.split(' ').map(n => n[0]).join('').slice(0,2)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-text-primary truncate">{a.nome}</p>
                    <p className="text-[10px] text-text-muted">{a.valor} · {a.dias}d</p>
                  </div>
                  <button className="p-1.5 rounded-lg bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-all">
                    <MessageCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
