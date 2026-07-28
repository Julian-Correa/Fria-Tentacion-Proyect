import { useEffect, useRef, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronDown,
  MessageCircleMore,
} from 'lucide-react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/Button'
import { SectionCard } from '@/components/ui/SectionCard'
import { appConfig } from '@/config/app'
import { ROUTES } from '@/constants/routes'
import { CakeCatalog } from '@/features/catalog/components/CakeCatalog'
import { CheckoutForm } from '@/features/order/components/CheckoutForm'
import { OrderSummary } from '@/features/order/components/OrderSummary'
import { customerSchema } from '@/features/order/schemas/orderSchema'
import { useOrder } from '@/hooks/useOrder'
import { useWhatsapp } from '@/hooks/useWhatsapp'
import { catalog } from '@/services/catalog'
import type { CustomerDraft } from '@/types/order'
import { generateOrderId } from '@/utils/generateOrderId'
import { validateOrder } from '@/utils/validateOrder'

const STEPS = [
  { key: 'size', title: 'Elige el tamaño', summary: 'Tamaño', cta: 'Elegir sabores' },
  { key: 'flavors', title: 'Selecciona los sabores', summary: 'Sabores', cta: 'Elegir toppings' },
  { key: 'toppings', title: 'Agrega toppings (opcional)', summary: 'Toppings', cta: 'Agregar pote al pedido' },
  { key: 'cakes', title: 'Suma una torta (opcional)', summary: 'Tortas', cta: 'Continuar' },
  { key: 'delivery', title: 'Retiro o delivery', summary: 'Entrega', cta: 'Completar datos' },
  { key: 'customer', title: 'Tus datos', summary: 'Datos', cta: 'Revisar pedido' },
  { key: 'review', title: 'Revisar y confirmar', summary: 'Confirmar', cta: 'Enviar por WhatsApp' },
] as const

type StepKey = typeof STEPS[number]['key']

type CompletedData = {
  size?: string
  flavors?: string[]
  toppings?: string[]
  hasCakes?: boolean
  orderType?: string
}

export const OrderPage = () => {
  const navigate = useNavigate()
  const { sendOrder } = useWhatsapp()
  const { pots, cakes, customer, addPot, updateCustomer, completeOrder, summary } = useOrder()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [currentStep, setCurrentStep] = useState(0)
  const [completed, setCompleted] = useState<CompletedData>({})

  // Draft pot state
  const [sizeId, setSizeId] = useState('')
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([])
  const [selectedToppings, setSelectedToppings] = useState<string[]>([])
  const [note, setNote] = useState('')
  const [stepError, setStepError] = useState<string | null>(null)

  const stepRefs = useRef<(HTMLDivElement | null)[]>([])

  const form = useForm<CustomerDraft>({
    resolver: zodResolver(customerSchema),
    defaultValues: customer,
    mode: 'onChange',
  })

  const formWatch = form.watch

  useEffect(() => {
    const subscription = formWatch((value) => {
      updateCustomer(value as Partial<CustomerDraft>)
    })
    return () => subscription.unsubscribe()
  }, [formWatch, updateCustomer])

  const selectedSize = catalog.sizes.find((s) => s.id === sizeId)

  const goToStep = (index: number) => {
    setCurrentStep(index)
    setStepError(null)
    setTimeout(() => {
      stepRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 50)
  }

  const completeCurrentStep = (nextStep?: number) => {
    const target = nextStep ?? currentStep + 1
    if (target < STEPS.length) {
      goToStep(target)
    }
  }

  const toggleFlavor = (flavorName: string) => {
    if (!selectedSize) {
      setStepError('Selecciona el tamaño antes de elegir sabores.')
      return
    }
    setStepError(null)
    setSelectedFlavors((prev) => {
      if (prev.includes(flavorName)) return prev.filter((f) => f !== flavorName)
      if (prev.length >= selectedSize.maxFlavors) {
        setStepError(`El tamaño ${selectedSize.label} permite hasta ${selectedSize.maxFlavors} sabores.`)
        return prev
      }
      return [...prev, flavorName]
    })
  }

  const toggleTopping = (toppingId: string) => {
    setStepError(null)
    setSelectedToppings((prev) => {
      if (prev.includes(toppingId)) return prev.filter((t) => t !== toppingId)
      if (prev.length >= catalog.business.rules.maxToppingsPerPot) {
        setStepError(`Puedes elegir hasta ${catalog.business.rules.maxToppingsPerPot} toppings.`)
        return prev
      }
      return [...prev, toppingId]
    })
  }

  const handleAddPot = () => {
    const size = catalog.sizes.find((s) => s.id === sizeId)
    if (!size) {
      setStepError('Selecciona un tamaño válido.')
      return
    }

    const pot = {
      id: crypto.randomUUID(),
      sizeId: size.id,
      sizeLabel: size.label,
      basePrice: size.price,
      maxFlavors: size.maxFlavors,
      flavors: selectedFlavors,
      toppings: catalog.toppings.filter((t) => selectedToppings.includes(t.id)),
      note: note.trim(),
    }

    const validation = validateOrder({
      pots: [pot],
      cakes: [],
      customer: { orderType: 'pickup', name: 'Temp', phone: '', street: '', number: '', crossStreets: '', floor: '', apartment: '', observations: '' },
    })

    if (!validation.success) {
      setStepError(validation.error.issues[0]?.message ?? 'No pudimos agregar el pote.')
      return
    }

    addPot(pot)
    setCompleted((prev) => ({
      ...prev,
      size: size.label,
      flavors: selectedFlavors,
      toppings: selectedToppings.length > 0 ? selectedToppings.map((id) => catalog.toppings.find((t) => t.id === id)?.name ?? id) : undefined,
    }))
    setSizeId('')
    setSelectedFlavors([])
    setSelectedToppings([])
    setNote('')
    setStepError(null)
    completeCurrentStep(3)
  }

  const handleConfirmOrder = form.handleSubmit((formData) => {
    setSubmitError(null)
    const order = { pots, cakes, customer: formData }
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

  const renderStepSection = (index: number) => {
    const step = STEPS[index]
    const isActive = currentStep === index
    const isCompleted = index < currentStep

    if (!isActive && !isCompleted) return null

    const summaryContent = (() => {
      switch (step.key) {
        case 'size':
          return completed.size ? <p className="text-white">{completed.size}</p> : null
        case 'flavors':
          return completed.flavors?.length ? (
            <ul className="text-xs text-slate-300">
              {completed.flavors.map((f) => <li key={f}>{f}</li>)}
            </ul>
          ) : null
        case 'toppings':
          return completed.toppings?.length ? (
            <p className="text-white">{completed.toppings.join(', ')}</p>
          ) : (
            <p className="text-xs text-slate-400">Sin toppings</p>
          )
        case 'cakes':
          return cakes.length > 0 ? (
            <p className="text-white">{cakes.map((c) => `${c.name} x${c.quantity}`).join(', ')}</p>
          ) : (
            <p className="text-xs text-slate-400">Sin tortas</p>
          )
        case 'delivery':
          return <p className="text-white">{customer.orderType === 'pickup' ? 'Retiro en local' : 'Delivery'}</p>
        case 'customer':
          return customer.name ? <p className="text-white">{customer.name}</p> : null
        default:
          return null
      }
    })()

    return (
      <div ref={(el) => { stepRefs.current[index] = el }} key={step.key}>
        {isCompleted ? (
          <button
            type="button"
            className="w-full rounded-[28px] border border-white/10 bg-slate-900/70 p-5 text-left shadow-2xl shadow-slate-950/20 backdrop-blur transition hover:border-brand-400/40 md:p-6"
            onClick={() => goToStep(index)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs text-white">
                  <Check className="size-3.5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-brand-200">{step.summary}</p>
                  {summaryContent}
                </div>
              </div>
              <ChevronDown className="size-4 shrink-0 text-slate-400" />
            </div>
          </button>
        ) : null}

        {isActive ? (
          <SectionCard className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                {index + 1}
              </div>
              <h2 className="text-xl font-semibold text-white">{step.title}</h2>
            </div>

            {step.key === 'size' ? (
              <div className="grid gap-3 sm:grid-cols-3">
                {catalog.sizes.map((size) => (
                  <button
                    key={size.id}
                    type="button"
                    className={`rounded-3xl border p-4 text-left transition ${sizeId === size.id ? 'border-brand-300 bg-brand-400/15' : 'border-white/10 bg-slate-950/50 hover:border-brand-400/40'}`}
                    onClick={() => { setSizeId(size.id); setStepError(null) }}
                  >
                    <p className="text-sm text-slate-300">Tamaño</p>
                    <p className="mt-1 text-lg font-semibold text-white">{size.label}</p>
                    <p className="mt-1 text-sm text-brand-100">$ {size.price.toLocaleString('es-AR')}</p>
                    <p className="mt-3 text-xs text-slate-400">Hasta {size.maxFlavors} sabores</p>
                  </button>
                ))}
              </div>
            ) : null}

            {step.key === 'flavors' ? (
              <div className="space-y-3">
                <p className="text-sm text-slate-400">
                  {selectedSize
                    ? `Seleccionados ${selectedFlavors.length} de ${selectedSize.maxFlavors}`
                    : 'Primero selecciona un tamaño'}
                </p>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-4">
                  {catalog.flavors.map((flavor) => {
                    const isSelected = selectedFlavors.includes(flavor.name)
                    return (
                      <button
                        key={flavor.id}
                        type="button"
                        className={`rounded-2xl border px-3 py-3 text-sm transition ${isSelected ? 'border-brand-300 bg-brand-400/15 text-white' : 'border-white/10 bg-slate-950/40 text-slate-300 hover:border-brand-400/40'}`}
                        onClick={() => toggleFlavor(flavor.name)}
                      >
                        {flavor.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : null}

            {step.key === 'toppings' ? (
              <div className="space-y-3">
                <p className="text-sm text-slate-400">
                  Hasta {catalog.business.rules.maxToppingsPerPot}. Todos tienen costo adicional.
                </p>
                <div className="grid gap-2 md:grid-cols-2">
                  {catalog.toppings.map((topping) => {
                    const isSelected = selectedToppings.includes(topping.id)
                    return (
                      <button
                        key={topping.id}
                        type="button"
                        className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${isSelected ? 'border-brand-300 bg-brand-400/15' : 'border-white/10 bg-slate-950/40 hover:border-brand-400/40'}`}
                        onClick={() => toggleTopping(topping.id)}
                      >
                        <span className="text-sm text-white">{topping.name}</span>
                        <span className="text-sm text-brand-100">+$ {topping.price.toLocaleString('es-AR')}</span>
                      </button>
                    )
                  })}
                </div>
                <label className="flex flex-col gap-2 text-sm text-slate-200">
                  <span>Nota del pote (opcional)</span>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ejemplo: envío con cucharitas."
                    className="min-h-24 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-50 outline-none transition placeholder:text-slate-500 focus:border-brand-400"
                  />
                </label>
              </div>
            ) : null}

            {step.key === 'cakes' ? (
              <CakeCatalog />
            ) : null}

            {step.key === 'delivery' ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="cursor-pointer rounded-3xl border border-white/10 bg-slate-950/50 p-4 text-sm text-slate-200 transition has-[:checked]:border-brand-300 has-[:checked]:bg-brand-400/15">
                  <input
                    type="radio"
                    value="pickup"
                    className="sr-only"
                    checked={customer.orderType === 'pickup'}
                    onChange={() => {
                      updateCustomer({ orderType: 'pickup' })
                      form.setValue('orderType', 'pickup', { shouldValidate: true })
                    }}
                  />
                  <div className="flex items-center gap-3">
                    <div className="size-5 text-brand-200">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    </div>
                    <div>
                      <p className="font-semibold text-white">Retiro en local</p>
                      <p className="text-xs text-slate-400">Preparamos tu pedido y te avisamos por WhatsApp.</p>
                    </div>
                  </div>
                </label>
                <label className="cursor-pointer rounded-3xl border border-white/10 bg-slate-950/50 p-4 text-sm text-slate-200 transition has-[:checked]:border-brand-300 has-[:checked]:bg-brand-400/15">
                  <input
                    type="radio"
                    value="delivery"
                    className="sr-only"
                    checked={customer.orderType === 'delivery'}
                    onChange={() => {
                      updateCustomer({ orderType: 'delivery' })
                      form.setValue('orderType', 'delivery', { shouldValidate: true })
                    }}
                  />
                  <div className="flex items-center gap-3">
                    <div className="size-5 text-brand-200">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                    </div>
                    <div>
                      <p className="font-semibold text-white">Delivery</p>
                      <p className="text-xs text-slate-400">{appConfig.store.deliveryNote}</p>
                    </div>
                  </div>
                </label>
              </div>
            ) : null}

            {step.key === 'customer' ? (
              <CheckoutForm
                register={form.register}
                watch={formWatch}
                errors={form.formState.errors}
              />
            ) : null}

            {step.key === 'review' ? (
              <div className="space-y-4">
                <p className="text-sm text-slate-300">
                  Revisá tu pedido antes de confirmar. Al enviar se abre WhatsApp con el resumen.
                </p>

                {submitError ? (
                  <div className="flex items-start gap-3 rounded-3xl border border-rose-300/20 bg-rose-500/10 p-4 text-sm text-rose-100">
                    <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                ) : null}

                {Object.keys(form.formState.errors).length > 0 ? (
                  <div className="rounded-3xl border border-rose-300/20 bg-rose-500/10 p-4 text-sm text-rose-100">
                    <p className="mb-2 font-semibold">Corregí estos errores antes de confirmar:</p>
                    <ul className="list-inside list-disc space-y-1">
                      {Object.entries(form.formState.errors).map(([key, error]) => (
                        <li key={key}>{error?.message as string}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : null}

            {stepError ? (
              <p className="text-sm text-rose-300">{stepError}</p>
            ) : null}

            {/* CTA dentro del step en desktop, en mobile lo maneja la barra flotante */}
            <div className="hidden md:block">
              {renderCTA(index)}
            </div>
          </SectionCard>
        ) : null}
      </div>
    )
  }

  const canAdvance = (index: number): boolean => {
    const step = STEPS[index]
    switch (step.key) {
      case 'size':
        return sizeId !== ''
      case 'flavors':
        return selectedSize ? selectedFlavors.length > 0 : false
      case 'toppings':
        return true
      case 'cakes':
        return true
      case 'delivery':
        return true
      case 'customer':
        return form.formState.isValid
      case 'review':
        return true
      default:
        return false
    }
  }

  const handleCTAClick = (index: number) => {
    const step = STEPS[index]
    setStepError(null)
    switch (step.key) {
      case 'size':
        if (sizeId) {
          const size = catalog.sizes.find((s) => s.id === sizeId)
          if (size) setCompleted((prev) => ({ ...prev, size: size.label }))
          completeCurrentStep()
        } else setStepError('Seleccioná un tamaño para continuar.')
        break
      case 'flavors':
        if (selectedFlavors.length > 0) {
          setCompleted((prev) => ({ ...prev, flavors: selectedFlavors }))
          completeCurrentStep()
        } else setStepError('Seleccioná al menos un sabor para continuar.')
        break
      case 'toppings':
        handleAddPot()
        break
      case 'cakes':
        setCompleted((prev) => ({ ...prev, hasCakes: cakes.length > 0 }))
        completeCurrentStep()
        break
      case 'delivery':
        setCompleted((prev) => ({ ...prev, orderType: customer.orderType }))
        completeCurrentStep()
        break
      case 'customer':
        form.trigger().then((isValid) => {
          if (isValid) completeCurrentStep()
        })
        break
      case 'review':
        handleConfirmOrder()
        break
    }
  }

  const renderCTA = (index: number) => {
    const step = STEPS[index]
    if (step.key === 'review') {
      return (
        <Button fullWidth className="gap-2" onClick={() => handleCTAClick(index)}>
          <MessageCircleMore className="size-4" />
          {step.cta}
        </Button>
      )
    }
    return (
      <Button
        fullWidth
        className="gap-2"
        disabled={!canAdvance(index)}
        onClick={() => handleCTAClick(index)}
      >
        {step.cta}
        <ArrowRight className="size-4" />
      </Button>
    )
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4 pb-24 md:pb-6">
        {/* Always visible summary section */}
        {pots.length > 0 || cakes.length > 0 ? (
          <div className="flex items-center gap-2 rounded-[28px] border border-brand-400/20 bg-brand-500/10 p-4 text-sm text-brand-100">
            <Check className="size-4" />
            <span>{summary.itemsCount} producto{summary.itemsCount !== 1 ? 's' : ''} en tu pedido</span>
          </div>
        ) : (
          <SectionCard className="space-y-1">
            <p className="text-xs uppercase tracking-[0.35em] text-brand-200">Pedido nuevo</p>
            <h2 className="text-2xl font-semibold text-white">Crea tu pedido paso a paso</h2>
            <p className="text-sm text-slate-300">
              Elegí tamaño, sabores y toppings. Después sumá tortas y completá tus datos.
            </p>
          </SectionCard>
        )}

        {STEPS.map((_, index) => renderStepSection(index))}

        {/* Mobile floating CTA bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-slate-950/95 px-4 pb-3 pt-3 backdrop-blur md:hidden">
          <div className="flex items-center justify-between gap-3">
            {(pots.length > 0 || cakes.length > 0) ? (
              <div className="shrink-0 text-sm">
                <p className="text-xs text-slate-400">Total</p>
                <p className="font-semibold text-white">$ {summary.total.toLocaleString('es-AR')}</p>
              </div>
            ) : (
              <div className="shrink-0 text-sm">
                <p className="text-xs text-brand-200">Fría Tentación</p>
              </div>
            )}
            <div className="flex-1">{renderCTA(currentStep)}</div>
          </div>
        </div>
      </div>

      <div className="hidden xl:block">
        <OrderSummary />
      </div>
    </div>
  )
}
