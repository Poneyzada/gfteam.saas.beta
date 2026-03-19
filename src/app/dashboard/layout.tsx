'use client'

import { AppProvider } from '@/contexts/AppContext'
import Sidebar from '@/components/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-surface-900 min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col relative w-full overflow-hidden transition-all duration-300">
         <main className="flex-1 overflow-x-hidden overflow-y-auto">
           {children}
         </main>
      </div>
    </div>
  )
}
