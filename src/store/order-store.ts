import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { appConfig } from '@/config/app'
import type { CakeCartItem, CustomerDraft, LastOrder, PotCartItem } from '@/types/order'

const initialCustomer: CustomerDraft = {
  orderType: 'pickup',
  name: '',
  phone: '',
  street: '',
  number: '',
  crossStreets: '',
  floor: '',
  apartment: '',
  observations: '',
}

type OrderStore = {
  pots: PotCartItem[]
  cakes: CakeCartItem[]
  customer: CustomerDraft
  lastOrder: LastOrder | null
  addPot: (pot: PotCartItem) => void
  removePot: (potId: string) => void
  updatePot: (potId: string, pot: PotCartItem) => void
  setCakeQuantity: (cake: Omit<CakeCartItem, 'quantity'>, quantity: number) => void
  updateCustomer: (customer: Partial<CustomerDraft>) => void
  completeOrder: (lastOrder: LastOrder) => void
  startNewOrder: () => void
  clearLastOrder: () => void
}

export const useOrderStore = create<OrderStore>()(
  persist(
    (set) => ({
      pots: [],
      cakes: [],
      customer: initialCustomer,
      lastOrder: null,
      addPot: (pot) =>
        set((state) => ({
          pots: [...state.pots, pot],
        })),
      removePot: (potId) =>
        set((state) => ({
          pots: state.pots.filter((pot) => pot.id !== potId),
        })),
      updatePot: (potId, updatedPot) =>
        set((state) => ({
          pots: state.pots.map((pot) => (pot.id === potId ? updatedPot : pot)),
        })),
      setCakeQuantity: (cake, quantity) =>
        set((state) => {
          const existingCake = state.cakes.find((item) => item.cakeId === cake.cakeId)

          if (quantity <= 0) {
            return {
              cakes: state.cakes.filter((item) => item.cakeId !== cake.cakeId),
            }
          }

          if (existingCake) {
            return {
              cakes: state.cakes.map((item) =>
                item.cakeId === cake.cakeId ? { ...item, quantity } : item,
              ),
            }
          }

          return {
            cakes: [...state.cakes, { ...cake, quantity }],
          }
        }),
      updateCustomer: (customer) =>
        set((state) => ({
          customer: { ...state.customer, ...customer },
        })),
      completeOrder: (lastOrder) =>
        set(() => ({
          pots: [],
          cakes: [],
          customer: initialCustomer,
          lastOrder,
        })),
      startNewOrder: () =>
        set(() => ({
          pots: [],
          cakes: [],
          customer: initialCustomer,
          lastOrder: null,
        })),
      clearLastOrder: () =>
        set((state) => ({
          lastOrder: state.lastOrder ? null : state.lastOrder,
        })),
    }),
    {
      name: appConfig.storageKeys.order,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        pots: state.pots,
        cakes: state.cakes,
        customer: state.customer,
      }),
    },
  ),
)
