import { describe, expect, it } from 'vitest'

import { calculateOrderSummary, getPotTotal } from '@/utils/orderCalculations'

describe('order calculations', () => {
  it('calculates pot total including toppings', () => {
    const total = getPotTotal({
      id: 'pot-1',
      sizeId: 'half',
      sizeLabel: '1/2 Kg',
      basePrice: 8200,
      maxFlavors: 4,
      flavors: ['Chocolate', 'Americana'],
      toppings: [
        { id: 'oreo', name: 'Oreo', price: 700 },
        { id: 'almendras', name: 'Almendras', price: 900 },
      ],
      note: '',
    })

    expect(total).toBe(9800)
  })

  it('calculates order subtotal and total', () => {
    const summary = calculateOrderSummary({
      pots: [
        {
          id: 'pot-1',
          sizeId: 'quarter',
          sizeLabel: '1/4 Kg',
          basePrice: 4500,
          maxFlavors: 2,
          flavors: ['Chocolate'],
          toppings: [{ id: 'oreo', name: 'Oreo', price: 700 }],
          note: '',
        },
      ],
      cakes: [
        {
          cakeId: 'cake-1',
          name: 'Cheesecake',
          price: 9800,
          image: '/images/torta-cheesecake.svg',
          quantity: 2,
        },
      ],
    })

    expect(summary.subtotal).toBe(24800)
    expect(summary.total).toBe(24800)
    expect(summary.itemsCount).toBe(3)
  })
})
