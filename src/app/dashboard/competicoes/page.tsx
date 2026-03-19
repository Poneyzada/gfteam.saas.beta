'use client'

import { useApp } from '@/contexts/AppContext'
import TopBar from '@/components/TopBar'
import { Trophy, Medal, Plus } from 'lucide-react'

const results = [
  { nome: 'Lucas Andrade', camp: 'Copa GFTeam 2025', cat: 'Adulto Azul Leve', medal: 'Ouro', data: '10/03/2025' },
  { nome: 'Amanda Silva', camp: 'IBJJF Rio Open', cat: 'Adulto Azul Médio', medal: 'Prata', data: '01/03/2025' },
  { nome: 'Carlos Barreto', camp: 'Copa GFTeam 2025', cat: 'Master Marrom Meia', medal: 'Ouro', data: '10/03/2025' },
  { nome: 'Fernanda Costa', camp: 'São Paulo Open', cat: 'Adulto Roxa Leve', medal: 'Bronze', data: '22/02/2025' },
]

const medalColors: Record<string, string> = { 'Ouro': '#F5C500', 'Prata': '#A1A1AA', 'Bronze': '#92400E' }

export default function CompeticoesPage() {
  const { lang } = useApp()

  return (
    <div className="min-h-screen bg-surface-900">
      <TopBar title={lang === 'pt' ? 'Competições' : 'Competitions'} />
      <div className="p-6 space-y-5">
        <div className="grid grid-cols-3 gap-4">
          {[{ l: 'Ouros', v: '12', c: '#F5C500' }, { l: 'Pratas', v: '8', c: '#A1A1AA' }, { l: 'Bronzes', v: '15', c: '#92400E' }].map((k, i) => (
            <div key={i} className="kpi-card">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `${k.c}20` }}>
                <Medal className="w-4.5 h-4.5" style={{ color: k.c }} />
              </div>
              <p className="text-2xl font-display font-bold text-text-primary">{k.v}</p>
              <p className="text-xs text-text-muted mt-1">{k.l}</p>
            </div>
          ))}
        </div>

        <div className="kpi-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-text-primary">{lang === 'pt' ? 'Resultados Recentes' : 'Recent Results'}</h2>
            <button className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> {lang === 'pt' ? 'Lançar Resultado' : 'Add Result'}
            </button>
          </div>
          <div className="space-y-3">
            {results.map((r, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-surface-600 hover:bg-surface-500 transition-colors">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${medalColors[r.medal]}20` }}>
                  <Trophy className="w-5 h-5" style={{ color: medalColors[r.medal] }} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-text-primary">{r.nome}</p>
                  <p className="text-xs text-text-muted">{r.camp} · {r.cat}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ backgroundColor: `${medalColors[r.medal]}20`, color: medalColors[r.medal] }}>{r.medal}</span>
                  <p className="text-[10px] text-text-muted mt-1">{r.data}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
