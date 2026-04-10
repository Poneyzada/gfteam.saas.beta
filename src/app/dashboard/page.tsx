'use client'

import { useApp } from '@/contexts/AppContext'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Zap, TrendingUp, DollarSign,
  Calendar, Bell, Search, Clock,
  ArrowRight, QrCode, Target, MessageCircle, X, Plus,
  AlertCircle, Phone, MessageSquare
} from 'lucide-react'

export default function OriginalPremiumDashboard() {
  const { lang, mode } = useApp()
  const [userName, setUserName] = useState<string>('Mestre')
  const [userRole, setUserRole] = useState<string>('manager')
  
  // Real-time Data States
  const [expLeads, setExpLeads] = useState<any[]>([])
  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [checkins, setCheckins] = useState<any[]>([
    { id: 1, name: 'Lucas Andrade', belt: 'Azul', time: '17:28', beltColor: 'bg-blue-600', img: 'https://i.pravatar.cc/100?u=lucas' },
    { id: 2, name: 'Ana Silva', belt: 'Branca', time: '17:30', beltColor: 'bg-white', img: 'https://i.pravatar.cc/100?u=ana' },
  ])
  const [loading, setLoading] = useState(true)
  const [showPostModal, setShowPostModal] = useState(false)
  const [newPost, setNewPost] = useState({ title: '', content: '' })
  const [selectedOverdue, setSelectedOverdue] = useState<any | null>(null)

  const overdueStudents = [
    { id: 1, student: { full_name: 'Eduardo Faria', belt: 'Azul', phone: '11999990001' }, amount: '360,00', days_overdue: 45, reason: 'Estava desempregado, jÃ¡ estou trabalhando.', description: 'Mensalidade Fev/Mar', due_date: '01/02/2026' },
    { id: 2, student: { full_name: 'Natalia Gomes', belt: 'Branca', phone: '11999990002' }, amount: '120,00', days_overdue: 22, reason: 'Problema no cartÃ£o, vou regularizar.', description: 'Mensalidade Mar', due_date: '01/03/2026' },
  ]

  useEffect(() => {
    async function getData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('full_name, role, tenant_id').eq('id', user.id).single()
        if (profile) {
          setUserName(profile.full_name || 'Mestre')
          setUserRole(profile.role)
          
          // Fetch Real Data from Supabase
          const [leadsRes, classesRes, newsRes] = await Promise.all([
            supabase.from('leads').select('*').eq('tenant_id', profile.tenant_id).eq('status', 'agendado').order('created_at', { ascending: false }).limit(3),
            supabase.from('schedules').select('*').eq('tenant_id', profile.tenant_id).limit(4),
            supabase.from('notifications').select('*').limit(2).order('created_at', { ascending: false })
          ])

          if (leadsRes.data) setExpLeads(leadsRes.data)
          if (classesRes.data) setUpcomingClasses(classesRes.data)
          if (newsRes.data) setAnnouncements(newsRes.data)
        }
      }
      setLoading(false)
    }
    getData()
  }, [])

  const handlePost = async () => {
    if (!newPost.title || !newPost.content) return
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      
      const { data: profile } = await supabase.from('profiles').select('tenant_id').eq('id', user.id).single()
      
      const { error } = await supabase.from('notifications').insert({
        title: newPost.title,
        content: newPost.content,
        tenant_id: profile?.tenant_id || null,
        created_at: new Date().toISOString()
      })
      
      if (!error) {
        setAnnouncements([{ title: newPost.title, created_at: new Date().toISOString() }, ...announcements])
        setShowPostModal(false)
        setNewPost({ title: '', content: '' })
        alert('Aviso postado com sucesso!')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const stats = [
    { label: 'Alunos Ativos', value: '185', icon: Users, trend: '+8%', color: 'text-emerald-400' },
    { label: 'Novos Leads', value: '12', icon: Zap, trend: '+3 hoje', color: 'text-amber-400' },
    { label: 'FrequÃªncia', value: '82%', icon: TrendingUp, trend: '+2%', color: 'text-blue-400' },
    { label: 'Faturamento', value: '14.2k', icon: DollarSign, trend: '94%', color: 'text-emerald-400' },
  ]

  return (
    <div className="min-h-screen bg-surface-900 pb-20 relative overflow-hidden stippled transition-colors duration-500">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-primary/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      {/* Header Area */}
      <div className="px-6 md:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
             <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
             <p className="text-[10px] font-black text-accent-primary uppercase tracking-[0.3em]">Sistema de Elite â€¢ Online</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-text-primary tracking-tighter italic">
            OlÃ¡, <span className="text-accent-primary">{userName.split(' ')[0]}</span>
          </h1>
          <p className="text-text-muted mt-2 font-bold uppercase tracking-widest text-[10px] opacity-60">
            {userRole === 'instructor' ? 'Monitoramento TÃ©cnico â€¢ VisÃ£o Restrita' : 'Comando Central â€¢ GestÃ£o de Performance'}
          </p>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4">
             <button className="w-12 h-12 rounded-2xl bg-surface-800 border border-white/5 flex items-center justify-center hover:border-accent-primary/50 transition-all">
               <Search className="w-5 h-5 text-text-muted" />
             </button>
             <button className="w-12 h-12 rounded-2xl bg-surface-800 border border-white/5 flex items-center justify-center relative">
               <Bell className="w-5 h-5 text-text-muted" />
               <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-accent-primary accent-shadow" />
             </button>
             <button 
              onClick={() => { window.location.href = '/login' }} 
              className="px-6 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-widest hover:bg-red-500/20 transition-all"
            >
              Sair
            </button>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 space-y-12 relative z-10">
        
        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {stats.map((s, i) => (
            <div key={i} className="kpi-card group cursor-pointer border-white/5">
              <div className="card-accent" />
              <div className="flex items-center justify-between mb-6 md:mb-10">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-surface-700 flex items-center justify-center border border-white/5">
                  <s.icon className="w-6 h-6 md:w-8 md:h-8 text-accent-primary" />
                </div>
                <div className="text-right">
                   <span className={`text-[9px] md:text-[10px] font-black ${s.color} bg-surface-700 px-3 py-1 rounded-full`}>{s.trend}</span>
                   <p className="text-[9px] md:text-[10px] text-text-muted font-black uppercase tracking-widest mt-2">{s.label}</p>
                </div>
              </div>
              <p className="text-4xl md:text-6xl font-display font-black text-text-primary tracking-tighter italic group-hover:translate-x-2 transition-transform">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Content Grid - ORIGINAL 8x4 */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          
          {/* Main Area (8 cols) */}
          <div className="xl:col-span-8 space-y-12">
            
            {/* Top row: Check-ins & Avisos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
               {/* Quadrado de PresenÃ§a (Check-ins) */}
               <div className="kpi-card !p-8 md:!p-10 bg-surface-800 border-accent-primary/20">
                  <div className="card-accent" />
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-display font-black text-text-primary tracking-tighter italic">PRESENÃ‡A</h3>
                      <p className="text-[10px] text-text-muted font-black uppercase">Confirmar Alunos</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-accent-primary flex items-center justify-center hatched">
                      <Users className="w-6 h-6 text-black" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {checkins.map(c => (
                      <div key={c.id} className="flex items-center justify-between p-4 rounded-2xl bg-surface-900 border border-white/5 group hover:border-accent-primary/40 transition-all">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-surface-700 overflow-hidden relative">
                               <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
                               <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${c.beltColor} border border-surface-900`} />
                            </div>
                            <div>
                               <p className="text-xs font-black text-text-primary">{c.name}</p>
                               <p className="text-[9px] text-text-muted font-bold uppercase">{c.belt} â€¢ {c.time}</p>
                            </div>
                         </div>
                      <button 
                        onClick={async (e) => {
                          e.stopPropagation();
                          // Real Database Connection
                          try {
                            const { data: { user } } = await supabase.auth.getUser();
                            if (user) {
                              const { error } = await supabase.from('attendance').insert({
                                student_name: c.name,
                                student_belt: c.belt,
                                instructor_id: user.id,
                                status: 'presenca_marcada'
                              });
                              if (error) console.error('Erro ao marcar presenÃ§a:', error);
                            }
                          } catch (err) {
                            console.error('Falha de conexÃ£o:', err);
                          }
                          
                          alert(`PresenÃ§a confirmada para ${c.name}`);
                          setCheckins(checkins.filter(item => item.id !== c.id));
                        }}
                        className="w-10 h-10 rounded-xl bg-accent-primary border border-accent-primary flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-accent-primary/20"
                       >
                          <Zap className={`w-5 h-5 ${mode === 'light' ? 'text-black' : 'text-white'} filter drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]`} />
                       </button>
                      </div>
                    ))}
                    {checkins.length === 0 && <p className="text-center py-4 text-[10px] text-text-muted uppercase font-black opacity-30">Sem pendÃªncias</p>}
                  </div>
               </div>

               {/* Avisos QG */}
               <div className="kpi-card !p-8 md:!p-10 relative">
                   <div className="card-accent opacity-20 pointer-events-none" />
                   <div className="flex items-center justify-between mb-6 relative z-10">
                      <h3 className="text-xl font-display font-black text-text-primary italic tracking-tighter uppercase">Avisos do QG</h3>
                      <button 
                        onClick={() => setShowPostModal(true)}
                        className="px-3 py-1.5 bg-accent-primary text-black text-[10px] font-black uppercase rounded-xl hover:scale-110 active:scale-95 transition-all shadow-lg shadow-accent-primary/20 pointer-events-auto relative z-20 cursor-pointer"
                       >
                        Postar
                      </button>
                  </div>
                  <div className="space-y-4">
                    {announcements.map((news, idx) => (
                      <div key={idx} className="p-4 rounded-2xl bg-surface-900 border border-white/5 hover:bg-surface-800 transition-all">
                         <p className="text-xs text-text-primary font-black uppercase italic mb-1">{news.title}</p>
                         <p className="text-[9px] text-text-muted font-bold">{new Date(news.created_at).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
               </div>
            </div>

            {/* Bottom row: Experimentais & Kit Marketing (SMALL) */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
               {/* Experimentais (8 de 12 sub-fluxo) */}
               <div className="md:col-span-8 kpi-card !p-8 md:!p-10">
                  <div className="card-accent opacity-30" />
                  <h3 className="text-2xl font-display font-black text-accent-primary mb-8 italic tracking-tighter uppercase">Experimentais</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {expLeads.length > 0 ? expLeads.map((exp, i) => (
                      <div key={i} className="p-5 rounded-3xl bg-surface-900 border border-white/5 group hover:border-accent-primary/40 transition-all">
                         <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-surface-700 flex items-center justify-center border border-white/10">
                               <MessageCircle className="w-5 h-5 text-text-muted opacity-50" />
                            </div>
                            <div>
                               <p className="text-xs font-black text-text-primary uppercase truncate max-w-[100px]">{exp.name}</p>
                               <span className="text-[8px] font-black bg-accent-primary/10 text-accent-primary px-2 py-0.5 rounded-md uppercase">Agendado</span>
                            </div>
                         </div>
                         <div className="flex items-center justify-between pt-3 border-t border-white/5">
                            <span className="text-[9px] text-text-muted font-bold">{exp.source}</span>
                            <button onClick={() => window.open(`https://wa.me/${exp.phone.replace(/\D/g,'')}`)} className="text-[9px] font-black text-accent-primary uppercase hover:underline">WhatsApp</button>
                         </div>
                      </div>
                    )) : (
                      <div className="col-span-2 py-8 text-center opacity-30 italic text-[10px] font-black uppercase text-text-muted">Nenhum agendado</div>
                    )}
                  </div>
               </div>

               {/* Kit Marketing (4 de 12 sub-fluxo) - SMALLER */}
               <div className="md:col-span-4 kpi-card !p-6 bg-accent-primary border-none text-black flex flex-col items-center justify-center text-center hatched shadow-xl">
                  <h3 className="text-xl font-display font-black mb-1 italic tracking-tighter uppercase leading-none">KIT<br/>MARKETING</h3>
                  <div className="w-20 h-20 bg-white rounded-2xl p-2 my-4 rotate-3 hover:rotate-0 transition-transform">
                      <QrCode className="w-full h-full text-black" />
                  </div>
                  <button className="w-full py-3 rounded-xl bg-black text-white text-[9px] font-black uppercase tracking-widest hover:scale-105 transition-all">
                    BAIXAR
                  </button>
               </div>
            </div>
          </div>

          {/* Right Sidebar (4 cols): Treinos / PrÃ³ximas Aulas */}
          <div className="xl:col-span-4">
            <div className="kpi-card !p-8 md:!p-10 h-full bg-surface-800">
               <div className="card-accent h-[120px]" />
               <div className="flex items-center justify-between mb-10 relative z-10">
                  <h2 className="text-2xl font-display font-black text-text-primary tracking-tighter italic uppercase">Agenda Local</h2>
                  <Calendar className="w-5 h-5 text-accent-primary" />
               </div>
               
               <div className="space-y-6 relative z-10">
                  {upcomingClasses.length > 0 ? upcomingClasses.map((cls, idx) => (
                    <div key={idx} className="p-6 rounded-[2.5rem] bg-surface-900 border border-white/5 group hover:border-accent-primary/40 transition-all shadow-lg">
                       <p className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-2 group-hover:text-accent-primary transition-colors">{cls.class_type}</p>
                       <h4 className="text-lg md:text-xl font-display font-black text-text-primary tracking-tighter italic uppercase mb-4 leading-tight">{cls.class_name}</h4>
                       <div className="flex items-center gap-3 text-[10px] text-text-muted font-bold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{cls.time_start} â€¢ {cls.instructor_name}</span>
                       </div>
                    </div>
                  )) : (
                    <div className="py-20 text-center opacity-30 italic text-xs font-black uppercase text-text-muted">Carregando aulas...</div>
                  )}
               </div>

               <button 
                 onClick={() => window.location.href='/dashboard/cronograma'}
                 className="w-full mt-10 py-5 rounded-2xl border border-dashed border-white/10 text-[10px] font-black text-text-muted uppercase tracking-[0.3em] hover:text-accent-primary hover:border-accent-primary transition-all"
               >
                 + Ver Completo
               </button>
            </div>
          </div>

          {/* Lista Negra â€” Inadimplentes */}
          <div className="xl:col-span-12">
            <div className="kpi-card !p-8 md:!p-10">
              <div className="card-accent opacity-20" />
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-display font-black text-red-500 italic tracking-tighter uppercase">Lista Negra</h3>
                  <p className="text-[10px] text-text-muted font-black uppercase">Inadimplentes Â· Clique para disparar cobranÃ§a</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-500" />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {overdueStudents.map((ov) => (
                  <div key={ov.id} onClick={() => setSelectedOverdue(ov)} className="p-5 rounded-3xl bg-surface-900 border border-red-500/10 hover:border-red-500/40 transition-all cursor-pointer group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-text-primary uppercase">{ov.student.full_name}</p>
                        <span className="text-[8px] font-black bg-red-500/10 text-red-400 px-2 py-0.5 rounded-md uppercase">Faixa {ov.student.belt} Â· {ov.days_overdue} dias</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <span className="text-[9px] text-text-muted font-bold">R$ {ov.amount}</span>
                      <span className="text-[9px] font-black text-emerald-400 uppercase group-hover:underline">Cobrar via WhatsApp â†’</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modal DossiÃª Inadimplente */}
      <AnimatePresence>
        {selectedOverdue && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedOverdue(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="bg-surface-800 w-full max-w-lg rounded-[3rem] p-10 border border-red-500/20 shadow-2xl relative z-10"
            >
              <button onClick={() => setSelectedOverdue(null)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-surface-900 border border-white/5 flex items-center justify-center text-text-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
              <p className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em] mb-6">DossiÃª do Inadimplente</p>
              <p className="text-3xl font-black text-text-primary uppercase leading-tight mb-4">{selectedOverdue.student.full_name}</p>
              <div className="flex flex-wrap gap-3 mb-8">
                <span className="text-[10px] px-4 py-2 bg-accent-primary text-black rounded-xl font-black uppercase">Faixa {selectedOverdue.student.belt}</span>
                <span className="text-[10px] px-4 py-2 bg-surface-700 text-text-primary rounded-xl font-black border border-white/5">{selectedOverdue.student.phone}</span>
              </div>
              <div className="grid grid-cols-2 gap-6 mb-8 pt-6 border-t border-white/5">
                <div>
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1 opacity-50">DÃ­vida Total</p>
                  <p className="text-4xl font-display font-black text-red-500 italic">R$ {selectedOverdue.amount}</p>
                </div>
                <div>
                  <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1 opacity-50">Atraso</p>
                  <p className="text-4xl font-display font-black text-text-primary italic">{selectedOverdue.days_overdue} <span className="text-lg">dias</span></p>
                </div>
              </div>
              <div className="p-5 bg-surface-900 border border-white/5 rounded-2xl mb-8">
                <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 opacity-50">Motivo Reportado</p>
                <p className="text-sm font-bold text-text-primary italic leading-relaxed">&quot;{selectedOverdue.reason}&quot;</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setSelectedOverdue(null)} className="py-5 bg-surface-700 text-text-primary rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-surface-600 transition-all">Adiar</button>
                <button onClick={() => {
                  const phone = selectedOverdue.student.phone.replace(/\D/g, '');
                  const text = encodeURIComponent(`Fala ${selectedOverdue.student.full_name}! Aqui Ã© da GFTeam ðŸ¥‹\n\nVi aqui na sua ficha (Faixa ${selectedOverdue.student.belt}) que estÃ¡ com ${selectedOverdue.days_overdue} dias de atraso em ${selectedOverdue.description} (R$ ${selectedOverdue.amount}).\n\nSei que vocÃª mencionou: "${selectedOverdue.reason}"\n\nComo posso te ajudar a resolver isso hoje? ðŸ™`);
                  window.open(`https://wa.me/55${phone}?text=${text}`, '_blank');
                }} className="py-5 bg-emerald-500 text-black rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-500/30 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2">
                  <Phone className="w-4 h-4 fill-current" /> WhatsApp
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPostModal(false)} />
           <div className="bg-surface-800 border border-white/10 w-full max-w-lg rounded-[3rem] p-10 relative z-10 animate-fade-up shadow-2xl">
              <h2 className="text-2xl font-display font-black text-text-primary tracking-tighter italic uppercase mb-6">Novo Aviso QG</h2>
              
              <div className="space-y-4">
                 <div>
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">TÃ­tulo do Aviso</label>
                    <input 
                      type="text" 
                      value={newPost.title}
                      onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                      className="w-full mt-2 bg-surface-900 border border-white/5 p-4 rounded-2xl outline-none focus:border-accent-primary text-text-primary font-bold placeholder:opacity-30"
                      placeholder="Ex: SeminÃ¡rio este SÃ¡bado"
                    />
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">ConteÃºdo</label>
                    <textarea 
                      value={newPost.content}
                      onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                      className="w-full mt-2 bg-surface-900 border border-white/5 p-4 rounded-2xl outline-none focus:border-accent-primary text-text-primary font-medium h-32 placeholder:opacity-30"
                      placeholder="Descreva o aviso aqui..."
                    />
                 </div>
              </div>

              <div className="flex gap-4 mt-8">
                 <button onClick={() => setShowPostModal(false)} className="flex-1 py-4 rounded-2xl bg-surface-700 text-text-primary font-black uppercase text-xs">Cancelar</button>
                 <button onClick={handlePost} className="flex-1 py-4 rounded-2xl bg-accent-primary text-black font-black uppercase text-xs shadow-lg shadow-accent-primary/20 hover:scale-105 active:scale-95 transition-all">Postar Agora</button>
              </div>
           </div>
        </div>
      )}
    </div>
  )
}


