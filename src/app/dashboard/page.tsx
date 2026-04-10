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

export default function OriginalRaizDashboard() {
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
    { id: 1, student: { full_name: 'Eduardo Faria', belt: 'Azul', phone: '11999990001' }, amount: '360,00', days_overdue: 45, reason: 'Estava desempregado, já estou trabalhando.', description: 'Mensalidade Fev/Mar', due_date: '01/02/2026' },
    { id: 2, student: { full_name: 'Natalia Gomes', belt: 'Branca', phone: '11999990002' }, amount: '120,00', days_overdue: 22, reason: 'Problema no cartão, vou regularizar.', description: 'Mensalidade Mar', due_date: '01/03/2026' },
  ]

  useEffect(() => {
    async function getData() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase.from('profiles').select('full_name, role, tenant_id').eq('id', user.id).single()
        if (profile) {
          setUserName(profile.full_name || 'Mestre')
          setUserRole(profile.role)
          
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
    { label: 'Alunos Ativos', value: '185', icon: Users, trend: '+8%', color: 'text-emerald-500' },
    { label: 'Novos Leads', value: '12', icon: Zap, trend: '+3 hoje', color: 'text-amber-500' },
    { label: 'Frequência', value: '82%', icon: TrendingUp, trend: '+2%', color: 'text-blue-500' },
    { label: 'Faturamento', value: '14.2k', icon: DollarSign, trend: '94%', color: 'text-emerald-500' },
  ]

  return (
    <div className="min-h-screen bg-app pb-20 relative selection:bg-accent-primary selection:text-black">
      {/* Header */}
      <div className="px-6 md:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 border-b border-white/5">
        <div className="text-left">
          <h1 className="text-4xl md:text-5xl font-display font-black text-black dark:text-white tracking-tighter italic">
            Olá, <span className="text-accent-primary">{userName.split(' ')[0]}</span>
          </h1>
          <p className="text-black dark:text-white mt-2 font-black uppercase tracking-widest text-[10px]">
            {userRole === 'instructor' ? 'Monitoramento Técnico' : 'Comando Central • Gestão de Performance'}
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           <button className="w-12 h-12 rounded-xl bg-surface-800 border border-black/10 dark:border-white/10 flex items-center justify-center">
             <Search className="w-5 h-5 text-black dark:text-white" />
           </button>
           <button className="w-12 h-12 rounded-xl bg-surface-800 border border-black/10 dark:border-white/10 flex items-center justify-center relative">
             <Bell className="w-5 h-5 text-black dark:text-white" />
             <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-accent-primary" />
           </button>
           <button 
             onClick={() => { window.location.href = '/login' }} 
             className="px-6 py-3 rounded-xl bg-red-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all border-none cursor-pointer"
           >
             Sair
           </button>
        </div>
      </div>

      <div className="px-6 md:px-12 py-10 space-y-12">
        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {stats.map((s, i) => (
            <div key={i} className="kpi-card !bg-surface-900 border-black/10 dark:border-white/10 text-left">
              <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 rounded-xl bg-surface-700 flex items-center justify-center border border-black/5">
                  <s.icon className="w-6 h-6 text-accent-primary" />
                </div>
                <div className="text-right">
                   <span className={`text-[10px] font-black ${s.color} bg-surface-700 px-3 py-1 rounded-full`}>{s.trend}</span>
                   <p className="text-[10px] text-black dark:text-white font-black uppercase tracking-widest mt-2">{s.label}</p>
                </div>
              </div>
              <p className="text-4xl md:text-5xl font-display font-black text-black dark:text-white tracking-tighter italic">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          {/* Main Area (8 cols) */}
          <div className="xl:col-span-8 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
               {/* Presença */}
               <div className="kpi-card !p-8 bg-surface-800 border-black/10 dark:border-white/10">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-2xl font-display font-black text-black dark:text-white tracking-tighter italic">PRESENÇA</h3>
                      <p className="text-[10px] text-black dark:text-white font-black uppercase">Confirmar Alunos</p>
                    </div>
                    <div className="w-12 h-12 rounded-xl bg-accent-primary flex items-center justify-center">
                      <Users className="w-6 h-6 text-black" />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {checkins.map(c => (
                      <div key={c.id} className="flex items-center justify-between p-4 rounded-2xl bg-surface-900 border border-black/5 group hover:border-accent-primary transition-all">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-surface-700 overflow-hidden relative">
                               <img src={c.img} alt={c.name} className="w-full h-full object-cover" />
                               <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ${c.beltColor} border border-surface-900`} />
                            </div>
                            <div className="text-left">
                               <p className="text-xs font-black text-black dark:text-white leading-none mb-1">{c.name}</p>
                               <p className="text-[9px] text-black dark:text-white font-black uppercase">{c.belt} • {c.time}</p>
                            </div>
                         </div>
                        <button 
                          onClick={() => { alert(`Presença confirmada!`); setCheckins(checkins.filter(item => item.id !== c.id)); }}
                          className="w-10 h-10 rounded-xl bg-accent-primary border-none flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer shadow-lg"
                        >
                           <Zap className="w-5 h-5 text-black" />
                        </button>
                      </div>
                    ))}
                  </div>
               </div>

               {/* Avisos */}
               <div className="kpi-card !p-8 bg-surface-800 border-black/10 dark:border-white/10">
                  <div className="flex items-center justify-between mb-8">
                       <h3 className="text-2xl font-display font-black text-black dark:text-white italic uppercase tracking-tighter">Avisos QG</h3>
                       <button onClick={() => setShowPostModal(true)} className="px-4 py-2 bg-accent-primary text-black text-[10px] font-black uppercase rounded-xl hover:scale-105 transition-all cursor-pointer border-none shadow-lg">Postar</button>
                  </div>
                  <div className="space-y-4">
                    {announcements.map((news, idx) => (
                      <div key={idx} className="p-4 rounded-xl bg-surface-900 border border-black/5 text-left">
                         <p className="text-xs text-black dark:text-white font-black uppercase italic mb-1">{news.title}</p>
                         <p className="text-[9px] text-black dark:text-white font-black">{new Date(news.created_at).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
               </div>
            </div>

            {/* Experimentais & Marketing */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 text-left">
               <div className="md:col-span-8 kpi-card !p-8">
                  <h3 className="text-2xl font-display font-black text-black dark:text-white mb-8 italic uppercase tracking-tighter">Experimentais</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {expLeads.length > 0 ? expLeads.map((exp, i) => (
                      <div key={i} className="p-5 rounded-2xl bg-surface-900 border border-black/5 text-left">
                         <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-surface-700 flex items-center justify-center">
                               <MessageCircle className="w-5 h-5 text-accent-primary" />
                            </div>
                            <div>
                               <p className="text-xs font-black text-black dark:text-white uppercase">{exp.name}</p>
                               <span className="text-[8px] font-black bg-accent-primary text-black px-2 py-0.5 rounded-md uppercase">Agendado</span>
                            </div>
                         </div>
                         <div className="flex items-center justify-between pt-3 border-t border-black/5">
                            <span className="text-[9px] text-black dark:text-white font-black">{exp.source}</span>
                            <button onClick={() => window.open(`https://wa.me/${exp.phone.replace(/\D/g,'')}`)} className="text-[9px] font-black text-accent-primary uppercase hover:underline cursor-pointer border-none bg-transparent">WhatsApp</button>
                         </div>
                      </div>
                    )) : <p className="text-black dark:text-white opacity-40 font-black uppercase text-[10px] py-10 text-center col-span-2 italic">Sem agendamentos...</p>}
                  </div>
               </div>

               <div className="md:col-span-4 kpi-card !p-8 bg-accent-primary border-none text-black flex flex-col items-center justify-center">
                  <h3 className="text-xl font-display font-black mb-1 italic uppercase tracking-tighter text-black leading-none text-center">KIT<br/>MARKETING</h3>
                  <div className="w-20 h-20 bg-black rounded-2xl p-2 my-6">
                      <QrCode className="w-full h-full text-white" />
                  </div>
                  <button className="w-full py-4 rounded-xl bg-black text-white text-[10px] font-black uppercase tracking-widest border-none cursor-pointer">BAIXAR</button>
               </div>
            </div>
          </div>

          {/* Right Sidebar (4 cols) */}
          <div className="xl:col-span-4 text-left">
            <div className="kpi-card !p-8 bg-surface-800 border-black/10 dark:border-white/10 h-full">
               <div className="flex items-center justify-between mb-10">
                  <h2 className="text-2xl font-display font-black text-black dark:text-white tracking-tighter italic uppercase">Agenda Local</h2>
                  <Calendar className="w-5 h-5 text-accent-primary" />
               </div>
               <div className="space-y-6">
                  {upcomingClasses.length > 0 ? upcomingClasses.map((cls, idx) => (
                    <div key={idx} className="p-6 rounded-3xl bg-surface-900 border border-black/5 text-left">
                       <p className="text-[9px] font-black text-accent-primary uppercase tracking-widest mb-2">{cls.class_type}</p>
                       <h4 className="text-lg font-display font-black text-black dark:text-white tracking-tighter italic uppercase mb-4 leading-tight">{cls.class_name}</h4>
                       <div className="flex items-center gap-3 text-[10px] text-black dark:text-white font-black uppercase">
                          <Clock className="w-4 h-4 text-accent-primary" />
                          <span>{cls.time_start} • {cls.instructor_name}</span>
                       </div>
                    </div>
                  )) : <p className="text-black dark:text-white opacity-40 font-black uppercase text-[10px] py-20 text-center italic">Agenda vazia...</p>}
               </div>
               <button onClick={() => window.location.href='/dashboard/cronograma'} className="w-full mt-10 py-5 rounded-xl border-2 border-dashed border-black/10 dark:border-white/10 text-[10px] font-black text-black dark:text-white uppercase tracking-widest hover:border-accent-primary transition-all cursor-pointer bg-transparent">+ Ver Completo</button>
            </div>
          </div>

          {/* Lista Negra */}
          <div className="xl:col-span-12 text-left">
            <div className="kpi-card !p-8 border-red-500/20">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-display font-black text-red-600 italic uppercase tracking-tighter">Lista Negra</h3>
                  <p className="text-[10px] text-black dark:text-white font-black uppercase">Inadimplentes · Clique para cobrar</p>
                </div>
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {overdueStudents.map((ov) => (
                  <div key={ov.id} onClick={() => setSelectedOverdue(ov)} className="p-6 rounded-3xl bg-surface-900 border border-red-500/10 hover:border-red-500/40 transition-all cursor-pointer">
                    <div className="flex items-center gap-4 mb-4">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                        <div>
                          <p className="text-sm font-black text-black dark:text-white uppercase leading-none mb-1">{ov.student.full_name}</p>
                          <span className="text-[9px] font-black bg-red-500 text-white px-2 py-0.5 rounded-md uppercase">{ov.days_overdue} Dias</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-black/10 dark:border-white/10">
                      <span className="text-xs font-black text-black dark:text-white italic">R$ {ov.amount}</span>
                      <span className="text-[10px] font-black text-emerald-600 uppercase">Cobrar</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Post Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setShowPostModal(false)} />
           <div className="bg-surface-800 w-full max-w-lg rounded-[3rem] p-10 relative z-10 shadow-2xl text-left border border-white/10">
              <h2 className="text-3xl font-display font-black text-black dark:text-white tracking-tighter italic uppercase mb-8">Novo Aviso QG</h2>
              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-black text-black dark:text-white uppercase tracking-widest pl-2">Título do Aviso</label>
                    <input type="text" value={newPost.title} onChange={(e) => setNewPost({...newPost, title: e.target.value})} className="w-full mt-2 bg-surface-900 border border-black/10 dark:border-white/10 p-5 rounded-2xl text-black dark:text-white font-black uppercase text-sm outline-none focus:border-accent-primary" placeholder="TÍTULO..." />
                 </div>
                 <div>
                    <label className="text-[10px] font-black text-black dark:text-white uppercase tracking-widest pl-2">Conteúdo</label>
                    <textarea value={newPost.content} onChange={(e) => setNewPost({...newPost, content: e.target.value})} className="w-full mt-2 bg-surface-900 border border-black/10 dark:border-white/10 p-5 rounded-2xl text-black dark:text-white font-bold text-sm h-32 outline-none focus:border-accent-primary" placeholder="DESCREVA O AVISO..." />
                 </div>
              </div>
              <div className="flex gap-4 mt-10">
                 <button onClick={() => setShowPostModal(false)} className="flex-1 py-5 rounded-2xl bg-surface-700 text-black dark:text-white font-black uppercase text-[10px] tracking-widest border-none cursor-pointer">Cancelar</button>
                 <button onClick={handlePost} className="flex-1 py-5 rounded-2xl bg-accent-primary text-black font-black uppercase text-[10px] tracking-widest shadow-xl border-none cursor-pointer">Postar Agora</button>
              </div>
           </div>
        </div>
      )}
    </div>
  )
}
