'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  TrendingUp, Filter, UserPlus, MessageSquare, Phone,
  Calendar, ArrowRight, Zap, MapPin, Target, Clock, RefreshCw
} from 'lucide-react'

type Lead = {
  id: string
  name: string
  phone: string
  email?: string
  turma?: string
  source: string
  utm_campaign?: string
  status: 'novo' | 'contato' | 'agendado' | 'matriculado' | 'perdido'
  notes?: string
  created_at: string
}

const STATUS_CONFIG = {
  novo: { label: 'Novo Lead', color: 'blue', bg: 'bg-blue-400/10 border-blue-400/20' },
  contato: { label: 'Em Contato', color: 'yellow', bg: 'bg-yellow-400/10 border-yellow-400/20' },
  agendado: { label: 'Aula Agendada', color: 'accent', bg: 'bg-accent-primary/10 border-accent-primary/20' },
  matriculado: { label: 'Matriculado ✅', color: 'emerald', bg: 'bg-emerald-400/10 border-emerald-400/20' },
  perdido: { label: 'Perdido', color: 'red', bg: 'bg-red-400/10 border-red-400/20' },
}

const STAGES = ['novo', 'contato', 'agendado'] as const

// Mock leads for preview while Supabase loads
const MOCK_LEADS: Lead[] = [
  {
    id: '1', name: 'Ricardinho Almeida', phone: '(21) 98822-1100',
    email: 'ricardinho@gmail.com', turma: 'Adulto', source: 'landing_page',
    utm_campaign: 'Meta Ads - Março', status: 'novo', created_at: new Date().toISOString()
  },
  {
    id: '2', name: 'Carla Silva', phone: '(21) 97711-2233',
    turma: 'Feminino', source: 'indicacao', status: 'contato', created_at: new Date(Date.now() - 86400000).toISOString()
  },
  {
    id: '3', name: 'João Paulo', phone: '(21) 96600-4455',
    email: 'jp@email.com', turma: 'Kids', source: 'instagram',
    utm_campaign: 'Insta Orgânico', status: 'agendado', created_at: new Date(Date.now() - 172800000).toISOString()
  },
]

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}min atrás`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h atrás`
  return `${Math.floor(hours / 24)}d atrás`
}

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase()
}

function sourceLabel(source: string) {
  const map: Record<string, string> = {
    landing_page: '🌐 Landing Page',
    instagram: '📸 Instagram',
    indicacao: '🤝 Indicação',
    google: '🔍 Google',
    whatsapp: '💬 WhatsApp',
  }
  return map[source] || source
}

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS)
  const [loading, setLoading] = useState(false)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)

  const fetchLeads = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)
    if (data && data.length > 0) setLeads(data)
    setLoading(false)
  }

  useEffect(() => { fetchLeads() }, [])

  const advanceLead = async (lead: Lead) => {
    const order: Lead['status'][] = ['novo', 'contato', 'agendado', 'matriculado']
    const next = order[order.indexOf(lead.status) + 1]
    if (!next) return
    setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: next } : l))
    await supabase.from('leads').update({ status: next }).eq('id', lead.id)
  }

  const novos = leads.filter(l => l.status === 'novo').length
  const agendados = leads.filter(l => l.status === 'agendado').length
  const matriculados = leads.filter(l => l.status === 'matriculado').length

  return (
    <div className="p-6 space-y-8 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-black text-text-primary tracking-tight">CRM de Leads</h1>
          <p className="text-text-muted font-semibold mt-1">Converta interessados em alunos — veja de onde veio cada um</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={fetchLeads} className="btn-ghost flex items-center gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button className="btn-ghost flex items-center gap-2">
            <Filter className="w-4 h-4" /> Filtrar
          </button>
          <button className="btn-primary flex items-center gap-2 bg-accent-primary text-surface-900 border-none">
            <UserPlus className="w-4 h-4" /> Novo Lead
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="kpi-card !rounded-[2rem] p-6">
          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Total Leads</p>
          <p className="text-3xl font-display font-black text-text-primary mt-1">{leads.length}</p>
        </div>
        <div className="kpi-card !rounded-[2rem] p-6">
          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Novos Hoje</p>
          <p className="text-3xl font-display font-black text-text-primary mt-1">{novos}</p>
          <div className="flex items-center gap-1 mt-2 text-blue-400 text-[10px] font-bold">
            <Zap className="w-3 h-3" /> Aguardando contato
          </div>
        </div>
        <div className="kpi-card !rounded-[2rem] p-6">
          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Aulas Agendadas</p>
          <p className="text-3xl font-display font-black text-text-primary mt-1">{agendados}</p>
        </div>
        <div className="kpi-card !rounded-[2rem] p-6 border-accent-primary/20 bg-accent-primary/5">
          <p className="text-[10px] font-black text-accent-primary uppercase tracking-widest">Matriculados</p>
          <p className="text-3xl font-display font-black text-text-primary mt-1">{matriculados}</p>
          {leads.length > 0 && (
            <div className="flex items-center gap-1 mt-2 text-emerald-400 text-[10px] font-bold">
              <TrendingUp className="w-3 h-3" />
              {Math.round((matriculados / leads.length) * 100)}% conversão
            </div>
          )}
        </div>
      </div>

      {/* Kanban */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {STAGES.map((stage) => {
          const config = STATUS_CONFIG[stage]
          const stageLeads = leads.filter(l => l.status === stage)
          return (
            <div key={stage} className="flex flex-col gap-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    stage === 'novo' ? 'bg-blue-400' : stage === 'contato' ? 'bg-yellow-400' : 'bg-accent-primary'
                  }`} />
                  <h3 className="text-sm font-black text-text-primary uppercase tracking-widest">{config.label}</h3>
                </div>
                <span className="text-xs font-bold text-text-muted bg-surface-600 px-2 py-0.5 rounded-lg">{stageLeads.length}</span>
              </div>

              <div className="flex-1 bg-surface-600/20 rounded-[2rem] p-3 border border-white/5 space-y-3 min-h-[400px]">
                {stageLeads.map(lead => (
                  <div
                    key={lead.id}
                    onClick={() => setSelectedLead(lead)}
                    className={`bg-surface-700/80 p-5 rounded-[1.5rem] border transition-all cursor-pointer group shadow-sm hover:border-accent-primary/40 ${config.bg}`}
                  >
                    {/* Top: Avatar + Name + Source */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-surface-600 flex items-center justify-center font-bold text-xs text-text-primary border border-white/5 group-hover:bg-accent-primary group-hover:text-surface-900 transition-colors flex-shrink-0">
                          {getInitials(lead.name)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-text-primary leading-tight">{lead.name}</p>
                          <p className="text-[10px] text-text-muted font-medium mt-0.5">{sourceLabel(lead.source)}</p>
                        </div>
                      </div>
                      <span className="text-[9px] text-text-muted font-bold">{timeAgo(lead.created_at)}</span>
                    </div>

                    {/* Turma badge */}
                    {lead.turma && (
                      <div className="flex items-center gap-1.5 mb-3">
                        <Target className="w-3 h-3 accent-text" />
                        <span className="text-[10px] font-black accent-text uppercase tracking-widest">
                          Turma: {lead.turma}
                        </span>
                      </div>
                    )}

                    {/* Contact info */}
                    <div className="space-y-1.5 mb-3">
                      <div className="flex items-center gap-2 text-text-muted">
                        <Phone className="w-3 h-3" />
                        <a
                          href={`https://wa.me/55${lead.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          onClick={e => e.stopPropagation()}
                          className="text-[11px] font-bold hover:text-accent-primary transition-colors"
                        >
                          {lead.phone}
                        </a>
                      </div>
                      {lead.email && (
                        <div className="flex items-center gap-2 text-text-muted">
                          <MessageSquare className="w-3 h-3" />
                          <span className="text-[11px] font-semibold truncate">{lead.email}</span>
                        </div>
                      )}
                    </div>

                    {/* Campaign tag */}
                    {lead.utm_campaign && (
                      <div className="flex items-center gap-1.5 mb-3 p-2 rounded-xl bg-surface-600/50">
                        <MapPin className="w-3 h-3 text-text-muted" />
                        <span className="text-[10px] text-text-muted font-semibold truncate">{lead.utm_campaign}</span>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/5">
                      <div className="flex items-center gap-1 text-text-muted">
                        <Clock className="w-3 h-3" />
                        <span className="text-[10px] font-semibold">
                          {new Date(lead.created_at).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      {stage !== 'agendado' && (
                        <button
                          onClick={e => { e.stopPropagation(); advanceLead(lead) }}
                          className="text-[10px] font-black text-accent-primary uppercase tracking-widest flex items-center gap-1 hover:underline"
                        >
                          Avançar <ArrowRight className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                <button className="w-full py-4 border-2 border-dashed border-white/5 rounded-[1.5rem] text-text-muted text-[10px] font-black uppercase tracking-widest hover:border-accent-primary/50 hover:text-text-primary transition-all">
                  + Adicionar Lead
                </button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Lead Detail Panel */}
      {selectedLead && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4"
          onClick={() => setSelectedLead(null)}
        >
          <div
            className="bg-surface-800 border border-white/10 rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-accent-primary/10 flex items-center justify-center font-black text-lg accent-text">
                {getInitials(selectedLead.name)}
              </div>
              <div>
                <h3 className="text-xl font-display font-black text-text-primary">{selectedLead.name}</h3>
                <p className="text-xs text-text-muted font-bold">{sourceLabel(selectedLead.source)}</p>
              </div>
            </div>

            <div className="space-y-3">
              {[
                { icon: Phone, label: 'Telefone', value: selectedLead.phone },
                { icon: MessageSquare, label: 'Email', value: selectedLead.email || '—' },
                { icon: Target, label: 'Turma de Interesse', value: selectedLead.turma || '—' },
                { icon: MapPin, label: 'Campanha', value: selectedLead.utm_campaign || selectedLead.source },
                { icon: Calendar, label: 'Chegou em', value: new Date(selectedLead.created_at).toLocaleString('pt-BR') },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 p-3 rounded-xl bg-surface-700/50">
                  <Icon className="w-4 h-4 text-text-muted flex-shrink-0" />
                  <div>
                    <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">{label}</p>
                    <p className="text-sm font-bold text-text-primary">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 mt-6">
              <a
                href={`https://wa.me/55${selectedLead.phone.replace(/\D/g, '')}`}
                target="_blank"
                className="flex-1 btn-primary flex items-center justify-center gap-2 !rounded-2xl"
              >
                <Phone className="w-4 h-4" /> WhatsApp
              </a>
              <button
                onClick={() => setSelectedLead(null)}
                className="btn-ghost !rounded-2xl px-5"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
