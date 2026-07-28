import { describe, expect, it } from 'vitest'

import { validateOrder } from '@/utils/validateOrder'

describe('validateOrder', () => {
  it('rejects repeated flavors inside the same pot', () => {
    const result = validateOrder({
      pots: [
        {
          id: 'pot-1',
          sizeId: 'quarter',
          sizeLabel: '1/4 Kg',
          basePrice: 4500,
          maxFlavors: 2,
          flavors: ['Chocolate', 'Chocolate'],
          toppings: [],
          note: '',
        },
      ],
      cakes: [],
      customer: {
        orderType: 'pickup',
        name: 'Julia',
        phone: '',
        street: '',
        number: '',
        crossStreets: '',
        floor: '',
        apartment: '',
        observations: '',
      },
    })

    expect(result.success).toBe(false)
  })

  it('rejects delivery orders without required address data', () => {
    const result = validateOrder({
      pots: [],
      cakes: [
        {
          cakeId: 'cake-1',
          name: 'Cheesecake',
          price: 9800,
          image: '/images/torta-cheesecake.svg',
          quantity: 1,
        },
      ],
      customer: {
        orderType: 'delivery',
        name: 'Julia',
        phone: '',
        street: '',
        number: '',
        crossStreets: '',
        floor: '',
        apartment: '',
        observations: '',
      },
    })

    expect(result.success).toBe(false)
  })
})
