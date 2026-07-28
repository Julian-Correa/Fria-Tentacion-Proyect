import { CakeSlice } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { SectionCard } from '@/components/ui/SectionCard'
import { useOrder } from '@/hooks/useOrder'
import { catalog } from '@/services/catalog'
import { formatCurrency } from '@/utils/formatCurrency'

export const CakeCatalog = () => {
  const { cakes, setCakeQuantity } = useOrder()

  return (
    <SectionCard className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-brand-500/20 p-3 text-brand-200">
          <CakeSlice className="size-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Suma una torta</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">Cantidad editable y precios configurados desde JSON.</p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {catalog.cakes.map((cake) => {
          const quantity = cakes.find((item) => item.cakeId === cake.id)?.quantity ?? 0

          return (
            <article
              key={cake.id}
              className="overflow-hidden rounded-[24px] border border-slate-200 bg-white dark:border-white/10 dark:bg-slate-950/50"
            >
              <img src={cake.image} alt={cake.name} className="h-44 w-full object-cover" />

              <div className="space-y-4 p-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{cake.name}</h3>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{cake.description}</p>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-brand-100">{formatCurrency(cake.price)}</p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      className="h-10 w-10 rounded-full px-0 py-0"
                      aria-label={`Restar ${cake.name}`}
                      onClick={() =>
                        setCakeQuantity(
                          { cakeId: cake.id, name: cake.name, price: cake.price, image: cake.image },
                          quantity - 1,
                        )
                      }
                    >
                      -
                    </Button>
                    <span className="min-w-8 text-center text-sm text-slate-900 dark:text-white">{quantity}</span>
                    <Button
                      variant="secondary"
                      className="h-10 w-10 rounded-full px-0 py-0"
                      aria-label={`Sumar ${cake.name}`}
                      onClick={() =>
                        setCakeQuantity(
                          { cakeId: cake.id, name: cake.name, price: cake.price, image: cake.image },
                          quantity + 1,
                        )
                      }
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </SectionCard>
  )
}
