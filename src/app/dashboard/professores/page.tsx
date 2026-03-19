'use client'

import { useState } from 'react'
import { Users, Award, Shield, Mail, Phone, Calendar, Plus, Search, Filter, MoreHorizontal, UserCheck, Star } from 'lucide-react'

export default function ProfessorsPage() {
  const [staff] = useState([
    { id: 1, name: 'Julio Cesar Pereira', role: 'Mestre Principal', belt: 'Coral', status: 'Ativo', classes: 12, since: '1990' },
    { id: 2, name: 'Marcos Freitas', role: 'Professor Titular', belt: 'Preta 4º Grau', status: 'Ativo', classes: 24, since: '2010' },
    { id: 3, name: 'Italo Melo', role: 'Professor', belt: 'Preta 2º Grau', status: 'Ativo', classes: 20, since: '2015' },
    { id: 4, name: 'Ana Silva', role: 'Instrutora Kids', belt: 'Marrom', status: 'Ativo', classes: 15, since: '2021' },
  ])

  return (
    <div className="p-10 space-y-10 animate-fade-up">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-black text-text-primary tracking-tight">Equipe & Professores</h1>
          <p className="text-text-muted font-semibold mt-1">Gerencie o corpo técnico e instrutores da unidade</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-ghost flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtrar Equipe
          </button>
          <button className="btn-primary flex items-center gap-2 bg-accent-primary text-surface-900 border-none">
            <Plus className="w-4 h-4" />
            Adicionar Professor
          </button>
        </div>
      </div>

      {/* Team Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="kpi-card !rounded-[2.5rem] p-6">
          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Total Staff</p>
          <p className="text-3xl font-display font-black text-text-primary mt-1">08</p>
          <p className="text-[10px] text-text-muted mt-2 font-semibold italic">Professores e Auxiliares</p>
        </div>
        <div className="kpi-card !rounded-[2.5rem] p-6">
          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Grade Semanal</p>
          <p className="text-3xl font-display font-black text-text-primary mt-1">72h</p>
          <p className="text-[10px] text-emerald-400 mt-2 font-bold uppercase">100% Coberta</p>
        </div>
        <div className="kpi-card !rounded-[2.5rem] p-6">
          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Média Graduação</p>
          <p className="text-3xl font-display font-black text-text-primary mt-1">P. Preta</p>
          <p className="text-[10px] text-text-muted mt-2 font-semibold">Corpo técnico de elite</p>
        </div>
        <div className="kpi-card !rounded-[2.5rem] p-6 border-accent-primary/20 bg-accent-primary/5">
          <p className="text-[10px] font-black text-accent-primary uppercase tracking-widest">NPS das Aulas</p>
          <p className="text-3xl font-display font-black text-text-primary mt-1">4.9/5</p>
          <p className="text-[10px] text-text-muted mt-2 font-semibold">Avaliação dos alunos</p>
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
        {staff.map(member => (
          <div key={member.id} className="kpi-card !rounded-[2.5rem] p-6 flex flex-col items-center text-center animate-fade-up">
            <div className="relative group">
              <div className="w-24 h-24 rounded-3xl bg-surface-600 flex items-center justify-center border-2 border-white/5 overflow-hidden group-hover:border-accent-primary transition-all">
                <Users className="w-10 h-10 text-text-muted" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-accent-primary flex items-center justify-center shadow-lg">
                 <Shield className="w-4 h-4 text-surface-900" />
              </div>
            </div>

            <div className="mt-6 space-y-1">
               <h3 className="text-lg font-bold text-text-primary">{member.name}</h3>
               <p className="text-xs font-black text-accent-primary uppercase tracking-widest">{member.role}</p>
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
               <button className="flex-1 py-3 rounded-2xl bg-surface-600 text-text-primary text-[10px] font-black uppercase tracking-widest hover:bg-accent-primary hover:text-surface-900 transition-all">
                 Ver Perfil
               </button>
               <button className="w-12 h-12 rounded-2xl bg-surface-600 flex items-center justify-center text-text-muted hover:text-text-primary transition-all">
                 <MoreHorizontal className="w-5 h-5" />
               </button>
            </div>
          </div>
        ))}

        {/* Add New Card */}
        <button className="kpi-card !rounded-[2.5rem] p-6 border-dashed border-2 border-white/10 flex flex-col items-center justify-center text-text-muted hover:border-accent-primary/50 hover:text-text-primary transition-all group min-h-[400px]">
           <div className="w-16 h-16 rounded-full bg-surface-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Plus className="w-6 h-6" />
           </div>
           <p className="text-sm font-black uppercase tracking-widest">Novo Professor</p>
        </button>
      </div>
    </div>
  )
}
