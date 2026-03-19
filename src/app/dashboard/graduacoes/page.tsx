import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import TopBar from '@/components/TopBar'
import StudentProfileModal, { StudentData } from '@/components/StudentProfileModal'
import { Award, CheckCircle, Clock, Users } from 'lucide-react'

const candidatos = [
  { id: 101, nome: 'Rafael Mendes', atual: 'Branca G4', prox: 'Azul', aulas: 156, tempo: '18 meses', progresso: 85, ok: true },
  { id: 102, nome: 'Amanda Silva', atual: 'Azul G4', prox: 'Roxa', aulas: 342, tempo: '36 meses', progresso: 78, ok: true },
  { id: 103, nome: 'Bianca Reis', atual: 'Branca G2', prox: 'Branca G3', aulas: 81, tempo: '8 meses', progresso: 45, ok: false },
  { id: 104, nome: 'Lucas Andrade', atual: 'Azul G3', prox: 'Azul G4', aulas: 228, tempo: '28 meses', progresso: 68, ok: true },
]

const beltColors: Record<string, string> = {
  'Branca': '#E5E7EB', 'Azul': '#3B82F6', 'Roxa': '#8B5CF6', 'Marrom': '#92400E', 'Preta': '#111827',
}

export default function GraduacoesPage() {
  const { lang } = useApp()
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null)

  return (
    <div className="min-h-screen bg-surface-900">
      <TopBar title={lang === 'pt' ? 'Graduações' : 'Promotions'} />
      <StudentProfileModal 
        isOpen={!!selectedStudent} 
        onClose={() => setSelectedStudent(null)} 
        student={selectedStudent} 
      />

      <div className="p-6 space-y-5">
        <div className="grid grid-cols-3 gap-4">
          {[
            { l: lang === 'pt' ? 'Prontos para Graduar' : 'Ready to Promote', v: '3', icon: CheckCircle },
            { l: lang === 'pt' ? 'Em Progresso' : 'In Progress', v: '47', icon: Clock },
            { l: lang === 'pt' ? 'Graduados este Ano' : 'Promoted this Year', v: '28', icon: Award },
          ].map((k, i) => (
            <div key={i} className="kpi-card">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: 'rgba(var(--accent-rgb), 0.12)' }}>
                <k.icon className="w-4.5 h-4.5" style={{ color: 'var(--accent)' }} />
              </div>
              <p className="text-2xl font-display font-bold text-text-primary">{k.v}</p>
              <p className="text-xs text-text-muted mt-1">{k.l}</p>
            </div>
          ))}
        </div>

        <div className="kpi-card">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-text-primary">{lang === 'pt' ? 'Candidatos à Graduação' : 'Promotion Candidates'}</h2>
            <button className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" /> {lang === 'pt' ? 'Graduar em Massa' : 'Mass Promote'}
            </button>
          </div>
          <div className="space-y-4">
            {candidatos.map((c, i) => (
              <div 
                key={i} 
                onClick={() => setSelectedStudent(c as any)}
                className="p-4 rounded-xl bg-surface-600 hover:bg-surface-500 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[10px] font-bold text-surface-900" style={{ backgroundColor: beltColors[c.prox] || '#E5E7EB' }}>
                      {c.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="font-semibold text-text-primary text-sm">{c.nome}</p>
                      <p className="text-xs text-text-muted">{c.atual} → <span style={{ color: 'var(--accent)' }}>{c.prox}</span></p>
                    </div>
                  </div>
                  {c.ok && (
                    <span className="badge-active text-xs">
                      <CheckCircle className="w-3 h-3" /> {lang === 'pt' ? 'Pronto' : 'Ready'}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-4 mb-2 text-xs text-text-muted">
                  <span>{c.aulas} {lang === 'pt' ? 'aulas' : 'classes'}</span>
                  <span>{c.tempo}</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-bar-fill" style={{ width: `${c.progresso}%` }} />
                </div>
                <p className="text-[10px] text-text-muted mt-1 text-right">{c.progresso}%</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
