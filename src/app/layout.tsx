import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GFTeam SaaS — Gestão de Academia',
  description: 'Sistema completo de gestão para academias GFTeam de Jiu-Jitsu em todo o mundo.',
}

import { Providers } from '@/components/Providers'
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const jakarta = Plus_Jakarta_Sans({ subsets: ['latin'], variable: '--font-jakarta' })
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" data-theme="green" className={`${inter.variable} ${jakarta.variable} ${mono.variable}`}>
      <body className="bg-surface-900 text-text-primary antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
