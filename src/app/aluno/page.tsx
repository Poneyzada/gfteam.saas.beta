'use client'

import { useApp } from '@/contexts/AppContext'
import { 
  QrCode, User, BookOpen, Award, CheckCircle2, 
  ChevronRight, Calendar, Clock, Trophy, Bell, Settings, Zap, Shield,
  TrendingUp, Star, CreditCard, Camera, MapPin, Share2, Download, LogOut
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { motion, AnimatePresence } from 'framer-motion'

export default function AlunoApp() {
  const { lang, mode } = useApp()
  const [activeTab, setActiveTab] = useState('home')
  const [showID, setShowID] = useState(false)
  const [userName, setUserName] = useState('Lucas Andrade')
  const [userRole, setUserRole] = useState('student')
  const [studentBelt, setStudentBelt] = useState('azul')

  useEffect(() => {
    async function getProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase.from('profiles').select('full_name, role').eq('id', user.id).single()
        if (data?.full_name) setUserName(data.full_name)
        if (data?.role) setUserRole(data.role)
      }
    }
    getProfile()
  }, [])

  const beltColors: Record<string, { bg: string, text: string, accent: string, rgb: string }> = {
    branca: { bg: 'bg-white', text: 'text-surface-900', accent: '#fff', rgb: '255, 255, 255' },
    azul: { bg: 'bg-blue-600', text: 'text-white', accent: '#2563eb', rgb: '37, 99, 235' },
    roxa: { bg: 'bg-purple-700', text: 'text-white', accent: '#7e22ce', rgb: '126, 34, 206' },
    marrom: { bg: 'bg-[#5D4037]', text: 'text-white', accent: '#5D4037', rgb: '93, 64, 55' },
    preta: { bg: 'bg-surface-950', text: 'text-accent-primary', accent: '#ccff00', rgb: '0, 0, 0' },
  }
  const currentTheme = beltColors[studentBelt as keyof typeof beltColors] || beltColors.branca

  // Experimental Mode UI
  if (userRole === 'experimental') {
    return (
      <div className="min-h-screen bg-surface-900 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden stippled">
         <div className="absolute top-0 w-full h-full bg-gradient-to-b from-accent-primary/20 to-transparent pointer-events-none" />
        
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-32 h-32 rounded-[3.5rem] bg-accent-primary flex items-center justify-center mb-10 shadow-[0_30px_60px_rgba(var(--accent-rgb),0.4)] hatched relative z-10"
        >
            <Zap className="w-16 h-16 text-surface-900" />
        </motion.div>
        
        <motion.div
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.2 }}
           className="relative z-10"
        >
          <h1 className="text-4xl font-display font-black text-text-primary mb-4 tracking-tighter italic uppercase">Bem-vindo, <br/><span className="text-accent-primary">{userName.split(' ')[0]}!</span></h1>
          <p className="text-text-dim text-sm font-medium mb-12 max-w-xs mx-auto leading-relaxed">
            Seu **Portal Elite** está pronto. Você tem <span className="text-text-primary">3 dias</span> de acesso total para treinar e sentir o DNA GFTeam.
          </p>
        </motion.div>

        <motion.div 
           initial={{ y: 20, opacity: 0 }}
           animate={{ y: 0, opacity: 1 }}
           transition={{ delay: 0.4 }}
           className="w-full max-w-sm space-y-6 relative z-10"
        >
           <div className="kpi-card !p-10 !rounded-[3rem] border-accent-primary/30 bg-surface-800/60 backdrop-blur-xl">
              <div className="card-accent" />
              <div className="flex items-center justify-between mb-8">
                 <div className="text-left">
                    <p className="text-[10px] font-black text-accent-primary uppercase tracking-[0.3em] mb-2">Primeiro Treino</p>
                    <p className="text-2xl font-black text-text-primary italic tracking-tight italic uppercase leading-none">HOJE, 19:00</p>
                    <p className="text-xs text-text-dim font-bold mt-2 uppercase tracking-widest flex items-center gap-2">
                       <MapPin className="w-3 h-3" /> Unidade Matriz
                    </p>
                 </div>
                 <div className="w-14 h-14 rounded-2xl bg-surface-700 flex items-center justify-center border border-white/5">
                    <Clock className="w-6 h-6 text-accent-primary" />
                 </div>
              </div>
              <div className="flex -space-x-3 mb-6">
                 {[1,2,3,4].map(i => <img key={i} src={`https://i.pravatar.cc/100?u=tm${i}`} className="w-8 h-8 rounded-full border-2 border-surface-800" />)}
                 <div className="h-8 px-3 rounded-full bg-surface-900 border-2 border-surface-800 flex items-center text-[8px] font-black text-text-dim uppercase">E mais 42 no tatame</div>
              </div>
           </div>

           <button className="btn-primary w-full !rounded-[2.5rem] py-6 shadow-2xl group">
              <span className="uppercase tracking-[0.4em]">Acessar meu QG</span>
           </button>
        </motion.div>

        <p className="mt-12 text-[10px] text-text-dim font-black uppercase tracking-[0.4em] opacity-40 relative z-10">GFTeam International • Elite Only</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface-900 flex flex-col max-w-md mx-auto relative overflow-hidden stippled font-sans">
      
      {/* Dynamic Header */}
      <AnimatePresence mode="wait">
        <motion.header 
          key={activeTab}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="px-6 pt-14 pb-10 relative z-20"
        >
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="relative group">
                   <div className={`w-14 h-14 rounded-3xl ${currentTheme.bg} flex items-center justify-center p-1 shadow-2xl`}>
                      <img src="https://i.pravatar.cc/150?u=lucas" className="w-full h-full object-cover rounded-[1.2rem]" />
                   </div>
                   <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-xl ${currentTheme.bg} border-4 border-surface-900 flex items-center justify-center`}>
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-primary animate-pulse" />
                   </div>
                </div>
                <div>
                   <h1 className="text-xl font-display font-black text-text-primary tracking-tighter italic uppercase leading-none">{userName.split(' ')[0]}</h1>
                   <p className="text-[10px] font-black text-accent-primary uppercase tracking-[0.3em] mt-1.5 opacity-80">Faixa {studentBelt} G3</p>
                </div>
             </div>
             
             <div className="flex items-center gap-3">
                <button 
                  onClick={async () => {
                    await supabase.auth.signOut()
                    window.location.href = '/login'
                  }}
                  className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center relative hover:bg-red-500/20 active:scale-95 transition-all text-red-500"
                >
                  <LogOut className="w-5 h-5" />
                </button>
                <button 
                  onClick={() => setShowID(!showID)}
                  className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center shadow-xl group active:scale-95 transition-all border border-white/10"
                >
                  <QrCode className="w-6 h-6 text-white group-hover:rotate-12 transition-transform" />
                </button>
             </div>
          </div>
        </motion.header>
      </AnimatePresence>

      {/* Main Container */}
      <main className="flex-1 px-6 pb-32 relative z-10">
        
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div 
              key="home"
              initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
              className="space-y-8"
            >
               {/* Next Class Hero */}
               <div className="kpi-card !p-10 !rounded-[3rem] border-accent-primary/20 bg-accent-primary/5 overflow-visible">
                  <div className="card-accent" />
                  <div className="flex items-center justify-between mb-8">
                     <span className="text-[10px] font-black text-accent-primary uppercase tracking-[0.4em]">Próximo Treino</span>
                     <div className="h-6 px-3 rounded-full bg-accent-primary/20 border border-accent-primary/30 flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-accent-primary animate-pulse" />
                        <span className="text-[8px] font-black text-accent-primary uppercase tracking-widest">Em 45 min</span>
                     </div>
                  </div>
                  <h2 className="text-3xl font-display font-black text-text-primary mb-6 leading-tight italic tracking-tighter uppercase">PASSAGEM DE <br/><span className="text-accent-primary">MEIA GUARDA</span></h2>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-white/10">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-surface-800 border border-white/10 flex items-center justify-center font-black text-xs text-text-dim uppercase">F</div>
                        <div>
                           <p className="text-[10px] font-bold text-text-primary uppercase tracking-widest leading-none">Mestre Frazão</p>
                           <p className="text-[9px] text-text-dim font-medium mt-1 uppercase tracking-widest italic">Unidade Matriz • 19:00</p>
                        </div>
                     </div>
                     <button className="w-12 h-12 rounded-2xl bg-black text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform">
                        <CheckCircle2 className="w-6 h-6" />
                     </button>
                  </div>
               </div>

               {/* Quick Stats Grid */}
               <div className="grid grid-cols-2 gap-6">
                  <div className="kpi-card !p-8 !rounded-[2.5rem] bg-surface-800/40">
                     <div className="flex items-center gap-3 mb-6">
                        <Trophy className="w-5 h-5 text-accent-primary saturate-[2]" />
                        <span className="text-[10px] font-black text-text-dim uppercase tracking-[0.2em]">Rank</span>
                     </div>
                     <p className="text-4xl font-display font-black text-text-primary tracking-tighter italic">#12 <span className="text-[10px] text-emerald-400 opacity-60">+2</span></p>
                  </div>
                  <div className="kpi-card !p-8 !rounded-[2.5rem] bg-surface-800/40">
                     <div className="flex items-center gap-3 mb-6">
                        <TrendingUp className="w-5 h-5 text-accent-primary" />
                        <span className="text-[10px] font-black text-text-dim uppercase tracking-[0.2em]">Frequência</span>
                     </div>
                     <p className="text-4xl font-display font-black text-text-primary tracking-tighter italic">92%</p>
                  </div>
               </div>

               {/* Academy Feed */}
               <div className="space-y-4">
                  <h3 className="text-[10px] font-black text-text-dim uppercase tracking-[0.3em] ml-2">Timeline do QG</h3>
                  {[
                    { title: 'Exame de Faixa', desc: '12 de Abril • 09:00', icon: Award, color: 'text-accent-primary' },
                    { title: 'Novo Video: Estratégia', desc: 'Assistir para o treino de hoje', icon: Zap, color: 'text-accent-primary' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-5 p-6 rounded-[2rem] bg-surface-800/50 border border-white/5 hover:border-white/10 transition-all group cursor-pointer">
                       <div className="w-12 h-12 rounded-2xl bg-surface-700 flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                          <item.icon className={`w-6 h-6 ${item.color}`} />
                       </div>
                       <div className="flex-1">
                          <p className="text-xs font-black text-text-primary uppercase tracking-widest">{item.title}</p>
                          <p className="text-[10px] text-text-dim font-medium mt-1 uppercase tracking-widest opacity-60 italic">{item.desc}</p>
                       </div>
                       <ChevronRight className="w-4 h-4 text-text-dim opacity-30 group-hover:translate-x-1 transition-transform" />
                    </div>
                  ))}
               </div>
            </motion.div>
          )}

          {activeTab === 'performance' && (
            <motion.div 
              key="performance"
              initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
              className="space-y-8"
            >
               <div className="kpi-card !p-10 !rounded-[3rem] bg-surface-800 border-none relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-48 h-full hatched opacity-10" />
                  <p className="text-[10px] font-black text-accent-primary uppercase tracking-[0.3em] mb-4">Sua Trajetória</p>
                  <h2 className="text-3xl font-display font-black text-text-primary italic tracking-tighter uppercase leading-none mb-10">CAMINHO DO <br/>GUERREIRO</h2>
                  
                  <div className="space-y-12">
                     <div className="flex gap-6 relative">
                        <div className="absolute left-6 top-10 w-[1px] h-12 bg-white/10" />
                        <div className="w-12 h-12 rounded-[1.2rem] bg-accent-primary flex items-center justify-center text-surface-900 shadow-xl hatched z-10">
                           <Star className="w-6 h-6" />
                        </div>
                        <div>
                           <p className="text-xs font-black text-text-primary uppercase tracking-widest">Graduação Azul G3</p>
                           <p className="text-[10px] text-text-dim font-medium mt-1 uppercase tracking-widest opacity-60">Outubro 2025 • Mestre Julio Cesar</p>
                        </div>
                     </div>
                     <div className="flex gap-6 relative">
                        <div className="absolute left-6 top-10 w-[1px] h-12 bg-white/10 opacity-0" />
                        <div className="w-12 h-12 rounded-[1.2rem] bg-surface-700 flex items-center justify-center border border-white/10 z-10">
                           <Trophy className="w-6 h-6 text-text-dim" />
                        </div>
                        <div>
                           <p className="text-xs font-black text-text-primary uppercase tracking-widest">Bronze - Open Rio</p>
                           <p className="text-[10px] text-text-dim font-medium mt-1 uppercase tracking-widest opacity-60">Janeiro 2026 • Categoria Médio</p>
                        </div>
                     </div>
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-6">
                  <div className="kpi-card !p-8 !rounded-[2.5rem] border-white/5 bg-accent-primary">
                     <p className="text-[10px] font-black text-surface-900 uppercase tracking-widest mb-2 opacity-60">Medalhas</p>
                     <p className="text-5xl font-display font-black text-surface-900 italic tracking-tighter leading-none">08</p>
                  </div>
                  <div className="kpi-card !p-8 !rounded-[2.5rem] border-white/5 bg-surface-800">
                     <p className="text-[10px] font-black text-accent-primary uppercase tracking-widest mb-2">Treinos Total</p>
                     <p className="text-5xl font-display font-black text-text-primary italic tracking-tighter leading-none">412</p>
                  </div>
               </div>
            </motion.div>
          )}

          {activeTab === 'finances' && (
             <motion.div 
               key="finances"
               initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}
               className="space-y-8"
             >
                <div className="kpi-card !p-10 !rounded-[3rem] bg-gradient-to-br from-emerald-500 to-emerald-700 border-none shadow-2xl relative overflow-hidden">
                   <div className="card-accent !opacity-20" />
                   <div className="flex justify-between items-start mb-16">
                      <div>
                         <p className="text-[10px] font-black text-white/60 uppercase tracking-[0.4em] mb-2">Plano Ativo</p>
                         <h2 className="text-2xl font-display font-black text-white tracking-tighter uppercase italic">GFTEAM PRO • FULL</h2>
                      </div>
                      <CreditCard className="w-8 h-8 text-white/30" />
                   </div>
                   <div className="flex items-end justify-between">
                      <div>
                         <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Próximo Vencimento</p>
                         <p className="text-xl font-bold text-white tracking-widest">05 / ABR / 2026</p>
                      </div>
                      <div className="px-4 py-2 rounded-2xl bg-white/20 backdrop-blur-md border border-white/10 text-[10px] font-black text-white uppercase tracking-widest">RECORRENTE</div>
                   </div>
                </div>

                <div className="space-y-4">
                   <h3 className="text-[10px] font-black text-text-dim uppercase tracking-[0.3em] ml-2">Histórico de Pagamento</h3>
                   {[1,2,3].map(i => (
                     <div key={i} className="flex items-center justify-between p-6 rounded-[2rem] bg-surface-800/50 border border-white/5">
                        <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-2xl bg-surface-700 flex items-center justify-center border border-white/10">
                              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                           </div>
                           <div>
                              <p className="text-xs font-black text-text-primary uppercase tracking-widest">Mensalidade Março</p>
                              <p className="text-[10px] text-text-dim font-medium mt-1 uppercase tracking-widest opacity-40 italic">Pago em 05/03/2026</p>
                           </div>
                        </div>
                        <p className="text-sm font-black text-text-primary italic">R$ 180,00</p>
                     </div>
                   ))}
                </div>
             </motion.div>
          )}

          {activeTab === 'id' && (
             <motion.div 
               key="id"
               initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
               className="flex flex-col items-center py-4"
             >
                {/* Athlete ID Card - Premium Look */}
                <div className={`w-full aspect-[1/1.6] rounded-[4rem] ${currentTheme.bg} p-10 relative overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.5)]`}>
                   {/* Background Effects */}
                   <div className="absolute inset-0 hatched opacity-20 pointer-events-none" />
                   <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-black/60 to-transparent opacity-80" />
                   
                   <div className="relative z-10 flex flex-col h-full">
                      {/* Brand Header */}
                      <div className="flex items-center justify-between mb-16">
                         <div className="flex items-center gap-2">
                            <Shield className={`w-6 h-6 ${currentTheme.text}`} />
                            <span className={`text-sm font-black tracking-tighter italic uppercase ${currentTheme.text}`}>GFTEAM <span className="opacity-60">SQUAD</span></span>
                         </div>
                         <div className={`px-3 py-1.5 rounded-full border border-current opacity-60 text-[8px] font-black uppercase tracking-widest ${currentTheme.text}`}>INTERNACIONAL</div>
                      </div>

                      {/* Photo Area */}
                      <div className="flex flex-col items-center mb-12">
                         <div className="w-40 h-40 rounded-[3rem] p-2 bg-gradient-to-b from-white to-transparent shadow-2xl relative">
                            <img src="https://i.pravatar.cc/300?u=lucas" className="w-full h-full object-cover rounded-[2.2rem]" />
                            <div className={`absolute -bottom-3 -right-3 w-12 h-12 rounded-[1.5rem] ${currentTheme.bg} border-4 border-current flex items-center justify-center shadow-xl`}>
                               <div className="w-2 h-2 rounded-full bg-accent-primary animate-pulse" />
                            </div>
                         </div>
                      </div>

                      {/* Name and Rank */}
                      <div className="text-center mb-16">
                         <h2 className={`text-3xl font-display font-black tracking-tighter italic uppercase leading-tight ${currentTheme.text}`}>LUCAS <br/>ANDRADE</h2>
                         <div className={`flex items-center justify-center gap-2 mt-4 opacity-80 ${currentTheme.text}`}>
                            <div className="w-1.5 h-1.5 rounded-full bg-current" />
                            <p className="text-[10px] font-black uppercase tracking-[0.4em]">AZUL • G3 • ATLETA</p>
                            <div className="w-1.5 h-1.5 rounded-full bg-current" />
                         </div>
                      </div>

                      {/* QR Code and Meta */}
                      <div className="mt-auto flex flex-col items-center gap-8">
                         <div className="p-5 bg-white rounded-[2.5rem] shadow-2xl group active:scale-95 transition-all">
                            <QrCode className="w-28 h-28 text-surface-900" />
                         </div>
                         <div className={`text-center space-y-2 ${currentTheme.text}`}>
                            <p className={`text-[10px] font-black uppercase tracking-widest opacity-40`}>ID: 2026-GF-884-RIO</p>
                            <div className="flex justify-center gap-4 opacity-20">
                               <div className="w-1 h-3 bg-current rounded-full" />
                               <div className="w-1 h-3 bg-current rounded-full" />
                               <div className="w-1 h-3 bg-current rounded-full" />
                            </div>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-3 gap-6 mt-12 w-full">
                   <button className="flex flex-col items-center gap-2 group">
                      <div className="w-12 h-12 rounded-2xl bg-surface-800 border border-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-surface-700 transition-all">
                         <Download className="w-5 h-5 text-accent-primary" />
                      </div>
                      <span className="text-[8px] font-black text-text-dim uppercase tracking-[0.2em]">Baixar ID</span>
                   </button>
                   <button className="flex flex-col items-center gap-2 group">
                      <div className="w-12 h-12 rounded-2xl bg-surface-800 border border-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-surface-700 transition-all">
                         <Share2 className="w-5 h-5 text-accent-primary" />
                      </div>
                      <span className="text-[8px] font-black text-text-dim uppercase tracking-[0.2em]">Compartilhar</span>
                   </button>
                   <button className="flex flex-col items-center gap-2 group">
                      <div className="w-12 h-12 rounded-2xl bg-surface-800 border border-white/5 flex items-center justify-center group-hover:scale-110 group-hover:bg-surface-700 transition-all">
                         <Camera className="w-5 h-5 text-accent-primary" />
                      </div>
                      <span className="text-[8px] font-black text-text-dim uppercase tracking-[0.2em]">Nova Foto</span>
                   </button>
                </div>
             </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Nav Bar - Premium Floating */}
      <div className="fixed bottom-8 left-6 right-6 max-w-md mx-auto z-50">
         <div className="glass !rounded-[2.5rem] !bg-surface-800/80 backdrop-blur-2xl border-white/5 px-8 h-20 flex justify-between items-center shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
            {[
              { id: 'home', icon: User, label: 'QG' },
              { id: 'performance', icon: Star, label: 'Track' },
              { id: 'id', icon: Shield, label: 'ID' },
              { id: 'finances', icon: CreditCard, label: 'Pay' },
            ].map((item) => (
              <button 
                key={item.id} 
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1.5 transition-all group relative ${activeTab === item.id ? 'text-accent-primary' : 'text-text-dim'}`}
              >
                {activeTab === item.id && (
                  <motion.div 
                    layoutId="nav_vibe" 
                    className="absolute -top-1 w-12 h-12 bg-accent-primary/10 rounded-2xl border border-accent-primary/20 blur-sm"
                  />
                )}
                <item.icon className={`w-6 h-6 z-10 ${activeTab === item.id ? 'scale-110 drop-shadow-[0_0_8px_rgba(var(--accent-rgb),0.5)]' : 'group-hover:scale-110 transition-transform'}`} />
                <span className="text-[8px] font-black uppercase tracking-[0.2em] z-10">{item.label}</span>
              </button>
            ))}
         </div>
      </div>
    </div>
  )
}
