import { useState } from 'react'
import { IceCreamCone, Plus } from 'lucide-react'

import { Button } from '@/components/ui/Button'
import { SectionCard } from '@/components/ui/SectionCard'
import { appConfig } from '@/config/app'
import { useOrder } from '@/hooks/useOrder'
import { catalog } from '@/services/catalog'
import type { PotCartItem } from '@/types/order'
import { formatCurrency } from '@/utils/formatCurrency'
import { validateOrder } from '@/utils/validateOrder'

const createDraftPot = (
  sizeId: string,
  flavors: string[],
  toppingIds: string[],
  note: string,
): PotCartItem | null => {
  const size = catalog.sizes.find((item) => item.id === sizeId)

  if (!size) {
    return null
  }

  const selectedToppings = catalog.toppings.filter((topping) => toppingIds.includes(topping.id))

  return {
    id: crypto.randomUUID(),
    sizeId: size.id,
    sizeLabel: size.label,
    basePrice: size.price,
    maxFlavors: size.maxFlavors,
    flavors,
    toppings: selectedToppings,
    note: note.trim(),
  }
}

export const PotBuilder = () => {
  const { addPot } = useOrder()
  const [sizeId, setSizeId] = useState('')
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([])
  const [selectedToppings, setSelectedToppings] = useState<string[]>([])
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)

  const selectedSize = catalog.sizes.find((size) => size.id === sizeId)

  const toggleFlavor = (flavorName: string) => {
    if (!selectedSize) {
      setError('Selecciona el tamano antes de elegir sabores.')
      return
    }

    setError(null)
    setSelectedFlavors((current) => {
      if (current.includes(flavorName)) {
        return current.filter((item) => item !== flavorName)
      }

      if (current.length >= selectedSize.maxFlavors) {
        setError(`El tamano ${selectedSize.label} permite hasta ${selectedSize.maxFlavors} sabores.`)
        return current
      }

      return [...current, flavorName]
    })
  }

  const toggleTopping = (toppingId: string) => {
    setError(null)
    setSelectedToppings((current) => {
      if (current.includes(toppingId)) {
        return current.filter((item) => item !== toppingId)
      }

      if (current.length >= appConfig.rules.maxToppingsPerPot) {
        setError(`Puedes elegir hasta ${appConfig.rules.maxToppingsPerPot} toppings.`)
        return current
      }

      return [...current, toppingId]
    })
  }

  const handleAddPot = () => {
    const pot = createDraftPot(sizeId, selectedFlavors, selectedToppings, note)

    if (!pot) {
      setError('Selecciona un tamano valido.')
      return
    }

    const validation = validateOrder({
      pots: [pot],
      cakes: [],
      customer: {
        orderType: 'pickup',
        name: 'Temporal',
        phone: '',
        street: '',
        number: '',
        crossStreets: '',
        floor: '',
        apartment: '',
        observations: '',
      },
    })

    if (!validation.success) {
      setError(validation.error.issues[0]?.message ?? 'No pudimos agregar el pote.')
      return
    }

    addPot(pot)
    setSizeId('')
    setSelectedFlavors([])
    setSelectedToppings([])
    setNote('')
    setError(null)
  }

  return (
    <SectionCard className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-brand-500/20 p-3 text-brand-200">
          <IceCreamCone className="size-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-white">Arma tu pote</h2>
          <p className="text-sm text-slate-300">Combina sabores y toppings sin repetir gustos.</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {catalog.sizes.map((size) => (
          <button
            key={size.id}
            type="button"
            className={`rounded-3xl border p-4 text-left transition ${sizeId === size.id ? 'border-brand-300 bg-brand-400/15' : 'border-white/10 bg-slate-950/50 hover:border-brand-400/40'}`}
            onClick={() => {
              setSizeId(size.id)
              setError(null)
            }}
          >
            <p className="text-sm text-slate-300">Tamano</p>
            <p className="mt-1 text-lg font-semibold text-white">{size.label}</p>
            <p className="mt-1 text-sm text-brand-100">{formatCurrency(size.price)}</p>
            <p className="mt-3 text-xs text-slate-400">Hasta {size.maxFlavors} sabores</p>
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-white">Sabores</h3>
            <p className="text-sm text-slate-400">
              {selectedSize
                ? `Seleccionados ${selectedFlavors.length} de ${selectedSize.maxFlavors}`
                : 'Primero selecciona un tamano'}
            </p>
          </div>
        </div>

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

      <div className="space-y-3">
        <div>
          <h3 className="text-base font-semibold text-white">Toppings</h3>
          <p className="text-sm text-slate-400">
            Hasta {appConfig.rules.maxToppingsPerPot}. Todos tienen costo adicional.
          </p>
        </div>

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
                <span className="text-sm text-brand-100">+{formatCurrency(topping.price)}</span>
              </button>
            )
          })}
        </div>
      </div>

      <label className="flex flex-col gap-2 text-sm text-slate-200">
        <span>Nota del pote</span>
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          placeholder="Ejemplo: envio con cucharitas."
          className="min-h-24 rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-50 outline-none transition placeholder:text-slate-500 focus:border-brand-400"
        />
      </label>

      {error ? <p className="text-sm text-rose-300">{error}</p> : null}

      <Button className="gap-2" onClick={handleAddPot}>
        <Plus className="size-4" />
        Agregar pote al pedido
      </Button>
    </SectionCard>
  )
}
