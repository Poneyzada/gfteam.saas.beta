'use client'

import { useApp } from '@/contexts/AppContext'
import TopBar from '@/components/TopBar'
import { Flame, MessageCircle, TrendingDown } from 'lucide-react'

const atRisk = [
  { nome: 'Eduardo Faria', faixa: 'Azul', dias: 43, risco: 'Alto', turma: 'Adulto Noite' },
  { nome: 'Natalia Gomes', faixa: 'Branca', dias: 32, risco: 'Alto', turma: 'Adulto Noite' },
  { nome: 'Bruno Cardoso', faixa: 'Azul', dias: 25, risco: 'Médio', turma: 'Adulto Manhã' },
  { nome: 'Marcos Torres', faixa: 'Roxa', dias: 18, risco: 'Médio', turma: 'Adulto Tarde' },
  { nome: 'Sofia Alves', faixa: 'Branca', dias: 15, risco: 'Baixo', turma: 'Kids' },
]

const riskColors: Record<string, string> = { 'Alto': '#EF4444', 'Médio': '#EAB308', 'Baixo': '#F5C500' }
const beltCol: Record<string, string> = { 'Branca': '#E5E7EB', 'Azul': '#3B82F6', 'Roxa': '#8B5CF6' }

export default function RetencaoPage() {
  const { lang } = useApp()

  return (
    <div className="min-h-screen bg-surface-900">
      <TopBar title={lang === 'pt' ? 'Retenção de Alunos' : 'Student Retention'} />
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-3 gap-4">
          {[{ l: 'Risco Alto', v: '8', c: '#EF4444' }, { l: 'Risco Médio', v: '14', c: '#EAB308' }, { l: 'Risco Baixo', v: '22', c: '#10B981' }].map((k, i) => (
            <div key={i} className="kpi-card">
              <div className="w-2.5 h-2.5 rounded-full mb-3" style={{ backgroundColor: k.c }} />
              <p className="text-2xl font-display font-bold text-text-primary">{k.v}</p>
              <p className="text-xs text-text-muted mt-1">{k.l}</p>
            </div>
          ))}
        </div>

        <div className="kpi-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-text-primary">{lang === 'pt' ? 'Alunos em Risco de Evasão' : 'Students at Churn Risk'}</h2>
            <Flame className="w-5 h-5 text-red-400" />
          </div>
          <div className="space-y-3">
            {atRisk.map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface-600 hover:bg-surface-500 transition-colors">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-bold text-surface-900" style={{ backgroundColor: beltCol[a.faixa] || '#E5E7EB' }}>
                  {a.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-text-primary">{a.nome}</p>
                  <p className="text-xs text-text-muted">{a.turma} · {a.dias} {lang === 'pt' ? 'dias sem treinar' : 'days without training'}</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ backgroundColor: `${riskColors[a.risco]}18`, color: riskColors[a.risco] }}>
                  {a.risco}
                </span>
                <button className="p-2 rounded-xl bg-[#25D366]/10 text-[#25D366] hover:bg-[#25D366]/20 transition-all" title="WhatsApp">
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
