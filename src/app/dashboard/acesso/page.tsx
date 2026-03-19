'use client'

import { useState, useEffect } from 'react'
import { Shield, Smartphone, Cable, Zap, Search, Activity, Lock, Unlock, RefreshCw, Settings, MoreVertical } from 'lucide-react'

export default function AccessControlPage() {
  const [devices, setDevices] = useState([
    { id: 1, name: 'Catraca Principal', status: 'Online', ip: '192.168.1.102', lastSync: '1 min atrás', location: 'Entrada B1' },
    { id: 2, name: 'Facial Gate 01', status: 'Online', ip: '192.168.1.105', lastSync: 'Agora', location: 'Entrada B2' },
    { id: 3, name: 'Botão Virtual', status: 'Standby', ip: '---', lastSync: '---', location: 'Recepção' },
  ])

  return (
    <div className="p-10 space-y-10 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-black text-text-primary tracking-tight">Controle de Acesso</h1>
          <p className="text-text-muted font-semibold mt-1">Gerenciamento de hardware e liberação remota</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-ghost flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Sincronizar Todos
          </button>
          <button className="btn-primary flex items-center gap-2 bg-accent-primary text-surface-900 border-none">
            <Zap className="w-4 h-4" />
            Liberação Master
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="kpi-card !rounded-[3rem] p-8">
          <div className="w-12 h-12 rounded-2xl bg-accent-primary/10 flex items-center justify-center mb-6">
            <Activity className="w-6 h-6 text-accent-primary" />
          </div>
          <p className="text-4xl font-display font-black text-text-primary">100%</p>
          <p className="text-xs font-black text-text-muted uppercase tracking-[0.2em] mt-2">Uptime Dispositivos</p>
        </div>
        <div className="kpi-card !rounded-[3rem] p-8">
          <div className="w-12 h-12 rounded-2xl bg-accent-primary/10 flex items-center justify-center mb-6">
            <Smartphone className="w-6 h-6 text-accent-primary" />
          </div>
          <p className="text-4xl font-display font-black text-text-primary">02</p>
          <p className="text-xs font-black text-text-muted uppercase tracking-[0.2em] mt-2">Terminais Faciais</p>
        </div>
        <div className="kpi-card !rounded-[3rem] p-8 border-accent-primary/20">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-6">
            <Cable className="w-6 h-6 text-emerald-400" />
          </div>
          <p className="text-4xl font-display font-black text-text-primary">ESTÁVEL</p>
          <p className="text-xs font-black text-text-muted uppercase tracking-[0.2em] mt-2">Conexão Rede Local</p>
        </div>
      </div>

      {/* Device List */}
      <div className="kpi-card !rounded-[3.5rem] p-4">
        <div className="p-8 flex items-center justify-between border-b border-white/5 mb-4">
          <h2 className="text-2xl font-display font-black text-text-primary">Hardware & Dispositivos</h2>
          <div className="flex items-center gap-4 bg-surface-600 rounded-2xl px-4 py-2 border border-white/5">
            <Search className="w-4 h-4 text-text-muted" />
            <input type="text" placeholder="Filtrar dispositivo..." className="bg-transparent outline-none text-sm text-text-primary font-medium" />
          </div>
        </div>
        <div className="overflow-x-auto p-4">
          <table className="w-full">
            <thead>
              <tr className="text-left text-[10px] font-black text-text-muted uppercase tracking-[0.2em] border-b border-white/5">
                <th className="pb-6 px-4">Dispositivo</th>
                <th className="pb-6 px-4">Localização</th>
                <th className="pb-6 px-4">Endereço IP</th>
                <th className="pb-6 px-4">Status</th>
                <th className="pb-6 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {devices.map(dev => (
                <tr key={dev.id} className="group hover:bg-surface-600/30 transition-all">
                  <td className="py-6 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-surface-600 flex items-center justify-center">
                        <Smartphone className="w-4 h-4 text-text-primary" />
                      </div>
                      <p className="text-sm font-bold text-text-primary">{dev.name}</p>
                    </div>
                  </td>
                  <td className="py-6 px-4 text-sm font-semibold text-text-secondary">{dev.location}</td>
                  <td className="py-6 px-4">
                    <span className="font-mono text-xs font-bold text-text-muted">{dev.ip}</span>
                  </td>
                  <td className="py-6 px-4">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest inline-flex">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Online
                    </div>
                  </td>
                  <td className="py-6 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center text-accent-primary hover:bg-accent-primary hover:text-surface-900 transition-all" title="Abrir Remoto">
                        <Unlock className="w-4 h-4" />
                      </button>
                      <button className="w-10 h-10 rounded-xl bg-surface-600 flex items-center justify-center text-text-muted hover:text-text-primary transition-all">
                        <Settings className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
