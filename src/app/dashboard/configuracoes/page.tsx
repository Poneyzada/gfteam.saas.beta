'use client'

import { useState } from 'react'
import { 
  Settings, Shield, Globe, Bell, CreditCard, 
  User, Mail, Smartphone, Save, Image as ImageIcon, 
  Cloud, Webhook, Zap, ChevronRight, X, CheckCircle2,
  Plus, Check
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

type Section = 'unidade' | 'perfil' | 'notificacoes' | 'pagamentos' | 'integracoes'

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>('unidade')
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const sections = [
    { id: 'unidade', label: 'Matriz / Unidade', icon: Shield },
    { id: 'perfil', label: 'Meu Perfil', icon: User },
    { id: 'notificacoes', label: 'Notificações', icon: Bell },
    { id: 'pagamentos', label: 'Pagamentos', icon: CreditCard },
    { id: 'integracoes', label: 'Integrações', icon: Globe },
  ]

  return (
    <div className="p-4 md:p-10 space-y-8 md:space-y-12 animate-fade-in min-h-screen pb-32 text-left relative z-10 pointer-events-auto bg-surface-900 selection:bg-accent-primary selection:text-black">
      {/* Header */}
      <div className="text-left">
        <h1 className="text-3xl md:text-5xl font-display font-black text-text-primary tracking-tighter italic uppercase leading-none mb-2">Configurações <br /><span className="text-accent-primary">do Sistema</span></h1>
        <p className="text-[10px] md:text-xs text-text-muted font-black uppercase tracking-widest opacity-60">Matriz de controle e personalização de unidade</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10">
        
        {/* Navigation Sidebar */}
        <div className="xl:col-span-3 flex xl:flex-col gap-3 overflow-x-auto pb-4 xl:pb-0 scrollbar-hide relative z-20 pointer-events-auto">
          {sections.map((section) => (
            <button 
              key={section.id}
              onClick={(e) => {
                e.stopPropagation();
                setActiveSection(section.id as Section);
              }}
              className={`flex items-center gap-5 px-8 py-5 rounded-[2rem] cursor-pointer transition-all whitespace-nowrap border border-white/5 relative z-50 pointer-events-auto hover:bg-surface-800 group ${
                activeSection === section.id 
                  ? 'bg-accent-primary text-black dark:text-black shadow-2xl translate-x-2 font-black uppercase text-[10px] tracking-widest' 
                  : 'bg-surface-800/50 text-text-muted font-black uppercase text-[10px] tracking-widest outline-none border-none'
              }`}
            >
              <section.icon className={`w-5 h-5 ${activeSection === section.id ? 'text-black' : 'group-hover:text-text-primary transition-colors'}`} />
              <span className={activeSection === section.id ? 'text-black font-black' : ''}>{section.label}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="xl:col-span-9 relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
              className="pointer-events-auto"
            >
              {activeSection === 'unidade' && (
                <div className="kpi-card !rounded-[3rem] p-8 md:p-12 space-y-10 bg-surface-800 border border-white/5 shadow-2xl text-left relative overflow-hidden">
                  <div className="flex items-center justify-between">
                     <h2 className="text-2xl md:text-3xl font-display font-black text-text-primary uppercase italic tracking-tighter leading-none">A Identidade</h2>
                     <Shield className="w-8 h-8 text-accent-primary" />
                  </div>

                  <div className="space-y-6">
                     <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-2 opacity-60">LOGO OFICIAL (MOSTRAR NO MENU/BOLETOS)</label>
                     <div 
                        onClick={() => document.getElementById('logo-upload')?.click()}
                        className="flex flex-col md:flex-row items-center gap-10 p-10 rounded-[2.5rem] bg-surface-900 border-2 border-dashed border-white/5 hover:border-accent-primary transition-all cursor-pointer group pointer-events-auto shadow-inner"
                     >
                        <input 
                          id="logo-upload" 
                          type="file" 
                          hidden 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setLogoPreview(URL.createObjectURL(file));
                          }}
                        />
                        <div className="w-32 h-32 rounded-[2rem] bg-surface-800 border border-white/5 flex items-center justify-center relative overflow-hidden shadow-2xl group-hover:scale-105 transition-transform">
                           {logoPreview ? (
                             <img src={logoPreview} alt="Logo" className="w-full h-full object-contain p-4" />
                           ) : (
                             <ImageIcon className="w-10 h-10 text-text-muted opacity-20" />
                           )}
                        </div>
                        <div className="flex-1 text-center md:text-left">
                           <h4 className="text-lg font-black text-text-primary uppercase italic mb-1">Selecionar Nova Assinatura</h4>
                           <p className="text-[10px] text-text-muted font-black uppercase tracking-widest opacity-40 leading-relaxed max-w-sm">Esta imagem será sincronizada em todo o ecossistema da unidade, incluindo o app do aluno.</p>
                           <button className="mt-6 px-10 py-3 rounded-xl bg-surface-700 text-[10px] font-black uppercase text-text-primary opacity-100 group-hover:bg-accent-primary group-hover:text-black transition-all border-none cursor-pointer">Alterar Arquivo</button>
                        </div>
                     </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-2 opacity-60">NOME DA MATRIZ / UNIDADE</label>
                      <input type="text" defaultValue="GFTeam Frazo" className="w-full bg-surface-900 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-text-primary outline-none focus:border-accent-primary transition-all text-left shadow-inner" />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-2 opacity-60">E-MAIL DO ADMINISTRADOR</label>
                      <input type="email" defaultValue="contato@gfteam.com" className="w-full bg-surface-900 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-text-primary outline-none focus:border-accent-primary transition-all text-left shadow-inner" />
                    </div>
                  </div>

                  <button onClick={(e) => { e.preventDefault(); alert('Configuraes da Matriz salvas com sucesso! \uD83D\uDEE1\uFE0F'); }} className="px-12 py-5 bg-accent-primary text-black rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-accent-primary/20 hover:scale-[1.02] active:scale-95 transition-all pointer-events-auto relative z-50 border-none cursor-pointer">
                    SALVAR ALTERAÇÕES
                  </button>
                </div>
              )}

              {activeSection === 'pagamentos' && (
                <div className="kpi-card !rounded-[3rem] p-10 md:p-12 space-y-10 bg-surface-800 border border-white/5 shadow-2xl text-left relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl md:text-3xl font-display font-black text-text-primary uppercase italic tracking-tighter leading-none">Gateway Financeiro</h2>
                    <CreditCard className="w-8 h-8 text-accent-primary" />
                  </div>
                  <p className="text-[10px] text-text-muted font-black uppercase tracking-widest opacity-40 leading-relaxed max-w-lg">ATIVE OS GATEWAYS PARA RECEBER MENSALIDADES E VENDAS DIRETAMENTE NA CONTA DA ACADEMIA.</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Asaas */}
                    <div className="p-10 rounded-[3rem] bg-surface-900 border border-white/5 hover:border-blue-400 group cursor-pointer transition-all text-left relative overflow-hidden pointer-events-auto shadow-inner">
                       <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-400/5 blur-3xl" />
                       <div className="flex items-center justify-between mb-8 relative z-10">
                          <div className="px-4 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg text-[9px] font-black uppercase italic border border-blue-400/20">Homologado</div>
                          <div className="w-4 h-4 rounded-full bg-blue-400 animate-pulse shadow-[0_0_15px_rgba(96,165,250,0.5)]" />
                       </div>
                       <h3 className="text-3xl font-display font-black text-text-primary mb-2 italic">Asaas</h3>
                       <p className="text-[10px] text-text-muted font-black uppercase opacity-40 tracking-widest leading-tight mb-8">Ideal para Boletos e Recorrência sem consumir limite do aluno.</p>
                       <div className="space-y-4 relative z-10">
                          <input type="password" placeholder="API KEY (ASAAS)" className="w-full bg-surface-800 border border-white/5 rounded-2xl px-6 py-4 text-xs font-black text-text-primary focus:border-blue-400 transition-all outline-none" />
                          <button onClick={() => alert('Asaas Conectado! 🚀')} className="w-full py-5 bg-blue-500 text-black rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-all border-none cursor-pointer">CONECTAR CONTA</button>
                       </div>
                    </div>

                    {/* InfinitePay */}
                    <div className="p-10 rounded-[3rem] bg-surface-900 border border-white/5 hover:border-emerald-400 group cursor-pointer transition-all text-left relative overflow-hidden pointer-events-auto shadow-inner">
                       <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-400/5 blur-3xl" />
                       <div className="flex items-center justify-between mb-8 relative z-10">
                          <div className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-[9px] font-black uppercase italic border border-emerald-400/20">Taxa Baixa</div>
                          <div className="w-3 h-3 rounded-full bg-surface-700 border border-white/10" />
                       </div>
                       <h3 className="text-3xl font-display font-black text-text-primary mb-2 italic">InfinitePay</h3>
                       <p className="text-[10px] text-text-muted font-black uppercase opacity-40 tracking-widest leading-tight mb-8">Receba na hora via Link ou QR Code na Loja da Academia.</p>
                       <div className="space-y-4 relative z-10">
                          <input type="text" placeholder="USURIO INFINITEPAY (@academia)" className="w-full bg-surface-800 border border-white/5 rounded-2xl px-6 py-4 text-xs font-black text-text-primary focus:border-emerald-400 transition-all outline-none" />
                          <button onClick={() => alert('InfinitePay Ativada! 💳')} className="w-full py-5 bg-emerald-400 text-black rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-400/20 hover:scale-[1.02] transition-all border-none cursor-pointer">ATIVAR INFINITEPAY</button>
                       </div>
                    </div>

                    {/* Mercado Pago */}
                    <div className="p-10 rounded-[3rem] bg-surface-900 border border-white/5 hover:border-sky-400 group cursor-pointer transition-all text-left relative overflow-hidden pointer-events-auto shadow-inner">
                       <div className="absolute -top-10 -right-10 w-40 h-40 bg-sky-400/5 blur-3xl" />
                       <div className="flex items-center justify-between mb-8 relative z-10">
                          <div className="px-4 py-1.5 bg-sky-500/10 text-sky-400 rounded-lg text-[9px] font-black uppercase italic border border-sky-400/20">Popular</div>
                       </div>
                       <h3 className="text-3xl font-display font-black text-text-primary mb-2 italic">Mercado Pago</h3>
                       <p className="text-[10px] text-text-muted font-black uppercase opacity-40 tracking-widest leading-tight mb-8">O gateway mais conhecido do Brasil integrado ao seu QG.</p>
                       <div className="space-y-4 relative z-10">
                          <input type="password" placeholder="ACCESS TOKEN (MP)" className="w-full bg-surface-800 border border-white/5 rounded-2xl px-6 py-4 text-xs font-black text-text-primary focus:border-sky-400 transition-all outline-none" />
                          <button onClick={() => alert('Mercado Pago Conectado! 💙')} className="w-full py-5 bg-sky-400 text-black rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-sky-400/20 hover:scale-[1.02] transition-all border-none cursor-pointer">CONECTAR MP</button>
                       </div>
                    </div>

                    {/* PagSeguro */}
                    <div className="p-10 rounded-[3rem] bg-surface-900 border border-white/5 hover:border-amber-400 group cursor-pointer transition-all text-left relative overflow-hidden pointer-events-auto shadow-inner">
                       <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-400/5 blur-3xl" />
                       <div className="flex items-center justify-between mb-8 relative z-10">
                          <div className="px-4 py-1.5 bg-amber-500/10 text-amber-400 rounded-lg text-[9px] font-black uppercase italic border border-amber-400/20">Tradicional</div>
                       </div>
                       <h3 className="text-3xl font-display font-black text-text-primary mb-2 italic">PagSeguro</h3>
                       <p className="text-[10px] text-text-muted font-black uppercase opacity-40 tracking-widest leading-tight mb-8">Conecte sua conta PagBank para vendas presenciais e online.</p>
                       <div className="space-y-4 relative z-10">
                          <button onClick={() => alert('Redirecionando para Autorização PagSeguro... 🔐')} className="w-full py-5 bg-amber-400 text-black rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-amber-400/20 hover:scale-[1.02] transition-all border-none cursor-pointer">AUTORIZAR PAGBANK</button>
                       </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === 'perfil' && (
                <div className="kpi-card !rounded-[3rem] p-10 md:p-12 space-y-10 bg-surface-800 border border-white/5 shadow-2xl text-left relative overflow-hidden">
                   <h2 className="text-2xl md:text-3xl font-display font-black text-text-primary uppercase italic tracking-tighter leading-none">Perfil do Comandante</h2>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-2 opacity-60">NOME DO MESTRE/PROFESSOR</label>
                        <input type="text" className="w-full bg-surface-900 border border-white/10 rounded-2xl px-6 py-4 text-base font-bold text-text-primary text-left outline-none focus:border-accent-primary" defaultValue="Mestre Julio" />
                     </div>
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-2 opacity-60">TELEFONE DE COMANDO</label>
                        <input type="text" className="w-full bg-surface-900 border border-white/10 rounded-2xl px-6 py-4 text-base font-bold text-text-primary text-left outline-none focus:border-accent-primary" defaultValue="+55 21 99999-9999" />
                     </div>
                   </div>
                   <button onClick={(e) => { e.preventDefault(); alert('Perfil de Comando salvo! \uD83E\uDDBA'); }} className="px-12 py-5 bg-accent-primary text-black rounded-2xl font-black uppercase text-[11px] tracking-widest shadow-2xl shadow-accent-primary/20 hover:scale-[1.05] active:scale-95 transition-all flex items-center justify-center gap-4 pointer-events-auto relative z-50 border-none cursor-pointer">
                      <Save className="w-6 h-6 stroke-[3]" /> SALVAR PROFILE
                   </button>
                </div>
              )}

              {activeSection === 'notificacoes' && (
                <div className="kpi-card !rounded-[3rem] p-10 md:p-12 space-y-12 bg-surface-800 border border-white/5 shadow-2xl text-left relative overflow-hidden">
                  <h2 className="text-2xl md:text-3xl font-display font-black text-text-primary uppercase italic tracking-tighter leading-none">Alertas Inteligentes</h2>
                  <div className="space-y-8">
                    {[
                      { l: 'Alertas de Lista Negra', d: 'Notificar master quando houver atraso > 5 dias' },
                      { l: 'Novos Combates (Leads)', d: 'Enviar WhatsApp quando chegar novo lead' },
                      { l: 'Check-ins Presenciais', d: 'Resumo diário de alunos no tatame' },
                    ].map((notif, idx) => (
                      <div key={idx} className="flex items-center justify-between p-8 rounded-3xl bg-surface-900 border border-white/5 shadow-inner hover:bg-surface-800 transition-colors pointer-events-auto cursor-pointer group">
                        <div className="text-left flex-1">
                          <p className="text-base font-black text-text-primary uppercase tracking-tight leading-none mb-2 group-hover:text-accent-primary transition-colors">{notif.l}</p>
                          <p className="text-[10px] text-text-muted font-black uppercase opacity-40 tracking-widest">{notif.d}</p>
                        </div>
                        <div className="w-16 h-8 bg-accent-primary/10 rounded-full relative border border-accent-primary/30 group-hover:border-accent-primary transition-all">
                           <div className="absolute right-1 top-1 w-6 h-6 bg-accent-primary rounded-full shadow-[0_0_15px_rgba(255,199,0,0.4)]" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeSection === 'integracoes' && (
                <div className="kpi-card !rounded-[3rem] p-10 md:p-12 space-y-10 bg-surface-800 border border-white/5 shadow-2xl text-left relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl md:text-3xl font-display font-black text-text-primary uppercase italic tracking-tighter leading-none">Ecossistema</h2>
                    <Zap className="w-8 h-8 text-accent-primary" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                      { n: 'WhatsApp (n8n)', d: 'Automação de cobrança', i: Smartphone, c: 'text-emerald-400' },
                      { n: 'Instagram Meta', d: 'Leads e Posts no QG', i: Globe, c: 'text-pink-400' },
                      { n: 'E-mail Marketing', d: 'Retenção de alunos', i: Mail, c: 'text-blue-400' },
                    ].map((int, idx) => (
                      <div key={idx} className="p-8 rounded-[2.5rem] bg-surface-900 border border-white/5 hover:border-accent-primary transition-all group cursor-pointer text-left shadow-inner flex flex-col justify-between">
                         <div>
                            <div className="w-14 h-14 rounded-2xl bg-surface-800 flex items-center justify-center mb-8 group-hover:bg-accent-primary transition-all border border-white/5 shadow-xl">
                               <int.i className={`w-7 h-7 ${int.c} group-hover:text-black`} />
                            </div>
                            <h4 className="text-lg font-black text-text-primary uppercase mb-2 italic tracking-tighter">{int.n}</h4>
                            <p className="text-[10px] text-text-muted font-black uppercase opacity-40 leading-relaxed tracking-widest">{int.d}</p>
                         </div>
                         <div className="mt-10 flex items-center justify-between pt-6 border-t border-white/5">
                            <span className="text-[9px] font-black uppercase text-text-muted opacity-40">DESCONECTADO</span>
                            <ChevronRight className="w-5 h-5 text-text-muted group-hover:text-accent-primary transition-all" />
                         </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
