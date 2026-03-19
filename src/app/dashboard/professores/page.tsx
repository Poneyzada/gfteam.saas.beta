'use client'

import { useState } from 'react'
import { Users, Award, Shield, Mail, Phone, Calendar, Plus, Search, Filter, MoreHorizontal, CheckCircle2, Lock, X, MessageCircle } from 'lucide-react'

export default function ProfessorsPage() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [staff] = useState([
    { id: 1, name: 'Julio Cesar Pereira', role: 'Mestre Principal', perm: 'Acesso Total (Matriz)', belt: 'Coral', status: 'Ativo', classes: 12, since: '1990' },
    { id: 2, name: 'Marcos Freitas', role: 'Mestre', perm: 'Gestão de Filial', belt: 'Preta 4º Grau', status: 'Ativo', classes: 24, since: '2010' },
    { id: 3, name: 'Italo Melo', role: 'Instrutor', perm: 'Aulas & Alunos', belt: 'Preta 2º Grau', status: 'Ativo', classes: 20, since: '2015' },
    { id: 4, name: 'Ana Silva', role: 'Instrutora Kids', perm: 'Aulas & Alunos', belt: 'Marrom', status: 'Ativo', classes: 15, since: '2021' },
  ])

  return (
    <div className="p-10 space-y-10 animate-fade-up relative">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-black text-text-primary tracking-tight">Equipe & Professores</h1>
          <p className="text-text-muted font-semibold mt-1">Gerencie permissões, instrutores e mestres da sua unidade.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2 bg-accent-primary text-black border-none px-6 py-4 shadow-xl shadow-accent-primary/20"
          >
            <Plus className="w-5 h-5 text-black" />
            <span className="font-extrabold uppercase tracking-widest text-[#000] text-[10px]">Adicionar Membro</span>
          </button>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {staff.map(member => (
          <div key={member.id} className="kpi-card !rounded-[2.5rem] p-6 flex flex-col items-center text-center">
            <div className="relative group">
              <div className="w-24 h-24 rounded-3xl bg-surface-600 flex items-center justify-center border-2 border-white/5 overflow-hidden group-hover:border-accent-primary transition-all">
                <Users className="w-10 h-10 text-text-muted" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-accent-primary flex items-center justify-center shadow-lg">
                 <Shield className="w-4 h-4 text-black" />
              </div>
            </div>

            <div className="mt-6 space-y-1">
               <h3 className="text-lg font-bold text-text-primary">{member.name}</h3>
               <p className="text-[10px] font-black text-accent-primary uppercase tracking-widest">{member.role}</p>
               <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.2em] pt-1">{member.perm}</p>
            </div>

            <div className="mt-4 flex items-center gap-2">
               <span className="px-3 py-1 rounded-lg bg-surface-600 text-[10px] font-black text-text-muted uppercase border border-white/5">
                 {member.belt}
               </span>
               <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-[10px] font-black text-emerald-400 uppercase border border-emerald-500/20">
                 {member.status}
               </span>
            </div>

            <div className="grid grid-cols-2 gap-4 w-full mt-8 pt-6 border-t border-white/5">
               <div>
                  <p className="text-[10px] font-black text-text-muted uppercase">Aulas/Mês</p>
                  <p className="text-lg font-bold text-text-primary">{member.classes}</p>
               </div>
               <div>
                  <p className="text-[10px] font-black text-text-muted uppercase">Na Equipe</p>
                  <p className="text-lg font-bold text-text-primary">{member.since}</p>
               </div>
            </div>

            <div className="mt-8 flex gap-2 w-full">
               <button className="flex-1 py-3 rounded-2xl bg-surface-600 text-text-primary text-[10px] font-black uppercase tracking-widest hover:bg-accent-primary hover:text-black transition-all">
                 Ver Perfil
               </button>
               <button className="flex-1 py-3 rounded-2xl bg-surface-600 text-text-primary text-[10px] font-black uppercase tracking-widest hover:bg-surface-500 transition-all border border-white/5">
                 Permissões
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Professor Modal Mockup */}
      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
           <div className="bg-surface-800 border border-white/10 w-full max-w-2xl rounded-[3rem] p-10 relative z-10 animate-fade-up shadow-2xl">
              <button onClick={() => setShowAddModal(false)} className="absolute top-8 right-8 w-10 h-10 rounded-full bg-surface-700 flex items-center justify-center text-text-muted hover:text-white transition-all">
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 mb-8">
                 <div className="w-14 h-14 rounded-2xl bg-accent-primary/20 flex items-center justify-center border border-accent-primary/30">
                    <Shield className="w-7 h-7 text-accent-primary" />
                 </div>
                 <div>
                    <h2 className="text-2xl font-display font-black text-text-primary tracking-tighter uppercase italic">Novo Membro da Equipe</h2>
                    <p className="text-xs text-text-muted font-bold tracking-widest uppercase mt-1">Defina o Cargo e Permissões</p>
                 </div>
              </div>

              <div className="space-y-6">
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-2">Nome Completo</label>
                       <input type="text" placeholder="Nome do Professor" className="w-full bg-surface-900 border border-white/5 rounded-2xl py-4 px-5 text-sm text-text-primary outline-none focus:border-accent-primary/50 transition-all" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-2">E-mail de Acesso</label>
                       <input type="email" placeholder="email@gfteam.com" className="w-full bg-surface-900 border border-white/5 rounded-2xl py-4 px-5 text-sm text-text-primary outline-none focus:border-accent-primary/50 transition-all" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-2">WhatsApp</label>
                       <input type="tel" placeholder="(11) 99999-9999" className="w-full bg-surface-900 border border-white/5 rounded-2xl py-4 px-5 text-sm text-text-primary outline-none focus:border-accent-primary/50 transition-all font-mono" />
                    </div>
                 </div>

                 <div className="space-y-3 pt-4">
                    <label className="text-[10px] font-black text-text-muted uppercase tracking-widest ml-2">Nível de Permissão (Cargo)</label>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="p-5 rounded-2xl border-2 border-accent-primary bg-accent-primary/5 cursor-pointer relative overflow-hidden">
                          <CheckCircle2 className="absolute top-4 right-4 w-5 h-5 text-accent-primary" />
                          <Shield className="w-6 h-6 text-accent-primary mb-3" />
                          <h4 className="text-sm font-black text-text-primary uppercase tracking-widest">Mestre (Gestor)</h4>
                          <p className="text-[10px] text-text-muted mt-2 font-medium leading-relaxed">
                            Acesso total ao Dashboard: Financeiro, CRM, Loja, Relatórios e cadastro de novos professores.
                          </p>
                       </div>
                       <div className="p-5 rounded-2xl border-2 border-white/5 bg-surface-900 cursor-pointer hover:border-white/20 transition-all">
                          <Users className="w-6 h-6 text-text-secondary mb-3" />
                          <h4 className="text-sm font-black text-text-primary uppercase tracking-widest">Instrutor</h4>
                          <p className="text-[10px] text-text-muted mt-2 font-medium leading-relaxed">
                            Acesso restrito ao Tatame: Criação de treinos, lista de alunos, check-ins e graduações. Sem acesso financeiro.
                          </p>
                       </div>
                    </div>
                 </div>

                 <div className="pt-8 flex flex-col gap-3">
                    <button className="w-full btn-primary !bg-[#25D366] !rounded-2xl py-4 font-black text-white uppercase tracking-[0.2em] text-[10px] shadow-xl hover:shadow-[#25D366]/20 flex items-center justify-center gap-2 border-none">
                       <MessageCircle className="w-5 h-5" /> Enviar Convite por WhatsApp
                    </button>
                    <button className="w-full bg-surface-900 border border-white/10 hover:border-white/20 !rounded-2xl py-4 font-black text-text-muted hover:text-text-primary uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-2">
                       <Mail className="w-4 h-4" /> Enviar Link por E-mail (Alternativo)
                    </button>
                    <p className="text-center text-[9px] text-text-muted mt-3 font-bold uppercase tracking-widest">O professor receberá um link seguro para criar sua própria senha.</p>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  )
}
