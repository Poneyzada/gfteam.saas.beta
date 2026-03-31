'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Shield, Lock, Loader2, CheckCircle2, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    setLoading(true)
    setError('')

    const { error: resetError } = await supabase.auth.updateUser({
      password: password,
    })

    if (resetError) {
      setError(resetError.message)
    } else {
      setSuccess(true)
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center p-6 relative overflow-hidden stippled">
       {/* Background Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-primary/10 blur-[120px] rounded-full" />
      
      <div className="w-full max-w-md animate-fade-up relative z-10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-[2rem] bg-accent-primary flex items-center justify-center mx-auto mb-6 shadow-2xl hatched border border-white/10">
            <Shield className="w-10 h-10 text-black drop-shadow-lg" />
          </div>
          <h1 className="text-3xl font-display font-black text-text-primary tracking-tighter italic uppercase underline decoration-accent-primary/20 decoration-4">Redefinir Senha</h1>
          <p className="text-[#A1A1AA] font-black uppercase tracking-[0.4em] text-[9px] mt-4 opacity-100">
            Segurança de Elite • GFTeam SaaS
          </p>
        </div>

        <div className="bg-surface-800/60 backdrop-blur-3xl border border-white/5 p-10 !rounded-[3rem] relative shadow-2xl">
          {success ? (
            <div className="text-center space-y-6 animate-fade-up">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto border border-emerald-500/50">
                <CheckCircle2 className="w-8 h-8 text-emerald-500" />
              </div>
              <h2 className="text-xl font-display font-bold text-text-primary tracking-tight">Senha Alterada!</h2>
              <p className="text-[#A1A1AA] text-[10px] font-black uppercase tracking-widest leading-relaxed">
                Sua nova senha foi salva. Redirecionando para o portal em instantes...
              </p>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-accent-primary animate-[upload_3s_linear]" />
              </div>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#A1A1AA] uppercase tracking-widest ml-1">Nova Senha</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent-primary transition-colors" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-surface-900 border border-white/5 rounded-2xl py-5 pl-14 pr-4 text-text-primary placeholder:text-text-muted/30 focus:border-accent-primary/50 outline-none transition-all font-bold text-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#A1A1AA] uppercase tracking-widest ml-1">Confirmar Nova Senha</label>
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent-primary transition-colors" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-surface-900 border border-white/5 rounded-2xl py-5 pl-14 pr-4 text-text-primary placeholder:text-text-muted/30 focus:border-accent-primary/50 outline-none transition-all font-bold text-sm"
                  />
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black text-center uppercase tracking-widest hatched">
                   {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full !rounded-2xl py-5 shadow-2xl mt-4"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin text-black" />
                ) : (
                  <span className="uppercase tracking-[0.3em] text-[10px] font-black text-black">
                    Atualizar Senha
                  </span>
                )}
              </button>
            </form>
          )}
        </div>

        <div className="text-center mt-12 opacity-30">
           <p className="text-[9px] text-[#A1A1AA] font-black uppercase tracking-[0.5em]">
             GFTeam Academy • Security Unit
           </p>
        </div>
      </div>
    </div>
  )
}
