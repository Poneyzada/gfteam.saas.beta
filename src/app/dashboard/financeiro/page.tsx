'use client'

import { useApp } from '@/contexts/AppContext'
import { useState } from 'react'
import { 
  DollarSign, TrendingUp, CreditCard, Shield, 
  ArrowUpRight, ArrowDownRight, Zap, Target,
  RefreshCw, CheckCircle2, AlertCircle, Plus,
  QrCode, Smartphone, Wallet, Building2, ChevronRight,
  X, Check, Lock, Globe
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function UnifiedFinanceiroPage() {
  const { lang } = useApp()
  const [selectedGateway, setSelectedGateway] = useState<string | null>(null)
  const [isGatewayLoading, setIsGatewayLoading] = useState(false)
  const [gatewayStatus, setGatewayStatus] = useState<Record<string, 'inactive' | 'pending' | 'active'>>({
    infinitepay: 'inactive',
    mercadopago: 'inactive',
    pagseguro: 'inactive'
  })

  const handleConnectGateway = (id: string) => {
    setIsGatewayLoading(true)
    // Simulate connection flow
    setTimeout(() => {
      setGatewayStatus(prev => ({ ...prev, [id]: 'active' }))
      setIsGatewayLoading(false)
      setSelectedGateway(null)
      alert(`${id.toUpperCase()} conectado com sucesso! 💳`)
    }, 2000)
  }

  const gateways = [
    { 
      id: 'infinitepay', 
      name: 'InfinitePay', 
      desc: 'Melhores taxas para antecipação e Link de Pagamento.', 
      fee: '1.49%', 
      color: 'bg-accent-primary', 
      accent: 'text-black',
      icon: Zap
    },
    { 
      id: 'mercadopago', 
      name: 'Mercado Pago', 
      desc: 'Ecossistema completo com QR Code e Pix integrados.', 
      fee: '1.99%', 
      color: 'bg-blue-500', 
      accent: 'text-white',
      icon: Smartphone
    },
    { 
      id: 'pagseguro', 
      name: 'PagSeguro', 
      desc: 'Segurança UOL para cobranças recorrentes no cartão.', 
      fee: '2.15%', 
      color: 'bg-emerald-500', 
      accent: 'text-white',
      icon: Shield
    }
  ]

  return (
    <div className="min-h-screen bg-surface-900 pb-32 text-left relative z-10 pointer-events-auto selection:bg-accent-primary selection:text-black">
      
      {/* Gateway Connection Modal (Bug Fix: z-index / layout) */}
      <AnimatePresence>
        {selectedGateway && (
          <div className="fixed inset-0 z-[20000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-3xl overflow-y-auto">
             <motion.div 
               initial={{ opacity: 0, scale: 0.9, y: 30 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 0.9, y: 30 }}
               className="bg-surface-800 w-full max-w-lg rounded-[3.5rem] p-10 md:p-14 border border-white/10 shadow-2xl relative text-left my-auto pointer-events-auto"
               onClick={(e) => e.stopPropagation()}
             >
                <button onClick={() => setSelectedGateway(null)} className="absolute top-8 right-8 w-12 h-12 rounded-full bg-surface-900 border border-white/5 flex items-center justify-center text-text-muted hover:text-white shadow-xl active:scale-95 transition-all cursor-pointer"><X className="w-5 h-5" /></button>
                
                <div className="flex items-center gap-4 mb-10">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${gateways.find(g => g.id === selectedGateway)?.color}`}>
                      <Lock className="w-6 h-6 text-black" strokeWidth={3} />
                   </div>
                   <div>
                      <h2 className="text-2xl font-display font-black text-text-primary uppercase italic tracking-tighter leading-none">Conectar <br/><span className="text-accent-primary uppercase italic tracking-tight">{selectedGateway}</span></h2>
                   </div>
                </div>

                <div className="space-y-6">
                   <div className="p-6 rounded-2xl bg-surface-900 border border-white/5 shadow-inner">
                      <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 opacity-60 italic">Como funciona?</p>
                      <p className="text-xs font-bold text-text-primary leading-relaxed opacity-80">Você será redirecionado para autorizar o acesso da GFTeam à sua conta e configurar o recebimento automático das mensalidades.</p>
                   </div>
                   
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest pl-2 opacity-60">Seu Link de Callback (Opcional)</label>
                      <input type="text" className="w-full bg-surface-900 border border-white/10 rounded-2xl px-6 py-4 text-xs font-bold text-accent-primary outline-none focus:border-accent-primary shadow-inner" placeholder="webhook.gfteam.com/callback/..." />
                   </div>
                </div>

                <div className="flex gap-4 pt-12">
                   <button onClick={() => setSelectedGateway(null)} className="flex-1 py-6 bg-surface-700 text-text-primary rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-surface-600 transition-all active:scale-95 shadow-xl">VOLTAR</button>
                   <button 
                    disabled={isGatewayLoading}
                    onClick={() => handleConnectGateway(selectedGateway!)} 
                    className="flex-1 py-6 bg-accent-primary text-black rounded-2xl font-black uppercase text-[12px] tracking-[0.2em] shadow-2xl shadow-accent-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                   >
                     {isGatewayLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <span>ATIVAR PONTE</span>}
                   </button>
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="p-6 md:p-12 space-y-12 animate-fade-in text-left">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
          <div className="text-left">
            <h1 className="text-5xl md:text-7xl font-display font-black text-text-primary tracking-tighter italic uppercase leading-none mb-4">Recebimento <br /><span className="text-accent-primary italic tracking-tight">Elite</span></h1>
            <p className="text-[11px] text-text-muted font-black uppercase tracking-[0.4em] opacity-40">Controle financeiro e gateways oficiais GFTeam</p>
          </div>
          <div className="flex gap-4">
            <button className="px-8 py-5 bg-surface-800 text-text-primary rounded-[2rem] text-[11px] font-black uppercase tracking-widest border border-white/5 shadow-xl hover:border-accent-primary transition-all active:scale-95 hover:text-accent-primary flex items-center gap-4">
              <RefreshCw className="w-5 h-5 opacity-40" /> Sincronizar
            </button>
          </div>
        </div>

        {/* Finance KPI Strip */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="kpi-card !rounded-[3rem] bg-accent-primary text-black p-10 flex flex-col justify-between h-56 border-none shadow-2xl shadow-accent-primary/20 rotate-1">
              <div className="flex justify-between items-start">
                 <p className="text-[11px] font-black uppercase tracking-[0.3em] opacity-40">Saldo em Trânsito</p>
                 <ArrowUpRight className="w-7 h-7" />
              </div>
              <p className="text-5xl font-display font-black italic tracking-tighter uppercase leading-none">R$ 14.280</p>
           </div>
           
           <div className="kpi-card !rounded-[3rem] bg-surface-800 border border-white/5 p-10 flex flex-col justify-between h-56 shadow-2xl">
              <div className="flex justify-between items-start">
                 <p className="text-[11px] font-black text-text-muted uppercase tracking-[0.3em] opacity-40 text-left">Taxa de Conversão</p>
                 <TrendingUp className="w-7 h-7 text-emerald-400" />
              </div>
              <div className="text-left">
                 <p className="text-5xl font-display font-black text-text-primary italic tracking-tighter uppercase leading-none">94.2%</p>
                 <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest mt-2 block">+2.4% este mês</span>
              </div>
           </div>

           <div className="kpi-card !rounded-[3rem] bg-surface-800 border border-white/5 p-10 flex flex-col justify-between h-56 shadow-2xl -rotate-1">
              <div className="flex justify-between items-start">
                 <p className="text-[11px] font-black text-text-muted uppercase tracking-[0.3em] opacity-40 text-left">Gateway Ativo</p>
                 <Shield className="w-7 h-7 text-accent-primary" />
              </div>
              <div className="text-left">
                 <p className="text-2xl font-display font-black text-text-primary opacity-30 italic tracking-tighter uppercase leading-none">Aguardando <br/>Conexão</p>
              </div>
           </div>
        </div>

        {/* Gateways Selection (Elite Bridge) */}
        <div className="space-y-8">
           <div className="flex items-center gap-4 ml-6">
              <Globe className="w-5 h-5 text-accent-primary" />
              <h2 className="text-[12px] font-black text-text-muted uppercase tracking-[0.4em] italic opacity-40">Ponte Financeira • Escolha sua Operadora</h2>
           </div>
           
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {gateways.map((g) => (
                <div key={g.id} className="kpi-card !rounded-[3.5rem] bg-surface-800 border border-white/5 hover:border-accent-primary/40 transition-all p-10 flex flex-col shadow-2xl group">
                   <div className="flex items-center justify-between mb-8">
                      <div className={`w-16 h-16 rounded-[1.8rem] ${g.color} flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-3 transition-transform`}>
                         <g.icon className={`w-8 h-8 ${g.accent}`} />
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1 opacity-40 leading-none">Taxa Média</p>
                         <p className="text-2xl font-display font-black text-text-primary italic tracking-tighter leading-none">{g.fee}</p>
                      </div>
                   </div>
                   
                   <h3 className="text-2xl font-display font-black text-text-primary uppercase italic tracking-tighter mb-4 text-left leading-none">{g.name}</h3>
                   <p className="text-[10px] text-text-muted font-black uppercase tracking-widest opacity-40 text-left leading-relaxed mb-10 flex-1">{g.desc}</p>
                   
                   <button 
                    disabled={gatewayStatus[g.id] === 'active'}
                    onClick={() => setSelectedGateway(g.id)}
                    className={`w-full py-5 rounded-[1.8rem] text-[11px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl active:scale-95 ${
                      gatewayStatus[g.id] === 'active' 
                      ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500' 
                      : 'bg-surface-700 text-text-primary border border-white/5 hover:bg-accent-primary hover:text-black hover:border-accent-primary'
                    }`}
                   >
                      {gatewayStatus[g.id] === 'active' ? (
                        <>CONECTADO <Check className="w-4 h-4" /></>
                      ) : (
                        <>CONECTAR GATEWAY <ArrowRight className="w-4 h-4" /></>
                      )}
                   </button>
                </div>
              ))}
           </div>
        </div>

        {/* Action Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="flex flex-col gap-6">
              <div className="kpi-card !rounded-[3rem] p-10 bg-surface-800 border border-white/5 shadow-2xl flex items-center justify-between group cursor-pointer hover:border-accent-primary/30 transition-all">
                 <div className="flex items-center gap-8 text-left">
                    <div className="w-16 h-16 rounded-2xl bg-surface-700 flex items-center justify-center border border-white/5 shadow-inner">
                       <Plus className="w-7 h-7 text-accent-primary" />
                    </div>
                    <div>
                       <h4 className="text-xl font-display font-black text-text-primary uppercase italic tracking-tighter leading-none mb-2">Relançar <br/>Mensalidades</h4>
                       <p className="text-[10px] text-text-muted font-black uppercase tracking-widest opacity-40 italic">Gerar cobranças em lote</p>
                    </div>
                 </div>
                 <ChevronRight className="w-6 h-6 text-text-muted group-hover:translate-x-3 transition-transform" />
              </div>
           </div>
        </div>

      </div>
    </div>
  )
}

function ArrowRight(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}
