'use client'

import { useState } from 'react'
import { Users, Award, Shield, Mail, Phone, Calendar, Plus, Search, Filter, MoreHorizontal, CheckCircle2, Lock, X, MessageCircle } from 'lucide-react'

export default function ProfessorsPage() {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showPermModal, setShowPermModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState<any>(null)
  const [selectedForPerm, setSelectedForPerm] = useState<any>(null)
  const [staff] = useState([
    { id: 1, name: 'Julio Cesar Pereira', role: 'Mestre Principal', perm: 'Acesso Total (Matriz)', belt: 'Coral', status: 'Ativo', classes: 12, since: '1990', email: 'julio.cesar@gfteam.com', phone: '+55 21 99999-0001', bio: 'Fundador da GFTeam. Faixa Coral 7º Grau.' },
    { id: 2, name: 'Carlos Souza', role: 'Mestre', perm: 'Gestão de Filial', belt: 'Preta 4º Grau', status: 'Ativo', classes: 24, since: '2010', email: 'carlos@gfteam.com', phone: '+55 21 98888-0002', bio: 'Especialista em passagens de guarda e gestão de equipes.' },
    { id: 3, name: 'Italo Melo', role: 'Instrutor', perm: 'Aulas & Alunos', belt: 'Preta 2º Grau', status: 'Ativo', classes: 20, since: '2015', email: 'italo.melo@gfteam.com', phone: '+55 21 97777-0003', bio: 'Instrutor focado em competições e técnica refinada.' },
    { id: 4, name: 'Ana Silva', role: 'Instrutora Kids', perm: 'Aulas & Alunos', belt: 'Marrom', status: 'Ativo', classes: 15, since: '2021', email: 'ana.silva@gfteam.com', phone: '+55 21 96666-0004', bio: 'Coordenação do programa Kids e iniciação esportiva.' },
  ])

  return (
    <div className="p-10 space-y-10 animate-fade-up relative transition-colors duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-display font-black text-text-primary tracking-tight italic uppercase">Equipe & Professores</h1>
          <p className="text-text-muted font-bold mt-1 uppercase tracking-widest text-[10px]">Gerencie permissões, instrutores e mestres da sua unidade.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-5 h-5 text-black" />
            <span className="font-extrabold uppercase tracking-widest text-black text-[10px]">Adicionar Membro</span>
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
               <button 
                onClick={() => setSelectedMember(member)}
                className="flex-1 py-3 rounded-2xl bg-surface-600 text-text-primary text-[10px] font-black uppercase tracking-widest hover:bg-accent-primary hover:text-black transition-all"
               >
                 Ver Perfil
               </button>
               <button 
                onClick={() => {
                   setSelectedForPerm(member);
                   setShowPermModal(true);
                }}
                className="flex-1 py-3 rounded-2xl bg-surface-600 text-text-primary text-[10px] font-black uppercase tracking-widest hover:bg-surface-500 transition-all border border-white/5"
               >
                 Permissões
               </button>
            </div>
          </div>
        ))}
      </div>

      {/* Profile Details Modal */}
      {selectedMember && (
         <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedMember(null)} />
            <div className="bg-surface-800 border border-white/10 w-full max-w-xl rounded-[3rem] p-10 relative z-10 animate-fade-up shadow-2xl overflow-hidden">
               <div className="card-accent opacity-20" />
               <button onClick={() => setSelectedMember(null)} className="absolute top-8 right-8 w-10 h-10 rounded-full bg-surface-700 flex items-center justify-center text-text-muted hover:text-white transition-all">
                 <X className="w-5 h-5" />
               </button>

               <div className="flex flex-col items-center text-center">
                  <div className="w-28 h-28 rounded-[2rem] bg-surface-700 flex items-center justify-center border-2 border-accent-primary overflow-hidden mb-6 shadow-xl">
                     <Users className="w-12 h-12 text-accent-primary" />
                  </div>
                  <h2 className="text-3xl font-display font-black text-text-primary tracking-tighter uppercase italic">{selectedMember.name}</h2>
                  <p className="text-sm font-black text-accent-primary uppercase tracking-[0.2em] mt-1">{selectedMember.role}</p>
                  
                  <div className="grid grid-cols-2 gap-4 w-full mt-10">
                     <div className="bg-surface-900 p-4 rounded-2xl border border-white/5">
                        <p className="text-[10px] font-black text-text-muted uppercase mb-1">E-mail</p>
                        <p className="text-xs font-bold text-text-primary">{selectedMember.email}</p>
                     </div>
                     <div className="bg-surface-900 p-4 rounded-2xl border border-white/5">
                        <p className="text-[10px] font-black text-text-muted uppercase mb-1">WhatsApp</p>
                        <p className="text-xs font-bold text-text-primary">{selectedMember.phone}</p>
                     </div>
                  </div>

                  <div className="w-full mt-4 bg-surface-900 p-6 rounded-2xl border border-white/5 text-left">
                     <p className="text-[10px] font-black text-text-muted uppercase mb-3">Bio / Especialidade</p>
                     <p className="text-xs text-text-dim leading-relaxed italic">{selectedMember.bio}</p>
                  </div>

                  <button 
                     onClick={() => window.open(`https://wa.me/${selectedMember.phone.replace(/\D/g,'')}`)}
                     className="w-full mt-8 btn-primary !bg-[#25D366] !text-white"
                  >
                     <MessageCircle className="w-5 h-5" /> Conversar no WhatsApp
                  </button>
               </div>
            </div>
         </div>
      )}

      {/* Permissions Modal */}
      {showPermModal && selectedForPerm && (
         <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowPermModal(false)} />
            <div className="bg-surface-800 border border-white/10 w-full max-w-lg rounded-[3rem] p-10 relative z-10 animate-fade-up shadow-2xl">
               <button onClick={() => setShowPermModal(false)} className="absolute top-8 right-8 w-10 h-10 rounded-full bg-surface-700 flex items-center justify-center text-text-muted hover:text-white transition-all">
                 <X className="w-5 h-5" />
               </button>

               <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-accent-primary/20 flex items-center justify-center border border-accent-primary/30">
                     <Lock className="w-7 h-7 text-accent-primary" />
                  </div>
                  <div>
                     <h2 className="text-2xl font-display font-black text-text-primary tracking-tighter uppercase italic">Permissões</h2>
                     <p className="text-xs text-text-muted font-bold tracking-widest uppercase mt-1">{selectedForPerm.name}</p>
                  </div>
               </div>

               <div className="space-y-4">
                  {[
                    { id: 'finance', label: 'Acesso Financeiro', desc: 'Ver DRE, faturas e relatórios.' },
                    { id: 'students', label: 'Gestão de Alunos', desc: 'Matricular, editar e ver dados.' },
                    { id: 'crm', label: 'CRM / Vendas', desc: 'Gerenciar leads e experimentais.' },
                    { id: 'training', label: 'Treinos & Graduações', desc: 'Criar aulas e dar graus.' },
                  ].map((perm) => (
                    <div key={perm.id} className="p-4 rounded-2xl bg-surface-900 border border-white/5 flex items-start gap-4 hover:border-accent-primary/40 transition-all cursor-pointer group">
                       <input type="checkbox" className="mt-1.5 w-5 h-5 rounded-md accent-accent-primary" defaultChecked={selectedForPerm.role === 'Mestre Principal'} />
                       <div>
                          <p className="text-sm font-black text-text-primary uppercase tracking-tight">{perm.label}</p>
                          <p className="text-[10px] text-text-muted font-medium">{perm.desc}</p>
                       </div>
                    </div>
                  ))}
               </div>

               <button 
                onClick={() => {
                   alert('Permissões atualizadas com sucesso!');
                   setShowPermModal(false);
                }}
                className="w-full mt-8 btn-primary"
               >
                 Salvar Alterações
               </button>
            </div>
         </div>
      )}

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
