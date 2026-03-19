import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import TopBar from '@/components/TopBar'
import StudentProfileModal, { StudentData } from '@/components/StudentProfileModal'
import { 
  Search, Plus, Filter, MoreHorizontal, 
  TrendingUp, Users, Shield, Award, ChevronRight,
  Download
} from 'lucide-react'

const alunos: StudentData[] = [
  { id: 1, nome: 'Lucas Andrade', faixa: 'Azul', grau: 3, turma: 'Adulto — Manhã', status: 'Ativo', ultima: '16/03', progresso: 68, avatar: 'LA' },
  { id: 2, nome: 'Fernanda Costa', faixa: 'Roxa', grau: 2, turma: 'Adulto — Noite', status: 'Ativo', ultima: '15/03', progresso: 42, avatar: 'FC' },
  { id: 3, nome: 'Rafael Mendes', faixa: 'Branca', grau: 4, turma: 'Kids', status: 'Ativo', ultima: '16/03', progresso: 85, avatar: 'RM' },
  { id: 4, nome: 'Eduardo Faria', faixa: 'Azul', grau: 1, turma: 'Adulto — Noite', status: 'Inadimplente', ultima: '12/02', progresso: 30, avatar: 'EF' },
  { id: 5, nome: 'Bianca Reis', faixa: 'Branca', grau: 2, turma: 'Kids', status: 'Ativo', ultima: '16/03', progresso: 45, avatar: 'BR' },
  { id: 6, nome: 'Carlos Barreto', faixa: 'Marrom', grau: 1, turma: 'Adulto — Tarde', status: 'Ativo', ultima: '16/03', progresso: 22, avatar: 'CB' },
  { id: 7, nome: 'Amanda Silva', faixa: 'Azul', grau: 4, turma: 'Adulto — Manhã', status: 'Ativo', ultima: '15/03', progresso: 78, avatar: 'AS' },
  { id: 8, nome: 'Natalia Gomes', faixa: 'Branca', grau: 3, turma: 'Adulto — Noite', status: 'Em risco', ultima: '20/02', progresso: 15, avatar: 'NG' },
]

const beltColors: Record<string, string> = {
  'Branca': '#E5E7EB',
  'Azul': '#3B82F6',
  'Roxa': '#8B5CF6',
  'Marrom': '#92400E',
  'Preta': '#111827',
}

const texts = {
  pt: { title: 'Gestão de Alunos', add: 'Cadastrar Aluno', search: 'Pelo que você procura?', filter: 'Filtros Avançados', name: 'Membro', belt: 'Graduação', class: 'Turma', status: 'Status', last: 'Último Check-in', progress: 'Evolução', active: 'Ativo', overdue: 'Inadimplente', risk: 'Atenção' },
  en: { title: 'Student Management', add: 'Register Student', search: 'What are you looking for?', filter: 'Advanced Filters', name: 'Member', belt: 'Rank', class: 'Class', status: 'Status', last: 'Last Check-in', progress: 'Evolution', active: 'Active', overdue: 'Late', risk: 'Attention' },
}

export default function PremiumAlunosPage() {
  const { lang } = useApp()
  const tx = texts[lang]
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null)

  return (
    <div className="min-h-screen bg-surface-900 pb-12">
      <StudentProfileModal 
        isOpen={!!selectedStudent} 
        onClose={() => setSelectedStudent(null)} 
        student={selectedStudent} 
      />

      <div className="px-10 py-10 flex items-center justify-between">
        <div>
          <h1 className="text-[2.5rem] font-display font-bold text-text-primary tracking-tight">
             {tx.title}
          </h1>
          <p className="text-text-secondary mt-1 font-medium opacity-60">
             {lang === 'pt' ? 'Gerencie o corpo docente e os membros da sua unidade.' : 'Manage the faculty and members of your unit.'}
          </p>
        </div>
        <div className="flex items-center gap-4">
           <button className="w-12 h-12 rounded-2xl bg-surface-700 flex items-center justify-center border border-surface-500 hover:border-accent-primary transition-all">
             <Download className="w-5 h-5 text-text-secondary" />
           </button>
           <button className="btn-primary !rounded-2xl px-6 py-3.5 flex items-center gap-2 shadow-xl shadow-accent-primary/20">
             <Plus className="w-5 h-5" />
             <span className="font-bold tracking-tight">{tx.add}</span>
           </button>
        </div>
      </div>

      <div className="px-10 space-y-8">
        {/* Search and Filters */}
        <div className="flex items-center gap-4">
           <div className="flex-1 bg-surface-700 border border-surface-500 rounded-[1.5rem] px-6 py-4 flex items-center gap-4 group focus-within:border-accent-primary transition-all">
              <Search className="w-5 h-5 text-text-muted group-focus-within:text-accent-primary transition-colors" />
              <input 
                type="text" 
                placeholder={tx.search} 
                className="bg-transparent text-text-primary placeholder:text-text-muted outline-none w-full font-medium"
              />
           </div>
           <button className="px-6 py-4 rounded-[1.5rem] bg-surface-700 border border-surface-500 font-bold text-text-primary flex items-center gap-3 hover:bg-surface-600 transition-all">
              <Filter className="w-5 h-5 text-accent-primary" />
              <span>{tx.filter}</span>
           </button>
        </div>

        {/* Members Table */}
        <div className="kpi-card !rounded-[3rem] p-1 shadow-sm border border-surface-500/50">
          <div className="overflow-x-auto p-4">
             <table className="w-full">
                <thead>
                   <tr className="text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em] border-b border-surface-500/30">
                      <th className="pb-6 px-4">{tx.name}</th>
                      <th className="pb-6 px-4">{tx.belt}</th>
                      <th className="pb-6 px-4 hidden md:table-cell">{tx.class}</th>
                      <th className="pb-6 px-4">{tx.status}</th>
                      <th className="pb-6 px-4 hidden lg:table-cell">{tx.last}</th>
                      <th className="pb-6 px-4 text-right pr-6">{tx.progress}</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-surface-500/20">
                   {alunos.map((a, i) => (
                      <tr 
                        key={i} 
                        onClick={() => setSelectedStudent(a)}
                        className="group hover:bg-surface-600/30 transition-all cursor-pointer"
                      >
                         <td className="py-6 px-4">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-black text-surface-900 shadow-md ring-1 ring-white/10" style={{ backgroundColor: beltColors[a.faixa || 'Branca'] }}>
                                  {a.avatar}
                               </div>
                               <div>
                                  <p className="text-sm font-bold text-text-primary group-hover:text-accent-primary transition-colors">{a.nome}</p>
                                  <p className="text-[10px] text-text-muted font-bold mt-0.5 tracking-wide">ID: 100{i+1}</p>
                               </div>
                            </div>
                         </td>
                         <td className="py-6 px-4">
                            <div className="flex items-center gap-2">
                               <div className="w-3 h-3 rounded-full border-2 border-surface-700" style={{ backgroundColor: beltColors[a.faixa || 'Branca'] }} />
                               <span className="text-xs font-bold text-text-secondary">{a.faixa}</span>
                               <span className="text-[10px] font-black text-text-muted bg-surface-600 px-1.5 py-0.5 rounded-md">G{a.grau}</span>
                            </div>
                         </td>
                         <td className="py-6 px-4 hidden md:table-cell">
                            <div className="flex items-center gap-2">
                               <div className="w-2 h-2 rounded-full bg-accent-primary opacity-30" />
                               <span className="text-xs font-semibold text-text-muted">{a.turma}</span>
                            </div>
                         </td>
                         <td className="py-6 px-4">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                               a.status === 'Ativo' ? 'bg-accent-primary/10 text-accent-primary' :
                               a.status === 'Inadimplente' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-500'
                            }`}>
                               {a.status === 'Ativo' ? tx.active : a.status === 'Inadimplente' ? tx.overdue : tx.risk}
                            </span>
                         </td>
                         <td className="py-6 px-4 hidden lg:table-cell">
                            <div className="flex items-center gap-2 font-mono text-xs text-text-muted">
                               {(a as any).ultima}
                            </div>
                         </td>
                         <td className="py-6 px-4">
                            <div className="flex items-center justify-end gap-3">
                               <div className="w-24 h-2 rounded-full bg-surface-600 overflow-hidden p-0.5">
                                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${a.progresso}%`, backgroundColor: 'var(--accent)' }} />
                               </div>
                               <span className="text-[10px] font-black text-text-primary w-8 text-right font-mono">{a.progresso}%</span>
                            </div>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>

        {/* Quick Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="kpi-card !rounded-[2.5rem] p-8 flex items-center justify-between group cursor-pointer hover:border-accent-primary transition-all">
              <div>
                 <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Engajamento</p>
                 <p className="text-3xl font-display font-black text-text-primary">82%</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-accent-primary/10 flex items-center justify-center text-accent-primary group-hover:bg-accent-primary group-hover:text-surface-900 transition-all">
                <TrendingUp className="w-7 h-7" />
              </div>
           </div>

           <div className="kpi-card !rounded-[2.5rem] p-8 flex items-center justify-between group cursor-pointer hover:border-accent-primary transition-all">
              <div>
                 <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Graduações (Mês)</p>
                 <p className="text-3xl font-display font-black text-text-primary">12</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-surface-600 flex items-center justify-center text-text-secondary transition-all">
                <Award className="w-7 h-7" />
              </div>
           </div>

           <div className="kpi-card !rounded-[2.5rem] p-8 flex items-center justify-between group cursor-pointer hover:border-accent-primary transition-all">
              <div>
                 <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2">Check-in Facial</p>
                 <p className="text-3xl font-display font-black text-text-primary">95%</p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-surface-600 flex items-center justify-center text-text-secondary transition-all">
                <Shield className="w-7 h-7" />
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}

