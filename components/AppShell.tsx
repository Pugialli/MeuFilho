'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect, ReactNode } from 'react'
import Link from 'next/link'
import { Baby, ClipboardList, PlusCircle, LogOut } from 'lucide-react'

const NAV_ITEMS = [
  { href: '/', label: 'Bebê', Icon: Baby },
  { href: '/registrar', label: 'Registrar', Icon: PlusCircle },
  { href: '/historico', label: 'Histórico', Icon: ClipboardList },
]

export function AppShell({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login')
    }
  }, [loading, user, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="h-dvh flex flex-col bg-background">
      {/* Top bar */}
      <header className="bg-surface border-b border-border px-6 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
            <Baby size={16} className="text-primary" />
          </div>
          <span className="font-semibold text-text text-sm">
            Olá, {user.name.split(' ')[0]}
          </span>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text transition-colors"
        >
          <LogOut size={16} />
          Sair
        </button>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">{children}</main>

      {/* Bottom navigation */}
      <nav className="shrink-0 bg-surface border-t border-border">
        <div className="flex">
          {NAV_ITEMS.map(({ href, label, Icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                  active ? 'text-primary' : 'text-text-secondary'
                }`}
              >
                <Icon size={22} />
                {label}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
