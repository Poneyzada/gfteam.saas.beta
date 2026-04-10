'use client'

import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import TopBar from '@/components/TopBar'
import StudentProfileModal, { StudentData } from '@/components/StudentProfileModal'
import { 
  Search, Plus, Filter, MoreHorizontal, 
  TrendingUp, Users, Shield, Award, ChevronRight,
  Download, MessageCircle, X
} from 'lucide-react'

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
  const { lang, mode } = useApp()
  const tx = texts[lang]
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null)
  
  // Real Data states
  const [students, setStudents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newStudent, setNewStudent] = useState({ name: '', phone: '', belt: 'Branca', class_name: 'Adulto' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    async function getStudents() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data: profile } = await supabase.from('profiles').select('tenant_id').eq('id', user.id).single()
      if (!profile) return

      // Fetch Students from Profiles + their latest payment status
      const { data: studentsData } = await supabase
        .from('profiles')
        .select(`
          *,
          payments (status, due_date)
        `)
        .eq('tenant_id', profile.tenant_id)
        .eq('role', 'student')
        .order('full_name', { ascending: true })

      if (studentsData) {
        const processed = studentsData.map(s => {
          const payments = s.payments || []
          const isOverdue = payments.some((p: any) => p.status === 'overdue' || (p.status === 'pending' && new Date(p.due_date) < new Date()))
          return {
            id: s.id,
            nome: s.full_name || 'Sem Nome',
            faixa: s.belt || 'Branca',
            grau: s.degree || 0,
            turma: s.class_name || 'Adulto',
            status: isOverdue ? 'Inadimplente' : (s.status === 'active' ? 'Ativo' : 'Atenção'),
            ultima: s.last_attendance ? new Date(s.last_attendance).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '--/--',
            progresso: s.evolution || 0,
            avatar: s.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2) || '??',
            phone: s.phone
          }
        })
        setStudents(processed)
      }
      setLoading(false)
    }
    getStudents()
  }, [])

  const filteredStudents = students.filter(s => 
    s.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.faixa.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddStudent = async () => {
    if (!newStudent.name) return
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      const { data: profile } = await supabase.from('profiles').select('tenant_id').eq('id', user?.id).single()
      
      const { error } = await supabase.from('profiles').insert({
        full_name: newStudent.name,
        phone: newStudent.phone,
        belt: newStudent.belt,
        class_name: newStudent.class_name,
        role: 'student',
        tenant_id: profile?.tenant_id,
        status: 'active'
      })

      if (!error) {
        setIsAddModalOpen(false)
        setNewStudent({ name: '', phone: '', belt: 'Branca', class_name: 'Adulto' })
        alert('Aluno cadastrado com sucesso! 🥋✅')
        window.location.reload()
      }
    } catch (err) { console.error(err) } finally { setSaving(false) }
  }

  const handleWhatsApp = (s: any) => {
    window.open(`https://wa.me/${s.phone?.replace(/\D/g, '')}?text=Olá ${s.nome}, tudo bem?`)
  }

  return (
    <div className="min-h-screen bg-surface-900 pb-12">
      <StudentProfileModal 
        isOpen={!!selectedStudent} 
        onClose={() => setSelectedStudent(null)} 
        student={selectedStudent} 
      />

      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-3xl">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-surface-800 w-full max-w-md rounded-[2.5rem] p-8 md:p-10 border border-white/10 shadow-2xl relative">
               <button onClick={() => setIsAddModalOpen(false)} className="absolute top-6 right-6 p-2 rounded-full bg-surface-900 text-text-muted hover:text-white transition-all"><X className="w-6 h-6" /></button>
               <h2 className="text-2xl font-display font-black text-text-primary uppercase italic tracking-tighter mb-8">Novo Aluno</h2>
               
               <div className="space-y-6">
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-2">Nome Completo</label>
                     <input 
                      type="text" 
                      value={newStudent.name}
                      onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
                      className="w-full bg-surface-900 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold !text-white outline-none focus:border-accent-primary" 
                      placeholder="Ex: João Silva" 
                      style={{ color: '#FFFFFF' }}
                    />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-2">WhatsApp</label>
                     <input 
                      type="text" 
                      value={newStudent.phone}
                      onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})}
                      className="w-full bg-surface-900 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold !text-white outline-none focus:border-accent-primary" 
                      placeholder="(00) 00000-0000" 
                      style={{ color: '#FFFFFF' }}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-2">Faixa</label>
                      <select 
                        value={newStudent.belt}
                        onChange={(e) => setNewStudent({...newStudent, belt: e.target.value})}
                        className="w-full bg-surface-900 border border-white/10 rounded-2xl px-4 py-4 text-sm font-bold !text-white outline-none focus:border-accent-primary"
                        style={{ color: '#FFFFFF' }}
                      >
                        {Object.keys(beltColors).map(b => <option key={b} value={b} className="bg-surface-800 text-white">{b}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-2">Turma</label>
                      <input 
                        type="text" 
                        value={newStudent.class_name}
                        onChange={(e) => setNewStudent({...newStudent, class_name: e.target.value})}
                        className="w-full bg-surface-900 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold !text-white outline-none focus:border-accent-primary" 
                        placeholder="Adulto" 
                        style={{ color: '#FFFFFF' }}
                      />
                    </div>
                  </div>
                  <button onClick={handleAddStudent} disabled={saving} className="w-full py-5 bg-accent-primary text-black rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-accent-primary/20 hover:scale-[1.02] active:scale-95 transition-all">
                    {saving ? 'CADASTRANDO...' : 'CONFIRMAR MATRÍCULA'}
                  </button>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="px-10 py-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-[2.5rem] font-display font-black text-text-primary tracking-tighter italic uppercase">
             {tx.title}
          </h1>
          <p className="text-text-muted mt-1 font-black uppercase text-[10px] tracking-widest opacity-60">
             {lang === 'pt' ? 'Controle Total do Corpo Docente e Membros' : 'Full Control of Faculty and Members'}
          </p>
        </div>
        <div className="flex items-center gap-4">
           <button className="w-14 h-14 rounded-2xl bg-surface-800 border border-white/5 flex items-center justify-center text-text-muted hover:border-accent-primary/40 transition-all">
             <Download className="w-5 h-5" />
           </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-accent-primary text-black px-8 py-4 rounded-2xl font-black uppercase text-xs shadow-xl shadow-accent-primary/20 hover:scale-105 active:scale-95 transition-all pointer-events-auto"
            >
              <Plus className="w-5 h-5 inline-block mr-2 stroke-[3]" />
              {tx.add}
            </button>
        </div>
      </div>

      <div className="px-10 space-y-8 animate-fade-in">
        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row items-center gap-6">
           <div className="flex-1 w-full bg-surface-800 border border-white/5 rounded-[1.5rem] px-6 py-4.5 flex items-center gap-4 group focus-within:border-accent-primary/50 transition-all shadow-xl">
              <Search className="w-5 h-5 text-text-muted group-focus-within:text-accent-primary transition-colors" />
              <input 
                type="text" 
                placeholder={tx.search} 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent text-sm font-bold text-text-primary placeholder:text-text-muted outline-none w-full"
              />
           </div>
           <button className="w-full md:w-auto px-8 py-4.5 rounded-[1.5rem] bg-surface-800 border border-white/5 font-black text-[10px] uppercase text-text-primary flex items-center justify-center gap-3 hover:bg-surface-700 transition-all shadow-md">
              <Filter className="w-5 h-5 text-accent-primary" />
              <span>{tx.filter}</span>
           </button>
        </div>

        {/* members Table */}
        <div className="kpi-card !rounded-[3rem] p-1 shadow-2xl border-white/5 bg-surface-800">
          <div className="overflow-x-auto p-4 md:p-8">
             <table className="w-full">
                <thead>
                   <tr className="text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em] border-b border-white/5">
                      <th className="pb-8 px-4">{tx.name}</th>
                      <th className="pb-8 px-4">{tx.belt}</th>
                      <th className="pb-8 px-4 hidden md:table-cell">{tx.class}</th>
                      <th className="pb-8 px-4">{tx.status}</th>
                      <th className="pb-8 px-4 hidden lg:table-cell">{tx.last}</th>
                      <th className="pb-8 px-4 text-right pr-6">{tx.progress}</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                   {loading ? (
                     <tr><td colSpan={6} className="py-20 text-center font-black uppercase text-xs text-text-muted tracking-widest opacity-30 italic italic">Sincronizando com a Matriz...</td></tr>
                   ) : filteredStudents.map((a, i) => (
                      <tr 
                        key={i} 
                        onClick={() => setSelectedStudent(a)}
                        className="group hover:bg-white/[0.02] transition-all cursor-pointer"
                      >
                         <td className="py-8 px-4">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-black text-surface-900 shadow-xl overflow-hidden relative" style={{ backgroundColor: beltColors[a.faixa || 'Branca'] }}>
                                  <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                                  {a.avatar}
                               </div>
                               <div>
                                  <p className="text-sm font-black text-text-primary group-hover:text-accent-primary transition-colors italic tracking-tight">{a.nome}</p>
                                  <p className="text-[9px] text-text-muted font-black uppercase mt-0.5 tracking-widest opacity-60">ID: 100{i+1}</p>
                                </div>
                            </div>
                         </td>
                         <td className="py-8 px-4">
                            <div className="flex items-center gap-3">
                               <div className="w-3.5 h-3.5 rounded-full ring-2 ring-white/10" style={{ backgroundColor: beltColors[a.faixa || 'Branca'] }} />
                               <span className="text-xs font-black text-text-muted uppercase tracking-tight">{a.faixa}</span>
                               <span className="text-[10px] font-black text-accent-primary bg-accent-primary/10 px-2 py-0.5 rounded-md border border-accent-primary/20">G{a.grau}</span>
                            </div>
                         </td>
                         <td className="py-8 px-4 hidden md:table-cell">
                            <div className="flex items-center gap-2">
                               <div className="w-2 h-2 rounded-full bg-accent-primary shadow-[0_0_8px_var(--accent)]" />
                               <span className="text-[10px] font-black uppercase text-text-muted tracking-wider">{a.turma}</span>
                            </div>
                         </td>
                         <td className="py-8 px-4">
                            <span className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest border ${
                               a.status === 'Ativo' ? 'bg-accent-primary/5 text-accent-primary border-accent-primary/20' :
                               a.status === 'Inadimplente' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                            }`}>
                               {a.status === 'Ativo' ? tx.active : a.status === 'Inadimplente' ? tx.overdue : tx.risk}
                            </span>
                         </td>
                         <td className="py-8 px-4 hidden lg:table-cell">
                            <div className="font-display font-black text-xs text-text-muted italic opacity-60 tracking-wider">
                               {a.ultima}
                            </div>
                         </td>
                         <td className="py-8 px-4">
                            <div className="flex items-center justify-end gap-5">
                               <div className="w-24 h-2 rounded-full bg-surface-600/50 overflow-hidden p-0.5 border border-white/5">
                                  <div className="h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_var(--accent)]" style={{ width: `${a.progresso}%`, backgroundColor: 'var(--accent)' }} />
                                </div>
                               <span className="text-[10px] font-black text-text-primary w-8 text-right font-mono italic">{a.progresso}%</span>
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
           <div className="kpi-card !rounded-[3rem] p-10 flex items-center justify-between group cursor-pointer hover:border-accent-primary/40 transition-all">
              <div className="card-accent opacity-20" />
              <div className="relative z-10">
                 <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 opacity-50">Engajamento Total</p>
                 <p className="text-4xl font-display font-black text-text-primary italic tracking-tighter">82%</p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-accent-primary/10 flex items-center justify-center text-accent-primary group-hover:bg-accent-primary group-hover:text-black transition-all shadow-xl group-hover:shadow-accent-primary/20">
                <TrendingUp className="w-8 h-8 stroke-[3]" />
              </div>
           </div>

           <div className="kpi-card !rounded-[3rem] p-10 flex items-center justify-between group cursor-pointer hover:border-accent-primary/40 transition-all">
              <div className="card-accent opacity-20" />
              <div className="relative z-10">
                 <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 opacity-50">Graduandos (Mês)</p>
                 <p className="text-4xl font-display font-black text-text-primary italic tracking-tighter">12</p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-surface-700 flex items-center justify-center text-text-muted transition-all">
                <Award className="w-8 h-8 opacity-40" />
              </div>
           </div>

           <div className="kpi-card !rounded-[3rem] p-10 flex items-center justify-between group cursor-pointer hover:border-accent-primary/40 transition-all">
              <div className="card-accent opacity-20" />
              <div className="relative z-10">
                 <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-2 opacity-50">Check-in Automático</p>
                 <p className="text-4xl font-display font-black text-text-primary italic tracking-tighter">95%</p>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-surface-700 flex items-center justify-center text-text-muted transition-all">
                <Shield className="w-8 h-8 opacity-40" />
              </div>
           </div>
        </div>
      </div>
    </div>
  )
}
