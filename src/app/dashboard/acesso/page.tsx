'use client'

import { useState } from 'react'
import { 
  QrCode, Link as LinkIcon, Share2, WhatsappIcon, 
  Copy, CheckCircle2, Download, Smartphone, 
  UserPlus, ExternalLink, ShieldCheck 
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function OnboardingPage() {
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'link' | 'qr'>('link')

  const registrationLink = "https://gfteam-saas.vercel.app/login?signup=true"

  const handleCopy = () => {
    navigator.clipboard.writeText(registrationLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-accent-primary flex items-center justify-center hatched shadow-lg shadow-accent-primary/20">
              <QrCode className="w-6 h-6 text-surface-900" />
            </div>
            <h1 className="text-4xl font-display font-black text-text-primary tracking-tighter uppercase italic">
              Kit de <span className="text-accent-primary">Acesso</span>
            </h1>
          </div>
          <p className="text-text-muted font-bold max-w-xl leading-relaxed">
            Gerencie como seus novos alunos entram no ecossistema GFTeam. 
            Envie o link via WhatsApp ou imprima o QR Code para o balcão da academia.
          </p>
        </div>
        
        <div className="flex items-center gap-2 p-1 bg-surface-800 rounded-2xl border border-white/5">
          <button 
            onClick={() => setActiveTab('link')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'link' ? 'bg-accent-primary text-surface-900 shadow-lg shadow-accent-primary/10' : 'text-text-muted hover:text-text-primary'}`}
          >
            Link Digital
          </button>
          <button 
            onClick={() => setActiveTab('qr')}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'qr' ? 'bg-accent-primary text-surface-900 shadow-lg shadow-accent-primary/10' : 'text-text-muted hover:text-text-primary'}`}
          >
            QR Code Físico
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Interactive Tools */}
        <div className="space-y-6">
          {activeTab === 'link' ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="kpi-card !bg-surface-800/40 backdrop-blur-xl border-white/5 p-10 h-full flex flex-col justify-between"
            >
              <div className="card-accent" />
              <div>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-14 h-14 rounded-2xl bg-surface-900 border border-white/10 flex items-center justify-center">
                    <Smartphone className="w-6 h-6 text-accent-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-text-primary">Convite Digital</h3>
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Link de Auto-Cadastro</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Copie este link para enviar aos novos alunos via WhatsApp, Instagram ou E-mail. 
                    Ao clicar, eles serão levados diretamente para a tela de criação de conta da sua academia.
                  </p>
                  
                  <div className="relative group">
                    <input 
                      readOnly
                      value={registrationLink}
                      className="w-full bg-surface-900/80 border border-white/10 rounded-2xl py-5 pl-6 pr-16 text-text-secondary font-mono text-xs focus:border-accent-primary/50 outline-none transition-all"
                    />
                    <button 
                      onClick={handleCopy}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-xl bg-accent-primary flex items-center justify-center shadow-lg shadow-accent-primary/20 hover:scale-110 active:scale-95 transition-all text-surface-900"
                    >
                      {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-12 flex gap-4">
                <button className="flex-1 btn-primary !rounded-2xl py-4 flex items-center justify-center gap-3">
                  <Share2 className="w-4 h-4 text-surface-900" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Enviar via WhatsApp</span>
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="kpi-card !bg-white p-10 h-full flex flex-col items-center justify-center text-surface-900"
            >
              <div className="w-full h-full flex flex-col items-center justify-center gap-8 text-center pt-8">
                {/* Mock QR Code */}
                <div className="p-4 bg-white border-[10px] border-surface-900 rounded-3xl shadow-2xl">
                   <div className="w-48 h-48 bg-surface-900 flex items-center justify-center rounded-xl relative overflow-hidden">
                      {/* Stylized QR pattern */}
                      <div className="absolute inset-0 opacity-20 hatched" />
                      <QrCode className="w-24 h-24 text-white relative z-10" />
                   </div>
                </div>
                
                <div>
                   <h3 className="text-2xl font-display font-black uppercase tracking-tighter italic">Kit de Balcão</h3>
                   <p className="text-[10px] font-black text-surface-900/60 uppercase tracking-widest mt-2 px-8">Escaneie para entrar no manto da GFTeam</p>
                </div>

                <div className="flex gap-3 w-full max-w-[300px]">
                   <button className="flex-1 py-4 bg-surface-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-surface-800 transition-all">
                      <Download className="w-4 h-4" />
                      Imprimir Versão A4
                   </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right: Steps & Info */}
        <div className="space-y-6">
          <div className="bg-surface-800/20 border border-white/5 rounded-[2.5rem] p-10 space-y-8">
            <h4 className="text-[10px] font-black text-accent-primary uppercase tracking-[0.3em]">Fluxo de Jornada</h4>
            
            <div className="space-y-8 relative">
              <div className="absolute left-[19px] top-6 bottom-6 w-[2px] bg-white/5" />
              
              <div className="flex gap-6 relative">
                 <div className="w-10 h-10 rounded-full bg-surface-900 border border-white/10 flex items-center justify-center text-accent-primary font-black italic z-10">01</div>
                 <div className="flex-1 pt-2">
                    <p className="text-[10px] font-black text-text-primary uppercase tracking-widest">Lead Capture</p>
                    <p className="text-xs text-text-muted mt-2 leading-relaxed">
                      O potencial aluno chega pela Landing Page (LP) ou redes sociais.
                    </p>
                 </div>
              </div>

              <div className="flex gap-6 relative">
                 <div className="w-10 h-10 rounded-full bg-surface-900 border border-white/10 flex items-center justify-center text-accent-primary font-black italic z-10">02</div>
                 <div className="flex-1 pt-2">
                    <p className="text-[10px] font-black text-text-primary uppercase tracking-widest">Onboarding Link</p>
                    <p className="text-xs text-text-muted mt-2 leading-relaxed">
                      Você fornece o link de cadastro que já o vincula à sua unidade.
                    </p>
                 </div>
              </div>

              <div className="flex gap-6 relative">
                 <div className="w-10 h-10 rounded-full bg-accent-primary flex items-center justify-center text-surface-900 font-black italic z-10 hatched">03</div>
                 <div className="flex-1 pt-2">
                    <p className="text-[10px] font-black text-text-primary uppercase tracking-widest">Acesso ao App</p>
                    <p className="text-xs text-text-muted mt-2 leading-relaxed">
                      O aluno entra no sistema, preenche foto, dados e gera sua Carteirinha Digital.
                    </p>
                 </div>
              </div>
            </div>
          </div>

          <div className="kpi-card !bg-accent-primary/5 border-accent-primary/20 p-8 flex items-center gap-6">
             <div className="w-12 h-12 rounded-xl bg-accent-primary flex items-center justify-center shadow-lg shadow-accent-primary/20">
                <ShieldCheck className="w-6 h-6 text-surface-900" />
             </div>
             <div>
                <p className="text-[10px] font-black text-accent-primary uppercase tracking-widest mb-1">Dica de Mestre</p>
                <p className="text-xs text-text-primary/80 font-bold leading-tight">
                  Alunos que geram sua Carteirinha Digital nos primeiros 7 dias têm 40% mais retenção.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  )
}
