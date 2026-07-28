import { CheckCircle2, RotateCcw, Store } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { SectionCard } from '@/components/ui/SectionCard'
import { ROUTES } from '@/constants/routes'
import { appConfig } from '@/config/app'
import { useOrder } from '@/hooks/useOrder'
import { formatCurrency } from '@/utils/formatCurrency'

export const SuccessPage = () => {
  const { lastOrder, startNewOrder } = useOrder()

  return (
    <div className="mx-auto max-w-3xl">
      <SectionCard className="space-y-6 text-center">
        <div className="mx-auto inline-flex rounded-full bg-emerald-500/15 p-4 text-emerald-600 dark:text-emerald-200">
          <CheckCircle2 className="size-8" />
        </div>

        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-brand-500 dark:text-brand-200">Pedido creado</p>
          <h2 className="text-3xl font-semibold text-slate-900 dark:text-white">Tu pedido fue preparado para WhatsApp</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">{appConfig.messages.pendingConfirmation}</p>
        </div>

        {lastOrder ? (
          <div className="grid gap-4 rounded-[28px] border border-slate-200 bg-slate-50 p-6 dark:border-white/10 dark:bg-slate-950/50 md:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Pedido</p>
              <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{lastOrder.orderId}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Cliente</p>
              <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{lastOrder.customerName}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Total</p>
              <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">{formatCurrency(lastOrder.total)}</p>
            </div>
          </div>
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-300">
            No encontramos un pedido reciente en memoria. Si ya abriste WhatsApp, el pedido sigue pendiente de confirmacion manual.
          </div>
        )}

        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Link to={ROUTES.home}>
            <Button variant="secondary" className="w-full gap-2 sm:w-auto">
              <Store className="size-4" />
              Volver al inicio
            </Button>
          </Link>

          <Link to={ROUTES.order} onClick={startNewOrder}>
            <Button className="w-full gap-2 sm:w-auto">
              <RotateCcw className="size-4" />
              Iniciar nuevo pedido
            </Button>
          </Link>
        </div>
      </SectionCard>
    </div>
  )
}
