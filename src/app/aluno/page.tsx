'use client'

import { useApp } from '@/contexts/AppContext'
import { 
  QrCode, User, BookOpen, Award, CheckCircle2, 
  ChevronRight, Calendar, Clock, Trophy, Bell, Settings, Zap, Shield
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AlunoApp() {
  const { lang, mode } = useApp()
  const [activeTab, setActiveTab] = useState('home')
  const [checkinStatus, setCheckinStatus] = useState<'none' | 'pending' | 'approved'>('none')
  const [userName, setUserName] = useState('Guerreiro')
  const [userRole, setUserRole] = useState('student')

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

  // Experimental Mode UI
  if (userRole === 'experimental') {
    return (
      <div className="min-h-screen bg-surface-900 flex flex-col items-center justify-center p-8 text-center bg-[radial-gradient(circle_at_top,rgba(var(--accent-rgb),0.1),transparent_50%)]">
        <div className="w-24 h-24 rounded-[2rem] bg-accent-primary flex items-center justify-center mb-8 shadow-2xl shadow-accent-primary/20 animate-bounce">
            <Zap className="w-12 h-12 text-surface-900" />
        </div>
        <h1 className="text-3xl font-display font-black text-text-primary mb-4 tracking-tight">Bem-vindo, {userName}!</h1>
        <p className="text-text-secondary text-sm font-medium mb-10 max-w-xs leading-relaxed">
          Você está no **Modo Experimental**. Aproveite seus 3 dias de acesso premium e prepare-se para sua primeira aula!
        </p>

        <div className="w-full max-w-sm space-y-4">
           <div className="kpi-card p-6 !rounded-3xl border-accent-primary/20 bg-accent-primary/5">
              <div className="card-accent" />
              <p className="text-[10px] font-black text-accent-primary uppercase tracking-widest mb-3">Sua Aula Experimental</p>
              <div className="flex items-center justify-between">
                 <div className="text-left">
                    <p className="text-xl font-bold text-text-primary italic">Hoje, 19:00</p>
                    <p className="text-xs text-text-muted font-bold">Unidade Matriz</p>
                 </div>
                 <div className="w-12 h-12 rounded-xl bg-surface-700 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-accent-primary" />
                 </div>
              </div>
           </div>

           <button className="w-full py-5 rounded-2xl bg-white text-surface-900 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] transition-all">
              <Shield className="w-4 h-4" />
              Ver Vídeo de Introdução
           </button>
        </div>

        <p className="mt-12 text-[10px] text-text-muted font-bold uppercase tracking-[0.3em] opacity-40">Oss! GFTeam International</p>
      </div>
    )
  }

  // Belt-based dynamic theming
  const studentBelt: string = 'azul' 
  const beltColors: Record<string, { bg: string, text: string, shadow: string, rgb: string }> = {
    branca: { bg: 'bg-white', text: 'text-surface-900', shadow: 'shadow-white/20', rgb: '255, 255, 255' },
    azul: { bg: 'bg-blue-600', text: 'text-white', shadow: 'shadow-blue-500/30', rgb: '37, 99, 235' },
    roxa: { bg: 'bg-purple-700', text: 'text-white', shadow: 'shadow-purple-500/30', rgb: '126, 34, 206' },
    marrom: { bg: 'bg-[#5D4037]', text: 'text-white', shadow: 'shadow-[#5D4037]/30', rgb: '93, 64, 55' },
    preta: { bg: 'bg-surface-950', text: 'text-accent-primary', shadow: 'shadow-black/40', rgb: '0, 0, 0' },
  }
  const theme = beltColors[studentBelt] || beltColors.branca

  const beltProgress = 72
  const nextClass = { time: '19:00', name: 'Jiu-Jitsu Adulto', mat: 'Principal' }

  const handleRequestEntry = () => {
    setCheckinStatus('pending')
    // Simulated: In reality, insert into 'checkins' table in Supabase
    setTimeout(() => {
        // Just for demo, a real instructor would approve this
    }, 5000)
  }

  return (
    <div className="min-h-screen bg-surface-900 flex flex-col max-w-md mx-auto relative overflow-hidden">
      {/* Noise background */}
      <div className="absolute inset-0 noise-overlay pointer-events-none opacity-50" />

      {/* Header */}
      <header className="px-6 pt-12 pb-6 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-green to-brand-green-dark flex items-center justify-center p-0.5 shadow-lg shadow-brand-green/20">
              <div className="w-full h-full rounded-[14px] bg-surface-900 flex items-center justify-center">
                <span className="text-sm font-bold text-text-primary">LA</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-text-muted">{lang === 'pt' ? 'Bem-vindo,' : 'Welcome back,'}</p>
              <p className="text-lg font-display font-bold text-text-primary leading-tight">Lucas Andrade</p>
            </div>
          </div>
          <button className="w-10 h-10 rounded-xl bg-surface-800 border border-surface-600 flex items-center justify-center relative">
            <Bell className="w-5 h-5 text-text-muted" />
            <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full accent-bg border-2 border-surface-800" />
          </button>
        </div>

        {/* Access QR Card - Floating */}
        <div className={`kpi-card bg-gradient-to-br from-surface-700 to-surface-800 border-surface-600 p-6 flex flex-col items-center transition-all relative overflow-hidden ${checkinStatus === 'pending' ? 'ring-2 ring-accent-primary' : ''}`}>
          <div className="card-accent" />
          <p className="text-[10px] font-mono font-bold tracking-[0.2em] text-text-muted mb-4 uppercase">CONTROLE DE ACESSO</p>
          <div className={`p-4 bg-white rounded-3xl mb-4 shadow-[0_0_30px_rgba(${theme.rgb},0.3)] transition-all`}>
            <QrCode className="w-32 h-32 text-surface-900" strokeWidth={1.5} />
          </div>
          <p className="text-sm font-semibold text-text-primary mb-1">Lucas Andrade #2884</p>
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">{lang === 'pt' ? 'MENSALIDADE EM DIA' : 'PAID'}</span>
          </div>
          
          {checkinStatus === 'none' && (
            <button 
              onClick={handleRequestEntry}
              className={`w-full py-4 rounded-2xl ${theme.bg} ${theme.text} text-xs font-black uppercase tracking-widest ${theme.shadow} shadow-lg active:scale-95 transition-all`}
            >
              {lang === 'pt' ? 'Solicitar Entrada' : 'Request Entry'}
            </button>
          )}

          {checkinStatus === 'pending' && (
            <div className="w-full py-4 rounded-2xl bg-surface-700 text-text-muted text-[10px] font-black uppercase tracking-widest text-center animate-pulse">
              {lang === 'pt' ? 'Aguardando Liberação...' : 'Waiting for Approval...'}
            </div>
          )}

          {checkinStatus === 'approved' && (
            <div className="w-full py-4 rounded-2xl bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {lang === 'pt' ? 'Acesso Liberado!' : 'Access Granted!'}
            </div>
          )}

          <p className="text-[10px] text-text-muted mt-4 text-center">
            {checkinStatus === 'none' 
              ? (lang === 'pt' ? 'Aproxime da catraca ou solicite ao mestre' : 'Scan or request entry from instructor')
              : (lang === 'pt' ? 'O Mestre Frazão recebeu seu pedido' : 'Frazão received your request')
            }
          </p>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-6 pb-28 relative z-10 space-y-6">
        {/* Next Class */}
        <div className="space-y-3">
          <h2 className="text-sm font-display font-bold text-text-primary uppercase tracking-wider">{lang === 'pt' ? 'PRÓXIMA AULA' : 'NEXT CLASS'}</h2>
          <div className="kpi-card flex items-center gap-4 bg-surface-800/50 relative overflow-hidden">
            <div className="card-accent" />
            <div className="w-12 h-12 rounded-xl bg-surface-700 flex flex-col items-center justify-center border border-surface-600">
              <span className="text-[10px] font-bold text-text-muted uppercase">HOJE</span>
              <span className={`text-sm font-bold ${studentBelt === 'branca' ? 'text-accent-primary' : (theme.text.replace('text-', 'text-'))}`}>{nextClass.time}</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-text-primary">{nextClass.name}</p>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-[10px] flex items-center gap-1 text-text-muted">
                  <Clock className="w-3 h-3" /> 1h 30min
                </span>
                <span className="text-[10px] flex items-center gap-1 text-text-muted">
                  <Calendar className="w-3 h-3" /> Tatame {nextClass.mat}
                </span>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-text-muted" />
          </div>
        </div>

        {/* Belt Progress */}
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <h2 className="text-sm font-display font-bold text-text-primary uppercase tracking-wider">{lang === 'pt' ? 'PROGRESSO DE FAIXA' : 'BELT PROGRESS'}</h2>
            <span className="text-xs font-bold accent-text">Azul G3 → G4</span>
          </div>
          <div className="kpi-card space-y-3 relative overflow-hidden">
            <div className="card-accent" />
            <div className="flex justify-between items-center text-[10px] text-text-muted uppercase font-bold">
              <span>228 aulas</span>
              <span>85% completo</span>
            </div>
            <div className="progress-bar h-2">
              <div className={`progress-bar-fill h-full rounded-full transition-all duration-1000 ${theme.bg}`} style={{ width: '85%' }} />
            </div>
            <p className="text-[10px] text-text-muted italic">{lang === 'pt' ? 'Faltam aproximadamente 12 aulas para seu próximo grau.' : 'You are approx. 12 classes away from your next stripe.'}</p>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="kpi-card p-4 aspect-square flex flex-col items-center justify-center text-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 flex items-center justify-center group-active:scale-95 transition-transform">
              <BookOpen className="w-5 h-5 text-blue-400" />
            </div>
            <span className="text-xs font-bold text-text-primary">{lang === 'pt' ? 'Técnicas' : 'Techniques'}</span>
          </div>
          <div className="kpi-card p-4 aspect-square flex flex-col items-center justify-center text-center gap-3 group">
            <div className="w-10 h-10 rounded-2xl bg-brand-gold/10 flex items-center justify-center group-active:scale-95 transition-transform">
              <Trophy className="w-5 h-5 text-brand-gold" />
            </div>
            <span className="text-xs font-bold text-text-primary">{lang === 'pt' ? 'Competições' : 'Competitions'}</span>
          </div>
        </div>
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-surface-800/80 backdrop-blur-xl border-t border-surface-600 px-6 py-4 flex justify-between items-center z-50">
        {[
          { id: 'home', icon: User, label: 'Home' },
          { id: 'schedule', icon: Calendar, label: 'Timeline' },
          { id: 'rank', icon: Trophy, label: 'Ranking' },
          { id: 'settings', icon: Settings, label: 'Perfil' },
        ].map((item) => (
          <button 
            key={item.id} 
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === item.id ? 'accent-text' : 'text-text-muted'}`}
          >
            <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'accent-text shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)]' : ''}`} />
            <span className="text-[9px] font-bold uppercase tracking-tight">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  )
}
