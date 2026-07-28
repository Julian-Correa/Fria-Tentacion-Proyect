import { describe, expect, it } from 'vitest'

import { buildWhatsappMessage } from '@/services/whatsapp'

describe('buildWhatsappMessage', () => {
  it('includes products, toppings and total', () => {
    const message = buildWhatsappMessage({
      orderId: 'ABC123',
      order: {
        pots: [
          {
            id: 'pot-1',
            sizeId: 'half',
            sizeLabel: '1/2 Kg',
            basePrice: 8200,
            maxFlavors: 4,
            flavors: ['Chocolate', 'Americana', 'Frutilla', 'Dulce de Leche'],
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
            quantity: 1,
          },
        ],
        customer: {
          orderType: 'delivery',
          name: 'Juan Perez',
          phone: '11 1234 5678',
          street: 'Calle Falsa',
          number: '123',
          crossStreets: 'A y B',
          floor: '4',
          apartment: 'B',
          observations: 'Tocar timbre una vez',
        },
      },
    })

    expect(message).toContain('Nuevo Pedido')
    expect(message).toContain('ABC123')
    expect(message).toContain('Chocolate')
    expect(message).toContain('Oreo')
    expect(message).toContain('Cheesecake x1')
    expect(message).toContain('Observaciones:')
  })
})
