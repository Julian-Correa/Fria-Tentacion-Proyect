import { Pencil, ShoppingBag, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { SectionCard } from '@/components/ui/SectionCard'
import { useOrder } from '@/hooks/useOrder'
import { formatCurrency } from '@/utils/formatCurrency'
import { getCakeTotal, getPotTotal } from '@/utils/orderCalculations'

type OrderSummaryProps = {
  onEditPot?: (potId: string) => void
}

export const OrderSummary = ({ onEditPot }: OrderSummaryProps) => {
  const { pots, cakes, removePot, setCakeQuantity, summary } = useOrder()

  return (
    <SectionCard className="space-y-5 lg:sticky lg:top-6">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-brand-500/20 p-3 text-brand-200">
          <ShoppingBag className="size-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Resumen en vivo</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">Revisa tus productos antes de confirmar.</p>
        </div>
      </div>

      {pots.length === 0 && cakes.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-400">
          Aun no agregaste productos.
        </div>
      ) : null}

      {pots.length > 0 ? (
        <div className="space-y-3">
          {pots.map((pot) => (
            <article key={pot.id} className="rounded-3xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/50">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <p className="font-semibold text-slate-900 dark:text-white">{pot.sizeLabel}</p>
                  <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                    {pot.flavors.map((flavor) => (
                      <li key={flavor}>- {flavor}</li>
                    ))}
                  </ul>
                  {pot.toppings.length > 0 ? (
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-brand-500 dark:text-brand-200">Toppings</p>
                      <ul className="mt-1 space-y-1 text-sm text-slate-600 dark:text-slate-300">
                        {pot.toppings.map((topping) => (
                          <li key={topping.id}>- {topping.name}</li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  {pot.note ? <p className="text-sm text-slate-500 dark:text-slate-400">Nota: {pot.note}</p> : null}
                </div>

                <div className="flex flex-col items-end gap-3">
                  <p className="font-semibold text-brand-500 dark:text-brand-100">{formatCurrency(getPotTotal(pot))}</p>
                  <div className="flex items-center gap-1">
                    {onEditPot ? (
                      <Button
                        variant="ghost"
                        className="px-2 py-2 text-slate-500 hover:bg-brand-500/10 hover:text-brand-600 dark:text-slate-300 dark:hover:text-brand-200"
                        onClick={() => onEditPot(pot.id)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                    ) : null}
                    <Button
                      variant="ghost"
                      className="px-2 py-2 text-rose-500 hover:bg-rose-500/10 dark:text-rose-200"
                      onClick={() => removePot(pot.id)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      {cakes.length > 0 ? (
        <div className="space-y-3">
          {cakes.map((cake) => (
            <article
              key={cake.cakeId}
              className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-white p-4 dark:border-white/10 dark:bg-slate-950/50"
            >
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{cake.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Cantidad: {cake.quantity}</p>
              </div>

              <div className="flex items-center gap-3">
                <p className="font-semibold text-brand-500 dark:text-brand-100">{formatCurrency(getCakeTotal(cake))}</p>
                <Button
                  variant="ghost"
                  className="px-2 py-2 text-rose-500 hover:bg-rose-500/10 dark:text-rose-200"
                  onClick={() =>
                    setCakeQuantity(
                      {
                        cakeId: cake.cakeId,
                        name: cake.name,
                        price: cake.price,
                        image: cake.image,
                      },
                      0,
                    )
                  }
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </article>
          ))}
        </div>
      ) : null}

      <div className="rounded-3xl border border-brand-300 bg-brand-50 p-4 dark:border-brand-400/20 dark:bg-brand-500/10">
        <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
          <span>Subtotal</span>
          <span>{formatCurrency(summary.subtotal)}</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-lg font-semibold text-slate-900 dark:text-white">
          <span>Total</span>
          <span>{formatCurrency(summary.total)}</span>
        </div>
      </div>
    </SectionCard>
  )
}
