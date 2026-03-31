'use client'

import { useApp } from '@/contexts/AppContext'
import TopBar from '@/components/TopBar'
import { BookOpen, Play, Star, Search, Plus } from 'lucide-react'
import Image from 'next/image'

const tecnicas = [
  { nome: 'Triângulo da Guarda Fechada', cat: 'Finalização', nivel: 'Intermediário', youtube: 'dQw4w9WgXcQ', views: 48 },
  { nome: 'Passagem Toreando', cat: 'Passagem de Guarda', nivel: 'Iniciante', youtube: 'dQw4w9WgXcQ', views: 62 },
  { nome: 'Raspagem de Tesoura', cat: 'Raspagem', nivel: 'Iniciante', youtube: 'dQw4w9WgXcQ', views: 34 },
  { nome: 'Estrangulamento Rear Naked', cat: 'Finalização', nivel: 'Iniciante', youtube: 'dQw4w9WgXcQ', views: 89 },
  { nome: 'Armlock da Montada', cat: 'Finalização', nivel: 'Intermediário', youtube: 'dQw4w9WgXcQ', views: 55 },
  { nome: 'Berimbolo', cat: 'Raspagem', nivel: 'Avançado', youtube: 'dQw4w9WgXcQ', views: 71 },
]

const nivelColor: Record<string, string> = {
  'Iniciante': '#10B981', 'Intermediário': '#F5C500', 'Avançado': '#EF4444',
}

export default function TecnicasPage() {
  const { lang } = useApp()

  return (
    <div className="min-h-screen bg-surface-900">
      <TopBar title={lang === 'pt' ? 'Biblioteca de Técnicas' : 'Technique Library'} />
      <div className="p-6 space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-surface-700 border border-surface-500 rounded-xl px-3 py-2 flex-1 max-w-sm">
            <Search className="w-4 h-4 text-text-muted" />
            <input type="text" placeholder={lang === 'pt' ? 'Buscar técnica...' : 'Search technique...'} className="bg-transparent text-sm text-text-secondary placeholder:text-text-muted outline-none w-full" />
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" /> {lang === 'pt' ? 'Nova Técnica' : 'New Technique'}
          </button>
        </div>

        {/* Quick Position Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
           {['Todas', 'Guarda', 'Passagem', 'Montada', 'Costas', 'Quedas', 'Finalização'].map((pos, i) => (
             <button 
               key={pos}
               className={`whitespace-nowrap px-6 py-2 rounded-[1rem] text-[10px] font-black uppercase tracking-widest transition-all border ${
                 i === 0 
                  ? 'bg-accent-primary text-surface-900 border-accent-primary shadow-lg shadow-accent-primary/20' 
                  : 'bg-surface-700 text-text-muted border-white/5 hover:border-accent-primary/30 hover:text-text-primary'
               }`}
             >
               {pos}
             </button>
           ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {tecnicas.map((t, i) => (
            <div key={i} className="kpi-card group hover:border-surface-400 cursor-pointer">
              <div className="aspect-video bg-surface-600 rounded-xl mb-4 relative overflow-hidden flex items-center justify-center">
                <Image 
                  src={`https://img.youtube.com/vi/${t.youtube}/maxresdefault.jpg`} 
                  alt={t.nome} 
                  fill
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" 
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full accent-bg flex items-center justify-center accent-shadow group-hover:scale-110 transition-transform">
                    <Play className="w-5 h-5 text-surface-900 ml-0.5" />
                  </div>
                </div>
              </div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-semibold text-text-primary text-sm">{t.nome}</p>
                  <p className="text-xs text-text-muted mt-1">{t.cat}</p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{ backgroundColor: `${nivelColor[t.nivel]}18`, color: nivelColor[t.nivel] }}>
                  {t.nivel}
                </span>
              </div>
              <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-surface-500">
                <Play className="w-3.5 h-3.5 text-text-muted" />
                <span className="text-xs text-text-muted">{t.views} visualizações</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
