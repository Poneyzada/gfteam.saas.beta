'use client'

import { useApp } from '@/contexts/AppContext'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users, Zap, TrendingUp, DollarSign,
  Calendar, Bell, Search, Clock,
  QrCode, X, Plus,
  AlertCircle, Phone, MessageCircle
} from 'lucide-react'

export default function OriginalRaizDashboard() {
  const { lang, mode } = useApp()
  const [userName, setUserName] = useState<string>('Mestre')
  const [userRole, setUserRole] = useState<string>('manager')
  
  const [expLeads, setExpLeads] = useState<any[]>([])
  const [upcomingClasses, setUpcomingClasses] = useState<any[]>([])
  const [announcements, setAnnouncements] = useState<any[]>([])
  const [checkins, setCheckins] = useState<any[]>([])
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
          const [leadsRes, classesRes, newsRes, checkinsRes] = await Promise.all([
            supabase.from('leads').select('*').eq('tenant_id', profile.tenant_id).eq('status', 'agendado').order('created_at', { ascending: false }).limit(4),
            supabase.from('schedules').select('*').eq('tenant_id', profile.tenant_id).limit(4),
            supabase.from('notifications').select('*').limit(2).order('created_at', { ascending: false }),
            supabase.from('checkins').select('*, student:profiles(*)').eq('tenant_id', profile.tenant_id).eq('status', 'pending').order('created_at', { ascending: false })
          ])
          if (leadsRes.data) setExpLeads(leadsRes.data)
          if (classesRes.data) setUpcomingClasses(classesRes.data)
          if (newsRes.data) setAnnouncements(newsRes.data)
          if (checkinsRes.data) {
            const mappedCheckins = checkinsRes.data.map((c: any) => {
              const student = c.student || {}
              const belt = (student.belt || 'branca').toLowerCase()
              const beltColors: Record<string, string> = {
                branca: 'bg-white',
                azul: 'bg-blue-600',
                roxa: 'bg-purple-700',
                marrom: 'bg-[#5D4037]',
                preta: 'bg-surface-950 border border-white/20'
              }
              const dateObj = new Date(c.created_at)
              const timeStr = dateObj.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
              return {
                id: c.id,
                student_id: c.student_id,
                name: student.full_name || 'Aluno',
                belt: student.belt || 'Branca',
                time: timeStr,
                beltColor: beltColors[belt] || 'bg-white',
                img: c.photo_url || student.avatar_url || 'https://i.pravatar.cc/100?u=student'
              }
            })
            setCheckins(mappedCheckins)
          }
        }
      }
      setLoading(false)
    }
    getData()
  }, [])

  const confirmCheckin = async (id: string, studentId: string) => {
    // 1. Confirm checkin
    const { error: err } = await supabase.from('checkins').update({ status: 'confirmed' }).eq('id', id)
    if (err) {
      alert('Erro ao confirmar check-in: ' + err.message)
      return
    }

    // 2. Increment classes count
    const { data: profile } = await supabase.from('profiles').select('total_classes').eq('id', studentId).single()
    const currentClasses = profile?.total_classes || 0
    await supabase.from('profiles').update({ total_classes: currentClasses + 1 }).eq('id', studentId)

    // 3. Update UI
    setCheckins(checkins.filter(item => item.id !== id))
    alert('Check-in facial confirmado com sucesso! Aula creditada ao atleta.')
  }

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
    } catch (err) {}
  }

  const stats = [
    { label: 'Alunos Ativos', value: '185', icon: Users, trend: '+8%', color: 'text-emerald-500' },
    { label: 'Novos Leads', value: '12', icon: Zap, trend: '+3 hoje', color: 'text-amber-500' },
    { label: 'Frequência', value: '82%', icon: TrendingUp, trend: '+2%', color: 'text-blue-500' },
    { label: 'Faturamento', value: '14.2k', icon: DollarSign, trend: '94%', color: 'text-emerald-500' },
  ]

  return (
    <div className="min-h-screen bg-app pb-20 relative selection:bg-accent-primary selection:text-black text-left">
      {/* Header */}
      <div className="px-6 md:px-12 py-10 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10 border-b border-black/10 dark:border-white/10">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-black text-black dark:text-white tracking-tighter italic uppercase leading-none">Comando <span className="text-accent-primary">GFT</span></h1>
          <p className="text-black dark:text-white mt-3 font-black uppercase tracking-[0.3em] text-[10px]">MONITORAMENTO OPERACIONAL • <span className="text-accent-primary">{userName}</span></p>
        </div>
        <div className="flex items-center gap-4">
           <button className="w-12 h-12 rounded-xl bg-surface-800 border border-black/10 dark:border-white/10 flex items-center justify-center cursor-pointer"><Search className="w-5 h-5 text-black dark:text-white" /></button>
           <button className="w-12 h-12 rounded-xl bg-surface-800 border border-black/10 dark:border-white/10 flex items-center justify-center relative cursor-pointer"><Bell className="w-5 h-5 text-black dark:text-white" /><div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-accent-primary" /></button>
           <button onClick={() => { window.location.href = '/login' }} className="px-6 py-3 rounded-xl bg-red-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all border-none cursor-pointer">Sair</button>
        </div>
      </div>

      <div className="px-6 md:px-12 py-10 space-y-10">
        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stats.map((s, i) => (
            <div key={i} className="kpi-card bg-surface-900 border-black/10 dark:border-white/10">
              <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 rounded-xl bg-surface-800 flex items-center justify-center border border-black/10"><s.icon className="w-6 h-6 text-accent-primary" /></div>
                <div className="text-right"><span className={`text-[10px] font-black ${s.color} bg-surface-800 px-3 py-1 rounded-full border border-black/10`}>{s.trend}</span><p className="text-[10px] text-black dark:text-white font-black uppercase tracking-widest mt-2">{s.label}</p></div>
              </div>
              <p className="text-4xl md:text-6xl font-display font-black text-black dark:text-white tracking-tighter italic leading-none">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Layout Principal Centralizado */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
          
          {/* Coluna de Foco (8 colunas) */}
          <div className="xl:col-span-8 flex flex-col gap-10">
             
             {/* Linha 1: Check-in & Comunicados */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="kpi-card bg-surface-900 border-black/10 dark:border-white/10 h-full">
                  <div className="flex items-center justify-between mb-8"><h3 className="text-2xl font-display font-black text-black dark:text-white tracking-tighter italic uppercase">Check-in</h3><Users className="w-6 h-6 text-accent-primary" /></div>
                  <div className="space-y-4">
                    {checkins.map(c => (
                      <div key={c.id} className="flex items-center justify-between p-4 rounded-2xl bg-surface-800 border border-black/10 group hover:border-accent-primary transition-all">
                        <div className="flex items-center gap-4"><div className="w-12 h-12 rounded-xl bg-surface-700 overflow-hidden relative border border-black/10"><img src={c.img} alt={c.name} className="w-full h-full object-cover" /><div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${c.beltColor} border-2 border-surface-800`} /></div><div className="text-left"><p className="text-sm font-black text-black dark:text-white uppercase italic leading-none mb-1">{c.name}</p><p className="text-[9px] text-black dark:text-white font-black uppercase tracking-widest">{c.belt} • {c.time}</p></div></div>
                        <button onClick={() => confirmCheckin(c.id, c.student_id)} className="w-10 h-10 rounded-xl bg-accent-primary border-none flex items-center justify-center hover:scale-110 active:scale-95 transition-all cursor-pointer"><Zap className="w-5 h-5 text-black" /></button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="kpi-card bg-surface-900 border-black/10 dark:border-white/10 h-full text-left">
                  <div className="flex items-center justify-between mb-8"><h3 className="text-2xl font-display font-black text-black dark:text-white italic uppercase tracking-tighter">Avisos</h3><button onClick={() => setShowPostModal(true)} className="px-5 py-2.5 bg-accent-primary text-black text-[9px] font-black uppercase rounded-lg hover:scale-105 transition-all cursor-pointer border-none shadow-lg">POSTAR</button></div>
                  <div className="space-y-4">
                    {announcements.map((news, idx) => (
                      <div key={idx} className="p-5 rounded-xl bg-surface-800 border border-black/10 text-left"><p className="text-xs text-black dark:text-white font-black uppercase italic mb-1">{news.title}</p><p className="text-[9px] text-black dark:text-white font-black uppercase opacity-60">{new Date(news.created_at).toLocaleDateString()}</p></div>
                    ))}
                  </div>
                </div>
             </div>

             {/* Linha 2: Experimentais & Lista Negra (Compacta) */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="kpi-card bg-surface-900 border-black/10 dark:border-white/10 h-full text-left">
                   <h3 className="text-2xl font-display font-black text-black dark:text-white mb-8 italic uppercase tracking-tighter">Experimentais</h3>
                   <div className="grid grid-cols-1 gap-4">
                     {expLeads.slice(0, 2).map((exp, i) => (
                       <div key={i} className="p-5 rounded-3xl bg-surface-800 border border-black/10 text-left flex items-center justify-between">
                          <div className="flex items-center gap-4"><div className="w-10 h-10 rounded-xl bg-surface-700 flex items-center justify-center"><MessageCircle className="w-5 h-5 text-accent-primary" /></div><div><p className="text-xs font-black text-black dark:text-white uppercase">{exp.name}</p><span className="text-[8px] font-black bg-accent-primary text-black px-2 py-0.5 rounded-md uppercase">Agendado</span></div></div>
                          <button onClick={() => window.open(`https://wa.me/${exp.phone.replace(/\D/g,'')}`)} className="text-[9px] font-black text-accent-primary uppercase hover:underline cursor-pointer border-none bg-transparent">WhatsApp</button>
                       </div>
                     ))}
                   </div>
                </div>

                <div className="kpi-card bg-surface-900 border-red-600/30 h-full text-left relative">
                   <div className="absolute top-6 right-6 text-red-600"><AlertCircle className="w-6 h-6" /></div>
                   <h3 className="text-2xl font-display font-black text-red-600 mb-8 italic uppercase tracking-tighter leading-none">Lista Negra</h3>
                   <div className="grid grid-cols-1 gap-4">
                      {overdueStudents.slice(0, 2).map((ov) => (
                        <div key={ov.id} onClick={() => setSelectedOverdue(ov)} className="p-4 rounded-2xl bg-surface-800 border border-red-600/20 hover:border-red-600/50 transition-all cursor-pointer flex items-center justify-between group">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-red-600/10 flex items-center justify-center text-red-600"><AlertCircle className="w-4 h-4" /></div>
                              <p className="text-xs font-black text-black dark:text-white uppercase italic">{ov.student.full_name}</p>
                           </div>
                           <span className="text-[9px] font-black text-red-600">R$ {ov.amount}</span>
                        </div>
                      ))}
                   </div>
                </div>
             </div>

          </div>

          {/* Coluna da Direita (4 colunas) */}
          <div className="xl:col-span-4 flex flex-col gap-10">
             <div className="kpi-card bg-surface-900 border-black/10 dark:border-white/10 h-full text-left">
                <div className="flex items-center justify-between mb-8"><h3 className="text-2xl font-display font-black text-black dark:text-white tracking-tighter italic uppercase">Agenda Local</h3><Calendar className="w-5 h-5 text-accent-primary" /></div>
                <div className="space-y-4">
                   {upcomingClasses.slice(0, 3).map((cls, idx) => (
                      <div key={idx} className="p-5 rounded-3xl bg-surface-800 border border-black/10 text-left group hover:border-accent-primary transition-all">
                         <p className="text-[9px] font-black text-accent-primary uppercase tracking-widest mb-2">{cls.class_type}</p>
                         <h4 className="text-lg font-display font-black text-black dark:text-white tracking-tighter italic uppercase leading-tight mb-2">{cls.class_name}</h4>
                         <div className="flex items-center gap-3 text-[10px] text-black dark:text-white font-black uppercase opacity-60"><Clock className="w-4 h-4 text-accent-primary" /><span>{cls.time_start} • {cls.instructor_name}</span></div>
                      </div>
                   ))}
                </div>
                <button onClick={() => window.location.href='/dashboard/cronograma'} className="w-full mt-8 py-5 rounded-xl border-2 border-dashed border-black/10 dark:border-white/10 text-[10px] font-black text-black dark:text-white uppercase tracking-widest hover:border-accent-primary transition-all cursor-pointer bg-transparent">VER COMPLETO</button>
             </div>

             <div className="kpi-card bg-accent-primary border-none text-black flex flex-col items-center justify-center text-center p-12">
                <h3 className="text-xl font-display font-black uppercase italic tracking-tighter mb-6">DIVULGUE<br/>A UNIDADE</h3>
                <div className="w-24 h-24 bg-black rounded-[2rem] p-3 shadow-xl mb-6"><QrCode className="w-full h-full text-white" /></div>
                <button className="w-full py-4 bg-black text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all border-none cursor-not-allowed">BAIXAR KIT</button>
             </div>
          </div>

        </div>
      </div>

      {/* Modal - Dossiê Inadimplente Restaurado com VISIBILIDADE MAXIMA */}
      <AnimatePresence>
        {selectedOverdue && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setSelectedOverdue(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-surface-800 w-full max-w-lg rounded-[3rem] p-10 border border-black/10 dark:border-white/10 shadow-2xl relative z-[210] text-left">
              <button onClick={() => setSelectedOverdue(null)} className="absolute top-8 right-8 w-12 h-12 rounded-full bg-surface-900 border border-black/10 dark:border-white/10 flex items-center justify-center text-text-primary hover:bg-red-600 hover:text-white transition-all cursor-pointer"><X className="w-6 h-6" /></button>
              <p className="text-[10px] font-black text-red-600 uppercase tracking-[0.4em] mb-6">Dossiê do Inadimplente</p>
              <h2 className="text-4xl font-display font-black text-text-primary uppercase italic leading-none mb-10">{selectedOverdue.student.full_name}</h2>
              <div className="grid grid-cols-2 gap-8 mb-10 pb-10 border-b border-black/10 dark:border-white/10">
                <div><p className="text-[10px] font-black text-text-secondary opacity-70 uppercase tracking-widest mb-2">DÉBITO</p><p className="text-4xl font-display font-black text-red-600 italic leading-none">R$ {selectedOverdue.amount}</p></div>
                <div><p className="text-[10px] font-black text-text-secondary opacity-70 uppercase tracking-widest mb-2">ATRASO</p><p className="text-4xl font-display font-black text-text-primary italic leading-none">{selectedOverdue.days_overdue} DIAS</p></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setSelectedOverdue(null)} className="py-5 bg-surface-700 text-text-primary border border-black/10 dark:border-white/10 rounded-2xl font-black uppercase text-[11px] cursor-pointer">Fechar</button>
                <button onClick={() => window.open(`https://wa.me/55${selectedOverdue.student.phone.replace(/\D/g, '')}`)} className="py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase text-[11px] shadow-xl border-none cursor-pointer flex items-center justify-center gap-3"><MessageCircle className="w-5 h-5 fill-current" /> WHATSAPP</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showPostModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setShowPostModal(false)} />
             <div className="bg-surface-800 w-full max-w-lg rounded-[3rem] p-10 relative z-10 shadow-2xl text-left border border-black/10 dark:border-white/10">
                <h2 className="text-3xl font-display font-black text-text-primary tracking-tighter italic uppercase mb-8">Novo Aviso QG</h2>
                <div className="space-y-6">
                   <div><label className="text-[10px] font-black text-text-secondary uppercase tracking-widest pl-2 opacity-80">Título</label><input type="text" value={newPost.title} onChange={(e) => setNewPost({...newPost, title: e.target.value})} className="w-full mt-2 bg-surface-900 border border-black/10 dark:border-white/10 p-5 rounded-2xl text-text-primary font-black" /></div>
                   <div><label className="text-[10px] font-black text-text-secondary uppercase tracking-widest pl-2 opacity-80">Conteúdo</label><textarea value={newPost.content} onChange={(e) => setNewPost({...newPost, content: e.target.value})} className="w-full mt-2 bg-surface-900 border border-black/10 dark:border-white/10 p-5 rounded-2xl text-text-primary font-bold h-32" /></div>
                </div>
                <div className="flex gap-4 mt-10">
                   <button onClick={() => setShowPostModal(false)} className="flex-1 py-5 rounded-2xl bg-surface-700 text-text-primary border border-black/10 dark:border-white/10 font-black uppercase text-[10px] cursor-pointer">Cancelar</button>
                   <button onClick={handlePost} className="flex-1 py-5 rounded-2xl bg-accent-primary text-black font-black uppercase text-[10px] shadow-xl border-none cursor-pointer">POSTAR</button>
                </div>
             </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
