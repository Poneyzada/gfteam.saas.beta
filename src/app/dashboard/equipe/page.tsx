'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Users, Shield, CheckCircle2, XCircle, 
  DollarSign, BookOpen, Settings, Zap, 
  Search, Filter, MoreHorizontal, Loader2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Profile {
  id: string
  full_name: string
  role: string
  status: string
  permissions: {
    finance: boolean
    students: boolean
    training: boolean
    plans: boolean
    admin: boolean
  }
}

export default function EquipePage() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchProfiles()
  }, [])

  async function fetchProfiles() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: profile } = await supabase.from('profiles').select('tenant_id').eq('id', user.id).single()
    
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('tenant_id', profile?.tenant_id)
      .neq('role', 'master') // Don't manage the master
      .order('full_name')

    if (data) setProfiles(data)
    setLoading(false)
  }

  async function togglePermission(profileId: string, permission: keyof Profile['permissions']) {
    setUpdatingId(profileId)
    const profile = profiles.find(p => p.id === profileId)
    if (!profile) return

    const newPermissions = { 
      ...profile.permissions, 
      [permission]: !profile.permissions[permission] 
    }

    const { error } = await supabase
      .from('profiles')
      .update({ permissions: newPermissions })
      .eq('id', profileId)

    if (!error) {
      setProfiles(profiles.map(p => p.id === profileId ? { ...p, permissions: newPermissions } : p))
    }
    setUpdatingId(null)
  }

  async function updateStatus(profileId: string, newStatus: 'active' | 'inactive') {
    setUpdatingId(profileId)
    const { error } = await supabase
      .from('profiles')
      .update({ status: newStatus })
      .eq('id', profileId)

    if (!error) {
      setProfiles(profiles.map(p => p.id === profileId ? { ...p, status: newStatus } : p))
    }
    setUpdatingId(null)
  }

  const filteredProfiles = profiles.filter(p => 
    p.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-10 space-y-8 animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-black text-text-primary tracking-tight italic uppercase">
            Controle de Equipe
          </h1>
          <p className="text-text-muted font-bold mt-1 uppercase tracking-tighter opacity-60">
            Gerencie acessos e permissões modulares da sua unidade
          </p>
        </div>
        
        <div className="flex items-center gap-4">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-accent-primary transition-colors" />
              <input 
                type="text"
                placeholder="Buscar membro..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-surface-800 border border-white/5 rounded-2xl py-3 pl-12 pr-6 text-sm font-bold text-text-primary outline-none focus:border-accent-primary/50 transition-all w-64"
              />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-accent-primary" />
          </div>
        ) : filteredProfiles.length === 0 ? (
          <div className="text-center py-20 bg-surface-800 rounded-[3rem] border border-dashed border-white/10">
            <Shield className="w-16 h-16 text-text-muted mx-auto mb-4 opacity-20" />
            <p className="text-text-muted font-black uppercase tracking-widest text-xs">Nenhum membro encontrado</p>
          </div>
        ) : (
          filteredProfiles.map((p) => (
            <motion.div 
              key={p.id}
              layout
              className={`kpi-card !rounded-[3rem] p-8 bg-surface-800 border border-white/5 relative overflow-hidden group ${p.status === 'pending' ? 'ring-2 ring-accent-primary ring-inset' : ''}`}
            >
              {p.status === 'pending' && (
                <div className="absolute top-0 right-0 px-6 py-2 bg-accent-primary text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-bl-3xl">
                  Aguardando Aprovação
                </div>
              )}

              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-2xl bg-surface-700 flex items-center justify-center text-xl font-display font-black text-text-primary shadow-xl border border-white/5 uppercase">
                    {p.full_name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-black text-text-primary uppercase italic tracking-tighter">{p.full_name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                       <span className="text-[10px] font-black text-accent-primary uppercase tracking-widest">{p.role}</span>
                       <span className="w-2 h-2 rounded-full bg-white/10" />
                       <span className={`text-[10px] font-black uppercase tracking-widest ${p.status === 'active' ? 'text-emerald-400' : 'text-red-400'}`}>
                         {p.status}
                       </span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  {/* Modular Permissions */}
                  <div className="flex items-center gap-2 p-2 bg-surface-900/50 rounded-3xl border border-white/5">
                    <PermissionToggle 
                      icon={DollarSign} 
                      label="Financeiro" 
                      active={p.permissions.finance} 
                      onClick={() => togglePermission(p.id, 'finance')}
                      loading={updatingId === p.id}
                    />
                    <PermissionToggle 
                      icon={Users} 
                      label="Alunos" 
                      active={p.permissions.students} 
                      onClick={() => togglePermission(p.id, 'students')}
                      loading={updatingId === p.id}
                    />
                    <PermissionToggle 
                      icon={BookOpen} 
                      label="Treinos" 
                      active={p.permissions.training} 
                      onClick={() => togglePermission(p.id, 'training')}
                      loading={updatingId === p.id}
                    />
                    <PermissionToggle 
                      icon={Settings} 
                      label="Planos" 
                      active={p.permissions.plans} 
                      onClick={() => togglePermission(p.id, 'plans')}
                      loading={updatingId === p.id}
                    />
                    <div className="w-px h-6 bg-white/10 mx-2" />
                    <PermissionToggle 
                      icon={Zap} 
                      label="Total" 
                      active={p.permissions.admin} 
                      onClick={() => togglePermission(p.id, 'admin')}
                      loading={updatingId === p.id}
                      variant="warning"
                    />
                  </div>

                  <div className="flex items-center gap-3 ml-4">
                    {p.status === 'pending' ? (
                      <button 
                        onClick={() => updateStatus(p.id, 'active')}
                        className="px-6 py-3 bg-emerald-500 text-black text-[10px] font-black uppercase tracking-widest rounded-2xl hover:scale-105 transition-all shadow-xl shadow-emerald-500/20"
                      >
                        Liberar Acesso
                      </button>
                    ) : (
                      <button 
                         onClick={() => updateStatus(p.id, p.status === 'active' ? 'inactive' : 'active')}
                         className={`w-12 h-12 flex items-center justify-center rounded-2xl transition-all border ${p.status === 'active' ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500 hover:text-black' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-black'}`}
                      >
                        {p.status === 'active' ? <XCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

function PermissionToggle({ icon: Icon, label, active, onClick, loading, variant = 'default' }: any) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`group flex items-center gap-3 px-4 py-3 rounded-2xl transition-all border ${
        active 
          ? variant === 'warning' ? 'bg-amber-500 text-black border-amber-600' : 'bg-accent-primary text-black border-accent-secondary' 
          : 'bg-surface-800 text-text-muted border-white/5 hover:border-white/20'
      }`}
    >
      <Icon className={`w-4 h-4 ${active ? 'animate-pulse' : 'opacity-40 group-hover:opacity-100'}`} />
      <span className="text-[10px] font-black uppercase tracking-widest md:block hidden">{label}</span>
    </button>
  )
}
