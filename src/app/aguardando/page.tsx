'use client'

import { Shield, Clock, LogOut } from 'lucide-react'
import { supabase } from '@/lib/supabase'

export default function AguardandoPage() {
  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center p-6 stippled">
      <div className="max-w-md w-full kpi-card !p-12 text-center border-accent-primary/20 bg-surface-800/60 shadow-2xl animate-fade-up">
        <div className="card-accent" />
        
        <div className="w-20 h-20 rounded-3xl bg-accent-primary/10 flex items-center justify-center mx-auto mb-8 border border-accent-primary/20">
          <Shield className="w-10 h-10 text-accent-primary animate-pulse" />
        </div>

        <h1 className="text-3xl font-display font-black text-text-primary tracking-tighter italic uppercase mb-4">
          Acesso Pendente
        </h1>
        
        <p className="text-text-secondary font-black uppercase tracking-widest text-[10px] mb-8 leading-relaxed">
          Sua conta foi criada com sucesso, mas ainda precisa ser liberada pelo Mestre da sua academia. 🥋🔒
        </p>

        <div className="flex items-center justify-center gap-2 px-6 py-4 bg-surface-900 rounded-2xl border border-white/10 mb-10">
          <Clock className="w-4 h-4 text-accent-primary" />
          <span className="text-[10px] font-black text-text-primary uppercase tracking-[0.2em]">Fila de Aprovação</span>
        </div>

        <button 
          onClick={async () => {
            await supabase.auth.signOut()
            window.location.href = '/login'
          }}
          className="w-full flex items-center justify-center gap-3 py-5 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-500/20 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sair do Sistema
        </button>

        <p className="mt-8 text-[9px] font-black text-text-muted uppercase tracking-[0.3em] opacity-40">
          GFTeam SaaS • Segurança em Primeiro Lugar
        </p>
      </div>
    </div>
  )
}
