import type { PropsWithChildren } from 'react'
import { Link } from 'react-router-dom'

import { ThemeToggle } from '@/components/ui/ThemeToggle'
import { ROUTES } from '@/constants/routes'

export const AppShell = ({ children }: PropsWithChildren) => (
  <div className="min-h-screen bg-white bg-aurora text-slate-950 dark:bg-slate-950 dark:text-slate-50">
    <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 pb-10 pt-4 sm:px-6 lg:px-8">
      <header className="mb-8 rounded-[28px] border border-slate-200 bg-white/70 px-4 py-4 backdrop-blur dark:border-white/10 dark:bg-slate-950/70 md:px-6">
        <div className="flex items-center">
          <div className="flex-1" />
          <Link to={ROUTES.order}>
            <p className="font-montserrat text-lg font-extrabold text-slate-900 dark:text-white">Fría Tentación</p>
          </Link>
          <div className="flex flex-1 items-center justify-end gap-2">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="mt-8 border-t border-slate-200 pt-4 text-sm text-slate-500 dark:border-white/10 dark:text-slate-400">
        Fría Tentación. Carrito persistente local y confirmacion final por WhatsApp.
      </footer>
    </div>
  </div>
)
