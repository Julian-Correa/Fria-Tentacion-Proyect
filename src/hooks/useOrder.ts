import { useOrderStore } from '@/store/order-store'
import { calculateOrderSummary } from '@/utils/orderCalculations'

export const useOrder = () => {
  const pots = useOrderStore((state) => state.pots)
  const cakes = useOrderStore((state) => state.cakes)
  const customer = useOrderStore((state) => state.customer)
  const lastOrder = useOrderStore((state) => state.lastOrder)
  const addPot = useOrderStore((state) => state.addPot)
  const removePot = useOrderStore((state) => state.removePot)
  const setCakeQuantity = useOrderStore((state) => state.setCakeQuantity)
  const updateCustomer = useOrderStore((state) => state.updateCustomer)
  const completeOrder = useOrderStore((state) => state.completeOrder)
  const startNewOrder = useOrderStore((state) => state.startNewOrder)
  const clearLastOrder = useOrderStore((state) => state.clearLastOrder)

  return {
    pots,
    cakes,
    customer,
    lastOrder,
    addPot,
    removePot,
    setCakeQuantity,
    updateCustomer,
    completeOrder,
    startNewOrder,
    clearLastOrder,
    summary: calculateOrderSummary({ pots, cakes }),
  }
}
