import { useCallback, useEffect, useRef, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronDown,
  MessageCircleMore,
  Pencil,
  Plus,
  Trash2,
  X,
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
import type { CustomerDraft, PotToppingSelection } from '@/types/order'
import { formatCurrency } from '@/utils/formatCurrency'
import { generateOrderId } from '@/utils/generateOrderId'
import { getPotTotal } from '@/utils/orderCalculations'
import { validateOrder } from '@/utils/validateOrder'

type PendingPot = {
  id: string
  sizeId: string
  sizeLabel: string
  basePrice: number
  maxFlavors: number
  selectedFlavors: string[]
  selectedToppings: PotToppingSelection[]
  note: string
}

const STEPS = [
  { key: 'size', title: 'Elige los tamaños', summary: 'Potes', cta: 'Elegir sabores' },
  { key: 'flavors', title: 'Selecciona los sabores', summary: 'Sabores', cta: 'Guardar y continuar' },
  { key: 'toppings', title: 'Agrega toppings (opcional)', summary: 'Toppings', cta: 'Guardar y continuar' },
  { key: 'cakes', title: 'Suma una torta (opcional)', summary: 'Tortas', cta: 'Continuar' },
  { key: 'delivery', title: 'Retiro o delivery', summary: 'Entrega', cta: 'Completar datos' },
  { key: 'customer', title: 'Tus datos', summary: 'Datos', cta: 'Revisar pedido' },
  { key: 'review', title: 'Revisar y confirmar', summary: 'Confirmar', cta: 'Enviar por WhatsApp' },
] as const

type CompletedData = {
  size?: string
  flavors?: boolean
  toppings?: boolean
  hasCakes?: boolean
  orderType?: string
}

export const OrderPage = () => {
  const navigate = useNavigate()
  const { sendOrder } = useWhatsapp()
  const { pots, cakes, customer, addPot, removePot, updatePot, setCakeQuantity, updateCustomer, completeOrder, summary } = useOrder()
  const [submitError, setSubmitError] = useState<string | null>(null)

  const [currentStep, setCurrentStep] = useState(0)
  const [completed, setCompleted] = useState<CompletedData>({})
  const [editingPotId, setEditingPotId] = useState<string | null>(null)
  const returnStepRef = useRef(0)

  // Multi-pot state
  const [pendingPots, setPendingPots] = useState<PendingPot[]>([])
  const [activePotIndex, setActivePotIndex] = useState(0)
  const [sizeId, setSizeId] = useState('')
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([])
  const [selectedToppings, setSelectedToppings] = useState<PotToppingSelection[]>([])
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

  const isEditing = editingPotId !== null

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

  const updatePendingPot = useCallback((index: number, updates: Partial<PendingPot>) => {
    setPendingPots((prev) => prev.map((p, i) => (i === index ? { ...p, ...updates } : p)))
  }, [])

  const loadPotFlavors = useCallback((index: number) => {
    const pot = pendingPots[index]
    if (!pot) return
    setSizeId(pot.sizeId)
    setSelectedFlavors(pot.selectedFlavors)
    setNote(pot.note)
  }, [pendingPots])

  const loadPotToppings = useCallback((index: number) => {
    const pot = pendingPots[index]
    if (!pot) return
    setSelectedToppings(pot.selectedToppings)
    setNote(pot.note)
  }, [pendingPots])

  const handleEditPot = (potId: string) => {
    const pot = pots.find((p) => p.id === potId)
    if (!pot) return

    returnStepRef.current = currentStep
    setEditingPotId(potId)
    setPendingPots([{
      id: pot.id,
      sizeId: pot.sizeId,
      sizeLabel: pot.sizeLabel,
      basePrice: pot.basePrice,
      maxFlavors: pot.maxFlavors,
      selectedFlavors: pot.flavors,
      selectedToppings: pot.toppings,
      note: pot.note,
    }])
    setSizeId(pot.sizeId)
    setActivePotIndex(0)
    setSelectedFlavors(pot.flavors)
    setSelectedToppings(pot.toppings)
    setNote(pot.note)
    setStepError(null)
    goToStep(0)
  }

  const handleCancelEdit = () => {
    setEditingPotId(null)
    setPendingPots([])
    setSizeId('')
    setSelectedFlavors([])
    setSelectedToppings([])
    setNote('')
    setStepError(null)
    goToStep(returnStepRef.current)
  }

  const handleAddPendingPot = () => {
    const size = catalog.sizes.find((s) => s.id === sizeId)
    if (!size) {
      setStepError('Selecciona un tamaño válido.')
      return
    }
    setStepError(null)
    setPendingPots((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        sizeId: size.id,
        sizeLabel: size.label,
        basePrice: size.price,
        maxFlavors: size.maxFlavors,
        selectedFlavors: [],
        selectedToppings: [],
        note: '',
      },
    ])
    setSizeId('')
  }

  const handleRemovePendingPot = (index: number) => {
    setPendingPots((prev) => prev.filter((_, i) => i !== index))
  }

  const toggleFlavor = (flavorName: string) => {
    const pot = pendingPots[activePotIndex]
    if (!pot) return
    const size = catalog.sizes.find((s) => s.id === pot.sizeId)
    if (!size) return

    setStepError(null)
    setSelectedFlavors((prev) => {
      if (prev.includes(flavorName)) return prev.filter((f) => f !== flavorName)
      if (prev.length >= size.maxFlavors) {
        setStepError(`El tamaño ${size.label} permite hasta ${size.maxFlavors} sabores.`)
        return prev
      }
      return [...prev, flavorName]
    })
  }

  const toggleTopping = (toppingId: string) => {
    setStepError(null)
    setSelectedToppings((prev) => {
      if (prev.some((t) => t.id === toppingId)) return prev.filter((t) => t.id !== toppingId)
      if (prev.length >= catalog.business.rules.maxToppingsPerPot) {
        setStepError(`Puedes elegir hasta ${catalog.business.rules.maxToppingsPerPot} toppings.`)
        return prev
      }
      const topping = catalog.toppings.find((t) => t.id === toppingId)
      if (!topping) return prev
      return [...prev, { id: topping.id, name: topping.name, price: topping.price }]
    })
  }

  const handleSaveFlavors = () => {
    const pot = pendingPots[activePotIndex]
    if (!pot) return
    if (selectedFlavors.length === 0) {
      setStepError('Seleccioná al menos un sabor para continuar.')
      return
    }

    updatePendingPot(activePotIndex, { selectedFlavors, note: note.trim() })

    const isLastPot = activePotIndex >= pendingPots.length - 1
    if (isLastPot) {
      setActivePotIndex(0)
      setSelectedToppings(pendingPots[0]?.selectedToppings ?? [])
      setNote(pendingPots[0]?.note ?? '')
      completeCurrentStep()
    } else {
      const nextIndex = activePotIndex + 1
      setActivePotIndex(nextIndex)
      loadPotFlavors(nextIndex)
    }
  }

  const handleSaveToppings = () => {
    const isLastPot = activePotIndex >= pendingPots.length - 1

    if (!isLastPot) {
      updatePendingPot(activePotIndex, { selectedToppings, note: note.trim() })
      const nextIndex = activePotIndex + 1
      setActivePotIndex(nextIndex)
      loadPotToppings(nextIndex)
      return
    }

    // Compute final pot data before any state updates (avoids stale closures)
    const finalPots = pendingPots.map((p, i) =>
      i === activePotIndex
        ? { ...p, selectedToppings, note: note.trim() }
        : p,
    )

    updatePendingPot(activePotIndex, { selectedToppings, note: note.trim() })

    if (isEditing) {
      const updated = finalPots[0]
      updatePot(editingPotId, {
        id: editingPotId,
        sizeId: updated.sizeId,
        sizeLabel: updated.sizeLabel,
        basePrice: updated.basePrice,
        maxFlavors: updated.maxFlavors,
        flavors: updated.selectedFlavors,
        toppings: updated.selectedToppings,
        note: updated.note,
      })
      setEditingPotId(null)
    } else {
      const potsToAdd = finalPots.map((p) => ({
        id: p.id,
        sizeId: p.sizeId,
        sizeLabel: p.sizeLabel,
        basePrice: p.basePrice,
        maxFlavors: p.maxFlavors,
        flavors: p.selectedFlavors,
        toppings: p.selectedToppings,
        note: p.note,
      }))

      const validation = validateOrder({
        pots: potsToAdd,
        cakes: [],
        customer: { orderType: 'pickup' as const, name: 'Temp', phone: '', street: '', number: '', crossStreets: '', floor: '', apartment: '', observations: '' },
      })

      if (!validation.success) {
        setStepError(validation.error.issues[0]?.message ?? 'No pudimos agregar los potes.')
        return
      }

      potsToAdd.forEach((pot) => addPot(pot))
    }

    setPendingPots([])
    setActivePotIndex(0)
    setSizeId('')
    setSelectedFlavors([])
    setSelectedToppings([])
    setNote('')
    setStepError(null)

    setCompleted((prev) => ({
      ...prev,
      size: isEditing ? prev.size : `${finalPots.length} pote${finalPots.length > 1 ? 's' : ''}`,
      flavors: true,
      toppings: true,
    }))

    const next = isEditing ? returnStepRef.current : 3
    completeCurrentStep(next)
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
          return completed.size ? <p className="text-slate-900 dark:text-white">{completed.size}</p> : null
        case 'flavors':
          return completed.flavors ? (
            <p className="text-xs text-slate-600 dark:text-slate-300">Sabores seleccionados</p>
          ) : null
        case 'toppings':
          return completed.toppings ? (
            <p className="text-xs text-slate-600 dark:text-slate-300">Toppings seleccionados</p>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400">Sin toppings</p>
          )
        case 'cakes':
          return cakes.length > 0 ? (
            <p className="text-slate-900 dark:text-white">{cakes.map((c) => `${c.name} x${c.quantity}`).join(', ')}</p>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400">Sin tortas</p>
          )
        case 'delivery':
          return <p className="text-slate-900 dark:text-white">{customer.orderType === 'pickup' ? 'Retiro en local' : 'Delivery'}</p>
        case 'customer':
          return customer.name ? <p className="text-slate-900 dark:text-white">{customer.name}</p> : null
        default:
          return null
      }
    })()

    return (
      <div ref={(el) => { stepRefs.current[index] = el }} key={step.key}>
        {isCompleted ? (
          <button
            type="button"
            className="w-full rounded-[28px] border border-slate-200 bg-white/70 p-5 text-left shadow-md backdrop-blur transition hover:border-brand-400/40 dark:border-white/10 dark:bg-slate-900/70 dark:shadow-2xl dark:shadow-slate-950/20 md:p-6"
            onClick={() => {
              if (pots.length > 0 && !editingPotId && index < 3) {
                const lastPot = pots[pots.length - 1]
                handleEditPot(lastPot.id)
              } else {
                goToStep(index)
              }
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-500 text-xs text-white">
                  <Check className="size-3.5" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-brand-500 dark:text-brand-200">{step.summary}</p>
                  {summaryContent}
                </div>
              </div>
              <ChevronDown className="size-4 shrink-0 text-slate-500 dark:text-slate-400" />
            </div>
          </button>
        ) : null}

        {isActive ? (
          <SectionCard className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-full bg-brand-500 text-sm font-bold text-white">
                {index + 1}
              </div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{step.title}</h2>
            </div>

            {editingPotId && (
              <div className="flex items-center justify-between rounded-3xl border border-amber-300/20 bg-amber-500/10 px-4 py-3">
                <p className="text-sm text-amber-600 dark:text-amber-200">Editando pote existente</p>
                <button
                  type="button"
                  className="flex items-center gap-1.5 text-sm text-slate-600 transition hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                  onClick={handleCancelEdit}
                >
                  <X className="size-4" />
                  Cancelar
                </button>
              </div>
            )}

            {step.key === 'size' && !isEditing ? (
              <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-3">
                  {catalog.sizes.map((size) => (
                    <button
                      key={size.id}
                      type="button"
                      className={`rounded-3xl border p-4 text-left transition ${sizeId === size.id ? 'border-brand-300 bg-brand-400/15' : 'border-slate-200 bg-slate-50 hover:border-brand-400/40 dark:border-white/10 dark:bg-slate-950/50'}`}
                      onClick={() => { setSizeId(size.id); setStepError(null) }}
                    >
                      <p className="text-sm text-slate-600 dark:text-slate-300">Tamaño</p>
                      <p className="mt-1 text-lg font-semibold text-slate-900 dark:text-white">{size.label}</p>
                      <p className="mt-1 text-sm text-brand-500 dark:text-brand-100">$ {size.price.toLocaleString('es-AR')}</p>
                      <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Hasta {size.maxFlavors} sabores</p>
                    </button>
                  ))}
                </div>

                {sizeId ? (
                  <Button variant="secondary" fullWidth className="gap-2" onClick={handleAddPendingPot}>
                    <Plus className="size-4" />
                    Agregar pote de {catalog.sizes.find((s) => s.id === sizeId)?.label}
                  </Button>
                ) : null}

                {pendingPots.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {pendingPots.length} pote{pendingPots.length > 1 ? 's' : ''} agregado{pendingPots.length > 1 ? 's' : ''}:
                    </p>
                    <div className="space-y-2">
                      {pendingPots.map((pot, i) => (
                        <div
                          key={pot.id}
                          className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-slate-950/50"
                        >
                          <span className="text-sm text-slate-900 dark:text-white">
                            Pote {i + 1}: {pot.sizeLabel}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemovePendingPot(i)}
                            className="rounded-full p-1 text-slate-500 transition hover:bg-rose-500/20 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-300"
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-sm text-slate-400 dark:text-slate-500">Agregá al menos un pote para continuar</p>
                )}
              </div>
            ) : null}

            {step.key === 'size' && isEditing ? (
              <div className="rounded-3xl border border-brand-300/20 bg-brand-400/10 p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Editando</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">{pendingPots[0]?.sizeLabel}</p>
                  </div>
                  <Button variant="ghost" className="px-3 py-1.5 text-xs" onClick={() => goToStep(1)}>
                    Cambiar sabores
                  </Button>
                </div>
              </div>
            ) : null}

            {step.key === 'flavors' ? (
              <div className="space-y-3">
                {pendingPots.length > 1 ? (
                  <div className="flex items-center gap-2 text-sm">
                    {pendingPots.map((_, i) => (
                      <span
                        key={i}
                        className={`flex size-7 items-center justify-center rounded-full text-xs font-semibold transition ${i === activePotIndex ? 'bg-brand-500 text-white' : i < activePotIndex ? 'bg-brand-400/20 text-brand-500 dark:text-brand-200' : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-500'}`}
                      >
                        {i + 1}
                      </span>
                    ))}
                    <span className="ml-1 text-slate-500 dark:text-slate-400">
                      Pote {activePotIndex + 1} de {pendingPots.length}
                    </span>
                  </div>
                ) : null}

                {pendingPots[activePotIndex] ? (
                  <>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {(() => {
                        const pot = pendingPots[activePotIndex]
                        const size = catalog.sizes.find((s) => s.id === pot.sizeId)
                        if (!size) return ''
                        return `${pot.sizeLabel} — Seleccionados ${selectedFlavors.length} de ${size.maxFlavors}`
                      })()}
                    </p>
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-4">
                      {catalog.flavors.map((flavor) => {
                        const isSelected = selectedFlavors.includes(flavor.name)
                        return (
                          <button
                            key={flavor.id}
                            type="button"
                            className={`rounded-2xl border px-3 py-3 text-sm transition ${isSelected ? 'border-brand-300 bg-brand-400/15 text-white' : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-brand-400/40 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-300'}`}
                            onClick={() => toggleFlavor(flavor.name)}
                          >
                            {flavor.name}
                          </button>
                        )
                      })}
                    </div>
                    <label className="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-200">
                      <span>Nota del pote (opcional)</span>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Ejemplo: envío con cucharitas."
                        className="min-h-24 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-400 dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-50 dark:placeholder:text-slate-500"
                      />
                    </label>
                  </>
                ) : null}
              </div>
            ) : null}

            {step.key === 'toppings' ? (
              <div className="space-y-3">
                {pendingPots.length > 1 ? (
                  <div className="flex items-center gap-2 text-sm">
                    {pendingPots.map((_, i) => (
                      <span
                        key={i}
                        className={`flex size-7 items-center justify-center rounded-full text-xs font-semibold transition ${i === activePotIndex ? 'bg-brand-500 text-white' : i < activePotIndex ? 'bg-brand-400/20 text-brand-500 dark:text-brand-200' : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-500'}`}
                      >
                        {i + 1}
                      </span>
                    ))}
                    <span className="ml-1 text-slate-500 dark:text-slate-400">
                      Pote {activePotIndex + 1} de {pendingPots.length}
                    </span>
                  </div>
                ) : null}

                {pendingPots[activePotIndex] ? (
                  <>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Hasta {catalog.business.rules.maxToppingsPerPot}. Todos tienen costo adicional.
                    </p>
                    <div className="grid gap-2 md:grid-cols-2">
                      {catalog.toppings.map((topping) => {
                        const isSelected = selectedToppings.some((t) => t.id === topping.id)
                        return (
                          <button
                            key={topping.id}
                            type="button"
                            className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${isSelected ? 'border-brand-300 bg-brand-400/15' : 'border-slate-200 bg-slate-50 hover:border-brand-400/40 dark:border-white/10 dark:bg-slate-950/40'}`}
                            onClick={() => toggleTopping(topping.id)}
                          >
                            <span className="text-sm text-slate-900 dark:text-white">{topping.name}</span>
                            <span className="text-sm text-brand-500 dark:text-brand-100">+$ {topping.price.toLocaleString('es-AR')}</span>
                          </button>
                        )
                      })}
                    </div>
                    <label className="flex flex-col gap-2 text-sm text-slate-700 dark:text-slate-200">
                      <span>Nota del pote (opcional)</span>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Ejemplo: envío con cucharitas."
                        className="min-h-24 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-brand-400 dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-50 dark:placeholder:text-slate-500"
                      />
                    </label>
                  </>
                ) : null}
              </div>
            ) : null}

            {step.key === 'cakes' ? (
              <CakeCatalog />
            ) : null}

            {step.key === 'delivery' ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="cursor-pointer rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 transition has-[:checked]:border-brand-300 has-[:checked]:bg-brand-400/15 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-200">
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
                    <div className="size-5 text-brand-500 dark:text-brand-200">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Retiro en local</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Preparamos tu pedido y te avisamos por WhatsApp.</p>
                    </div>
                  </div>
                </label>
                <label className="cursor-pointer rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700 transition has-[:checked]:border-brand-300 has-[:checked]:bg-brand-400/15 dark:border-white/10 dark:bg-slate-950/50 dark:text-slate-200">
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
                    <div className="size-5 text-brand-500 dark:text-brand-200">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">Delivery</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{appConfig.store.deliveryNote}</p>
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
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Revisá tu pedido antes de confirmar. Al enviar se abre WhatsApp con el resumen.
                </p>

                {pots.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Potes</p>
                    {pots.map((pot) => (
                      <article key={pot.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/50">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-2">
                            <p className="font-semibold text-slate-900 dark:text-white">{pot.sizeLabel}</p>
                            <ul className="space-y-1 text-sm text-slate-600 dark:text-slate-300">
                              {pot.flavors.map((flavor) => (
                                <li key={flavor}>- {flavor}</li>
                              ))}
                            </ul>
                            {pot.toppings.length > 0 ? (
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                Toppings: {pot.toppings.map((t) => t.name).join(', ')}
                              </p>
                            ) : null}
                            {pot.note ? <p className="text-sm text-slate-400 dark:text-slate-500">Nota: {pot.note}</p> : null}
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <p className="whitespace-nowrap font-semibold text-brand-500 dark:text-brand-100">$ {getPotTotal(pot).toLocaleString('es-AR')}</p>
                            <button
                              type="button"
                              className="flex items-center gap-1.5 rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600 transition hover:border-brand-400/40 hover:text-brand-500 dark:border-white/10 dark:text-slate-300 dark:hover:text-brand-200"
                              onClick={() => handleEditPot(pot.id)}
                            >
                              <Pencil className="size-3" />
                              Editar
                            </button>
                            <button
                              type="button"
                              className="flex items-center gap-1.5 rounded-full border border-rose-200 px-3 py-1.5 text-xs text-rose-600 transition hover:border-rose-400/40 hover:text-rose-500 dark:border-rose-300/20 dark:text-rose-300 dark:hover:text-rose-200"
                              onClick={() => removePot(pot.id)}
                            >
                              <Trash2 className="size-3" />
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                ) : null}

                {cakes.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Tortas</p>
                    {cakes.map((cake) => (
                      <article
                        key={cake.cakeId}
                        className="flex items-center justify-between gap-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-white/10 dark:bg-slate-950/50"
                      >
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{cake.name}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {cake.quantity} x {formatCurrency(cake.price)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="secondary"
                              className="h-8 w-8 rounded-full px-0 py-0 text-sm"
                              aria-label={`Restar ${cake.name}`}
                              onClick={() =>
                                setCakeQuantity(
                                  { cakeId: cake.cakeId, name: cake.name, price: cake.price, image: cake.image },
                                  cake.quantity - 1,
                                )
                              }
                            >
                              -
                            </Button>
                            <span className="min-w-6 text-center text-sm text-slate-900 dark:text-white">{cake.quantity}</span>
                            <Button
                              variant="secondary"
                              className="h-8 w-8 rounded-full px-0 py-0 text-sm"
                              aria-label={`Sumar ${cake.name}`}
                              onClick={() =>
                                setCakeQuantity(
                                  { cakeId: cake.cakeId, name: cake.name, price: cake.price, image: cake.image },
                                  cake.quantity + 1,
                                )
                              }
                            >
                              +
                            </Button>
                          </div>
                          <p className="whitespace-nowrap font-semibold text-brand-500 dark:text-brand-100">
                            {formatCurrency(cake.price * cake.quantity)}
                          </p>
                          <Button
                            variant="ghost"
                            className="px-2 py-2 text-rose-500 hover:bg-rose-500/10 dark:text-rose-300"
                            onClick={() =>
                              setCakeQuantity(
                                { cakeId: cake.cakeId, name: cake.name, price: cake.price, image: cake.image },
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

                {submitError ? (
                  <div className="flex items-start gap-3 rounded-3xl border border-rose-300/20 bg-rose-500/10 p-4 text-sm text-rose-700 dark:text-rose-100">
                    <AlertTriangle className="mt-0.5 size-4 shrink-0" />
                    <span>{submitError}</span>
                  </div>
                ) : null}

                {Object.keys(form.formState.errors).length > 0 ? (
                  <div className="rounded-3xl border border-rose-300/20 bg-rose-500/10 p-4 text-sm text-rose-700 dark:text-rose-100">
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
              <p className="text-sm text-rose-600 dark:text-rose-300">{stepError}</p>
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
        return !isEditing && pendingPots.length > 0
      case 'flavors':
        return selectedFlavors.length > 0
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

  const getFlavorsCTA = () => {
    const isLastPot = activePotIndex >= pendingPots.length - 1
    return isLastPot ? 'Continuar a toppings' : 'Guardar y siguiente'
  }

  const getToppingsCTA = () => {
    if (isEditing) return 'Guardar cambios'
    const isLastPot = activePotIndex >= pendingPots.length - 1
    return isLastPot ? 'Agregar al pedido' : 'Guardar y siguiente'
  }

  const handleCTAClick = (index: number) => {
    const step = STEPS[index]
    setStepError(null)
    switch (step.key) {
      case 'size':
        if (pendingPots.length > 0) {
          setActivePotIndex(0)
          loadPotFlavors(0)
          setCompleted((prev) => ({
            ...prev,
            size: `${pendingPots.length} pote${pendingPots.length > 1 ? 's' : ''}`,
          }))
          completeCurrentStep()
        } else setStepError('Agregá al menos un pote para continuar.')
        break
      case 'flavors':
        handleSaveFlavors()
        break
      case 'toppings':
        handleSaveToppings()
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
    let ctaText: string = step.cta
    if (step.key === 'flavors') ctaText = getFlavorsCTA()
    else if (step.key === 'toppings') ctaText = getToppingsCTA()
    return (
      <Button
        fullWidth
        className="gap-2"
        disabled={!canAdvance(index)}
        onClick={() => handleCTAClick(index)}
      >
        {ctaText}
        <ArrowRight className="size-4" />
      </Button>
    )
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
      <div className="space-y-4 pb-24 md:pb-6">
        {/* Always visible summary section */}
        {pots.length > 0 || cakes.length > 0 ? (
          <div className="flex items-center gap-2 rounded-[28px] border border-brand-300 bg-brand-50 p-4 text-sm text-brand-600 dark:border-brand-400/20 dark:bg-brand-500/10 dark:text-brand-100">
            <Check className="size-4" />
            <span>{summary.itemsCount} producto{summary.itemsCount !== 1 ? 's' : ''} en tu pedido</span>
          </div>
        ) : (
          <SectionCard className="space-y-1">
            <p className="text-xs uppercase tracking-[0.35em] text-brand-500 dark:text-brand-200">Pedido nuevo</p>
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Crea tu pedido paso a paso</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Elegí tamaño, sabores y toppings. Después sumá tortas y completá tus datos.
            </p>
          </SectionCard>
        )}

        {STEPS.map((_, index) => renderStepSection(index))}

        {/* Mobile floating CTA bar */}
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 px-4 pb-3 pt-3 backdrop-blur dark:border-white/10 dark:bg-slate-950/95 md:hidden">
          <div className="flex items-center justify-between gap-3">
            {(pots.length > 0 || cakes.length > 0) ? (
              <div className="shrink-0 text-sm">
                <p className="text-xs text-slate-500 dark:text-slate-400">Total</p>
                <p className="font-semibold text-slate-900 dark:text-white">$ {summary.total.toLocaleString('es-AR')}</p>
              </div>
            ) : (
              <div className="shrink-0 text-sm">
                <p className="text-xs text-brand-500 dark:text-brand-200">Fría Tentación</p>
              </div>
            )}
            <div className="flex-1">{renderCTA(currentStep)}</div>
          </div>
        </div>
      </div>

      <div className="hidden xl:block">
        <OrderSummary onEditPot={handleEditPot} />
      </div>
    </div>
  )
}
