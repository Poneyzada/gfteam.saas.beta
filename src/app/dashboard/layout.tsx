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
         {/* Main Content Area - Responsive padding */}
         <main className="flex-1 overflow-x-hidden overflow-y-auto pb-24 md:pb-8 relative z-30 pointer-events-auto">
            <div className="max-w-[1600px] mx-auto pointer-events-auto">
               {children}
            </div>
         </main>
      </div>

      {/* Mobile Bottom Navigation (Aprimorada Visibilidade) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-surface-800/95 backdrop-blur-2xl border-t border-white/10 px-4 flex items-center justify-between z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.4)]">
        {mobileNav.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center justify-center gap-1 flex-1 h-16 rounded-[1.2rem] transition-all relative ${
                isActive ? 'bg-accent-primary shadow-xl shadow-accent-primary/20 hatched translate-y-[-4px]' : 'text-text-muted hover:text-white'
              }`}
              style={isActive ? { color: '#000000', pointerEvents: 'auto' } : {}}
            >
              <item.icon className={`w-5 h-5 md:w-6 md:h-6 ${isActive ? 'scale-110 !text-black' : ''} transition-all`} style={isActive ? { color: '#000000' } : {}} />
              {isActive && (
                <span className="text-[7px] font-black uppercase tracking-[0.2em] animate-fade-in !text-black" style={{ color: '#000000' }}>{item.label}</span>
              )}
            </Link>
          )
        })}
        
        {/* Menu Toggle Button */}
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="flex flex-col items-center justify-center gap-1 flex-1 h-14 rounded-2xl relative text-text-muted hover:text-white transition-all active:scale-90"
        >
          <Menu className="w-5 h-5 md:w-6 md:h-6" />
          <span className="text-[7px] font-black uppercase tracking-widest mt-1">Menu</span>
        </button>
      </div>
    </div>
  )
}
