'use client'

import { useState } from 'react'
import { AppProvider } from '@/contexts/AppContext'
import Sidebar from '@/components/Sidebar'
import { LayoutDashboard, Users, CheckSquare, Dumbbell, Menu } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  
  const mobileNav = [
    { href: '/dashboard', icon: LayoutDashboard, label: 'Resumo' },
    { href: '/dashboard/checkin', icon: CheckSquare, label: 'Check-in' },
    { href: '/dashboard/treinos', icon: Dumbbell, label: 'Treinos' },
    { href: '/dashboard/alunos', icon: Users, label: 'Alunos' },
  ]

  return (
    <div className="flex bg-surface-900 min-h-screen">
      {/* Desktop Sidebar OR Full Screen Mobile Drawer */}
      <div className={`${isMobileOpen ? 'block' : 'hidden md:block'}`}>
        <Sidebar mobileOpen={isMobileOpen} onMobileClose={() => setIsMobileOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col relative w-full overflow-hidden transition-all duration-300">
         {/* Main Content Area */}
         <main className="flex-1 overflow-x-hidden overflow-y-auto pb-24 md:pb-8">
           {children}
         </main>
      </div>

      {/* Mobile Bottom Navigation (Visible only on Mobile) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-surface-800/90 backdrop-blur-xl border-t border-white/5 px-4 flex items-center justify-between z-50">
        {mobileNav.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-14 rounded-2xl relative ${
                isActive ? 'text-surface-900 bg-accent-primary hatched shadow-lg shadow-accent-primary/20' : 'text-text-muted hover:text-white transition-colors'
              }`}
            >
              <item.icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''} transition-transform`} />
              {isActive && (
                <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
              )}
            </Link>
          )
        })}
        {/* Menu Toggle Button */}
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="flex flex-col items-center justify-center gap-1 flex-1 h-14 rounded-2xl relative text-text-muted hover:text-white transition-colors"
        >
          <Menu className="w-6 h-6 transition-transform hover:scale-110" />
          <span className="text-[8px] font-black uppercase tracking-widest mt-1">Menu</span>
        </button>
      </div>
    </div>
  )
}
