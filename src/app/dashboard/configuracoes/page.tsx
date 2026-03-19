'use client'

import { Settings, Shield, Globe, Bell, CreditCard, User, Mail, Smartphone, Save } from 'lucide-react'

export default function SettingsPage() {
  return (
    <div className="p-10 space-y-12 animate-fade-up">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-display font-black text-text-primary tracking-tight">Configurações</h1>
        <p className="text-text-muted font-semibold mt-1">Gerencie as preferências da unidade e do seu perfil</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        {/* Nav Tabs */}
        <div className="xl:col-span-3 space-y-2">
          {[
            { label: 'Unidade', icon: Shield, active: true },
            { label: 'Perfil', icon: User },
            { label: 'Notificações', icon: Bell },
            { label: 'Pagamentos', icon: CreditCard },
            { label: 'Integrações', icon: Globe },
          ].map((item, i) => (
            <div key={i} className={`flex items-center gap-3 px-6 py-4 rounded-[1.5rem] cursor-pointer transition-all ${
              item.active ? 'accent-bg text-surface-900 font-bold shadow-lg accent-shadow' : 'text-text-muted hover:bg-surface-600 font-semibold'
            }`}>
              <item.icon className="w-5 h-5" />
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Content */}
        <div className="xl:col-span-9 space-y-8">
          <div className="kpi-card !rounded-[3.5rem] p-10 space-y-10">
            <h2 className="text-2xl font-display font-black text-text-primary">Informações da Unidade</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-1">Nome da Academia</label>
                <input type="text" defaultValue="GFTeam Matriz" className="w-full bg-surface-600 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-text-primary outline-none focus:border-accent-primary transition-all" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-1">CNPJ / Identificação</label>
                <input type="text" defaultValue="12.345.678/0001-90" className="w-full bg-surface-600 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-text-primary outline-none focus:border-accent-primary transition-all" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-1">E-mail Administrativo</label>
                <input type="email" defaultValue="contato@gfteam.com" className="w-full bg-surface-600 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-text-primary outline-none focus:border-accent-primary transition-all" />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-1">Telefone / WhatsApp</label>
                <input type="text" defaultValue="+55 21 99999-9999" className="w-full bg-surface-600 border border-white/5 rounded-2xl px-6 py-4 text-sm font-bold text-text-primary outline-none focus:border-accent-primary transition-all" />
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex gap-4">
               <button className="btn-primary flex items-center gap-2">
                 <Save className="w-4 h-4" />
                 Salvar Alterações
               </button>
               <button className="btn-ghost">Cancelar</button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="kpi-card !rounded-[3.5rem] p-10 border-red-500/20 bg-red-500/5">
            <h2 className="text-xl font-display font-black text-red-400">Zona de Risco</h2>
            <p className="text-sm text-red-400/60 font-medium mt-2">Ações permanentes que não podem ser desfeitas.</p>
            <button className="mt-6 px-6 py-3 rounded-2xl bg-red-500/10 text-red-500 text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
              Suspender Operação Local
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
