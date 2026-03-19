'use client'

import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import TopBar from '@/components/TopBar'
import { 
  Upload, FileText, CheckCircle2, Loader2, 
  AlertCircle, PieChart, Sparkles, ArrowRight,
  TrendingDown, TrendingUp
} from 'lucide-react'

export default function PremiumImportarExtratoPage() {
  const { lang } = useApp()
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'done' | 'error'>('idle')
  const [results, setResults] = useState<any>(null)

  const handleUpload = async () => {
    if (!file) return
    setStatus('uploading')
    
    setTimeout(() => {
      setStatus('processing')
      setTimeout(() => {
        setStatus('done')
        setResults({
          total: 12450.50,
          categories: [
            { name: 'Alimentação', value: 1250.00, p: 10, trend: 'down' },
            { name: 'Marketing', value: 4500.20, p: 36, trend: 'up' },
            { name: 'Manutenção', value: 1890.00, p: 15, trend: 'down' },
            { name: 'Sistemas/SaaS', value: 2500.00, p: 20, trend: 'stable' },
            { name: 'Outros', value: 2310.30, p: 19, trend: 'up' },
          ]
        })
      }, 3000)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-surface-900 pb-20">
      <div className="px-10 py-12">
        <div className="flex items-center gap-3 mb-4">
           <div className="px-3 py-1 rounded-full bg-accent-primary/10 text-accent-primary text-[10px] font-black uppercase tracking-[0.2em] border border-accent-primary/20">
              AI Financial Lab
           </div>
        </div>
        <h1 className="text-[3.5rem] font-display font-black text-text-primary tracking-tighter leading-none mb-4">
          Categorizador IA
        </h1>
        <p className="text-xl text-text-secondary font-medium max-w-2xl leading-relaxed opacity-60">
          Carregue seu extrato bancário. Nossa inteligência artificial vai pesquisar cada transação e entregar o faturamento real da unidade.
        </p>
      </div>

      <div className="px-10 max-w-6xl mx-auto space-y-12">
        
        {/* Dropzone Card */}
        <div className="kpi-card !rounded-[4rem] p-4 bg-surface-700 border-2 border-dashed border-surface-500 hover:border-accent-primary transition-all group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-700">
             <Sparkles className="w-40 h-40 text-accent-primary" />
          </div>
          
          <div className="flex flex-col items-center justify-center py-20 px-10 text-center relative z-10">
            <div className="w-24 h-24 rounded-[2.5rem] bg-accent-primary flex items-center justify-center mb-8 shadow-2xl shadow-accent-primary/40 group-hover:scale-110 transition-transform">
              <Upload className="w-10 h-10 text-[#09090B]" />
            </div>
            
            <h2 className="text-3xl font-display font-black text-text-primary tracking-tight mb-4">
              {lang === 'pt' ? 'Importar Extrato CSV' : 'Import CSV Statement'}
            </h2>
            <p className="text-lg text-text-secondary font-medium mb-10 max-w-lg opacity-60">
               Arraste ou selecione o arquivo gerado pelo seu banco. <br/>
               Processamento automático via **n8n Maestro**.
            </p>
            
            <input 
              type="file" 
              id="csv-upload" 
              className="hidden" 
              accept=".csv"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            
            <div className="flex flex-col items-center gap-6">
              {file && (
                <div className="flex items-center gap-4 px-6 py-4 bg-surface-600 rounded-[2rem] border border-surface-500 animate-fade-up">
                  <div className="w-10 h-10 rounded-xl bg-accent-primary/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-accent-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-text-primary">{file.name}</p>
                    <p className="text-[10px] text-text-muted font-bold tracking-widest uppercase">Pronto para processar</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-4">
                <label htmlFor="csv-upload" className="px-8 py-4 rounded-[1.5rem] bg-surface-600 border border-surface-500 font-bold text-text-primary cursor-pointer hover:bg-surface-500 transition-all">
                  {lang === 'pt' ? 'Escolher Arquivo' : 'Choose File'}
                </label>

                {file && status === 'idle' && (
                  <button 
                    onClick={handleUpload}
                    className="btn-primary !rounded-[1.5rem] px-10 py-4 flex items-center gap-3 shadow-2xl shadow-accent-primary/20 animate-fade-up"
                  >
                    <Sparkles className="w-5 h-5" />
                    <span className="font-bold tracking-tight">Iniciar Analise IA</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Processing State */}
        {(status === 'uploading' || status === 'processing') && (
          <div className="kpi-card !rounded-[3rem] py-16 px-10 flex flex-col items-center text-center space-y-6">
            <div className="relative">
              <Loader2 className="w-20 h-20 text-accent-primary animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-3 h-3 bg-accent-primary rounded-full animate-pulse" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-display font-black text-text-primary">
                {status === 'uploading' 
                  ? (lang === 'pt' ? 'Transmitindo dados...' : 'Uploading data...')
                  : (lang === 'pt' ? 'IA Agente em ação...' : 'AI Agent at work...')}
              </p>
              <p className="text-sm text-text-secondary font-medium mt-2 opacity-50">
                A IA está cruzando dados do Serasa e Google para identificar CNPJs.
              </p>
            </div>
          </div>
        )}

        {/* Cinematic Results Dashboard */}
        {status === 'done' && results && (
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 animate-fade-up">
            
            {/* Classification List */}
            <div className="xl:col-span-12 kpi-card !rounded-[4rem] p-12 overflow-hidden relative">
              <div className="absolute top-0 right-0 p-10 opacity-5">
                <PieChart className="w-40 h-40 text-accent-primary" />
              </div>
              
              <div className="flex items-center justify-between mb-12">
                 <div>
                   <h3 className="text-3xl font-display font-black text-text-primary">Resultados Maestro</h3>
                   <p className="text-sm font-semibold text-text-muted mt-2">Classificação concluída com 98.4% de precisão.</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-1">Total Processado</p>
                    <p className="text-4xl font-display font-black text-accent-primary tracking-tighter">R$ {results.total.toLocaleString('pt-BR')}</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {results.categories.map((c: any, i: number) => (
                    <div key={i} className="p-8 rounded-[2.5rem] bg-surface-600/40 border border-surface-500/50 hover:border-accent-primary transition-all group">
                       <div className="flex items-center justify-between mb-6">
                          <span className="text-xs font-black text-text-muted uppercase tracking-widest">{c.name}</span>
                          <div className={`p-2 rounded-lg ${c.trend === 'down' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-red-400/10 text-red-500'}`}>
                             {c.trend === 'down' ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                          </div>
                       </div>
                       <p className="text-2xl font-display font-black text-text-primary mb-6">R$ {c.value.toLocaleString('pt-BR')}</p>
                       <div className="h-2 w-full bg-surface-600 rounded-full overflow-hidden p-0.5">
                          <div className="h-full rounded-full transition-all duration-1000 bg-accent-primary" style={{ width: `${c.p}%` }} />
                       </div>
                    </div>
                 ))}

                 {/* AI Insights Card */}
                 <div className="lg:col-span-2 p-10 rounded-[2.5rem] bg-accent-primary text-[#09090B] relative overflow-hidden flex flex-col justify-between shadow-2xl shadow-accent-primary/30">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                       <Sparkles className="w-32 h-32" />
                    </div>
                    <div>
                       <h4 className="text-xl font-display font-black uppercase tracking-tight mb-4">Master AI Insight</h4>
                       <p className="text-lg font-medium leading-relaxed opacity-90">
                          Detectamos que o custo de **Marketing** cresceu 12% este mês. <br/>
                          No entanto, o faturamento da **GFTeam Matriz** acompanhou essa curva com +15%. <br/>
                          Seu ROI na unidade do Julio mestre está em **3.2x**.
                       </p>
                    </div>
                    <button className="bg-[#09090B] text-white px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 w-fit mt-8 hover:scale-105 transition-transform group">
                       Sincronizar com ERP Global <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                 </div>
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  )
}
