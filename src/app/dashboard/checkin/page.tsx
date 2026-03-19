'use client'

import { useApp } from '@/contexts/AppContext'
import TopBar from '@/components/TopBar'
import { CheckSquare, Users, Clock, Wifi, WifiOff, Zap, QrCode, Scan } from 'lucide-react'

const recentAccess = [
  { nome: 'Lucas Andrade', tipo: 'QR Code', hora: '07:32', ok: true },
  { nome: 'Fernanda Costa', tipo: 'Biometria', hora: '07:45', ok: true },
  { nome: 'Eduardo Faria', tipo: 'QR Code', hora: '07:52', ok: false, motivo: 'Inadimplente' },
  { nome: 'Amanda Silva', tipo: 'Biometria', hora: '08:01', ok: true },
  { nome: 'Carlos Barreto', tipo: 'QR Code', hora: '08:15', ok: true },
  { nome: 'Desconhecido', tipo: 'Facial', hora: '08:22', ok: false, motivo: 'Não cadastrado' },
]

const texts = {
  pt: { title: 'Check-in & Acesso', device: 'Catraca FacilGate', online: 'Online', offline: 'Offline', today: 'Check-ins Hoje', denied: 'Acessos Negados', method: 'Forma de Acesso', time: 'Hora', result: 'Resultado', allowed: 'Liberado', blocked: 'Bloqueado' },
  en: { title: 'Check-in & Access', device: 'FacilGate Turnstile', online: 'Online', offline: 'Offline', today: "Today's Check-ins", denied: 'Denied Access', method: 'Access Method', time: 'Time', result: 'Result', allowed: 'Allowed', blocked: 'Blocked' },
}

export default function CheckinPage() {
  const { lang } = useApp()
  const tx = texts[lang]

  return (
    <div className="min-h-screen bg-surface-900">
      <TopBar title={tx.title} />
      <div className="p-6 space-y-5">
        {/* Device status */}
        <div className="kpi-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-surface-600 flex items-center justify-center">
              <Zap className="w-5 h-5" style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <p className="font-semibold text-text-primary">{tx.device}</p>
              <p className="text-xs font-mono text-text-muted">IP: 192.168.1.105 · Porta 4370</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="pulse-dot" />
            <span className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>{tx.online}</span>
            <Wifi className="w-4 h-4" style={{ color: 'var(--accent)' }} />
          </div>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { l: tx.today, v: '47', icon: CheckSquare, c: true },
            { l: 'QR Code', v: '29', icon: QrCode, c: true },
            { l: 'Biometria', v: '15', icon: Scan, c: true },
            { l: tx.denied, v: '3', icon: WifiOff, c: false },
          ].map((k, i) => (
            <div key={i} className="kpi-card">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: `rgba(${k.c ? 'var(--accent-rgb)' : '239,68,68'}, 0.12)` }}>
                <k.icon className="w-4.5 h-4.5" style={{ color: k.c ? 'var(--accent)' : '#EF4444' }} />
              </div>
              <p className="text-2xl font-display font-bold text-text-primary">{k.v}</p>
              <p className="text-xs text-text-muted mt-1">{k.l}</p>
            </div>
          ))}
        </div>

        {/* Log table */}
        <div className="kpi-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-semibold text-text-primary">Log de Acessos</h2>
            <span className="flex items-center gap-1.5 text-[11px] font-mono text-text-muted">
              <div className="pulse-dot w-1.5 h-1.5" /> AO VIVO
            </span>
          </div>
          <div className="space-y-2">
            {recentAccess.map((a, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-600 transition-colors">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-bold ${a.ok ? 'text-surface-900' : 'bg-red-500/10 text-red-400'}`}
                  style={a.ok ? { backgroundColor: 'var(--accent)' } : {}}>
                  {a.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-text-primary">{a.nome}</p>
                  <p className="text-xs text-text-muted">{a.tipo}{a.motivo ? ` · ${a.motivo}` : ''}</p>
                </div>
                <span className="text-xs font-mono text-text-muted">{a.hora}</span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${a.ok ? 'badge-active' : 'badge-danger'}`}>
                  {a.ok ? tx.allowed : tx.blocked}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
