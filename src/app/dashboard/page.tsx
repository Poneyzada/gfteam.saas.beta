'use client'

import { useState, useEffect } from 'react'
import { 
  Users, TrendingUp, DollarSign, Zap, 
  Megaphone, Plus, Bell, X, Send,
  ArrowUpRight, AlertCircle, TrendingDown,
  Award, PlayCircle, MessageSquare, Phone,
  ChevronRight, Calendar, Clock
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type AnnouncementType = 'announcement' | 'seminar' | 'graduation'

interface Announcement {
  id: string
  title: string
  content: string
  type: AnnouncementType
  created_at: string
}

interface OverdueStudent {
  student: {
    full_name: string
    belt: string
    phone: string
  }
  amount: number
  description: string
  due_date: string
  days_overdue: number
  reason: string
}

export default function DashboardPage() {
  const [isQGModalOpen, setIsQGModalOpen] = useState(false)
  const [announcementType, setAnnouncementType] = useState<AnnouncementType>('announcement')
  const [announcementTitle, setAnnouncementTitle] = useState('')
  const [announcementText, setAnnouncementText] = useState('')
  const [posting, setPosting] = useState(false)
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [selectedOverdue, setSelectedOverdue] = useState<OverdueStudent | null>(null)
  
  const [overdueStudents, setOverdueStudents] = useState<OverdueStudent[]>([])
  const [trialLessons, setTrialLessons] = useState<any[]>([])
  const [stats, setStats] = useState({
    students: 248,
    leads: 12,
    revenue: 42500,
    overdue: 850
  })

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    const mockAnnouncements: Announcement[] = [
      { id: '1', title: 'Graduação de Inverno', content: 'Atenção aos horários da cerimônia no sábado.', type: 'graduation', created_at: new Date().toISOString() },
      { id: '2', title: 'Seminário de Passagem', content: 'Inscrições abertas na recepção.', type: 'seminar', created_at: new Date().toISOString() }
    ]
    setAnnouncements(mockAnnouncements)

    const mockOverdue: OverdueStudent[] = [
      { student: { full_name: 'Ricardo Almeida', belt: 'Marrom', phone: '(21) 98888-1234' }, amount: 150, description: 'Mensalidade Março', due_date: '10/03/2024', days_overdue: 15, reason: 'Cartão de crédito recusado na recorrência.' },
      { student: { full_name: 'Ana Paula Silva', belt: 'Azul', phone: '(21) 97777-5678' }, amount: 200, description: 'Exame de Faixa', due_date: '15/03/2024', days_overdue: 10, reason: 'Aguardando confirmação de transferência PIX.' },
      { student: { full_name: 'Marcos Freitas', belt: 'Preta 2º Grau', phone: '(21) 96666-4444' }, amount: 500, description: 'Anuidade Filiado', due_date: '01/03/2024', days_overdue: 25, reason: 'Esquecimento conforme contato inicial.' }
    ]
    setOverdueStudents(mockOverdue)

    const mockLeads = [
      { name: 'João Victor', phone: '(21) 98888-7777', source: 'Instagram' },
      { name: 'Maria Eduarda', phone: '(21) 97777-6666', source: 'Landing Page' }
    ]
    setTrialLessons(mockLeads)
  }

  const handlePostAnnouncement = async () => {
    if (!announcementTitle || !announcementText) return
    setPosting(true)
    setTimeout(() => {
      const newAnn: Announcement = {
        id: Math.random().toString(),
        title: announcementTitle,
        content: announcementText,
        type: announcementType,
        created_at: new Date().toISOString()
      }
      setAnnouncements([newAnn, ...announcements])
      setPosting(false); setIsQGModalOpen(false); setAnnouncementTitle(''); setAnnouncementText('')
    }, 1500)
  }

  const types = [
    { id: 'announcement', label: 'Aviso', icon: Megaphone },
    { id: 'seminar', label: 'Seminário', icon: Zap },
    { id: 'graduation', label: 'Graduação', icon: Award }
  ]

  return (
    <div className="relative min-h-screen bg-surface-900 overflow-x-hidden pb-32 z-30 pointer-events-auto">
      {/* QG Modal */}
      <AnimatePresence>
        {isQGModalOpen && (
          <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4 bg-black/90 backdrop-blur-3xl pointer-events-auto">
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 30 }} className="bg-surface-800 w-full max-w-xl rounded-[3rem] p-10 md:p-12 border border-white/10 shadow-2xl relative text-left pointer-events-auto">
              <button onClick={() => setIsQGModalOpen(false)} className="absolute top-8 right-8 p-3 rounded-full bg-surface-900 text-text-muted hover:text-white border border-white/5 pointer-events-auto z-50 shadow-xl"><X className="w-6 h-6" /></button>
              
              <div className="mb-10">
                <h2 className="text-3xl font-display font-black text-white uppercase italic tracking-tighter leading-none mb-2">Relatório do <span className="text-accent-primary">Front QG</span></h2>
                <p className="text-[11px] text-text-muted font-black uppercase tracking-widest opacity-60">Sincronizar instrução para toda a unidade</p>
              </div>

              <div className="space-y-10">
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide pointer-events-auto">
                  {types.map((t) => (
                    <button key={t.id} onClick={() => setAnnouncementType(t.id as AnnouncementType)} className={`flex items-center gap-4 px-8 py-5 rounded-[2rem] transition-all whitespace-nowrap border border-white/5 pointer-events-auto active:scale-95 uppercase ${announcementType === t.id ? 'bg-accent-primary text-black dark:text-black font-black shadow-2xl text-[10px] tracking-widest' : 'bg-surface-900 text-text-muted font-black text-[10px] tracking-widest'}`}>
                      <t.icon className="w-5 h-5" />
                      {t.label}
                    </button>
                  ))}
                </div>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-text-muted uppercase tracking-widest pl-2 opacity-60">TÍTULO DA INSTRUÇÃO</label>
                    <input type="text" value={announcementTitle} onChange={(e) => setAnnouncementTitle(e.target.value)} className="w-full bg-surface-900 border border-white/10 rounded-2xl px-8 py-5 text-base font-bold text-text-primary focus:border-accent-primary outline-none shadow-inner" placeholder="Pressione para digitar..." />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[11px] font-black text-text-muted uppercase tracking-widest pl-2 opacity-60">CONTEÚDO ESTRATÉGICO</label>
                    <textarea value={announcementText} onChange={(e) => setAnnouncementText(e.target.value)} className="w-full bg-surface-900 border border-white/10 rounded-3xl px-8 py-6 text-base font-bold text-text-primary focus:border-accent-primary outline-none min-h-[180px] shadow-inner" placeholder="Descreva os detalhes para a base..." />
                  </div>
                </div>

                <button onClick={handlePostAnnouncement} disabled={posting} className="w-full py-6 bg-accent-primary text-black rounded-[2rem] font-black uppercase text-[12px] tracking-[0.3em] shadow-2xl shadow-accent-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-40 pointer-events-auto">
                  {posting ? <Zap className="w-6 h-6 animate-spin" /> : <><span>EMITIR COMANDO</span><Send className="w-6 h-6 stroke-[3]" /></>}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="p-4 md:p-10 space-y-10 animate-fade-in text-left relative z-30 pointer-events-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
           <div className="text-left">
              <h1 className="text-4xl md:text-6xl font-display font-black text-text-primary uppercase italic tracking-tighter leading-tight mb-4">Base de Comando <br /><span className="text-accent-primary italic">Operacional Ativa</span></h1>
              <p className="text-[11px] text-text-muted font-black uppercase tracking-[0.4em] opacity-60">Status de Prontidão da Unidade Oficial</p>
           </div>
           <button 
             onClick={(e) => {
               e.preventDefault();
               e.stopPropagation();
               setIsQGModalOpen(true);
             }} 
             className="px-10 py-5 rounded-[2rem] font-black uppercase text-[12px] tracking-[0.2em] bg-accent-primary text-black dark:text-black shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-5 border-none active:scale-95 pointer-events-auto relative z-50"
           >
              <Megaphone className="w-6 h-6 stroke-[3] text-black" /> <span className="font-black">POSTAR NO QG</span>
           </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 relative z-30 pointer-events-auto">
           {[
             { l: 'Alunos Elite', v: stats.students, i: Users, c: 'text-accent-primary' },
             { l: 'Leads (Novos)', v: stats.leads, i: TrendingUp, c: 'text-emerald-400' },
             { l: 'Faturamento', v: `R$ ${stats.revenue.toLocaleString()}`, i: DollarSign, c: 'text-emerald-500' },
             { l: 'Inadimplentes', v: stats.overdue, i: AlertCircle, c: 'text-red-500' },
           ].map((s, idx) => (
             <div key={idx} className="kpi-card !rounded-[2.5rem] p-8 bg-surface-800 border border-white/5 relative overflow-hidden group shadow-2xl text-left pointer-events-auto">
               <div className="w-14 h-14 rounded-2xl bg-surface-900 border border-white/5 flex items-center justify-center mb-8 group-hover:bg-accent-primary transition-all"><s.i className={`w-6 h-6 ${s.c} group-hover:text-black transition-colors`} /></div>
               <p className="text-3xl md:text-5xl font-display font-black text-text-primary italic tracking-tight mb-1">{s.v}</p>
               <p className="text-[10px] text-text-muted font-black uppercase tracking-widest opacity-40">{s.l}</p>
             </div>
           ))}
        </div>

        {/* Dynamic Lists */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 relative z-30 pointer-events-auto">
           {/* Radar Feed */}
           <div className="kpi-card !rounded-[3rem] p-10 bg-surface-800 border border-white/10 shadow-2xl relative z-40 text-left pointer-events-auto">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-2xl md:text-3xl font-display font-black text-text-primary uppercase italic tracking-tighter">Radar do QG</h2>
                <button onClick={() => setIsQGModalOpen(true)} className="p-4 rounded-2xl bg-surface-900 border border-white/5 text-accent-primary hover:bg-accent-primary hover:text-black transition-all shadow-xl pointer-events-auto relative z-50">
                  <Plus className="w-6 h-6 stroke-[3]" />
                </button>
              </div>
              <div className="space-y-6">
                {announcements.map((ann, i) => (
                  <div key={i} className="flex gap-8 p-8 rounded-[2.5rem] bg-surface-900/60 border border-white/5 group hover:border-accent-primary/20 transition-all text-left relative overflow-hidden shadow-xl pointer-events-auto">
                     <div className={`w-16 h-16 rounded-[1.8rem] flex items-center justify-center text-black shrink-0 transition-all group-hover:scale-110 ${ann.type === 'seminar' ? 'bg-emerald-400' : ann.type === 'graduation' ? 'bg-blue-400' : 'bg-accent-primary'}`}>
                        {ann.type === 'graduation' ? <Award className="w-7 h-7" /> : <Megaphone className="w-7 h-7" />}
                     </div>
                     <div className="flex-1 min-w-0"><div className="flex items-center justify-between mb-2"><h4 className="text-xl font-black text-text-primary uppercase tracking-tight truncate leading-none">{ann.title}</h4><span className="text-[10px] font-black text-text-muted uppercase text-right">{new Date(ann.created_at).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span></div><p className="text-[12px] text-text-muted font-bold opacity-60 leading-relaxed">{ann.content}</p></div>
                  </div>
                ))}
              </div>
           </div>

           {/* Overdue List (LISTA NEGRA) */}
           <div className="kpi-card !rounded-[3rem] p-10 bg-surface-800 border border-white/10 shadow-2xl relative z-40 overflow-hidden text-left pointer-events-auto">
              <div className="flex items-center justify-between mb-12 text-left">
                 <h2 className="text-2xl md:text-3xl font-display font-black text-text-primary uppercase tracking-tighter italic flex items-center gap-4">Lista Negra <span className="flex items-center gap-2 px-3 py-1 bg-red-500/10 rounded-full"><span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /><span className="text-[8px] font-black text-red-500 uppercase tracking-widest">COBRANÇA ATIVA</span></span></h2>
              </div>
              <div className="space-y-5">
                 {overdueStudents.map((pay, i) => (
                   <div key={i} onClick={() => setSelectedOverdue(pay)} className="p-6 rounded-[2rem] bg-surface-900/50 border border-white/5 flex items-center justify-between hover:bg-red-500/10 transition-all cursor-pointer group shadow-lg pointer-events-auto relative z-50">
                      <div className="flex items-center gap-6">
                         <div className="w-12 h-12 rounded-2xl bg-surface-800 flex items-center justify-center text-red-500 font-black text-xs border border-white/5 group-hover:bg-red-500 group-hover:text-white transition-all italic">!</div>
                         <div className="text-left">
                            <p className="text-[13px] font-black text-accent-primary uppercase tracking-tight leading-none mb-1 group-hover:underline">{pay.student.full_name}</p>
                            <p className="text-[10px] text-text-muted font-bold uppercase opacity-60 tracking-widest">R$ {pay.amount} · Dívida {pay.description}</p>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[9px] font-black text-red-500 animate-pulse uppercase tracking-widest">{pay.days_overdue} DIAS</span>
                        <button onClick={(e) => { 
                          e.stopPropagation(); 
                          const phone = pay.student.phone.replace(/\D/g, '');
                          const text = encodeURIComponent(`Fala ${pay.student.full_name}, tudo bem? Aqui é do QG da GFTeam.\n\nConsta aqui na sua ficha de Faixa ${pay.student.belt} que o item "${pay.description}" (R$ ${pay.amount}) está em aberto há ${pay.days_overdue} dias. Consegue verificar pra gente não travar sua grade de treinos? Oss! 🥋`);
                          window.open(`https://wa.me/55${phone}?text=${text}`, '_blank');
                        }} className="bg-red-500/10 text-red-500 border border-red-500/20 px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all pointer-events-auto relative z-60 cursor-pointer text-center flex items-center justify-center">COBRAR</button>
                      </div>
                   </div>
                 ))}
              </div>
           </div>

           {/* Trial Lessons */}
           <div className="kpi-card !rounded-[3rem] p-10 bg-surface-800 border-x-4 border-emerald-500/20 shadow-2xl relative z-40 overflow-hidden text-left pointer-events-auto">
              <div className="flex items-center justify-between mb-12 text-left">
                 <h2 className="text-2xl md:text-3xl font-display font-black text-text-primary uppercase tracking-tighter italic flex items-center gap-4">Combates Iniciais <span className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /><span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">NOVOS LEADS</span></span></h2>
              </div>
              <div className="space-y-5">
                 {trialLessons.map((lead, i) => (
                   <div key={i} className="p-6 rounded-[2rem] bg-surface-900/50 border border-white/5 flex items-center justify-between hover:bg-emerald-500/10 transition-all cursor-pointer group shadow-lg pointer-events-auto relative z-50">
                      <div className="flex items-center gap-6">
                         <div className="w-12 h-12 rounded-2xl bg-surface-800 border border-white/5 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-400 group-hover:text-black transition-all italic text-xs font-black">LEAD</div>
                         <div className="text-left">
                            <p className="text-[13px] font-black text-text-primary uppercase tracking-tight leading-none mb-1">{lead.name}</p>
                            <p className="text-[10px] text-text-muted font-bold uppercase opacity-60 tracking-widest">{lead.phone} · {lead.source}</p>
                         </div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); alert('Iniciando contato...'); }} className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center hover:bg-emerald-500 hover:text-black transition-all border border-emerald-500/20 pointer-events-auto relative z-50"><Send className="w-5 h-5" /></button>
                   </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Detailed Overdue Modal (EPIC VIEW) */}
        <AnimatePresence>
          {selectedOverdue && (
            <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl pointer-events-auto">
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className="bg-surface-800 w-full max-w-lg rounded-[3.5rem] p-12 border border-white/10 shadow-[0_0_100px_rgba(239,68,68,0.3)] relative text-left pointer-events-auto">
                 <button onClick={() => setSelectedOverdue(null)} className="absolute top-8 right-8 p-3 rounded-full bg-surface-900 text-text-muted hover:text-white border border-white/5 pointer-events-auto z-50 shadow-2xl"><X className="w-6 h-6" /></button>
                 
                 <div className="flex items-center gap-6 mb-10">
                    <div className="w-20 h-20 rounded-[2.5rem] bg-red-500 flex items-center justify-center text-white shadow-2xl shadow-red-500/40"><AlertCircle className="w-10 h-10 stroke-[3]" /></div>
                    <div className="text-left">
                      <h2 className="text-3xl font-display font-black text-text-primary uppercase italic tracking-tighter leading-none mb-1">Dossiê do Aluno</h2>
                      <p className="text-[10px] text-red-500 font-black uppercase tracking-widest italic">Status: Inadimplência Confirmada</p>
                    </div>
                 </div>

                 <div className="space-y-6 mb-10">
                    <div className="p-10 bg-surface-900 rounded-[3rem] border border-white/5 space-y-8 shadow-inner pointer-events-auto relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-8 opacity-5">
                          <AlertCircle className="w-32 h-32 text-red-500 stroke-[4]" />
                       </div>
                       
                       <div className="text-left relative z-10">
                          <p className="text-[11px] font-black text-text-muted uppercase tracking-[0.3em] mb-3 opacity-40">Identificação Base</p>
                          <p className="text-3xl font-black text-text-primary uppercase leading-tight mb-4">{selectedOverdue.student.full_name}</p>
                          <div className="flex flex-wrap items-center gap-3">
                             <span className="text-[10px] px-4 py-2 bg-accent-primary text-black rounded-xl font-black uppercase shadow-lg">Faixa {selectedOverdue.student.belt}</span>
                             <span className="text-[10px] px-4 py-2 bg-surface-800 text-text-primary rounded-xl font-black border border-white/5 shadow-inner">{selectedOverdue.student.phone}</span>
                          </div>
                       </div>

                       <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5 relative z-10">
                          <div className="space-y-1">
                             <p className="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-40">Dívida Total</p>
                             <p className="text-4xl font-display font-black text-red-500 italic tracking-tighter leading-none">R$ {selectedOverdue.amount}</p>
                          </div>
                          <div className="space-y-1">
                             <p className="text-[10px] font-black text-text-muted uppercase tracking-widest opacity-40">Tempo de Atraso</p>
                             <p className="text-4xl font-display font-black text-text-primary italic tracking-tighter leading-none">{selectedOverdue.days_overdue} <span className="text-lg">Dias</span></p>
                          </div>
                       </div>

                       <div className="pt-8 border-t border-white/5 relative z-10">
                          <div className="flex items-center gap-3 mb-4">
                             <MessageSquare className="w-5 h-5 text-accent-primary" />
                             <p className="text-[11px] font-black text-text-muted uppercase tracking-widest opacity-40">Motivo Reportado</p>
                          </div>
                          <div className="p-6 rounded-2xl bg-surface-800 border border-white/5 shadow-inner">
                             <p className="text-[13px] font-bold text-text-primary leading-relaxed antialiased italic">"{selectedOverdue.reason}"</p>
                          </div>
                       </div>

                       <div className="flex items-center gap-3 pt-6 text-text-muted opacity-40">
                          <Calendar className="w-4 h-4" />
                          <span className="text-[10px] font-black uppercase tracking-widest">Original: {selectedOverdue.due_date} · Item: {selectedOverdue.description}</span>
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-2 gap-6">
                    <button onClick={() => setSelectedOverdue(null)} className="py-6 bg-surface-700 text-text-primary rounded-[2rem] font-black uppercase text-[11px] tracking-[0.2em] hover:bg-surface-600 transition-all pointer-events-auto border-none active:scale-95 shadow-xl">POSTPONAR</button>
                    <button onClick={() => {
                          const phone = selectedOverdue.student.phone.replace(/\D/g, '');
                          const text = encodeURIComponent(`Fala ${selectedOverdue.student.full_name}, tudo bem? Aqui é da GFTeam.\n\nEstou vendo aqui na sua ficha (Faixa ${selectedOverdue.student.belt}) que estamos com ${selectedOverdue.days_overdue} dias de atraso referente a ${selectedOverdue.description} (R$ ${selectedOverdue.amount}).\n\nComo você tinha nos passado que o motivo era: "${selectedOverdue.reason}", eu queria saber como posso te ajudar a resolver isso hoje pra não travar sua evolução no tatame?\n\nOss! 🥋`);
                          window.open(`https://wa.me/55${phone}?text=${text}`, '_blank');
                    }} className="py-6 bg-emerald-500 text-black rounded-[2rem] font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-emerald-500/30 hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-3 pointer-events-auto border-none cursor-pointer">
                       <Phone className="w-5 h-5 fill-current" />
                       <span>CONTATO DIRETO</span>
                    </button>
                 </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
