'use client'

import { AppProvider } from '@/contexts/AppContext'
import Sidebar from '@/components/Sidebar'

export default function MasterLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <div className="flex h-screen overflow-hidden bg-surface-900">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </AppProvider>
  )
}
