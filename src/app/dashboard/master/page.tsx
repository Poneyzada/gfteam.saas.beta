'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  CheckCircle2, XCircle, Clock, Globe, Users, BarChart3,
  RefreshCw, Zap, Shield, TrendingUp, DollarSign, ArrowRight
} from 'lucide-react'

type Tenant = {
  id: string
  name: string
  slug: string
  plan: string
  active: boolean
  created_at: string
  using_app: boolean 
  payment_status: 'paid' | 'pending' | 'overdue'
  whatsapp: string
}

// Mock data for UI preview while Supabase loads
const MOCK_TENANTS: Tenant[] = [
  { id: '1', name: 'GFTeam Matriz', slug: 'gfteam-matriz', plan: 'enterprise', active: true, created_at: '2024-01-01', using_app: true, payment_status: 'paid', whatsapp: '21999999999' },
  { id: '2', name: 'GFTeam Barra', slug: 'gfteam-barra', plan: 'pro', active: true, created_at: '2024-03-01', using_app: true, payment_status: 'paid', whatsapp: '21888888888' },
  { id: '3', name: 'GFTeam São Paulo', slug: 'gfteam-sp', plan: 'starter', active: true, created_at: '2024-02-01', using_app: false, payment_status: 'pending', whatsapp: '11777777777' },
  { id: '4', name: 'GFTeam Los Angeles', slug: 'gfteam-la', plan: 'starter', active: true, created_at: '2024-02-15', using_app: false, payment_status: 'pending', whatsapp: '13105550199' },
  { id: '5', name: 'GFTeam Portugal', slug: 'gfteam-pt', plan: 'starter', active: false, created_at: '2024-01-20', using_app: false, payment_status: 'overdue', whatsapp: '35199999999' },
]

export default function MasterAdoptionPage() {
  const [tenants, setTenants] = useState<Tenant[]>(MOCK_TENANTS)
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  const fetchAdoption = async () => {
    setLoading(true)
    try {
      const { data: tenantsData } = await supabase
        .from('tenants')
        .select('id, name, slug, plan, active, created_at')
        .order('created_at', { ascending: true })

      if (tenantsData && tenantsData.length > 0) {
        const enriched = await Promise.all(
          tenantsData.map(async (t) => {
            const { count } = await supabase
              .from('profiles')
              .select('id', { count: 'exact', head: true })
              .eq('tenant_id', t.id)

            return {
              ...t,
              using_app: (count ?? 0) > 0,
              payment_status: 'paid' as const, 
              whatsapp: '', 
            }
          })
        )
        setTenants(enriched)
        setLastUpdated(new Date())
      }
    } catch (e) {
      console.error('Failed to fetch adoption data:', e)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchAdoption()
  }, [])

  const using = tenants.filter(t => t.using_app).length
  const notUsing = tenants.filter(t => t.active && !t.using_app).length
  const inactive = tenants.filter(t => !t.active).length

  return (
    <div className="min-h-screen bg-surface-900 pb-12">
      {/* HEARTBEAT DIV FOR BETA TESTING */}
      <div className="bg-accent-primary text-surface-900 py-2 px-10 text-[10px] font-black uppercase tracking-[0.5em] text-center animate-pulse">
        • LIVE: MASTER DASHBOARD 2.0 • GFTEAM MATRIZ •
      </div>

      {/* Header */}
      <div className="px-10 py-12 flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="text-left">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-accent-primary flex items-center justify-center shadow-xl shadow-accent-primary/20">
              <Shield className="w-6 h-6 text-black" />
            </div>
            <div className="text-left">
               <span className="text-[10px] font-black text-accent-primary uppercase tracking-[0.3em] block">Rede Global • Acesso Master</span>
               <h1 className="text-4xl md:text-5xl font-display font-black text-text-primary tracking-tighter uppercase italic">Gestão Matriz</h1>
            </div>
          </div>
          <p className="text-text-muted mt-1 font-bold uppercase tracking-widest opacity-60 text-[10px] text-left">Controle de unidades, adoção de sistema e repasses</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={fetchAdoption}
            disabled={loading}
            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-surface-800 border border-white/5 text-[10px] font-black uppercase tracking-widest text-text-primary hover:border-accent-primary transition-all shadow-xl pointer-events-auto"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Sincronizar Rede
          </button>
        </div>
      </div>

      <div className="px-10 space-y-10">
        {/* KPI Summary (DRE/IDR Style) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { l: 'Unidades Ativas', v: using, i: Globe, c: 'text-accent-primary', bg: 'bg-accent-primary/10' },
            { l: 'Pendentes Sistema', v: notUsing, i: Zap, c: 'text-amber-400', bg: 'bg-amber-400/10' },
            { l: 'Repasses em Atraso', v: inactive, i: XCircle, c: 'text-red-500', bg: 'bg-red-500/10' },
            { l: 'Faturamento Estimado', v: 'R$ 42k', i: DollarSign, c: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          ].map((kpi, idx) => (
            <div key={idx} className="kpi-card !rounded-[2.5rem] p-8 bg-surface-800 border border-white/5 shadow-2xl relative overflow-hidden group hover:border-accent-primary transition-all cursor-pointer">
              <div className={`w-14 h-14 rounded-2xl ${kpi.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <kpi.i className={`w-7 h-7 ${kpi.c}`} />
              </div>
              <p className="text-[2.5rem] font-display font-black text-text-primary leading-none italic tracking-tighter text-left">{kpi.v}</p>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-2 opacity-60 text-left">{kpi.l}</p>
            </div>
          ))}
        </div>

        {/* Units List */}
        <div className="kpi-card !rounded-[3rem] p-10 relative overflow-hidden">
          <div className="card-accent" />
          <div className="flex items-center gap-3 mb-10">
            <Globe className="w-5 h-5 accent-text" />
            <h2 className="text-xl font-display font-bold text-text-primary">Monitoramento de Unidades</h2>
          </div>

          <div className="space-y-3">
            {tenants.map((tenant) => (
              <div
                key={tenant.id}
                className={`flex items-center justify-between p-6 rounded-[1.5rem] border transition-all hover:translate-x-1 cursor-pointer ${
                  tenant.using_app
                    ? 'bg-emerald-400/5 border-emerald-400/10'
                    : tenant.active
                    ? 'bg-yellow-400/5 border-yellow-400/10'
                    : 'bg-surface-700/50 border-surface-500/30 opacity-50'
                }`}
                onClick={() => alert(`Acessando DRE de ${tenant.name}...`)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xs font-black ${
                    tenant.using_app ? 'bg-emerald-400/20 text-emerald-400' : 'bg-surface-600 text-text-muted'
                  }`}>
                    GF
                  </div>
                  <div>
                    <p className="font-bold text-text-primary">{tenant.name}</p>
                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">
                      {tenant.plan} • /{tenant.slug}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    tenant.payment_status === 'paid' ? 'bg-emerald-400/10 text-emerald-400' :
                    tenant.payment_status === 'pending' ? 'bg-yellow-400/10 text-yellow-400' : 'bg-red-400/10 text-red-500'
                  }`}>
                    Repasse: {tenant.payment_status === 'paid' ? 'Pago' : tenant.payment_status === 'pending' ? 'Pendente' : 'Atrasado'}
                  </div>

                  <ArrowRight className="w-4 h-4 text-text-muted" />
                </div>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest text-center mt-8 opacity-50">
            Sincronizado com Supabase em {lastUpdated.toLocaleTimeString('pt-BR')}
          </p>
        </div>
      </div>
    </div>
  )
}
