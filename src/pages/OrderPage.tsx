import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertTriangle, MessageCircleMore } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { SectionCard } from '@/components/ui/SectionCard'
import { ROUTES } from '@/constants/routes'
import { CakeCatalog } from '@/features/catalog/components/CakeCatalog'
import { CheckoutForm } from '@/features/order/components/CheckoutForm'
import { OrderSummary } from '@/features/order/components/OrderSummary'
import { PotBuilder } from '@/features/order/components/PotBuilder'
import { customerSchema } from '@/features/order/schemas/orderSchema'
import { useOrder } from '@/hooks/useOrder'
import { useWhatsapp } from '@/hooks/useWhatsapp'
import type { CustomerDraft } from '@/types/order'
import { generateOrderId } from '@/utils/generateOrderId'
import { validateOrder } from '@/utils/validateOrder'

export const OrderPage = () => {
  const navigate = useNavigate()
  const { sendOrder } = useWhatsapp()
  const { pots, cakes, customer, updateCustomer, completeOrder, summary } = useOrder()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm<CustomerDraft>({
    resolver: zodResolver(customerSchema),
    defaultValues: customer,
    mode: 'onChange',
  })

  useEffect(() => {
    const subscription = form.watch((value) => {
      updateCustomer(value as Partial<CustomerDraft>)
    })

    return () => subscription.unsubscribe()
  }, [form, updateCustomer])

  const handleConfirmOrder = form.handleSubmit((formData) => {
    setSubmitError(null)

    const order = {
      pots,
      cakes,
      customer: formData,
    }

    const validation = validateOrder(order)

    if (!validation.success) {
      setSubmitError(validation.error.issues[0]?.message ?? 'Revisa los datos del pedido.')
      return
    }

    const orderId = generateOrderId()
    const sent = sendOrder(orderId, validation.data)

    if (!sent) {
      setSubmitError('No pudimos abrir WhatsApp. Intenta nuevamente.')
      return
    }

    completeOrder({
      orderId,
      customerName: validation.data.customer.name,
      total: summary.total,
      orderType: validation.data.customer.orderType,
    })
    navigate(ROUTES.success)
  })

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-6">
        <SectionCard className="space-y-3">
          <p className="text-sm uppercase tracking-[0.35em] text-brand-200">Pedido</p>
          <h2 className="text-3xl font-semibold text-white">Crea tu pedido paso a paso</h2>
          <p className="text-sm text-slate-300">
            Puedes mezclar potes, toppings y tortas en el mismo pedido. El resumen se actualiza en tiempo real.
          </p>
        </SectionCard>

        <PotBuilder />
        <CakeCatalog />
        <CheckoutForm
          register={form.register}
          watch={form.watch}
          errors={form.formState.errors}
        />

        <SectionCard className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-brand-500/20 p-3 text-brand-200">
              <MessageCircleMore className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Confirmacion final</h2>
              <p className="text-sm text-slate-300">
                Al confirmar, abriremos WhatsApp con el pedido ya formateado.
              </p>
            </div>
          </div>

          {submitError ? (
            <div className="flex items-start gap-3 rounded-3xl border border-rose-300/20 bg-rose-500/10 p-4 text-sm text-rose-100">
              <AlertTriangle className="mt-0.5 size-4 shrink-0" />
              <span>{submitError}</span>
            </div>
          ) : null}

          <Button fullWidth className="gap-2" onClick={handleConfirmOrder}>
            <MessageCircleMore className="size-4" />
            Confirmar pedido por WhatsApp
          </Button>
        </SectionCard>
      </div>

      <div>
        <OrderSummary />
      </div>
    </div>
  )
}
