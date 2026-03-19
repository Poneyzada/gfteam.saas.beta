'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Shield, Mail, Lock, Loader2, ArrowRight, UserPlus } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState<'student' | 'manager' | 'instructor' | 'master'>('student')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    if (!authData.user) {
      setError('Erro ao autenticar. Tente novamente.')
      setLoading(false)
      return
    }

    // 2. Fetch profile to get role
    let { data: profile } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', authData.user.id)
      .single()

    if (!profile) {
      const { data: tenantData } = await supabase.from('tenants').select('id').limit(1).single()
      const { data: newProfile, error: insertError } = await supabase
        .from('profiles')
        .insert([{ id: authData.user.id, full_name: 'Usuário Beta', role: 'manager', tenant_id: tenantData?.id }])
        .select()
        .single()
      
      if (insertError) {
        setError('Erro ao criar perfil: ' + insertError.message)
        setLoading(false)
        return
      }
      profile = newProfile
    }

    if (profile) {
        switch (profile.role) {
          case 'master':
            router.push('/dashboard/master')
            break
          case 'student':
            router.push('/aluno')
            break
          default:
            router.push('/dashboard')
            break
        }
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (authData.user) {
      const { data: tenantData } = await supabase.from('tenants').select('id').limit(1).single()
      const tenantId = tenantData?.id 

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          { 
            id: authData.user.id, 
            full_name: fullName, 
            role: role,
            tenant_id: tenantId 
          }
        ])

      if (profileError) {
        setError('Erro ao criar perfil: ' + profileError.message)
        setLoading(false)
        return
      }

      setSuccess('Conta criada com sucesso! Você já pode entrar.')
      setIsSignUp(false)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-surface-900 flex items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,rgba(var(--accent-rgb),0.05),transparent_40%),radial-gradient(circle_at_bottom_left,rgba(var(--accent-rgb),0.02),transparent_40%)]">
      <div className="w-full max-w-md animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 rounded-[2rem] bg-accent-primary flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-accent-primary/20">
            <Shield className="w-10 h-10 text-surface-900" />
          </div>
          <h1 className="text-3xl font-display font-black text-text-primary tracking-tight">GFTeam SaaS</h1>
          <p className="text-accent-primary font-black mt-2 uppercase tracking-widest text-[10px] animate-pulse">
            • VERSION 2.0 (LIVE) •
          </p>
          <p className="text-text-muted font-bold mt-1 uppercase tracking-widest text-xs">
            {isSignUp ? 'Criação de Conta • Beta' : 'Acesso Restrito • Monitoramento'}
          </p>
        </div>

        {/* Card */}
        <div className="kpi-card !bg-surface-800/50 backdrop-blur-xl border-white/5 p-10 !rounded-[3rem] relative overflow-hidden">
          <div className="card-accent" />
          
          <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-6">
            
            {isSignUp && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Nome Completo</label>
                <div className="relative">
                  <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Seu Nome"
                    className="w-full bg-surface-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-text-primary placeholder:text-text-muted/50 focus:border-accent-primary/50 outline-none transition-all font-semibold"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full bg-surface-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-text-primary placeholder:text-text-muted/50 focus:border-accent-primary/50 outline-none transition-all font-semibold"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Senha</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-surface-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-text-primary placeholder:text-text-muted/50 focus:border-accent-primary/50 outline-none transition-all font-semibold"
                />
              </div>
            </div>

            {isSignUp && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Tipo de Acesso</label>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('student')}
                      className={`flex-1 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${role === 'student' ? 'border-accent-primary bg-accent-primary/10 text-accent-primary' : 'border-white/5 bg-surface-900 text-text-muted'}`}
                    >
                      Aluno
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('instructor')}
                      className={`flex-1 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${role === 'instructor' ? 'border-accent-primary bg-accent-primary/10 text-accent-primary' : 'border-white/5 bg-surface-900 text-text-muted'}`}
                    >
                      Instrutor
                    </button>
                    <button
                      type="button"
                      onClick={() => setRole('manager')}
                      className={`flex-1 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${role === 'manager' ? 'border-accent-primary bg-accent-primary/10 text-accent-primary' : 'border-white/5 bg-surface-900 text-text-muted'}`}
                    >
                      Mestre
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRole('student')}
                    className={`w-full py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all border-white/5 bg-surface-900 text-text-muted hover:border-accent-primary/30`}
                  >
                    Responsável (Mãe/Pai)
                  </button>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest text-center leading-relaxed">
                ERROR: {error}
              </div>
            )}

            {success && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest text-center">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full !rounded-2xl py-4 flex items-center justify-center gap-3 group transition-all btn-primary"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <span className="uppercase tracking-[0.2em] text-xs font-black">
                    {isSignUp ? 'Criar minha Conta' : 'Entrar no Sistema'}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <button 
              onClick={() => { setIsSignUp(!isSignUp); setError(null); setSuccess(null); }}
              className="text-[10px] text-text-muted font-bold uppercase tracking-widest hover:text-accent-primary transition-colors"
            >
              {isSignUp ? 'Já tenho uma conta? Entrar' : 'Não tem conta? Criar acesso'}
            </button>
          </div>
        </div>

        <p className="text-center mt-8 text-[10px] text-text-muted font-bold uppercase tracking-widest opacity-30">
          GFTeam International • 2026
        </p>
      </div>
    </div>
  )
}
