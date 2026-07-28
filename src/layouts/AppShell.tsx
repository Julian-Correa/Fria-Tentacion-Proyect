import type { PropsWithChildren } from 'react'
import { Link } from 'react-router-dom'

import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { ROUTES } from '@/constants/routes'

export const AppShell = ({ children }: PropsWithChildren) => (
  <div className="min-h-screen bg-slate-950 bg-aurora text-slate-50">
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-10 pt-4 sm:px-6 lg:px-8">
      <header className="mb-8 rounded-[28px] border border-white/10 bg-slate-950/70 px-4 py-4 backdrop-blur md:px-6">
        <div className="flex items-center justify-between gap-4">
          <Link to={ROUTES.order} className="space-y-1">
            <p className="text-xs uppercase tracking-[0.35em] text-brand-200">Fria Tentacion</p>
            <h1 className="text-lg font-semibold text-white">Pedidos premium por WhatsApp</h1>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-8 border-t border-white/10 pt-4 text-sm text-slate-400">
        Fria Tentacion. Carrito persistente local y confirmacion final por WhatsApp.
      </footer>
    </div>
  </div>
)
