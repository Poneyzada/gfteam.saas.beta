'use client'

import { useState, useEffect } from 'react'
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      if (params.get('signup') === 'true') {
        setIsSignUp(true)
      }
    }
  }, [])


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
    <div className="min-h-screen bg-surface-900 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows - subtle team color */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent-primary/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent-primary/5 blur-[100px] rounded-full" />

      <div className="w-full max-w-md animate-fade-up relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <div className="w-24 h-24 rounded-[2.5rem] bg-accent-primary flex items-center justify-center mx-auto mb-6 shadow-2xl hatched border border-white/10 group hover:rotate-6 transition-all duration-500">
            <Shield className="w-12 h-12 text-surface-900 drop-shadow-lg" />
          </div>
          <h1 className="text-4xl font-display font-black text-text-primary tracking-tighter italic uppercase text-white">GFTEAM <span className="text-accent-primary">SAAS</span></h1>
          <p className="text-accent-primary font-black uppercase tracking-[0.4em] text-[10px] mt-4 opacity-80">
            World Class Jiu-Jitsu Management
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-surface-800/60 backdrop-blur-3xl border border-white/5 p-10 !rounded-[3rem] relative shadow-2xl overflow-visible">
          {/* Accent Line Box */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-accent-primary rounded-b-full shadow-[0_0_20px_rgba(var(--accent-rgb),0.5)]" />
          
          <div className="mb-10 text-center">
             <h2 className="text-2xl font-display font-bold text-text-primary tracking-tight">
                {isSignUp ? 'Criar Acesso' : 'Entrar no Portal'}
             </h2>
             <p className="text-text-muted text-[10px] font-black mt-2 uppercase tracking-widest opacity-60">
                {isSignUp ? 'Junte-se à elite da GFTeam' : 'Pronto para o próximo rola?'}
             </p>
          </div>
          
          <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-6">
            
            {isSignUp && (
              <div className="space-y-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Nome Completo</label>
                <div className="relative group">
                  <UserPlus className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent-primary transition-colors" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Seu Nome"
                    className="w-full bg-surface-900 border border-white/5 rounded-2xl py-5 pl-14 pr-4 text-text-primary placeholder:text-text-muted/30 focus:border-accent-primary/50 outline-none transition-all font-bold text-sm"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">E-mail</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent-primary transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@equipe.com"
                  className="w-full bg-surface-900 border border-white/5 rounded-2xl py-5 pl-14 pr-4 text-text-primary placeholder:text-text-muted/30 focus:border-accent-primary/50 outline-none transition-all font-bold text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Senha</label>
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

            {isSignUp && (
              <div className="space-y-4 pt-2">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-1">Seu Perfil</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'student', label: 'Aluno' },
                    { id: 'instructor', label: 'Instrutor' },
                    { id: 'manager', label: 'Mestre' }
                  ].map((r) => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id as any)}
                      className={`py-4 rounded-xl border text-[10px] font-black uppercase tracking-tighter transition-all ${role === r.id ? 'border-accent-primary bg-accent-primary/10 text-accent-primary' : 'border-white/5 bg-surface-900 text-text-muted hover:border-white/10'}`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black text-center uppercase tracking-widest hatched">
                Ops! {error}
              </div>
            )}

            {success && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black text-center uppercase tracking-widest hatched">
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full !rounded-2xl py-5 shadow-2xl mt-4"
            >
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin text-surface-900" />
              ) : (
                <span className="uppercase tracking-[0.3em] text-[10px] font-black text-surface-900">
                  {isSignUp ? 'Criar Cadastro' : 'Entrar no Sistema'}
                </span>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center flex flex-col gap-4">
            <button 
              onClick={() => { setIsSignUp(!isSignUp); setError(null); setSuccess(null); }}
              className="group flex items-center justify-center gap-2 text-[10px] text-text-muted font-black uppercase tracking-widest hover:text-accent-primary transition-all"
            >
              <div className="w-8 h-[1px] bg-white/10 group-hover:w-12 group-hover:bg-accent-primary transition-all" />
              {isSignUp ? 'Já tem o manto? Entrar' : 'Novo Aluno? Criar Acesso'}
              <div className="w-8 h-[1px] bg-white/10 group-hover:w-12 group-hover:bg-accent-primary transition-all" />
            </button>
          </div>
        </div>

        <div className="text-center mt-12 opacity-30">
           <p className="text-[9px] text-text-muted font-black uppercase tracking-[0.5em]">
             GFTeam International • 2024
           </p>
        </div>
      </div>
    </div>
  )
}
